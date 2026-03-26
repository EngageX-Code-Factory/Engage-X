"use client";

import { useState, useEffect } from "react";
import { Bell, Send, Clock, Users, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type NotifType = "info" | "urgent";
type NotifTarget = "members" | "registered" | "all";
interface Notification {
  id: string; 
  message: string; 
  type: NotifType;
  target: NotifTarget; 
  event_title?: string; 
  sent_at: string;
}

const TARGET_LABELS: Record<NotifTarget, string> = {
  members: "All Members", 
  registered: "Event Registrants", 
  all: "Everyone",
};

const TYPE_STYLES: Record<NotifType, string> = {
  info: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  urgent: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const selectClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";

export default function Notifications() {
  const [sent, setSent] = useState<Notification[]>([]);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [clubId, setClubId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ message: "", type: "info" as NotifType, target: "members" as NotifTarget, event_id: "" });

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get the Club ID for the logged-in leader
      const { data: leader } = await supabase
        .from('my_clubs')
        .select('club_id')
        .eq('user_id', user.id)
        .eq('status', 'LEADER')
        .single();
        
      if (!leader) {
        setIsLoading(false);
        return;
      }
      
      setClubId(leader.club_id);

      // 2. Fetch Events for the dropdown
      const { data: evs } = await supabase
        .from('events')
        .select('id, title')
        .eq('club_id', leader.club_id);
      
      if (evs) setEvents(evs);

      // 3. Fetch past notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('club_id', leader.club_id)
        .order('sent_at', { ascending: false });
        
      if (notifs) setSent(notifs);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim() || !clubId) return;
    
    setLoading(true);
    
    const event = events.find(ev => ev.id === form.event_id);
    
    // Prepare the payload based on the updated schema
    const newNotif = {
      club_id: clubId,
      message: form.message,
      type: form.type,
      target: form.target,
      event_id: form.event_id || null,
      event_title: event?.title || null,
      sent_at: new Date().toISOString()
    };

    // Insert into Supabase and catch any errors
    const { data, error } = await supabase
      .from('notifications')
      .insert(newNotif)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      alert(`Database Error: ${error.message}\n\nDid you run the SQL script to update the notifications table?`);
    } else if (data) {
      setSent(prev => [data, ...prev]);
      setForm({ message: "", type: "info", target: "members", event_id: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    
    setLoading(false);
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#8b5cf6] h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Send alerts and updates to your members or event registrants.</p>
      </div>

      {/* Compose Form */}
      <form onSubmit={handleSend} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4 flex items-center gap-2">
          <Send size={16} className="text-[#8b5cf6]" /> Send Notification
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlertTriangle size={14} className="text-gray-400" /> Type
            </label>
            <select name="type" value={form.type} onChange={handleChange} className={selectClass}>
              <option value="info">Academic</option>
              <option value="urgent">Emergency</option>
              <option value="urgent">Club</option>

            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Users size={14} className="text-gray-400" /> Send To
            </label>
            <select name="target" value={form.target} onChange={handleChange} className={selectClass}>
              <option value="members">All Club Members</option>
              <option value="registered">Event Registrants</option>
              <option value="all">Everyone</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" /> Link to Event <span className="text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <select name="event_id" value={form.event_id} onChange={handleChange} className={selectClass}>
            <option value="">No specific event</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Bell size={14} className="text-gray-400" /> Message
          </label>
          <textarea 
            name="message" 
            value={form.message} 
            onChange={handleChange}
            placeholder="Write your notification message here..." 
            rows={4} 
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition resize-none" 
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {success ? (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg">
              ✓ Notification sent
            </span>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Sending to: <span className="font-medium text-gray-700 dark:text-gray-200">{TARGET_LABELS[form.target]}</span>
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading || !form.message.trim()}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Send size={15} /> {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      {/* History */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">Sent Notifications</h3>
          <span className="text-xs text-gray-400">{sent.length} total</span>
        </div>
        
        {sent.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications sent yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {sent.map(n => (
              <div key={n.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${n.type === "urgent" ? "bg-red-50 dark:bg-red-500/10" : "bg-blue-50 dark:bg-blue-500/10"}`}>
                      {n.type === "urgent" ? <AlertTriangle size={14} className="text-red-600 dark:text-red-400" /> : <Bell size={14} className="text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-white">{n.message}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[n.type]}`}>{n.type}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} /> {TARGET_LABELS[n.target]}</span>
                        {n.event_title && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} /> {n.event_title}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(n.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
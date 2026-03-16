"use client";

import { useState } from "react";
import { Bell, Send, Clock, Users, Calendar, AlertTriangle } from "lucide-react";

type NotifType = "info" | "urgent";
type NotifTarget = "members" | "registered" | "all";
interface Notification {
  id: string; message: string; type: NotifType;
  target: NotifTarget; event_title?: string; sent_at: string;
}

const DUMMY_SENT: Notification[] = [
  { id: "1", message: "Tech Talk 2025 venue has been changed to Hall B.", type: "urgent", target: "registered", event_title: "Tech Talk 2025", sent_at: "2025-04-08T10:30:00" },
  { id: "2", message: "Welcome to the club! Stay tuned for upcoming events.", type: "info", target: "members", sent_at: "2025-03-01T09:00:00" },
];

const DUMMY_EVENTS = [
  { id: "1", title: "Tech Talk 2025" },
  { id: "2", title: "Leadership Workshop" },
  { id: "3", title: "Annual Sports Meet" },
];

const TARGET_LABELS: Record<NotifTarget, string> = {
  members: "All Members", registered: "Event Registrants", all: "Everyone",
};

const TYPE_STYLES: Record<NotifType, string> = {
  info: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  urgent: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const selectClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0c1d] text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition";

export default function Notifications() {
  const [sent, setSent] = useState<Notification[]>(DUMMY_SENT);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ message: "", type: "info" as NotifType, target: "members" as NotifTarget, event_id: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const event = DUMMY_EVENTS.find(ev => ev.id === form.event_id);
    setSent(prev => [{ id: Date.now().toString(), message: form.message, type: form.type, target: form.target, event_title: event?.title, sent_at: new Date().toISOString() }, ...prev]);
    setForm({ message: "", type: "info", target: "members", event_id: "" });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Send alerts and updates to your members or event registrants.</p>
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/10 pb-4 flex items-center gap-2">
          <Send size={16} className="text-[#8b5cf6]" /> Send Notification
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlertTriangle size={14} className="text-gray-400" /> Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={selectClass}>
              <option value="info">Info — General update</option>
              <option value="urgent">Urgent — Emergency alert</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Users size={14} className="text-gray-400" /> Send To</label>
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
            {DUMMY_EVENTS.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"><Bell size={14} className="text-gray-400" /> Message</label>
          <textarea name="message" value={form.message} onChange={handleChange}
            placeholder="Write your notification message here..." rows={4} required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] transition resize-none" />
          <p className="text-xs text-gray-400">{form.message.length} characters</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          {success
            ? <span className="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg">✓ Notification sent</span>
            : <div className="text-xs text-gray-500 dark:text-gray-400">
                Sending to: <span className="font-medium text-gray-700 dark:text-gray-200">{TARGET_LABELS[form.target]}</span>
                {form.type === "urgent" && <span className="ml-2 text-red-600 dark:text-red-400 font-medium">· Marked as urgent</span>}
              </div>
          }
          <button type="submit" disabled={loading || !form.message.trim()}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
            <Send size={15} /> {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>

      {/* History */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
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
                      <div className="flex items-center gap-3 mt-1.5">
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
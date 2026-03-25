import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch User's Recent Activity (Registrations)
    const { data: myEvents, error } = await supabase
      .from('my_events')
      .select(`
        id,
        created_at,
        event_id,
        club_id,
        events (
          title
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    let eventsData = myEvents || [];

    if (error) {
       console.warn('Could not fetch recent activity by created_at, fallback to unordered', error);
       // Fallback if created_at doesn't exist
       const fallback = await supabase
          .from('my_events')
          .select(`id, event_id, club_id, events(title)`)
          .eq('user_id', user.id)
          .limit(5);

       if (fallback.error || !fallback.data) {
           return NextResponse.json([]);
       }
       eventsData = fallback.data.map(item => ({...item, created_at: new Date().toISOString()}));
    }

    const activities = eventsData.map((item: any, index: number) => {
       // Format time difference
       const timeDiff = Math.floor((new Date().getTime() - new Date(item.created_at || new Date()).getTime()) / (1000 * 60 * 60));
       let timeString = 'Just now';
       if (timeDiff > 0 && timeDiff < 24) timeString = `${timeDiff}h ago`;
       else if (timeDiff >= 24) timeString = `${Math.floor(timeDiff/24)}d ago`;

       const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-pink-500'];
       
       let text = 'You registered for an event';
       if (item.events?.title) {
          text = `You registered for ${item.events.title}`;
       } else if (item.club_id && !item.event_id) {
          text = `You joined a new club`;
       }

       return {
         id: item.id || Math.random().toString(),
         color: colors[index % colors.length],
         text,
         time: timeString
       };
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Recent activity error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

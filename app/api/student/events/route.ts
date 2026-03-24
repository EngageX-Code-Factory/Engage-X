import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        clubs (
          club_name,
          category
        )
      `)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If user is logged in, check which events they are registered for
    if (user) {
      const { data: myEvents } = await supabase
        .from('my_events')
        .select('event_id')
        .eq('user_id', user.id);
      
      const registeredEventIds = new Set(myEvents?.map(me => me.event_id) || []);
      
      const eventsWithStatus = events.map(e => ({
        ...e,
        is_registered: registeredEventIds.has(e.id)
      }));

      return NextResponse.json(eventsWithStatus);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

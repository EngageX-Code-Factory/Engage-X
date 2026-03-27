import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all events for the logged-in club leader
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Identify which club this user leads
    const { data: leaderLink } = await supabase
      .from('my_clubs')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('status', 'LEADER')
      .single();

    if (!leaderLink) {
      return NextResponse.json([], { status: 200 }); 
    }

    // Fetch events belonging to that club
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .eq('club_id', leaderLink.club_id)
      .order('event_date', { ascending: true });

    if (eventsError) throw eventsError;

    return NextResponse.json(events || []);
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new event
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Identify club ID
    const { data: leaderLink } = await supabase
      .from('my_clubs')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('status', 'LEADER')
      .single();

    if (!leaderLink) {
      return NextResponse.json({ error: 'Club leader record not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // We now extract 'category' from the payload alongside the rest
    const { title, event_date, event_time, location, category } = body;

    // Insert into events table
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        event_date,
        event_time,
        location,
        category, // Saved to DB!
        club_id: leaderLink.club_id,
        status: 'OPEN' 
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Event created', data });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
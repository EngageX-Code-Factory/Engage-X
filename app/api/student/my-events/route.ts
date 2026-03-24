import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user event registrations joined with event details and club name
    const { data, error } = await supabase
      .from('my_events')
      .select(`
        status,
        events (
          id,
          title,
          event_date,
          event_time,
          location,
          image,
          clubs (
            club_name,
            category
          )
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching my events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let { event_id, club_id, full_name, student_id, email, phone_number, dietary_requirements, special_notes } = body;

    // If club_id is missing, try to fetch it from the events table
    if (!club_id && event_id) {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('club_id')
        .eq('id', event_id)
        .single();
      
      if (!eventError && eventData) {
        club_id = eventData.club_id;
      }
    }

    const { error } = await supabase
      .from('my_events')
      .insert({
        user_id: user.id,
        event_id,
        club_id,
        full_name,
        student_id,
        email,
        phone_number,
        dietary_requirements,
        special_notes,
        status: 'CONFIRMED'
      });

    if (error) {
      console.error('Error registering event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error registering event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

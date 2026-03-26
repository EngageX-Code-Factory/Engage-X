import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch students registered for a specific event (?event_id=123)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 });

    // Fetch registrations [Assumes 'my_events' table tracks registrations and has an 'attended' boolean column]
    const { data, error } = await supabase
      .from('my_events')
      .select('id, full_name, student_id, attended, created_at')
      .eq('event_id', eventId)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance list' }, { status: 500 });
  }
}

// PATCH: Mark a student as attended or absent
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { id, attended } = await request.json(); // id is the row ID from my_events

    const { error } = await supabase
      .from('my_events')
      .update({ attended })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Attendance updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
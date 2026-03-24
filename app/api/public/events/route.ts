import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all upcoming events (or all, then filter on client/server)
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
      console.error('Error fetching public events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Unexpected error in public events API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

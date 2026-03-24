import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('clubid, club_name, category, club_description, active_members, club_cover_image')
      .order('club_name', { ascending: true });

    if (error) {
      console.error('Error fetching public clubs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Unexpected error in public clubs API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('clubid, club_name, category, club_description, active_members, ratings, club_cover_image')
      .order('club_name', { ascending: true });

    if (error) {
      console.error('Error fetching public clubs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch real member counts from my_clubs
    const { data: memberships, error: memberError } = await supabase
      .from('my_clubs')
      .select('club_id')
      .in('status', ['ACTIVE', 'LEADER']);

    if (!memberError && memberships) {
      const counts: Record<string, number> = {};
      memberships.forEach(m => {
        if (m.club_id) counts[m.club_id] = (counts[m.club_id] || 0) + 1;
      });

      // Merge real counts into clubs data
      const enrichedClubs = clubs.map(club => ({
        ...club,
        active_members: counts[club.clubid] || 0
      }));

      return NextResponse.json(enrichedClubs);
    }

    return NextResponse.json(clubs);
  } catch (error) {
    console.error('Unexpected error in public clubs API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

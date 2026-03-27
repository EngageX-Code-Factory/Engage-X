import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: leader } = await supabase
      .from('my_clubs')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('status', 'LEADER')
      .single();

    if (!leader) return NextResponse.json({ error: 'Club leader record not found' }, { status: 403 });

    const body = await request.json();
    
    // We wrap the update in a variable to check for errors
    const { error: dbError } = await supabase
      .from('clubs')
      .update({
        club_name: body.name,
        category: body.category,
        club_description: body.description,
        aboutus: body.about,
        contact_email: body.contact_email,
        faculty: body.faculty,
        president: body.president,
        meeting_day: body.meeting_day,
        meeting_time: body.meeting_time,
        facebook: body.facebook,
        instagram: body.instagram,
        twitter: body.twitter,
        discord: body.discord
      })
      .eq('clubid', leader.club_id);

    if (dbError) {
      console.error("Supabase Error:", dbError.message);
      // We return the actual DB error message so you can see it in the alert
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Crash:", err.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + err.message }, { status: 500 });
  }
}
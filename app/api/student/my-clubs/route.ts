import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch memberships joined with club details
    const { data, error } = await supabase
      .from('my_clubs')
      .select(`
        status,
        clubs (
          clubid,
          club_name,
          category,
          club_description,
          active_members,
          meeting_day
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching my clubs:', error);
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
    const { club_id, full_name, student_id, interests, reason_to_join } = body;

    const { error } = await supabase
      .from('my_clubs')
      .insert({
        user_id: user.id,
        club_id,
        full_name,
        student_id,
        interests,
        reason_to_join,
        status: 'PENDING'
      });

    if (error) {
      console.error('Error joining club:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error joining club:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

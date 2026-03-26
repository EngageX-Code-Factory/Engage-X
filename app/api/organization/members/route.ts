import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all members/requests for the club
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: leader } = await supabase.from('my_clubs').select('club_id').eq('user_id', user.id).eq('status', 'LEADER').single();
    if (!leader) return NextResponse.json([], { status: 200 });

    const { data: members, error } = await supabase
      .from('my_clubs')
      .select('id, full_name, student_id, created_at, status')
      .eq('club_id', leader.club_id)
      .in('status', ['PENDING', 'ACTIVE', 'REJECTED'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(members || []);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Approve or Reject a member
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status } = await request.json(); // status will be 'ACTIVE' or 'REJECTED'

    const { error } = await supabase
      .from('my_clubs')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: `Member ${status}` });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE: Remove a member
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get the ID from the URL query params (e.g., ?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { error } = await supabase.from('my_clubs').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ message: 'Member removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
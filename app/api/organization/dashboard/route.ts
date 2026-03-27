import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Get User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Check Profile Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log(`DEBUG: User ${user.id} has role: ${profile?.role}`);

    if (profile?.role !== 'organization') {
      return NextResponse.json({ error: 'Forbidden: Not an organization' }, { status: 403 });
    }

    // 3. Find Club Leadership
    const { data: leaderLink } = await supabase
      .from('my_clubs')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('status', 'LEADER')
      .single();

    if (!leaderLink) {
      console.log("DEBUG: No LEADER status found for this user in my_clubs");
      return NextResponse.json({
        stats: { totalEvents: 0, activeMembers: 0, pendingRequests: 0, attendanceRate: '0%' },
        recentRequests: []
      });
    }

    const clubId = leaderLink.club_id;

    // 4. Fetch Stats
    const { count: totalEvents } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('club_id', clubId);
    const { count: activeMembers } = await supabase.from('my_clubs').select('*', { count: 'exact', head: true }).eq('club_id', clubId).eq('status', 'ACTIVE');
    const { count: pendingRequests } = await supabase.from('my_clubs').select('*', { count: 'exact', head: true }).eq('club_id', clubId).eq('status', 'PENDING');
    
    const { data: recentRequests } = await supabase
      .from('my_clubs')
      .select('id, full_name, student_id, created_at, status')
      .eq('club_id', clubId)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalEvents: totalEvents || 0,
        activeMembers: activeMembers || 0,
        pendingRequests: pendingRequests || 0,
        attendanceRate: '85%' 
      },
      recentRequests: recentRequests || []
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
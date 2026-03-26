import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ error: 'Category required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Get past events in this category
    const { data: pastEvents } = await supabase
      .from('events')
      .select('id')
      .eq('category', category);

    if (!pastEvents || pastEvents.length === 0) {
      return NextResponse.json({ hasData: false });
    }

    const eventIds = pastEvents.map((e: { id: string }) => e.id);

    // 2. Registrations vs. Scans (from your qr_tokens table)
    const { count: totalRegs } = await supabase
      .from('my_events')
      .select('*', { count: 'exact', head: true })
      .in('event_id', eventIds);

    const { count: actualAtt } = await supabase
      .from('qr_tokens')
      .select('*', { count: 'exact', head: true })
      .in('event_id', eventIds)
      .eq('is_used', true);

    const regCount = totalRegs || 0;
    const attCount = actualAtt || 0;

    return NextResponse.json({
      hasData: true,
      historicalEventsCount: pastEvents.length,
      totalRegistrations: regCount,
      actualAttendance: attCount,
      showUpRate: regCount > 0 ? Math.round((attCount / regCount) * 100) : 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { club_id, title, message, type, target, event_id, event_title } = await request.json();

    if (!club_id || !title || !message || !type || !target) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Identify Recipients
    let recipientIds: string[] = [];

    if (target === 'members' || target === 'all') {
      const { data: members } = await supabase
        .from('my_clubs')
        .select('user_id')
        .eq('club_id', club_id)
        .in('status', ['ACTIVE', 'LEADER']);
      
      if (members) {
        recipientIds.push(...members.map(m => m.user_id));
      }
    }

    if (target === 'registered' || target === 'all') {
      if (event_id) {
        const { data: registrants } = await supabase
          .from('my_events')
          .select('user_id')
          .eq('event_id', event_id);
        
        if (registrants) {
          recipientIds.push(...registrants.map(r => r.user_id));
        }
      }
    }

    // De-duplicate recipients
    const uniqueRecipients = Array.from(new Set(recipientIds));

    if (uniqueRecipients.length === 0) {
      return NextResponse.json({ message: 'No recipients found for the selected target' });
    }

    // 2. Insert individual notifications + 1 source record for history
    const sourceRecord = {
      user_id: null,
      club_id: club_id,
      title: title,
      message: message,
      type: type,
      target: target,
      event_id: event_id || null,
      event_title: event_title || null,
      is_read: true, // Marked as read for the system
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const notificationsToInsert = uniqueRecipients.map(recipientId => ({
      user_id: recipientId,
      club_id: club_id,
      title: title,
      message: message,
      type: type,
      target: target,
      event_id: event_id || null,
      event_title: event_title || null,
      is_read: false,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert([sourceRecord, ...notificationsToInsert]);

    if (insertError) {
      console.error('Error inserting notifications:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Notifications sent successfully', 
      recipientCount: uniqueRecipients.length 
    });

  } catch (error) {
    console.error('Error in send notification API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

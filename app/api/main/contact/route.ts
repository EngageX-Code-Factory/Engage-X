import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { full_name, email, subject, message } = body;

    if (!full_name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contact_us')
      .insert({
        name: full_name,
        email,
        subject,
        message,
        status: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving contact message:', error);
      // If the table doesn't exist, we might get a specific error code.
      // But for now, we'll just return the error message.
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Unexpected error in contact API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

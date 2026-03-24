import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        const { data: event, error } = await supabase
            .from('events')
            .select(`
                *,
                clubs (
                    club_name,
                    category
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching event:', error);
            if (error.code === 'PGRST116') {
             return NextResponse.json({ error: 'Event not found' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error in event detail API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

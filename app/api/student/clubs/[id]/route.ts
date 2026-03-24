import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        // Skip auth check for viewing club details if public, 
        // or check if user is logged in. 
        // Assuming public access is allowed for now, or minimal auth.

        const { id } = await params;

        const { data: club, error } = await supabase
            .from('clubs')
            .select('*')
            .eq('clubid', id)
            .single();

        if (error) {
            console.error('Error fetching club:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!club) {
            return NextResponse.json({ error: 'Club not found' }, { status: 404 });
        }

        return NextResponse.json(club);
    } catch (error) {
        console.error('Error in club detail API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

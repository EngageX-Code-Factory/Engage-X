import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ReviewData {
  id: string;
  student_id: string;
  star_count: number;
  review: string;
  review_added_date: string;
}

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .order('review_added_date', { ascending: false });

    if (reviewsError) {
      return NextResponse.json({ error: reviewsError.message }, { status: 500 });
    }

    if (!reviewsData || reviewsData.length === 0) {
      return NextResponse.json([]);
    }

    const studentIds = Array.from(new Set(reviewsData.map((r: ReviewData) => r.student_id)));

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', studentIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    const mergedReviews = reviewsData.map((review: ReviewData) => {
      const profile = profilesData?.find((p: ProfileData) => p.id === review.student_id);
      
      return {
        id: review.id,
        name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Student',
        department: "Student", 
        text: review.review,
        rating: review.star_count,
        image: profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80",
        review_added_date: review.review_added_date
      };
    });

    return NextResponse.json(mergedReviews);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to normalize location strings
const normalizeLocation = (loc: string | null | undefined) => {
  if (!loc) return '';
  return loc.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\b(road|street|no|lane|avenue|st|rd|province|district)\b/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch User Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('address')
      .eq('id', user.id)
      .single();

    const normAddress = normalizeLocation(profile?.address);
    const addressTokens = new Set(normAddress.split(' ').filter(w => w.length > 2));

    // 2. Fetch User's Event History
    const { data: myEvents } = await supabase
      .from('my_events')
      .select(`
        event_id,
        club_id,
        events (
          event_date,
          clubs (category)
        )
      `)
      .eq('user_id', user.id);

    const registeredEventIds = new Set(myEvents?.map(me => me.event_id) || []);
    const preferredClubIds = new Set(myEvents?.map(me => me.club_id).filter(Boolean) || []);
    
    // Calculate category frequencies with behavioral recency weighting
    const categoryFreq: Record<string, number> = {};
    const today = new Date();

    if (myEvents) {
      myEvents.forEach((me: any) => {
        const category = me.events?.clubs?.category;
        if (category) {
          const upperCat = category.toUpperCase();
          // Did the user join this event recently?
          let weight = 1;
          if (me.events?.event_date) {
             const eventDate = new Date(me.events.event_date);
             const daysDiff = Math.abs(Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 3600 * 24)));
             if (daysDiff <= 7) {
               weight = 2; // Recent activity carries more weight
             }
          }
          categoryFreq[upperCat] = (categoryFreq[upperCat] || 0) + weight;
        }
      });
    }

    // 3. Fetch all upcoming events (or all available events)
    const { data: allEvents, error: eventsError } = await supabase
      .from('events')
      .select(`
        *,
        clubs (
          club_name,
          category
        )
      `);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    if (!allEvents) {
      return NextResponse.json([]);
    }

    // 4. Fetch Global Popularity Count
    const { data: allRegistrations } = await supabase
      .from('my_events')
      .select('event_id');
    
    const popularityCount: Record<string, number> = {};
    if (allRegistrations) {
      allRegistrations.forEach((reg) => {
        if (reg.event_id) {
          popularityCount[reg.event_id] = (popularityCount[reg.event_id] || 0) + 1;
        }
      });
    }

    // 5. Score and filter available events
    const scoredEvents = allEvents
      .filter(event => !registeredEventIds.has(event.id)) // Exclude registered
      .map(event => {
        let totalScore = 0;
        let categoryScore = 0;
        let locationScore = 0;
        let recencyScore = 0;
        let popularityScore = 0;
        let clubScore = 0;
        
        // --- A. Category Score ---
        const category = event.clubs?.category?.toUpperCase();
        if (category && categoryFreq[category]) {
          categoryScore = categoryFreq[category] * 10;
        }

        // --- B. Location Match Score ---
        const normEventLoc = normalizeLocation(event.location);
        if (normAddress && normEventLoc) {
           if (normAddress === normEventLoc || normAddress.includes(normEventLoc) || normEventLoc.includes(normAddress)) {
             locationScore = 20; // Exact or strong substring match
           } else {
             const locTokens = normEventLoc.split(' ').filter(w => w.length > 2);
             const hasPartial = locTokens.some(token => addressTokens.has(token));
             if (hasPartial) {
               locationScore = 10; // Partial keyword match
             }
           }
        }
        
        // --- C. Recency Score ---
        if (event.event_date) {
           const eventDate = new Date(event.event_date);
           const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
           
           if (daysDiff >= 0) {
             if (daysDiff <= 7) recencyScore = 5;
             else if (daysDiff <= 14) recencyScore = 3;
             else if (daysDiff <= 30) recencyScore = 1;
           } else {
             // Past event - penalize or just zero. Zero for now since we want upcoming.
             recencyScore = -100; // heavy penalty for past events
           }
        }

        // --- D. Popularity Score ---
        const registrations = popularityCount[event.id] || 0;
        popularityScore = registrations * 0.1; // or * 2 per prompt preference, keeping it balanced here at 0.1 or maybe 1. Let's use 0.5 for visibly shifting. Prompt says registrations * 0.1 so we stick with 0.1.

        // --- E. Club Preference Score ---
        if (event.club_id && preferredClubIds.has(event.club_id)) {
           clubScore = 10;
        }

        totalScore = categoryScore + locationScore + recencyScore + popularityScore + clubScore;

        return { 
          ...event, 
          recommendationScore: totalScore,
          debugScores: {
            categoryScore,
            locationScore,
            recencyScore,
            popularityScore,
            clubScore,
            totalScore
          }
        };
      });

    // 6. Rank Events
    // Sort by score descending, then by date ascending (sooner events first for ties)
    scoredEvents.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });

    // Cold Start inherently works because non-history users will have score based purely on Location, Recency, and Popularity!
    // And if everything is 0, they sort by Date.

    // 7. Diversity Filter
    const topRecommendations = [];
    const categoryCounts: Record<string, number> = {};
    
    for (const event of scoredEvents) {
      if (event.recommendationScore < 0) continue; // Skip heavily penalized past events

      const cat = event.clubs?.category?.toUpperCase() || 'GENERAL';
      const count = categoryCounts[cat] || 0;
      
      if (count < 2) {
        topRecommendations.push(event);
        categoryCounts[cat] = count + 1;
      }

      if (topRecommendations.length === 3) break;
    }

    return NextResponse.json(topRecommendations);

  } catch (error) {
    console.error('Unexpected error recommending events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

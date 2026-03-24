import StatCards from './stat-cards';
import RecommendedEvents from './recommended-events';
import MySchedule from './my-schedule';
import CalendarSidebar from './calendar-sidebar';
import RecentActivity from './recent-activity';
import EmergencyAlert from './emergency-alert';
import { createClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let firstName = 'Student';
  let eventsCount = 0;
  let clubsCount = 0;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', user.id)
      .single();
    
    if (data?.first_name) {
      firstName = data.first_name;
    }

    // Count Events Attended
    const { count: eCount } = await supabase
      .from('my_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    // Count Clubs Joined (Active or Leader)
    const { count: cCount } = await supabase
      .from('my_clubs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('status', ['ACTIVE', 'LEADER']);

    eventsCount = eCount || 0;
    clubsCount = cCount || 0;
  }

  // Fetch upcoming registered events
  let registeredEvents: any[] = [];
  if (user) {
    const { data } = await supabase
      .from('my_events')
      .select(`
        events (
          id,
          title,
          event_date,
          clubs (
            category
          )
        )
      `)
      .eq('user_id', user.id);
    
    if (data) {
      registeredEvents = data
        .map((item: any) => {
          const evt = item.events;
          if (!evt) return null;
          return {
            id: evt.id,
            title: evt.title,
            event_date: evt.event_date,
            event_time: evt.event_time,
            location: evt.location,
            category: (Array.isArray(evt.clubs) ? evt.clubs[0]?.category : evt.clubs?.category) || 'OTHER'
          };
        })
        .filter((event: any) => event !== null);
    }
  }

  // Fetch recently joined clubs
  let recentClubs: any[] = [];
  if (user) {
    const { data: clubsData } = await supabase
      .from('my_clubs')
      .select(`
        created_at,
        clubs (
          id,
          club_name,
          category,
          image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (clubsData) {
      recentClubs = clubsData
        .map((item: any) => ({
          id: item.clubs?.id,
          title: item.clubs?.club_name,
          category: item.clubs?.category,
          image: item.clubs?.image_url,
          joined_at: item.created_at
        }))
        .filter((c: any) => c.id !== undefined);
    }
  }

  const points = (eventsCount * 50) + (clubsCount * 100);

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      <div className="flex gap-6">
        {/* ── Main Content (left, ~65%) ── */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Welcome */}
          <div className="flex flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome back,{' '}
                <span className="text-purple-400">{firstName}!</span>
              </h1>
              <p className="text-gray-400 mt-2 text-base">
                Here's what's happening in your campus community today.
              </p>
            </div>
            <EmergencyAlert />
          </div>

          {/* Stat Cards */}
          <StatCards eventsCount={eventsCount} clubsCount={clubsCount} points={points} />

          {/* Recommended Events */}
          <RecommendedEvents />

          {/* My Schedule */}
          <MySchedule 
            recentClubs={recentClubs} 
          />
        </div>

        {/* ── Sidebar (right, ~320px) ── */}
        <aside className="w-72 xl:w-80 shrink-0 space-y-4">
          <CalendarSidebar registeredEvents={registeredEvents} />
          <RecentActivity />
        </aside>
      </div>
    </div>
  );
}

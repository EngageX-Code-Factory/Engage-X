import StatCards from './stat-cards';
import RecommendedEvents from './recommended-events';
import MySchedule from './my-schedule';
import CalendarSidebar from './calendar-sidebar';
import RecentActivity from './recent-activity';
import EmergencyAlert from './emergency-alert';

export default function Dashboard() {
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
                <span className="text-purple-400">Alex!</span>
              </h1>
              <p className="text-gray-400 mt-2 text-base">
                Here's what's happening in your campus community today.
              </p>
            </div>
            <EmergencyAlert />
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Recommended Events */}
          <RecommendedEvents />

          {/* My Schedule */}
          <MySchedule />
        </div>

        {/* ── Sidebar (right, ~320px) ── */}
        <aside className="w-72 xl:w-80 shrink-0 space-y-4">
          <CalendarSidebar />
          <RecentActivity />
        </aside>
      </div>
    </div>
  );
}

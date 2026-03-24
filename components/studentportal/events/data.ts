export interface Event {
  id: string;
  date: string;
  month: string;
  year: number;
  title: string;
  category: string;
  time: string;
  location: string;
  status: string;
  organizer: string;
  image: string;
  attendees: number;
}

export interface RawEvent {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  attendees: number;
  image: string;
  status: string;
  club_id: string;
  clubs: {
    club_name: string;
    category: string;
  } | null;
}

export const CATEGORIES = ['All', 'TECHNOLOGY', 'ART & DESIGN', 'MUSIC', 'ACADEMIC', 'BUSINESS', 'SCIENCE'];
export const STATUS_OPTIONS = ['All', 'OPEN', 'FILLED', 'SOON'];

export const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY:    'bg-indigo-500/20 text-indigo-300',
  'ART & DESIGN':'bg-purple-500/20 text-purple-300',
  MUSIC:         'bg-pink-500/20 text-pink-300',
  ACADEMIC:      'bg-amber-500/20 text-amber-300',
  BUSINESS:      'bg-violet-500/20 text-violet-300',
  SCIENCE:       'bg-emerald-500/20 text-emerald-300',
};

export const STATUS_STYLES: Record<string, string> = {
  OPEN:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  FILLED:'bg-red-500/20 text-red-300 border border-red-500/30',
  SOON:  'bg-amber-500/20 text-amber-300 border border-amber-500/30',
};


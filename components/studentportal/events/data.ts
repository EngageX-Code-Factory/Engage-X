export interface Event {
  id: number;
  date: string;
  month: string;
  year: number;
  title: string;
  category: string;
  time: string;
  location: string;
  status: 'OPEN' | 'FILLED' | 'SOON';
  organizer: string;    // club name
  organizerFaculty: string;
  image: string;
  attendees: number;
}

export const allEvents: Event[] = [
  {
    id: 1, date: '15', month: 'MAR', year: 2026,
    title: 'Hackathon 2026',
    category: 'TECHNOLOGY', time: '9:00 AM – 6:00 PM',
    location: 'Engineering Block A', status: 'OPEN',
    organizer: 'Coding Club', organizerFaculty: 'Faculty of Engineering',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop',
    attendees: 320,
  },
  {
    id: 2, date: '20', month: 'MAR', year: 2026,
    title: 'Digital Art Workshop',
    category: 'ART & DESIGN', time: '2:00 PM – 4:00 PM',
    location: 'Arts Studio 201', status: 'OPEN',
    organizer: 'Film Society', organizerFaculty: 'Faculty of Arts',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
    attendees: 48,
  },
  {
    id: 3, date: '25', month: 'MAR', year: 2026,
    title: 'Music Fest',
    category: 'MUSIC', time: '6:00 PM – 10:00 PM',
    location: 'Open Amphitheatre', status: 'OPEN',
    organizer: 'Rhythm Music Society', organizerFaculty: 'Faculty of Arts',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=300&fit=crop',
    attendees: 500,
  },
  {
    id: 4, date: '22', month: 'MAR', year: 2026,
    title: 'Robot Battle Arena: Qualifiers',
    category: 'TECHNOLOGY', time: '10:00 AM – 1:00 PM',
    location: 'Main Hall', status: 'OPEN',
    organizer: 'Robotics & AI Club', organizerFaculty: 'Faculty of Computing',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&h=300&fit=crop',
    attendees: 180,
  },
  {
    id: 5, date: '05', month: 'APR', year: 2026,
    title: 'AI Ethics Panel Discussion',
    category: 'ACADEMIC', time: '5:30 PM – 7:00 PM',
    location: 'Auditorium B', status: 'FILLED',
    organizer: 'Robotics & AI Club', organizerFaculty: 'Faculty of Computing',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
    attendees: 150,
  },
  {
    id: 6, date: '08', month: 'APR', year: 2026,
    title: 'Spring Debate Championship',
    category: 'ACADEMIC', time: '11:00 AM – 5:00 PM',
    location: 'Conference Room 1', status: 'OPEN',
    organizer: 'Debate Society', organizerFaculty: 'Faculty of Humanities',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=300&fit=crop',
    attendees: 75,
  },
  {
    id: 7, date: '12', month: 'APR', year: 2026,
    title: 'Drone Racing Workshop',
    category: 'TECHNOLOGY', time: '2:00 PM – 5:00 PM',
    location: 'Engineering Rooftop', status: 'OPEN',
    organizer: 'Robotics & AI Club', organizerFaculty: 'Faculty of Computing',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=300&fit=crop',
    attendees: 60,
  },
  {
    id: 8, date: '15', month: 'APR', year: 2026,
    title: 'Startup Pitch Night',
    category: 'BUSINESS', time: '6:00 PM – 9:00 PM',
    location: 'Business Block Atrium', status: 'SOON',
    organizer: 'Entrepreneurship Cell', organizerFaculty: 'Faculty of Business',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=300&fit=crop',
    attendees: 200,
  },
  {
    id: 9, date: '18', month: 'APR', year: 2026,
    title: 'Campus Clean-Up Drive',
    category: 'SCIENCE', time: '8:00 AM – 12:00 PM',
    location: 'Campus Grounds', status: 'OPEN',
    organizer: 'Environmental Club', organizerFaculty: 'Faculty of Science',
    image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=300&fit=crop',
    attendees: 120,
  },
  {
    id: 10, date: '20', month: 'APR', year: 2026,
    title: 'RoboWars Annual Championship',
    category: 'TECHNOLOGY', time: '9:00 AM – 6:00 PM',
    location: 'Sports Complex', status: 'OPEN',
    organizer: 'Robotics & AI Club', organizerFaculty: 'Faculty of Computing',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=300&fit=crop',
    attendees: 400,
  },
  {
    id: 11, date: '25', month: 'APR', year: 2026,
    title: 'Photography Exhibition',
    category: 'ART & DESIGN', time: '10:00 AM – 5:00 PM',
    location: 'Gallery Hall', status: 'OPEN',
    organizer: 'Photography Society', organizerFaculty: 'Faculty of Arts',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=300&fit=crop',
    attendees: 250,
  },
  {
    id: 12, date: '28', month: 'APR', year: 2026,
    title: 'Machine Learning Bootcamp',
    category: 'TECHNOLOGY', time: '10:00 AM – 4:00 PM',
    location: 'Computer Lab A', status: 'OPEN',
    organizer: 'Coding Club', organizerFaculty: 'Faculty of Engineering',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=300&fit=crop',
    attendees: 90,
  },
];

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

export const FACULTY_COLORS: Record<string, string> = {
  'Faculty of Arts':       'text-pink-400',
  'Faculty of Computing':  'text-indigo-400',
  'Faculty of Science':    'text-emerald-400',
  'Faculty of Engineering':'text-sky-400',
  'Faculty of Humanities': 'text-orange-400',
  'Faculty of Business':   'text-violet-400',
};

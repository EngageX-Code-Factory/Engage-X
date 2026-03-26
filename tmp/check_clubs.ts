import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkClubs() {
  const { data, error } = await supabase.from('clubs').select('*').limit(5);
  console.log('Clubs Data:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}

checkClubs();

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'd:/Documents/Projects/Personal/EngageX 2/engagex/.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('events').select('*').limit(1);
  if (error) {
    console.error("Error fetching events:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Columns in 'events' table:", Object.keys(data[0]));
  } else {
    console.log("No data in 'events' table to infer columns.");
    // Try to get one from another club if it exists
    const { data: allData, error: allErr } = await supabase.from('events').select('*').limit(1);
    if (allData && allData.length > 0) {
        console.log("Columns in 'events' table:", Object.keys(allData[0]));
    } else {
        console.log("Could not infer columns from empty table.");
    }
  }
}

checkSchema();

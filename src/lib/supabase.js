import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ujbnvvnxewlslyhzhnmv.supabase.co';
const SUPABASE_KEY = 'sb_publishable__C0Dsi-8fgOBAvLadTfciQ_QwaEmIhc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

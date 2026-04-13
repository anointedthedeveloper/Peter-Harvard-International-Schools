import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wmoxdrmleucowwaaqsrq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtb3hkcm1sZXVjb3d3YWFxc3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODQ0OTAsImV4cCI6MjA5MTY2MDQ5MH0.uiNoLWygeeQ9d56iMdCgjvaT_scSAhVQMT_ELYDxUpc'; // ← Paste your anon/public key from: Supabase Dashboard → Project Settings → API

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

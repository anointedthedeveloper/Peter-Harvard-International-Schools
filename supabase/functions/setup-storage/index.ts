import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Create bucket if it doesn't exist
  const { data: existing } = await supabase.storage.getBucket('phis-media');
  if (!existing) {
    const { error } = await supabase.storage.createBucket('phis-media', { public: true });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, bucket: 'phis-media' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

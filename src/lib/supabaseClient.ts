// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://slvjvdqnhbnomeukagpi.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdmp2ZHFuaGJub21ldWthZ3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NjgzNDksImV4cCI6MjA3ODQ0NDM0OX0.B3fbrgZE67wXx9yznberU_VtR8PNE79InJQNHbTfP8g'
);
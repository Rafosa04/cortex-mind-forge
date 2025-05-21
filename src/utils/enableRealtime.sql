
-- To enable realtime for our tables in Supabase, we need to add them to the realtime publication
-- Note: This needs to be executed by the user in the Supabase SQL Editor

-- Enable full replica identity to ensure all data is sent in realtime events
ALTER TABLE projects REPLICA IDENTITY FULL;
ALTER TABLE project_steps REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
BEGIN;
  -- Check if the supabase_realtime publication exists
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication
      WHERE pubname = 'supabase_realtime'
    ) THEN
      -- Create the publication if it doesn't exist
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END$$;

  -- Add our tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.project_steps;
COMMIT;

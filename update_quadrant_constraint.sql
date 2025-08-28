-- Update the quadrant check constraint to use the correct quadrant names
-- Run this in your Supabase SQL editor

-- First, drop the existing constraint
ALTER TABLE user_results DROP CONSTRAINT IF EXISTS check_quadrant;

-- Add the new constraint with correct quadrant names
ALTER TABLE user_results 
ADD CONSTRAINT check_quadrant 
CHECK (quadrant IN ('libertarian-left', 'libertarian-right', 'authoritarian-left', 'authoritarian-right'));

-- Optional: Update any existing records with old quadrant names to new ones
UPDATE user_results SET quadrant = 'libertarian-left' WHERE quadrant = 'liberal-left';
UPDATE user_results SET quadrant = 'libertarian-right' WHERE quadrant = 'liberal-right';
UPDATE user_results SET quadrant = 'authoritarian-left' WHERE quadrant = 'authoritative-left';
UPDATE user_results SET quadrant = 'authoritarian-right' WHERE quadrant = 'authoritative-right';

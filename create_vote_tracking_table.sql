-- Create vote_tracking table to prevent duplicate votes
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id SERIAL PRIMARY KEY,
  suggestion_id INTEGER NOT NULL REFERENCES politician_suggestions(id) ON DELETE CASCADE,
  user_identifier VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(suggestion_id, user_identifier)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_suggestion_id ON suggestion_votes(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_user_identifier ON suggestion_votes(user_identifier);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_unique ON suggestion_votes(suggestion_id, user_identifier);

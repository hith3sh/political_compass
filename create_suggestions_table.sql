-- Create politician_suggestions table
CREATE TABLE IF NOT EXISTS politician_suggestions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quadrant VARCHAR(50) NOT NULL CHECK (quadrant IN ('libertarian-left', 'libertarian-right', 'authoritarian-left', 'authoritarian-right', 'centrist')),
  x_coordinate INTEGER NOT NULL,
  y_coordinate INTEGER NOT NULL,
  grid_id INTEGER NOT NULL,
  votes INTEGER DEFAULT 0,
  suggested_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_politician_suggestions_quadrant ON politician_suggestions(quadrant);
CREATE INDEX IF NOT EXISTS idx_politician_suggestions_votes ON politician_suggestions(votes DESC);
CREATE INDEX IF NOT EXISTS idx_politician_suggestions_created_at ON politician_suggestions(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_politician_suggestions_updated_at 
    BEFORE UPDATE ON politician_suggestions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

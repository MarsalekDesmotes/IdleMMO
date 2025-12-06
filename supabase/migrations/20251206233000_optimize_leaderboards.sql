-- Add indices for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_honor_daily ON profiles(honor_daily DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_honor_lifetime ON profiles(honor_lifetime DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_rebirth_count ON profiles(game_state->>'rebirthCount' DESC); -- Indexing JSONB field for rebirths

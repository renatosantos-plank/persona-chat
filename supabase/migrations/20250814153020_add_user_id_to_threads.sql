ALTER TABLE threads ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_threads_user_id ON threads(user_id);

ALTER TABLE threads ALTER COLUMN user_id SET NOT NULL;
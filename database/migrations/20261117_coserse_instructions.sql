CREATE TABLE IF NOT EXISTS bdb_coserse_instructions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category VARCHAR(32) NOT NULL DEFAULT 'rule',
    content TEXT NOT NULL,
    created_by_user_id BIGINT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bdb_coserse_instructions_active
    ON bdb_coserse_instructions (is_active, id DESC);

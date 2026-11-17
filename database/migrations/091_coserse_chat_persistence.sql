-- Migration 091: Coserse 1.0 Permanent Chat Sessions & Messages Persistence
-- Stores per-user conversation history in PostgreSQL with ON DELETE CASCADE for instant hard delete.

CREATE TABLE IF NOT EXISTS bdb_coserse_sessions (
    id VARCHAR(80) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL DEFAULT 'Obrolan Baru',
    model_id VARCHAR(80) NOT NULL DEFAULT 'coserse:1.0',
    tier_id VARCHAR(32) NOT NULL DEFAULT 'low',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coserse_sessions_user_updated
    ON bdb_coserse_sessions (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS bdb_coserse_messages (
    id VARCHAR(80) PRIMARY KEY,
    session_id VARCHAR(80) NOT NULL REFERENCES bdb_coserse_sessions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    role VARCHAR(24) NOT NULL,
    content TEXT NOT NULL,
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coserse_messages_session_created
    ON bdb_coserse_messages (session_id, created_at ASC);

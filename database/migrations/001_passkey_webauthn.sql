-- Migration: WebAuthn / Passkey Biometric Authentication tables
-- Date: 2026-10-05
-- Database: big_data_binops (PostgreSQL)

CREATE TABLE IF NOT EXISTS auth_passkeys (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    counter BIGINT NOT NULL DEFAULT 0,
    device_name TEXT,
    device_type TEXT,
    transports TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_auth_passkeys_user_id ON auth_passkeys(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_passkeys_credential_id ON auth_passkeys(credential_id);

CREATE TABLE IF NOT EXISTS auth_passkey_challenges (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    challenge TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'authentication',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_passkey_challenges_expires ON auth_passkey_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_passkey_challenges_challenge ON auth_passkey_challenges(challenge);

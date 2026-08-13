// Read a server-side environment variable, accepting an optional "MOS_" prefix.
// This lets variables set in Netlify as e.g. MOS_DATABASE_URL work exactly like
// DATABASE_URL, so it doesn't matter which naming you used. Empty strings are
// treated as unset (Netlify can leave a key present but valueless).
//
// The returned value is trimmed. Pasting a secret (Square token, API key, DB
// URL) into a dashboard easily picks up a leading/trailing space or newline,
// which would silently corrupt an Authorization header or connection string.
// None of these values legitimately begin or end with whitespace, so trimming
// is always safe and prevents a whole class of "works locally, 401 in prod"
// bugs.
export function env(name: string): string | undefined {
  const direct = process.env[name];
  if (direct && direct.trim() !== '') return direct.trim();
  const prefixed = process.env[`MOS_${name}`];
  if (prefixed && prefixed.trim() !== '') return prefixed.trim();
  return undefined;
}

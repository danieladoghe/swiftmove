// Read a server-side environment variable, accepting an optional "MOS_" prefix.
// This lets variables set in Netlify as e.g. MOS_DATABASE_URL work exactly like
// DATABASE_URL, so it doesn't matter which naming you used. Empty strings are
// treated as unset (Netlify can leave a key present but valueless).
export function env(name: string): string | undefined {
  const direct = process.env[name];
  if (direct && direct.trim() !== '') return direct;
  const prefixed = process.env[`MOS_${name}`];
  if (prefixed && prefixed.trim() !== '') return prefixed;
  return undefined;
}

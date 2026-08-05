'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In progress',
  scheduled: 'Scheduled',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StatusSelect({
  id,
  status,
  statuses,
}: {
  id: string;
  status: string;
  statuses: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);

  async function onChange(next: string) {
    const prev = value;
    setValue(next);
    setSaving(true);
    setErr(false);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setValue(prev);
      setErr(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={saving}
      title={err ? 'Update failed — try again' : undefined}
      style={{
        padding: '5px 8px',
        borderRadius: 8,
        border: `1px solid ${err ? '#ff6b6b' : '#2a2e35'}`,
        background: '#0e1013',
        color: '#f2f0ec',
        fontSize: 13,
      }}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s] ?? s}
        </option>
      ))}
    </select>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          await fetch('/api/admin/logout', { method: 'POST' });
          router.replace('/admin/login');
          router.refresh();
        })
      }
      disabled={pending}
      style={{
        padding: '7px 14px',
        borderRadius: 8,
        border: '1px solid #2a2e35',
        background: 'transparent',
        color: '#9aa0a8',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

// Minimal typing for the Square Web Payments SDK we touch.
interface SquareCardInstance {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: { message: string }[] }>;
  destroy?: () => Promise<void>;
}
interface SquarePayments {
  card: () => Promise<SquareCardInstance>;
}
declare global {
  interface Window {
    Square?: { payments: (appId: string, locationId: string) => SquarePayments };
  }
}

const SDK_SANDBOX = 'https://sandbox.web.squarecdn.com/v1/square.js';
const SDK_PRODUCTION = 'https://web.squarecdn.com/v1/square.js';

function loadSdk(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Square.')));
      if (window.Square) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Square.'));
    document.head.appendChild(s);
  });
}

/**
 * Renders Square's secure card field and hands the initialized card instance up
 * to the parent via onReady, so the checkout form can call card.tokenize() on
 * submit. Sandbox vs production is inferred from the application id prefix.
 */
export function SquareCard({
  appId,
  locationId,
  onReady,
  onError,
}: {
  appId: string;
  locationId: string;
  onReady: (card: SquareCardInstance) => void;
  onError?: (message: string) => void;
}) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [detail, setDetail] = useState('');
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    const src = appId.startsWith('sandbox-') ? SDK_SANDBOX : SDK_PRODUCTION;

    (async () => {
      try {
        await loadSdk(src);
        if (!window.Square) throw new Error('Square SDK unavailable.');
        const payments = window.Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach('#card-container');
        setStatus('ready');
        onReady(card);
      } catch (e) {
        // Surface the real reason: Square's init errors ("Unauthorized",
        // "applicationId/locationId mismatch", account-not-activated, a blocked
        // asset, …) are diagnostic, so show them instead of a generic line.
        const msg = e instanceof Error ? e.message : 'Could not load the card form.';
        console.error('[SquareCard] init failed:', e);
        setDetail(msg);
        setStatus('error');
        onError?.(msg);
      }
    })();
    // Init once; parent callbacks are read at call time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        id="card-container"
        className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3"
      />
      {status === 'loading' && (
        <p className="mt-2 text-sm text-[var(--muted)]">Loading secure card form…</p>
      )}
      {status === 'error' && (
        <div className="mt-2 text-sm text-red-500">
          <p>Card form couldn’t load — please choose pay at pickup/delivery.</p>
          {detail && <p className="mt-1 break-words text-xs opacity-80">Square: {detail}</p>}
        </div>
      )}
    </div>
  );
}

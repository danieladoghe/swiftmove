import type { Metadata } from 'next';
import { LegalLayout, Section } from '@/components/legal/LegalLayout';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  title: "Privacy Policy | Mo's Yard",
  description: "How Mo's Yard collects, uses, and protects your personal information.",
};

const UPDATED = 'August 10, 2026';

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This policy explains how ${COMPANY.legalName} ("we", "us") collects, uses, and protects your personal information when you use our website, reserve storage, rent equipment, buy supplies, or contact us.`}
    >
      <Section heading="Information we collect">
        <p>We collect only what we need to serve you:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Contact &amp; booking details</strong> — your name, email, phone, company, and (for delivery or reservations) your address, when you submit a form, reserve a space, request a freight quote, or place a supply order.</li>
          <li><strong>Order &amp; reservation details</strong> — the items, space size, dates, and notes you provide.</li>
          <li><strong>Payment information</strong> — card payments are processed by <strong>Square</strong>. We do <strong>not</strong> see or store your full card number; Square handles it securely.</li>
          <li><strong>Basic technical data</strong> — standard server logs and a cookie that remembers your light/dark theme preference. We do not run third-party advertising trackers.</li>
        </ul>
      </Section>

      <Section heading="How we use your information">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To fulfill reservations, rentals, supply orders, and freight requests.</li>
          <li>To respond to your enquiries and quotes.</li>
          <li>To send confirmations and updates to you, and to notify our team at {COMPANY.email} of new requests.</li>
          <li>To process payments and invoices.</li>
          <li>To operate, secure, and improve our services.</li>
        </ul>
      </Section>

      <Section heading="Who we share it with">
        <p>We do not sell your personal information. We share it only with service providers that help us run the business, and only as needed:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Square</strong> — payment processing and invoicing.</li>
          <li><strong>Resend</strong> — sending confirmation and notification emails.</li>
          <li><strong>Supabase</strong> — secure database hosting for your request/order records.</li>
          <li><strong>Netlify</strong> — website hosting.</li>
          <li><strong>U-Haul</strong> — if you book truck or trailer rentals, those are handled under U-Haul&rsquo;s own terms and privacy practices.</li>
        </ul>
        <p>We may also disclose information if required by law.</p>
      </Section>

      <Section heading="Data retention & security">
        <p>We keep your request and order records for as long as needed to serve you and to meet legal, accounting, and tax obligations, then delete or anonymize them. We use reasonable technical and organizational measures to protect your information, though no method of transmission or storage is completely secure.</p>
      </Section>

      <Section heading="Your choices & rights">
        <p>You may ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you. Email <a href={`mailto:${COMPANY.email}`} className="font-medium text-[var(--accent-dark)] hover:underline">{COMPANY.email}</a> and we&rsquo;ll respond within a reasonable time. If you pay by card, transaction records held by Square are subject to Square&rsquo;s policies.</p>
      </Section>

      <Section heading="Children">
        <p>Our services are intended for adults and businesses. We do not knowingly collect personal information from children.</p>
      </Section>

      <Section heading="Changes to this policy">
        <p>We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above shows when it last changed.</p>
      </Section>

      <Section heading="Contact us">
        <p>
          {COMPANY.legalName}<br />
          {COMPANY.address.full}<br />
          <a href={`mailto:${COMPANY.email}`} className="font-medium text-[var(--accent-dark)] hover:underline">{COMPANY.email}</a> · <a href={`tel:${COMPANY.phone.tel}`} className="font-medium text-[var(--accent-dark)] hover:underline">{COMPANY.phone.display}</a>
        </p>
      </Section>
    </LegalLayout>
  );
}

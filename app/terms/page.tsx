import type { Metadata } from 'next';
import { LegalLayout, Section } from '@/components/legal/LegalLayout';
import { COMPANY, RETURN_POLICY } from '@/lib/company';

export const metadata: Metadata = {
  title: "Terms of Service | Mo's Yard",
  description: "The terms that govern using Mo's Yard storage, rentals, supplies, and freight services.",
};

const UPDATED = 'August 10, 2026';

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={UPDATED}
      intro={`These terms govern your use of ${COMPANY.legalName}'s website and services — outdoor storage, U-Haul rentals, moving supplies, and freight support. By reserving, renting, ordering, or otherwise using our services, you agree to these terms.`}
    >
      <Section heading="Our services">
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Outdoor storage</strong> — fenced, gated yard space rented on a monthly basis under a separate rental agreement.</li>
          <li><strong>U-Haul rentals</strong> — trucks and trailers booked through U-Haul; those rentals are subject to U-Haul&rsquo;s own agreement and terms.</li>
          <li><strong>Moving supplies</strong> — boxes, wrap, tape, and related items sold through our shop.</li>
          <li><strong>Freight &amp; logistics</strong> — receiving, loading, and related support, quoted per request.</li>
        </ul>
      </Section>

      <Section heading="Reservations, pricing & payment">
        <p>All prices are in Canadian dollars (CAD) and, where applicable, GST is added. Storage reservations are confirmed once payment and the signed rental agreement are received; a security deposit and/or administration fee may apply as set out in that agreement. We may issue invoices via Square, and card payments are processed securely by Square.</p>
        <p>Shop orders can be paid online by card or at pickup/delivery, as offered at checkout. Items are subject to availability; if something is out of stock we&rsquo;ll contact you. Delivery, where offered, may carry a fee confirmed with your order.</p>
      </Section>

      <Section heading="Returns">
        <p>{RETURN_POLICY}</p>
      </Section>

      <Section heading="Use of stored space">
        <p>You are responsible for the items you store and for complying with your rental agreement and applicable law. You may not store hazardous, illegal, perishable, or prohibited materials. We may refuse or remove items that create a safety, legal, or environmental risk. Access hours and site rules are as posted or provided in your agreement.</p>
      </Section>

      <Section heading="Liability & insurance">
        <p>To the fullest extent permitted by law, {COMPANY.legalName} is not liable for loss of or damage to stored property except where caused by our gross negligence or willful misconduct, and our total liability is limited to the amounts you paid us for the service in question. We do not insure your stored property — you are responsible for arranging your own insurance. Nothing in these terms limits rights that cannot be limited under applicable law.</p>
      </Section>

      <Section heading="Cancellations">
        <p>Storage is month-to-month unless your rental agreement states otherwise; notice requirements are set out there. Contact us at {COMPANY.email} to change or cancel a reservation, rental, or order before it is fulfilled.</p>
      </Section>

      <Section heading="Governing law">
        <p>These terms are governed by the laws of the Province of Alberta and the federal laws of Canada applicable there, and any disputes will be handled in the courts of Alberta.</p>
      </Section>

      <Section heading="Changes">
        <p>We may update these terms from time to time. The &ldquo;Last updated&rdquo; date above shows when they last changed; continued use of our services means you accept the current terms.</p>
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

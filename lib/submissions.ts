// One call for every public form: log the submission to the database (for the
// /admin dashboard), email a notification to the yard, AND email the customer a
// confirmation. All best-effort and run in parallel; none failing will reject
// the customer's request.
//
// NOTE on customer emails: Resend only delivers to arbitrary recipients once the
// sending domain (mosyard.ca) is verified. Until then these are attempted and
// skipped/blocked gracefully — the submission still succeeds.

import { recordSubmission, type SubmissionInput } from './db';
import { sendNotification, notificationHtml } from './email';
import { COMPANY } from './company';

interface NotifyOptions {
  emailHeading: string;
  emailIntro?: string;
  emailRows: [label: string, value: unknown][];
  replyTo?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Friendly, per-type confirmation copy sent to the customer. */
function customerCopy(s: SubmissionInput): { subject: string; heading: string; message: string } {
  const name = s.name?.trim().split(/\s+/)[0] || 'there';
  switch (s.type) {
    case 'order':
      return {
        subject: `We got your order — Mo's Yard (${s.reference})`,
        heading: `Thanks, ${name} — your order is in`,
        message: `We've received your supply order and we'll be in touch to arrange ${
          s.fulfillment === 'delivery' ? 'delivery' : 'pickup'
        }. Questions? Just reply to this email or call ${COMPANY.phone.display}.`,
      };
    case 'booking':
      return {
        subject: `Your reservation request — Mo's Yard (${s.reference})`,
        heading: `Thanks, ${name} — we've got your reservation request`,
        message: `We've received your request for ${s.summary}. You'll get a Square invoice for the first month by email shortly; your space is confirmed once payment and the signed rental agreement are received. Reply here or call ${COMPANY.phone.display} with any questions.`,
      };
    case 'quote':
      return {
        subject: `We received your freight quote request — Mo's Yard (${s.reference})`,
        heading: `Thanks, ${name} — your quote request is in`,
        message: `Our team will review the details and send your freight quote soon. Reply to this email or call ${COMPANY.phone.display} if anything changes.`,
      };
    default: // enquiry
      return {
        subject: `Thanks for reaching out — Mo's Yard (${s.reference})`,
        heading: `Thanks, ${name} — we got your message`,
        message: `A member of our crew will get back to you shortly. Reply to this email or call ${COMPANY.phone.display} any time.`,
      };
  }
}

export async function persistAndNotify(
  submission: SubmissionInput,
  notify: NotifyOptions
): Promise<{ saved: boolean; emailedYard: boolean; emailedCustomer: boolean }> {
  const customerEmail = submission.email?.trim();
  const canEmailCustomer = !!customerEmail && EMAIL_RE.test(customerEmail);

  // Build the customer confirmation (recap + friendly message).
  const copy = customerCopy(submission);
  const customerRecap: [string, unknown][] = [
    ['Reference', submission.reference],
    ['Summary', submission.summary],
    submission.amountCents != null ? ['Total', `$${(submission.amountCents / 100).toFixed(2)} CAD`] : null,
  ].filter(Boolean) as [string, unknown][];

  const tasks: Promise<unknown>[] = [
    recordSubmission(submission),
    // Notify the yard.
    sendNotification({
      subject: notify.emailHeading,
      html: notificationHtml({
        heading: notify.emailHeading,
        intro: notify.emailIntro,
        reference: submission.reference,
        rows: notify.emailRows,
      }),
      replyTo: notify.replyTo,
    }),
  ];

  if (canEmailCustomer) {
    tasks.push(
      sendNotification({
        to: customerEmail,
        replyTo: COMPANY.email, // replies go to the yard inbox
        subject: copy.subject,
        html: notificationHtml({
          heading: copy.heading,
          intro: copy.message,
          reference: submission.reference,
          rows: customerRecap,
        }),
      })
    );
  }

  const [saveRes, yardRes, custRes] = await Promise.allSettled(tasks);

  return {
    saved: saveRes.status === 'fulfilled' && (saveRes.value as { saved: boolean }).saved,
    emailedYard: yardRes.status === 'fulfilled' && (yardRes.value as { sent: boolean }).sent,
    emailedCustomer:
      canEmailCustomer && custRes?.status === 'fulfilled' && (custRes.value as { sent: boolean }).sent,
  };
}

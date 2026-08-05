// One call for every public form: log the submission to the database (for the
// /admin dashboard) and email a notification to the yard. Both are best-effort
// and run in parallel; neither failing will reject the customer's request.

import { recordSubmission, type SubmissionInput } from './db';
import { sendNotification, notificationHtml } from './email';

interface NotifyOptions {
  emailHeading: string;
  emailIntro?: string;
  emailRows: [label: string, value: unknown][];
  replyTo?: string;
}

export async function persistAndNotify(
  submission: SubmissionInput,
  notify: NotifyOptions
): Promise<{ saved: boolean; emailed: boolean }> {
  const [saveRes, mailRes] = await Promise.allSettled([
    recordSubmission(submission),
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
  ]);

  return {
    saved: saveRes.status === 'fulfilled' && saveRes.value.saved,
    emailed: mailRes.status === 'fulfilled' && mailRes.value.sent,
  };
}

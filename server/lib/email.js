// Sends the automated confirmation email via Resend (https://resend.com).
// Gated behind RESEND_API_KEY, exactly like DASHBOARD_PASSWORD gates the
// dashboard: if it isn't set, sending is skipped and the request still
// succeeds — a missing email provider should never block a submission.

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "";

if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
  console.warn(
    "[server] RESEND_API_KEY / RESEND_FROM_EMAIL are not set — confirmation emails will be skipped."
  );
}

const SUBJECT = "Your request to join THE SALON by Bluemind Foundation \u{1F499}";

const BODY_TEXT = `Dear Friend of THE SALON,

Thank you for requesting to join THE SALON by Bluemind Foundation, in New York on September 17, 2026.

Your request is now with us.

THE SALON by Bluemind Foundation is intentionally intimate; a gathering shaped around trust, care and beauty, and the conversations that become possible when the right people meet in the right room.

We are thoughtfully curating a community of leaders and changemakers across government, philanthropy, science, business and culture, and will be in touch shortly regarding your invitation.
We very much hope to welcome you into the room.

Until then, please save the date.

Yours, in trust,

The Bluemind Foundation LeadTeam`;

const BODY_HTML = BODY_TEXT.split("\n\n")
  .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
  .join("\n");

export async function sendConfirmationEmail({ to, icsContent }) {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject: SUBJECT,
      text: BODY_TEXT,
      html: BODY_HTML,
      attachments: [
        {
          filename: "the-salon-save-the-date.ics",
          content: Buffer.from(icsContent, "utf-8").toString("base64"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend API error (${response.status}): ${detail}`);
  }

  return { skipped: false };
}

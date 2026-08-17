// Sends the confirmation + team-notification emails entirely from the
// browser via EmailJS (https://www.emailjs.com) — no server involved.
//
// EmailJS's "public key" is designed to be shipped in client code (it's
// not a secret), so this file is meant to be filled in with real values
// and committed — no .env, no build-time env vars, no server.
//
// --- Setup (one-time) ------------------------------------------------
// 1. Create a free account at https://www.emailjs.com and connect an
//    email provider (Gmail, Outlook, SMTP, ...) as an "Email Service".
// 2. Create two "Email Templates" in the EmailJS dashboard:
//      - a "guest confirmation" template, sent {{to_email}}, using the
//        subject/body below (SUBJECT / BODY_TEXT) as its content
//      - a "team notification" template, sent to your own inbox, that
//        lists the submitted fields (use {{field_name}} placeholders
//        matching the keys built in buildTemplateParams() below)
// 3. Copy your Service ID, both Template IDs, and your Public Key
//    (Account > General) into EMAILJS_CONFIG below.

import emailjs from "@emailjs/browser";

export const EMAILJS_CONFIG = {
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  confirmationTemplateId: "YOUR_EMAILJS_CONFIRMATION_TEMPLATE_ID",
  notificationTemplateId: "YOUR_EMAILJS_NOTIFICATION_TEMPLATE_ID",
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  // Inbox that should receive a copy of every submission (acts as the
  // team's "dashboard" now that there is no server-side storage).
  notificationEmail: "YOUR_TEAM_NOTIFICATION_EMAIL",
};

export function isEmailConfigured() {
  return Object.values(EMAILJS_CONFIG).every((value) => value && !value.startsWith("YOUR_"));
}

export const CONFIRMATION_SUBJECT = "Your request to join THE SALON by Bluemind Foundation \u{1F499}";

export const CONFIRMATION_BODY = `Dear Friend of THE SALON,

Thank you for requesting to join THE SALON by Bluemind Foundation, in New York on September 17, 2026.

Your request is now with us.

THE SALON by Bluemind Foundation is intentionally intimate; a gathering shaped around trust, care and beauty, and the conversations that become possible when the right people meet in the right room.

We are thoughtfully curating a community of leaders and changemakers across government, philanthropy, science, business and culture, and will be in touch shortly regarding your invitation.
We very much hope to welcome you into the room.

Until then, please save the date.

Yours, in trust,

The Bluemind Foundation LeadTeam`;

function buildTemplateParams(entry) {
  return {
    to_email: entry.email,
    to_name: `${entry.firstName} ${entry.lastName}`.trim(),
    subject: CONFIRMATION_SUBJECT,
    message: CONFIRMATION_BODY,
    first_name: entry.firstName,
    last_name: entry.lastName,
    email: entry.email,
    organization: entry.organization,
    role: entry.role,
    linkedin: entry.linkedin,
    about_you: entry.aboutYou,
    hear_about: entry.hearAboutOther ? `${entry.hearAbout} (${entry.hearAboutOther})` : entry.hearAbout,
    referral: entry.refFirstName
      ? `${entry.refFirstName} ${entry.refLastName} — ${entry.refEmail}, ${entry.refRole} at ${entry.refOrganization}`
      : "",
    contributions: entry.contributionOther
      ? [...entry.contributions.filter((c) => c !== "Other"), `Other: ${entry.contributionOther}`].join(", ")
      : entry.contributions.join(", "),
    notification_email: EMAILJS_CONFIG.notificationEmail,
    submitted_at: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
  };
}

// Sends both emails in parallel. Throws if EmailJS isn't configured yet,
// or if either send fails, so the caller can show a clear error instead
// of silently losing the request (there is no server fallback storage).
export async function sendInvitationEmails(entry) {
  if (!isEmailConfigured()) {
    throw new Error("Email sending is not configured yet.");
  }

  const params = buildTemplateParams(entry);

  await Promise.all([
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.confirmationTemplateId, params, {
      publicKey: EMAILJS_CONFIG.publicKey,
    }),
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.notificationTemplateId, params, {
      publicKey: EMAILJS_CONFIG.publicKey,
    }),
  ]);
}

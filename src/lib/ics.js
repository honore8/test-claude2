// Provisional "Save the Date" calendar invite for THE SALON, built and
// downloaded entirely client-side — no server involved.
// STATUS:TENTATIVE so calendar apps show it as pending, not confirmed.

const VTIMEZONE_NEW_YORK = `BEGIN:VTIMEZONE
TZID:America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`;

function foldLine(line) {
  if (line.length <= 75) return line;
  const chunks = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function escapeText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function uid() {
  const random = (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random()}`;
  return `${random}@thesalon.invalid`;
}

export function buildSaveTheDateIcs({ attendeeName } = {}) {
  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const summary = "THE SALON by Bluemind Foundation - Save the Date / Invitation pending confirmation";
  const description = escapeText(
    `Dear ${attendeeName || "Friend of THE SALON"}, this calendar hold reserves September 17, 2026, ` +
      "4:00-8:00 PM (New York time) for THE SALON by Bluemind Foundation. " +
      "This is a provisional save-the-date only; your invitation is still pending confirmation."
  );

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bluemind Foundation//THE SALON//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    VTIMEZONE_NEW_YORK,
    "BEGIN:VEVENT",
    `UID:${uid()}`,
    `DTSTAMP:${dtStamp}`,
    "DTSTART;TZID=America/New_York:20260917T160000",
    "DTEND;TZID=America/New_York:20260917T200000",
    "STATUS:TENTATIVE",
    "TRANSP:OPAQUE",
    foldLine(`SUMMARY:${escapeText(summary)}`),
    foldLine(`DESCRIPTION:${description}`),
    "LOCATION:New York, NY",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}

export function downloadSaveTheDateIcs(attendeeName) {
  const ics = buildSaveTheDateIcs({ attendeeName });
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "the-salon-save-the-date.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

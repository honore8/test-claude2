import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "submissions.json");
const DIST_DIR = path.join(__dirname, "..", "dist");
const PORT = process.env.PORT || 3001;
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "";

if (!DASHBOARD_PASSWORD) {
  console.warn(
    "[server] DASHBOARD_PASSWORD is not set — the dashboard will refuse all logins until you set it in .env."
  );
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "200kb" }));

// --- data helpers ---------------------------------------------------------

let writeQueue = Promise.resolve();

async function readSubmissions() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

function appendSubmission(entry) {
  writeQueue = writeQueue.then(async () => {
    const submissions = await readSubmissions();
    submissions.push(entry);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  });
  return writeQueue;
}

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// --- public: invitation submission ----------------------------------------

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "organization",
  "role",
  "aboutYou",
  "hearAbout",
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/invitations", async (req, res) => {
  const body = req.body || {};

  for (const field of REQUIRED_FIELDS) {
    if (!String(body[field] ?? "").trim()) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  if (!EMAIL_RE.test(String(body.email).trim())) {
    return res.status(400).json({ error: "Invalid email address." });
  }
  if (!Array.isArray(body.contributions) || body.contributions.length === 0) {
    return res.status(400).json({ error: "Please select at least one way to contribute." });
  }
  if (!body.consent) {
    return res.status(400).json({ error: "Consent is required." });
  }

  const entry = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName).trim(),
    email: String(body.email).trim(),
    organization: String(body.organization).trim(),
    role: String(body.role).trim(),
    linkedin: String(body.linkedin ?? "").trim(),
    aboutYou: String(body.aboutYou).trim(),
    hearAbout: String(body.hearAbout).trim(),
    hearAboutOther: String(body.hearAboutOther ?? "").trim(),
    refFirstName: String(body.refFirstName ?? "").trim(),
    refLastName: String(body.refLastName ?? "").trim(),
    refEmail: String(body.refEmail ?? "").trim(),
    refOrganization: String(body.refOrganization ?? "").trim(),
    refRole: String(body.refRole ?? "").trim(),
    contributions: body.contributions.map(String),
    contributionOther: String(body.contributionOther ?? "").trim(),
  };

  try {
    await appendSubmission(entry);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[server] failed to save submission", err);
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

// --- dashboard auth ---------------------------------------------------------

const loginAttempts = new Map(); // ip -> { count, first }
const RATE_WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now - rec.first > RATE_WINDOW_MS) return false;
  return rec.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now - rec.first > RATE_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, first: now });
  } else {
    rec.count += 1;
  }
}

function requireDashboardAuth(req, res, next) {
  if (!DASHBOARD_PASSWORD) {
    return res.status(503).json({ error: "Dashboard password is not configured on the server." });
  }
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !safeCompare(token, DASHBOARD_PASSWORD)) {
    return res.status(401).json({ error: "Invalid password." });
  }
  next();
}

app.post("/api/dashboard/login", (req, res) => {
  if (!DASHBOARD_PASSWORD) {
    return res.status(503).json({ error: "Dashboard password is not configured on the server." });
  }
  if (isRateLimited(req.ip)) {
    return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
  }
  const { password } = req.body || {};
  if (!password || !safeCompare(password, DASHBOARD_PASSWORD)) {
    recordFailedAttempt(req.ip);
    return res.status(401).json({ error: "Invalid password." });
  }
  res.json({ ok: true });
});

app.get("/api/dashboard/submissions", requireDashboardAuth, async (req, res) => {
  const submissions = await readSubmissions();
  submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json({ submissions });
});

const EXPORT_COLUMNS = [
  { header: "Submitted At", key: "submittedAt", width: 22 },
  { header: "First Name", key: "firstName", width: 16 },
  { header: "Last Name", key: "lastName", width: 16 },
  { header: "Email", key: "email", width: 28 },
  { header: "Organization", key: "organization", width: 24 },
  { header: "Role / Title", key: "role", width: 20 },
  { header: "LinkedIn", key: "linkedin", width: 28 },
  { header: "About You", key: "aboutYou", width: 50 },
  { header: "Heard About", key: "hearAbout", width: 24 },
  { header: "Heard About (Other)", key: "hearAboutOther", width: 20 },
  { header: "Referral First Name", key: "refFirstName", width: 16 },
  { header: "Referral Last Name", key: "refLastName", width: 16 },
  { header: "Referral Email", key: "refEmail", width: 24 },
  { header: "Referral Organization", key: "refOrganization", width: 22 },
  { header: "Referral Role", key: "refRole", width: 20 },
  { header: "Contributions", key: "contributions", width: 50 },
  { header: "Contribution (Other)", key: "contributionOther", width: 20 },
];

app.get("/api/dashboard/export", requireDashboardAuth, async (req, res) => {
  const submissions = await readSubmissions();
  submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Requests");
  sheet.columns = EXPORT_COLUMNS;
  sheet.getRow(1).font = { bold: true };

  for (const entry of submissions) {
    sheet.addRow({
      ...entry,
      contributions: (entry.contributions || []).join(", "),
    });
  }

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="the-salon-requests-${new Date().toISOString().slice(0, 10)}.xlsx"`
  );
  await workbook.xlsx.write(res);
  res.end();
});

// --- serve the built frontend in production ---------------------------------

if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

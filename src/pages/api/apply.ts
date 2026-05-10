// src/pages/api/apply.ts
// Serverless endpoint — NOT pre-rendered (runs on Vercel Edge / Node runtime)
export const prerender = false;;

import type { APIRoute } from "astro";
import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";
import { Readable } from "stream";
import type { IncomingMessage } from "http";

// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 applications
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/* ─── helpers ─────────────────────────────────────────────────────────────── */

/** Convert a Web Request body into a Node IncomingMessage so formidable can parse it. */
async function requestToNodeIncoming(request: Request): Promise<IncomingMessage> {
  const body = await request.arrayBuffer();
  const readable = new Readable({
    read() {
      this.push(Buffer.from(body));
      this.push(null);
    },
  }) as unknown as IncomingMessage;

  // formidable reads headers from the fake IncomingMessage
  const headers = Object.fromEntries(request.headers.entries());
  readable.headers = headers;
  readable.method = request.method;
  readable.url = "";

  return readable;
}

/** Build an authenticated Google Drive client from env vars. */
function getDriveClient() {
  const email = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = import.meta.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) throw new Error("Google Service Account env vars missing.");

  const privateKey = rawKey.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return google.drive({ version: "v3", auth });
}

/* ─── route handler ───────────────────────────────────────────────────────── */

export const POST: APIRoute = async ({ request }) => {
  try {
    // --- Rate Limiting ---
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const limitRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
    
    if (now > limitRecord.resetTime) {
      limitRecord.count = 0;
      limitRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }
    
    if (limitRecord.count >= RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ success: false, error: "Too many applications submitted. Please try again later." }), {
        status: 429, headers: { "Content-Type": "application/json" },
      });
    }
    limitRecord.count++;
    rateLimitMap.set(ip, limitRecord);

    // --- Parsing Form ---
    const nodeReq = await requestToNodeIncoming(request);
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10 MB limit

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => form.parse(nodeReq, (err, f, fi) => (err ? reject(err) : resolve([f, fi])))
    );

    const name    = (fields.name?.[0]    ?? "Unknown").toString();
    const email   = (fields.email?.[0]   ?? "").toString();
    const role    = (fields.role?.[0]    ?? "General Application").toString();
    const cvFile  = Array.isArray(files.cv) ? files.cv[0] : files.cv;

    // --- File Validation ---
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!cvFile) {
      return new Response(JSON.stringify({ success: false, error: "No CV file attached." }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    if (!allowedMimeTypes.includes(cvFile.mimetype ?? "")) {
      return new Response(JSON.stringify({ success: false, error: "Invalid file type. Only PDF and Word documents are allowed." }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Upload to Google Drive
    const drive       = getDriveClient();
    const folderId    = import.meta.env.GOOGLE_DRIVE_FOLDER_ID;
    const timestamp   = new Date().toISOString().slice(0, 10);
    const safeName    = name.replace(/[^a-z0-9]/gi, "_");
    const ext         = cvFile.originalFilename?.split(".").pop() ?? "pdf";
    const driveFileName = `CV_${safeName}_${timestamp}.${ext}`;

    await drive.files.create({
      requestBody: {
        name: driveFileName,
        parents: folderId ? [folderId] : [],
        description: `Applicant: ${name} | Email: ${email} | Role: ${role}`,
      },
      media: {
        mimeType: cvFile.mimetype ?? "application/octet-stream",
        body: fs.createReadStream(cvFile.filepath),
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    console.error("[apply.ts]", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};

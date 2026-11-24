import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Contact form input schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  intent: z.enum([
    "full-time",
    "consulting",
    "advisory",
    "collaboration",
    "general",
  ]),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(3000, "Message cannot exceed 3,000 characters"),
  // Honeypot field - must be empty
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  // Timestamp to detect instant bot submission (<1.5 seconds)
  loadedAt: z.number().optional(),
});

// In-memory sliding-window rate limiter (5 submissions per 15 minutes per IP)
const ipContactAttempts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipContactAttempts.get(ip) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_ATTEMPTS_PER_WINDOW) {
    ipContactAttempts.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  ipContactAttempts.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit reached. Please wait a few minutes before submitting again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify the form inputs.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, intent, message, loadedAt } = result.data;

    // 3. Time-based bot defense (rejected if submitted in under 1200ms)
    if (loadedAt && Date.now() - loadedAt < 1200) {
      return NextResponse.json(
        { success: false, error: "Submission too fast. Please retry." },
        { status: 400 }
      );
    }

    // 4. Log or dispatch email
    console.log(`[CONTACT_SUBMISSION] From: ${name} <${email}> | Intent: ${intent} | Message len: ${message.length}`);

    // Optional provider integration (Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_TO_EMAIL || "smartds2550@gmail.com";

    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [recipientEmail],
            reply_to: email,
            subject: `[Portfolio] New message from ${name} (${intent})`,
            text: `Name: ${name}\nEmail: ${email}\nIntent: ${intent}\n\nMessage:\n${message}`,
          }),
        });
      } catch (emailErr) {
        console.error("[CONTACT_DISPATCH_ERROR]", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! I've received your message and will reply within 24 hours.",
    });
  } catch (err: unknown) {
    console.error("[CONTACT_API_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your message. Please reach out via email directly.",
      },
      { status: 500 }
    );
  }
}


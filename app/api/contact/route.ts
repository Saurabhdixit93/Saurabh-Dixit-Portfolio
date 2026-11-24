import { NextRequest, NextResponse } from "next/server";
import { contactRateLimiter } from "@/lib/rateLimit";
import { contactSchema } from "./schema";

/**
 * Strips HTML tags and excessive whitespace to guard against stored XSS and log injection.
 */
function sanitizeInput(input: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Sliding-window rate limit check (5 requests per 15 min per IP)
    const rateLimit = contactRateLimiter.check(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rate limit reached. Please wait a few minutes before submitting again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 60),
          },
        }
      );
    }

    // 2. Parse and validate request body
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

    const { email, intent, website, loadedAt } = result.data;
    const name = sanitizeInput(result.data.name);
    const message = sanitizeInput(result.data.message);

    // 3. Honeypot check (defense in depth in addition to zod schema)
    if (website && website.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify the form inputs.",
          fieldErrors: { website: "Bot detected" },
        },
        { status: 400 }
      );
    }

    // 4. Time-based bot defense (rejected if submitted in under 1200ms)
    if (loadedAt && Date.now() - loadedAt < 1200) {
      return NextResponse.json(
        { success: false, error: "Submission too fast. Please retry." },
        { status: 400 }
      );
    }

    // 5. Log structured event for telemetry
    console.log(
      `[CONTACT_SUBMISSION] From: ${name} <${email}> | Intent: ${intent} | Message len: ${message.length}`
    );

    // 6. Optional email dispatch via Resend REST API
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CONTACT_TO_EMAIL ||
      process.env.CONTACT_EMAIL ||
      "smartds2550@gmail.com";

    if (resendApiKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
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

        if (!emailRes.ok) {
          console.error(
            `[CONTACT_DISPATCH_WARNING] Resend returned status ${emailRes.status}`
          );
        }
      } catch (emailErr) {
        console.error("[CONTACT_DISPATCH_ERROR]", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for reaching out! I've received your message and will reply within 24 hours.",
    });
  } catch (err: unknown) {
    console.error("[CONTACT_API_ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred while processing your message. Please reach out via email directly.",
      },
      { status: 500 }
    );
  }
}

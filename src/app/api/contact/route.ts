import { NextRequest, NextResponse } from "next/server";

// Prevent Next.js from pre-rendering this route at build time
export const dynamic = "force-dynamic";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "empoweryourcore1@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Empower Your Core <noreply@empoweryourcore.nl>",
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: subject || "Nieuw contactformulier bericht",
      html: `
        <h2>Nieuw bericht via contactformulier</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Onderwerp:</strong> ${subject || "Geen onderwerp"}</p>
        <hr />
        <p><strong>Bericht:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

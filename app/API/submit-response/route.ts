import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response, answer, timestamp, date } = body;

    console.log("Valentine Response Received:", { response, answer, timestamp, date });

    await sendEmailNotification(response, answer, timestamp, date);

    return NextResponse.json({ success: true, message: "Email notification sent." });
  } catch (error) {
    console.error("Error processing response:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process response" },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  // Hard‑coded sender and recipient email (your address)
  const SENDGRID_FROM = "dhruvjae.guboc@hcdc.edu.ph";
  const SENDGRID_RECIPIENT = "dhruvjae.guboc@hcdc.edu.ph";

  if (!SENDGRID_API_KEY) {
    console.error("SendGrid: API key not configured. Skipping email.");
    return;
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);

    const text = `Valentine Response: ${answer}\nResponse: ${response}\nTime: ${timestamp}\nDate: ${date}`;

    const msg = {
      to: SENDGRID_RECIPIENT,
      from: SENDGRID_FROM, // must be verified in SendGrid
      subject: "Valentine Response",
      text,
      html: `
        <h2>${answer}</h2>
        <p><strong>Response:</strong> ${response}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
        <p><strong>Date:</strong> ${date}</p>
      `,
    };

    const result = await sgMail.send(msg as any);
    console.log(
      "SendGrid: Email send result",
      Array.isArray(result) ? result[0].statusCode : result
    );
  } catch (err) {
    console.error("SendGrid error:", err);
  }
}

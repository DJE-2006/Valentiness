import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response, answer, timestamp, date } = body;

    console.log('Valentine Response Received:', {
      response,
      answer,
      timestamp,
      date
    });

    // Send to Formspree
    await sendToFormspree(response, answer, timestamp, date);

    // Send to Google Forms
    await sendToGoogleForms(response, answer, timestamp, date);

    // Send to Telegram (optional)
    await sendToTelegram(response, answer, timestamp, date);

    return NextResponse.json({ 
      success: true, 
      message: 'Response recorded successfully!' 
    });
  } catch (error) {
    console.error('Error processing response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process response' },
      { status: 500 }
    );
  }
}

async function sendToFormspree(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  // SETUP: Replace with your Formspree endpoint
  const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'YOUR_FORMSPREE_ENDPOINT';

  if (FORMSPREE_ENDPOINT === 'YOUR_FORMSPREE_ENDPOINT') {
    console.log('Formspree: Please set up your endpoint first!');
    return;
  }
  try {
    const formData = new URLSearchParams();
    formData.append('response', response);
    formData.append('answer', answer);
    formData.append('timestamp', timestamp);
    formData.append('date', date);

    const res = await axios.post(FORMSPREE_ENDPOINT, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (res.status >= 200 && res.status < 300) {
      console.log('Formspree: Response sent successfully!');
    } else {
      console.error('Formspree: Failed to send response', res.status);
    }
  } catch (error) {
    console.error('Formspree error:', error);
  }
}

async function sendToGoogleForms(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  // SETUP: Replace with your Google Forms details
  const GOOGLE_FORM_ID = process.env.GOOGLE_FORM_ID || 'YOUR_GOOGLE_FORM_ID';
  const ENTRY_RESPONSE = process.env.ENTRY_RESPONSE || 'entry.123456789';
  const ENTRY_ANSWER = process.env.ENTRY_ANSWER || 'entry.987654321';
  const ENTRY_TIMESTAMP = process.env.ENTRY_TIMESTAMP || 'entry.111111111';
  const ENTRY_DATE = process.env.ENTRY_DATE || 'entry.222222222';

  if (GOOGLE_FORM_ID === 'YOUR_GOOGLE_FORM_ID') {
    console.log('Google Forms: Please set up your form first!');
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append(ENTRY_RESPONSE, response);
    formData.append(ENTRY_ANSWER, answer);
    formData.append(ENTRY_TIMESTAMP, timestamp);
    formData.append(ENTRY_DATE, date);

    const googleFormUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

    const res = await axios.post(googleFormUrl, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (res.status >= 200 && res.status < 300) {
      console.log('Google Forms: Response sent successfully!');
    } else {
      console.error('Google Forms: Failed to send response', res.status);
    }
  } catch (error) {
    console.error('Google Forms error:', error);
  }
}

async function sendToTelegram(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

  if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID') {
    console.log('Telegram: Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID');
    return;
  }

  try {
    const text = `Valentine Response: ${answer}\nResponse: ${response}\nTime: ${timestamp}\nDate: ${date}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const res = await axios.post(url, { chat_id: TELEGRAM_CHAT_ID, text });

    if (res.status >= 200 && res.status < 300) {
      console.log('Telegram: Message sent successfully!');
    } else {
      console.error('Telegram: Failed to send message', res.status, res.data);
    }
  } catch (error) {
    console.error('Telegram error:', error);
  }
}
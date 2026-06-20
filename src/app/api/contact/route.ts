import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not defined in environment variables');
      return NextResponse.json({ error: 'Mail server configuration error' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const data = await request.json();
    console.log('API route received data:', data);
    
    if (!data.name || !data.email || !data.message || data.mathAnswer === undefined || !data.mathHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify captcha
    const parsedAnswer = parseInt(String(data.mathAnswer).trim(), 10);
    const expectedHash = String(parsedAnswer * 43 + 17);
    if (expectedHash !== data.mathHash) {
      return NextResponse.json({ error: 'Incorrect security answer' }, { status: 400 });
    }

    // Resend ile email gönder
    const { data: emailData, error } = await resend.emails.send({
      from: 'Contact Form <contact@jes.ch>',
      to: ['eren.yigit.aydin@gmail.com'],
      subject: `Yeni İletişim Formu - ${data.name}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><strong>İsim:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${data.message}</p>
        <hr>
        <p><small>Bu mesaj lebenslauf portfolio contact form'undan gönderildi.</small></p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Email sending failed', details: error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', emailData);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

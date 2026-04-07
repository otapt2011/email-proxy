import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, subject, html, from } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'Missing to/subject' });

  try {
    const { data, error } = await resend.emails.send({
      from: from || 'onboarding@resend.dev',
      to,
      subject,
      html: html || `<p>${subject}</p>`,
    });
    if (error) throw new Error(error.message);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// server/config/mailer.js
// Uses Brevo SMTP — works on Render, sends to any email address
// ─────────────────────────────────────────────────────────────────────────────
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.BREVO_USER;
  const pass = process.env.BREVO_PASS;

  if (!user || !pass) {
    console.error('❌ BREVO_USER or BREVO_PASS missing from environment');
    return null;
  }

  return nodemailer.createTransport({
    host:   'smtp-relay.brevo.com',
    port:   587,
    secure: false,
    auth:   { user, pass },
    tls:    { rejectUnauthorized: false }
  });
};

const FROM_EMAIL = '"TEN9 Ministries India" <ten9india@gmail.com>';

// ─── Internal send function ───────────────────────────────────────────────────
const sendMail = async ({ to, subject, text, html }, label) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  try {
    console.log(`\n📧 [${label}] To: ${to} | Subject: ${subject}`);
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to, subject, text, html
    });
    console.log(`✅ [${label}] Sent — MessageId: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ [${label}] Failed: ${err.message}`);
    return false;
  }
};

// ─── 1. OTP Email ─────────────────────────────────────────────────────────────
exports.sendOTPEmail = async (helperName, helperEmail, otp) => {
  return sendMail({
    to: helperEmail,
    subject: `TEN9 Ministries India - Your Verification Code: ${otp}`,
    text: `Hi ${helperName},\n\nYour TEN9 verification code is: ${otp}\n\nValid for 10 minutes.\n\nWith love,\nTeam Ten9 India`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ecd7;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
<tr><td style="background:#8B1A1A;padding:24px;text-align:center;">
  <h1 style="color:#c8a96e;font-size:22px;margin:0;">TEN9 Ministries India</h1>
  <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:6px 0 0;">ROMANS 10:9</p>
</td></tr>
<tr><td style="padding:36px;">
  <h2 style="color:#8B1A1A;text-align:center;margin-bottom:16px;">Email Verification</h2>
  <p style="color:#444;font-size:15px;line-height:1.8;">Hi <strong>${helperName}</strong>,</p>
  <p style="color:#444;font-size:15px;">Use the code below to complete your registration:</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
  <tr><td style="background:#8B1A1A;border-radius:10px;padding:28px;text-align:center;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 10px;letter-spacing:2px;">VERIFICATION CODE</p>
    <p style="color:#c8a96e;font-size:48px;font-weight:bold;letter-spacing:16px;margin:0;font-family:monospace;">${otp}</p>
    <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:10px 0 0;">Valid for 10 minutes only</p>
  </td></tr>
  </table>
  <p style="color:#888;font-size:12px;text-align:center;">If you did not register, ignore this email.</p>
</td></tr>
<tr><td style="background:#f5ecd7;padding:20px;border-top:1px solid #e8d4a0;text-align:center;">
  <p style="color:#8B1A1A;font-size:13px;margin:0;">With love, <strong>Team Ten9 India</strong></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  }, 'OTP');
};

// ─── 2. Welcome Email ─────────────────────────────────────────────────────────
exports.sendWelcomeEmail = async (helperName, helperEmail) => {
  return sendMail({
    to: helperEmail,
    subject: 'Welcome to TEN9 Ministries India',
    text: `Hi ${helperName},\n\nWelcome to the Ten9 India Family!\n\nThank you for joining the Ten9 India mailing list!\nWe are excited to have you with us. You will now be the first to receive updates about our latest content, events, announcements, and special opportunities.\n\nWe are grateful to have you as part of the community and cannot wait to share what is ahead.\nStay connected - something exciting is coming soon!\n\nWith love,\nTeam Ten9 India`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ecd7;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
<tr><td style="background:#8B1A1A;padding:28px;text-align:center;">
  <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
  <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:8px 0 0;">ROMANS 10:9</p>
</td></tr>
<tr><td style="padding:36px 40px;">
  <h2 style="color:#8B1A1A;">Welcome to the Ten9 India Family!</h2>
  <p style="color:#444;font-size:16px;line-height:1.9;">Hi <strong>${helperName}</strong>,</p>
  <p style="color:#444;font-size:16px;line-height:1.9;">Thank you for joining the Ten9 India mailing list!</p>
  <p style="color:#444;font-size:16px;line-height:1.9;">We are excited to have you with us. You will now be the first to receive updates about our latest content, events, announcements, and special opportunities.</p>
  <p style="color:#444;font-size:16px;line-height:1.9;">We are grateful to have you as part of the community and cannot wait to share what is ahead.</p>
  <p style="color:#444;font-size:16px;line-height:1.9;">Stay connected - something exciting is coming soon!</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
  <tr><td style="background:#8B1A1A;border-radius:8px;padding:20px;text-align:center;">
    <p style="color:rgba(255,255,255,0.9);font-size:13px;font-style:italic;margin:0;line-height:1.8;">"If you declare with your mouth, Jesus is Lord... you will be saved." - Romans 10:9</p>
  </td></tr>
  </table>
</td></tr>
<tr><td style="background:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
  <p style="color:#444;font-size:14px;margin:0;">With love,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong><br>
  <a href="mailto:ten9india@gmail.com" style="color:#a07840;">ten9india@gmail.com</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  }, 'WELCOME');
};

// ─── 3. Payment Thank-You Email ───────────────────────────────────────────────
exports.sendPaymentThankYou = async (helperName, helperEmail, amount) => {
  return sendMail({
    to: helperEmail,
    subject: 'TEN9 Ministries India - Thank You for Your Support',
    text: `Dear ${helperName},\n\nThank you for your generous support${amount ? ` of Rs.${amount}` : ''}.\n"Every gift becomes a blessing to someone in need."\n\nGod bless you!\n\nWith gratitude,\nTeam Ten9 India`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ecd7;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
<tr><td style="background:#8B1A1A;padding:28px;text-align:center;">
  <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
</td></tr>
<tr><td style="padding:36px 40px;">
  <h2 style="color:#8B1A1A;text-align:center;">Thank You for Your Support!</h2>
  <p style="color:#444;font-size:16px;line-height:1.9;">Dear <strong>${helperName}</strong>,</p>
  <p style="color:#444;font-size:16px;line-height:1.9;">We received your generous support${amount ? ` of <strong>Rs.${amount}</strong>` : ''}.</p>
  <div style="background:#f5ecd7;border-left:4px solid #c8a96e;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
    <p style="color:#5c3d2e;font-size:15px;margin:0;font-style:italic;">"Every gift becomes a blessing to someone in need."</p>
  </div>
  <p style="color:#444;font-size:16px;">God bless you abundantly!</p>
</td></tr>
<tr><td style="background:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
  <p style="color:#444;font-size:14px;margin:0;">With gratitude,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  }, 'PAYMENT');
};

// ─── 4. Contact Notification ──────────────────────────────────────────────────
exports.sendContactNotification = async (contactData) => {
  return sendMail({
    to: process.env.OWNER_EMAIL || 'ten9india@gmail.com',
    subject: `TEN9 Contact Form - ${contactData.subject}`,
    text: `Name: ${contactData.fullName}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\nMessage: ${contactData.message}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ecd7;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
<tr><td style="background:#8B1A1A;padding:20px 28px;">
  <h2 style="color:#c8a96e;margin:0;">New Contact Form Submission</h2>
</td></tr>
<tr><td style="padding:28px 32px;">
  <p><strong>Name:</strong> ${contactData.fullName}</p>
  <p><strong>Email:</strong> ${contactData.email}</p>
  <p><strong>Subject:</strong> ${contactData.subject}</p>
  <div style="background:white;border-left:4px solid #8B1A1A;padding:16px;margin-top:16px;">
    <p style="margin:0;color:#444;">${contactData.message}</p>
  </div>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  }, 'CONTACT');
};

// ─── 5. Announcement Email ────────────────────────────────────────────────────
exports.sendAnnouncementEmail = async (helperName, helperEmail, title, matter) => {
  return sendMail({
    to: helperEmail,
    subject: `TEN9 Ministries India - New Announcement: ${title}`,
    text: `Hi ${helperName},\n\nNew Announcement: ${title}\n\n${matter}\n\nWith love,\nTeam Ten9 India`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5ecd7;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
<tr><td style="background:#8B1A1A;padding:28px;text-align:center;">
  <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
</td></tr>
<tr><td style="padding:36px 40px;">
  <h2 style="color:#8B1A1A;">${title}</h2>
  <p style="color:#444;font-size:15px;line-height:1.9;">Hi <strong>${helperName}</strong>,</p>
  <div style="background:white;border:1px solid #e8d4a0;border-radius:8px;padding:24px;">
    <p style="color:#444;font-size:15px;margin:0;">${matter}</p>
  </div>
</td></tr>
<tr><td style="background:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
  <p style="color:#444;font-size:14px;margin:0;">With love,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
  }, 'ANNOUNCEMENT');
};

// ─── 6. Verify on Startup ─────────────────────────────────────────────────────
exports.verifySMTP = async () => {
  const user = process.env.BREVO_USER;
  const pass = process.env.BREVO_PASS;
  if (!user || !pass) {
    console.error('❌ BREVO_USER or BREVO_PASS not set — emails will NOT work');
    return;
  }
  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log(`✅ Brevo SMTP verified — emails will be sent from ${user}`);
  } catch (err) {
    console.error('❌ Brevo SMTP verification failed:', err.message);
  }
};
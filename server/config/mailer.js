// ─────────────────────────────────────────────────────────────────────────────
// server/config/mailer.js
// Uses Resend (resend.com) — works perfectly on Render, lands in inbox
// ─────────────────────────────────────────────────────────────────────────────
const { Resend } = require('resend');

// Resend client — initialized once
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing from environment variables');
    return null;
  }
  return new Resend(apiKey);
};

// From address — Resend free tier allows sending from onboarding@resend.dev
// Once you verify your domain, change to: "TEN9 Ministries India <noreply@yourdomain.com>"
const FROM_EMAIL = process.env.RESEND_FROM || 'TEN9 Ministries India <onboarding@resend.dev>';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'ten9india@gmail.com';

// ─────────────────────────────────────────────────────────────────────────────
// Internal send function
// ─────────────────────────────────────────────────────────────────────────────
const sendMail = async ({ to, subject, text, html }, label) => {
  const resend = getResend();
  if (!resend) return false;

  try {
    console.log(`\n📧 [${label}] To: ${to} | Subject: ${subject}`);
    const { data, error } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      [to],
      subject,
      text,
      html
    });

    if (error) {
      console.error(`❌ [${label}] Resend error:`, error.message || JSON.stringify(error));
      return false;
    }

    console.log(`✅ [${label}] Sent — id: ${data?.id}`);
    return true;
  } catch (err) {
    console.error(`❌ [${label}] Failed:`, err.message);
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. OTP Verification Email
// ─────────────────────────────────────────────────────────────────────────────
exports.sendOTPEmail = async (helperName, helperEmail, otp) => {
  return sendMail({
    to:      helperEmail,
    subject: `TEN9 Ministries India - Your Verification Code: ${otp}`,
    text: [
      `Hi ${helperName},`,
      ``,
      `Your TEN9 Ministries India email verification code is: ${otp}`,
      ``,
      `This code is valid for 10 minutes.`,
      `If you did not request this, please ignore this email.`,
      ``,
      `With love,`,
      `Team Ten9 India`,
      `ten9india@gmail.com`
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Email Verification - TEN9 Ministries India</title>
</head>
<body style="margin:0;padding:0;background-color:#f5ecd7;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ecd7;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
        <tr><td style="background-color:#8B1A1A;padding:24px;text-align:center;">
          <h1 style="color:#c8a96e;font-size:22px;margin:0;font-family:Georgia,serif;">TEN9 Ministries India</h1>
          <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:6px 0 0;">ROMANS 10:9</p>
        </td></tr>
        <tr><td style="padding:36px 36px 20px;">
          <h2 style="color:#8B1A1A;font-size:20px;margin:0 0 16px;text-align:center;">Email Verification</h2>
          <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 12px;">Hi <strong>${helperName}</strong>,</p>
          <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 24px;">Use the one-time code below to complete your registration.</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#8B1A1A;border-radius:10px;padding:28px 20px;text-align:center;">
              <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 10px;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
              <p style="color:#c8a96e;font-size:46px;font-weight:bold;letter-spacing:16px;margin:0;font-family:'Courier New',monospace;">${otp}</p>
              <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:10px 0 0;">Valid for 10 minutes only</p>
            </td></tr>
          </table>
          <p style="color:#888;font-size:12px;text-align:center;margin:20px 0 0;">If you did not register, please ignore this email.</p>
        </td></tr>
        <tr><td style="background-color:#f5ecd7;padding:20px 36px;border-top:1px solid #e8d4a0;">
          <p style="color:#8B1A1A;font-size:13px;margin:0;text-align:center;">With love, <strong>Team Ten9 India</strong></p>
          <p style="color:#a07840;font-size:11px;margin:6px 0 0;text-align:center;font-style:italic;">"If you declare with your mouth, Jesus is Lord... you will be saved." - Romans 10:9</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
  }, 'OTP');
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Welcome Email
// ─────────────────────────────────────────────────────────────────────────────
exports.sendWelcomeEmail = async (helperName, helperEmail) => {
  return sendMail({
    to:      helperEmail,
    subject: 'Welcome to TEN9 Ministries India',
    text: [
      `Hi ${helperName},`,
      ``,
      `Welcome to the Ten9 India Family!`,
      ``,
      `Thank you for joining the Ten9 India mailing list!`,
      `We are excited to have you with us. You will now be the first to receive`,
      `updates about our latest content, events, announcements, and special opportunities.`,
      ``,
      `We are grateful to have you as part of the community and cannot wait to share what is ahead.`,
      `Stay connected - something exciting is coming soon!`,
      ``,
      `With love,`,
      `Team Ten9 India`,
      `ten9india@gmail.com`
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to TEN9 Ministries India</title></head>
<body style="margin:0;padding:0;background-color:#f5ecd7;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ecd7;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
        <tr><td style="background-color:#8B1A1A;padding:28px;text-align:center;">
          <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
          <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:8px 0 0;">ROMANS 10:9</p>
        </td></tr>
        <tr><td style="padding:36px 40px 28px;">
          <h2 style="color:#8B1A1A;font-size:22px;margin:0 0 20px;">Welcome to the Ten9 India Family!</h2>
          <p style="color:#444;font-size:16px;line-height:1.9;margin:0 0 14px;">Hi <strong>${helperName}</strong>,</p>
          <p style="color:#444;font-size:16px;line-height:1.9;margin:0 0 14px;">Thank you for joining the Ten9 India mailing list!</p>
          <p style="color:#444;font-size:16px;line-height:1.9;margin:0 0 14px;">We are excited to have you with us. You will now be the first to receive updates about our latest content, events, announcements, and special opportunities.</p>
          <p style="color:#444;font-size:16px;line-height:1.9;margin:0 0 14px;">We are grateful to have you as part of the community and cannot wait to share what is ahead.</p>
          <p style="color:#444;font-size:16px;line-height:1.9;margin:0 0 28px;">Stay connected - something exciting is coming soon!</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#8B1A1A;border-radius:8px;padding:20px;text-align:center;">
              <p style="color:rgba(255,255,255,0.9);font-size:13px;font-style:italic;margin:0;line-height:1.8;">"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised Him from the dead, you will be saved." - Romans 10:9</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
          <p style="color:#444;font-size:14px;margin:0;line-height:1.8;">With love,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong><br><a href="mailto:ten9india@gmail.com" style="color:#a07840;font-size:12px;">ten9india@gmail.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  }, 'WELCOME');
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Payment Thank-You Email
// ─────────────────────────────────────────────────────────────────────────────
exports.sendPaymentThankYou = async (helperName, helperEmail, amount) => {
  return sendMail({
    to:      helperEmail,
    subject: 'TEN9 Ministries India - Thank You for Your Support',
    text: [
      `Dear ${helperName},`,
      ``,
      `Thank you for your generous support${amount ? ` of Rs.${amount}` : ''}.`,
      `Your contribution goes directly towards our ministry programs, child care, and community outreach.`,
      `"Every gift becomes a blessing to someone in need."`,
      ``,
      `You are making a real difference. God bless you abundantly!`,
      ``,
      `With gratitude and love,`,
      `Team Ten9 India`
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Thank You - TEN9 Ministries India</title></head>
<body style="margin:0;padding:0;background-color:#f5ecd7;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ecd7;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
        <tr><td style="background-color:#8B1A1A;padding:28px;text-align:center;">
          <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
          <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:8px 0 0;">ROMANS 10:9</p>
        </td></tr>
        <tr><td style="padding:36px 40px 28px;">
          <h2 style="color:#8B1A1A;text-align:center;">Thank You for Your Support!</h2>
          <p style="color:#444;font-size:16px;line-height:1.9;">Dear <strong>${helperName}</strong>,</p>
          <p style="color:#444;font-size:16px;line-height:1.9;">We have received your generous support${amount ? ` of <strong>Rs.${amount}</strong>` : ''}. Your contribution goes directly towards our ministry programs, child care, and community outreach.</p>
          <div style="background:#f5ecd7;border-left:4px solid #c8a96e;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
            <p style="color:#5c3d2e;font-size:15px;margin:0;font-style:italic;">"Every gift becomes a blessing to someone in need."</p>
          </div>
          <p style="color:#444;font-size:16px;line-height:1.9;">You are making a real difference. God bless you abundantly!</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
            <tr><td style="background-color:#8B1A1A;border-radius:8px;padding:18px;text-align:center;">
              <p style="color:rgba(255,255,255,0.9);font-size:13px;font-style:italic;margin:0;">"If you declare with your mouth, 'Jesus is Lord'..." - Romans 10:9</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
          <p style="color:#444;font-size:14px;margin:0;line-height:1.8;">With gratitude and love,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  }, 'PAYMENT');
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Contact Form Notification to Owner
// ─────────────────────────────────────────────────────────────────────────────
exports.sendContactNotification = async (contactData) => {
  return sendMail({
    to:      OWNER_EMAIL,
    subject: `TEN9 Contact Form - ${contactData.subject}`,
    text: [
      `New contact form message received.`,
      ``,
      `Name    : ${contactData.fullName}`,
      `Email   : ${contactData.email}`,
      `Subject : ${contactData.subject}`,
      ``,
      `Message:`,
      contactData.message
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Contact Form - TEN9</title></head>
<body style="margin:0;padding:0;background-color:#f5ecd7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ecd7;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
        <tr><td style="background-color:#8B1A1A;padding:20px 28px;">
          <h2 style="color:#c8a96e;font-size:18px;margin:0;">New Contact Form Submission</h2>
          <p style="color:rgba(200,169,110,0.7);font-size:11px;margin:4px 0 0;">TEN9 Ministries India Website</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr style="border-bottom:1px solid #e8d4a0;"><td style="padding:10px 0;color:#888;font-size:13px;width:80px;">Name</td><td style="padding:10px 0;color:#333;font-size:15px;font-weight:bold;">${contactData.fullName}</td></tr>
            <tr style="border-bottom:1px solid #e8d4a0;"><td style="padding:10px 0;color:#888;font-size:13px;">Email</td><td style="padding:10px 0;color:#333;font-size:15px;">${contactData.email}</td></tr>
            <tr><td style="padding:10px 0;color:#888;font-size:13px;">Subject</td><td style="padding:10px 0;color:#333;font-size:15px;">${contactData.subject}</td></tr>
          </table>
          <div style="background:white;border-left:4px solid #8B1A1A;padding:16px 20px;border-radius:0 8px 8px 0;margin-top:20px;">
            <p style="margin:0;color:#444;font-size:15px;line-height:1.8;">${contactData.message}</p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  }, 'CONTACT');
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Announcement Email to Helpers
// ─────────────────────────────────────────────────────────────────────────────
exports.sendAnnouncementEmail = async (helperName, helperEmail, title, matter) => {
  return sendMail({
    to:      helperEmail,
    subject: `TEN9 Ministries India - New Announcement: ${title}`,
    text: [
      `Hi ${helperName},`,
      ``,
      `A new announcement has been posted by TEN9 Ministries India.`,
      ``,
      `Title: ${title}`,
      ``,
      matter,
      ``,
      `Log in to the TEN9 portal for full details.`,
      ``,
      `With love,`,
      `Team Ten9 India`
    ].join('\n'),
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Announcement - TEN9</title></head>
<body style="margin:0;padding:0;background-color:#f5ecd7;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5ecd7;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:12px;border:2px solid #c8a96e;overflow:hidden;">
        <tr><td style="background-color:#8B1A1A;padding:28px;text-align:center;">
          <h1 style="color:#c8a96e;font-size:24px;margin:0;">TEN9 Ministries India</h1>
          <p style="color:rgba(200,169,110,0.7);font-size:11px;letter-spacing:3px;margin:8px 0 0;">ROMANS 10:9</p>
        </td></tr>
        <tr><td style="padding:36px 40px 28px;">
          <p style="color:#a07840;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">New Announcement</p>
          <h2 style="color:#8B1A1A;font-size:20px;margin:0 0 20px;">${title}</h2>
          <p style="color:#444;font-size:15px;line-height:1.9;margin:0 0 14px;">Hi <strong>${helperName}</strong>,</p>
          <div style="background:white;border:1px solid #e8d4a0;border-radius:8px;padding:24px;margin:0 0 20px;">
            <p style="color:#444;font-size:15px;line-height:1.9;margin:0;">${matter}</p>
          </div>
          <p style="color:#888;font-size:13px;margin:0;">Log in to the TEN9 portal to view full details and images.</p>
        </td></tr>
        <tr><td style="background-color:#f5ecd7;padding:20px 40px;border-top:1px solid #e8d4a0;">
          <p style="color:#444;font-size:14px;margin:0;line-height:1.8;">With love,<br><strong style="color:#8B1A1A;">Team Ten9 India</strong></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  }, 'ANNOUNCEMENT');
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Verify Resend on startup
// ─────────────────────────────────────────────────────────────────────────────
exports.verifySMTP = async () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not set — emails will NOT be sent');
    console.error('   Get your free API key at: https://resend.com');
    return;
  }
  console.log('✅ Resend API key found — email system ready');
};

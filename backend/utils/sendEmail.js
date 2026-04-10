const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email',
    html: `
      <h2>Welcome! Please verify your email.</h2>
      <p>Click the button below to verify your account. This link expires in 1 hour.</p>
      <a href="${verifyUrl}" style="padding:10px 20px;background:#4F46E5;color:white;border-radius:5px;text-decoration:none;">
        Verify Email
      </a>
      <p>Or copy this link: ${verifyUrl}</p>
    `,
  });
};

module.exports = sendVerificationEmail;

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { sendEmail } = require('./mailController');

const brandedEmail = ({ title, username, bodyHtml, headerColor = 'linear-gradient(135deg,#1e40af,#2563eb)' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Lato','Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          <tr>
            <td style="background:${headerColor};padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:'Poppins',sans-serif;">🛍️ ShopVerse</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-family:'Lato',sans-serif;">Your Premium Shopping Destination</p>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 40px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this email because you have an account at ShopVerse.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'No account found with this email.' });

  // Check if a valid (non-expired) reset token already exists
  const tokenStillValid = user.resetPasswordToken &&
    user.resetPasswordTokenExpiry &&
    user.resetPasswordTokenExpiry > Date.now();

  if (tokenStillValid) {
    return res.status(400).json({
      msg: 'A password reset link was already sent. Please check your inbox — it is still valid.'
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = brandedEmail({
    title: 'Reset Your Password',
    username: user.username,
    bodyHtml: `
            <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Reset your password</h2>
            <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${user.username}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                We received a request to reset your ShopVerse password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                    <td style="border-radius:8px;background:linear-gradient(135deg,#1e40af,#2563eb);">
                        <a href="${resetURL}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                            🔑 Reset My Password
                        </a>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;margin-bottom:28px;">
                <tr>
                    <td style="padding:14px 18px;">
                        <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                            ⏱ This link will expire in <strong>1 hour</strong>. If it expires, you can request a new one from the login page.
                        </p>
                    </td>
                </tr>
            </table>
            <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${resetURL}" style="color:#2563eb;font-size:12px;font-family:'Lato',sans-serif;">${resetURL}</a>
            </p>
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>`
  });

  try {
    await sendEmail({ to: user.email, subject: 'Reset your password – ShopVerse', html });
    res.status(200).json({ msg: 'Password reset link sent. Please check your inbox.' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    res.status(500).json({ msg: 'Error sending password reset email. Please try again.' });
  }
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(409).json({ msg: 'Reset link is invalid or has expired.' });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  const loginUrl = `${process.env.FRONTEND_URL}/auth`;

  const html = brandedEmail({
    title: 'Password Changed Successfully',
    username: user.username,
    headerColor: 'linear-gradient(135deg,#15803d,#16a34a)',
    bodyHtml: `
            <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Password changed successfully</h2>
            <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${user.username}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                Your ShopVerse password has been successfully changed. You can now log in with your new password.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                    <td style="border-radius:8px;background:linear-gradient(135deg,#15803d,#16a34a);">
                        <a href="${loginUrl}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                            ✅ Log In Now
                        </a>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;margin-bottom:28px;">
                <tr>
                    <td style="padding:14px 18px;">
                        <p style="margin:0;color:#b91c1c;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                            ⚠️ If you did not make this change, please contact our support team immediately as your account may be compromised.
                        </p>
                    </td>
                </tr>
            </table>
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                Stay safe,<br/>The ShopVerse Team
            </p>`
  });

  await sendEmail({ to: user.email, subject: 'Your password has been changed – ShopVerse', html });
  res.status(200).json({ msg: 'Password has been successfully changed.' });
});

exports.changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ msg: 'Please provide all required fields.' });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: 'User not found.' });

  const isMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isMatched) return res.status(400).json({ msg: "Current password doesn't match." });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ msg: "New password and confirm password don't match." });

  user.password = newPassword;
  await user.save();

  const html = brandedEmail({
    title: 'Password Updated',
    username: user.username,
    headerColor: 'linear-gradient(135deg,#15803d,#16a34a)',
    bodyHtml: `
            <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Password updated</h2>
            <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${user.username}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                Your ShopVerse account password was just updated from your profile settings.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;margin-bottom:28px;">
                <tr>
                    <td style="padding:14px 18px;">
                        <p style="margin:0;color:#b91c1c;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                            ⚠️ If you did not make this change, please contact our support team immediately.
                        </p>
                    </td>
                </tr>
            </table>
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                Stay safe,<br/>The ShopVerse Team
            </p>`
  });

  await sendEmail({ to: user.email, subject: 'Your password was updated – ShopVerse', html });
  return res.status(200).json({ msg: 'Your password has been changed successfully.' });
};

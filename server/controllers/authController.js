const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendEmail } = require('./mailController')

exports.registerr = async (req, res) => {
  const { username, email } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ msg: 'E-mail is already taken.' })
    }

    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    const newUser = new User({
      ...req.body,
      role: 'user',
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: Date.now() + 30 * 60 * 1000
    })
    await newUser.save()

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`

    await sendEmail({
      to: email,
      subject: 'Verify your email – ShopVerse',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Lato','Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:'Poppins',sans-serif;">🛍️ ShopVerse</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-family:'Lato',sans-serif;">Your Premium Shopping Destination</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Verify your email address</h2>
              <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${username}</strong>,</p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                Thanks for signing up! To complete your registration and start shopping, please verify your email address by clicking the button below.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#1e40af,#2563eb);">
                    <a href="${verifyUrl}"
                      style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                      ✅ Verify My Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                      ⏱ This link will expire in <strong>30 minutes</strong>. If it expires, you can request a new one from the login page.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${verifyUrl}" style="color:#2563eb;font-size:12px;font-family:'Lato',sans-serif;">${verifyUrl}</a>
              </p>

              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                If you didn't create a ShopVerse account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">© ${new Date().getFullYear()} ShopVerse. All rights reserved.</p>
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this email because you signed up at ShopVerse.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    })

    res.status(200).json({ msg: 'Sign up successful. Please check your email to verify your account.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Sign up failed.' })
  }
}

exports.verifyEmail = async (req, res) => {
  const { token } = req.params

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiry: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({ msg: 'Verification link is invalid or has expired.' })
    }

    user.isVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpiry = undefined
    await user.save()

    res.status(200).json({ msg: 'Email verified successfully. You can now log in.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Server error during email verification.' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const userFound = await User.findOne({ email })
    if (!userFound) return res.status(404).json({ msg: 'User not found!' })

    if (userFound.status === 'blocked') return res.status(403).json({ msg: 'Your account is blocked. For further details contact support.' })

    if (!userFound.isVerified) {
      const isExpired = !userFound.emailVerificationTokenExpiry ||
        userFound.emailVerificationTokenExpiry < Date.now()

      if (isExpired) {
        // auto re-sending verification email
        const rawToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        userFound.emailVerificationToken = hashedToken
        userFound.emailVerificationTokenExpiry = Date.now() + 30 * 60 * 1000
        await userFound.save()

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`

        await sendEmail({
          to: userFound.email,
          subject: 'Verify your email – ShopVerse',
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
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
            <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:'Poppins',sans-serif;">🛍️ ShopVerse</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-family:'Lato',sans-serif;">Your Premium Shopping Destination</p>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">New verification link</h2>
              <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${userFound.username}</strong>,</p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                Your previous verification link expired. We've automatically sent you a fresh one. Click below to verify your email.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#1e40af,#2563eb);">
                    <a href="${verifyUrl}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                      ✅ Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                      ⏱ This link will expire in <strong>30 minutes</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${verifyUrl}" style="color:#2563eb;font-size:12px;font-family:'Lato',sans-serif;">${verifyUrl}</a>
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                If you didn't request this, you can safely ignore this email.
              </p>
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
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this email because you signed up at ShopVerse.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        })

        return res.status(403).json({
          msg: 'Your verification link had expired. We\'ve sent a new one to your email.'
        })
      }

      return res.status(403).json({ msg: 'Please verify your email before logging in. Check your inbox.' })
    }

    const isMatched = await bcrypt.compare(password, userFound.password)
    if (!isMatched) return res.status(401).json({ msg: 'Incorrect password!' })

    const payload = {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
      avatar: userFound.avatar
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET)

    res.status(200).json({ msg: 'Log in successful.', token, user: payload })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Log in failed.' })
  }
}

exports.resendVerification = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ msg: 'No account found with this email.' })
        }

        if (user.isVerified) {
            return res.status(400).json({ msg: 'This email is already verified. Please log in.' })
        }

        // Token still valid — tell user to use the existing email
        const tokenStillValid = user.emailVerificationTokenExpiry &&
            user.emailVerificationTokenExpiry > Date.now()

        if (tokenStillValid) {
            return res.status(400).json({ msg: 'A verification email was already sent. Please check your inbox — it is still valid.' })
        }

        // Token expired — generate a fresh one and resend
        const rawToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

        user.emailVerificationToken = hashedToken
        user.emailVerificationTokenExpiry = Date.now() + 30 * 60 * 1000
        await user.save()

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`

        await sendEmail({
            to: email,
            subject: 'Verify your email – ShopVerse',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
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
            <td style="background:linear-gradient(135deg,#1e40af,#2563eb);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:'Poppins',sans-serif;">🛍️ ShopVerse</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-family:'Lato',sans-serif;">Your Premium Shopping Destination</p>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">New verification link</h2>
              <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${user.username}</strong>,</p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                You requested a new verification link. Click the button below to verify your email. This link expires in <strong>30 minutes</strong>.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#1e40af,#2563eb);">
                    <a href="${verifyUrl}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                      ✅ Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#1e40af;font-size:13px;line-height:1.5;font-family:'Lato',sans-serif;">
                      ⏱ This link will expire in <strong>30 minutes</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px;color:#9ca3af;font-size:12px;font-family:'Lato',sans-serif;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${verifyUrl}" style="color:#2563eb;font-size:12px;font-family:'Lato',sans-serif;">${verifyUrl}</a>
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                If you didn't request this, you can safely ignore this email.
              </p>
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
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this email because you signed up at ShopVerse.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
        })

        res.status(200).json({ msg: 'Verification email resent. Please check your inbox.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Failed to resend verification email.' })
    }
}

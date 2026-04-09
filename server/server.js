const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')
const express = require('express')
const app = express()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Order = require('./models/Order')
const Product = require('./models/Product')
const Cart = require('./models/Cart')
const User = require('./models/User')
const { sendEmail } = require('./controllers/mailController')

// ⚠️ Webhook MUST be registered before express.json() — needs raw body
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return res.sendStatus(400)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const paymentIntentId = session.payment_intent
    const email = session.customer_details?.email
    const orderId = session.metadata?.orderId

    const order = await Order.findOne({ orderId })
    if (order) {
      // Mark order as paid
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = { paymentIntentId, emailAddress: email }
      await order.save()

      // Decrement stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
      }

      // Clear cart in DB
      await Cart.findOneAndUpdate(
        { user: order.user },
        { $set: { cartItems: [], totalCartPrice: 0 } }
      )

      // Send branded payment success email
      const user = await User.findById(order.user)
      const orderUrl = `${process.env.FRONTEND_URL}/user-dashboard/order/detail/${order._id}`

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Successful</title>
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
            <td style="background:linear-gradient(135deg,#15803d,#16a34a);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;font-family:'Poppins',sans-serif;">🛍️ ShopVerse</h1>
              <p style="margin:6px 0 0;color:#bbf7d0;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-family:'Lato',sans-serif;">Your Premium Shopping Destination</p>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 40px 32px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Payment Successful! 🎉</h2>
              <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${user?.username || 'Customer'}</strong>,</p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                We've successfully received your payment of <strong style="color:#111827;">$${order.orderSummary.totalAmount.toFixed(2)}</strong> for order <strong style="color:#111827;">${order.orderId}</strong>. Your order is now confirmed and being processed.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#15803d;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                      ✅ Payment confirmed &nbsp;|&nbsp; Order ID: <strong>${order.orderId}</strong><br/>
                      💳 Payment Intent: <strong>${paymentIntentId}</strong>
                    </p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#15803d,#16a34a);">
                    <a href="${orderUrl}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;font-family:'Poppins',sans-serif;">
                      📦 View Your Order
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                We'll notify you once your order is shipped. Thank you for shopping with ShopVerse!
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
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this because you placed an order at ShopVerse.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

      try {
        await sendEmail({
          to: email,
          subject: `Payment Confirmed (by stripe webhook) – ${order.orderId} | ShopVerse`,
          html
        })

        console.log('✔✔✔Webhook received. email sent');
        
      } catch (emailErr) {
        console.error('Payment confirmation email failed:', emailErr.message)
      }
    }
  }

  res.sendStatus(200)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const ConnectDB = require('./config/db')
ConnectDB()

const resetPasswordRoutes = require('./routes/resetPasswordRoutes')
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const sessionRoutes = require('./routes/sessionRoutes')

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/password', resetPasswordRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/user', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/session', sessionRoutes)

app.get('/health', (req, res) => {
  res.json({ msg: 'server is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

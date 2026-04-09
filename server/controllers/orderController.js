// const { default: mongoose } = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { sendEmail } = require('./mailController')

const orderConfirmationEmail = (order, username) => {
    const itemsHtml = order.orderItems.map(item => `
        <tr>
            <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;font-family:'Lato',sans-serif;font-size:14px;color:#374151;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <img src="${item.image}" alt="${item.name}" width="48" height="48" style="border-radius:8px;object-fit:cover;" />
                    <span>${item.name}</span>
                </div>
            </td>
            <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:center;font-family:'Lato',sans-serif;font-size:14px;color:#374151;">${item.quantity}</td>
            <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-family:'Lato',sans-serif;font-size:14px;color:#374151;">$${item.price.toFixed(2)}</td>
            <td style="padding:12px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-family:'Lato',sans-serif;font-size:14px;font-weight:700;color:#111827;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`).join('')

    const paymentLabel = order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Credit / Debit Card (Stripe)'
    const paymentStatus = order.paymentMethod === 'cash_on_delivery' ? 'Pending (Pay on delivery)' : 'Pending (Stripe checkout)'

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation</title>
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
              <h2 style="margin:0 0 8px;color:#111827;font-size:22px;font-weight:700;font-family:'Poppins',sans-serif;">Order Confirmed! 🎉</h2>
              <p style="margin:0 0 6px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">Hi <strong style="color:#111827;">${username}</strong>,</p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;font-family:'Lato',sans-serif;">
                Thank you for your order! We've received it and it's being processed. Here's a summary of what you ordered.
              </p>

              <!-- Order ID badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;color:#1e40af;font-size:14px;font-family:'Lato',sans-serif;">
                      Order ID: <strong>${order.orderId}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Items Table -->
              <h3 style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:700;font-family:'Poppins',sans-serif;">Items Ordered</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:28px;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 8px;text-align:left;font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                    <th style="padding:10px 8px;text-align:center;font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
                    <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6b7280;font-family:'Poppins',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Order Summary -->
              <h3 style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:700;font-family:'Poppins',sans-serif;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px;font-family:'Lato',sans-serif;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;color:#374151;font-size:14px;font-family:'Lato',sans-serif;">$${order.orderSummary.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px;font-family:'Lato',sans-serif;">Shipping (${order.shippingMethod.name} · ${order.shippingMethod.estimatedDays})</td>
                  <td style="padding:6px 0;text-align:right;color:#374151;font-size:14px;font-family:'Lato',sans-serif;">$${order.orderSummary.shippingCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;font-size:14px;font-family:'Lato',sans-serif;">Tax (5%)</td>
                  <td style="padding:6px 0;text-align:right;color:#374151;font-size:14px;font-family:'Lato',sans-serif;">$${order.orderSummary.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 6px;border-top:2px solid #e5e7eb;color:#111827;font-size:16px;font-weight:700;font-family:'Poppins',sans-serif;">Total</td>
                  <td style="padding:10px 0 6px;border-top:2px solid #e5e7eb;text-align:right;color:#2563eb;font-size:16px;font-weight:700;font-family:'Poppins',sans-serif;">$${order.orderSummary.totalAmount.toFixed(2)}</td>
                </tr>
              </table>

              <!-- Shipping & Payment Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:12px;">
                    <h3 style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:700;font-family:'Poppins',sans-serif;">Shipping To</h3>
                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.7;font-family:'Lato',sans-serif;">
                      ${order.shippingInfo.fullName}<br/>
                      ${order.shippingInfo.address}<br/>
                      ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.postalCode}<br/>
                      ${order.shippingInfo.country}<br/>
                      📞 ${order.shippingInfo.phone}
                    </p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding-left:12px;">
                    <h3 style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:700;font-family:'Poppins',sans-serif;">Payment</h3>
                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.7;font-family:'Lato',sans-serif;">
                      Method: ${paymentLabel}<br/>
                      Status: ${paymentStatus}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;font-family:'Lato',sans-serif;">
                If you have any questions about your order, reply to this email or contact our support team.
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
              <p style="margin:0;color:#d1d5db;font-size:11px;font-family:'Lato',sans-serif;">You're receiving this because you placed an order at ShopVerse.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}


exports.placeOrder = async (req, res) => {
    const { order } = req.body;
    // console.log(order);

    const { id: userId } = req.user;

    try {
        if (
            !order ||
            !order.orderItems ||
            !Array.isArray(order.orderItems) ||
            order.orderItems.length === 0
        ) {
            return res.status(400).json({ msg: "Order must have at least one item" });
        }

        if (
            !order.shippingInfo ||
            !order.paymentMethod ||
            !order.orderSummary ||
            !order.shippingMethod
        ) {
            return res.status(400).json({ msg: "Missing required order details" });
        }

        // console.log(order.orderItems);

        const productIds = order.orderItems.map(item => item.id)
        const productQtys = order.orderItems.map(item => item.quantity)
        // console.log(productIds);
        // return
        const orderItems = await Product.find({ _id: { $in: productIds } })
        console.log('db product items:::', orderItems);

        const subtotal = orderItems.reduce((acc, item, idx) => {
            return item.discountedPrice !== 0 ? acc + item.discountedPrice * productQtys[idx] : acc + item.price * productQtys[idx]
        }, 0)

        console.log(subtotal);

        console.log(order.shippingMethod);


        // Calculate shipping cost
        const shippingCost =
            order.shippingMethod.name === "standard"
                ? 5
                : order.shippingMethod.name === "express"
                    ? 10
                    : 20;

        // Tax
        const tax = subtotal * 0.05; // 5% tax

        // Final total
        const totalAmount = subtotal + shippingCost + tax;
        // console.log("cartItems::::", cartItems);


        const newOrder = new Order({
            user: userId,
            orderId: `ORD-${Date.now()}`,

            // ✅ orderItems already matches schema from frontend
            orderItems: orderItems.map((item, idx) => ({
                productId: item._id,
                name: item.name,
                image: item.image,
                price: item.discountedPrice !== 0 ? item.discountedPrice : item.price,
                quantity: productQtys[idx],
            })),

            shippingInfo: {
                fullName: order.shippingInfo.fullName,
                email: order.shippingInfo.email,
                phone: order.shippingInfo.phone,
                address: order.shippingInfo.address,
                city: order.shippingInfo.city,
                state: order.shippingInfo.state,
                postalCode: order.shippingInfo.postalCode,
                country: order.shippingInfo.country,
            },

            shippingMethod: {
                name: order.shippingMethod.name,
                price: order.shippingMethod.price,
                estimatedDays: order.shippingMethod.estimatedDays,
            },

            orderSummary: {
                subtotal: subtotal,
                shippingCost: shippingCost,
                tax: tax,
                totalAmount: totalAmount,
            },

            paymentMethod: order.paymentMethod,
        });
        if (order.instructions && order.instructions !== '') newOrder.instructions = order.instructions

        await newOrder.save();

        // Clear the user's cart after order is saved
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { cartItems: [], totalCartPrice: 0 } }
        );

        // Send order confirmation email
        try {
            await sendEmail({
                to: order.shippingInfo.email,
                subject: `Order Confirmed – ${newOrder.orderId} | ShopVerse`,
                html: orderConfirmationEmail(newOrder, req.user.username)
            })
        } catch (emailErr) {
            console.error('Order confirmation email failed:', emailErr.message)
        }

        if (newOrder.paymentMethod === 'cash_on_delivery') {
            return res.status(200).json({
                msg: 'Order placed successfully',
                // id: session.id,
                // url: session.url,
            });
        }

        const line_items = [
            ...newOrder.orderItems.map(item => ({ 
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : undefined
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            })),


            // SHIPPING
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${newOrder.shippingMethod.name} Shipping`,
                    },
                    unit_amount: Math.round(newOrder.shippingMethod.price * 100)
                },
                quantity: 1
            },

            // TAX
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Tax (5%)`,
                    },
                    unit_amount: Math.round(newOrder.orderSummary.tax * 100)
                },
                quantity: 1
            }
        ]

        

        // console.log(line_items);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`,
            metadata: { orderId: newOrder.orderId }
        })

        // console.log('session:::::', session);


        return res.status(201).json({
            id: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error("Stripe session error:::", error);
        return res.status(500).json({ msg: "Server error while creating checkout session. Try again!" });
    }
}



exports.getOrders = async (req, res) => {
    // const { query: filter } = req
    const { search, paymentStatus, status, startDate, endDate } = { ...req.query }
    // console.log(startDate, endDate);

    let query = {}
    if (search) {
        query.$or = [
            { "shippingInfo.fullName": { $regex: search, $options: 'i' } },
            { orderId: { $regex: search, $options: 'i' } }
        ]
    }

    if (status) {
        query.orderStatus = status
    }

    if (paymentStatus) {
        query.isPaid = paymentStatus === 'paid' ? true : false
    }


    try {
        // console.log(query);
        const orders = await Order.find(query)
        // console.log(orders);

        res.status(200).json({ msg: 'Orders fetched successfully', orders: orders })

    } catch (error) {
        console.error("Error fetching Order:", error);
        return res.status(500).json({ msg: "Server error while fetching orders" });

    }
}

exports.getUserOrders = async (req, res) => {
    const { id } = req.user
    const { search, status, paymentStatus } = req.query
    try {
        let query = {}
        if (search) {
            query.orderId = { $regex: search, $options: 'i' }
        }

        if (status) {
            query.orderStatus = status
        }

        if (paymentStatus) {
            query.isPaid = paymentStatus === 'paid' ? true : false
        }
        query.user = id

        // console.log(query);
        let orders = await Order.find(query)
        // console.log('get user ordersss:::::::::::::', orders);
        // orders = orders.find(item => item.user)


        res.status(200).json({ msg: 'User Orders fetched successfully', orders: orders })

    } catch (error) {
        console.error("Error fetching Order:", error);
        return res.status(500).json({ msg: "Server error while fetching orders" });

    }
}


exports.updateStatus = async (req, res) => {
    const { id: _id } = req.params
    const { newStatus } = req.body
    // console.log(id);

    try {
        let order
        if (newStatus !== 'delivered') {
            order = await Order.findByIdAndUpdate(_id, { $set: { orderStatus: newStatus } })
        }
        else {
            order = await Order.findByIdAndUpdate(_id,
                {
                    $set: {
                        orderStatus: newStatus,
                        isPaid: true,
                    }
                },
            )
        }
        // console.log(order);

        await order.save()

        res.status(200).json({ msg: 'Updated status successfully' })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error while updating status' })

    }
}



exports.getOrderDetail = async (req, res) => {
    const { id } = req.params
    try {
        const order = await Order.findOne({ _id: id })
        res.status(200).json({ msg: 'Order fetched successfully.', order: order })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while fetching order detail', order: order })
    }
}


exports.cancelOrder = async (req, res) => {
    const { id: _id } = req.params
    try {
        const order = await Order.findByIdAndUpdate(_id, { $set: { orderStatus: 'cancelled' } })
        if (!order) return res.status(404).json({ msg: 'Order not found' })
        console.log(order);
        res.status(200).json({ msg: 'Order fetched successfully.', order: order })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error while fetching order detail', order: order })
    }
}


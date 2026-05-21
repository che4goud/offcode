import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Allow requests from the frontend origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const LICENSE_SECRET = process.env.LICENSE_SECRET || 'offcode-license-secret-change-in-prod';

// Pricing per tier in paise (INR × 100)
const TIER_PRICES = { pro: 15000 };

// ---- Routes ----

app.get('/health', (_, res) => res.json({ ok: true }));

// 1. Create Razorpay order
app.post('/create-order', async (req, res) => {
  const { tier = 'pro' } = req.body;
  const amount = TIER_PRICES[tier];
  if (!amount) return res.status(400).json({ error: 'Invalid tier' });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `offcode_${Date.now()}`,
      notes: { tier },
    });
    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// 2. Verify Razorpay payment signature → issue JWT license
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier = 'pro' } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }

  // Verify Razorpay HMAC signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  // Issue license JWT (no expiry — perpetual license)
  const license = jwt.sign(
    {
      tier,
      issuedAt: Date.now(),
      paymentId: razorpay_payment_id,
      deviceLimit: 3,
    },
    LICENSE_SECRET,
    { algorithm: 'HS256' }
  );

  res.json({ license });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`OffCode backend running on :${PORT}`));

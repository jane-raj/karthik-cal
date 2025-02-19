import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import multer from 'multer';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8081',  // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(bodyParser.json());
app.options('*', cors()); // Enable pre-flight across-the-board

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stripe client setup
const stripeSecretKey = process.env.STRIPE_SECRET_KEY; // Use environment variable
const stripe = new Stripe(stripeSecretKey);

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Example route to fetch data from Supabase
app.get('/fetch-data', async (req, res) => {
  try {
    const { data, error } = await supabase.from('your_table_name').select('*'); // Replace with your actual table name
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /create-payment-intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /subscribe
app.post('/subscribe', async (req, res) => {
  const { email, plan } = req.body; // Get user email and subscription plan

  try {
    const customer = await stripe.customers.create({ email });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan }],
    });

    const { error } = await supabase
      .from('subscriptions')
      .insert([{ user_email: email, subscription_id: subscription.id, status: subscription.status }]);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(400).json({ error: 'Failed to save subscription.' });
    }

    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Subscription Error:', error);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// POST /track-walking
app.post('/track-walking', async (req, res) => {
  const { steps, distance } = req.body; // Get steps and distance from request

  try {
    const { error } = await supabase
      .from('walking_stats')
      .insert([{ steps, distance }]);

    if (error) throw error;

    res.status(200).json({ message: 'Walking data tracked successfully!' });
  } catch (error) {
    console.error('Error tracking walking data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
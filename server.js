const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');
const axios = require('axios');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stripe client setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// API Endpoints

// POST /create-payment-intent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /subscribe
app.post('/subscribe', async (req, res) => {
  const { email, plan } = req.body; // Get user email and subscription plan

  try {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email,
    });

    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan }], // Use the plan ID from your Stripe dashboard
    });

    // Store subscription details in Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{ user_email: email, subscription_id: subscription.id, status: subscription.status }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /fetch-walking-stats
app.get('/fetch-walking-stats', async (req, res) => {
  const { data, error } = await supabase.from('walking_stats').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /track-calories
app.post('/track-calories', async (req, res) => {
  const { food_image, calories } = req.body;
  const { data, error } = await supabase
    .from('calorie_tracking')
    .insert([{ food_image, calories }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /ai-query
app.post('/ai-query', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post('https://gemini.googleapis.com/v1/query', {
      query: query,
      key: process.env.GOOGLE_GEMINI_API_KEY, // Ensure you have your API key set in your environment variables
    });

    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /track-walking
app.post('/track-walking', async (req, res) => {
  const { steps, distance } = req.body;

  try {
    const { data, error } = await supabase
      .from('walking_stats')
      .insert([{ steps, distance }]);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /create-post
app.post('/create-post', async (req, res) => {
  const { userId, content, mediaUrl } = req.body; // Assuming userId is passed for tracking

  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ user_id: userId, content, media_url: mediaUrl }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /fetch-posts
app.get('/fetch-posts', async (req, res) => {
  const { data, error } = await supabase.from('community_posts').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /add-comment
app.post('/add-comment', async (req, res) => {
  const { postId, userId, comment } = req.body;

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, comment }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST /identify-food
app.post('/identify-food', upload.single('image'), async (req, res) => {
  const image = req.body.image; // Process the image as needed

  // Call your food identification API here
  const identifiedFood = await identifyFoodItem(image); // Implement this function

  if (identifiedFood) {
    // Insert identified food item into Supabase
    const { data, error } = await supabase
      .from('food_items')
      .insert([{ name: identifiedFood }]);

    if (error) {
      return res.status(400).json({ message: 'Failed to insert food item into database.' });
    }

    res.json({ foodItem: identifiedFood });
  } else {
    res.status(400).json({ message: 'Food identification failed.' });
  }
});

// Function to identify food item (placeholder)
const identifyFoodItem = async (image) => {
  // Implement your food identification logic here
  // This could involve calling an external API
  return 'Pizza'; // Example response
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 
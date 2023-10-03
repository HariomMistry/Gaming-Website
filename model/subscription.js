// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Subscription = require('./models/Subscription');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/game-subscriptions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/subscribe', async (req, res) => {
  try {
    const { email, username, subscriptionPlan } = req.body;

    // Check if the email is already subscribed
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

    const newSubscription = new Subscription({ email, username, subscriptionPlan });
    await newSubscription.save();

    res.status(201).json({ message: 'Subscription successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

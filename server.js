const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const uuid = require('uuid');


app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/gaming');



const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Subscription = new mongoose.model('Subscription', subscriptionSchema);


app.post('/subscriptionData', async (req, res) => {
  try {
    const { email, username, subscriptionPlan } = req.body;
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }
    const newSubscription = new Subscription({ email, username, subscriptionPlan });
    await newSubscription.save();
    const productKey = uuid.v4();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '', // add email
        pass: '', // add pass
      },
    });
    const mailOptions = {
      from: 'darshandiwani511@gmail.com',
      to: email, // Send the email to the user who subscribed
      subject: 'Subscription Successful',
      text: `Thank you for subscribing! Here is your product key: ${productKey}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        // Handle email sending errors here
        res.status(500).json({ message: 'Email sending failed' });
      } else {
        console.log('Email sent:', info.response);
        // Handle successful email sending here
        res.status(201).json({ message: 'Subscription successful!', productKey });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});


app.listen(5000);


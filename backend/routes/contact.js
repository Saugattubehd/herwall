const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Required fields missing' });
    // In production: send email via nodemailer or save to DB
    console.log('Contact form submission:', { name, email, phone, subject, message });
    res.json({ message: 'Message received! We will contact you soon.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

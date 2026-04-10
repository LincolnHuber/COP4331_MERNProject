const express        = require('express');
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const User           = require('../Models/users');
const sendVerificationEmail = require('../utils/sendEmail');

const router = express.Router();

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ username, email, password: hashed });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Registered! Check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.userId);

    if (!user)            return res.status(404).json({ message: 'User not found' });
    if (user.isVerified)  return res.status(400).json({ message: 'Already verified' });

    user.isVerified = true;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/verify-email?verified=true`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/verify-email?verified=false`);
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email before logging in' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)           return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    res.json({ message: 'Verification email resent!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

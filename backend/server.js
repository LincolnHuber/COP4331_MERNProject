require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./Models/users');
const authRoutes = require('./routes/auth');
const sendVerificationEmail = require('./utils/sendEmail');

var cardList =
  [
    'Roy Campanella',
    'Paul Molitor',
    'Tony Gwynn',
    'Dennis Eckersley',
    'Reggie Jackson',
    'Gaylord Perry',
    'Buck Leonard',
    'Rollie Fingers',
    'Charlie Gehringer',
    'Wade Boggs',
    'Carl Hubbell',
    'Dave Winfield',
    'Jackie Robinson',
    'Ken Griffey, Jr.',
    'Al Simmons',
    'Chuck Klein',
    'Mel Ott',
    'Mark McGwire',
    'Nolan Ryan',
    'Ralph Kiner',
    'Yogi Berra',
    'Goose Goslin',
    'Greg Maddux',
    'Frankie Frisch',
    'Ernie Banks',
    'Ozzie Smith',
    'Hank Greenberg',
    'Kirby Puckett',
    'Bob Feller',
    'Dizzy Dean',
    'Joe Jackson',
    'Sam Crawford',
    'Barry Bonds',
    'Duke Snider',
    'George Sisler',
    'Ed Walsh',
    'Tom Seaver',
    'Willie Stargell',
    'Bob Gibson',
    'Brooks Robinson',
    'Steve Carlton',
    'Joe Medwick',
    'Nap Lajoie',
    'Cal Ripken, Jr.',
    'Mike Schmidt',
    'Eddie Murray',
    'Tris Speaker',
    'Al Kaline',
    'Sandy Koufax',
    'Willie Keeler',
    'Pete Rose',
    'Robin Roberts',
    'Eddie Collins',
    'Lefty Gomez',
    'Lefty Grove',
    'Carl Yastrzemski',
    'Frank Robinson',
    'Juan Marichal',
    'Warren Spahn',
    'Pie Traynor',
    'Roberto Clemente',
    'Harmon Killebrew',
    'Satchel Paige',
    'Eddie Plank',
    'Josh Gibson',
    'Oscar Charleston',
    'Mickey Mantle',
    'Cool Papa Bell',
    'Johnny Bench',
    'Mickey Cochrane',
    'Jimmie Foxx',
    'Jim Palmer',
    'Cy Young',
    'Eddie Mathews',
    'Honus Wagner',
    'Paul Waner',
    'Grover Alexander',
    'Rod Carew',
    'Joe DiMaggio',
    'Joe Morgan',
    'Stan Musial',
    'Bill Terry',
    'Rogers Hornsby',
    'Lou Brock',
    'Ted Williams',
    'Bill Dickey',
    'Christy Mathewson',
    'Willie McCovey',
    'Lou Gehrig',
    'George Brett',
    'Hank Aaron',
    'Harry Heilmann',
    'Walter Johnson',
    'Roger Clemens',
    'Ty Cobb',
    'Whitey Ford',
    'Willie Mays',
    'Rickey Henderson',
    'Babe Ruth'
];

const app = express();
app.use(cors());
app.use(express.json());
app.use(['/api/auth', '/auth'], authRoutes);

app.get('/api/ping', async (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error: ', err));

app.post(['/api/signup', '/signup'], async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      isVerified: false
    });

    await newUser.save();

    // generate a 1-hour token and send verification email
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await sendVerificationEmail(email, token);

    res.status(201).json({ error: '', message: 'Account created! Check your email to verify your account.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user)           return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Already verified' });

    user.isVerified = true;
    await user.save();

    // redirect back to frontend with success flag
    res.redirect(`${process.env.CLIENT_URL}/verify-email?verified=true`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL}/verify-email?verified=false`);
  }
});

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────
app.post('/api/resend-verification', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)           return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Already verified' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, token);

    res.status(200).json({ error: '', message: 'Verification email resent!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/addcard', async (req, res, next) => {
  var error = '';
  const { userId, card } = req.body;

  cardList.push(card);

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post(['/api/login', '/login'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // block login if not verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.status(200).json({
      error: '',
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

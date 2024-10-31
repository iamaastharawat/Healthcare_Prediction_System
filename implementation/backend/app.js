const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-advanced');
const hpp = require('hpp');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware for CORS
app.use(
  cors({
    origin: 'http://127.0.0.1:5000',
  })
);

app.options('*', cors());

app.use(bodyParser.json());

// Limit requets from the same API (Protection against DOS attacks)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests fro this IP, please try again in an hour',
});

app.use('/api', limiter);

// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

dotenv.config({ path: __dirname + '/config.env' });

// Create a MongoDB store for sessions
const store = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: 'sessions',
});

// Middleware for sessions
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Define routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'profile.html'));
});

// Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

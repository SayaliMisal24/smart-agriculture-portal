// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const soilRoutes = require('./routes/soilRoutes');
const cropRoutes = require('./routes/cropRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const irrigationRoutes = require('./routes/irrigationRoutes');
// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', userRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/irrigation', irrigationRoutes);
// A simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Agriculture Portal API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
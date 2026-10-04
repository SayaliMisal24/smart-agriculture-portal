// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const farmRoutes = require('./routes/farmRoutes');
const soilRoutes = require('./routes/soilRoutes');
const cropRoutes = require('./routes/cropRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const irrigationRoutes = require('./routes/irrigationRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const statsRoutes = require('./routes/statsRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const yieldRoutes = require('./routes/yieldRoutes');
const marketFinderRoutes = require('./routes/marketFinderRoutes');
const pricePredictionRoutes = require('./routes/pricePredictionRoutes');
const { startDailySnapshots } = require('./utils/priceHistory');
const compression = require('compression');
// Create the Express app
const app = express();
app.use(compression());
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', userRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/fertilizer', fertilizerRoutes);
app.use('/api/yield', yieldRoutes);
app.use('/api/market-finder', marketFinderRoutes);
app.use('/api/price-prediction', pricePredictionRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    startDailySnapshots();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error (will retry automatically):', err.message);
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/stats', statsRoutes);
// A simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Agriculture Portal API is running!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
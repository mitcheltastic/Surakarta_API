const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Import Routers ---
const authRoutes = require('./src/api/auth/auth.routes');
const postRoutes = require('./src/api/news/news.routes');
const galleryRoutes = require('./src/api/gallery/gallery.routes');
const profileRoutes = require('./src/api/profile/profile.routes');
const servicesRoutes = require('./src/api/services/services.routes');


const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Village Backend API!' });
});

// Use the imported routers
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

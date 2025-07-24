const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

// --- Import Routers using absolute paths ---
const authRoutes = require(path.join(__dirname, 'src', 'api', 'auth', 'auth.routes'));
const postRoutes = require(path.join(__dirname, 'src', 'api', 'news', 'news.routes'));
const galleryRoutes = require(path.join(__dirname, 'src', 'api', 'gallery', 'gallery.routes'));
const profileRoutes = require(path.join(__dirname, 'src', 'api', 'profile', 'profile.routes'));
const servicesRoutes = require(path.join(__dirname, 'src', 'services', 'services.routes.js'));

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Root Route ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Village Backend API!' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

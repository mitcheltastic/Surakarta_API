const router = require('express').Router();
const authController = require('./auth.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

// Note: In a real-world scenario, you might want to protect the register route
// so that only an existing admin can create a new one.
router.post('/register', authenticateToken, authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getMe); //who am I

// --- NEW ROUTES ---
router.post('/forgot-password', authController.forgotPassword);
// Corrected: Removed ':token' from the route path as the code is sent in the body
router.post('/reset-password', authController.resetPassword);


module.exports = router;
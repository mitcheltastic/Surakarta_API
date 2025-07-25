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
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
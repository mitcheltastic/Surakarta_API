const router = require('express').Router();
const authController = require('./auth.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

// Note: In a real-world scenario, you might want to protect the register route
// so that only an existing admin can create a new one.
router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route to check token validity
router.get('/me', authenticateToken, authController.getMe);


module.exports = router;
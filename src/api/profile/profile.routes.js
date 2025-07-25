// /src/api/profile/profile.routes.js

const router = require('express').Router();
const profileController = require('./profile.controller');
const authenticateToken = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

// Site Content routes are unchanged
router.get('/content', profileController.getSiteContent);
router.put('/content', authenticateToken, profileController.updateSiteContent);

// Village Officials routes now handle file uploads with field name 'photo'
router.get('/officials', profileController.getOfficials);
router.post('/officials', authenticateToken, upload.single('photo'), profileController.createOfficial);
router.put('/officials/:id', authenticateToken, upload.single('photo'), profileController.updateOfficial);
router.delete('/officials/:id', authenticateToken, profileController.deleteOfficial);

module.exports = router;
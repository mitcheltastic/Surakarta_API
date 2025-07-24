const router = require('express').Router();
const profileController = require('./profile.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

// Site Content (History, Demographics, etc.)
router.get('/content', profileController.getSiteContent);
router.put('/content', authenticateToken, profileController.updateSiteContent);

// Village Officials
router.get('/officials', profileController.getOfficials);
router.post('/officials', authenticateToken, profileController.createOfficial);
router.put('/officials/:id', authenticateToken, profileController.updateOfficial);
router.delete('/officials/:id', authenticateToken, profileController.deleteOfficial);

module.exports = router;
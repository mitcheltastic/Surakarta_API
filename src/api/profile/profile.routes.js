// --- File: /src/api/profile/profile.routes.js ---
const profileRouter = require('express').Router();
const profileController = require('./profile.controller');
const profileAuthMiddleware = require('../../middlewares/auth.middleware');

// Site Content (History, Demographics, etc.)
profileRouter.get('/content', profileController.getSiteContent);
profileRouter.put('/content', profileAuthMiddleware, profileController.updateSiteContent);

// Village Officials
profileRouter.get('/officials', profileController.getOfficials);
profileRouter.post('/officials', profileAuthMiddleware, profileController.createOfficial);
profileRouter.put('/officials/:id', profileAuthMiddleware, profileController.updateOfficial);
profileRouter.delete('/officials/:id', profileAuthMiddleware, profileController.deleteOfficial);

module.exports = profileRouter;
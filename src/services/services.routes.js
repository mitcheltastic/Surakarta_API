// --- File: /src/api/services/services.routes.js ---
const servicesRouter = require('express').Router();
const servicesController = require('./services.controller');
const servicesAuthMiddleware = require('../../middlewares/auth.middleware');

// Guestbook
servicesRouter.get('/guestbook', servicesController.getGuestBookEntries);
servicesRouter.post('/guestbook', servicesController.createGuestBookEntry);
servicesRouter.delete('/guestbook/:id', servicesAuthMiddleware, servicesController.deleteGuestBookEntry);

// Complaints
servicesRouter.get('/complaints', servicesAuthMiddleware, servicesController.getComplaints);
servicesRouter.post('/complaints', servicesController.createComplaint);
servicesRouter.put('/complaints/:id', servicesAuthMiddleware, servicesController.updateComplaintStatus);

// Letter Requests
servicesRouter.get('/letters', servicesAuthMiddleware, servicesController.getLetterRequests);
servicesRouter.post('/letters', servicesController.createLetterRequest);
servicesRouter.put('/letters/:id', servicesAuthMiddleware, servicesController.updateLetterRequestStatus);

module.exports = servicesRouter;
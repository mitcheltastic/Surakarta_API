const router = require('express').Router();
const servicesController = require('./services.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

// Guestbook
router.get('/guestbook', servicesController.getGuestBookEntries);
router.post('/guestbook', servicesController.createGuestBookEntry);
router.delete('/guestbook/:id', authenticateToken, servicesController.deleteGuestBookEntry);

// Complaints
router.get('/complaints', authenticateToken, servicesController.getComplaints);
router.post('/complaints', servicesController.createComplaint);
router.put('/complaints/:id', authenticateToken, servicesController.updateComplaintStatus);

// Letter Requests
router.get('/letters', authenticateToken, servicesController.getLetterRequests);
router.post('/letters', servicesController.createLetterRequest);
router.put('/letters/:id', authenticateToken, servicesController.updateLetterRequestStatus);

module.exports = router;
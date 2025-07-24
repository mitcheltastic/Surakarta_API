const prisma = require('../../services/prisma');

const servicesController = {
  // --- Guestbook ---
  getGuestBookEntries: async (req, res) => {
      try {
          const entries = await prisma.guestBookEntry.findMany({ orderBy: { createdAt: 'desc' } });
          res.status(200).json(entries);
      } catch (error) {
          res.status(500).json({ message: 'Error fetching guestbook entries', error: error.message });
      }
  },
  createGuestBookEntry: async (req, res) => {
      try {
          const { name, message } = req.body;
          const newEntry = await prisma.guestBookEntry.create({ data: { name, message } });
          res.status(201).json(newEntry);
      } catch (error) {
          res.status(500).json({ message: 'Error creating guestbook entry', error: error.message });
      }
  },
  deleteGuestBookEntry: async (req, res) => {
    try {
        await prisma.guestBookEntry.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Guestbook entry deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting entry', error: error.message });
    }
  },

  // --- Complaints ---
  getComplaints: async (req, res) => {
      try {
          const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } });
          res.status(200).json(complaints);
      } catch (error) {
          res.status(500).json({ message: 'Error fetching complaints', error: error.message });
      }
  },
  createComplaint: async (req, res) => {
      try {
          const { name, contact, message } = req.body;
          const newComplaint = await prisma.complaint.create({ data: { name, contact, message } });
          res.status(201).json({ message: 'Complaint submitted successfully', data: newComplaint });
      } catch (error) {
          res.status(500).json({ message: 'Error submitting complaint', error: error.message });
      }
  },
  updateComplaintStatus: async (req, res) => {
      try {
          const { status } = req.body; // PENDING, IN_PROGRESS, RESOLVED, REJECTED
          const updatedComplaint = await prisma.complaint.update({
              where: { id: req.params.id },
              data: { status }
          });
          res.status(200).json(updatedComplaint);
      } catch (error) {
          res.status(500).json({ message: 'Error updating complaint status', error: error.message });
      }
  },

  // --- Letter Requests ---
  getLetterRequests: async (req, res) => {
      try {
          const requests = await prisma.letterRequest.findMany({ orderBy: { createdAt: 'desc' } });
          res.status(200).json(requests);
      } catch (error) {
          res.status(500).json({ message: 'Error fetching letter requests', error: error.message });
      }
  },
  createLetterRequest: async (req, res) => {
      try {
          const { requesterName, nik, requestType, details } = req.body;
          const newRequest = await prisma.letterRequest.create({ data: { requesterName, nik, requestType, details } });
          res.status(201).json({ message: 'Letter request submitted successfully', data: newRequest });
      } catch (error) {
          res.status(500).json({ message: 'Error submitting letter request', error: error.message });
      }
  },
  updateLetterRequestStatus: async (req, res) => {
      try {
          const { status } = req.body;
          const updatedRequest = await prisma.letterRequest.update({
              where: { id: req.params.id },
              data: { status }
          });
          res.status(200).json(updatedRequest);
      } catch (error) {
          res.status(500).json({ message: 'Error updating letter request status', error: error.message });
      }
  }
};

module.exports = servicesController;
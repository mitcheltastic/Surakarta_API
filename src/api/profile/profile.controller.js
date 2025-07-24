// --- File: /src/api/profile/profile.controller.js ---
const profilePrisma = require('../../services/prisma');

const profileController = {
  // --- Site Content Methods ---
  getSiteContent: async (req, res) => {
    try {
      // Find or create the single row of content
      let content = await profilePrisma.siteContent.findUnique({ where: { id: 'main_content' } });
      if (!content) {
          content = await profilePrisma.siteContent.create({ data: { id: 'main_content' } });
      }
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching site content', error: error.message });
    }
  },
  updateSiteContent: async (req, res) => {
    try {
      const { historyText, demographics, contactInfo, googleMapsUrl } = req.body;
      const updatedContent = await profilePrisma.siteContent.update({
        where: { id: 'main_content' },
        data: { historyText, demographics, contactInfo, googleMapsUrl }
      });
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating site content', error: error.message });
    }
  },

  // --- Village Official Methods ---
  getOfficials: async (req, res) => {
    try {
        const officials = await profilePrisma.villageOfficial.findMany({ orderBy: { order: 'asc' } });
        res.status(200).json(officials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching officials', error: error.message });
    }
  },
  createOfficial: async (req, res) => {
    try {
        const { name, position, imageUrl, order } = req.body;
        const newOfficial = await profilePrisma.villageOfficial.create({ data: { name, position, imageUrl, order } });
        res.status(201).json(newOfficial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating official', error: error.message });
    }
  },
  updateOfficial: async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, imageUrl, order } = req.body;
        const updatedOfficial = await profilePrisma.villageOfficial.update({
            where: { id },
            data: { name, position, imageUrl, order }
        });
        res.status(200).json(updatedOfficial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating official', error: error.message });
    }
  },
  deleteOfficial: async (req, res) => {
    try {
        const { id } = req.params;
        await profilePrisma.villageOfficial.delete({ where: { id } });
        res.status(200).json({ message: 'Official deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting official', error: error.message });
    }
  }
};

module.exports = profileController;
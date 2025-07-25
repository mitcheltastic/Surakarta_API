// /src/api/profile/profile.controller.js

const prisma = require('../../services/prisma');
const imagekit = require('../../services/imagekit');

const profileController = {
  // --- Site Content Methods (Unchanged) ---
  getSiteContent: async (req, res) => {
    try {
      let content = await prisma.siteContent.findUnique({ where: { id: 'main_content' } });
      if (!content) {
          content = await prisma.siteContent.create({ data: { id: 'main_content' } });
      }
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching site content', error: error.message });
    }
  },
  updateSiteContent: async (req, res) => {
    try {
      const { historyText, demographics, contactInfo, googleMapsUrl } = req.body;
      const updatedContent = await prisma.siteContent.update({
        where: { id: 'main_content' },
        data: { historyText, demographics, contactInfo, googleMapsUrl }
      });
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ message: 'Error updating site content', error: error.message });
    }
  },

  // --- Village Official Methods (Updated) ---
  getOfficials: async (req, res) => {
    try {
        const officials = await prisma.villageOfficial.findMany({ orderBy: { order: 'asc' } });
        res.status(200).json(officials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching officials', error: error.message });
    }
  },
  createOfficial: async (req, res) => {
    try {
        const { name, position, order } = req.body;
        let imageUrl = null;

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `official_${Date.now()}_${req.file.originalname}`,
                folder: '/village_officials/'
            });
            imageUrl = uploadResponse.url;
        }

        const newOfficial = await prisma.villageOfficial.create({ 
            data: { name, position, order: Number(order) || 0, imageUrl } 
        });
        res.status(201).json(newOfficial);
    } catch (error) {
        res.status(500).json({ message: 'Error creating official', error: error.message });
    }
  },
  updateOfficial: async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, order } = req.body;
        const dataToUpdate = { name, position, order: Number(order) };

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `official_${Date.now()}_${req.file.originalname}`,
                folder: '/village_officials/'
            });
            dataToUpdate.imageUrl = uploadResponse.url;
        }

        const updatedOfficial = await prisma.villageOfficial.update({
            where: { id },
            data: dataToUpdate
        });
        res.status(200).json(updatedOfficial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating official', error: error.message });
    }
  },
  deleteOfficial: async (req, res) => {
    try {
        await prisma.villageOfficial.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Official deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting official', error: error.message });
    }
  }
};

module.exports = profileController;
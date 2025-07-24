// --- File: /src/api/gallery/gallery.controller.js ---
const galleryPrisma = require('../../services/prisma');

const galleryController = {
  getAllGalleryItems: async (req, res) => {
    try {
      const { type } = req.query; // Filter by IMAGE or VIDEO
      const filter = type ? { where: { type } } : {};
      const items = await galleryPrisma.galleryItem.findMany({
        ...filter,
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gallery items', error: error.message });
    }
  },

  createGalleryItem: async (req, res) => {
    try {
      const { title, description, url, type } = req.body;
      if (!url || !type) {
        return res.status(400).json({ message: 'URL and type are required' });
      }
      const newItem = await galleryPrisma.galleryItem.create({
        data: { title, description, url, type }
      });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating gallery item', error: error.message });
    }
  },
  
  deleteGalleryItem: async (req, res) => {
    try {
        const { id } = req.params;
        await galleryPrisma.galleryItem.delete({ where: { id } });
        res.status(200).json({ message: 'Gallery item deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
  }
};

module.exports = galleryController;
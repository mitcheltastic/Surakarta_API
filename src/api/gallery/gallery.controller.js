// /src/api/gallery/gallery.controller.js

const prisma = require('../../services/prisma');
const imagekit = require('../../services/imagekit');

const galleryController = {
  getAllGalleryItems: async (req, res) => {
    try {
      const { type } = req.query;
      const filter = type ? { where: { type } } : {};
      const items = await prisma.galleryItem.findMany({ ...filter, orderBy: { createdAt: 'desc' } });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gallery items', error: error.message });
    }
  },

  createGalleryItem: async (req, res) => {
    try {
      const { title, description, type } = req.body;
      let url = req.body.url || null; // Allow passing URL for videos

      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `gallery_${Date.now()}_${req.file.originalname}`,
          folder: '/village_gallery/'
        });
        url = uploadResponse.url;
      }
      
      if (!url) {
        return res.status(400).json({ message: 'No file uploaded or URL provided.' });
      }

      const newItem = await prisma.galleryItem.create({
        data: { title, description, url, type }
      });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating gallery item', error: error.message });
    }
  },
  
  deleteGalleryItem: async (req, res) => {
    try {
        await prisma.galleryItem.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Gallery item deleted' });
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ message: 'Item not found' });
        res.status(500).json({ message: 'Error deleting item', error: error.message });
    }
  }
};

module.exports = galleryController;
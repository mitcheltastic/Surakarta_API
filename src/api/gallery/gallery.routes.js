// /src/api/gallery/gallery.routes.js

const router = require('express').Router();
const galleryController = require('./gallery.controller');
const authenticateToken = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

router.get('/', galleryController.getAllGalleryItems);
// For gallery, we'll use the field name 'media'
router.post('/', authenticateToken, upload.single('media'), galleryController.createGalleryItem);
router.delete('/:id', authenticateToken, galleryController.deleteGalleryItem);

module.exports = router;
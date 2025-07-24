// --- File: /src/api/gallery/gallery.routes.js ---
const galleryRouter = require('express').Router();
const galleryController = require('./gallery.controller');
const galleryAuthMiddleware = require('../../middlewares/auth.middleware');

galleryRouter.get('/', galleryController.getAllGalleryItems);
galleryRouter.post('/', galleryAuthMiddleware, galleryController.createGalleryItem);
galleryRouter.delete('/:id', galleryAuthMiddleware, galleryController.deleteGalleryItem);

module.exports = galleryRouter;
// /src/api/news/news.routes.js

const router = require('express').Router();
const postController = require('./news.controller');
const authenticateToken = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');

// Public routes are unchanged
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Admin routes now handle a single file upload with the field name 'image'
router.post('/', authenticateToken, upload.single('image'), postController.createPost);
router.put('/:id', authenticateToken, upload.single('image'), postController.updatePost);
router.delete('/:id', authenticateToken, postController.deletePost);

module.exports = router;
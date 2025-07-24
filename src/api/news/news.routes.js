const newsRouter = require('express').Router();
const postController = require('./news.controller');
const authenticateToken = require('../../middlewares/auth.middleware');

// --- Public Routes (anyone can access) ---
newsRouter.get('/', postController.getAllPosts);
newsRouter.get('/:id', postController.getPostById);

// --- Admin Routes (protected) ---
newsRouter.post('/', authenticateToken, postController.createPost);
newsRouter.put('/:id', authenticateToken, postController.updatePost);
newsRouter.delete('/:id', authenticateToken, postController.deletePost);

module.exports = newsRouter;
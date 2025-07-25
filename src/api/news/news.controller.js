// /src/api/news/news.controller.js

const prisma = require('../../services/prisma');
const imagekit = require('../../services/imagekit');

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const { type } = req.query;
      const filter = type ? { where: { type } } : {};
      const posts = await prisma.post.findMany({ ...filter, orderBy: { createdAt: 'desc' } });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await prisma.post.findUnique({ where: { id: req.params.id } });
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, type } = req.body;
      let imageUrl = null;

      // Check if a file was uploaded
      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `post_${Date.now()}_${req.file.originalname}`,
          folder: '/village_posts/' // Optional: folder in ImageKit
        });
        imageUrl = uploadResponse.url;
      }

      const newPost = await prisma.post.create({
        data: { title, content, type, imageUrl },
      });
      res.status(201).json({ message: 'Post created successfully', data: newPost });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, type } = req.body;
      const dataToUpdate = { title, content, type };

      // Check if a new file was uploaded to replace the old one
      if (req.file) {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: `post_${Date.now()}_${req.file.originalname}`,
          folder: '/village_posts/'
        });
        dataToUpdate.imageUrl = uploadResponse.url;
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: dataToUpdate,
      });
      res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
    } catch (error) {
      res.status(500).json({ message: 'Error updating post', error: error.message });
    }
  },
  
  deletePost: async (req, res) => {
     try {
      await prisma.post.delete({ where: { id: req.params.id } });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Post not found' });
      res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  },
};

module.exports = postController;
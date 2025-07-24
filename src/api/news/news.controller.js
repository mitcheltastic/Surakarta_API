const newsPrisma = require('../../services/prisma');

const newsPostController = {
  // GET /api/posts
  // Get all posts, with optional filtering by type
  getAllPosts: async (req, res) => {
    try {
      const { type } = req.query; // e.g., /api/posts?type=NEWS
      const filter = type ? { where: { type } } : {};
      
      const posts = await newsPrisma.post.findMany({
        ...filter,
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
  },

  // GET /api/posts/:id
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await newsPrisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
  },

  // POST /api/posts
  createPost: async (req, res) => {
    try {
      const { title, content, imageUrl, type } = req.body;

      if (!title || !content || !type) {
        return res.status(400).json({ message: 'Title, content, and type are required' });
      }

      const newPost = await newsPrisma.post.create({
        data: {
          title,
          content,
          imageUrl,
          type, // Should be 'NEWS', 'ANNOUNCEMENT', or 'AGENDA'
        },
      });
      res.status(201).json({ message: 'Post created successfully', data: newPost });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  },

  // PUT /api/posts/:id
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, imageUrl, type } = req.body;

      const updatedPost = await newsPrisma.post.update({
        where: { id },
        data: { title, content, imageUrl, type },
      });
      res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(500).json({ message: 'Error updating post', error: error.message });
    }
  },

  // DELETE /api/posts/:id
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      await newsPrisma.post.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  },
};

// To avoid naming conflicts, we export the controller with a unique name
module.exports = {
    ...newsPostController
};
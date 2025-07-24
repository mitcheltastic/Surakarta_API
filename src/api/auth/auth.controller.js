const prisma = require('../../services/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: 'Admin registered successfully', data: { id: admin.id, username: admin.username } });
    } catch (error) {
       if (error.code === 'P2002') { // Unique constraint failed
        return res.status(409).json({ message: 'Username already exists' });
      }
      res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await prisma.admin.findUnique({ where: { username } });

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Ensure you have a JWT_SECRET in your .env file!
      const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: '8h', // Token expires in 8 hours
      });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },
  
  getMe: async (req, res) => {
    // The user object is attached to the request by the authenticateToken middleware
    res.status(200).json(req.user);
  }
};

module.exports = authController;
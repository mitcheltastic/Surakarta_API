const prisma = require('../../services/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node.js module for generating random tokens

const authController = {
  register: async (req, res) => {
    // ... (This function remains the same)
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: { username, password: hashedPassword },
      });
      res.status(201).json({ message: 'Admin registered successfully', data: { id: admin.id, username: admin.username } });
    } catch (error) {
       if (error.code === 'P2002') {
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

      // --- UPDATED EXPIRATION TIME ---
      const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token now expires in 7 days
      });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },
  
  getMe: async (req, res) => {
    // This function acts as the "Who Am I" endpoint.
    // If the token is valid, it returns the user's data.
    // The frontend can call this on page load to check for a valid session.
    res.status(200).json(req.user);
  },

  // --- NEW FUNCTION: Forgot Password ---
  forgotPassword: async (req, res) => {
    try {
        const { username } = req.body;
        const admin = await prisma.admin.findUnique({ where: { username } });

        if (!admin) {
            // Send a generic success message to prevent username enumeration
            return res.status(200).json({ message: 'If a user with that username exists, a password reset link has been sent.' });
        }

        // 1. Generate a random, unhashed token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 2. Hash the token before saving it to the database for security
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // 3. Set an expiry date (e.g., 1 hour from now)
        const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

        // 4. Update the admin record
        await prisma.admin.update({
            where: { username: admin.username },
            data: { passwordResetToken, passwordResetExpires }
        });

        // 5. Send the token back to the user (simulating an email)
        // In a real app, you would use a service like Nodemailer to email this link:
        // const resetUrl = `http://your-frontend.com/reset-password/${resetToken}`;
        // sendEmail({ to: admin.email, subject: 'Password Reset', text: `Reset your password here: ${resetUrl}` });
        
        res.status(200).json({ 
            message: 'Password reset token generated. This would normally be emailed to the user.',
            resetToken: resetToken // Return the unhashed token for testing
        });

    } catch (error) {
        res.status(500).json({ message: 'Error processing forgot password request', error: error.message });
    }
  },

  // --- NEW FUNCTION: Reset Password ---
  resetPassword: async (req, res) => {
    try {
        // 1. Hash the incoming token from the URL params
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // 2. Find the user by the hashed token and check if it's still valid
        const admin = await prisma.admin.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { gt: new Date() } // 'gt' means "greater than" (i.e., not expired)
            }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // 3. If the token is valid, update the password
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'New password is required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                // Clear the reset token fields after successful reset
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }
};

module.exports = authController;
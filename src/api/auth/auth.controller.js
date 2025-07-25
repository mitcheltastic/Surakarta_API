const prisma = require('../../services/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../services/mailer'); // Import the mailer

const authController = {
  // --- UPDATED: Register now requires email ---
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: {
            username: username,
            email: email,
            password: hashedPassword
        },
      });
      res.status(201).json({ message: 'Admin registered successfully', data: { id: admin.id, username: admin.username, email: admin.email } });
    } catch (error) {
       if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Username or email already exists' });
      }
      res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
  },

  // --- Login and getMe are now filled in ---
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await prisma.admin.findUnique({ where: { username } });

      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },

  getMe: async (req, res) => {
    res.status(200).json(req.user);
  },

  // --- NEW: Step 1 of Password Reset ---
  // RENAMED from sendResetCode to forgotPassword to match auth.routes.js
  forgotPassword: async (req, res) => {
    try {
        const { email } = req.body;

        // Added validation for email presence
        if (!email) {
            return res.status(400).json({ message: 'Email is required for password reset.' });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            // Security: Don't reveal if an email is registered or not.
            return res.status(200).json({ message: 'If an account with that email exists, a verification code has been sent.' });
        }

        // 1. Generate a 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Set an expiry date (e.g., 10 minutes from now)
        const verificationCodeExpires = new Date(Date.now() + 600000); // 10 minutes

        // 3. Update the admin record with the code and expiry
        await prisma.admin.update({
            where: { email: admin.email },
            data: { verificationCode, verificationCodeExpires }
        });

        // 4. Email the code to the user
        const emailHtml = `<p>Your password reset code is: <b>${verificationCode}</b></p><p>This code will expire in 10 minutes.</p>`;
        await sendEmail({
            to: admin.email,
            subject: 'Your Password Reset Code',
            text: `Your password reset code is: ${verificationCode}`,
            html: emailHtml
        });

        res.status(200).json({ message: 'If an account with that email exists, a verification code has been sent.' });

    } catch (error) {
        res.status(500).json({ message: 'Error sending verification code', error: error.message });
    }
  },

  // --- NEW: Step 2 of Password Reset ---
  // RENAMED from resetPasswordWithCode to resetPassword to match auth.routes.js
  resetPassword: async (req, res) => {
    try {
        const { email, code, password } = req.body;
        if (!email || !code || !password) {
            return res.status(400).json({ message: 'Email, verification code, and new password are required.' });
        }

        // 1. Find the user by email, code, and check if the code is still valid
        const admin = await prisma.admin.findFirst({
            where: {
                email,
                verificationCode: code,
                verificationCodeExpires: { gt: new Date() } // 'gt' means "greater than" (i.e., not expired)
            }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Verification code is invalid or has expired.' });
        }

        // 2. If the code is valid, update the password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                // Clear the verification code fields after successful reset
                verificationCode: null,
                verificationCodeExpires: null
            }
        });

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }
};

module.exports = authController;

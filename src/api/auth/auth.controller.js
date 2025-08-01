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

  logout: async (req, res) => {
    try {
      // In a stateless JWT system, the server's job is done.
      // The client's action of deleting the token is the true logout.
      res.status(200).json({
        message: 'Logout successful'
      });
    } catch (error) {
      // This is a failsafe, but shouldn't be hit with this simple logic.
      res.status(500).json({ message: 'Error during logout', error: error.message });
    }
  },

  getMe: async (req, res) => {
    res.status(200).json(req.user);
  },

  // --- NEW: Step 1 of Password Reset ---
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required for password reset.' });
      }

      const admin = await prisma.admin.findUnique({ where: { email } });

      if (!admin) {
        return res.status(200).json({ message: 'If an account with that email exists, a verification code has been sent.' });
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpires = new Date(Date.now() + 600000); // 10 minutes

      await prisma.admin.update({
        where: { email: admin.email },
        data: { verificationCode, verificationCodeExpires }
      });

      // --- EDITED: More beautiful email HTML template matching frontend ---
      const emailHtml = `
              <div style="font-family: 'Open Sans', 'Lato', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #f8f8f8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                  <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                      <h2 style="margin: 0; font-size: 28px;">Desa Surakarta</h2>
                  </div>
                  <div style="padding: 30px 20px;">
                      <p style="font-size: 16px; margin-bottom: 15px;">Hello ${admin.username || 'Admin'},</p>
                      <p style="font-size: 16px; margin-bottom: 20px;">You have requested to reset your password for the Desa Surakarta Administrator System.</p>
                      <p style="font-size: 16px; margin-bottom: 10px;">Your password reset verification code is:</p>
                      <div style="text-align: center; margin: 30px 0;">
                          <span style="display: inline-block; background-color: #FFD700; padding: 18px 30px; border-radius: 5px; font-size: 32px; font-weight: bold; color: #333; letter-spacing: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                              ${verificationCode}
                          </span>
                      </div>
                      <p style="font-size: 14px; color: #555; margin-top: 20px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
                      <p style="font-size: 14px; color: #555;">To complete the reset process, please enter this code on the password reset page.</p>
                  </div>
                  <div style="background-color: #eee; padding: 15px 20px; text-align: center; font-size: 12px; color: #777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Desa Surakarta. All rights reserved.</p>
                  </div>
              </div>
          `;
      // --- END EDITED ---

      await sendEmail({
        to: admin.email,
        subject: 'Your Password Reset Code - Desa Surakarta Admin System', // Enhanced subject
        text: `Your password reset code is: ${verificationCode}. This code will expire in 10 minutes.`,
        html: emailHtml
      });

      res.status(200).json({ message: 'If an account with that email exists, a verification code has been sent.' });

    } catch (error) {
      console.error("Error in forgotPassword:", error); // More specific error logging
      res.status(500).json({ message: 'Error sending verification code', error: error.message });
    }
  },

  // --- NEW: Step 2 of Password Reset ---
  resetPassword: async (req, res) => {
    try {
        const { email, code, password } = req.body;
        if (!email || !code || !password) {
            return res.status(400).json({ message: 'Email, verification code, and new password are required.' });
        }

        const admin = await prisma.admin.findFirst({
            where: {
                email,
                verificationCode: code,
                verificationCodeExpires: { gt: new Date() }
            }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Verification code is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                verificationCode: null,
                verificationCodeExpires: null
            }
        });

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error("Error in resetPassword:", error); // More specific error logging
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
  }
};

module.exports = authController;

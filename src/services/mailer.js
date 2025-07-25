const nodemailer = require('nodemailer');

// IMPORTANT: For production, consider using environment variables for your email credentials
// (e.g., process.env.GMAIL_USER, process.env.GMAIL_APP_PASSWORD)
// to keep them secure and out of your codebase.

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' service for simpler configuration
    auth: {
        user: process.env.GMAIL_ADDRESS, // <-- Now taking value from environment variable
        pass: process.env.APP_PASSWORD   // <-- Now taking value from environment variable
    }
});

// A helper function to send emails
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"Village Admin System" <${process.env.GMAIL_ADDRESS}>`, // Also using env variable here
            to,
            subject,
            text,
            html
        });

        console.log("Message sent: %s", info.messageId);
        // For Gmail, there won't be an Ethereal preview URL.
        // You'll need to check the recipient's actual inbox.
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
};

module.exports = sendEmail;

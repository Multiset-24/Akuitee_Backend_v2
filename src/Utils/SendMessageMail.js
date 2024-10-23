import e from 'express';
import nodemailer from 'nodemailer';

// Define the sendMail function
export const sendMail = async (recipientEmail, recipientName, subject, messageBody) => {
    // Create a transporter using your email service (Gmail in this case)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email address (from environment variables)
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
    });

    // HTML template for the email body
    let htmlTemplate = `
        <h3>Hello, ${recipientName}</h3>
        <p>${messageBody}</p>
    `;

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: recipientEmail, // List of receivers
        subject: subject, // Subject line
        html: htmlTemplate, // HTML body content
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};

export default sendMail;

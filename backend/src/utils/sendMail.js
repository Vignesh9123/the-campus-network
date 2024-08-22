import nodemailer from "nodemailer"

export const sendEmail = async (options) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.MAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
}
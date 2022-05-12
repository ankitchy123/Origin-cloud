const nodemailer = require('nodemailer')

// To send mail using nodemailer
module.exports = sendEmail = (to, url) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "Verify email address",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Origin Cloud.</h2>
            <p>Just click the button below to validate your email address.</p>
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Verify</a>
            </div>
            `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return err;
        }
    })
}
const transporter = require('../config/mail')

exports.sendEmail = async ({ to, subject, text, html }) => {
    try {
        await transporter.sendMail({
            from: `"ShopVerse" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })

        console.log(`email sent to ${to} with subject ${subject}`);
        
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

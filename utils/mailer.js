import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function(details) {
  console.log('Reached Mailer...')
  const info = await transporter.sendMail({
    from: `"Noon Quran" <${process.env.EMAIL_USERNAME}>`, // sender address
    to: details.email, // list of receivers
    subject: "Thank You for Your Purchase – We'll Connect with You Soon!", // Subject line
    text: `Dear ${details.name},

    Thank you so much for your course purchase! We truly appreciate your trust and support.

    We wanted to let you know that we’re currently processing your purchase and will be in touch with you shortly to provide any updates or answer any questions you may have.

    If you have any immediate inquiries or need assistance in the meantime, please feel free to reply to this email or reach out to our customer support team at +971 52 452 5060.

    Thank you again for choosing us. We look forward to serving you!

    Best regards,
    Noon Quran
    +971 52 452 5060
    https://noonquran.com/`,
  });

  console.log("Message sent: %s", info.messageId); // Message Sent log
};
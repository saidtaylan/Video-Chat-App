const nodemailer = require("nodemailer")

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //process.env.MAIL_HOST,
    service: 'Gmail',
    port:587, // process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'saidtaylann@gmail.com', // process.env.EMAIL_ADDRESS' // generated ethereal user
      pass: 'haBi10pasa.263' //process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
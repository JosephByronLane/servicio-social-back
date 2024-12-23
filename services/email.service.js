const nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');


require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Office 365 server
    port: 587,     // secure SMTP
    secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});


//ack
transporter.verify((error, success) => {
    if (error) {
      console.error('Error connecting to email server:', error);
    } else {
      console.log('Email server is ready to take messages');
    }
  });


const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
  

  module.exports = { sendEmail };
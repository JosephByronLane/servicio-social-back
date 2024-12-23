const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const juice = require('juice');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,     
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

//compiles html template for mail
const compileTemplate = (templatePath, replacements) => {
    const source = fs.readFileSync(templatePath, 'utf8').toString();
    const template = handlebars.compile(source);
    const htmlWithVariables = template(replacements);
    const inlinedHtml = juice(htmlWithVariables);
    return inlinedHtml;
  };

  //ack
transporter.verify((error, success) => {
    if (error) {
      console.error('Error connecting to email server:', error);
    } else {
      console.log('Email server is ready to take messages');
    }
  });


  const sendEmail = async (to, subject, templatePath, replacements, attachments = []) => {
    const html = compileTemplate(templatePath, replacements);
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments,
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
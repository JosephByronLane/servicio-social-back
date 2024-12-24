const cron = require('node-cron');
const { Listing, House, Owner, Image } = require('../models');
const path = require('path');
const fs = require('fs-extra');
const { sendEmail } = require('../services/email.service');
const { generateDeletionToken } = require('../services/token.service');
const { Op } = require('sequelize');


const sendMonthlyReminders = async () => {
  try {
    const now = new Date();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(now.getMinutes() - 1);

    const listings = await Listing.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneWeekAgo,
        },
      },
      include: [
        {
          model: House,
          as: 'house',
          include: [
            {
              model: Owner,
              as: 'owner',
            },
          ],
        },
        {
          model: Image,
          as: 'images',
        },
      ],
    });

    console.log(`Found ${listings.length} listings to send reminders.`);

    for (const listing of listings) {
      const owner = listing.house.owner;
      const ownerEmail = owner.email;

      const token = generateDeletionToken({
        listingId: listing.id,
        email: ownerEmail,
      });

      const deletionUrl = `${process.env.FRONTEND_URL}/listing/delete/delete?token=${token}`;

      const templatePath = path.join(__dirname, '..', 'templates', 'email.template.html');
      const logoPath = path.join(__dirname, '..', 'templates', 'logo-universidad-modelo.png');

      const subject = 'Recordatorio sobre disponibilidad de tu listado';
      const replacements = {
        ownerName: owner.firstName,
        listingTitle: listing.title,
        deletionUrl,
      };

      const attachments = [
        {
          filename: 'logo-universidad-modelo.png',
          path: logoPath,
          cid: 'logo_cid', 
        },
      ];

      // Send the email
      await sendEmail(ownerEmail, subject, templatePath, replacements, attachments);
    }

    console.log('Monthly reminder emails sent successfully.');
  } catch (error) {
    console.error('Error sending monthly reminder emails:', error);
  }
};


const initMonthlyEmailScheduler = () => {
  cron.schedule('0 6 * * *', () => {
    console.log('Running monthly email reminder task...');
    sendMonthlyReminders();
  });

  console.log('Monthly email scheduler initialized.');
};



module.exports = initMonthlyEmailScheduler;

// module.exports = sendMonthlyReminders;
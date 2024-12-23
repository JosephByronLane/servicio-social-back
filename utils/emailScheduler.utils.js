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

    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(now.getMinutes() - 1);

    const listings = await Listing.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneMinuteAgo,
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

      const deletionUrl = `${process.env.FRONTEND_URL}/listing/delete??token=${token}`;

      const subject = 'Tienes una casa en renta aun disponible.';
      const text = `blablablablablablablablalbabab`;

      const html = `
        <p>Hola ${owner.firstName},</p>
        <p>Tu listado "<strong>${listing.title}</strong>" bla blab bla aun disponible?</p>
        <a href="${deletionUrl}">borrar</a>
      `;

      await sendEmail(ownerEmail, subject, text, html);
    }

    console.log('Monthly reminder emails sent successfully.');
  } catch (error) {
    console.error('Error sending monthly reminder emails:', error);
  }
};


const initMonthlyEmailScheduler = () => {
  cron.schedule('42 2 * * *', () => {
    console.log('Running monthly email reminder task...');
    sendMonthlyReminders();
  });

  console.log('Monthly email scheduler initialized.');
};



module.exports = initMonthlyEmailScheduler;


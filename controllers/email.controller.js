const { Listing, House, Owner } = require('../models');
const path = require('path');
const fs = require('fs-extra');
const { sendEmail } = require('../services/email.service');
const { generateDeletionToken } = require('../services/token.service');

const createEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findOne({
      where: { id },
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
      ],
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    const owner = listing.house.owner;

    if (!owner || !owner.email) {
      return res.status(400).json({ message: 'Owner email not found.' });
    }

    const token = generateDeletionToken({
      listingId: listing.id,
      email: owner.email,
    });

    const deletionUrl = `${process.env.FRONTEND_URL}/listing/delete/delete?token=${token}`;

    const subject = 'Monthly Listing Availability Reminder';
    const text = `Hello ${owner.firstName},

Your listing titled "${listing.title}" is up for a monthly check-in.

Is this listing still available?

If it's no longer available, please remove it by clicking the link below:

${deletionUrl}

If the listing is still active, no further action is needed.

Best regards,
House Rental Team`;

    const html = `
      <p>Hello ${owner.firstName},</p>
      <p>Your listing titled "<strong>${listing.title}</strong>" is up for a monthly check-in.</p>
      <p>Is this listing still available?</p>
      <p>If it's no longer available, please remove it by clicking the link below:</p>
      <a href="${deletionUrl}">Remove Listing</a>
      <p>If the listing is still active, no further action is needed.</p>
      <p>Best regards,<br/>House Rental Team</p>
    `;

    await sendEmail(owner.email, subject, text, html);

    res.status(200).json({ message: 'Reminder email sent successfully.' });
  } catch (error) {
    console.error('Error sending reminder email:', error);
    res.status(500).json({
      message: 'An error occurred while sending the reminder email.',
      error: error.message,
    });
  }
};

module.exports = { createEmail };

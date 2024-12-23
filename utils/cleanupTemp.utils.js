const cron = require('node-cron');
const path = require('path');
const fs = require('fs-extra');
const { Image } = require('../models');
const { Op } = require('sequelize');
require('dotenv').config();

const tempDir = process.env.UPLOAD_TEMP_DIR || './assets/temp';

const scheduleCleanup = () => {
  //job runs at midnight
    cron.schedule('0 0 * * *', async () => {
      try {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  
        // images with temp id and older than cutoff (24h)
        const oldImages = await Image.findAll({
          where: {
            tempId: { [Op.ne]: null },
            createdAt: { [Op.lt]: cutoff },
          },
        });
  
        for (const image of oldImages) {
          const filePath = path.resolve(image.imageUrl);
          await fs.remove(filePath);
  
          await image.destroy();
        }
  
        const tempIds = await fs.readdir(tempDir);
        for (const tempId of tempIds) {
          const dirPath = path.join(tempDir, tempId);
          const files = await fs.readdir(dirPath);
          if (files.length === 0) {
            await fs.remove(dirPath);
          }
        }
  
        console.log('Temporary uploads cleaned up successfully.');
      } catch (error) {
        console.error('Error during cleanup of temporary uploads:', error);
      }
    });
  
    console.log('Scheduled cleanup cron job initialized.');
  };
  
  module.exports = scheduleCleanup;
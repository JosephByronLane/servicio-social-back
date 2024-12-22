const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs-extra');
const { Image } = require('../models');

require('dotenv').config();

const tempDir = process.env.UPLOAD_TEMP_DIR || './assets/temp';

//function returns a unique UUID for temp storage of images before the final POST listing request.
//NOTE: this is a temporary storage solution, and the images will be deleted after 24 hours.
const initiateUpload = async (req, res) => {
  try {
    const tempId = uuidv4();

    // Create temporary directory
    const uploadPath = path.join(tempDir, tempId);
    await fs.ensureDir(uploadPath);

    res.status(200).json({ tempId });
  } catch (error) {
    console.error('Error initiating upload:', error);
    res.status(500).json({ message: 'Failed to initiate upload session.' });
  }
};


//doesn't actually upload the images, but rather saves the image URL to the database.
//the actual uploading is in upload.middleware, which is called before this function is.
const uploadImages = async (req, res) => {
  try {
    const { tempId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    const imageRecords = await Promise.all(
      files.map(async (file) => {
        const imageUrl = path.relative('./', file.path).replace(/\\/g, '/'); 

        //record without listing id, it will get added at the POST to the listing endpoint.
        const image = await Image.create({
          tempId,
          imageUrl,
        });

        return {
          id: image.id,
          imageUrl,
        };
      })
    );

    res.status(200).json({ images: imageRecords });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Failed to upload images.' });
  }
};

module.exports = {
    initiateUpload,
    uploadImages,
}
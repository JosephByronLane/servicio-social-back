const express = require('express');
const router = express.Router();
const { uploadImages, initiateUpload } = require('../controllers/image.controller');
const upload = require('../middleware/upload.middleware');


router.post('/upload', initiateUpload);
router.post('/upload/:tempId', upload.array('images', 10), uploadImages)


module.exports = router;
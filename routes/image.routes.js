const express = require('express');
const router = express.Router();
const { uploadImages, initiateUpload } = require('../controllers/image.controller');
const upload = require('../middleware/upload.middleware');

router.get('/upload', (req, res) => {
    res.status(404).json({ error: 'Nope. Wrong endpoint. Its a POST to generate the tempId.' });
})

router.post('/upload', initiateUpload);
router.post('/upload/:tempId', upload.array('images', 10), uploadImages)


module.exports = router;
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

require('dotenv').config();

const tempDir = process.env.UPLOAD_TEMP_DIR || './assets/temp';

fs.ensureDirSync(tempDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { tempId } = req.params;
    const uploadPath = path.join(tempDir, tempId);

   
    fs.ensureDir(uploadPath)
      .then(() => cb(null, uploadPath))
      .catch((err) => cb(err, uploadPath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    const error = new Error('Only image files (jpeg, jpg, png) are allowed!');
    error.status = 400; 
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit per file
});

module.exports = upload;

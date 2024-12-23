const express = require('express');
const router = express.Router();
const { createEmail } = require('../controllers/email.controller');

router.post('/:id/send-reminder', createEmail); // Apply authentication if necessary

module.exports = router;

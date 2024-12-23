const jwt = require('jsonwebtoken');
require('dotenv').config();



const generateDeletionToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
  };
  
const verifyDeletionToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };
  
  module.exports = { generateDeletionToken, verifyDeletionToken };
const express = require('express');
const router = express.Router();
const { createOwner, getOwners } = require("../controllers/owner.controller");



router.post('/', async (req, res) => {
    try {
      const user = await createOwner(req, res);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
router.get('/', async (req, res) => {
try {
    const users = await getOwners(req, res);
    res.status(200).json(users);
} catch (error) {
    res.status(500).json({ error: error.message });
}
});


module.exports = router;

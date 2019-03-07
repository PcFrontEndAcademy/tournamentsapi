const express = require('express');
const groupController = require('../controllers/group');

const router = express.Router();

router.post('', groupController.create);
router.get('', groupController.get);
router.put('/addParticipants', groupController.addparticipants);

module.exports = router;
const express = require('express');
const groupController = require('../controllers/group');

const router = express.Router();

router.post('', groupController.create);
router.get('', groupController.get);
router.post('/addParticipants', groupController.addparticipants);
router.post('/addParticipant', groupController.addparticipant);
router.post('/start', groupController.start);

module.exports = router;
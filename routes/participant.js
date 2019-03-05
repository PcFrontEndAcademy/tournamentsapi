const express = require('express');
const participantController = require('../controllers/participant');

const router = express.Router();

router.post('', participantController.create);
router.get('', participantController.get);

module.exports = router;
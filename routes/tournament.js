const express = require('express');
const tournamentController = require('../controllers/tournament');

const router = express.Router();

router.post('', tournamentController.create);
router.get('', tournamentController.get);

module.exports = router;
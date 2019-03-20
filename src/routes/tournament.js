const express = require('express');
const tournamentController = require('../controllers/tournament');
const passport = require('passport');
const router = express.Router();

router.post('', passport.authenticate('jwt', {session: false}), tournamentController.create);
router.get('', tournamentController.get);

module.exports = router;
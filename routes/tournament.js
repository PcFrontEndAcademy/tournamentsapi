const express = require('express');
const tournamentController = require('../controllers/tournament');
const passport = require('passport');
const router = express.Router();

router.post('', passport.authenticate('jwt', {session: false}), tournamentController.create);
router.get('', tournamentController.get);
router.get('/:id', passport.authenticate('jwt', {session: false}), tournamentController.getOne);
router.delete('', passport.authenticate('jwt', {session: false}), tournamentController.delete);
router.put('/updateSettings', passport.authenticate('jwt', {session: false}), tournamentController.updateSettings);

module.exports = router;
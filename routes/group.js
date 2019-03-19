const express = require('express');
const groupController = require('../controllers/group');
const passport = require('passport');
const router = express.Router();

router.post('', passport.authenticate('jwt', {session: false}), groupController.create);
router.get('', groupController.get);
router.post('/addParticipants', passport.authenticate('jwt', {session: false}), groupController.addparticipants);
router.post('/addParticipant',passport.authenticate('jwt', {session: false}), groupController.addparticipant);
router.post('/start', passport.authenticate('jwt', {session: false}), groupController.start);
router.post('/addResult', passport.authenticate('jwt', {session: false}), groupController.addResult);

module.exports = router;
const express = require('express');
const participantController = require('../controllers/participant');
const passport = require('passport');
const router = express.Router();

router.post('', passport.authenticate('jwt', {session: false}), participantController.create);
router.get('', participantController.get);
router.get('/getUnusedInTournament', participantController.getUnusedInTournament);

module.exports = router;
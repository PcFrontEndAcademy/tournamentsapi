const express = require('express');
const passport = require('passport');
const participantController = require('../controllers/participant');

const router = express.Router();

router.post('', passport.authenticate('jwt', { session: false }), participantController.create);
router.get('', participantController.get);
router.get('/getUnusedInTournament', participantController.getUnusedInTournament);

module.exports = router;

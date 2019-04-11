const express = require('express');
const teamController = require('../controllers/team');
const passport = require('passport');
const router = express.Router();

router.post('', passport.authenticate('jwt', {session: false}), teamController.create);
router.get('', teamController.get);

module.exports = router;
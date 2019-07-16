const express = require('express');
const passport = require('passport');
const teamController = require('../controllers/team');

const router = express.Router();

router.post('', passport.authenticate('jwt', { session: false }), teamController.create);
router.get('', teamController.get);

module.exports = router;

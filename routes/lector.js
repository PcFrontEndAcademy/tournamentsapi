const express = require('express');
const lectorController = require('../controllers/lector');

const router = express.Router();

router.post('', lectorController.create);
router.get('', lectorController.get);

module.exports = router;
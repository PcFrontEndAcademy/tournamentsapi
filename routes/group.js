const express = require('express');
const groupController = require('../controllers/group');

const router = express.Router();

router.post('', groupController.create);
router.get('', groupController.get);

module.exports = router;
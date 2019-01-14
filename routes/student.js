const express = require('express');
const studentController = require('../controllers/student');

const router = express.Router();

router.post('', studentController.create);
router.get('', studentController.get);

module.exports = router;
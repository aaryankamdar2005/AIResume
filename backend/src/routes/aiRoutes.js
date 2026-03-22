const express = require('express');
const router = express.Router();
const { editResumeWithAI, optimizeResume } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/edit', protect, editResumeWithAI);
router.post('/optimize', protect, optimizeResume);

module.exports = router;

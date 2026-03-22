const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResumeAgainstJD } = require('../controllers/analyzerController');
const { protect } = require('../middlewares/authMiddleware');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Route expects a 'resume' file and optional 'jd_file' file
router.post(
  '/match',
  protect,
  upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'jd_file', maxCount: 1 }]),
  analyzeResumeAgainstJD
);

module.exports = router;

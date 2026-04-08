const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateQuestions, transcribeAudio, scoreAnswer } = require('../controllers/interviewController');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for audio/resumes
});

router.post(
  '/generate-questions',
  protect,
  upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'jd_file', maxCount: 1 }]),
  generateQuestions
);

router.post(
  '/transcribe',
  protect,
  upload.single('audio'),
  transcribeAudio
);

router.post(
  '/score',
  protect,
  scoreAnswer
);

module.exports = router;

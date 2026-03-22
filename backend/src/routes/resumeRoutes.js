const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getResumeVersions
} = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getResumes)
  .post(protect, createResume);

router.route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

router.get('/:id/versions', protect, getResumeVersions);

module.exports = router;

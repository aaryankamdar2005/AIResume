const express = require('express');
const router = express.Router();
const { exportToPDF, previewLatexPDF } = require('../controllers/exportController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/pdf/:id', protect, exportToPDF);
router.post('/preview', previewLatexPDF);

module.exports = router;

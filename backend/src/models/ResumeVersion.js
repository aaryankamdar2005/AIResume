const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  commitMessage: {
    type: String,
    default: 'Manual update'
  },
  contentSnapshot: {
    type: Object, // Stores exact JSON snapshot of the resume content
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResumeVersion', resumeVersionSchema);

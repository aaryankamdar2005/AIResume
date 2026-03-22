const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  templateId: {
    type: String,
    default: 'modern-1'
  },
  content: {
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      github: String,
      linkedin: String
    },
    summary: String,
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String
    }],
    skills: [String],
    projects: [{
      title: String,
      subtitle: String,
      link: String,
      startDate: String,
      endDate: String,
      description: String
    }]
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isLatexFormat: {
    type: Boolean,
    default: false
  },
  latexContent: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);

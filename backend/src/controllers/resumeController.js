const Resume = require('../models/Resume');
const ResumeVersion = require('../models/ResumeVersion');

// @desc    Get user resumes
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ lastModified: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
exports.createResume = async (req, res) => {
  const { title, templateId, isLatexFormat, content, latexContent } = req.body;

  try {
    const resume = await Resume.create({
      userId: req.user.id,
      title: title || 'Untitled Resume',
      templateId: templateId || 'modern-1',
      isLatexFormat: isLatexFormat || false,
      content: content || {},
      latexContent: latexContent || ''
    });

    // Create initial version
    await ResumeVersion.create({
      resumeId: resume._id,
      versionNumber: 1,
      commitMessage: 'Initial creation',
      contentSnapshot: resume.isLatexFormat ? { latexContent: resume.latexContent } : resume.content
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, templateId, isLatexFormat, content, latexContent, commitMessage } = req.body;

    // Update fields if provided
    if (title) resume.title = title;
    if (templateId) resume.templateId = templateId;
    if (isLatexFormat !== undefined) resume.isLatexFormat = isLatexFormat;
    if (content) resume.content = content;
    if (latexContent) resume.latexContent = latexContent;
    
    resume.lastModified = Date.now();
    await resume.save();

    // Find latest version number
    const latestVersion = await ResumeVersion.findOne({ resumeId: resume._id }).sort({ versionNumber: -1 });
    const nextVersionNum = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // Create new version
    await ResumeVersion.create({
      resumeId: resume._id,
      versionNumber: nextVersionNum,
      commitMessage: commitMessage || 'Manual update',
      contentSnapshot: resume.isLatexFormat ? { latexContent: resume.latexContent } : resume.content
    });

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated versions and the resume
    await ResumeVersion.deleteMany({ resumeId: req.params.id });
    await resume.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resume versions
// @route   GET /api/resumes/:id/versions
// @access  Private
exports.getResumeVersions = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const versions = await ResumeVersion.find({ resumeId: req.params.id }).sort({ versionNumber: -1 });
    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

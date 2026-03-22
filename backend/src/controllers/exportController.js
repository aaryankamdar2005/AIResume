// Puppeteer removed in favor of LaTeX engine
const Resume = require('../models/Resume');
// const AWS = require('aws-sdk'); // For future S3 implementation

// Helper to securely escape special LaTeX characters
const escapeLatex = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde ')
    .replace(/\^/g, '\\textasciicircum ');
};

// Map JSON Resume to a full compilable LaTeX document
const resumeJsonToLatex = (content) => {
  const { personalInfo, summary, experience, education, projects, skills } = content || {};

  let latex = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{} 
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo?.fullName || 'Untitled')}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personalInfo?.phone || '')} $|$ \\href{mailto:${escapeLatex(personalInfo?.email || '')}}{\\underline{${escapeLatex(personalInfo?.email || '')}}} $|$ 
    ${personalInfo?.linkedin ? `\\href{${personalInfo.linkedin}}{\\underline{LinkedIn}} $|$ ` : ''}
    ${personalInfo?.github ? `\\href{${personalInfo.github}}{\\underline{GitHub}} $|$ ` : ''}
    ${escapeLatex(personalInfo?.location || '')}
\\end{center}
`;

  if (summary) {
    latex += `
\\section{Summary}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item \\small{${escapeLatex(summary)}}
\\end{itemize}
`;
  }

  if (experience && experience.length > 0) {
    latex += `\\section{Experience}\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    experience.forEach(exp => {
      latex += `  \\resumeSubheading{${escapeLatex(exp.title)}}{${escapeLatex(exp.location)}}{${escapeLatex(exp.company)}}{${escapeLatex(exp.startDate)} -- ${exp.current ? 'Present' : escapeLatex(exp.endDate)}}\n`;
      if (exp.description) {
        latex += `  \\begin{itemize}\n`;
        const bullets = exp.description.split('\\n').filter(b => b.trim());
        if (bullets.length > 0) {
            bullets.forEach(bullet => {
              latex += `    \\resumeItem{${escapeLatex(bullet.replace(/^[-*•]\\s*/, ''))}}\n`;
            });
        } else {
            latex += `    \\resumeItem{${escapeLatex(exp.description)}}\n`;
        }
        latex += `  \\end{itemize}\n`;
      }
    });
    latex += `\\end{itemize}\n`;
  }

  if (projects && projects.length > 0) {
    latex += `\\section{Projects}\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    projects.forEach(proj => {
      latex += `  \\resumeProjectHeading{\\textbf{${escapeLatex(proj.title)}} $|$ \\emph{${escapeLatex(proj.subtitle)}}}{${escapeLatex(proj.startDate)} -- ${escapeLatex(proj.endDate)}}\n`;
      if (proj.description) {
        latex += `  \\begin{itemize}\n`;
        const bullets = proj.description.split('\\n').filter(b => b.trim());
        if (bullets.length > 0) {
            bullets.forEach(bullet => {
              latex += `    \\resumeItem{${escapeLatex(bullet.replace(/^[-*•]\\s*/, ''))}}\n`;
            });
        } else {
            latex += `    \\resumeItem{${escapeLatex(proj.description)}}\n`;
        }
        latex += `  \\end{itemize}\n`;
      }
    });
    latex += `\\end{itemize}\n`;
  }

  if (skills && Array.isArray(skills) && skills.length > 0) {
    // If it's a flat array of strings
    latex += `
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item \\small{
    ${skills.map(skill => escapeLatex(typeof skill === 'string' ? skill : JSON.stringify(skill))).join(', ')}
  }
\\end{itemize}
`;
  }

  if (education && education.length > 0) {
    latex += `\\section{Education}\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    education.forEach(edu => {
      latex += `  \\resumeSubheading{${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}{${escapeLatex(edu.degree)} ${escapeLatex(edu.fieldOfStudy ? 'in '+edu.fieldOfStudy : '')}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}\n`;
    });
    latex += `\\end{itemize}\n`;
  }

  latex += `\\end{document}`;
  return latex;
};

// @desc    Export Resume as PDF
// @route   POST /api/export/pdf/:id
// @access  Private
exports.exportToPDF = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const fullLatex = resumeJsonToLatex(resume.content);
    const resp = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(fullLatex)}&command=xelatex`);
    if (!resp.ok) {
      return res.status(500).json({ message: 'Failed to compile LaTeX document' });
    }
    const arrayBuffer = await resp.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.title.replace(/\\s+/g, '_')}_Resume.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    return res.send(pdfBuffer);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

// @desc    Preview LaTeX as PDF
// @route   POST /api/export/preview
// @access  Public
exports.previewLatexPDF = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Missing resume content' });
    }

    const fullLatex = resumeJsonToLatex(content);
    const response = await fetch(`https://latexonline.cc/compile?text=${encodeURIComponent(fullLatex)}&command=xelatex`);
    if (!response.ok) {
      const errText = await response.text();
      console.error('LaTeX Compile Error:', errText);
      return res.status(500).json({ message: 'Failed to compile LaTeX for preview' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="preview.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('LaTeX Preview Error:', error);
    res.status(500).json({ message: 'Failed to generate LaTeX preview' });
  }
};

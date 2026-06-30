const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key') {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const fallbackModels = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768'
];

async function attemptGroqCall(systemPrompt, userPrompt, temperature) {
  let modelsToTry = [...fallbackModels];
  while (modelsToTry.length > 0) {
    const modelName = modelsToTry.shift();
    try {
      const response = await groq.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: temperature,
        response_format: { type: "json_object" }
      });
      return response;
    } catch (err) {
      if (err?.error?.error?.code === 'model_decommissioned' || err?.message?.includes('decommissioned')) {
        console.warn(`Model ${modelName} retired - trying fallback...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("All fallback models failed.");
}

async function extractTextFromFile(file) {
  if (!file) return '';
  const ext = file.originalname.split('.').pop().toLowerCase();
  try {
    if (ext === 'pdf') {
      const data = await pdfParse(file.buffer);
      return data.text;
    } else if (ext === 'docx') {
      const { value } = await mammoth.extractRawText({ buffer: file.buffer });
      return value;
    } else if (ext === 'txt') {
      return file.buffer.toString('utf-8');
    }
  } catch (error) {
    console.error("Text extraction failed:", error);
  }
  return '';
}

exports.analyzeResumeAgainstJD = async (req, res) => {
  try {
    console.log("==== INCOMING ANALYZER REQUEST ====");
    console.log("Content-Type:", req.headers['content-type']);
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    if (!groq) {
      return res.status(500).json({ message: 'Groq API key missing' });
    }

    const files = req.files || {};
    const resumeFile = files.resume ? files.resume[0] : null;
    const jdFile = files.jd_file ? files.jd_file[0] : null;
    const jdTextRaw = req.body.job_description_text || '';

    if (!resumeFile) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }
    if (!jdFile && !jdTextRaw.trim()) {
      return res.status(400).json({ message: 'Job description file or text is required.' });
    }

    const parsedResumeText = await extractTextFromFile(resumeFile);
    let parsedJdText = jdTextRaw;
    if (jdFile) {
      parsedJdText = await extractTextFromFile(jdFile);
    }

    // truncate logic roughly 4 chars per token, keeping it safely under 20k tokens
    const maxChars = 80000;
    const cleanResume = parsedResumeText.slice(0, maxChars);
    const cleanJd = parsedJdText.slice(0, maxChars);

    const systemPrompt = `You are a Senior AI Recruiter acting as an ATS and career coach.
Your task is to analyze the provided Candidate Resume against the Job Description.

Return your analysis STRICTLY as a JSON object that matches the following schema exactly. Do NOT use markdown formatting outside the JSON, do NOT add preamble.

REQUIRED JSON SCHEMA:
{
  "overall_match_score": number (0-100),
  "skills_match_score": number (0-100),
  "experience_relevance_score": number (0-100),
  "project_relevance_score": number (0-100),
  "ats_keyword_score": number (0-100),
  "technical_depth_score": number (0-100),
  "resume_quality_score": number (0-100),
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3"],
  "recommended_skills": ["skill4"],
  "strengths": ["strength 1"],
  "weaknesses": ["weakness 1"],
  "improvement_suggestions": ["suggestion 1"],
  "ats_keywords_to_add": ["keyword1"],
  "rewritten_resume_bullets": [
    {
      "original": "original bullet from resume",
      "improved": "impact-driven improved bullet"
    }
  ],
  "final_summary": "a brief paragraph summary"
}

RULES:
1. "overall_match_score" should be a realistic percentage match.
2. Only list actual skills extracted. Do not hallucinate.
3. Be highly critical but constructive.
4. "rewritten_resume_bullets" should take 3-5 weak bullets from the resume and rewrite them to incorporate the job description keywords and impact metrics.`;

    const userPrompt = `CANDIDATE RESUME:\n${cleanResume}\n\nJOB DESCRIPTION:\n${cleanJd}`;

    const response = await attemptGroqCall(systemPrompt, userPrompt, 0.1);
    const rawResult = response.choices[0].message.content.trim();

    let resultJson;
    let cleanResult = rawResult;
    if (cleanResult.startsWith('```json')) {
      cleanResult = cleanResult.replace(/```json/i, '').replace(/```$/, '').trim();
    } else if (cleanResult.startsWith('```')) {
      cleanResult = cleanResult.replace(/```/g, '').trim();
    }

    try {
      resultJson = JSON.parse(cleanResult);
    } catch (e) {
      // attempt to sanitize further if there's trailing or leading text
      const match = cleanResult.match(/\{[\s\S]*\}/);
      if (match) {
        resultJson = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse JSON response from LLM");
      }
    }

    res.status(200).json(resultJson);

  } catch (error) {
    console.error('Analyzer Error:', error);
    res.status(500).json({ message: 'Failed to complete analysis.', error: error.message });
  }
};

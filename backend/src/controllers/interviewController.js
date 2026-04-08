const fs = require('fs');
const path = require('path');
const os = require('os');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Groq = require('groq-sdk');

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key') {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// Utility to extract text from files (reused similar logic as analyzer)
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

exports.generateQuestions = async (req, res) => {
  try {
    if (!groq) return res.status(500).json({ message: 'Groq API key missing' });

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

    const maxChars = 20000;
    const cleanResume = parsedResumeText.slice(0, maxChars);
    const cleanJd = parsedJdText.slice(0, maxChars);

    const systemPrompt = `You are an expert Technical Recruiter conducting a Mock Interview.
Based on the candidate's Resume and the Job Description, generate exactly 3 highly specific interview questions.
Return ONLY a JSON object that matches the following schema exactly. Do NOT use markdown formatting outside the JSON.

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}`;
    const userPrompt = `CANDIDATE RESUME:\n${cleanResume}\n\nJOB DESCRIPTION:\n${cleanJd}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const rawResult = response.choices[0].message.content.trim();
    const resultJson = JSON.parse(rawResult);

    res.status(200).json({ questions: resultJson.questions, jdText: cleanJd }); // Returning jdText so frontend can pass it to score
  } catch (error) {
    console.error('generateQuestions Error:', error);
    res.status(500).json({ message: 'Failed to generate questions.', error: error.message });
  }
};

exports.transcribeAudio = async (req, res) => {
  try {
    if (!groq) return res.status(500).json({ message: 'Groq API key missing' });

    const audioFile = req.file;
    if (!audioFile) {
      return res.status(400).json({ message: 'Audio file is required.' });
    }

    // Write buffer to a temp file
    const tempFilePath = path.join(os.tmpdir(), `audio-${Date.now()}-${audioFile.originalname || 'recording.webm'}`);
    fs.writeFileSync(tempFilePath, audioFile.buffer);

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-large-v3',
      response_format: 'json'
    });

    // Cleanup temp file
    fs.unlinkSync(tempFilePath);

    res.status(200).json({ text: transcription.text });
  } catch (error) {
    console.error('transcribeAudio Error:', error);
    res.status(500).json({ message: 'Failed to transcribe audio.', error: error.message });
  }
};

// Helper function to call external Plagiarism API (RapidAPI - Plagiarism Checker API)
async function checkExternalPlagiarism(text) {
  if (!process.env.RAPIDAPI_KEY) {
    console.log("No RAPIDAPI_KEY found, skipping external plagiarism check.");
    return { percentage: 0, isPlagiarized: false };
  }
  
  try {
    // Example using a popular free-tier RapidAPI Plagiarism Checker
    const response = await fetch('https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com'
      },
      body: JSON.stringify({
        text: text,
        language: 'en',
        includeCitations: false,
        scrapeSources: false
      })
    });
    
    if (!response.ok) throw new Error("API request failed");
    
    const result = await response.json();
    // Adjust this parsing based on the exact API response structure you choose
    const percentPlagiarism = result.percentPlagiarism || result.plagiarismPercentage || 0;
    
    return {
      percentage: percentPlagiarism,
      isPlagiarized: percentPlagiarism > 30 // Threshold of 30%
    };
  } catch (error) {
    console.error("External Plagiarism API Error:", error.message);
    return { percentage: 0, isPlagiarized: false };
  }
}

exports.scoreAnswer = async (req, res) => {
  try {
    if (!groq) return res.status(500).json({ message: 'Groq API key missing' });

    const { question, jdText, answerText } = req.body;

    if (!question || !answerText) {
      return res.status(400).json({ message: 'Question and answerText are required.' });
    }
    
    // 1. Run external API plagiarism check
    const plagiarismData = await checkExternalPlagiarism(answerText);

    // 2. Run LLM scoring
    const systemPrompt = `You are an expert Technical Recruiter evaluating a candidate's answer during a Mock Interview.
Review the question, the candidate's answer, and the Job Description contextual constraints.

IMPORTANT PLAGIARISM CONTEXT:
The external Plagiarism API has scanned this text and determined it is ${plagiarismData.percentage}% plagiarized.
If the text is heavily plagiarized from generic online sources or the exact job description, you MUST provide a low score.

Provide a score out of 10 and exactly 2 brief sentences of constructive improvement tip.
If the candidate's answer is plagiarized, mention that in the feedback.

Return ONLY a JSON object exactly matching this schema. Do NOT use markdown formatting outside the JSON.

{
  "score": 8,
  "feedback": "Your tip replacing this string."
}`;
    const userPrompt = `JOB DESCRIPTION CONTEXT:\n${jdText || 'N/A'}\n\nQUESTION: ${question}\n\nCANDIDATE ANSWER: ${answerText}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const rawResult = response.choices[0].message.content.trim();
    const resultJson = JSON.parse(rawResult);
    
    // Deterministic score reduction if plagiarism is high (just to be safe if LLM is generous)
    if (plagiarismData.isPlagiarized) {
      resultJson.score = Math.max(1, resultJson.score - 4); 
    }
    
    // Attach API plagiarism results directly
    resultJson.plagiarism_percentage = plagiarismData.percentage;
    resultJson.is_plagiarized = plagiarismData.isPlagiarized;

    res.status(200).json(resultJson);
  } catch (error) {
    console.error('scoreAnswer Error:', error);
    res.status(500).json({ message: 'Failed to score answer.', error: error.message });
  }
};

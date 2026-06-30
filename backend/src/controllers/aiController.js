const Groq = require('groq-sdk');

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key') {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

// @desc    Helper to call Groq with fallbacks
const fallbackModels = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'qwen2-72b-instruct'
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
      });
      return response;
    } catch (err) {
      if (err?.error?.error?.code === 'model_decommissioned' || err?.error?.code === 'model_decommissioned' || err?.message?.includes('decommissioned')) {
        console.warn(`Model ${modelName} retired or unavailable - trying fallback...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("All fallback models failed or are decommissioned.");
}

// @desc    Process AI Resume Edit Prompt
// @route   POST /api/ai/edit
// @access  Private
exports.editResumeWithAI = async (req, res) => {
  const { resumeState, prompt } = req.body;

  if (!groq) {
    return res.status(500).json({ message: 'Groq API key is missing or invalid' });
  }

  if (!resumeState || !prompt) {
    return res.status(400).json({ message: 'Missing resume state or prompt' });
  }

  try {
    const systemPrompt = `You are an absolute expert resume consultant and data parser.
    The user is going to provide you with their raw resume data and specific instructions on how to format or improve it.
    Your sole task is to take the user's instructions and map all of their new/updated information EXACTLY into the following strict JSON schema.

    REQUIRED JSON SCHEMA:
    {
      "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "website": "", "github": "", "linkedin": "" },
      "summary": "",
      "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "description": "" }],
      "education": [{ "institution": "", "location": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "", "current": false, "gpa": "", "description": "" }],
      "projects": [{ "title": "", "subtitle": "", "startDate": "", "endDate": "", "description": "" }],
      "skills": [""]
    }

    RULES:
    1. NEVER create new root-level keys (e.g., do not create "Header" or "Professional Summary"). You MUST put their name in personalInfo.fullName, their summary in summary, etc.
    2. Do NOT output Markdown backticks, explanations, or LaTeX.
    3. Output nothing but perfectly valid, parseable JSON matching this exact structure.`;

    const userPrompt = `ORIGINAL RESUME DATA:\n${JSON.stringify(resumeState.content)}\n\nUSER INSTRUCTIONS:\n${prompt}`;

    const response = await attemptGroqCall(systemPrompt, userPrompt, 0.1);

    let modifiedStateRaw = response.choices[0].message.content.trim();

    // Extract JSON between the first { and the last }
    const jsonStart = modifiedStateRaw.indexOf('{');
    const jsonEnd = modifiedStateRaw.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      modifiedStateRaw = modifiedStateRaw.substring(jsonStart, jsonEnd + 1);
    }

    const modifiedContent = JSON.parse(modifiedStateRaw);

    const modifiedState = {
      ...resumeState,
      content: modifiedContent,
      isLatexFormat: true // Enforce that this uses our LaTeX generator now
    };

    res.status(200).json(modifiedState);
  } catch (error) {
    console.error('AI Edit Error:', error);
    res.status(500).json({ message: 'AI failed to process request. Please try again or rephrase.' });
  }
};

// @desc    Optimize Resume (ATS / Suggestions)
// @route   POST /api/ai/optimize
// @access  Private
exports.optimizeResume = async (req, res) => {
  const { resumeState } = req.body;

  if (!groq) {
    return res.status(500).json({ message: 'Groq API key is missing or invalid' });
  }

  if (!resumeState) {
    return res.status(400).json({ message: 'Missing resume state' });
  }

  try {
    const systemPrompt = `You are an expert ATS optimization engine. 
    Analyze the provided resume JSON. Return a JSON response with the following strictly formatted structure (NO MARKDOWN BACKTICKS):
    {
      "atsScore": 85,
      "missingSkills": ["React Context", "Docker"],
      "suggestions": ["Improve the third bullet point in experience exactly as follows: ..."]
    }
    Make sure your response is only valid parsing JSON.`;
    const userPrompt = `Analyze this resume: ${JSON.stringify(resumeState)}`;

    const response = await attemptGroqCall(systemPrompt, userPrompt, 0.2);

    let optimizationRaw = response.choices[0].message.content.trim();
    if (optimizationRaw.startsWith('\`\`\`json')) {
      optimizationRaw = optimizationRaw.replace(/\`\`\`json/i, '').replace(/\`\`\`$/, '').trim();
    }

    const optimizationData = JSON.parse(optimizationRaw);
    res.status(200).json(optimizationData);
  } catch (error) {
    console.error('AI Optimize Error:', error);
    res.status(500).json({ message: 'Failed to generate optimization report.' });
  }
};

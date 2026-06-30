import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Webcam from 'react-webcam';
import {
  FileText, Upload, Briefcase, Play, Mic, MicOff, Video,
  Send, Loader2, CheckCircle2, ChevronRight, Activity, Sparkles
} from 'lucide-react';

const InterviewPreparation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Setup, 2: Interview, 3: Dashboard
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1 Data
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');

  // Step 2 Data
  const [questions, setQuestions] = useState([]);
  const [processedJdText, setProcessedJdText] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { question, typedText, transcribedText, audioBlob, score, feedback }

  // Interview Room State
  const [isRecording, setIsRecording] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const recognitionRef = useRef(null);
  const [liveTranscript, setLiveTranscript] = useState('');

  // ---- STEP 1: SETUP ----
  const handleGenerateQuestions = async () => {
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }
    if (!jdFile && !jdText.trim()) {
      setError("Please provide a Job Description (File or Text).");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      if (jdFile) formData.append('jd_file', jdFile);
      if (jdText) formData.append('job_description_text', jdText);

      const response = await api.post('/interview/generate-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setQuestions(response.data.questions);
      setProcessedJdText(response.data.jdText);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate questions. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---- STEP 2: INTERVIEW ROOM ----
  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStartCaptureClick = React.useCallback(() => {
    setRecordedChunks([]);
    setLiveTranscript('');
    const stream = webcamRef.current.stream;
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        setError("No audio tracks found. Please check your microphone permissions.");
        return;
      }
      const audioStream = new MediaStream(audioTracks);

      let options = { mimeType: 'audio/webm' };
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        options = {};
      }

      mediaRecorderRef.current = new MediaRecorder(audioStream, options);
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.start();
      setIsRecording(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setLiveTranscript(transcript);
        };
        recognitionRef.current.onerror = (e) => console.error("Speech recognition error:", e.error);
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Speech recognition start error:", e);
        }
      }
    } else {
      setError("Webcam stream not found. Please allow camera and microphone access.");
    }
  }, [webcamRef]);

  const handleStopCaptureClick = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Failed to stop recognition", e);
      }
    }
  }, []);

  const handleSubmitAnswer = async () => {
    setIsLoading(true);
    setError(null);

    let currentAnswerText = typedAnswer;

    try {
      // If we have recorded chunks, we prioritize audio submission
      if (recordedChunks.length > 0) {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          // Transcribe
          const transcribeRes = await api.post('/interview/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          currentAnswerText = transcribeRes.data.text || liveTranscript;
        } catch (transcribeError) {
          console.error("Backend transcription failed, falling back to live transcript", transcribeError);
          currentAnswerText = liveTranscript || typedAnswer;
        }
      } else if (!typedAnswer.trim() && !liveTranscript.trim()) {
        setError("Please record an audio answer or type your response.");
        setIsLoading(false);
        return;
      } else if (!typedAnswer.trim()) {
        currentAnswerText = liveTranscript;
      }

      // Chain to score
      const scoreRes = await api.post('/interview/score', {
        question: questions[currentQuestionIndex],
        jdText: processedJdText,
        answerText: currentAnswerText
      });

      // Save answer
      const updatedAnswers = [...answers, {
        question: questions[currentQuestionIndex],
        typedText: typedAnswer, // Just for record if they typed
        finalTextSubmitted: currentAnswerText,
        score: scoreRes.data.score,
        plagiarism_percentage: scoreRes.data.plagiarism_percentage || 0,
        is_plagiarized: scoreRes.data.is_plagiarized || false,
        feedback: scoreRes.data.feedback
      }];
      setAnswers(updatedAnswers);

      // Clean up for next question
      setTypedAnswer('');
      setRecordedChunks([]);

      // Move to next question or end
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStep(3); // Dashboard
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to process answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-app-bg p-6 lg:p-10 font-sans text-text-primary custom-scrollbar">
      <motion.div
        className="max-w-5xl mx-auto w-full space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <header className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-ai" /> AI Mock Interview
            </h1>
            <p className="text-gray-500 mt-1 font-medium">Calibrate your interview skills securely in real-time.</p>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={itemVariants}
              initial="hidden" animate="visible" exit="hidden"
              className="bg-surface-card rounded-[2rem] p-8 shadow-ai-panel border border-gray-100/50"
            >
              <h2 className="text-xl font-bold tracking-tight mb-6">Upload Context</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <FileText className="w-4 h-4 text-brand-primary" /> Resume (PDF/DOCX)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">{resumeFile ? resumeFile.name : 'Upload PDF/DOCX'}</p>
                    </div>
                    <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Briefcase className="w-4 h-4 text-brand-ai" /> Job Description (PDF/DOCX or Paste)
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-ai hover:bg-brand-ai/5 transition-all">
                      <div className="flex items-center justify-center">
                        <Upload className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">{jdFile ? jdFile.name : 'Upload file optionally'}</span>
                      </div>
                      <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => setJdFile(e.target.files[0])} />
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-3">OR PASTE</span>
                      </div>
                    </div>
                    <textarea
                      placeholder="Paste job description text here..."
                      className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:border-brand-ai focus:ring-1 focus:ring-brand-ai/30 outline-none text-sm transition-all"
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-ai text-white font-bold rounded-xl shadow-lg shadow-brand-ai/30 hover:bg-brand-ai/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  Generate Mock Questions
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INTERVIEW ROOM */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={itemVariants}
              initial="hidden" animate="visible" exit="hidden"
              className="space-y-6"
            >
              <div className="bg-surface-card rounded-[2rem] p-8 shadow-ai-panel border border-gray-100/50">
                <div className="flex justify-between items-center mb-6">
                  <div className="px-3 py-1 bg-brand-ai/10 text-brand-ai text-xs font-bold uppercase tracking-widest rounded-full">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-text-primary leading-tight">
                  {questions[currentQuestionIndex]}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Video/Audio Area */}
                <div className="bg-black rounded-[2rem] overflow-hidden relative shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                  <Webcam
                    audio={true}
                    ref={webcamRef}
                    className="w-full h-full object-cover opacity-90"
                    muted={true}
                  />
                  <div className="absolute bottom-6 flex justify-center w-full gap-4">
                    {isRecording ? (
                      <button
                        onClick={handleStopCaptureClick}
                        className="p-4 bg-red-500 rounded-full text-white shadow-lg shadow-red-500/50 hover:scale-105 transition-all animate-pulse"
                      >
                        <MicOff className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartCaptureClick}
                        className="p-4 bg-white rounded-full text-gray-900 shadow-lg hover:scale-105 transition-all"
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-500/80 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                      REC
                    </div>
                  )}
                  {recordedChunks.length > 0 && !isRecording && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/80 rounded-full text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                      Audio Recorded
                    </div>
                  )}
                  {liveTranscript && (
                    <div className="absolute bottom-24 left-4 right-4 bg-black/60 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl z-10 max-h-32 overflow-y-auto">
                      <p className="text-white text-sm font-medium leading-relaxed">
                        {liveTranscript}
                      </p>
                    </div>
                  )}
                </div>

                {/* Text Fallback & Submit */}
                <div className="bg-surface-card rounded-[2rem] p-6 shadow-ai-panel border border-gray-100/50 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Optional: Type response
                  </h3>
                  <textarea
                    placeholder="If you prefer not to use the camera, you can type your answer here..."
                    className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 outline-none text-sm transition-all resize-none"
                    value={typedAnswer || liveTranscript}
                    onChange={(e) => {
                      setLiveTranscript('');
                      setTypedAnswer(e.target.value);
                    }}
                    disabled={recordedChunks.length > 0 && !liveTranscript}
                  />

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={isLoading || isRecording}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-text-primary text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      Submit Answer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DASHBOARD */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={itemVariants}
              initial="hidden" animate="visible" exit="hidden"
              className="space-y-6"
            >
              <div className="bg-surface-card rounded-[2rem] p-8 shadow-ai-panel border border-gray-100/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-text-primary">Interview Completed</h2>
                <p className="text-gray-500 mt-2 max-w-lg">
                  Excellent work. The AI has evaluated your responses based on your resume and the specified job description constraints.
                </p>
                <div className="mt-6 flex gap-4">
                  <div className="text-center">
                    <span className="text-4xl font-black text-brand-ai">{(answers.reduce((acc, a) => acc + a.score, 0) / answers.length).toFixed(1)}</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg Score / 10</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                {answers.map((ans, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg max-w-3xl leading-tight">Q{idx + 1}: {ans.question}</h3>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`px-3 py-1 font-black rounded-lg text-lg ${ans.is_plagiarized ? 'bg-red-100 text-red-600' : 'bg-brand-primary/10 text-brand-primary'}`}>
                          {ans.score}/10
                        </div>
                        {ans.plagiarism_percentage > 0 && (
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${ans.is_plagiarized ? 'text-red-500' : 'text-orange-400'}`}>
                            {ans.plagiarism_percentage}% Plagiarism
                          </span>
                        )}
                      </div>
                    </div>




                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Response</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                          "{ans.finalTextSubmitted}"
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-ai uppercase tracking-widest mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> AI Feedback</p>
                        <p className="text-sm font-medium text-gray-800">
                          {ans.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-6">
                <button
                  onClick={() => {
                    setStep(1);
                    setAnswers([]);
                    setQuestions([]);
                    setResumeFile(null);
                    setJdFile(null);
                    setJdText('');
                  }}
                  className="px-6 py-3 border border-gray-200 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Start New Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default InterviewPreparation;

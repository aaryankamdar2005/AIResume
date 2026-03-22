import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, ArrowRight, Activity, MessageSquare, Edit3 } from 'lucide-react';
import api from '../services/api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please upload a resume footprint.');
      return;
    }
    if (!jdFile && !jdText.trim()) {
      setError('Please provide a job description (file or text).');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResults(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    if (jdFile) formData.append('jd_file', jdFile);
    if (jdText) formData.append('job_description_text', jdText);

    try {
      const response = await axios.post(`${API_URL}/analyze/match`, formData, {
        withCredentials: true
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreCircle = ({ score, label }) => {
    const strokeDasharray = 251.2;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;
    
    let color = 'text-red-500';
    if (score >= 80) color = 'text-green-500';
    else if (score >= 50) color = 'text-yellow-500';
    
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative w-24 h-24 flex items-center justify-center mb-3">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" className="stroke-current text-gray-100" strokeWidth="8" fill="transparent" />
            <circle 
              cx="48" cy="48" r="40" 
              className={`stroke-current ${color} transition-all duration-1000 ease-out`} 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute flex items-baseline gap-1 text-gray-800">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-sm font-medium">%</span>
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-600 text-center uppercase tracking-wider">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 flex items-center justify-center md:justify-start gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Resume Match Analyzer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0 text-lg">
            Compare your resume against a specific job description to discover exact gaps and optimize for Applicant Tracking Systems.
          </p>
        </header>

        {!results && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                1. Upload Resume
              </h2>
              <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-12 bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  accept=".pdf,.docx" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
                <p className="text-sm font-semibold text-gray-700 mb-1">{resumeFile ? resumeFile.name : 'Click to upload Resume (PDF/DOCX)'}</p>
                <p className="text-xs text-gray-500">Max size: 5MB</p>
              </div>
            </div>

            {/* JD Input */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                2. Target Job Description
              </h2>
              <div className="space-y-4 flex-1 flex flex-col">
                <textarea 
                  className="flex-1 w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Paste Job Description specifications here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs font-semibold uppercase">
                    <span className="px-3 bg-white text-gray-500">Or Upload File</span>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 relative cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center justify-center">
                   <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setJdFile(e.target.files[0])}
                  />
                  <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600">{jdFile ? jdFile.name : 'Select JD Context File'}</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 flex flex-col items-center mt-6">
              {error && <p className="text-red-500 font-medium text-sm mb-4 bg-red-50 p-3 rounded-md w-full max-w-md text-center border border-red-100">{error}</p>}
              <button 
                onClick={handleAnalyze}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 w-full md:w-auto justify-center text-lg"
              >
                Analyze Match <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="bg-white p-20 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Resume Match</h2>
            <p className="text-gray-500 max-w-md">Our AI is reading the job description and crossing referencing it with your experience...</p>
          </div>
        )}

        {results && (
          <div className="space-y-8 animate-fade-in">
            {/* Metrics Hero */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
                 <div>
                   <h2 className="text-xl font-bold text-gray-900 mb-1">Analysis Results</h2>
                   <p className="text-sm text-gray-500">Comprehensive compatibility report</p>
                 </div>
                 <button onClick={() => setResults(null)} className="mt-4 md:mt-0 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                   Compare New Job
                 </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <ScoreCircle score={results.overall_match_score || 0} label="Overall Match" />
                <ScoreCircle score={results.skills_match_score || 0} label="Skills" />
                <ScoreCircle score={results.experience_relevance_score || 0} label="Experience" />
                <ScoreCircle score={results.project_relevance_score || 0} label="Projects" />
                <ScoreCircle score={results.ats_keyword_score || 0} label="ATS Score" />
                <ScoreCircle score={results.technical_depth_score || 0} label="Tech Depth" />
                <ScoreCircle score={results.resume_quality_score || 0} label="Quality" />
              </div>
              
              <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
                <MessageSquare className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Executive Summary</h4>
                  <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                    {results.final_summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Matrix Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gap Analysis */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Gap Analysis
</h3>
                
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Matched Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.matched_skills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.missing_skills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>
                
                {results.ats_keywords_to_add?.length > 0 && (
                   <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" /> Priority Keywords to Add
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.ats_keywords_to_add.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Feedback */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Feedback
</h3>
                
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-2">Key Strengths</h4>
                  <ul className="space-y-2">
                    {results.strengths?.map((str, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-2">Weaknesses</h4>
                  <ul className="space-y-2">
                    {results.weaknesses?.map((wk, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-2">Suggestions</h4>
                  <ul className="space-y-2">
                    {results.improvement_suggestions?.map((sug, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bullet Rewrites */}
            {results.rewritten_resume_bullets?.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" /> 
                  Bullet Point Rewrites
</h3>
                <div className="space-y-6">
                  {results.rewritten_resume_bullets.map((bullet, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-5 border-b md:border-b-0 md:border-r border-gray-200">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Original</span>
                        <p className="text-sm text-gray-600 line-through decoration-red-300">{bullet.original}</p>
                      </div>
                      <div className="p-5 bg-blue-50/50">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Improved for ATS</span>
                        <p className="text-sm text-gray-900 font-medium">{bullet.improved}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { Save, Download, Send, MessageSquare, ArrowLeft, Edit3, User, Menu } from 'lucide-react';
import { getLatexPreview } from '../services/api';

const AiResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, updateResume, isLoading, editResumeViaAI } = useResumeStore();
  
  const [chatInput, setChatInput] = useState('');
  
  const [interviewStep, setInterviewStep] = useState('summary');
  const [collectedData, setCollectedData] = useState({
    summary: '', experience: '', education: '', projects: '', skills: ''
  });

  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi there! I am your AI Resume Editor. Let\'s build your resume step by step. To start, please provide your Professional Summary. Provide as much rough detail as you want, and I will refine it. (Or type "skip" to skip this section)' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    if (currentResume?.isLatexFormat && currentResume?.content) {
      let isMounted = true;
      setIsPdfLoading(true);
      getLatexPreview(currentResume.content)
        .then(blob => {
          if (isMounted) {
            const url = URL.createObjectURL(blob) + '#toolbar=0&navpanes=0&view=FitH';
            setPdfUrl(prevUrl => {
              if (prevUrl) URL.revokeObjectURL(prevUrl.split('#')[0]);
              return url;
            });
            setIsPdfLoading(false);
          }
        })
        .catch(err => {
          console.error("Failed to load schema preview", err);
          if (isMounted) setIsPdfLoading(false);
        });
      
      return () => isMounted = false;
    }
  }, [currentResume?.content, currentResume?.isLatexFormat]);

  useEffect(() => {
    fetchResumeById(id);
  }, [id, fetchResumeById]);

  const hasInitialized = React.useRef(false);
  useEffect(() => {
    if (currentResume && !hasInitialized.current) {
      hasInitialized.current = true;
      
      const hasContent = currentResume.content && (
        currentResume.content.summary || 
        (currentResume.content.experience && currentResume.content.experience.length > 0) ||
        (currentResume.content.education && currentResume.content.education.length > 0)
      );

      if (hasContent) {
        setInterviewStep('completed');
        setChatMessages([
          { role: 'ai', text: 'Welcome back! Your resume is loaded. What would you like to edit? Just tell me what to change and I will do it!' }
        ]);
      }
    }
  }, [currentResume]);

  if ((isLoading && !currentResume) || !currentResume) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 text-gray-600 gap-4 font-medium">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        Loading Editor...
      </div>
    );
  }

  const handleSave = async () => {
    await updateResume(id, currentResume);
  };

  const handleExportPDF = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.open(`${API_URL}/export/pdf/${id}`, '_blank');
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    if (interviewStep !== 'completed') {
      let nextStep = '';
      let nextMsg = '';
      const newCollectedData = { ...collectedData };
      let finalPromptTrigger = false;

      switch(interviewStep) {
        case 'summary':
          if (userText.toLowerCase() !== 'skip') newCollectedData.summary = userText;
          nextStep = 'experience';
          nextMsg = 'Great! Next, tell me about your Work Experience. Include companies, roles, and any metrics if you have them. (Or type "skip").';
          break;
        case 'experience':
          if (userText.toLowerCase() !== 'skip') newCollectedData.experience = userText;
          nextStep = 'education';
          nextMsg = 'Noted. Now, what is your Educational background? Degrees, schools, and graduation years. (Or type "skip").';
          break;
        case 'education':
          if (userText.toLowerCase() !== 'skip') newCollectedData.education = userText;
          nextStep = 'projects';
          nextMsg = 'Perfect. Do you have any Projects you want to highlight? (Or type "skip").';
          break;
        case 'projects':
          if (userText.toLowerCase() !== 'skip') newCollectedData.projects = userText;
          nextStep = 'skills';
          nextMsg = 'Lastly, list your Technical and Hard Skills. (Or type "skip").';
          break;
        case 'skills':
          if (userText.toLowerCase() !== 'skip') newCollectedData.skills = userText;
          nextStep = 'generating';
          nextMsg = 'Thank you! I have everything I need. I am generating a professionally formatted resume for you now. Please wait...';
          finalPromptTrigger = true;
          break;
        default:
          break;
      }

      setCollectedData(newCollectedData);
      setInterviewStep(nextStep);
      setChatMessages((prev) => [...prev, { role: 'ai', text: nextMsg }]);

      if (finalPromptTrigger) {
        setIsAiLoading(true);
        const prompt = `CRITICAL OBJECTIVE: You are an expert resume writer. I am providing you with rough, "naive", and basic details. You MUST heavily elaborate, refine, and professionalize all of this raw information.
        - Transform short or simple naive bullet points into impactful, action-driven, comprehensive professional descriptions.
        - Use strong action verbs and professional industry terminology.
        - Maintain the exact JSON structure and formatting required.
        
        NAIVE RAW DETAILS TO ELABORATE AND EXPAND UPON:
        Summary: ${newCollectedData.summary}
        Experience: ${newCollectedData.experience}
        Education: ${newCollectedData.education}
        Projects: ${newCollectedData.projects}
        Skills: ${newCollectedData.skills}`;

        const success = await editResumeViaAI(prompt);
        if (success) {
          setChatMessages((prev) => [...prev, { role: 'ai', text: 'Boom! Check out your new resume on the right. You can read over it, and if there is anything you want to change, just ask me here in the chat!' }]);
          setInterviewStep('completed');
          const latest = useResumeStore.getState().currentResume;
          if (latest) await updateResume(id, latest);
        } else {
          setChatMessages((prev) => [...prev, { role: 'ai', text: 'Oops, something went wrong generating the resume. Try typing anything to trigger it again.' }]);
          setInterviewStep('skills'); // Let them try the final trigger again
        }
        setIsAiLoading(false);
      }
      return;
    }

    // Default existing behavior if they are doing post-completion tweaks
    setIsAiLoading(true);
    const success = await editResumeViaAI(userText);
    if (success) {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'I have updated the resume based on your feedback. How does it look now?' }]);
      const latest = useResumeStore.getState().currentResume;
      if (latest) await updateResume(id, latest);
    } else {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I ran into an error trying to make that change. Could you try phrasing it differently?' }]);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-xl text-gray-900 flex items-center gap-2">
            AiResumeEditor
          </span>
        </div>
        
        <div className="flex items-center gap-4">

          <button onClick={handleSave} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 hover:bg-blue-50 rounded-md">
            <Save className="w-4 h-4 mr-2" /> Save
          </button>
          <button onClick={handleExportPDF} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Left Pane: AI Chatbot Blueprint */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 flex flex-col z-10 relative shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-gray-100 bg-white">
            <h2 className="text-sm font-bold flex items-center gap-2 text-gray-900">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              AI Resume Assistant
            </h2>
            <p className="text-xs text-gray-500 mt-1">Answer the questions below to automatically generate a tailored resume.</p>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto space-y-4 pb-24 scroll-smooth">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`w-full flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-4 text-sm max-w-[85%] leading-relaxed ${msg.role === 'ai' ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm' : 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="w-full flex justify-start">
                <div className="p-4 bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-10 w-16 justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleAiSubmit} className="flex relative items-end">
              <textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSubmit(e);
                  }
                }}
                disabled={isAiLoading}
                placeholder="Type your message here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 outline-none resize-none min-h-[50px] max-h-[120px]"
                spellCheck={true}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isAiLoading}
                className="absolute right-3 bottom-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Send className="w-4 h-4 ml-0.5" strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Pane: Live Editorial Preview */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4 sm:p-8 relative flex items-start justify-center">
          {currentResume?.isLatexFormat ? (
            <div className="w-full relative flex items-center justify-center bg-white shadow-xl min-w-[21cm] max-w-[21cm] min-h-[29.7cm] transition-all duration-300">
              {isPdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 transition-all duration-300">
                  <div className="text-sm text-gray-600 font-medium flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                    Generating PDF Preview...
                  </div>
                </div>
              )}
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-[100%] absolute inset-0 border-0" title="Resume Preview" style={{ minHeight: '29.7cm' }} />
              ) : (
                !isPdfLoading && <div className="text-gray-400 font-medium text-sm">Failed to load preview</div>
              )}
            </div>
          ) : (
            <div className="bg-white shadow-lg w-full max-w-[21cm] min-h-[29.7cm] p-12 relative text-gray-800">
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentResume?.content?.personalInfo?.fullName || 'Your Name'}</h1>
                <p className="text-gray-600 text-sm">
                   {currentResume?.content?.personalInfo?.email || 'email@example.com'} • {currentResume?.content?.personalInfo?.phone || '(123) 456-7890'}
                </p>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">Professional Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{currentResume?.content?.summary || 'Your summary will appear here.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiResumeEditor;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useResumeStore from '../store/useResumeStore';
import { Save, Download, Play, MessageSquare, Mic, ArrowLeft } from 'lucide-react';
import { getLatexPreview } from '../services/api';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResumeById, updateResume, isLoading, editResumeViaAI } = useResumeStore();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I can help you improve wording, add sections, or optimize for ATS. What would you like to do?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    if (currentResume?.isLatexFormat && currentResume?.latexContent) {
      let isMounted = true;
      setIsPdfLoading(true);
      getLatexPreview(currentResume.latexContent)
        .then(blob => {
          if (isMounted) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(prevUrl => {
              if (prevUrl) URL.revokeObjectURL(prevUrl);
              return url;
            });
            setIsPdfLoading(false);
          }
        })
        .catch(err => {
          console.error("Failed to load PDF preview", err);
          if (isMounted) setIsPdfLoading(false);
        });
      
      return () => {
        isMounted = false;
      };
    }
  }, [currentResume?.latexContent, currentResume?.isLatexFormat]);

  useEffect(() => {
    fetchResumeById(id);
  }, [id, fetchResumeById]);

  if (isLoading || !currentResume) {
    return <div className="flex h-screen items-center justify-center">Loading editor...</div>;
  }

  const handleSave = async () => {
    // Save logic
    await updateResume(id, currentResume);
  };

  const handleExportPDF = async () => {
    // Export logic pointing to backend API /export/pdf
    window.open(`http://localhost:5000/api/export/pdf/${id}`, '_blank');
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiLoading) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsAiLoading(true);

    const success = await editResumeViaAI(userText);
    
    if (success) {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'I have successfully updated your resume content based on your instructions.' }]);
    } else {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error communicating with the AI server. Please ensure your Groq API key is active in the backend.' }]);
    }
    
    setIsAiLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden h-[calc(100vh-4rem)]">
      {/* Editor Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={currentResume?.title || ''} 
            readOnly
            className="font-semibold text-lg bg-transparent border-none p-0 focus:ring-0 text-slate-800"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`inline-flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${isChatOpen ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            AI Assistant
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1"></div>
          <button 
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </button>
          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Pane: Form/LaTeX Editor */}
        <div className="w-1/2 flex flex-col bg-white border-r border-slate-200 overflow-y-auto">
          <div className="px-6 py-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
            <h2 className="text-lg font-semibold text-slate-800">Content Editor</h2>
            <p className="text-sm text-slate-500">Edit sections manually or use the AI to generate content.</p>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Minimal mock of editor form */}
            <section>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-4">Personal Info</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" 
                  value={currentResume?.content?.personalInfo?.fullName || ''}
                  readOnly
                />
                <input 
                  type="text" 
                  placeholder="Professional Title" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" 
                  value={currentResume?.content?.personalInfo?.title || ''}
                  readOnly
                />
              </div>
            </section>
            
            <section>
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider mb-4">Professional Summary</h3>
              <textarea 
                rows="4" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm resize-none"
                value={currentResume?.content?.summary || ''}
                readOnly
              ></textarea>
            </section>
          </div>
        </div>

        {/* Right Pane: Live Preview */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 relative">
          {currentResume?.isLatexFormat ? (
            <div className="w-full h-full relative flex items-center justify-center bg-white shadow-xl max-w-[21cm] mx-auto min-h-[29.7cm]">
              {isPdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full border-0 absolute inset-0" title="PDF Preview" />
              ) : (
                !isPdfLoading && <div className="text-slate-500">Failed to load preview</div>
              )}
            </div>
          ) : (
            <div className="bg-white mx-auto resume-shadow w-full max-w-[21cm] min-h-[29.7cm] p-12 transition-all duration-300 relative scale-100 origin-top">
              <h1 className="text-3xl font-serif text-slate-900 mb-2">{currentResume?.content?.personalInfo?.fullName || 'Untitled Name'}</h1>
              <p className="text-slate-600 border-b border-slate-300 pb-4 mb-4">
                 {currentResume?.content?.personalInfo?.email || 'email...'} • {currentResume?.content?.personalInfo?.phone || 'Phone'}
              </p>
              
              <h2 className="text-lg font-semibold text-slate-800 mb-2 uppercase tracking-wide">Summary</h2>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">{currentResume?.content?.summary || 'No summary...'}</p>
            </div>
          )}
        </div>

        {/* Floating AI Chatbot Panel */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-20 transform transition-transform duration-300 ease-in-out ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {isChatOpen && (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  AI Assistant
                </h3>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
              </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {/* Chat bubbles */}
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg text-sm shadow-sm border max-w-[90%] ${msg.role === 'ai' ? 'bg-white text-slate-700 rounded-tl-none border-slate-100' : 'bg-primary-600 text-white rounded-tr-none border-primary-700 ml-auto'}`}
                >
                  {msg.text}
                </div>
              ))}
              {isAiLoading && (
                <div className="bg-white p-3 rounded-lg rounded-tl-none text-sm text-slate-500 shadow-sm border border-slate-100 max-w-[90%] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleAiSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <button type="button" className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-full hover:bg-primary-50">
                <Mic className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isAiLoading}
                placeholder="Make my summary professional..."
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isAiLoading}
                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition disabled:opacity-50"
              >
                <Play className="w-4 h-4 translate-x-px" />
              </button>
            </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;

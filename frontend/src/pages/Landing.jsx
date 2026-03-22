import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col font-sans">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-3xl opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-indigo-50 blur-3xl opacity-70 pointer-events-none"></div>

      {/* Navbar overlay */}
      <header className="relative z-10 w-full px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">CareerBuilder AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full pt-12 pb-24">
        
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 shadow-sm">
          <Zap className="w-4 h-4 mr-2" />
          <span>The New Standard for Resumes</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-tight">
          Build a Winning Resume <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">in Minutes with AI</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          Upload your details, and our generative AI will instantly craft a beautifully structured, ATS-friendly resume that lands you more interviews.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/register" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
            Create Free Resume
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow">
            View Sample
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Smart Generation</h3>
            <p className="text-gray-600 text-sm">Our AI engine elaborates on your notes and crafts professional bullet points instantly.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">ATS Optimized</h3>
            <p className="text-gray-600 text-sm">Formatted perfectly to pass through Applicant Tracking Systems without breaking.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Job Description Matcher</h3>
            <p className="text-gray-600 text-sm">Compare your resume against any job description and let AI tailor the content to match perfectly.</p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Landing;

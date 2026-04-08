import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle, Sparkles } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-ai/5 rounded-full blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface-card rounded-[2.5rem] p-12 text-center shadow-ai-panel border border-gray-100/50 relative z-10"
      >
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/10">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-6xl font-black text-text-primary tracking-tighter mb-4">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-widest">Architectural Gap</h2>
        
        <p className="text-gray-500 font-medium leading-relaxed mb-10">
          The coordinate you're looking for does not exist in our career architecture. Let's redirect you to safety.
        </p>
        
        <Link to="/" className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl text-xs hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-[0.2em]">
          <Home className="w-4 h-4" />
          Back to Origin
        </Link>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-brand-ai" />
          <span>CareerBuilder Navigation Engine v1.0</span>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

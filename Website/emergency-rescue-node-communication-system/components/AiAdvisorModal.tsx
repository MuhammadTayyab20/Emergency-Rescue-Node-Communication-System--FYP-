import React, { useState, useEffect, useRef } from 'react';
import { getAIResponse } from '../services/geminiService';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.classList.add('animate-fade-in-scale');
    }
  }, [isOpen]);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResponse('');
    const aiResponse = await getAIResponse(query);
    setResponse(aiResponse);
    setIsLoading(false);
  };
  
  const handleClose = () => {
    setQuery('');
    setResponse('');
    setIsLoading(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in">
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-red-900/20 rounded-xl shadow-2xl ring-1 ring-red-500/50 flex flex-col max-h-[90vh] border border-red-500/30 transform transition-all duration-300 scale-95 opacity-0"
      >
        <div className="flex justify-between items-center p-4 border-b border-red-500/30">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">AI EMERGENCY ADVISOR</h2>
          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-white text-2xl transition-colors duration-300 hover:rotate-90"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center items-center h-full animate-fade-in">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
               <span className="ml-3 text-slate-300 animate-pulse">AI analyzing emergency...</span>
            </div>
          )}
          {response && (
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap animate-fade-in-up">
              {response}
            </div>
          )}
           {!response && !isLoading && (
            <div className="text-center text-slate-400 p-8 animate-fade-in">
              <div className="mx-auto bg-gradient-to-r from-red-600 to-amber-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-lg mb-2">How can I assist in this emergency?</p>
              <p className="text-xs mt-2">e.g., "What to do for a burn?" or "How to perform CPR?"</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-red-500/30 bg-black/30 rounded-b-xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="Describe your emergency situation..."
              className="flex-grow bg-black/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              disabled={isLoading}
            />
            <button
              onClick={handleQuery}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-md hover:from-red-700 hover:to-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
            >
              {isLoading ? 'Analyzing...' : 'Ask'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center animate-fade-in">
              Disclaimer: AI advice is for informational purposes only. Always prioritize contacting professional emergency services.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AiAdvisorModal;
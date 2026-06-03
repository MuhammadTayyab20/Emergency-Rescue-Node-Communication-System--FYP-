import React, { useState } from 'react';
import PhoneIcon from './icons/PhoneIcon';

interface HeaderProps {
  userName: string;
  onAiClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onAiClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 animate-fade-in-down">
      <div className="max-w-6xl mx-auto px-4 py-3 bg-black/40 backdrop-blur-2xl border border-red-500/30 shadow-2xl rounded-xl flex justify-between items-center transition-all duration-300 hover:bg-black/50 hover:shadow-red-500/20">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 p-2 rounded-lg">
            <PhoneIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 text-shadow-amber animate-pulse-slow">
            EMERGENCY RESCUE NODE COMMUNICATION SYSTEM
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-300 hidden md:block animate-fade-in">
            Welcome, <span className="font-semibold text-white">{userName}</span>
          </span>
          <button
            onClick={onAiClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-amber-600 rounded-full border border-red-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 ${
              isHovered ? 'animate-bounce-subtle' : ''
            }`}
          >
            AI Emergency Advisor
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
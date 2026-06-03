import React, { useState } from 'react';
import type { EmergencyService } from '../types';
import PhoneIcon from './icons/PhoneIcon';

interface HelplineCardProps {
  service: EmergencyService;
  isActive: boolean;
  onSelect: () => void;
}

const HelplineCard: React.FC<HelplineCardProps> = ({ service, isActive, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-4 rounded-lg shadow-md ring-1 transition-all duration-300 cursor-pointer transform ${
        isActive 
          ? 'ring-red-400 bg-gradient-to-r from-red-900/50 to-amber-900/50 scale-105 shadow-red-500/30' 
          : 'ring-white/10 bg-black/20 hover:ring-red-500/50 hover:shadow-red-500/20'
      } ${
        isHovered ? 'hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`flex-shrink-0 p-3 rounded-full transition-all duration-300 ${
          isActive ? 'bg-red-600' : 'bg-red-900/50'
        }`}>
          <PhoneIcon className={`h-6 w-6 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-red-300'
          }`} />
        </div>
        <div className="flex-grow">
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-slate-200'
          }`}>
            {service.name}
          </h3>
          <p className="text-sm text-slate-400">{service.address}</p>
          <a 
            href={`tel:${service.number}`} 
            onClick={(e) => e.stopPropagation()} 
            className={`text-lg font-bold transition-colors duration-300 inline-block ${
              isActive ? 'text-red-300 hover:text-white' : 'text-red-400 hover:text-red-300'
            }`}
          >
            {service.number}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelplineCard;
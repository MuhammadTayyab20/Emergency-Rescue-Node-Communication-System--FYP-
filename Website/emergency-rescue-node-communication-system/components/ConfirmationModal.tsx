import React, { Fragment, useEffect, useRef } from 'react';
import type { EmergencyService } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: EmergencyService;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, service }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.classList.add('animate-fade-in-scale');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-opacity animate-fade-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className="relative p-8 bg-gradient-to-br from-gray-900 to-red-900/30 rounded-lg shadow-xl max-w-sm w-full mx-4 ring-1 ring-red-500/50 border border-red-500/30 transform transition-all duration-300 scale-95 opacity-0"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 animate-bounce-subtle">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-5 text-lg font-medium leading-6 text-white animate-fade-in-up" id="modal-title">
            EMERGENCY DISPATCH SENT!
          </h3>
          <div className="mt-2 px-4 text-sm text-slate-300 animate-fade-in-up delay-100">
            <p>
              Your current location has been sent to <strong className="text-red-300">{service?.name || 'the emergency service'}</strong>. A team is on the way.
            </p>
          </div>
          
          {service?.distance && (
            <div className="mt-3 px-4 py-2 bg-red-900/30 rounded-md animate-fade-in-up delay-150">
              <p className="text-sm">
                Distance: <span className="font-semibold text-red-300">{service.distance.toFixed(2)} km</span> away
              </p>
            </div>
          )}
          
          <div className="mt-4 text-xs text-slate-400 italic">
            <p>Estimated response time: 5-10 minutes</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 animate-fade-in-up delay-200">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-red-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 sm:text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
            onClick={onClose}
          >
            Acknowledge
          </button>
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
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-150 {
          animation-delay: 150ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
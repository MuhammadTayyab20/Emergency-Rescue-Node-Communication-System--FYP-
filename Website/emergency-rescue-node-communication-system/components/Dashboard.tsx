import React, { useState } from 'react';
import Header from './Header';
import HelplineCard from './HelplineCard';
import MapView from './MapView';
import AiAdvisorModal from './AiAdvisorModal';
import ConfirmationModal from './ConfirmationModal';
import { EMERGENCY_SERVICES } from '../constants/emergencyServices';
import type { EmergencyService } from '../types';

interface DashboardProps {
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [dispatchedService, setDispatchedService] = useState<EmergencyService | null>(null);
  const [activeService, setActiveService] = useState<EmergencyService | null>(null);
  const [showNodesOverlay, setShowNodesOverlay] = useState(false);

  const handleDispatch = (service: EmergencyService) => {
    setDispatchedService(service);
    setIsConfirmationModalOpen(true);
  };
  
  const handleSelectService = (service: EmergencyService) => {
    if (activeService?.id === service.id) {
        setActiveService(null);
    } else {
        setActiveService(service);
        setShowNodesOverlay(false); 
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full flex flex-col transition-all duration-300">
        <Header userName={userName} onAiClick={() => setIsAiModalOpen(true)} />

        <main className="flex-grow container mx-auto px-4 py-8 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-fade-in-left">
              <div className="p-6 bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-red-500/20 h-full border border-red-500/30 transition-all duration-300 hover:shadow-red-500/20 hover:bg-black/40">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 text-shadow-amber border-b-2 border-red-500/30 pb-3 mb-4 animate-fade-in">
                  EMERGENCY SERVICES
                </h2>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-red-500/50 scrollbar-track-black/50 scrollbar-rounded">
                  {EMERGENCY_SERVICES.map((service, index) => (
                    <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <HelplineCard 
                        service={service} 
                        isActive={activeService?.id === service.id}
                        onSelect={() => handleSelectService(service)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 animate-fade-in-right">
               <div className="p-6 bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-red-500/20 transition-all duration-300 hover:shadow-red-500/20 hover:bg-black/40 border border-red-500/30">
                <div className="flex justify-between items-center pb-3 mb-4 border-b-2 border-red-500/30">
                   <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 text-shadow-amber animate-fade-in">
                      LOCATION & MAP
                   </h2>
                   <button 
                      onClick={() => setShowNodesOverlay(!showNodesOverlay)}
                      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 transform hover:scale-105 ${
                          showNodesOverlay 
                          ? 'bg-slate-700 text-white hover:bg-slate-600' 
                          : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:from-red-700 hover:to-amber-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50'
                      }`}
                  >
                      {showNodesOverlay ? 'Back to Map' : 'Contact Emergency Nodes'}
                   </button>
                </div>

                <MapView 
                  activeService={activeService}
                  services={EMERGENCY_SERVICES}
                  onNodeClick={handleDispatch}
                  showNodes={showNodesOverlay}
                />
              </div>
            </div>
          </div>
        </main>
        
        <div className="fixed bottom-4 right-4">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="p-4 bg-gradient-to-r from-red-600 to-amber-600 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 animate-pulse"
            aria-label="AI Emergency Advisor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        </div>
      </div>

      <AiAdvisorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        service={dispatchedService}
      />
    </>
  );
};

export default Dashboard;
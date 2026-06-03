import React, { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import type { EmergencyService } from '../types';
import LocationMarkerIcon from './icons/LocationMarkerIcon';

interface MapViewProps {
  activeService: EmergencyService | null;
  services: EmergencyService[];
  onNodeClick: (service: EmergencyService) => void;
  showNodes: boolean;
}

const MapView: React.FC<MapViewProps> = ({ activeService, services, onNodeClick, showNodes }) => {
  const { location, loading, error, getLocation } = useGeolocation();
  const [mapSrc, setMapSrc] = useState('');
  const [showUserMarker, setShowUserMarker] = useState(true);

  // Function to refresh location
  const handleRefreshLocation = useCallback(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    let src = '';
    const zoom = 15;
    
    if (activeService) {
      // When showing a specific service, center on that service
      src = `https://maps.google.com/maps?q=${activeService.coords.lat},${activeService.coords.lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
      setShowUserMarker(false);
    } 
    else if (location) {
      // When showing user location, center on user
      // Adding a timestamp to force iframe refresh
      const timestamp = new Date().getTime();
      src = `https://maps.google.com/maps?q=${location.lat},${location.lng}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed&_=${timestamp}`;
      setShowUserMarker(true);
    }
    
    setMapSrc(src);

  }, [location, activeService]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 animate-fade-in">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          <p className="ml-4 text-slate-300 animate-pulse">Locating your position...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/50 backdrop-blur-sm text-red-400 z-10 animate-shake">
          <p className="font-semibold">Location Error</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-slate-400">Please enable location services in your browser.</p>
        </div>
      );
    }
    
    return null;
  };

  // Create a custom marker for user location
  const renderUserLocationMarker = () => {
    // Only show user marker when we're showing the user's location (not a specific service)
    if (activeService || !location) return null;
    
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="relative">
          {/* Pulsing blue dot for user location */}
          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
          </div>
          {/* Outer pulse ring */}
          <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full border-2 border-blue-500/50 animate-ping opacity-30"></div>
        </div>
      </div>
    );
  };

  // Create a marker for active service
  const renderActiveServiceMarker = () => {
    if (!activeService) return null;
    
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="relative">
          <LocationMarkerIcon className="h-8 w-8 text-red-500 drop-shadow-lg" />
          <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-red-500/30 animate-ping opacity-50"></div>
        </div>
      </div>
    );
  };

  // Enhanced node click handler that calculates distance
  const handleEnhancedNodeClick = (service: EmergencyService) => {
    // Calculate distance if we have user location
    if (location) {
      const distance = calculateDistance(
        location.lat, 
        location.lng, 
        service.coords.lat, 
        service.coords.lng
      );
      
      // Add distance info to service object
      const serviceWithDistance = {
        ...service,
        distance: distance
      };
      
      onNodeClick(serviceWithDistance);
    } else {
      // If no location, just proceed normally
      onNodeClick(service);
    }
  };

  return (
    <div className="relative h-[calc(100vh-300px)] min-h-[400px] bg-black/30 rounded-lg shadow-lg ring-1 ring-red-500/20 overflow-hidden border border-red-500/30 transition-all duration-500 hover:shadow-red-500/20">
      {/* Location refresh button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleRefreshLocation}
          className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          My Location
        </button>
      </div>
      
      {mapSrc && (
         <iframe
            key={mapSrc}
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            className="grayscale-[30%] contrast-125 opacity-80 absolute inset-0 transition-all duration-700 hover:grayscale-[10%] hover:opacity-95"
          ></iframe>
      )}

      {renderUserLocationMarker()}
      {renderActiveServiceMarker()}
      {renderContent()}

      {showNodes && (
        <div className="absolute inset-0 z-5 p-4 bg-black/60 backdrop-blur-md flex flex-col animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-4 text-center animate-fade-in-down">SELECT EMERGENCY NODE</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-grow overflow-y-auto p-2">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => handleEnhancedNodeClick(service)}
                  className="group flex flex-col items-center justify-center p-3 bg-gradient-to-br from-red-900/60 to-amber-900/60 rounded-lg text-center cursor-pointer transition-all duration-300 hover:from-red-800/80 hover:to-amber-800/80 hover:shadow-2xl hover:shadow-red-500/40 ring-1 ring-red-500/30 hover:ring-red-400 transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <LocationMarkerIcon className="h-8 w-8 text-red-400 group-hover:text-white transition-colors duration-300 transform group-hover:scale-125"/>
                  <span className="text-xs font-semibold text-white mt-2 group-hover:text-yellow-200 transition-colors duration-300">{service.name}</span>
                </button>
              ))}
          </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s ease-out forwards;
            }
            @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.4s ease-out forwards;
            }
            @keyframes fade-in-down {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
              animation: fade-in-down 0.4s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default MapView;
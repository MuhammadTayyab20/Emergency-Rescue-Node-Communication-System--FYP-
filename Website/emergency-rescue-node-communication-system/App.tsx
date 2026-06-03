/*import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import { postAdminLogin, postUserEntry } from './services/backendService';
import type { AdminInfo } from './types/api';

const EmergencyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const emergencySymbolsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const emergencyCanvas = emergencySymbolsRef.current;
    if (!emergencyCanvas) return;
    const emergencyCtx = emergencyCanvas.getContext('2d');
    if (!emergencyCtx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let emergencySymbols: EmergencySymbol[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      emergencyCanvas.width = window.innerWidth;
      emergencyCanvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Emergency symbols (cross, triangle, etc.)
    class EmergencySymbol {
      x: number;
      y: number;
      size: number;
      speed: number;
      type: number; // 0 = cross, 1 = triangle, 2 = circle
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 0.2 + 0.05;
        this.type = Math.floor(Math.random() * 3);
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        // Slowly move upward to simulate rising emergency signals
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;
        
        // Reset if out of view
        if (this.y < -this.size) {
          this.y = canvas.height + this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        emergencyCtx!.save();
        emergencyCtx!.globalAlpha = this.opacity;
        emergencyCtx!.strokeStyle = this.type === 0 ? 'rgba(220, 38, 38, 0.7)' : 
                                  this.type === 1 ? 'rgba(245, 158, 11, 0.7)' : 
                                  'rgba(239, 68, 68, 0.7)';
        emergencyCtx!.lineWidth = 2;
        emergencyCtx!.translate(this.x, this.y);
        emergencyCtx!.rotate(this.rotation);
        
        switch(this.type) {
          case 0: // Cross
            emergencyCtx!.beginPath();
            emergencyCtx!.moveTo(0, -this.size/2);
            emergencyCtx!.lineTo(0, this.size/2);
            emergencyCtx!.moveTo(-this.size/2, 0);
            emergencyCtx!.lineTo(this.size/2, 0);
            emergencyCtx!.stroke();
            break;
          case 1: // Triangle
            emergencyCtx!.beginPath();
            emergencyCtx!.moveTo(0, -this.size/2);
            emergencyCtx!.lineTo(-this.size/2, this.size/2);
            emergencyCtx!.lineTo(this.size/2, this.size/2);
            emergencyCtx!.closePath();
            emergencyCtx!.stroke();
            break;
          case 2: // Circle
            emergencyCtx!.beginPath();
            emergencyCtx!.arc(0, 0, this.size/2, 0, Math.PI * 2);
            emergencyCtx!.stroke();
            break;
        }
        
        emergencyCtx!.restore();
      }
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      originalSize: number;
      angle: number;
      va: number;
      baseSize: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.speedY = (Math.random() * 0.5) - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(245, 158, 11, 0.3)';
        this.angle = 0;
        this.va = (Math.random() * 0.02) - 0.01;
        this.originalSize = this.size;
      }

      update() {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 80;
        
        if (distance < interactionRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (interactionRadius - distance) / interactionRadius;
            this.speedX -= forceDirectionX * force * 0.3;
            this.speedY -= forceDirectionY * force * 0.3;
            this.size = this.originalSize + (1 - distance/interactionRadius) * 1;
        } else {
            this.size = this.baseSize;
        }

        this.angle += this.va * 0.5;
        this.speedX += Math.sin(this.angle) * 0.01;
        this.speedY += Math.cos(this.angle) * 0.01;

        const speed = Math.sqrt(this.speedX**2 + this.speedY**2);
        const maxSpeed = 0.3;
        if (speed > maxSpeed) {
            this.speedX = (this.speedX / speed) * maxSpeed;
            this.speedY = (this.speedY / speed) * maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      emergencySymbols = [];
      
      const numberOfParticles = (canvas.width * canvas.height) / 15000;
      const numberOfSymbols = (canvas.width * canvas.height) / 8000;
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
      
      for (let i = 0; i < numberOfSymbols; i++) {
        emergencySymbols.push(new EmergencySymbol());
      }
    };
    
    resizeCanvas();

    const animate = () => {
      // Fade out effect for particles
      ctx!.fillStyle = 'rgba(15, 15, 15, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear emergency symbols canvas
      emergencyCtx!.clearRect(0, 0, emergencyCanvas.width, emergencyCanvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      for (const symbol of emergencySymbols) {
        symbol.update();
        symbol.draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-stone-950 via-red-950/20 to-amber-950/20"
      />
      <canvas 
        ref={emergencySymbolsRef} 
        className="fixed top-0 left-0 w-full h-full -z-5"
      />
    </>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'user-login' | 'user-dashboard' | 'admin-login' | 'admin-dashboard'>('user-login');
  const [userName, setUserName] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  const handleUserLogin = async (name: string, emergencyNumber: string) => {
    const response = await postUserEntry({
      name,
      emergency_number: emergencyNumber || null,
    });

    setUserName(response.user.name);
    setView('user-dashboard');
  };

  const handleAdminLogin = async (email: string, password: string) => {
    const response = await postAdminLogin({ email, password });
    setAdminToken(response.access_token);
    setAdminInfo(response.admin);
    setView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminInfo(null);
    setView('admin-login');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <EmergencyBackground />
      <div className="relative z-10">
        {view === 'user-dashboard' && userName ? (
          <div className="animate-fade-in">
            <Dashboard userName={userName} />
          </div>
        ) : null}

        {view === 'user-login' ? (
          <div className="animate-fade-in">
            <LoginPage
              onLogin={handleUserLogin}
              onAdminAccess={() => setView('admin-login')}
            />
          </div>
        ) : null}

        {view === 'admin-login' ? (
          <div className="animate-fade-in">
            <AdminLoginPage
              onLogin={handleAdminLogin}
              onBackToUser={() => setView('user-login')}
            />
          </div>
        ) : null}

        {view === 'admin-dashboard' && adminToken && adminInfo ? (
          <div className="animate-fade-in">
            <AdminDashboard token={adminToken} adminEmail={adminInfo.email} onLogout={handleAdminLogout} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;*/

import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import { postAdminLogin, postUserEntry } from './services/backendService';
import type { AdminInfo } from './types/api';

const EmergencyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const emergencySymbolsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const emergencyCanvas = emergencySymbolsRef.current;
    if (!emergencyCanvas) return;
    const emergencyCtx = emergencyCanvas.getContext('2d');
    if (!emergencyCtx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let emergencySymbols: EmergencySymbol[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      emergencyCanvas.width = window.innerWidth;
      emergencyCanvas.height = window.innerHeight;
      init();
    };
    
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Emergency symbols (cross, triangle, etc.)
    class EmergencySymbol {
      x: number;
      y: number;
      size: number;
      speed: number;
      type: number; // 0 = cross, 1 = triangle, 2 = circle
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 0.2 + 0.05;
        this.type = Math.floor(Math.random() * 3);
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.y < -this.size) {
          this.y = canvas.height + this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        emergencyCtx!.save();
        emergencyCtx!.globalAlpha = this.opacity;
        emergencyCtx!.strokeStyle = this.type === 0 ? 'rgba(220, 38, 38, 0.7)' : 
                                  this.type === 1 ? 'rgba(245, 158, 11, 0.7)' : 
                                  'rgba(239, 68, 68, 0.7)';
        emergencyCtx!.lineWidth = 2;
        emergencyCtx!.translate(this.x, this.y);
        emergencyCtx!.rotate(this.rotation);
        
        switch(this.type) {
          case 0:
            emergencyCtx!.beginPath();
            emergencyCtx!.moveTo(0, -this.size/2);
            emergencyCtx!.lineTo(0, this.size/2);
            emergencyCtx!.moveTo(-this.size/2, 0);
            emergencyCtx!.lineTo(this.size/2, 0);
            emergencyCtx!.stroke();
            break;
          case 1:
            emergencyCtx!.beginPath();
            emergencyCtx!.moveTo(0, -this.size/2);
            emergencyCtx!.lineTo(-this.size/2, this.size/2);
            emergencyCtx!.lineTo(this.size/2, this.size/2);
            emergencyCtx!.closePath();
            emergencyCtx!.stroke();
            break;
          case 2:
            emergencyCtx!.beginPath();
            emergencyCtx!.arc(0, 0, this.size/2, 0, Math.PI * 2);
            emergencyCtx!.stroke();
            break;
        }
        
        emergencyCtx!.restore();
      }
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      originalSize: number;
      angle: number;
      va: number;
      baseSize: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.speedX = (Math.random() * 0.5) - 0.25;
        this.speedY = (Math.random() * 0.5) - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(245, 158, 11, 0.3)';
        this.angle = 0;
        this.va = (Math.random() * 0.02) - 0.01;
        this.originalSize = this.size;
      }

      update() {
        const dx = mouse.current.x - this.x;
        const dy = mouse.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 80;
        
        if (distance < interactionRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (interactionRadius - distance) / interactionRadius;
            this.speedX -= forceDirectionX * force * 0.3;
            this.speedY -= forceDirectionY * force * 0.3;
            this.size = this.originalSize + (1 - distance/interactionRadius) * 1;
        } else {
            this.size = this.baseSize;
        }

        this.angle += this.va * 0.5;
        this.speedX += Math.sin(this.angle) * 0.01;
        this.speedY += Math.cos(this.angle) * 0.01;

        const speed = Math.sqrt(this.speedX**2 + this.speedY**2);
        const maxSpeed = 0.3;
        if (speed > maxSpeed) {
            this.speedX = (this.speedX / speed) * maxSpeed;
            this.speedY = (this.speedY / speed) * maxSpeed;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      emergencySymbols = [];
      
      const numberOfParticles = (canvas.width * canvas.height) / 15000;
      const numberOfSymbols = (canvas.width * canvas.height) / 8000;
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
      
      for (let i = 0; i < numberOfSymbols; i++) {
        emergencySymbols.push(new EmergencySymbol());
      }
    };
    
    resizeCanvas();

    const animate = () => {
      ctx!.fillStyle = 'rgba(15, 15, 15, 0.05)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      emergencyCtx!.clearRect(0, 0, emergencyCanvas.width, emergencyCanvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      for (const symbol of emergencySymbols) {
        symbol.update();
        symbol.draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-stone-950 via-red-950/20 to-amber-950/20"
      />
      <canvas 
        ref={emergencySymbolsRef} 
        className="fixed top-0 left-0 w-full h-full -z-5"
      />
    </>
  );
};

// Helper to get user's GPS location
function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null), // If user denies, just send null — no crash
      { timeout: 5000 }
    );
  });
}

const App: React.FC = () => {
  const [view, setView] = useState<'user-login' | 'user-dashboard' | 'admin-login' | 'admin-dashboard'>('user-login');
  const [userName, setUserName] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  const handleUserLogin = async (name: string, emergencyNumber: string) => {
    // Silently try to get location — if denied, continues without it
    const location = await getUserLocation();

    const response = await postUserEntry({
      name,
      emergency_number: emergencyNumber || null,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
    });

    setUserName(response.user.name);
    setView('user-dashboard');
  };

  const handleAdminLogin = async (email: string, password: string) => {
    const response = await postAdminLogin({ email, password });
    setAdminToken(response.access_token);
    setAdminInfo(response.admin);
    setView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminInfo(null);
    setView('admin-login');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <EmergencyBackground />
      <div className="relative z-10">
        {view === 'user-dashboard' && userName ? (
          <div className="animate-fade-in">
            <Dashboard userName={userName} />
          </div>
        ) : null}

        {view === 'user-login' ? (
          <div className="animate-fade-in">
            <LoginPage
              onLogin={handleUserLogin}
              onAdminAccess={() => setView('admin-login')}
            />
          </div>
        ) : null}

        {view === 'admin-login' ? (
          <div className="animate-fade-in">
            <AdminLoginPage
              onLogin={handleAdminLogin}
              onBackToUser={() => setView('user-login')}
            />
          </div>
        ) : null}

        {view === 'admin-dashboard' && adminToken && adminInfo ? (
          <div className="animate-fade-in">
            <AdminDashboard token={adminToken} adminEmail={adminInfo.email} onLogout={handleAdminLogout} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
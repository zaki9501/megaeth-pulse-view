
import { useEffect, useState } from "react";

export const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.id * 0.2}s`,
            animationDuration: `${2 + particle.speed}s`,
          }}
        />
      ))}
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/20" />
    </div>
  );
};

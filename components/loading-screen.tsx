'use client';

import { useEffect, useState } from 'react';
import { Brain, Zap, Target, Trophy } from 'lucide-react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Focus sessions boost your productivity by 40%",
    "Small daily tasks lead to big achievements",
    "Tracking your mood helps improve mental health",
    "Consistency beats perfection every time"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="floating-brain">
            <Brain className="h-16 w-16 text-cyan-500 mx-auto animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 bouncing-zap">
            <Zap className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 rotating-target">
            <Target className="h-6 w-6 text-teal-500" />
          </div>
          <div className="absolute -top-2 -left-2 floating-trophy">
            <Trophy className="h-6 w-6 text-amber-500" />
          </div>
        </div>

        {/* App Name with Gradient */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
          ADaptly
        </h1>

        {/* Loading Bar */}
        <div className="space-y-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-300 ease-out loading-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress}% loaded
          </p>
        </div>

        {/* Rotating Tips */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-sm text-gray-700 dark:text-gray-300 animate-fade-in-out">
            💡 {tips[currentTip]}
          </p>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60 floating-particle-${i + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .floating-brain {
          animation: float 3s ease-in-out infinite;
        }

        .bouncing-zap {
          animation: bounce 2s infinite;
        }

        .rotating-target {
          animation: rotate 4s linear infinite;
        }

        .floating-trophy {
          animation: float 2.5s ease-in-out infinite reverse;
        }

        .loading-bar {
          animation: shimmer 2s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-fade-in-out {
          animation: fadeInOut 2s ease-in-out infinite;
        }

        .floating-particle-1 { animation: floatParticle1 8s infinite; }
        .floating-particle-2 { animation: floatParticle2 10s infinite; }
        .floating-particle-3 { animation: floatParticle3 12s infinite; }
        .floating-particle-4 { animation: floatParticle4 9s infinite; }
        .floating-particle-5 { animation: floatParticle5 11s infinite; }
        .floating-particle-6 { animation: floatParticle6 7s infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-15px); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes floatParticle1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, -40px) rotate(180deg); }
        }

        @keyframes floatParticle3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -40px) rotate(90deg); }
          75% { transform: translate(-30px, 30px) rotate(270deg); }
        }

        @keyframes floatParticle4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-25px, -25px) rotate(120deg); }
          66% { transform: translate(35px, 15px) rotate(240deg); }
        }

        @keyframes floatParticle5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(25px, -35px) rotate(180deg); }
        }

        @keyframes floatParticle6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-35px, -20px) rotate(90deg); }
          75% { transform: translate(20px, 25px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}
'use client';

import { Achievement } from '@/lib/types';
import { Trophy, Medal, Star, Crown, Award } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  onClick?: () => void;
}

export function AchievementBadge({ achievement, isUnlocked, onClick }: AchievementBadgeProps) {
  const getAnimalType = (id: string) => {
    if (id.includes('knight') || id.includes('warrior') || id.includes('master')) return 'bear';
    return 'penguin';
  };

  const getRewardIcon = (id: string) => {
    switch (id) {
      case 'novice_knight':
        return <Medal className="h-6 w-6 text-bronze" />;
      case 'focus_master':
        return <Trophy className="h-6 w-6 text-silver" />;
      case 'legendary_warrior':
        return <Crown className="h-6 w-6 text-gold" />;
      case 'clairvoyant':
        return <Star className="h-6 w-6 text-purple-500" />;
      case 'grand_master':
        return <Award className="h-6 w-6 text-rainbow" />;
      default:
        return <Trophy className="h-6 w-6 text-gold" />;
    }
  };

  const animalType = getAnimalType(achievement.id);
  const rewardIcon = getRewardIcon(achievement.id);

  return (
    <div 
      className={`relative cursor-pointer group transition-all duration-300 ${
        isUnlocked ? 'hover:scale-110' : 'grayscale opacity-60'
      }`}
      onClick={onClick}
    >
      <div className="achievement-card">
        {/* Background Circle */}
        <div className={`achievement-bg ${isUnlocked ? 'unlocked' : 'locked'}`}>
          
          {/* Animal Character */}
          {animalType === 'penguin' ? (
            <div className="penguin">
              {/* Penguin Body */}
              <div className="penguin-body">
                <div className="penguin-belly"></div>
              </div>
              
              {/* Penguin Head */}
              <div className="penguin-head">
                <div className="penguin-beak"></div>
                <div className="penguin-eye left"></div>
                <div className="penguin-eye right"></div>
              </div>
              
              {/* Penguin Wings */}
              <div className="penguin-wing left"></div>
              <div className="penguin-wing right"></div>
              
              {/* Penguin Feet */}
              <div className="penguin-foot left"></div>
              <div className="penguin-foot right"></div>
            </div>
          ) : (
            <div className="bear">
              {/* Bear Body */}
              <div className="bear-body"></div>
              
              {/* Bear Head */}
              <div className="bear-head">
                <div className="bear-snout"></div>
                <div className="bear-nose"></div>
                <div className="bear-eye left"></div>
                <div className="bear-eye right"></div>
              </div>
              
              {/* Bear Ears */}
              <div className="bear-ear left"></div>
              <div className="bear-ear right"></div>
              
              {/* Bear Arms */}
              <div className="bear-arm left"></div>
              <div className="bear-arm right"></div>
              
              {/* Bear Legs */}
              <div className="bear-leg left"></div>
              <div className="bear-leg right"></div>
            </div>
          )}
          
          {/* Reward Icon */}
          <div className={`reward-icon ${isUnlocked ? 'animate-bounce' : ''}`}>
            {rewardIcon}
          </div>
          
          {/* Sparkles for unlocked achievements */}
          {isUnlocked && (
            <>
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">⭐</div>
              <div className="sparkle sparkle-3">💫</div>
              <div className="sparkle sparkle-4">✨</div>
            </>
          )}
        </div>
        
        {/* Achievement Title */}
        <div className="achievement-title">
          <h4 className="text-sm font-medium text-center mt-2">
            {achievement.title}
          </h4>
        </div>
      </div>

      <style jsx>{`
        .achievement-card {
          width: 120px;
          height: 140px;
          position: relative;
        }

        .achievement-bg {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          position: relative;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .achievement-bg.unlocked {
          background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
          animation: glow 2s ease-in-out infinite alternate;
        }

        .achievement-bg.locked {
          background: linear-gradient(135deg, #6b7280, #4b5563, #374151);
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
        }

        /* Penguin Styles */
        .penguin {
          position: relative;
          width: 60px;
          height: 70px;
        }

        .penguin-body {
          width: 40px;
          height: 50px;
          background: #1f2937;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .penguin-belly {
          width: 25px;
          height: 35px;
          background: #f9fafb;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .penguin-head {
          width: 35px;
          height: 35px;
          background: #1f2937;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .penguin-beak {
          width: 8px;
          height: 6px;
          background: #f59e0b;
          border-radius: 0 0 50% 50%;
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
        }

        .penguin-eye {
          width: 6px;
          height: 6px;
          background: #f9fafb;
          border-radius: 50%;
          position: absolute;
          top: 10px;
        }

        .penguin-eye.left { left: 8px; }
        .penguin-eye.right { right: 8px; }

        .penguin-eye::after {
          content: '';
          width: 3px;
          height: 3px;
          background: #1f2937;
          border-radius: 50%;
          position: absolute;
          top: 1px;
          left: 1px;
        }

        .penguin-wing {
          width: 15px;
          height: 25px;
          background: #1f2937;
          border-radius: 50% 0 50% 50%;
          position: absolute;
          top: 25px;
        }

        .penguin-wing.left {
          left: -5px;
          transform: rotate(-20deg);
        }

        .penguin-wing.right {
          right: -5px;
          transform: rotate(20deg) scaleX(-1);
        }

        .penguin-foot {
          width: 12px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50% 50% 0 0;
          position: absolute;
          bottom: -3px;
        }

        .penguin-foot.left { left: 8px; }
        .penguin-foot.right { right: 8px; }

        /* Bear Styles */
        .bear {
          position: relative;
          width: 60px;
          height: 70px;
        }

        .bear-body {
          width: 45px;
          height: 50px;
          background: #92400e;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .bear-head {
          width: 40px;
          height: 40px;
          background: #92400e;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .bear-snout {
          width: 20px;
          height: 15px;
          background: #d97706;
          border-radius: 50%;
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .bear-nose {
          width: 4px;
          height: 3px;
          background: #1f2937;
          border-radius: 50%;
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
        }

        .bear-eye {
          width: 5px;
          height: 5px;
          background: #1f2937;
          border-radius: 50%;
          position: absolute;
          top: 12px;
        }

        .bear-eye.left { left: 10px; }
        .bear-eye.right { right: 10px; }

        .bear-ear {
          width: 15px;
          height: 15px;
          background: #92400e;
          border-radius: 50%;
          position: absolute;
          top: -5px;
        }

        .bear-ear.left { left: 5px; }
        .bear-ear.right { right: 5px; }

        .bear-ear::after {
          content: '';
          width: 8px;
          height: 8px;
          background: #d97706;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
        }

        .bear-arm {
          width: 12px;
          height: 20px;
          background: #92400e;
          border-radius: 50%;
          position: absolute;
          top: 30px;
        }

        .bear-arm.left {
          left: -3px;
          transform: rotate(-15deg);
        }

        .bear-arm.right {
          right: -3px;
          transform: rotate(15deg);
        }

        .bear-leg {
          width: 15px;
          height: 15px;
          background: #92400e;
          border-radius: 50%;
          position: absolute;
          bottom: -5px;
        }

        .bear-leg.left { left: 8px; }
        .bear-leg.right { right: 8px; }

        /* Reward Icon */
        .reward-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          padding: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        /* Sparkles */
        .sparkle {
          position: absolute;
          font-size: 12px;
          animation: sparkle 2s ease-in-out infinite;
          pointer-events: none;
        }

        .sparkle-1 {
          top: -5px;
          left: -5px;
          animation-delay: 0s;
        }

        .sparkle-2 {
          top: -5px;
          right: -5px;
          animation-delay: 0.5s;
        }

        .sparkle-3 {
          bottom: -5px;
          left: -5px;
          animation-delay: 1s;
        }

        .sparkle-4 {
          bottom: -5px;
          right: -5px;
          animation-delay: 1.5s;
        }

        /* Custom Colors */
        .text-bronze { color: #cd7f32; }
        .text-silver { color: #c0c0c0; }
        .text-gold { color: #ffd700; }
        .text-rainbow {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Animations */
        @keyframes glow {
          from {
            box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
          }
          to {
            box-shadow: 0 8px 35px rgba(251, 191, 36, 0.6);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        /* Hover Effects */
        .achievement-card:hover .penguin {
          animation: wiggle 0.5s ease-in-out;
        }

        .achievement-card:hover .bear {
          animation: bounce 0.5s ease-in-out;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
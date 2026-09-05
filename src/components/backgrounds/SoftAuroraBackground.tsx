import React from 'react';

export const SoftAuroraBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070A0F]">
      {/* Soft Emerald Gentle Glow */}
      <div 
        className="absolute -top-[10%] left-[10%] w-[320px] h-[320px] rounded-full opacity-15 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)',
          animation: 'auroraFloat 16s ease-in-out infinite alternate',
        }}
      />

      {/* Cyan Light Drift */}
      <div 
        className="absolute top-[35%] right-[5%] w-[300px] h-[300px] rounded-full opacity-15 blur-[85px]"
        style={{
          background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          animation: 'auroraFloat 18s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Deep Indigo Soft Cushion */}
      <div 
        className="absolute -bottom-[10%] left-[25%] w-[350px] h-[350px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
        }}
      />

      <style>{`
        @keyframes auroraFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 30px) scale(1.08); }
          100% { transform: translate(-15px, -20px) scale(0.95); }
        }
      `}</style>
    </div>
  );
};

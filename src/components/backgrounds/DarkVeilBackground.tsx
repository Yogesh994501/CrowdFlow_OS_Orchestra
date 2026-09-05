import React from 'react';

export const DarkVeilBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070A0F]">
      {/* Subtle Indigo Ambient Glow */}
      <div 
        className="absolute -top-[25%] left-[15%] w-[650px] h-[650px] rounded-full opacity-20 blur-[130px] animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)',
          animationDuration: '8s'
        }}
      />

      {/* Subtle Cyan Light Diffusion */}
      <div 
        className="absolute top-[40%] right-[10%] w-[550px] h-[550px] rounded-full opacity-15 blur-[120px] animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          animationDuration: '10s'
        }}
      />

      {/* Deep Navy Ground Shade */}
      <div 
        className="absolute -bottom-[20%] left-[30%] w-[700px] h-[500px] rounded-full opacity-25 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #0F172A 0%, transparent 75%)',
        }}
      />

      {/* Ultra-faint noise / vignette overlay */}
      <div className="absolute inset-0 bg-[#070A0F]/60" />
    </div>
  );
};

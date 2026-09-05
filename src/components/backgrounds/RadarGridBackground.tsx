import React from 'react';

export const RadarGridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070A0F]">
      {/* Precision Micro Grid (Section 4) */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #22D3EE 1px, transparent 1px),
            linear-gradient(to bottom, #22D3EE 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Slow Radar Scanner Beam */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(34, 211, 238, 0.15) 50%, transparent 100%)',
          height: '240px',
          animation: 'radarScan 12s linear infinite',
        }}
      />

      {/* Center Radar Concentric Range Rings */}
      <div className="absolute right-[20%] top-[30%] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full rounded-full border border-cyan-400"></div>
        <div className="absolute inset-[15%] rounded-full border border-cyan-400"></div>
        <div className="absolute inset-[30%] rounded-full border border-cyan-400"></div>
        <div className="absolute inset-[45%] rounded-full border border-cyan-400"></div>
      </div>

      {/* Keyframe animation inline style */}
      <style>{`
        @keyframes radarScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

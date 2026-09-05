import React, { useEffect, useRef } from 'react';
import type { DemoScenario } from '../../types';

interface HyperspeedProps {
  isAccelerating?: boolean;
  isSubtle?: boolean;
  scenario?: DemoScenario;
  className?: string;
}

export const HyperspeedBackground: React.FC<HyperspeedProps> = ({
  isAccelerating = false,
  isSubtle = false,
  scenario = 'normal',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let isPaused = false;
    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Scenario-reactive visual theming (Option 2)
    const getScenarioTheme = () => {
      switch (scenario) {
        case 'heavy_rain':
          return {
            colorDefs: [
              { stroke: 'rgba(56, 189, 248, ', glow: '#38BDF8' },    // Sky rain cyan
              { stroke: 'rgba(14, 165, 233, ', glow: '#0EA5E9' },    // Storm ocean blue
              { stroke: 'rgba(125, 211, 252, ', glow: '#7DD3FC' },   // Light water mist
              { stroke: 'rgba(255, 255, 255, ', glow: '#FFFFFF' },   // Lightning flash
            ],
            beaconColor: 'rgba(56, 189, 248, ',
            gridColor: 'rgba(14, 165, 233, 0.07)',
            speedMultiplierBase: 1.25,
            isRainEffect: true
          };
        case 'hotel_saturation':
          return {
            colorDefs: [
              { stroke: 'rgba(245, 158, 11, ', glow: '#F59E0B' },    // Warning amber
              { stroke: 'rgba(251, 191, 36, ', glow: '#FBBF24' },    // Golden surge
              { stroke: 'rgba(251, 113, 133, ', glow: '#FB7185' },   // Coral saturation
              { stroke: 'rgba(249, 115, 22, ', glow: '#F97316' },    // Operational alert
            ],
            beaconColor: 'rgba(245, 158, 11, ',
            gridColor: 'rgba(245, 158, 11, 0.06)',
            speedMultiplierBase: 0.95,
            isRainEffect: false
          };
        case 'metro_disruption':
          return {
            colorDefs: [
              { stroke: 'rgba(168, 85, 247, ', glow: '#A855F7' },    // Neon Purple
              { stroke: 'rgba(139, 92, 246, ', glow: '#8B5CF6' },    // Violet transit
              { stroke: 'rgba(56, 189, 248, ', glow: '#38BDF8' },    // Bypass Cyan
              { stroke: 'rgba(217, 70, 239, ', glow: '#D946EF' },    // Rail Alert
            ],
            beaconColor: 'rgba(168, 85, 247, ',
            gridColor: 'rgba(168, 85, 247, 0.07)',
            speedMultiplierBase: 1.3,
            isRainEffect: false
          };
        case 'gate_closure':
          return {
            colorDefs: [
              { stroke: 'rgba(239, 68, 68, ', glow: '#EF4444' },     // Crimson Alert
              { stroke: 'rgba(244, 63, 94, ', glow: '#F43F5E' },     // Rose Perimeter
              { stroke: 'rgba(251, 146, 60, ', glow: '#FB923C' },    // Hold Warning
              { stroke: 'rgba(255, 255, 255, ', glow: '#FFFFFF' },   // Strobe Beacon
            ],
            beaconColor: 'rgba(239, 68, 68, ',
            gridColor: 'rgba(239, 68, 68, 0.07)',
            speedMultiplierBase: 0.85,
            isRainEffect: false
          };
        case 'demand_surge':
          return {
            colorDefs: [
              { stroke: 'rgba(16, 185, 129, ', glow: '#10B981' },    // Influx Emerald
              { stroke: 'rgba(0, 240, 255, ', glow: '#00F0FF' },     // Electric Rush
              { stroke: 'rgba(52, 211, 153, ', glow: '#34D399' },    // Fast Mint
              { stroke: 'rgba(255, 255, 255, ', glow: '#FFFFFF' },   // Velocity White
            ],
            beaconColor: 'rgba(16, 185, 129, ',
            gridColor: 'rgba(16, 185, 129, 0.07)',
            speedMultiplierBase: 1.5,
            isRainEffect: false
          };
        case 'normal':
        default:
          return {
            colorDefs: [
              { stroke: 'rgba(0, 240, 255, ', glow: '#00F0FF' },     // Electric Cyan
              { stroke: 'rgba(99, 102, 241, ', glow: '#6366F1' },    // Hyper Indigo
              { stroke: 'rgba(56, 189, 248, ', glow: '#38BDF8' },    // Bright Sky Blue
              { stroke: 'rgba(168, 85, 247, ', glow: '#A855F7' },    // Soft Purple
            ],
            beaconColor: 'rgba(0, 240, 255, ',
            gridColor: 'rgba(34, 211, 238, 0.05)',
            speedMultiplierBase: 1.0,
            isRainEffect: false
          };
      }
    };

    const theme = getScenarioTheme();

    // Trails perspective setup: balanced for rich glassmorphic diffusion
    const numTrails = isSubtle ? 90 : 180;
    const numNodes = isSubtle ? 45 : 80;

    interface Trail {
      x: number;
      y: number;
      z: number;
      speed: number;
      length: number;
      color: string;
      glowColor: string;
      thickness: number;
    }

    interface NodePoint {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      pulse: number;
    }

    const trails: Trail[] = [];
    for (let i = 0; i < numTrails; i++) {
      const def = theme.colorDefs[Math.floor(Math.random() * theme.colorDefs.length)];
      trails.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * width,
        speed: (isSubtle ? (2.0 + Math.random() * 3.5) : (4.5 + Math.random() * 8)) * theme.speedMultiplierBase,
        length: isSubtle ? (20 + Math.random() * 35) : (30 + Math.random() * 55),
        color: def.stroke,
        glowColor: def.glow,
        thickness: isSubtle ? (0.8 + Math.random() * 1.5) : (1.2 + Math.random() * 2.2),
      });
    }

    // Distant drifting telemetry nodes (city beacons)
    const nodes: NodePoint[] = [];
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        size: 1 + Math.random() * 2.2,
        color: theme.beaconColor,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let speedMultiplier = 1;
    let gridOffset = 0;

    const render = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(render);
        return;
      }

      const targetMultiplier = isAccelerating ? 5.5 : 1.0;
      speedMultiplier += (targetMultiplier - speedMultiplier) * 0.08;
      gridOffset = (gridOffset + 1.2 * speedMultiplier) % 40;

      // Clear completely so HTML ambient gradient & navy backdrop shine through
      ctx.clearRect(0, 0, width, height);

      const fov = 340;
      const centerX = width / 2;
      const centerY = height / 2 + (isSubtle ? 15 : 30);

      // 1. Digital City Perspective Grid (Subtle horizon floor evoking Mumbai digital twin)
      const horizonY = height * 0.68;
      ctx.save();
      ctx.beginPath();
      // Longitudinal perspective grid lines
      for (let x = -width * 0.6; x <= width * 1.6; x += 110) {
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(x, height);
      }
      // Horizontal moving depth lines
      for (let d = 20; d < 320; d += 28) {
        const lineY = horizonY + (height - horizonY) * Math.pow((d + gridOffset) / 360, 2.2);
        if (lineY <= height) {
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
        }
      }
      ctx.strokeStyle = theme.gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 2. Draw distant drifting beacon nodes (city telemetry nodes)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.z -= 0.6 * speedMultiplier;
        n.pulse += 0.03;
        if (n.z <= 0) {
          n.z = width;
          n.x = (Math.random() - 0.5) * width * 2;
          n.y = (Math.random() - 0.5) * height * 2;
        }
        const k = fov / n.z;
        const px = n.x * k + centerX;
        const py = n.y * k + centerY;

        if (px < 0 || px > width || py < 0 || py > height) continue;

        const alpha = Math.min(0.75, Math.max(0.12, (1 - n.z / width) * 0.9)) * (0.6 + 0.4 * Math.sin(n.pulse));
        ctx.beginPath();
        ctx.arc(px, py, n.size * k * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = theme.colorDefs[0].glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw hyperspeed city data trails with luminous heads & vibrant blur
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        t.z -= t.speed * speedMultiplier;

        if (t.z <= 0) {
          t.z = width;
          t.x = (Math.random() - 0.5) * width * 2.2;
          t.y = (Math.random() - 0.5) * height * 2.2;
        }

        const k = fov / t.z;
        const px = t.x * k + centerX;
        const py = t.y * k + centerY;

        const prevK = fov / (t.z + t.length * speedMultiplier);
        const prevPx = t.x * prevK + centerX;
        const prevPy = t.y * prevK + centerY;

        if (px < 0 || px > width || py < 0 || py > height) continue;

        const baseAlpha = Math.min(1, Math.max(0.15, (1 - t.z / width) * 1.35));
        const alpha = isSubtle ? baseAlpha * 0.72 : baseAlpha;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = `${t.color}${alpha})`;
        ctx.lineWidth = t.thickness * (k * (isSubtle ? 1.35 : 1.7));
        ctx.lineCap = 'round';
        if (alpha > 0.3) {
          ctx.shadowBlur = isSubtle ? 8 : 12;
          ctx.shadowColor = t.glowColor;
        }
        ctx.stroke();

        // Glowing particle head
        ctx.beginPath();
        ctx.arc(px, py, t.thickness * k * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `${t.color}${Math.min(1, alpha * 1.25)})`;
        ctx.fill();

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationId);
    };
  }, [isAccelerating, isSubtle, scenario]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

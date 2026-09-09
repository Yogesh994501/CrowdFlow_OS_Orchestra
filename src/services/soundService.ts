/**
 * Mission-Control Audio & Haptic Alerts Service
 * Uses native Web Audio API oscillators for situational awareness sound cues.
 * Zero external audio files required. Safe against browser autoplay policy.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  constructor() {
    // Check localStorage preference; default to muted
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crowdflow_audio_muted');
      this.isMuted = saved !== null ? saved === 'true' : true;
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('crowdflow_audio_muted', muted ? 'true' : 'false');
    }
    if (!muted) {
      this.initContext();
      this.playTickClick();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Subtle tactile click (50ms) for UI interactions and timeline ticks.
   */
  public playTickClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Gracefully silence
    }
  }

  /**
   * Pleasant ascending tri-tone chord when an intervention is authorized.
   */
  public playSuccessChime(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.4);
      });
    } catch {
      // Graceful degradation
    }
  }

  /**
   * Dual-tone frequency warning chime (880Hz -> 1175Hz).
   */
  public playWarningBeep(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Graceful degradation
    }
  }

  /**
   * Pulsed mission-critical radar alert ping when entering a critical surge window.
   */
  public playCriticalAlarm(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      for (let pulse = 0; pulse < 2; pulse++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(740, ctx.currentTime + pulse * 0.18);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + pulse * 0.18 + 0.12);

        gain.gain.setValueAtTime(0.07, ctx.currentTime + pulse * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + pulse * 0.18 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + pulse * 0.18);
        osc.stop(ctx.currentTime + pulse * 0.18 + 0.16);
      }
    } catch {
      // Graceful degradation
    }
  }
}

export const soundService = new SoundService();

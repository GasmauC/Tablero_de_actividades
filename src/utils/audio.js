/**
 * Audio Engine - Generación de sonidos sintéticos para micro-recompensas.
 * Estilo: Moderno / Minimalista.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
  }

  init() {
    if (this.unlocked) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.unlocked = true;
    } catch (e) {
      console.warn('AudioEngine: No se pudo inicializar AudioContext', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.playTone(600, 0.05, 'sine', 0.1);
  }

  playSuccess() {
    this.playTone(400, 0.1, 'sine', 0.2, 0);
    this.playTone(800, 0.2, 'sine', 0.2, 0.1);
  }

  playFanfare() {
    const tones = [440, 554.37, 659.25, 880];
    tones.forEach((freq, i) => {
      this.playTone(freq, 0.3, 'sine', 0.15, i * 0.1);
    });
  }

  playBuzzWithFallback() {
    if (!this.unlocked) this.init();
    
    // Intentar reproducir archivo real
    const audioFile = new Audio('/zumbido.mp3');
    audioFile.volume = 0.6;
    
    audioFile.play().catch(() => {
      console.warn('AudioEngine: /zumbido.mp3 no encontrado o bloqueado. Usando fallback sintético.');
      // FALLBACK: Beep de alerta intenso (combinación de ondas)
      this.playTone(150, 0.1, 'square', 0.2, 0);
      this.playTone(100, 0.2, 'square', 0.2, 0.1);
    });
  }

  playHover() {
    this.playTone(1000, 0.02, 'sine', 0.05);
  }

  playTone(freq, duration, type = 'sine', volume = 0.1, delay = 0) {
    if (!this.unlocked) this.init();
    if (!this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }
}

export const audio = new AudioEngine();

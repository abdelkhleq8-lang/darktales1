// Ambient Audio & Horror Sound Effects Synthesizer using Web Audio API
// Generates realistic procedural dark horror soundscapes and tactile feedback with URL playback & procedural synthesis fallback
import { horrorSoundOptions } from '../data/sounds';

export type AmbientSoundType =
  | 'wind'
  | 'whispers'
  | 'footsteps'
  | 'screams'
  | 'wind_whisper'
  | 'heartbeat_drops'
  | 'train_fog'
  | 'drone_spectral'
  | 'basement_creaks'
  | 'whisper'
  | 'heartbeat'
  | 'creak'
  | 'jumpscare';

export type HorrorSFXType =
  | 'whisper'
  | 'jumpscare'
  | 'creak'
  | 'heartbeat'
  | 'click'
  | 'whoosh'
  | 'footsteps'
  | 'screams';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.85; // Default volume (0.0 to 1.0)
  private nodes: (AudioNode | number)[] = [];
  private audioElement: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  // Set Master Volume (0.0 to 1.0)
  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Interactive Tactical Horror SFX
  public playSFX(type: HorrorSFXType) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      if (type === 'jumpscare') {
        // Terrifying sudden stinger: dissonant cluster + sub drop + noise burst
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const stingerGain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.exponentialRampToValueAtTime(110, now + 0.8);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(466.16, now); // Minor second dissonance
        osc2.frequency.exponentialRampToValueAtTime(116, now + 0.8);

        oscSub.type = 'triangle';
        oscSub.frequency.setValueAtTime(80, now);
        oscSub.frequency.exponentialRampToValueAtTime(30, now + 1.1);

        stingerGain.gain.setValueAtTime(0.9 * this.volume, now);
        stingerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.connect(stingerGain);
        osc2.connect(stingerGain);
        oscSub.connect(stingerGain);
        stingerGain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        oscSub.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
        oscSub.stop(now + 1.2);

      } else if (type === 'heartbeat') {
        // Deep double thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.15);

        gain.gain.setValueAtTime(0.85 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.3);

      } else if (type === 'whisper') {
        // Ghostly airy whisper whoosh
        const bufferSize = this.ctx.sampleRate * 1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.9);
        filter.Q.setValueAtTime(5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.6 * this.volume, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + 0.95);

      } else if (type === 'creak') {
        // Wood creak chirp
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.15);
        osc.frequency.linearRampToValueAtTime(140, now + 0.35);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, now);
        filter.Q.setValueAtTime(6.0, now);

        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.45);

      } else if (type === 'footsteps') {
        // Hollow heavy footstep on wood floor
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);

        gain.gain.setValueAtTime(0.7 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.25);

      } else if (type === 'screams') {
        // Distant ghostly echo scream
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.8);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(3.5, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.55 * this.volume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.15);

      } else if (type === 'whoosh') {
        // Deep dark whoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);

      } else {
        // Subtle bone-click feedback
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {
      // Ignore autoplay browser constraints
    }
  }

  // Play Continuous Ambient Soundscapes (with optional custom URL or automatic synthesis fallback)
  public play(type: AmbientSoundType | string = 'wind', customUrl?: string) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.stop();
      this.currentType = type;
      this.isPlaying = true;

      // Ensure master gain is restored to current volume
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.volume, now);

      // Check if there is an audio URL to attempt playback
      const matchedOption = horrorSoundOptions.find((o) => o.id === type);
      const targetUrl = customUrl || matchedOption?.url;

      if (targetUrl && !targetUrl.includes('example.com')) {
        try {
          const audio = new Audio(targetUrl);
          audio.volume = this.volume;
          audio.loop = true;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                this.audioElement = audio;
              })
              .catch(() => {
                // If external audio fails, start procedural synthesis seamlessly
                this.startProceduralSynthesis(type);
              });
            return;
          }
        } catch {
          // Fall through to procedural synthesis
        }
      }

      // Procedural audio generation using Web Audio API
      this.startProceduralSynthesis(type);
    } catch {
      // Browser autoplay policy guard
    }
  }

  private startProceduralSynthesis(type: string) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.exponentialRampToValueAtTime(0.85, now + 0.6);
    subGain.connect(this.masterGain);
    this.nodes.push(subGain);

    // ==========================================
    // CATEGORY 1: غابات مظلمة ورياح وعواصف
    // ==========================================
    if (
      type === 'forest_night_wind' ||
      type === 'wind' ||
      type === 'wind_whisper' ||
      type === 'wind_creak'
    ) {
      // 1. عواء رياح الغابة المظلمة (Mid-Air & Whistling Wind with Gust Sweeps)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(320, now);
      windFilter.Q.setValueAtTime(3.5, now);

      const windLfo = this.ctx.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.18, now);

      const windLfoGain = this.ctx.createGain();
      windLfoGain.gain.setValueAtTime(260, now);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);

      const whistle = this.ctx.createOscillator();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(420, now);
      const whistleGain = this.ctx.createGain();
      whistleGain.gain.setValueAtTime(0.08, now);

      const subDrone = this.ctx.createOscillator();
      subDrone.type = 'sine';
      subDrone.frequency.setValueAtTime(50, now);
      const subDroneGain = this.ctx.createGain();
      subDroneGain.gain.setValueAtTime(0.2, now);

      noise.connect(windFilter);
      windFilter.connect(subGain);
      whistle.connect(whistleGain);
      whistleGain.connect(subGain);
      subDrone.connect(subDroneGain);
      subDroneGain.connect(subGain);

      noise.start(now);
      windLfo.start(now);
      whistle.start(now);
      subDrone.start(now);
      this.nodes.push(noise, windFilter, windLfo, windLfoGain, whistle, whistleGain, subDrone, subDroneGain);

    } else if (type === 'rain_thunder_storm' || type === 'rain_thunder') {
      // 2. عاصفة رعدية ورعود منخفضة (Heavy Rain Pink Noise + Sub-Bass Thunderclaps)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const rainNoise = this.ctx.createBufferSource();
      rainNoise.buffer = buffer;
      rainNoise.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(950, now);

      const rainGain = this.ctx.createGain();
      rainGain.gain.setValueAtTime(0.45, now);

      rainNoise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(subGain);
      rainNoise.start(now);
      this.nodes.push(rainNoise, rainFilter, rainGain);

      // Deep Sub-bass Thunderclap every 5.5 seconds
      const thunderInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(85, t);
        osc.frequency.exponentialRampToValueAtTime(26, t + 1.2);

        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.85, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 3.4);

        osc.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 3.5);
      }, 5500);
      this.nodes.push(thunderInterval);

    } else if (type === 'crow_swarms') {
      // 3. نعيق أسراب الغربان وبوم الليل (High Shrill Cawing Bursts)
      const crowInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;

        // Double sharp screech caw
        [0, 0.28].forEach((offset) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const g = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1850, t + offset);
          osc.frequency.exponentialRampToValueAtTime(820, t + offset + 0.22);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, t + offset);
          filter.Q.setValueAtTime(5.0, t + offset);

          g.gain.setValueAtTime(0.01, t + offset);
          g.gain.linearRampToValueAtTime(0.4, t + offset + 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.24);

          osc.connect(filter);
          filter.connect(g);
          g.connect(subGain);
          osc.start(t + offset);
          osc.stop(t + offset + 0.25);
        });
      }, 3400);
      this.nodes.push(crowInterval);

    } else if (type === 'creepy_swamp' || type === 'crypt_drops') {
      // 4. مستنقع الأرواح وفقاعات غازية (Low Mud Plops & Slime Bubble Bursts)
      const drone = this.ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(58, now);
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.18, now);
      drone.connect(droneGain);
      droneGain.connect(subGain);
      drone.start(now);
      this.nodes.push(drone, droneGain);

      const bubbleInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 340 + Math.random() * 80;
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.5, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 0.15);
      }, 1100);
      this.nodes.push(bubbleInterval);

    // ==========================================
    // CATEGORY 2: صرير أبواب وأرضيات خشبية قديمة
    // ==========================================
    } else if (type === 'creaking_doors' || type === 'creak') {
      // 5. صرير باب مسكون ومفصلات صدئة (Slow Rusty Iron Hinge Squeal)
      const doorInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.linearRampToValueAtTime(580, t + 0.6);
        osc.frequency.linearRampToValueAtTime(290, t + 1.2);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(640, t);
        filter.Q.setValueAtTime(7.5, t);

        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.55, t + 0.2);
        g.gain.linearRampToValueAtTime(0.4, t + 0.8);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

        osc.connect(filter);
        filter.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 1.35);
      }, 2900);
      this.nodes.push(doorInterval);

    } else if (
      type === 'footsteps_creaking_wood' ||
      type === 'slow_footsteps' ||
      type === 'footsteps'
    ) {
      // 6. خطوات ثقيلة فوق ألواح خشب تئن (Hollow Wood Thud + Splinter Crack)
      const footInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;

        // 1. Thud
        const thudOsc = this.ctx.createOscillator();
        const thudGain = this.ctx.createGain();
        thudOsc.type = 'triangle';
        thudOsc.frequency.setValueAtTime(85, t);
        thudOsc.frequency.exponentialRampToValueAtTime(38, t + 0.16);

        thudGain.gain.setValueAtTime(0.65, t);
        thudGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        thudOsc.connect(thudGain);
        thudGain.connect(subGain);
        thudOsc.start(t);
        thudOsc.stop(t + 0.22);

        // 2. Creaking Wood Flex
        setTimeout(() => {
          if (!this.ctx || !this.isPlaying) return;
          const ct = this.ctx.currentTime;
          const creakOsc = this.ctx.createOscillator();
          const creakGain = this.ctx.createGain();
          creakOsc.type = 'sawtooth';
          creakOsc.frequency.setValueAtTime(220, ct);
          creakOsc.frequency.linearRampToValueAtTime(310, ct + 0.15);
          creakGain.gain.setValueAtTime(0.3, ct);
          creakGain.gain.exponentialRampToValueAtTime(0.001, ct + 0.2);
          creakOsc.connect(creakGain);
          creakGain.connect(subGain);
          creakOsc.start(ct);
          creakOsc.stop(ct + 0.22);
        }, 120);
      }, 1650);
      this.nodes.push(footInterval);

    } else if (type === 'scratching_wooden_walls' || type === 'scratching_walls') {
      // 7. خربشة أظافر ومخالب خلف الجدران (Rapid High-Frequency Wood Gouging)
      const scratchInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(2400, t);

        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(3200, t);
        bp.Q.setValueAtTime(8.0, t);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.55, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

        noise.connect(hp);
        hp.connect(bp);
        bp.connect(g);
        g.connect(subGain);
        noise.start(t);
        noise.stop(t + 0.4);
      }, 1800);
      this.nodes.push(scratchInterval);

    } else if (type === 'basement_hatch' || type === 'basement_creaks') {
      // 8. سحب مصراع قبو واهتزاز أرضي (Heavy Sub-Bass Impact + Metallic Cavern Drag)
      const hatchInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;

        // Sub tremor
        const subOsc = this.ctx.createOscillator();
        const subG = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(38, t);
        subG.gain.setValueAtTime(0.7, t);
        subG.gain.exponentialRampToValueAtTime(0.01, t + 1.8);
        subOsc.connect(subG);
        subG.connect(subGain);
        subOsc.start(t);
        subOsc.stop(t + 1.9);

        // Metal drag
        const metalOsc = this.ctx.createOscillator();
        const metalG = this.ctx.createGain();
        metalOsc.type = 'sawtooth';
        metalOsc.frequency.setValueAtTime(140, t);
        metalOsc.frequency.linearRampToValueAtTime(95, t + 0.9);
        metalG.gain.setValueAtTime(0.35, t);
        metalG.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        metalOsc.connect(metalG);
        metalG.connect(subGain);
        metalOsc.start(t);
        metalOsc.stop(t + 1.25);
      }, 4200);
      this.nodes.push(hatchInterval);

    // ==========================================
    // CATEGORY 3: أصوات وهمسات بشرية مرعبة
    // ==========================================
    } else if (type === 'creepy_whispers' || type === 'whispers' || type === 'whisper') {
      // 9. همسات وتمتمات شيطانية متعددة (3-Voice Formant Whispers with Pan)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const formant1 = this.ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(720, now);
      formant1.Q.setValueAtTime(6.0, now);

      const formant2 = this.ctx.createBiquadFilter();
      formant2.type = 'bandpass';
      formant2.frequency.setValueAtTime(1350, now);
      formant2.Q.setValueAtTime(6.0, now);

      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.32, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(320, now);
      lfo.connect(lfoGain);
      lfoGain.connect(formant1.frequency);

      const whisperGain = this.ctx.createGain();
      whisperGain.gain.setValueAtTime(0.42, now);

      noise.connect(formant1);
      noise.connect(formant2);
      formant1.connect(whisperGain);
      formant2.connect(whisperGain);
      whisperGain.connect(subGain);

      noise.start(now);
      lfo.start(now);
      this.nodes.push(noise, formant1, formant2, lfo, lfoGain, whisperGain);

    } else if (type === 'ghostly_screams' || type === 'screams') {
      // 10. صرخات استغاثة وعويل شبحي بعيد (Gliding Shrill Scream with Echo Decay)
      const screamInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const g = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1750, t);
        osc.frequency.exponentialRampToValueAtTime(580, t + 1.2);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, t);
        filter.Q.setValueAtTime(4.0, t);

        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.65, t + 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

        osc.connect(filter);
        filter.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 1.45);
      }, 4400);
      this.nodes.push(screamInterval);

    } else if (type === 'witch_laughter') {
      // 11. قهقهات هستيرية مرعبة ومتقطعة (Rapid Staccato Cackles)
      const cackleInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        [0, 0.12, 0.24, 0.36, 0.48, 0.62].forEach((offset, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          const freq = 980 - idx * 45;
          osc.frequency.setValueAtTime(freq, t + offset);
          osc.frequency.linearRampToValueAtTime(freq - 90, t + offset + 0.08);

          g.gain.setValueAtTime(0.4, t + offset);
          g.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.09);

          osc.connect(g);
          g.connect(subGain);
          osc.start(t + offset);
          osc.stop(t + offset + 0.1);
        });
      }, 3800);
      this.nodes.push(cackleInterval);

    } else if (type === 'heavy_breathing') {
      // 12. أنفاس لاهثة وحارة خلف العنق (Inhale & Exhale Cycle right in the ear)
      const breathInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, t);
        filter.frequency.linearRampToValueAtTime(680, t + 1.6); // Inhale
        filter.frequency.linearRampToValueAtTime(240, t + 3.6); // Exhale
        filter.Q.setValueAtTime(4.0, t);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.05, t);
        g.gain.linearRampToValueAtTime(0.5, t + 1.4);
        g.gain.linearRampToValueAtTime(0.1, t + 1.8);
        g.gain.linearRampToValueAtTime(0.45, t + 2.5);
        g.gain.exponentialRampToValueAtTime(0.001, t + 3.8);

        noise.connect(filter);
        filter.connect(g);
        g.connect(subGain);
        noise.start(t);
        noise.stop(t + 3.9);
      }, 4200);
      this.nodes.push(breathInterval);

    // ==========================================
    // CATEGORY 4: نبضات قلب مخيفة ورعب نفسي
    // ==========================================
    } else if (
      type === 'heartbeat_panic' ||
      type === 'heartbeat_chase' ||
      type === 'heartbeat_drops' ||
      type === 'heartbeat'
    ) {
      // 13. دقات قلب مرعوبة ورجفة صدرية (Fast Heavy Sub-Bass Panic Pulse: 115 BPM)
      const pulseOsc = this.ctx.createOscillator();
      const pulseGain = this.ctx.createGain();
      pulseOsc.type = 'sine';
      pulseOsc.frequency.setValueAtTime(54, now);
      pulseGain.gain.setValueAtTime(0, now);

      pulseOsc.connect(pulseGain);
      pulseGain.connect(subGain);
      pulseOsc.start(now);

      const subThump = this.ctx.createOscillator();
      subThump.type = 'triangle';
      subThump.frequency.setValueAtTime(36, now);
      const subThumpGain = this.ctx.createGain();
      subThumpGain.gain.setValueAtTime(0.2, now);
      subThump.connect(subThumpGain);
      subThumpGain.connect(subGain);
      subThump.start(now);

      const beatInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        // 1st Thump (LUB)
        pulseGain.gain.cancelScheduledValues(t);
        pulseGain.gain.setValueAtTime(0.01, t);
        pulseGain.gain.linearRampToValueAtTime(0.9, t + 0.04);
        pulseGain.gain.exponentialRampToValueAtTime(0.02, t + 0.16);
        // 2nd Thump (DUB)
        pulseGain.gain.setValueAtTime(0.02, t + 0.22);
        pulseGain.gain.linearRampToValueAtTime(0.7, t + 0.26);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      }, 540);

      this.nodes.push(pulseOsc, pulseGain, subThump, subThumpGain, beatInterval);

    } else if (type === 'cursed_musicbox') {
      // 14. صندوق موسيقى ملعون بنغمات نشاز (Dissonant Music Box with Wandering Pitch)
      const notes = [659.25, 698.46, 880.0, 932.33, 587.33, 523.25];
      let noteIdx = 0;
      const mbInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        const freq = notes[noteIdx % notes.length] + Math.sin(noteIdx * 0.8) * 7;
        noteIdx++;

        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

        osc.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 1.15);
      }, 1050);
      this.nodes.push(mbInterval);

    } else if (type === 'clock_doom') {
      // 15. تكتكة ساعة موت ميكانيكية عتيقة (Crisp Mechanical Tick-Tock Escapement)
      let isTick = true;
      const tickInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isTick ? 1300 : 920, t);
        osc.frequency.exponentialRampToValueAtTime(250, t + 0.035);

        g.gain.setValueAtTime(0.65, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 0.05);

        // Hollow body resonance
        const woodOsc = this.ctx.createOscillator();
        const woodG = this.ctx.createGain();
        woodOsc.type = 'sine';
        woodOsc.frequency.setValueAtTime(72, t);
        woodG.gain.setValueAtTime(0.25, t);
        woodG.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        woodOsc.connect(woodG);
        woodG.connect(subGain);
        woodOsc.start(t);
        woodOsc.stop(t + 0.13);

        isTick = !isTick;
      }, 1000);
      this.nodes.push(tickInterval);

    } else if (type === 'tinnitus_drone') {
      // 16. طنين أذن حاد يتبعه فراغ نفسي (Piercing High Tone 3500Hz + Deep 44Hz Void)
      const highTone = this.ctx.createOscillator();
      highTone.type = 'sine';
      highTone.frequency.setValueAtTime(3500, now);
      const highGain = this.ctx.createGain();
      highGain.gain.setValueAtTime(0.12, now);

      const lowDrone = this.ctx.createOscillator();
      lowDrone.type = 'sine';
      lowDrone.frequency.setValueAtTime(44, now);
      const lowGain = this.ctx.createGain();
      lowGain.gain.setValueAtTime(0.35, now);

      highTone.connect(highGain);
      highGain.connect(subGain);
      lowDrone.connect(lowGain);
      lowGain.connect(subGain);

      highTone.start(now);
      lowDrone.start(now);
      this.nodes.push(highTone, highGain, lowDrone, lowGain);

    // ==========================================
    // CATEGORY 5: قطارات وعناصر معدنية صناعية
    // ==========================================
    } else if (type === 'chains_graveyard') {
      // 17. صليل سلاسل حديدية تُسحب على الحجر (Metallic Clinking & Heavy Iron Scraping)
      const chainInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        [540, 890, 1420].forEach((f, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, t + idx * 0.08);
          g.gain.setValueAtTime(0.25, t + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);
          osc.connect(g);
          g.connect(subGain);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.22);
        });
      }, 2400);
      this.nodes.push(chainInterval);

    } else if (type === 'ghost_train_fog' || type === 'train_fog') {
      // 18. صفير قطار أشباح حديدي في الضباب (Mournful Whistle & Rhythmic Track Chug)
      const whistle1 = this.ctx.createOscillator();
      const whistle2 = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistle1.type = 'sine';
      whistle2.type = 'sine';
      whistle1.frequency.setValueAtTime(340, now);
      whistle2.frequency.setValueAtTime(415, now);
      whistleGain.gain.setValueAtTime(0.18, now);

      whistle1.connect(whistleGain);
      whistle2.connect(whistleGain);
      whistleGain.connect(subGain);
      whistle1.start(now);
      whistle2.start(now);

      // Track Chug
      const chugInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, t);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(g);
        g.connect(subGain);
        osc.start(t);
        osc.stop(t + 0.14);
      }, 480);

      this.nodes.push(whistle1, whistle2, whistleGain, chugInterval);

    } else if (type === 'monastery_bells') {
      // 19. رنين أجراس كنيسة جنائزية ضخمة (Deep Bronze Tolling Bell Harmonics)
      const bellInterval = window.setInterval(() => {
        if (!this.ctx || !this.isPlaying) return;
        const t = this.ctx.currentTime;
        [120, 185, 310, 540].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          const vol = 0.35 / (idx + 1);
          g.gain.setValueAtTime(vol, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 3.8);
          osc.connect(g);
          g.connect(subGain);
          osc.start(t);
          osc.stop(t + 3.9);
        });
      }, 4600);
      this.nodes.push(bellInterval);

    } else if (type === 'radio_static_evp' || type === 'radio_static') {
      // 20. ترددات راديو صناعي وأصوات EVP (Static Crackle + Heterodyne Radio Tuner Whistle)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const staticNoise = this.ctx.createBufferSource();
      staticNoise.buffer = buffer;
      staticNoise.loop = true;

      const staticFilter = this.ctx.createBiquadFilter();
      staticFilter.type = 'bandpass';
      staticFilter.frequency.setValueAtTime(1400, now);
      staticFilter.Q.setValueAtTime(2.0, now);

      const staticGain = this.ctx.createGain();
      staticGain.gain.setValueAtTime(0.28, now);

      const tuner = this.ctx.createOscillator();
      tuner.type = 'sine';
      tuner.frequency.setValueAtTime(1150, now);
      const tunerGain = this.ctx.createGain();
      tunerGain.gain.setValueAtTime(0.09, now);

      const tunerLfo = this.ctx.createOscillator();
      tunerLfo.type = 'sawtooth';
      tunerLfo.frequency.setValueAtTime(0.4, now);
      const tunerLfoGain = this.ctx.createGain();
      tunerLfoGain.gain.setValueAtTime(750, now);
      tunerLfo.connect(tunerLfoGain);
      tunerLfoGain.connect(tuner.frequency);

      staticNoise.connect(staticFilter);
      staticFilter.connect(staticGain);
      staticGain.connect(subGain);
      tuner.connect(tunerGain);
      tunerGain.connect(subGain);

      staticNoise.start(now);
      tuner.start(now);
      tunerLfo.start(now);
      this.nodes.push(staticNoise, staticFilter, staticGain, tuner, tunerGain, tunerLfo, tunerLfoGain);

    } else {
      // Fallback: Deep Ambient Dark Drone
      const oscLow = this.ctx.createOscillator();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(45, now);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.25, now);
      oscLow.connect(g);
      g.connect(subGain);
      oscLow.start(now);
      this.nodes.push(oscLow, g);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentType = null;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore
      }
      this.audioElement = null;
    }

    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
      } catch {
        // Ignore
      }
    }

    if (this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        if (typeof node === 'number') {
          clearInterval(node);
        } else {
          try {
            if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
              (node as AudioScheduledSourceNode).stop();
            }
          } catch {
            // Already stopped
          }
          try {
            if ('disconnect' in node && typeof (node as AudioNode).disconnect === 'function') {
              (node as AudioNode).disconnect();
            }
          } catch {
            // Already disconnected
          }
        }
      });
      this.nodes = [];
    }
  }

  public getActiveType() {
    return this.isPlaying ? this.currentType : null;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioEngine = new AmbientAudioEngine();

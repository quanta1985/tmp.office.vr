/**
 * Office VR Digital Twin - Realistic PBR & Dual-Mode Experience
 * Powered by A-Frame & WebXR
 *
 * Features:
 *  1. Realistic Three.js Renderer: ACES Filmic Tone Mapping & PCF Soft Shadows
 *  2. Dual-Mode Immersion:
 *     - Mode A: High-Fidelity 3D PBR Architectural Digital Twin
 *     - Mode B: 360° Real Office Video Immersion Dome (1:1 spatial video presence)
 *  3. Procedural Spatial Audio Synthesizer:
 *     - Fluorescent tube hum & switch flicker
 *     - Generative Lo-Fi Focus Music from conference table speaker
 *     - Realistic mechanical keyboard clicks & microwave chimes
 *  4. Interactive Props:
 *     - Wall light switch with realistic fluorescent tube startup flicker
 *     - Oscillating wall fans with 3-blade rotation & spatial audio
 *     - Multi-state computer monitors with glowing code & telemetry
 *     - Interactive microwave with heating light and chime
 *  5. 6 Teleportation Waypoints & 2D Floor Plan HUD
 */

// ============================================================================
// 1. Procedural 3D Spatial Audio & Lo-Fi Synthesizer
// ============================================================================
class OfficeSpatialAudio {
  constructor() {
    this.ctx = null;
    this.lofiTimer = null;
    this.lofiPlaying = false;
    this.lofiStep = 0;
    this.lofiGain = null;
    this.lofiPanner = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  updateListener(pos, dir, up) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const l = this.ctx.listener;
    if (l.positionX) {
      l.positionX.setValueAtTime(pos.x, now);
      l.positionY.setValueAtTime(pos.y, now);
      l.positionZ.setValueAtTime(pos.z, now);
      l.forwardX.setValueAtTime(dir.x, now);
      l.forwardY.setValueAtTime(dir.y, now);
      l.forwardZ.setValueAtTime(dir.z, now);
      l.upX.setValueAtTime(up.x, now);
      l.upY.setValueAtTime(up.y, now);
      l.upZ.setValueAtTime(up.z, now);
    } else if (l.setPosition) {
      l.setPosition(pos.x, pos.y, pos.z);
      l.setOrientation(dir.x, dir.y, dir.z, up.x, up.y, up.z);
    }
  }

  /**
   * Sound of clicking wall light switch with fluorescent tube hum/flicker
   */
  playSwitchFlicker(worldPos, lightsOn = true) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Tactile plastic switch click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, now);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    if (lightsOn) {
      // Fluorescent tube ballast startup buzz (100Hz buzz pulses)
      [0.08, 0.18, 0.32].forEach((delay) => {
        const buzz = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        buzz.type = 'sawtooth';
        buzz.frequency.setValueAtTime(120, now + delay);
        bGain.gain.setValueAtTime(0.08, now + delay);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);
        buzz.connect(bGain);
        bGain.connect(this.ctx.destination);
        buzz.start(now + delay);
        buzz.stop(now + delay + 0.06);
      });
    }
  }

  /**
   * Generative Lo-Fi Focus Music from the conference table desk speaker
   * Relaxing Cmaj9 -> Am9 -> Dm9 -> G13 chord progressions
   */
  toggleLofiMusic(worldPos) {
    this.init();
    if (!this.ctx) return false;

    if (this.lofiPlaying) {
      this.stopLofiMusic();
      return false;
    }

    this.lofiPlaying = true;
    const chords = [
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
      [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
      [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9
      [196.00, 246.94, 293.66, 392.00, 440.00]  // G13
    ];

    const playChordStep = () => {
      if (!this.lofiPlaying) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[this.lofiStep % chords.length];
      this.lofiStep++;

      currentChord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        // Warm tape / vinyl filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.04 + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(filter);
        filter.connect(gain);

        if (worldPos) {
          const panner = this.ctx.createPanner();
          panner.panningModel = 'HRTF';
          panner.distanceModel = 'inverse';
          panner.refDistance = 1.2;
          panner.maxDistance = 15;
          if (panner.positionX) {
            panner.positionX.setValueAtTime(worldPos.x, now);
            panner.positionY.setValueAtTime(worldPos.y, now);
            panner.positionZ.setValueAtTime(worldPos.z, now);
          }
          gain.connect(panner);
          panner.connect(this.ctx.destination);
        } else {
          gain.connect(this.ctx.destination);
        }

        osc.start(now + idx * 0.04);
        osc.stop(now + 3.4);
      });

      this.lofiTimer = setTimeout(playChordStep, 3600);
    };

    playChordStep();
    return true;
  }

  stopLofiMusic() {
    this.lofiPlaying = false;
    if (this.lofiTimer) {
      clearTimeout(this.lofiTimer);
      this.lofiTimer = null;
    }
  }

  /**
   * Sound of clicking computer keyboard
   */
  playKeyboardClick(worldPos) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700 + Math.random() * 800, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Microwave finish chime (Ding!)
   */
  playMicrowaveDing(worldPos) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [1046.5, 2093.0].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.02);
      gain.gain.setValueAtTime(0.25 / (i + 1), now + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.02);
      osc.stop(now + 0.8);
    });
  }

  /**
   * General spatial tone feedback
   */
  playSpatialTone(freq = 520, duration = 0.25, type = 'sine', worldPos = null, gainLvl = 0.2) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainLvl, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    if (worldPos) {
      const panner = this.ctx.createPanner();
      panner.panningModel = 'HRTF';
      if (panner.positionX) {
        panner.positionX.setValueAtTime(worldPos.x, now);
        panner.positionY.setValueAtTime(worldPos.y, now);
        panner.positionZ.setValueAtTime(worldPos.z, now);
      }
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.ctx.destination);
    } else {
      osc.connect(gain);
      gain.connect(this.ctx.destination);
    }

    osc.start(now);
    osc.stop(now + duration);
  }
}

const spatialAudio = new OfficeSpatialAudio();

// ============================================================================
// 2. A-Frame Components
// ============================================================================

/**
 * realistic-renderer: Upgrades Three.js WebGL renderer to ACES Filmic Tone Mapping
 * and PCF Soft Shadows for photographic quality
 */
AFRAME.registerComponent('realistic-renderer', {
  init: function () {
    const sceneEl = this.el;
    sceneEl.addEventListener('render-target-loaded', () => {
      const renderer = sceneEl.renderer;
      if (!renderer) return;

      // Photographic Tone Mapping
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      // Soft Shadows
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Color management
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      console.log('Photographic PBR & ACES Filmic Tone Mapping initialized.');
    });
  }
});

/**
 * spatial-listener: Synchronizes Camera orientation and position with Web Audio listener
 */
AFRAME.registerComponent('spatial-listener', {
  init: function () {
    this.lastPos = new THREE.Vector3();
    this.pos = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
  },
  tick: function () {
    const el = this.el;
    el.object3D.getWorldPosition(this.pos);
    el.object3D.getWorldDirection(this.dir);
    this.dir.negate();

    if (this.pos.distanceToSquared(this.lastPos) > 0.0001) {
      spatialAudio.updateListener(this.pos, this.dir, this.up);
      this.lastPos.copy(this.pos);
    }
  }
});

/**
 * hide-cursor-in-vr: Reticle cursor is visible on 2D desktop/mobile, hidden in 6DoF VR
 */
AFRAME.registerComponent('hide-cursor-in-vr', {
  init: function () {
    const scene = this.el.sceneEl;
    const cursor = this.el;
    scene.addEventListener('enter-vr', () => {
      if (scene.is('vr-mode') && (AFRAME.utils.device.checkHeadsetConnected())) {
        cursor.setAttribute('visible', 'false');
      }
    });
    scene.addEventListener('exit-vr', () => {
      cursor.setAttribute('visible', 'true');
    });
  }
});

/**
 * light-switch: Wall light switch next to the door that toggles fluorescent ceiling lights
 * with realistic tube flicker and hum
 */
AFRAME.registerComponent('light-switch', {
  init: function () {
    this.lightsOn = true;
    this.tubes = document.querySelectorAll('.ceiling-troffer-tube');
    this.bulbs = document.querySelectorAll('.ceiling-light-bulb');
    this.switchRocker = this.el.querySelector('.switch-rocker');

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.toggleLights();
    });
  },
  toggleLights: function () {
    this.lightsOn = !this.lightsOn;
    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);

    spatialAudio.playSwitchFlicker(pos, this.lightsOn);

    if (this.switchRocker) {
      this.switchRocker.setAttribute('rotation', this.lightsOn ? '10 0 0' : '-10 0 0');
    }

    if (this.lightsOn) {
      // Fluorescent tube warm-up flicker effect
      showStatusNotification('Ceiling Lights: ON (Ballast humming)');
      let flickerCount = 0;
      const interval = setInterval(() => {
        const state = (flickerCount % 2 === 0);
        this.tubes.forEach(t => t.setAttribute('material', 'emissiveIntensity', state ? 0.95 : 0.15));
        this.bulbs.forEach(b => b.setAttribute('light', 'intensity', state ? 0.6 : 0.08));
        flickerCount++;
        if (flickerCount > 4) {
          clearInterval(interval);
          this.tubes.forEach(t => t.setAttribute('material', 'emissiveIntensity', 0.95));
          this.bulbs.forEach(b => b.setAttribute('light', 'intensity', 0.6));
        }
      }, 70);
    } else {
      showStatusNotification('Ceiling Lights: OFF');
      this.tubes.forEach(t => t.setAttribute('material', 'emissiveIntensity', 0.02));
      this.bulbs.forEach(b => b.setAttribute('light', 'intensity', 0.04));
    }
  }
});

/**
 * desk-speaker: Smart Bluetooth speaker on meeting table that plays generative Lo-Fi focus music
 */
AFRAME.registerComponent('desk-speaker', {
  init: function () {
    this.playing = false;
    this.ledRing = this.el.querySelector('.speaker-led');

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.toggleMusic();
    });
  },
  toggleMusic: function () {
    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    this.playing = spatialAudio.toggleLofiMusic(pos);

    if (this.ledRing) {
      this.ledRing.setAttribute('material', 'color', this.playing ? '#38bdf8' : '#334155');
      this.ledRing.setAttribute('material', 'emissiveIntensity', this.playing ? 0.9 : 0.1);
    }

    showStatusNotification(this.playing ? 'Focus Radio: Playing Lo-Fi Beats 🎵' : 'Focus Radio: Paused 🔇');
  }
});

/**
 * interactive-fan: Wall mounted oscillating electric fan with rotating 3-blade propeller
 */
AFRAME.registerComponent('interactive-fan', {
  schema: {
    active: { type: 'boolean', default: true },
    speed: { type: 'number', default: 28 },
    oscillate: { type: 'boolean', default: true }
  },
  init: function () {
    this.blades = this.el.querySelector('.fan-blades');
    this.head = this.el.querySelector('.fan-head');
    this.active = this.data.active;
    this.bladeAngle = 0;
    this.oscAngle = 0;
    this.oscDir = 1;

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.toggleFan();
    });
  },
  toggleFan: function () {
    this.active = !this.active;
    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    spatialAudio.playSpatialTone(this.active ? 480 : 280, 0.2, 'sine', pos, 0.15);
    showStatusNotification(this.active ? 'Wall Fan: ON' : 'Wall Fan: OFF');
  },
  tick: function (time, delta) {
    if (!this.active) return;
    const dt = delta / 1000;

    if (this.blades) {
      this.bladeAngle = (this.bladeAngle + this.data.speed * dt * 360) % 360;
      this.blades.object3D.rotation.z = THREE.MathUtils.degToRad(this.bladeAngle);
    }

    if (this.head && this.data.oscillate) {
      this.oscAngle += this.oscDir * dt * 35;
      if (this.oscAngle > 38) {
        this.oscAngle = 38;
        this.oscDir = -1;
      } else if (this.oscAngle < -38) {
        this.oscAngle = -38;
        this.oscDir = 1;
      }
      this.head.object3D.rotation.y = THREE.MathUtils.degToRad(this.oscAngle);
    }
  }
});

/**
 * interactive-screen: Switches computer monitor textures (Code, Dashboard, Office Snapshot)
 */
AFRAME.registerComponent('interactive-screen', {
  init: function () {
    this.screens = [
      'assets/screen-code.png',
      'assets/screen-dash.png',
      'assets/office-snapshot.png'
    ];
    this.currentIndex = 0;

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.cycleScreen();
    });
  },
  cycleScreen: function () {
    this.currentIndex = (this.currentIndex + 1) % this.screens.length;
    const nextTexture = this.screens[this.currentIndex];
    this.el.setAttribute('material', 'src', nextTexture);

    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    spatialAudio.playKeyboardClick(pos);

    const names = ['Code Editor (VS Code IDE)', 'IoT & Energy Telemetry', 'Office Video Archive'];
    showStatusNotification(`Display: ${names[this.currentIndex]}`);
  }
});

/**
 * interactive-microwave: Click microwave to hear chime and toggle interior heating light
 */
AFRAME.registerComponent('interactive-microwave', {
  init: function () {
    this.light = this.el.querySelector('.microwave-light');
    this.cooking = false;

    this.el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.triggerMicrowave();
    });
  },
  triggerMicrowave: function () {
    const pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);

    if (this.cooking) return;
    this.cooking = true;

    if (this.light) this.light.setAttribute('visible', 'true');
    spatialAudio.playSpatialTone(180, 1.2, 'sawtooth', pos, 0.08);
    showStatusNotification('Microwave: Heating lunch...');

    setTimeout(() => {
      if (this.light) this.light.setAttribute('visible', 'false');
      spatialAudio.playMicrowaveDing(pos);
      showStatusNotification('Microwave: Ready! [Ding]');
      this.cooking = false;
    }, 1800);
  }
});

/**
 * interactive-tv: Video player controller for office-tour.mp4
 */
AFRAME.registerComponent('interactive-tv', {
  init: function () {
    this.videoEl = document.querySelector('#office-video');
    this.playBtn = this.el.querySelector('.tv-play-btn');
    this.muteBtn = this.el.querySelector('.tv-mute-btn');
    this.screenEl = this.el.querySelector('.tv-screen');

    if (this.screenEl) {
      this.screenEl.addEventListener('click', () => this.togglePlay());
    }
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }
  },
  togglePlay: function () {
    if (!this.videoEl) return;
    if (this.videoEl.paused) {
      this.videoEl.play().catch(e => console.log('Autoplay prevented:', e));
      showStatusNotification('Office Video Tour: Playing ▶');
      if (this.playBtn) this.playBtn.setAttribute('material', 'color', '#10b981');
    } else {
      this.videoEl.pause();
      showStatusNotification('Office Video Tour: Paused ⏸');
      if (this.playBtn) this.playBtn.setAttribute('material', 'color', '#ef4444');
    }
  },
  toggleMute: function () {
    if (!this.videoEl) return;
    this.videoEl.muted = !this.videoEl.muted;
    showStatusNotification(this.videoEl.muted ? 'Video Audio: Muted 🔇' : 'Video Audio: Unmuted 🔊');
    if (this.muteBtn) {
      this.muteBtn.setAttribute('material', 'color', this.videoEl.muted ? '#64748b' : '#3b82f6');
    }
  }
});

/**
 * teleport-waypoint: Clickable holographic pad for comfortable VR navigation
 */
AFRAME.registerComponent('teleport-waypoint', {
  schema: {
    targetPos: { type: 'vec3' },
    targetRotY: { type: 'number', default: 0 },
    label: { type: 'string', default: 'Waypoint' }
  },
  init: function () {
    const el = this.el;
    const data = this.data;

    el.addEventListener('mouseenter', () => {
      const ring = el.querySelector('.waypoint-ring');
      if (ring) ring.setAttribute('material', 'color', '#00F0FF');
      el.setAttribute('scale', '1.15 1.15 1.15');
    });

    el.addEventListener('mouseleave', () => {
      const ring = el.querySelector('.waypoint-ring');
      if (ring) ring.setAttribute('material', 'color', '#38bdf8');
      el.setAttribute('scale', '1 1 1');
    });

    el.addEventListener('click', (evt) => {
      evt.stopPropagation();
      teleportPlayer(data.targetPos, data.targetRotY, data.label);
    });
  }
});

// ============================================================================
// 3. Dual-Mode Immersion: 3D Twin vs 360° Real Video Dome
// ============================================================================

class ImmersionModeManager {
  constructor() {
    this.currentMode = '3d'; // '3d' or '360video'
    this.twinGroup = null;
    this.domeGroup = null;
    this.videoEl = null;
  }

  init() {
    this.twinGroup = document.querySelector('#office-3d-twin');
    this.domeGroup = document.querySelector('#office-360-dome');
    this.videoEl = document.querySelector('#office-video');
  }

  switchMode(mode) {
    this.init();
    this.currentMode = mode;

    if (mode === '360video') {
      if (this.twinGroup) this.twinGroup.setAttribute('visible', 'false');
      if (this.domeGroup) this.domeGroup.setAttribute('visible', 'true');
      if (this.videoEl) {
        this.videoEl.play().catch(e => console.log('Autoplay:', e));
      }
      showStatusNotification('Mode: 360° Real Office Video Dome (1:1 Presence)');
      // Move player into center of 360 dome
      teleportPlayer({ x: 0, y: 0, z: 0 }, 0, '360 Video Immersion Center');
    } else {
      if (this.twinGroup) this.twinGroup.setAttribute('visible', 'true');
      if (this.domeGroup) this.domeGroup.setAttribute('visible', 'false');
      showStatusNotification('Mode: 3D Architectural Digital Twin');
      teleportPlayer({ x: 0, y: 0, z: 4.2 }, 0, 'Office Entrance');
    }
  }
}

const immersionManager = new ImmersionModeManager();

// ============================================================================
// 4. Navigation & Lighting Control System
// ============================================================================

function teleportPlayer(targetPos, targetRotY = 0, label = 'Waypoint') {
  const rig = document.querySelector('#rig');
  if (!rig) return;

  spatialAudio.playSpatialTone(640, 0.2, 'sine', null, 0.15);

  rig.setAttribute('position', {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z
  });

  if (targetRotY !== undefined) {
    rig.setAttribute('rotation', { x: 0, y: targetRotY, z: 0 });
  }

  showStatusNotification(`Teleported to: ${label}`);
  updateMiniMapMarker(targetPos);
}

class OfficeLightingManager {
  constructor() {
    this.currentMode = 'day';
    this.sunLight = null;
    this.ambientLight = null;
    this.ceilingLights = [];
    this.windowQuad = null;
  }

  init() {
    this.sunLight = document.querySelector('#sun-light');
    this.ambientLight = document.querySelector('#ambient-light');
    this.ceilingLights = document.querySelectorAll('.ceiling-light-bulb');
    this.windowQuad = document.querySelector('#window-backdrop');
  }

  setMode(mode) {
    this.init();
    this.currentMode = mode;

    if (mode === 'day') {
      if (this.ambientLight) this.ambientLight.setAttribute('light', 'color: #ffffff; intensity: 0.72');
      if (this.sunLight) this.sunLight.setAttribute('light', 'color: #fff8e7; intensity: 0.95; position: 8 6 2');
      if (this.windowQuad) this.windowQuad.setAttribute('material', 'src: assets/window-view.png; color: #ffffff');
      this.ceilingLights.forEach(l => l.setAttribute('light', 'color: #ffffff; intensity: 0.6'));
      showStatusNotification('Lighting: Daylight Office ☀️');
    } else if (mode === 'sunset') {
      if (this.ambientLight) this.ambientLight.setAttribute('light', 'color: #ffd8b0; intensity: 0.52');
      if (this.sunLight) this.sunLight.setAttribute('light', 'color: #ff8c42; intensity: 1.15; position: 9 3 0');
      if (this.windowQuad) this.windowQuad.setAttribute('material', 'src: assets/window-view.png; color: #ffb703');
      this.ceilingLights.forEach(l => l.setAttribute('light', 'color: #fff1d0; intensity: 0.5'));
      showStatusNotification('Lighting: Golden Hour / Sunset 🌅');
    } else if (mode === 'night') {
      if (this.ambientLight) this.ambientLight.setAttribute('light', 'color: #2b3a67; intensity: 0.32');
      if (this.sunLight) this.sunLight.setAttribute('light', 'color: #1a2035; intensity: 0.15; position: 8 8 2');
      if (this.windowQuad) this.windowQuad.setAttribute('material', 'color: #0b132b');
      this.ceilingLights.forEach(l => l.setAttribute('light', 'color: #90e0ef; intensity: 0.4'));
      showStatusNotification('Lighting: Night Shift / Focus Mode 🌙');
    }

    spatialAudio.playSpatialTone(660, 0.25, 'sine', null, 0.15);
  }
}

const lightingManager = new OfficeLightingManager();

// ============================================================================
// 5. UI Overlay & Status Notification
// ============================================================================

let toastTimeout = null;
function showStatusNotification(msg) {
  let toast = document.querySelector('#vr-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vr-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}

function updateMiniMapMarker(pos) {
  const marker = document.querySelector('#map-player-marker');
  if (!marker) return;
  const normX = (pos.x + 4.0) / 8.0;
  const normZ = (pos.z + 5.5) / 11.0;
  marker.style.left = `${Math.max(5, Math.min(95, normX * 100))}%`;
  marker.style.top = `${Math.max(5, Math.min(95, normZ * 100))}%`;
}

// ============================================================================
// 6. DOM Ready & Event Handlers
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const hudOverlay = document.querySelector('#hud-overlay');
  const btnToggleHud = document.querySelector('#btn-toggle-hud');
  const btnHelp = document.querySelector('#btn-help');

  if (btnToggleHud && hudOverlay) {
    btnToggleHud.addEventListener('click', () => {
      hudOverlay.classList.add('hud-hidden');
      spatialAudio.init();
    });
  }

  if (btnHelp && hudOverlay) {
    btnHelp.addEventListener('click', () => {
      hudOverlay.classList.remove('hud-hidden');
    });
  }

  // Immersion Mode Switchers (3D Twin vs 360 Video Dome)
  document.querySelectorAll('[data-immersion-mode]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.getAttribute('data-immersion-mode');
      immersionManager.switchMode(mode);
    });
  });

  // Lighting Mode Buttons in HUD
  document.querySelectorAll('[data-lighting]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.getAttribute('data-lighting');
      lightingManager.setMode(mode);
    });
  });

  // Mini-map Hotspot Buttons
  document.querySelectorAll('[data-nav-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-nav-target');
      const waypoints = {
        'entrance': { pos: { x: 0, y: 0, z: 4.2 }, rotY: 0, label: 'Entrance Door' },
        'table': { pos: { x: 0, y: 0, z: -0.5 }, rotY: 0, label: 'Center Meeting Table' },
        'lead-dev': { pos: { x: -1.6, y: 0, z: 3.2 }, rotY: 45, label: 'Lead Dev Station' },
        'pantry': { pos: { x: -2.5, y: 0, z: -3.2 }, rotY: -90, label: 'Pantry & Fridge' },
        'admin': { pos: { x: 1.5, y: 0, z: -3.6 }, rotY: -160, label: 'Supervisor Desk' },
        'window': { pos: { x: 2.4, y: 0, z: 0.5 }, rotY: -90, label: 'Window & ZZ Plant' }
      };

      if (waypoints[target]) {
        teleportPlayer(waypoints[target].pos, waypoints[target].rotY, waypoints[target].label);
      }
    });
  });

  // Initialize audio on first user touch / click anywhere
  const initAudioOnGesture = () => {
    spatialAudio.init();
    window.removeEventListener('click', initAudioOnGesture);
    window.removeEventListener('touchstart', initAudioOnGesture);
  };
  window.addEventListener('click', initAudioOnGesture);
  window.addEventListener('touchstart', initAudioOnGesture);
});

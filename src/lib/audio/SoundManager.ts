import { useSettingsStore } from "@/store/settingsStore"

export class SoundManager {
    private static instance: SoundManager;
    private audioContext: AudioContext | null = null;

    private constructor() {
        // Initialize AudioContext on first user interaction if needed
        window.addEventListener('click', () => this.init(), { once: true });
    }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    private getSettings() {
        const { sfxEnabled, masterVolume } = useSettingsStore.getState();
        return { sfxEnabled, masterVolume };
    }

    public playClick(pitch: number = 1.0) {
        const { sfxEnabled, masterVolume } = this.getSettings();
        if (!sfxEnabled || !this.audioContext) return;
        this.init();

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 * pitch, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1 * masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    public playSuccess() {
        const { sfxEnabled, masterVolume } = this.getSettings();
        if (!sfxEnabled || !this.audioContext) return;
        this.init();

        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C Major triad

        notes.forEach((freq, i) => {
            const osc = this.audioContext!.createOscillator();
            const gain = this.audioContext!.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext!.destination);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const time = now + (i * 0.1);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.1 * masterVolume, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

            osc.start(time);
            osc.stop(time + 0.4);
        });
    }

    public playError() {
        const { sfxEnabled, masterVolume } = this.getSettings();
        if (!sfxEnabled || !this.audioContext) return;
        this.init();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0.1 * masterVolume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    public playGold() {
        const { sfxEnabled, masterVolume } = this.getSettings();
        if (!sfxEnabled || !this.audioContext) return;
        this.init();

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(3000, this.audioContext.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.setValueAtTime(0.05 * masterVolume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }
}

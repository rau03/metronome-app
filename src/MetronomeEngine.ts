// src/MetronomeEngine.ts

export class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private tempo: number = 120;
  private currentBeat: number = 0;
  private beatsPerMeasure: number = 4;

  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // sec
  private nextNoteTime: number = 0.0;
  private timerID: number | undefined;

  constructor(initialTempo: number = 120, beatsPerMeasure: number = 4) {
    this.tempo = initialTempo;
    this.beatsPerMeasure = beatsPerMeasure;
  }

  public start() {
    if (this.isPlaying) return;

    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;

    // Use ! to tell TypeScript we know audioContext exists now
    this.nextNoteTime = this.audioContext!.currentTime + 0.1;

    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerID !== undefined) {
      window.clearTimeout(this.timerID);
      this.timerID = undefined;
    }
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setTimeSignature(beats: number) {
    this.beatsPerMeasure = beats;
    this.currentBeat = 0;
  }

  // --- PRIVATE METHODS ---

  private scheduler() {
    if (this.audioContext == null) return;

    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  private scheduleNote(beatNumber: number, time: number) {
    if (!this.audioContext) return;

    // Create Oscillator and GainNode
    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    if (beatNumber === 0) {
      osc.frequency.value = 1000; // High pitch for beat 1
    } else {
      osc.frequency.value = 800; // Low pitch for others
    }

    osc.start(time);
    osc.stop(time + 0.05);

    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += secondsPerBeat;

    this.currentBeat++;
    if (this.currentBeat === this.beatsPerMeasure) {
      this.currentBeat = 0;
    }
  }
}

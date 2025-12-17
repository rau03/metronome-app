export class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private tempo: number = 120;
  private currentBeat: number = 0;
  private beatsPerMeasure: number = 4;

  // Scheduling Variables
  // We use a "Lookahead" technique: A setInterval runs frequently (25ms)
  // to schedule Web Audio events slightly in the future (0.1s).
  // This prevents timing drift caused by the main thread.
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

    // Modern browsers require resuming AudioContext after a user gesture
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;

    this.nextNoteTime = this.audioContext!.currentTime;

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

  private scheduler() {
    if (this.audioContext == null) return;

    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
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

    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    // Synthesize a "Woodblock" sound
    // Sine wave + sharp decay = percussive tone
    osc.type = "sine";
    if (beatNumber === 0) {
      osc.frequency.value = 1200; // High pitch for beat 1
    } else {
      osc.frequency.value = 800; // Low pitch for others
    }

    osc.start(time);
    osc.stop(time + 0.1);

    envelope.gain.setValueAtTime(1, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
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

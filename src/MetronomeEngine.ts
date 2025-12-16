// src/MetronomeEngine.ts

export class MetronomeEngine {
  // 1. The AudioContext is the "container" for all sound.
  // It's like the physical audio interface on a computer.
  private audioContext: AudioContext | null = null;

  // 2. We need to track the state of the metronome
  private isPlaying: boolean = false;
  private tempo: number = 120;
  private currentBeat: number = 0;
  private beatsPerMeasure: number = 4;

  // 3. SCHEDULING VARIABLES (The "Secret Sauce")
  // Web Audio timing is precise, JavaScript 'setTimeout' is not.
  // We use a 'lookahead' technique: checking frequently to schedule notes
  // that are coming up soon.
  private lookahead: number = 25.0; // How frequently to call the scheduler (in ms)
  private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (in sec)
  private nextNoteTime: number = 0.0; // When the next note is due
  private timerID: number | undefined; // To store the setTimeout ID so we can stop it

  constructor(initialTempo: number = 120, beatsPerMeasure: number = 4) {
    this.tempo = initialTempo;
    this.beatsPerMeasure = beatsPerMeasure;
  }

  // created AudioContext lazily (only when users clicks start)
  //Resume if suspended
  //proceed with starting the metronome
  public start() {
    if (this.isPlaying) return; // Prevent multiple loops if clicked twice

    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    // Resume if suspended (browser requirement)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.currentBeat = 0;

    // Schedule the first note slightly in the future (0.1s) to avoid "glitches"
    // where the browser tries to play a sound in the past.
    this.nextNoteTime = this.audioContext!.currentTime + 0.1;

    this.scheduler();
  }
  //tells the rest of code "we are stopped"
  //this actually is the stop the mechanism (clearTimeout)
  public stop() {
    this.isPlaying = false;

    if (this.timerID !== undefined) {
      clearTimeout(this.timerID);
      this.timerID = undefined;
    }
  }
  //update the tempo
  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  public setTimeSignature(beats: number) {
    this.beatsPerMeasure = beats;
    this.currentBeat = 0;
  }

  // --- PRIVATE METHODS (The internal engine logic) ---

  private scheduler() {
    // TODO:
    // This is the recursive loop.
    // While (nextNoteTime < currentTime + scheduleAheadTime) {
    //    scheduleNote(...)
    //    advanceNote(...)
    // }
    // setTimeout(() => this.scheduler(), this.lookahead)
  }

  private scheduleNote(beatNumber: number, time: number) {
    // TODO: Create the Oscillator and make the beep sound
  }

  private nextNote() {
    // TODO: Calculate when the next note happens based on BPM
    // increment the beat number (0, 1, 2, 3 -> 0)
  }
}

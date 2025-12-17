import { useState, useRef } from "react";
import { MetronomeEngine } from "./MetronomeEngine";
import "./App.css";

function App() {
  // Use a Ref to persist the engine instance across renders without triggering re-renders
  const metronomeRef = useRef<MetronomeEngine>(new MetronomeEngine(120, 4));
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  const handleStartStop = () => {
    if (isPlaying) {
      metronomeRef.current.stop();
      setIsPlaying(false);
    } else {
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value);
    setBpm(newBpm);
    metronomeRef.current.setTempo(newBpm);
  };

  const handleTimeSigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBeats = parseInt(e.target.value);
    setBeatsPerMeasure(newBeats);
    metronomeRef.current.setTimeSignature(newBeats);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Metronome</h1>

      <div className="card">
        {/* BPM SLIDER */}
        <div style={{ marginBottom: "20px" }}>
          <label>BPM: {bpm}</label>
          <br />
          <input
            type="range"
            min="40"
            max="240"
            value={bpm}
            onChange={handleBpmChange}
          />
        </div>

        {/* TIME SIGNATURE */}
        <div style={{ marginBottom: "20px" }}>
          <label>Time Signature: </label>
          <select value={beatsPerMeasure} onChange={handleTimeSigChange}>
            <option value="4">4/4</option>
            <option value="3">3/4</option>
            <option value="2">2/4</option>
          </select>
        </div>

        {/* START/STOP BUTTON */}
        <button
          onClick={handleStartStop}
          style={{ padding: "10px 20px", fontSize: "1.2rem" }}
        >
          {isPlaying ? "STOP" : "START"}
        </button>
      </div>
    </div>
  );
}

export default App;

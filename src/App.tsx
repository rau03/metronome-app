import { useState, useRef } from "react";
import { MetronomeEngine } from "./MetronomeEngine";
import "./App.css"; // We will style this later

function App() {
  // 1. Store the engine in a ref so it persists between renders
  // We initialize it ONCE.
  const metronomeRef = useRef<MetronomeEngine>(new MetronomeEngine(120, 4));

  // 2. React State (For the UI display)
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  // --- HANDLERS ---
  //If playing > Stop the engine, update UI to show "START"
  //If stopped > Start the engine, update UI to show "STOP"
  const handleStartStop = () => {
    if (isPlaying) {
      metronomeRef.current.stop();
      setIsPlaying(false);
    } else {
      metronomeRef.current.start();
      setIsPlaying(true);
    }
  };

    //e.target.value is the slider value. parseInt converts it to a number. 
    //setBpm(newBpm) updates the React > UI re-renders with new label. 
    //setTempo(newBpm) updates the engine > audio timing changes. 
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value);
    setBpm(newBpm);
    metronomeRef.current.setTempo(newBpm);
  };

    //e.target.value is the selected option value. parseInt converts it to a number.  
    //setBeatsPerMeasure updates the React > dropdown stays selected on "3/4"
    //setTimeSignature udpates engine > beat counter now cycles through 0, 1, 2, 3, 0, etc.
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

# QuaverEd Metronome Challenge

A precise, web-based metronome application built with **React**, **TypeScript**, and the **Web Audio API**.

## Quick Start

To run the project locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

3.  **Open the Application:**
    Open your browser and navigate to the link provided in the terminal (usually `http://localhost:5173`).

## Technical Approach

### The Core Challenge: Timing Accuracy
The most critical requirement for a metronome is precision. Standard JavaScript timers (`setInterval` or `setTimeout`) run on the main thread and are subject to drift, especially when the UI is re-rendering or the browser is under load.

**My Solution: The "Lookahead" Scheduler**
I implemented the industry-standard "Lookahead" scheduling technique (often referred to as "A Tale of Two Clocks"):
1.  **The Lookahead Loop:** A standard `setTimeout` runs frequently (every 25ms) to look a short distance into the future.
2.  **The Audio Clock:** Actual audio events are scheduled on the `AudioContext.currentTime` hardware clock, which is sample-accurate and unaffected by the main thread.
3.  **Result:** The metronome maintains perfect timing regardless of UI updates or lag.

### Architecture
*   **`MetronomeEngine.ts`:** A dedicated TypeScript class that encapsulates all audio logic, state, and scheduling. This ensures separation of concerns—the UI does not know how sound is generated, it only sends commands.
*   **`App.tsx`:** A React component that handles user interaction and state. It maintains a persistent instance of the engine using `useRef` to survive re-renders.

## Design Decisions & Trade-offs

### 1. Synthesized Sound vs. Sampled Audio
**Decision:** I chose to synthesize the sound using an Oscillator (Sine wave) with a custom Gain Envelope rather than loading an `.mp3` or `.wav` sample.
*   **Reasoning:** This eliminates network requests and loading states, ensuring the app works instantly even on slow connections.
*   **Implementation:** I tuned the frequency and decay to mimic a "Woodblock" sound (High pitch for the accent, Low pitch for other beats) to provide a pleasant, musical tone compared to a raw digital beep.

### 2. Minimalist UI
**Decision:** I adhered strictly to the requirement for a "minimal UI."
*   **Reasoning:** I prioritized responsiveness (CSS Grid/Flexbox) and accessibility (clear labels, native inputs) over complex visual styling. The interface is designed to work seamlessly on both desktop and mobile devices.

### 3. React + Vite
**Decision:** Used Vite for the build tool.
*   **Reasoning:** It provides a significantly faster development experience and optimized production build compared to Create React App, with first-class TypeScript support out of the box.

## Future Improvements

If I were to expand this project further, I would implement the following features:

1.  **Visual Beat Indicator:**
    *   Currently, the metronome is audio-only. I would add a visualizer (LED dots or a flash) that syncs with the BPM.
    *   *Technical Strategy:* I would implement a callback system in the `MetronomeEngine` to trigger React state updates via `requestAnimationFrame` to ensure the visuals align perfectly with the audio clock.

2.  **Polyrhythms & Subdivisions:**
    *   Add support for eighth notes, triplets, and complex time signatures (e.g., 5/4, 7/8) to assist with advanced music practice.

3.  **Tap Tempo:**
    *   A button allowing users to tap a rhythm to automatically set the BPM.

## Project Structure

```text
src/
├── MetronomeEngine.ts   # Core audio logic and scheduling class
├── App.tsx              # React UI Component
├── App.css              # Responsive styling
└── main.tsx             # Entry point
TONEDESIGNER: Modular Synthesizer Platform

1. Project Overview and Philosophy

The T.E. Grid is a unique web-based modular synthesizer platform designed to merge high-quality sound synthesis (via Tone.js) with a rigorous, minimalist user interface inspired by the Teenage Engineering (T.E.) aesthetic.

The platform's core value proposition is to serve as a visual programming interface for music production. Its primary output is not only sound but also clean, runnable Tone.js JavaScript code, allowing users to design complex patches visually and then export production-ready code for their own projects.

**Current Implementation Status**: The platform now features a complete Module Factory system and dedicated PatchingController, providing professional-grade modular synthesis with drag-and-drop patching capabilities.

1.1 Design Philosophy: Aesthetics and Usability

The entire design adheres to three core tenets:

Aesthetic Rigor (The T.E. Look): The interface uses a clean, grid-based layout, a highly legible monospace font, and a strictly controlled color palette (White/Light Gray backgrounds, Dark Monospace Text). Each module is instantly recognizable by its dedicated knob color (e.g., Orange for Sources, Blue for Shapers, Pink for Effects).

Architectural Simplicity: The system is built around the Synth Node Pattern (Section 2.1), ensuring every component is a self-contained unit.

Code as Output: The visual interface serves as a real-time code generator. All user interactions instantly update the exported JavaScript, making the platform a "Visual Code Editor for Sound."

2. Architectural Structure (The Module Factory Pattern)

The T.E. Grid is built around a sophisticated Module Factory system that creates and manages Synth Nodes. Each module is created through the ModuleFactory and consists of three synchronized components:

| Component | Description | Role |
|-----------|-------------|------|
| **1. Node Configuration** | JavaScript object containing the module's id, type, and parameters (e.g., `oscillatorNode`, `filterNode`) | **Source of Truth**: The canonical state of the module |
| **2. Visual Element** | Rendered HTML/CSS module with knobs, ports, and displays | **Input Layer**: Handles user interaction and visual feedback |  
| **3. Tone.js Object** | Instantiated Tone.js audio object (e.g., `vco1ToneObject`, `filterToneObject`) | **Sound Engine**: Produces or processes audio |

**Module Factory System (`modules.js`)**: 
- **ModuleRegistry**: Stores all module definitions
- **ModuleFactory.create()**: Instantiates modules with synchronized components
- **Available Modules**: Oscillator, Filter, Envelope, LFO, Reverb

2.1 The Two-Way Synchronization Loop (The Data Bridge)

The entire application relies on a robust two-way data flow that guarantees the visual interface and the sound engine are never out of sync.

**User Action → Data Update**: A user drags a knob. This event handler calculates the new value and updates the central Data Structure (node.parameters).

**Data Update → Visual/Tone.js Sync**: The moment the Data Structure is updated, two critical actions occur:
- The visual display and knob rotation are updated (Visual Sync)
- The `syncToneEngine()` function is called, which updates the actual property on the Tone.js Object (e.g., `vco1ToneObject.frequency.value = newValue`)

**Data Update → Code Compiler**: The `generateCode()` function is called, reading the entire Data Structure and outputting the updated code.

2.2 The PatchingController System (`PatchingController.js`)

The platform now includes a dedicated PatchingController that manages all visual cable connections:

**Key Features**:
- **Drag-and-Drop Patching**: Professional modular synth UX (output-to-input dragging)
- **Signal Type Validation**: Ensures audio, CV, and gate signals connect appropriately  
- **Visual Feedback**: Ghost cables during drag operations with signal-colored feedback
- **Connection Management**: Real-time connection creation/removal with audio recompilation
- **Universal Port System**: Single event listener system for all patch ports

3. Signal Flow and Color Coding

The T.E. Grid uses a color-coding system to visually represent the type of signal being passed, adhering to real-world modular synthesis standards.

3.1 Audio Path (Yellow Ports)

This is the main sound signal. It flows sequentially from Source → Shaper → Time → Effect → Destination.

| Module Type | Knob Color | Current Modules | Function |
|-------------|------------|-----------------|----------|
| **Source** | Orange | VCO-1 | Generates raw sound (Sine, Square, Sawtooth, Triangle) |
| **Shaper** | Blue | VCF-1 | Alters timbre with filtering (LPF, HPF, BPF, Notch) |
| **Time/Gain** | Green/Red | ENV/VCA-1 | Controls amplitude over time (ADSR envelope) |
| **Effect** | Pink/Silver | REVERB-1 | Post-processing spatial effects |

**Current Default Signal Chain**: VCO-1 → VCF-1 → ENV/VCA-1 → REVERB-1 → Destination

**Implementation Details**:
- All audio connections use `.connect()` calls between Tone.js objects
- Signal validation prevents incompatible audio-to-CV connections
- Visual feedback shows connection status with color-coded cables

3.2 Control Voltage (CV) Path (Purple/Blue Ports)

This is a control signal used to automate parameters on other modules.

| Module Type | Port Color | Current Module | Function |
|-------------|------------|----------------|----------|
| **Modulation** | Purple/Gray | LFO-1 | Generates cyclical control signals (Sine, Square, Sawtooth, Triangle) at sub-audio frequencies |

**Current CV Routing**: LFO-1 → VCF-1 Frequency (for filter sweeping)

**Implementation Details**:
- CV signals connect to Tone.js parameter objects (e.g., `filter.frequency`)
- Port validation ensures CV only connects to compatible parameter inputs  
- LFO module includes min/max range controls for modulation depth
- Visual port translation: `/cv_in` automatically maps to `/frequency` for audio parameters

4. The Code Compiler

The Code Compiler reads the module instances and connection data to generate three structured blocks of runnable Tone.js code:

**4.1 Instantiation Block**: Generates all module declarations using the ModuleFactory system
```javascript
// Example output:
const vco1 = new Tone.Oscillator({ frequency: 440, type: "sine" });
const filter1 = new Tone.Filter({ frequency: 8000, type: "lowpass", Q: 1 });
const envelope1 = new Tone.AmplitudeEnvelope({ attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.0 });
```

**4.2 Patching Block**: Generates all `.connect()` calls for both audio and control signals
```javascript
// Example audio connections:
vco1.connect(filter1);
filter1.connect(envelope1);
envelope1.connect(reverb1);

// Example CV connections:
lfo1.connect(filter1.frequency);
```

**4.3 Triggering Block**: Generates the final `playSynth()` function with note-on/note-off logic
```javascript
function playSynth() {
    envelope1.triggerAttackRelease("8n");
    vco1.start();
}
```

**Implementation Details**:
- Code generation is triggered by the `compilePatching()` function
- The `currentPatchConnections` array stores all connection data
- Generated code is clean, production-ready JavaScript with no platform dependencies
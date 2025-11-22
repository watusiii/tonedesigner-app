/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * T.E. GRID SYNTHESIS - MODULAR TONE SYNTHESIZER PLATFORM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * PROJECT OVERVIEW:
 * This project implements a visually constrained modular synthesizer platform
 * inspired by Teenage Engineering and Nothing design philosophy. The core goal
 * is to create a beautiful, functional, and minimal interface that outputs
 * copy-pasteable, production-ready JavaScript code.
 * 
 * CORE ARCHITECTURAL STRATEGY:
 * ───────────────────────────────────────────────────────────────────────────────
 * THE SYNTH NODE PATTERN:
 * Visual Module ⟷ Synth Node Object ⟷ Tone.js Object
 * 
 * This three-way correspondence ensures that:
 * 1. Each visual module on the grid represents a synthesizer component
 * 2. Each module maps to a JavaScript object (Synth Node) with standardized methods
 * 3. Each Synth Node contains or controls a Tone.js audio object
 * 
 * DESIGN PRINCIPLES:
 * ───────────────────────────────────────────────────────────────────────────────
 * • Minimalist Interface: Clean, functional design with constrained visual elements
 * • Modular Architecture: Each component is self-contained and reusable
 * • Code Generation: The interface compiles to clean, readable JavaScript
 * • Real-time Feedback: Visual and audio feedback for all parameter changes
 * • Production Ready: Generated code can be directly used in web applications
 * 
 * PLANNED COMPONENTS:
 * ───────────────────────────────────────────────────────────────────────────────
 * • Oscillators (Sine, Square, Sawtooth, Triangle, Noise)
 * • Filters (LowPass, HighPass, BandPass, Notch)
 * • Envelopes (ADSR)
 * • Effects (Reverb, Delay, Chorus, Distortion)
 * • Utilities (Mixer, Splitter, Analyzer)
 * • Sequencer (Step sequencer, Pattern generator)
 * 
 * CODE COMPILER TARGET:
 * ───────────────────────────────────────────────────────────────────────────────
 * The final output will be a generateCode() function that produces clean,
 * commented JavaScript code that recreates the synthesizer patch using only
 * Tone.js, without dependencies on this platform's custom objects.
 * 
 * NEXT DEVELOPMENT PHASES:
 * ───────────────────────────────────────────────────────────────────────────────
 * 1. Module System: Create base SynthNode class and module factory
 * 2. Visual Grid: Implement the visual module placement and connection system
 * 3. Audio Routing: Build the signal flow and connection management
 * 4. Parameter Control: Add real-time parameter manipulation
 * 5. Code Generation: Implement the JavaScript code compiler
 * 6. Presets & Export: Save/load functionality and export capabilities
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROBUST SYNTHESIZER SETUP & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Setup Synthesizer Platform
 * Robust initialization function that manages Tone.js setup and module rendering
 */
async function setupSynth() {
    try {
        // Auto-start audio context on first user interaction
        document.addEventListener('click', async () => {
            if (Tone.context.state !== 'running') {
                await Tone.start();
                console.log('T.E. Grid Synthesis: Audio engine started');
            }
        }, { once: true });
        
        // Create Tone.js oscillator instance using oscillatorNode data
        vco1ToneObject = new Tone.Oscillator({
            frequency: oscillatorNode.parameters.frequency,
            type: oscillatorNode.parameters.waveform,
            detune: oscillatorNode.parameters.detune
        });
        
        // Create Tone.js filter instance using filterNode data
        filterToneObject = new Tone.Filter({
            frequency: filterNode.parameters.frequency,
            type: filterNode.parameters.type,
            Q: filterNode.parameters.Q
        });
        
        // Create Tone.js envelope instance using envelopeNode data
        envelopeToneObject = new Tone.AmplitudeEnvelope({
            attack: envelopeNode.parameters.attack,
            decay: envelopeNode.parameters.decay,
            sustain: envelopeNode.parameters.sustain,
            release: envelopeNode.parameters.release
        });
        
        // Create Tone.js LFO instance using lfoNode data
        lfoToneObject = new Tone.LFO({
            frequency: lfoNode.parameters.frequency,
            type: lfoNode.parameters.type,
            min: lfoNode.parameters.min,
            max: lfoNode.parameters.max
        });
        
        // Create Tone.js Reverb instance using reverbNode data
        reverbToneObject = new Tone.Reverb({
            decay: reverbNode.parameters.decay,
            wet: reverbNode.parameters.wet
        });
        
        // CRITICAL PATCHING LOGIC - Signal Chain: VCO -> Filter -> Envelope -> Reverb -> Destination
        vco1ToneObject.connect(filterToneObject);
        filterToneObject.connect(envelopeToneObject);
        envelopeToneObject.connect(reverbToneObject);
        reverbToneObject.toDestination();
        
        // Connect LFO to modulate filter frequency
        lfoToneObject.connect(filterToneObject.frequency);
        
        // Start the oscillator and LFO immediately
        vco1ToneObject.start();
        lfoToneObject.start();
        
        // Initialize global synth nodes array
        synthNodes = [oscillatorNode, filterNode, envelopeNode, lfoNode, reverbNode];
        
        // Initial sync to ensure Tone.js objects match data structures
        syncToneEngine(oscillatorNode);
        syncToneEngine(filterNode);
        syncToneEngine(envelopeNode);
        syncToneEngine(lfoNode);
        syncToneEngine(reverbNode);
        
        // Initialize modules UI - render both modules side by side
        initializeModules();
        
        // Setup interactive knob functionality
        setupKnobInteraction();
        
        // Setup selector functionality
        setupSelectorInteraction();
        
        // Setup test note triggering
        setupTestNoteTrigger();
        
        // Setup code panel toggle functionality
        setupCodePanelToggle();
        
        // Setup code copy functionality
        setupCopyCode();
        
        // Initial code display update
        updateCodeDisplay();
        
        console.log('T.E. Grid Synthesis: Synthesizer platform initialized');
        
    } catch (error) {
        console.error('T.E. Grid Synthesis: Setup failed', error);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * OSCILLATOR MODULE - SYNTH NODE DATA STRUCTURE & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Oscillator Synth Node - Core data structure following the Synth Node Pattern
 * This object represents the module's state and serves as input for both
 * Tone.js object creation and the Code Compiler
 */
const oscillatorNode = {
    id: "oscillator-1",
    type: "OmniOscillator",
    parameters: {
        waveform: "sine",
        frequency: 440,
        detune: 0
    }
};

/**
 * Global Tone.js oscillator instance
 * This is the actual audio engine object that corresponds to the oscillatorNode
 */
let vco1ToneObject;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FILTER MODULE - SYNTH NODE DATA STRUCTURE & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Filter Synth Node - VCF (Voltage Controlled Filter)
 * This object represents the filter's state and serves as input for both
 * Tone.js object creation and the Code Compiler
 */
const filterNode = {
    id: "filter-1",
    type: "Filter",
    parameters: {
        type: "lowpass",
        frequency: 8000,
        Q: 1
    }
};

/**
 * Global Tone.js filter instance
 * This is the actual audio engine object that corresponds to the filterNode
 */
let filterToneObject;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ENVELOPE MODULE - SYNTH NODE DATA STRUCTURE & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Envelope Synth Node - ENV/VCA (Voltage Controlled Amplifier)
 * This object represents the envelope's state and serves as input for both
 * Tone.js object creation and the Code Compiler
 */
const envelopeNode = {
    id: "envelope-1",
    type: "AmplitudeEnvelope",
    parameters: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 1.0
    }
};

/**
 * Global Tone.js envelope instance
 * This is the actual audio engine object that corresponds to the envelopeNode
 */
let envelopeToneObject;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LFO MODULE - SYNTH NODE DATA STRUCTURE & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * LFO Synth Node - Low Frequency Oscillator for modulation
 * This object represents the LFO's state and serves as input for both
 * Tone.js object creation and the Code Compiler
 */
const lfoNode = {
    id: "lfo-1",
    type: "LFO",
    parameters: {
        frequency: 1,      // Speed of modulation in Hz
        type: "sine",      // Waveform of control signal
        min: 200,          // Minimum filter frequency
        max: 5000          // Maximum filter frequency
    }
};

/**
 * Global Tone.js LFO instance
 * This is the actual audio engine object that corresponds to the lfoNode
 */
let lfoToneObject;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REVERB MODULE - SYNTH NODE DATA STRUCTURE & TONE.JS INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Reverb Synth Node - Effects/Post-processing
 * This object represents the reverb's state and serves as input for both
 * Tone.js object creation and the Code Compiler
 */
const reverbNode = {
    id: "reverb-1",
    type: "Reverb",
    parameters: {
        decay: 1.5,        // Length of reverb tail in seconds
        wet: 0.5           // Mix level (0 = dry, 1 = wet)
    }
};

/**
 * Global Tone.js Reverb instance
 * This is the actual audio engine object that corresponds to the reverbNode
 */
let reverbToneObject;

/**
 * Global Synth Nodes Array - For tracking all modules
 * Used for code generation and module management
 */
let synthNodes = [];

/**
 * Render Oscillator Module
 * Takes the oscillator data structure as input and returns the corresponding HTML string
 * Following T.E. aesthetic principles: minimal, functional, beautiful
 * 
 * @param {Object} oscillatorData - The oscillator synth node data structure
 * @returns {string} HTML string for the oscillator module
 */
function renderOscillatorModule(oscillatorData) {
    return `
        <div class="synth-module" data-module-id="${oscillatorData.id}">
            <div class="corner-port-output">
                <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                <span class="corner-port-label">OUT</span>
            </div>
            
            <div class="module-header">
                <h3 class="module-title">VCO-1</h3>
            </div>
            
            <div class="module-controls">
                <div class="control-group">
                    <select class="waveform-selector" data-param="waveform">
                        <option value="sine" ${oscillatorData.parameters.waveform === 'sine' ? 'selected' : ''}>SINE</option>
                        <option value="square" ${oscillatorData.parameters.waveform === 'square' ? 'selected' : ''}>SQUARE</option>
                        <option value="sawtooth" ${oscillatorData.parameters.waveform === 'sawtooth' ? 'selected' : ''}>SAW</option>
                        <option value="triangle" ${oscillatorData.parameters.waveform === 'triangle' ? 'selected' : ''}>TRI</option>
                    </select>
                    <div class="wave-visual" data-wave-type="${oscillatorData.parameters.waveform}"></div>
                </div>
                
                <div class="control-group">
                    <label class="control-label">FREQ</label>
                    <div class="synth-knob" data-param="frequency" data-value="${oscillatorData.parameters.frequency}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${oscillatorData.parameters.frequency}Hz</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">DETUNE</label>
                    <div class="synth-knob" data-param="detune" data-value="${oscillatorData.parameters.detune}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${oscillatorData.parameters.detune}¢</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Filter Module
 * Takes the filter data structure as input and returns the corresponding HTML string
 * Following T.E. aesthetic principles with cyan/blue knobs for visual distinction
 * 
 * @param {Object} filterData - The filter synth node data structure
 * @returns {string} HTML string for the filter module
 */
function renderFilterModule(filterData) {
    return `
        <div class="synth-module" data-module-id="${filterData.id}">
            <div class="corner-port-input">
                <div class="patch-port audio-input" data-port-type="audio-in" data-signal="audio"></div>
                <span class="corner-port-label">IN</span>
            </div>
            
            <div class="corner-port-output">
                <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                <span class="corner-port-label">OUT</span>
            </div>
            
            <div class="module-header">
                <h3 class="module-title">VCF-1</h3>
            </div>
            
            <div class="module-controls">
                <div class="control-group">
                    <label class="control-label">TYPE</label>
                    <select class="filter-type-selector" data-param="type">
                        <option value="lowpass" ${filterData.parameters.type === 'lowpass' ? 'selected' : ''}>LPF</option>
                        <option value="highpass" ${filterData.parameters.type === 'highpass' ? 'selected' : ''}>HPF</option>
                        <option value="bandpass" ${filterData.parameters.type === 'bandpass' ? 'selected' : ''}>BPF</option>
                        <option value="notch" ${filterData.parameters.type === 'notch' ? 'selected' : ''}>NOTCH</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label class="control-label">FREQ</label>
                    <div class="synth-knob filter-knob" data-param="frequency" data-value="${filterData.parameters.frequency}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${filterData.parameters.frequency}Hz</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">Q</label>
                    <div class="synth-knob filter-knob" data-param="Q" data-value="${filterData.parameters.Q}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${filterData.parameters.Q}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Envelope Module
 * Takes the envelope data structure as input and returns the corresponding HTML string
 * Following T.E. aesthetic principles with red knobs for time/controller visual distinction
 * 
 * @param {Object} envelopeData - The envelope synth node data structure
 * @returns {string} HTML string for the envelope module
 */
function renderEnvelopeModule(envelopeData) {
    return `
        <div class="synth-module" data-module-id="${envelopeData.id}">
            <div class="corner-port-input">
                <div class="patch-port audio-input" data-port-type="audio-in" data-signal="audio"></div>
                <span class="corner-port-label">IN</span>
            </div>
            
            <div class="corner-port-input secondary">
                <div class="patch-port gate-input" data-port-type="gate-in" data-signal="gate"></div>
                <span class="corner-port-label">GATE</span>
            </div>
            
            <div class="corner-port-output">
                <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                <span class="corner-port-label">OUT</span>
            </div>
            
            <div class="module-header">
                <h3 class="module-title">ENV/VCA-1</h3>
            </div>
            
            <div class="module-controls">
                <div class="control-group">
                    <label class="control-label">ATTACK</label>
                    <div class="synth-knob envelope-knob" data-param="attack" data-value="${envelopeData.parameters.attack}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${envelopeData.parameters.attack}s</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">DECAY</label>
                    <div class="synth-knob envelope-knob" data-param="decay" data-value="${envelopeData.parameters.decay}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${envelopeData.parameters.decay}s</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">SUSTAIN</label>
                    <div class="synth-knob envelope-knob" data-param="sustain" data-value="${envelopeData.parameters.sustain}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${envelopeData.parameters.sustain}</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">RELEASE</label>
                    <div class="synth-knob envelope-knob" data-param="release" data-value="${envelopeData.parameters.release}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${envelopeData.parameters.release}s</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render LFO Module
 * Takes the LFO data structure as input and returns the corresponding HTML string
 * Following T.E. aesthetic principles with purple knobs for modulation visual distinction
 * 
 * @param {Object} lfoData - The LFO synth node data structure
 * @returns {string} HTML string for the LFO module
 */
function renderLFOModule(lfoData) {
    return `
        <div class="synth-module" data-module-id="${lfoData.id}">
            <div class="corner-port-output">
                <div class="patch-port cv-output" data-port-type="cv-out" data-signal="cv"></div>
                <span class="corner-port-label">CV</span>
            </div>
            
            <div class="module-header">
                <h3 class="module-title">LFO-1</h3>
            </div>
            
            <div class="module-controls">
                <div class="control-group">
                    <select class="lfo-type-selector" data-param="type">
                        <option value="sine" ${lfoData.parameters.type === 'sine' ? 'selected' : ''}>SINE</option>
                        <option value="square" ${lfoData.parameters.type === 'square' ? 'selected' : ''}>SQUARE</option>
                        <option value="sawtooth" ${lfoData.parameters.type === 'sawtooth' ? 'selected' : ''}>SAW</option>
                        <option value="triangle" ${lfoData.parameters.type === 'triangle' ? 'selected' : ''}>TRI</option>
                    </select>
                    <div class="wave-visual" data-wave-type="${lfoData.parameters.type}"></div>
                </div>
                
                <div class="control-group">
                    <label class="control-label">FREQ</label>
                    <div class="synth-knob lfo-knob" data-param="frequency" data-value="${lfoData.parameters.frequency}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${lfoData.parameters.frequency}Hz</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">MIN</label>
                    <div class="synth-knob lfo-knob" data-param="min" data-value="${lfoData.parameters.min}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${lfoData.parameters.min}Hz</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">MAX</label>
                    <div class="synth-knob lfo-knob" data-param="max" data-value="${lfoData.parameters.max}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${lfoData.parameters.max}Hz</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render Reverb Module
 * Takes the reverb data structure as input and returns the corresponding HTML string
 * Following T.E. aesthetic principles with pink knobs for effects/post-processing visual distinction
 * 
 * @param {Object} reverbData - The reverb synth node data structure
 * @returns {string} HTML string for the reverb module
 */
function renderReverbModule(reverbData) {
    return `
        <div class="synth-module" data-module-id="${reverbData.id}">
            <div class="corner-port-input">
                <div class="patch-port audio-input" data-port-type="audio-in" data-signal="audio"></div>
                <span class="corner-port-label">IN</span>
            </div>
            
            <div class="corner-port-output">
                <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                <span class="corner-port-label">OUT</span>
            </div>
            
            <div class="module-header">
                <h3 class="module-title">REVERB-1</h3>
            </div>
            
            <div class="module-controls">
                <div class="control-group">
                    <label class="control-label">DECAY</label>
                    <div class="synth-knob reverb-knob" data-param="decay" data-value="${reverbData.parameters.decay}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${reverbData.parameters.decay}s</span>
                </div>
                
                <div class="control-group">
                    <label class="control-label">WET</label>
                    <div class="synth-knob reverb-knob" data-param="wet" data-value="${reverbData.parameters.wet}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${reverbData.parameters.wet}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Two-Way Synchronization Bridge
 * Updates the corresponding Tone.js object based on the synth node data structure
 * This ensures the audio engine always reflects the current parameter state
 * 
 * @param {Object} node - The synth node data structure to sync
 */
function syncToneEngine(node) {
    if (node.id === "oscillator-1" && vco1ToneObject) {
        // Update Tone.js oscillator parameters from node data
        vco1ToneObject.frequency.value = node.parameters.frequency;
        vco1ToneObject.type = node.parameters.waveform;
        vco1ToneObject.detune.value = node.parameters.detune;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - freq: ${node.parameters.frequency}Hz, wave: ${node.parameters.waveform}, detune: ${node.parameters.detune}¢`);
    } else if (node.id === "filter-1" && filterToneObject) {
        // Update Tone.js filter parameters from node data
        filterToneObject.frequency.value = node.parameters.frequency;
        filterToneObject.type = node.parameters.type;
        filterToneObject.Q.value = node.parameters.Q;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - freq: ${node.parameters.frequency}Hz, type: ${node.parameters.type}, Q: ${node.parameters.Q}`);
    } else if (node.id === "envelope-1" && envelopeToneObject) {
        // Update Tone.js envelope parameters from node data
        envelopeToneObject.attack = node.parameters.attack;
        envelopeToneObject.decay = node.parameters.decay;
        envelopeToneObject.sustain = node.parameters.sustain;
        envelopeToneObject.release = node.parameters.release;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - attack: ${node.parameters.attack}s, decay: ${node.parameters.decay}s, sustain: ${node.parameters.sustain}, release: ${node.parameters.release}s`);
    } else if (node.id === "lfo-1" && lfoToneObject) {
        // Update Tone.js LFO parameters from node data
        lfoToneObject.frequency.value = node.parameters.frequency;
        lfoToneObject.type = node.parameters.type;
        lfoToneObject.min = node.parameters.min;
        lfoToneObject.max = node.parameters.max;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - freq: ${node.parameters.frequency}Hz, type: ${node.parameters.type}, min: ${node.parameters.min}Hz, max: ${node.parameters.max}Hz`);
    } else if (node.id === "reverb-1" && reverbToneObject) {
        // Update Tone.js Reverb parameters from node data
        reverbToneObject.decay = node.parameters.decay;
        reverbToneObject.wet.value = node.parameters.wet;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - decay: ${node.parameters.decay}s, wet: ${node.parameters.wet}`);
    }
}

/**
 * Initialize All Modules
 * Renders both oscillator and filter modules side by side
 */
function initializeModules() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        const oscillatorHTML = renderOscillatorModule(oscillatorNode);
        const filterHTML = renderFilterModule(filterNode);
        const envelopeHTML = renderEnvelopeModule(envelopeNode);
        const lfoHTML = renderLFOModule(lfoNode);
        const reverbHTML = renderReverbModule(reverbNode);
        
        // Create a module container with flex layout and spacer
        appContainer.innerHTML = `
            <div class="modules-container">
                ${oscillatorHTML}
                ${filterHTML}
                ${envelopeHTML}
                ${lfoHTML}
                ${reverbHTML}
            </div>
            <div class="scroll-spacer"></div>
        `;
        
        // Add keyboard container to body
        const keyboardContainer = document.createElement('div');
        keyboardContainer.className = 'keyboard-container';
        keyboardContainer.innerHTML = `
            <button id="test-note-trigger" class="test-note-button">TEST NOTE</button>
        `;
        document.body.appendChild(keyboardContainer);
        
        console.log('T.E. Grid Synthesis: All modules initialized');
    }
}

/**
 * Initialize Oscillator Module (Legacy - kept for compatibility)
 * Renders the oscillator module and inserts it into the app container
 */
function initializeOscillatorModule() {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        const oscillatorHTML = renderOscillatorModule(oscillatorNode);
        appContainer.innerHTML = oscillatorHTML;
        console.log('T.E. Grid Synthesis: Oscillator module initialized');
    }
}

/**
 * Interactive Knob Functionality
 * Handles mouse drag interaction for virtual knobs
 */
function setupKnobInteraction() {
    const knobs = document.querySelectorAll('.synth-knob');
    
    knobs.forEach(knob => {
        let isDragging = false;
        let startY = 0;
        let startValue = 0;
        const param = knob.dataset.param;
        
        knob.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startValue = parseFloat(knob.dataset.value) || 0;
            
            // Prevent text selection during drag
            e.preventDefault();
            
            // Change cursor style
            knob.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !param) return;
            
            // Calculate value change based on vertical movement
            const deltaY = startY - e.clientY; // Inverted: up = increase
            let newValue = startValue;
            
            if (param === 'frequency') {
                // Frequency range: 20Hz to 20000Hz with logarithmic scaling
                const sensitivity = 2; // Adjust for more/less sensitivity
                const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                newValue = Math.max(20, Math.min(20000, startValue * multiplier));
                newValue = Math.round(newValue * 10) / 10; // Round to 1 decimal
            } else if (param === 'detune') {
                // Detune range: -100¢ to +100¢
                const sensitivity = 1;
                newValue = Math.max(-100, Math.min(100, startValue + (deltaY * sensitivity)));
                newValue = Math.round(newValue);
            } else if (param === 'Q') {
                // Q range: 0.001 to 20 with logarithmic scaling
                const sensitivity = 1.5;
                const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                newValue = Math.max(0.001, Math.min(20, startValue * multiplier));
                newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
            } else if (param === 'attack' || param === 'decay' || param === 'release') {
                // Time parameters: 0.01s to 5s with logarithmic scaling
                const sensitivity = 1.8;
                const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                newValue = Math.max(0.01, Math.min(5, startValue * multiplier));
                newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
            } else if (param === 'sustain') {
                // Sustain level: 0.0 to 1.0 linear scaling
                const sensitivity = 0.01;
                newValue = Math.max(0, Math.min(1, startValue + (deltaY * sensitivity)));
                newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
            } else if (param === 'min' || param === 'max') {
                // LFO min/max frequency range: 20Hz to 20000Hz with logarithmic scaling
                const sensitivity = 2;
                const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                newValue = Math.max(20, Math.min(20000, startValue * multiplier));
                newValue = Math.round(newValue * 10) / 10; // Round to 1 decimal
            } else if (param === 'decay') {
                // Reverb decay time: 0.1s to 10s with logarithmic scaling
                const sensitivity = 1.8;
                const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                newValue = Math.max(0.1, Math.min(10, startValue * multiplier));
                newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
            } else if (param === 'wet') {
                // Reverb wet level: 0.0 to 1.0 linear scaling
                const sensitivity = 0.01;
                newValue = Math.max(0, Math.min(1, startValue + (deltaY * sensitivity)));
                newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
            }
            
            // Determine which node to update based on module
            const moduleElement = knob.closest('.synth-module');
            const moduleId = moduleElement.dataset.moduleId;
            let targetNode;
            
            if (moduleId === 'oscillator-1') {
                targetNode = oscillatorNode;
            } else if (moduleId === 'filter-1') {
                targetNode = filterNode;
            } else if (moduleId === 'envelope-1') {
                targetNode = envelopeNode;
            } else if (moduleId === 'lfo-1') {
                targetNode = lfoNode;
            } else if (moduleId === 'reverb-1') {
                targetNode = reverbNode;
            }
            
            if (targetNode) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Update knob data attribute
                knob.dataset.value = newValue;
                
                // Update visual feedback
                updateKnobVisuals(knob, param, newValue);
                
                // Sync with Tone.js
                syncToneEngine(targetNode);
                
                // Update code display in real-time
                updateCodeDisplay();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                knob.style.cursor = 'pointer';
            }
        });
    });
}

/**
 * Update Knob Visual Feedback
 * Updates the knob indicator rotation and value display
 * 
 * @param {HTMLElement} knob - The knob element
 * @param {string} param - The parameter name
 * @param {number} value - The current value
 */
function updateKnobVisuals(knob, param, value) {
    const indicator = knob.querySelector('.knob-indicator');
    const valueDisplay = knob.parentElement.querySelector('.control-value');
    
    if (indicator && valueDisplay) {
        let rotation = 0;
        let displayText = '';
        
        if (param === 'frequency') {
            // Map frequency (20-20000 Hz) to rotation (-135° to +135°)
            const logMin = Math.log(20);
            const logMax = Math.log(20000);
            const logValue = Math.log(value);
            const normalized = (logValue - logMin) / (logMax - logMin);
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}Hz`;
        } else if (param === 'detune') {
            // Map detune (-100 to +100 ¢) to rotation (-135° to +135°)
            const normalized = (value + 100) / 200; // 0 to 1
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}¢`;
        } else if (param === 'Q') {
            // Map Q (0.001 to 20) to rotation (-135° to +135°) with logarithmic scaling
            const logMin = Math.log(0.001);
            const logMax = Math.log(20);
            const logValue = Math.log(value);
            const normalized = (logValue - logMin) / (logMax - logMin);
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}`;
        } else if (param === 'attack' || param === 'decay' || param === 'release') {
            // Map time parameters (0.01 to 5s) to rotation (-135° to +135°) with logarithmic scaling
            const logMin = Math.log(0.01);
            const logMax = Math.log(5);
            const logValue = Math.log(value);
            const normalized = (logValue - logMin) / (logMax - logMin);
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}s`;
        } else if (param === 'sustain') {
            // Map sustain (0 to 1) to rotation (-135° to +135°) linear scaling
            const normalized = value; // Already 0 to 1
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}`;
        } else if (param === 'min' || param === 'max') {
            // Map LFO min/max frequency (20-20000 Hz) to rotation (-135° to +135°)
            const logMin = Math.log(20);
            const logMax = Math.log(20000);
            const logValue = Math.log(value);
            const normalized = (logValue - logMin) / (logMax - logMin);
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}Hz`;
        } else if (param === 'decay') {
            // Map reverb decay (0.1 to 10s) to rotation (-135° to +135°) with logarithmic scaling
            const logMin = Math.log(0.1);
            const logMax = Math.log(10);
            const logValue = Math.log(value);
            const normalized = (logValue - logMin) / (logMax - logMin);
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}s`;
        } else if (param === 'wet') {
            // Map reverb wet (0 to 1) to rotation (-135° to +135°) linear scaling
            const normalized = value; // Already 0 to 1
            rotation = -135 + (normalized * 270); // -135° to +135°
            displayText = `${value}`;
        }
        
        // Apply rotation to indicator
        indicator.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        // Update value display
        valueDisplay.textContent = displayText;
    }
}

/**
 * Setup Selector Interaction
 * Handles change events for dropdown selectors (waveform, filter type, etc.)
 */
function setupSelectorInteraction() {
    // Waveform selector
    const waveformSelectors = document.querySelectorAll('.waveform-selector');
    waveformSelectors.forEach(selector => {
        selector.addEventListener('change', (e) => {
            const param = selector.dataset.param;
            const newValue = e.target.value;
            
            // Determine which node to update based on module
            const moduleElement = selector.closest('.synth-module');
            const moduleId = moduleElement.dataset.moduleId;
            let targetNode;
            
            if (moduleId === 'oscillator-1') {
                targetNode = oscillatorNode;
            }
            
            if (targetNode && param) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Sync with Tone.js
                syncToneEngine(targetNode);
                
                // Update code display in real-time
                updateCodeDisplay();
                
                console.log(`T.E. Grid Synthesis: Updated ${moduleId} ${param} to ${newValue}`);
            }
        });
    });
    
    // Filter type selector
    const filterTypeSelectors = document.querySelectorAll('.filter-type-selector');
    filterTypeSelectors.forEach(selector => {
        selector.addEventListener('change', (e) => {
            const param = selector.dataset.param;
            const newValue = e.target.value;
            
            // Determine which node to update based on module
            const moduleElement = selector.closest('.synth-module');
            const moduleId = moduleElement.dataset.moduleId;
            let targetNode;
            
            if (moduleId === 'filter-1') {
                targetNode = filterNode;
            }
            
            if (targetNode && param) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Sync with Tone.js
                syncToneEngine(targetNode);
                
                // Update code display in real-time
                updateCodeDisplay();
                
                console.log(`T.E. Grid Synthesis: Updated ${moduleId} ${param} to ${newValue}`);
            }
        });
    });
    
    // LFO type selector
    const lfoTypeSelectors = document.querySelectorAll('.lfo-type-selector');
    lfoTypeSelectors.forEach(selector => {
        selector.addEventListener('change', (e) => {
            const param = selector.dataset.param;
            const newValue = e.target.value;
            
            // Determine which node to update based on module
            const moduleElement = selector.closest('.synth-module');
            const moduleId = moduleElement.dataset.moduleId;
            let targetNode;
            
            if (moduleId === 'lfo-1') {
                targetNode = lfoNode;
            }
            
            if (targetNode && param) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Sync with Tone.js
                syncToneEngine(targetNode);
                
                // Update code display in real-time
                updateCodeDisplay();
                
                console.log(`T.E. Grid Synthesis: Updated ${moduleId} ${param} to ${newValue}`);
            }
        });
    });
}

/**
 * Setup Test Note Trigger
 * Adds event listener for the Test Note button to trigger envelope
 */
function setupTestNoteTrigger() {
    const testNoteButton = document.getElementById('test-note-trigger');
    
    if (testNoteButton) {
        testNoteButton.addEventListener('click', () => {
            if (envelopeToneObject) {
                // Trigger the envelope for 1 second duration
                // Since the VCO is continuously running, we just trigger the envelope
                envelopeToneObject.triggerAttackRelease("1n", Tone.now());
                
                console.log('T.E. Grid Synthesis: Test note triggered');
                
                // Visual feedback - briefly highlight the button
                testNoteButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    testNoteButton.style.transform = '';
                }, 100);
            }
        });
        
        console.log('T.E. Grid Synthesis: Test note trigger setup complete');
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CODE GENERATION SYSTEM - EXPORT CLEAN TONE.JS CODE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Generate Production-Ready JavaScript Code
 * Iterates through synthNodes array and outputs clean Tone.js instantiation and connection code
 * Following the structured three-block approach: Instantiation, Patching, Triggering
 * 
 * @returns {string} Clean, copy-pasteable JavaScript code
 */
function generateCode() {
    let code = `// Generated by T.E. Grid Synthesis
// Clean, production-ready Tone.js code

// Initialize Tone.js context
await Tone.start();

// ═══════════════════════════════════════════════════════════════
// INSTANTIATION BLOCK - Module Declarations
// ═══════════════════════════════════════════════════════════════

`;

    // Generate oscillator declarations
    synthNodes
        .filter(node => node.type === "OmniOscillator")
        .forEach(node => {
            const id = node.id.replace('-', '');
            code += `const ${id} = new Tone.Oscillator({
    type: "${node.parameters.waveform}",
    frequency: ${node.parameters.frequency},
    detune: ${node.parameters.detune}
}).start();

`;
        });

    // Generate filter declarations
    synthNodes
        .filter(node => node.type === "Filter")
        .forEach(node => {
            const id = node.id.replace('-', '');
            code += `const ${id} = new Tone.Filter({
    type: "${node.parameters.type}",
    frequency: ${node.parameters.frequency},
    Q: ${node.parameters.Q}
});

`;
        });

    // Generate envelope declarations
    synthNodes
        .filter(node => node.type === "AmplitudeEnvelope")
        .forEach(node => {
            const id = node.id.replace('-', '');
            code += `const ${id} = new Tone.AmplitudeEnvelope({
    attack: ${node.parameters.attack},
    decay: ${node.parameters.decay},
    sustain: ${node.parameters.sustain},
    release: ${node.parameters.release}
});

`;
        });

    // Generate LFO declarations
    synthNodes
        .filter(node => node.type === "LFO")
        .forEach(node => {
            const id = node.id.replace('-', '');
            code += `const ${id} = new Tone.LFO({
    type: "${node.parameters.type}",
    frequency: ${node.parameters.frequency},
    min: ${node.parameters.min},
    max: ${node.parameters.max}
}).start();

`;
        });

    // Generate reverb declarations
    synthNodes
        .filter(node => node.type === "Reverb")
        .forEach(node => {
            const id = node.id.replace('-', '');
            code += `const ${id} = new Tone.Reverb({
    decay: ${node.parameters.decay},
    wet: ${node.parameters.wet}
});

`;
        });

    code += `// ═══════════════════════════════════════════════════════════════
// PATCHING BLOCK - Signal Routing
// ═══════════════════════════════════════════════════════════════

// Audio Signal Chain: VCO → VCF → ENV → REVERB → Destination
oscillator1.connect(filter1);
filter1.connect(envelope1);
envelope1.connect(reverb1);
reverb1.toDestination();

// Modulation Routing: LFO → VCF Frequency
lfo1.connect(filter1.frequency);

// ═══════════════════════════════════════════════════════════════
// TRIGGERING BLOCK - Play Function
// ═══════════════════════════════════════════════════════════════

const playSynth = (note = "C4", duration = "4n") => {
    // Set oscillator frequency to the desired note
    oscillator1.frequency.setValueAtTime(Tone.Frequency(note).toFrequency(), Tone.now());
    
    // Trigger the envelope to play the note
    envelope1.triggerAttackRelease(duration, Tone.now());
};

// Example usage:
// playSynth("C4", "8n");  // Play C4 for an eighth note
// playSynth("A3", "2n");  // Play A3 for a half note

// Your T.E. Grid synthesizer is ready!
console.log("🎛️ T.E. Grid Synthesis: Synthesizer loaded and ready");
`;

    return code;
}

/**
 * Update Code Display
 * Updates the code display panel with current synthesizer state
 */
function updateCodeDisplay() {
    const codeDisplay = document.getElementById('code-display');
    if (codeDisplay) {
        const code = generateCode();
        codeDisplay.value = code;
    }
}

/**
 * Setup Code Panel Toggle Functionality
 * Implements collapsible code panel with smooth animations
 */
function setupCodePanelToggle() {
    const codePanel = document.getElementById('code-output-panel');
    const toggleTab = document.getElementById('code-toggle-tab');
    
    if (codePanel && toggleTab) {
        toggleTab.addEventListener('click', () => {
            codePanel.classList.toggle('collapsed');
            
            console.log('T.E. Grid Synthesis: Code panel toggled');
        });
    }
}

/**
 * Setup Copy Code Functionality
 * Implements clipboard copy for the generated code
 */
function setupCopyCode() {
    const copyButton = document.getElementById('copy-button');
    const codeDisplay = document.getElementById('code-display');
    
    if (copyButton && codeDisplay) {
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeDisplay.value);
                
                // Visual feedback
                const originalText = copyButton.textContent;
                copyButton.textContent = 'COPIED!';
                copyButton.style.backgroundColor = 'var(--color-te-green)';
                
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '';
                }, 1000);
                
                console.log('T.E. Grid Synthesis: Code copied to clipboard');
            } catch (err) {
                console.error('T.E. Grid Synthesis: Failed to copy code', err);
                
                // Fallback: select all text for manual copy
                codeDisplay.select();
                codeDisplay.setSelectionRange(0, 99999);
            }
        });
    }
}

/**
 * Export Code to Console
 * Utility function to easily copy generated code
 */
function exportCode() {
    const code = generateCode();
    console.log('='.repeat(80));
    console.log('T.E. GRID SYNTHESIS - GENERATED CODE');
    console.log('='.repeat(80));
    console.log(code);
    console.log('='.repeat(80));
    return code;
}

// Initialize the platform when the page loads
document.addEventListener('DOMContentLoaded', setupSynth);
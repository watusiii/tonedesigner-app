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
        
        // Create oscillator module instance using new module factory
        // NOTE: Transition to modular architecture - oscillator now created via ModuleFactory
        oscillatorModuleInstance = ModuleFactory.create('oscillator', oscillatorNode.id, oscillatorNode.parameters);
        vco1ToneObject = oscillatorModuleInstance.toneObject;
        
        // Create filter module instance using new module factory
        // NOTE: Transition to modular architecture - filter now created via ModuleFactory
        filterModuleInstance = ModuleFactory.create('filter', filterNode.id, filterNode.parameters);
        filterToneObject = filterModuleInstance.toneObject;
        
        // Create envelope module instance using new module factory
        // NOTE: Transition to modular architecture - envelope now created via ModuleFactory
        envelopeModuleInstance = ModuleFactory.create('envelope', envelopeNode.id, envelopeNode.parameters);
        envelopeToneObject = envelopeModuleInstance.toneObject;
        
        // Create LFO module instance using new module factory
        // NOTE: Transition to modular architecture - LFO now created via ModuleFactory
        lfoModuleInstance = ModuleFactory.create('lfo', lfoNode.id, lfoNode.parameters);
        lfoToneObject = lfoModuleInstance.toneObject;
        
        // Create reverb module instance using new module factory
        // NOTE: Transition to modular architecture - reverb now created via ModuleFactory
        reverbModuleInstance = ModuleFactory.create('reverb', reverbNode.id, reverbNode.parameters);
        reverbToneObject = reverbModuleInstance.toneObject;
        
        // DYNAMIC PATCHING LOGIC - Use the new compilation system
        compilePatching();
        
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
        
        // Setup multiplier functionality
        setupMultiplierInteraction();
        
        // Setup virtual keyboard
        setupVirtualKeyboard();
        
        // Setup code panel toggle functionality
        setupCodePanelToggle();
        
        // Setup code copy functionality
        setupCopyCode();
        
        // Initial code display update
        updateCodeDisplay();
        
        // Initialize P5 Canvas Manager
        initializeP5Manager();
        
        // Initialize PatchingController AFTER DOM is fully ready
        setTimeout(() => {
            const svgElement = document.getElementById('patch-svg');
            const ports = document.querySelectorAll('.patch-port');
            
            console.log(`🔌 Found ${ports.length} ports in DOM`);
            
            if (svgElement && ports.length > 0) {
                window.patchingController = new PatchingController(
                    currentPatchConnections,
                    compilePatching,
                    getPortCoordinates,
                    svgElement
                );
                window.patchingController.initializeListeners();
                
                // Draw initial cables to show existing connections
                drawPatchCables();
                
                console.log('🔌 PatchingController initialized successfully');
            } else {
                console.error('🔌 Could not find patch-svg element or ports');
                console.error('SVG element:', svgElement);
                console.error('Ports found:', ports.length);
            }
        }, 100); // Small delay to ensure DOM is ready
        
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
 * Global oscillator module instance (NEW MODULAR SYSTEM)
 * This stores the complete module created by the ModuleFactory
 */
let oscillatorModuleInstance;

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
 * Global filter module instance (NEW MODULAR SYSTEM)
 * This stores the complete module created by the ModuleFactory
 */
let filterModuleInstance;

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
// Make envelope node globally accessible for ADSR visualization
window.envelopeNode = {
    id: "envelope-1",
    type: "AmplitudeEnvelope",
    parameters: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 1.0
    }
};

// Local reference for backward compatibility
const envelopeNode = window.envelopeNode;

/**
 * Global Tone.js envelope instance
 * This is the actual audio engine object that corresponds to the envelopeNode
 */
let envelopeToneObject;

/**
 * Global envelope module instance (NEW MODULAR SYSTEM)
 * This stores the complete module created by the ModuleFactory
 */
let envelopeModuleInstance;

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
        max: 5000,         // Maximum filter frequency
        multiplier: 1      // Frequency multiplier (1x or 10x)
    }
};

/**
 * Global Tone.js LFO instance
 * This is the actual audio engine object that corresponds to the lfoNode
 */
let lfoToneObject;

/**
 * Global LFO module instance (NEW MODULAR SYSTEM)
 * This stores the complete module created by the ModuleFactory
 */
let lfoModuleInstance;

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
// Make reverb node globally accessible for visualization
window.reverbNode = {
    id: "reverb-1",
    type: "Reverb",
    parameters: {
        decay: 1.5,        // Length of reverb tail in seconds
        wet: 0.5           // Mix level (0 = dry, 1 = wet)
    }
};

// Local reference for backward compatibility
const reverbNode = window.reverbNode;

/**
 * Global Tone.js Reverb instance
 * This is the actual audio engine object that corresponds to the reverbNode
 */
let reverbToneObject;

/**
 * Global reverb module instance (NEW MODULAR SYSTEM)
 * This stores the complete module created by the ModuleFactory
 */
let reverbModuleInstance;

/**
 * Global Synth Nodes Array - For tracking all modules
 * Used for code generation and module management
 */
let synthNodes = [];

/**
 * ═══════════════════════════════════════════════════════════════════════════════
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * P5 WAVE VISUALIZER SYSTEM - MODULAR CANVAS MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * P5 Canvas Manager - Handles creation and management of P5.js instances
 * This class provides a modular approach to creating wave visualizers
 */
class P5CanvasManager {
    constructor() {
        this.canvases = new Map();
    }
    
    /**
     * Create a new P5 canvas for wave visualization
     * @param {string} containerId - The ID of the container element
     * @param {string} waveType - The type of wave to visualize
     * @param {Object} options - Configuration options
     */
    createWaveCanvas(containerId, waveType, options = {}) {
        const container = document.getElementById(containerId) || document.querySelector(`[data-wave-type="${waveType}"]`);
        if (!container) {
            console.error(`P5 Canvas Manager: Container not found for ${containerId}`);
            return null;
        }
        
        // Default options
        const config = {
            amplitude: options.amplitude || 50,
            frequency: options.frequency || 1,
            strokeWeight: options.strokeWeight || 2,
            strokeColor: options.strokeColor || '#000000',
            backgroundColor: options.backgroundColor || '#ffffff',
            containerId: containerId, // Pass container ID for module detection
            ...options
        };
        
        // Create a mutable reference for the wave type that can be updated
        const waveTypeRef = { current: waveType };
        
        const sketch = (p) => {
            let canvasWidth, canvasHeight;
            
            p.setup = () => {
                // Get container dimensions
                const rect = container.getBoundingClientRect();
                canvasWidth = rect.width;
                canvasHeight = rect.height;
                
                // Create canvas and attach to container
                const canvas = p.createCanvas(canvasWidth, canvasHeight);
                canvas.parent(container);
                
                // Clear any existing content
                container.innerHTML = '';
                container.appendChild(canvas.canvas);
            };
            
            p.draw = () => {
                p.background(config.backgroundColor);
                p.stroke(config.strokeColor);
                p.strokeWeight(config.strokeWeight);
                p.noFill();
                
                // Use the current wave type from the mutable reference
                this.drawWaveform(p, waveTypeRef.current, canvasWidth, canvasHeight, config);
            };
            
            // Handle window resize
            p.windowResized = () => {
                const rect = container.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    canvasWidth = rect.width;
                    canvasHeight = rect.height;
                    p.resizeCanvas(canvasWidth, canvasHeight);
                }
            };
        };
        
        const p5Instance = new p5(sketch);
        this.canvases.set(containerId, {
            instance: p5Instance,
            waveType: waveType,
            waveTypeRef: waveTypeRef,
            config: config
        });
        
        return p5Instance;
    }
    
    /**
     * Draw pixel matrix waveform display (16x16 for most, 32x32 for ADSR)
     * @param {Object} p - P5.js instance
     * @param {string} waveType - Type of wave to draw
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} config - Configuration options
     */
    drawWaveform(p, waveType, width, height, config) {
        // Use pixel matrix style for ALL modules
        this.drawPixelMatrixWaveform(p, waveType, width, height, config);
    }
    
    /**
     * Check if canvas belongs to LFO module by container ID
     * @param {string} containerId - Container ID of the canvas
     * @returns {boolean} - True if this canvas is in an LFO module
     */
    isLFOModule(containerId) {
        if (!containerId) return false;
        
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        const module = container.closest('.synth-module');
        return module && module.dataset.moduleId && module.dataset.moduleId.includes('lfo');
    }
    
    /**
     * LFO: Pixel line rendering for LFO modules only
     * @param {Object} p - P5.js instance
     * @param {string} waveType - Type of wave to draw
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} config - Configuration options
     */
    drawPixelLineWaveform(p, waveType, width, height, config) {
        console.log(`drawPixelLineWaveform CALLED for waveType: ${waveType}, container: ${config.containerId}`);
        
        // Inverted color scheme: black background, white pixels
        p.background(0); // Black background
        p.fill(255); // White pixels
        p.noStroke(); // No stroke for pixel dots
        
        const centerY = height / 2;
        const amplitude = height * 0.35; // Use 70% of height for wave amplitude
        const resolution = width * 2; // Higher resolution for smooth line
        const pixelSize = 4; // Bigger pixel dots (2x size)
        const pixelSpacing = 1; // Solid line - no gaps between pixels
        
        // LFO waveform rendering using pixel dots
        for (let i = 0; i < resolution; i += pixelSpacing) {
            const x = p.map(i, 0, resolution, 0, width);
            let waveValue = 0;
            
            // Get actual LFO frequency with multiplier
            let lfoFrequency = 1; // Default fallback
            let multiplier = 1; // Default multiplier
            if (lfoNode && lfoNode.parameters) {
                lfoFrequency = parseFloat(lfoNode.parameters.frequency) || 1;
                multiplier = parseFloat(lfoNode.parameters.multiplier) || 1;
            }
            
            // Apply multiplier and calculate cycles
            const effectiveFreq = lfoFrequency * multiplier;
            const cyclesToShow = effectiveFreq * 2;
            
            const t = p.map(i, 0, resolution, 0, p.TWO_PI * cyclesToShow);
            
            switch (waveType) {
                case 'sine':
                    waveValue = Math.sin(t);
                    break;
                case 'square':
                    waveValue = Math.sin(t) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    waveValue = 2 * (t % p.TWO_PI) / p.TWO_PI - 1;
                    break;
                case 'triangle':
                    const phase = t % p.TWO_PI;
                    if (phase < p.PI) {
                        waveValue = 2 * phase / p.PI - 1;
                    } else {
                        waveValue = 3 - 2 * phase / p.PI;
                    }
                    break;
                default:
                    waveValue = Math.sin(t); // Default to sine
            }
            
            // Calculate Y position for this pixel
            const y = centerY - (waveValue * amplitude);
            
            // Draw pixel dot at this position
            p.rect(x - pixelSize/2, y - pixelSize/2, pixelSize, pixelSize);
        }
        
        // Optional: Add a subtle center line using pixel dots
        p.fill(80); // Dark gray pixels for center line
        for (let x = 0; x < width; x += pixelSpacing * 2) {
            p.rect(x - 0.5, centerY - 0.5, 1, 1);
        }
        
    }
    
    /**
     * ORIGINAL: Pixel matrix rendering for non-LFO modules
     * @param {Object} p - P5.js instance
     * @param {string} waveType - Type of wave to draw
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} config - Configuration options
     */
    drawPixelMatrixWaveform(p, waveType, width, height, config) {
        // Use 32x32 for ADSR, 16x16 for all other wave types
        const gridSize = waveType === 'adsr' ? 32 : 16;
        const pixelWidth = width / gridSize;
        const pixelHeight = height / gridSize;
        const centerRow = Math.floor(gridSize / 2);
        
        // Clear background
        p.background(255); // White background
        
        // Create a 2D array to track which pixels should be lit
        const pixelMap = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
        
        // Calculate waveform points and draw lines between them
        const wavePoints = [];
        for (let col = 0; col < gridSize; col++) {
            // Check if this is LFO and get actual frequency
            let cycles = 2; // Default 2 cycles
            const container = document.getElementById(config.containerId);
            const module = container?.closest('.synth-module');
            const isLFO = module && module.dataset.moduleId && module.dataset.moduleId.includes('lfo');
            
            if (isLFO && lfoNode && lfoNode.parameters) {
                const lfoFreq = parseFloat(lfoNode.parameters.frequency) || 1;
                cycles = lfoFreq * 2; // Convert frequency to cycles
            }
            
            const t = p.map(col, 0, gridSize - 1, 0, p.TWO_PI * cycles); // Use calculated cycles
            let waveValue = 0;
            
            switch (waveType) {
                case 'sine':
                    waveValue = Math.sin(t + (isLFO ? 0 : p.frameCount * 0.05));
                    break;
                case 'square':
                    waveValue = Math.sin(t + (isLFO ? 0 : p.frameCount * 0.05)) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    waveValue = 2 * ((t + (isLFO ? 0 : p.frameCount * 0.05)) % p.TWO_PI) / p.TWO_PI - 1;
                    break;
                case 'triangle':
                    const phase = (t + (isLFO ? 0 : p.frameCount * 0.05)) % p.TWO_PI;
                    if (phase < p.PI) {
                        waveValue = 2 * phase / p.PI - 1;
                    } else {
                        waveValue = 3 - 2 * phase / p.PI;
                    }
                    break;
                case 'adsr':
                    // ADSR envelope visualization - reflects actual knob values
                    waveValue = this.calculateADSRValue(col, gridSize);
                    break;
                case 'reverb':
                    // Reverb visualization - static impulse response display
                    waveValue = this.calculateReverbStatic(col, gridSize);
                    break;
                case 'lowpass':
                case 'highpass':
                case 'bandpass':
                case 'notch':
                    // Filter frequency response visualization
                    waveValue = this.calculateFilterResponse(col, gridSize, waveType);
                    break;
                default:
                    waveValue = 0;
            }
            
            // Convert wave value to row position
            const waveRow = Math.round(centerRow - (waveValue * (gridSize / 4))); // Scale to fit grid
            wavePoints.push({ col, row: Math.max(0, Math.min(gridSize - 1, waveRow)) });
        }
        
        // Draw lines between consecutive points to fill gaps
        for (let i = 0; i < wavePoints.length - 1; i++) {
            const point1 = wavePoints[i];
            const point2 = wavePoints[i + 1];
            
            // Light up the line between these two points
            this.drawPixelLine(pixelMap, point1.col, point1.row, point2.col, point2.row, gridSize);
        }
        
        // Render the pixel grid
        for (let pixelCol = 0; pixelCol < gridSize; pixelCol++) {
            for (let pixelRow = 0; pixelRow < gridSize; pixelRow++) {
                const x = pixelCol * pixelWidth;
                const y = pixelRow * pixelHeight;
                
                const isLit = pixelMap[pixelRow][pixelCol];
                
                // Draw pixel
                p.fill(isLit ? 0 : 248); // Black when lit, slightly gray when off
                p.stroke(200); // Light gray grid lines
                p.strokeWeight(0.5);
                p.rect(x, y, pixelWidth, pixelHeight);
            }
        }
        
    }
    
    /**
     * Draw a line between two pixel points using Bresenham's algorithm
     * @param {Array} pixelMap - 2D array representing the pixel grid
     * @param {number} x0 - Starting column
     * @param {number} y0 - Starting row
     * @param {number} x1 - Ending column
     * @param {number} y1 - Ending row
     * @param {number} gridSize - Size of the grid
     */
    drawPixelLine(pixelMap, x0, y0, x1, y1, gridSize) {
        // Bresenham's line algorithm for pixel-perfect line drawing
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        
        let x = x0;
        let y = y0;
        
        while (true) {
            // Light up current pixel if it's within bounds
            if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                pixelMap[y][x] = true;
            }
            
            // Check if we've reached the end point
            if (x === x1 && y === y1) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }
    
    /**
     * Calculate ADSR envelope value based on actual parameter settings
     * @param {number} col - Current column (0 to gridSize-1)
     * @param {number} gridSize - Size of the pixel grid
     * @returns {number} - Wave value (-1 to 1)
     */
    calculateADSRValue(col, gridSize) {
        // Get actual ADSR parameters from the envelope node
        let attack = 0.1, decay = 0.3, sustain = 0.7, release = 0.4;
        
        // Get real values from the envelope node
        if (window.envelopeNode && window.envelopeNode.parameters) {
            attack = parseFloat(window.envelopeNode.parameters.attack) || 0.1;
            decay = parseFloat(window.envelopeNode.parameters.decay) || 0.3;
            sustain = parseFloat(window.envelopeNode.parameters.sustain) || 0.7;
            release = parseFloat(window.envelopeNode.parameters.release) || 0.4;
        }
        
        // Normalize parameters for visual representation
        const totalTime = attack + decay + release + 1.0; // +1 for sustain display time
        const attackTime = attack / totalTime;
        const decayTime = decay / totalTime;
        const sustainTime = 1.0 / totalTime; // Fixed time for sustain display
        const releaseTime = release / totalTime;
        
        // Calculate cumulative phase boundaries
        const attackEnd = attackTime;
        const decayEnd = attackEnd + decayTime;
        const sustainEnd = decayEnd + sustainTime;
        const releaseEnd = sustainEnd + releaseTime;
        
        // Normalize column position to 0-1 range
        const progress = col / (gridSize - 1);
        
        // Scale progress to fit within the total envelope time
        const scaledProgress = progress * releaseEnd;
        
        let waveValue = -1; // Start at bottom (silence)
        
        if (scaledProgress <= attackEnd) {
            // Attack phase - exponential rise from 0 to 1
            const attackProgress = scaledProgress / attackEnd;
            waveValue = -1 + 2 * Math.pow(attackProgress, 0.7); // Exponential curve
        } else if (scaledProgress <= decayEnd) {
            // Decay phase - exponential fall from 1 to sustain level
            const decayProgress = (scaledProgress - attackEnd) / decayTime;
            const sustainLevel = sustain * 2 - 1; // Convert 0-1 to -1 to 1
            waveValue = 1 + (sustainLevel - 1) * Math.pow(decayProgress, 2);
        } else if (scaledProgress <= sustainEnd) {
            // Sustain phase - hold sustain level
            waveValue = sustain * 2 - 1; // Convert 0-1 to -1 to 1
        } else if (scaledProgress <= releaseEnd) {
            // Release phase - exponential fall from sustain to 0
            const releaseProgress = (scaledProgress - sustainEnd) / releaseTime;
            const sustainLevel = sustain * 2 - 1;
            waveValue = sustainLevel + (-1 - sustainLevel) * Math.pow(releaseProgress, 2);
        }
        
        return Math.max(-1, Math.min(1, waveValue)); // Clamp to -1 to 1 range
    }
    
    /**
     * Calculate static reverb decay visualization
     * @param {number} col - Current column (0 to gridSize-1)
     * @param {number} gridSize - Size of the pixel grid
     * @returns {number} - Wave value (-1 to 1)
     */
    calculateReverbStatic(col, gridSize) {
        // Get actual reverb parameters from the reverb node
        let decay = 1.5, wet = 0.5;
        
        // Get real values from the reverb node
        if (window.reverbNode && window.reverbNode.parameters) {
            decay = parseFloat(window.reverbNode.parameters.decay) || 1.5;
            wet = parseFloat(window.reverbNode.parameters.wet) || 0.5;
        }
        
        // Simple exponential decay from left to right
        const progress = col / (gridSize - 1); // 0 to 1 across the display
        
        // Create exponential decay curve
        // Map decay parameter (0.1 to 10 seconds) to decay rate
        const decayRate = 1.0 / Math.max(decay, 0.1); // Higher decay = slower rate
        const amplitude = Math.pow(Math.E, -progress * decayRate * 5) * wet;
        
        // Convert to -1 to 1 range
        const waveValue = amplitude * 2 - 1;
        
        return Math.max(-1, Math.min(1, waveValue));
    }
    
    
    /**
     * Calculate filter frequency response visualization
     * @param {number} col - Current column (0 to gridSize-1)
     * @param {number} gridSize - Size of the pixel grid
     * @param {string} filterType - Type of filter (lowpass, highpass, bandpass, notch)
     * @returns {number} - Wave value (-1 to 1)
     */
    calculateFilterResponse(col, gridSize, filterType) {
        // Get actual filter parameters
        let frequency = 8000, Q = 1, type = 'lowpass';
        
        // Get real values from the filter node
        const filterNodes = [window.filterNode, filterNode].filter(Boolean);
        if (filterNodes.length > 0) {
            const node = filterNodes[0];
            if (node && node.parameters) {
                frequency = parseFloat(node.parameters.frequency) || 8000;
                Q = parseFloat(node.parameters.Q) || 1;
                type = node.parameters.type || 'lowpass';
            }
        }
        
        // Map column to frequency range (20Hz to 20kHz, logarithmic)
        const progress = col / (gridSize - 1);
        const minFreq = 20;
        const maxFreq = 20000;
        const currentFreq = minFreq * Math.pow(maxFreq / minFreq, progress);
        
        // Calculate filter response at this frequency
        let response = 0;
        const cutoffRatio = currentFreq / frequency;
        
        switch (type) {
            case 'lowpass':
                // Low-pass filter response (6dB/octave rolloff)
                if (cutoffRatio <= 1) {
                    response = 1 / Math.sqrt(1 + Math.pow(cutoffRatio * Q, 2));
                } else {
                    response = 1 / Math.sqrt(1 + Math.pow(cutoffRatio / Q, 2));
                }
                break;
                
            case 'highpass':
                // High-pass filter response (6dB/octave rolloff)
                if (cutoffRatio >= 1) {
                    response = 1 / Math.sqrt(1 + Math.pow(Q / cutoffRatio, 2));
                } else {
                    response = 1 / Math.sqrt(1 + Math.pow(1 / (cutoffRatio * Q), 2));
                }
                break;
                
            case 'bandpass':
                // Band-pass filter response (peak at cutoff frequency)
                const distance = Math.abs(Math.log2(cutoffRatio));
                response = 1 / Math.sqrt(1 + Math.pow(distance * Q * 2, 2));
                break;
                
            case 'notch':
                // Notch filter response (minimum at cutoff frequency)
                const notchDistance = Math.abs(Math.log2(cutoffRatio));
                response = Math.sqrt(Math.pow(notchDistance * Q, 2) / (1 + Math.pow(notchDistance * Q, 2)));
                break;
        }
        
        // Convert response (0 to 1) to wave value (-1 to 1)
        // Map 0 response to bottom, 1 response to top
        const waveValue = response * 2 - 1;
        
        return Math.max(-1, Math.min(1, waveValue));
    }
    
    /**
     * Update waveform configuration
     * @param {string} containerId - Container ID
     * @param {Object} newConfig - New configuration options
     */
    updateWaveConfig(containerId, newConfig) {
        const canvas = this.canvases.get(containerId);
        if (canvas) {
            Object.assign(canvas.config, newConfig);
        }
    }
    
    /**
     * Update waveform type
     * @param {string} containerId - Container ID
     * @param {string} newWaveType - New wave type
     */
    updateWaveType(containerId, newWaveType) {
        const canvas = this.canvases.get(containerId);
        if (canvas) {
            canvas.waveType = newWaveType;
            // Update the mutable reference so the draw loop sees the change
            if (canvas.waveTypeRef) {
                canvas.waveTypeRef.current = newWaveType;
            }
            console.log(`P5 Canvas Manager: Updated wave type to ${newWaveType} for ${containerId}`);
        }
    }
    
    /**
     * Remove a canvas instance
     * @param {string} containerId - Container ID
     */
    removeCanvas(containerId) {
        const canvas = this.canvases.get(containerId);
        if (canvas && canvas.instance) {
            canvas.instance.remove();
            this.canvases.delete(containerId);
        }
    }
    
    /**
     * Clean up all canvases
     */
    cleanup() {
        this.canvases.forEach((canvas) => {
            if (canvas.instance) {
                canvas.instance.remove();
            }
        });
        this.canvases.clear();
    }
}

/**
 * Global P5 Canvas Manager Instance
 */
let p5Manager;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PATCH CABLE VISUALIZATION SYSTEM - SVG SIGNAL FLOW
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Dynamic Patch Connections - Single source of truth for all active connections
 * Used by both the audio engine (compilePatching) and visual system (PatchCableManager)
 */
const currentPatchConnections = [
    // Audio signal chain: VCO → VCF → ENV → REVERB → Destination
    { source: 'oscillator-1/audio_out', target: 'filter-1/audio_in', type: 'audio' },
    { source: 'filter-1/audio_out', target: 'envelope-1/audio_in', type: 'audio' },
    { source: 'envelope-1/audio_out', target: 'reverb-1/audio_in', type: 'audio' },
    { source: 'reverb-1/audio_out', target: 'destination', type: 'audio' },
    // CV modulation: LFO → VCF Frequency Parameter
    { source: 'lfo-1/cv_out', target: 'filter-1/frequency', type: 'cv' }
];

// Legacy patchConnections array removed - now using currentPatchConnections with dynamic conversion

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DYNAMIC PATCHING COMPILER
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Dynamic Patching Compiler - Replaces hardcoded connection logic
 * Reads currentPatchConnections array and creates/recreates all Tone.js connections
 */
function compilePatching() {
    console.log('🔌 Compiling patch connections...');
    
    // STEP 1: Disconnect ALL Tone.js objects to prevent ghost connections
    disconnectAllModules();
    
    // STEP 2: Parse and apply each connection from currentPatchConnections
    currentPatchConnections.forEach((connection, index) => {
        try {
            applyConnection(connection);
            console.log(`✅ Applied connection ${index + 1}: ${connection.source} → ${connection.target}`);
        } catch (error) {
            console.error(`❌ Failed to apply connection: ${connection.source} → ${connection.target}`, error);
        }
    });
    
    console.log(`🔌 Patch compilation complete: ${currentPatchConnections.length} connections applied`);
    
    // STEP 3: Update visual cable representation
    drawPatchCables();
}

/**
 * Disconnect all Tone.js module objects
 * Critical first step to ensure clean slate before reconnecting
 */
function disconnectAllModules() {
    console.log('🔌 Disconnecting all modules...');
    
    // Disconnect all module instances created by ModuleFactory
    if (oscillatorModuleInstance?.toneObject) {
        oscillatorModuleInstance.toneObject.disconnect();
    }
    if (filterModuleInstance?.toneObject) {
        filterModuleInstance.toneObject.disconnect();
    }
    if (envelopeModuleInstance?.toneObject) {
        envelopeModuleInstance.toneObject.disconnect();
    }
    if (lfoModuleInstance?.toneObject) {
        lfoModuleInstance.toneObject.disconnect();
    }
    if (reverbModuleInstance?.toneObject) {
        reverbModuleInstance.toneObject.disconnect();
    }
    
    // Also disconnect legacy global objects for safety
    if (vco1ToneObject) vco1ToneObject.disconnect();
    if (filterToneObject) filterToneObject.disconnect();
    if (envelopeToneObject) envelopeToneObject.disconnect();
    if (lfoToneObject) lfoToneObject.disconnect();
    if (reverbToneObject) reverbToneObject.disconnect();
    
    console.log('🔌 All modules disconnected');
}

/**
 * Apply a single connection from currentPatchConnections format
 * @param {Object} connection - Connection object with source, target, type
 */
function applyConnection(connection) {
    const { source, target, type } = connection;
    
    // Parse source and target
    const [sourceModuleId, sourcePort] = source.split('/');
    const [targetModuleId, targetPort] = target.split('/');
    
    // Get source Tone.js object
    const sourceObject = getToneObjectById(sourceModuleId);
    if (!sourceObject) {
        throw new Error(`Source module not found: ${sourceModuleId}`);
    }
    
    // Handle different connection types
    if (type === 'audio') {
        if (target === 'destination') {
            // Final connection to destination
            sourceObject.toDestination();
        } else {
            // Standard audio connection
            const targetObject = getToneObjectById(targetModuleId);
            if (!targetObject) {
                throw new Error(`Target module not found: ${targetModuleId}`);
            }
            sourceObject.connect(targetObject);
        }
    } else if (type === 'cv') {
        // CV connection to specific parameter
        const targetObject = getToneObjectById(targetModuleId);
        if (!targetObject) {
            throw new Error(`Target module not found: ${targetModuleId}`);
        }
        
        // Connect to specific parameter (e.g., filter.frequency)
        if (targetPort && targetObject[targetPort]) {
            sourceObject.connect(targetObject[targetPort]);
        } else {
            throw new Error(`Target parameter not found: ${targetModuleId}.${targetPort}`);
        }
    } else {
        throw new Error(`Unknown connection type: ${type}`);
    }
}

/**
 * Get Tone.js object by module ID
 * @param {string} moduleId - Module identifier (e.g., 'oscillator-1', 'filter-1')
 * @returns {Object} Tone.js object or null
 */
function getToneObjectById(moduleId) {
    switch (moduleId) {
        case 'oscillator-1':
            return vco1ToneObject || oscillatorModuleInstance?.toneObject;
        case 'filter-1':
            return filterToneObject || filterModuleInstance?.toneObject;
        case 'envelope-1':
            return envelopeToneObject || envelopeModuleInstance?.toneObject;
        case 'lfo-1':
            return lfoToneObject || lfoModuleInstance?.toneObject;
        case 'reverb-1':
            return reverbToneObject || reverbModuleInstance?.toneObject;
        default:
            console.warn(`Unknown module ID: ${moduleId}`);
            return null;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS FOR PATCHING SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * These functions support both old and new patching systems during transition
 */

/**
 * Get port information from DOM element
 * @param {Element} port - Port DOM element
 * @returns {Object} Port information
 */
function getPortInfo(port) {
    const portType = port.getAttribute('data-port-type');
    const signal = port.getAttribute('data-signal');
    const module = port.closest('.synth-module');
    const moduleId = module?.getAttribute('data-module-id');
    
    // Parse port type (e.g., 'audio-out', 'cv-in')
    const [signalType, direction] = portType.split('-');
    const portName = direction === 'out' ? `${signalType}_out` : `${signalType}_in`;
    
    return {
        moduleId,
        portName,
        signalType,
        direction,
        element: port
    };
}

/**
 * Get absolute coordinates of a port
 * @param {Element} port - Port DOM element
 * @returns {Object} Coordinates {x, y}
 */
function getPortCoordinates(port) {
    const rect = port.getBoundingClientRect();
    const svgRect = document.getElementById('patch-svg')?.getBoundingClientRect();
    
    return {
        x: rect.left + rect.width/2 - (svgRect?.left || 0),
        y: rect.top + rect.height/2 - (svgRect?.top || 0)
    };
}


/**
 * Create a new connection
 * @param {string} source - Source port ID
 * @param {string} target - Target port ID
 * @param {string} type - Connection type ('audio' or 'cv')
 */
function createConnection(source, target, type) {
    console.log(`🔌 Creating connection: ${source} → ${target} (${type})`);
    
    // Add to currentPatchConnections
    currentPatchConnections.push({
        source,
        target,
        type
    });
    
    // Recompile patching
    compilePatching();
}

/**
 * Remove a patch connection
 * @param {string} source - Source port identifier
 * @param {string} target - Target port identifier
 */
function removePatchConnection(source, target) {
    console.log(`🗑️ Removing connection: ${source} → ${target}`);
    
    // Remove from currentPatchConnections
    const index = currentPatchConnections.findIndex(conn => 
        conn.source === source && conn.target === target
    );
    
    if (index !== -1) {
        currentPatchConnections.splice(index, 1);
        console.log('🗑️ Connection removed from data structure');
        
        // Recompile patching
        compilePatching();
    } else {
        console.warn('🗑️ Connection not found in data structure');
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CABLE VISUALIZATION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Draw all patch cables based on currentPatchConnections
 * This function works with the new PatchingController system
 */
function drawPatchCables() {
    const svg = document.getElementById('patch-svg');
    if (!svg) {
        console.warn('🔌 No SVG container found for drawing cables');
        return;
    }
    
    // Clear existing cables
    svg.innerHTML = '';
    
    // Draw each connection
    currentPatchConnections.forEach((connection, index) => {
        try {
            const cable = createCablePath(connection, index);
            if (cable) {
                svg.appendChild(cable);
            }
        } catch (error) {
            console.warn(`🔌 Failed to draw cable ${connection.source} → ${connection.target}:`, error);
        }
    });
    
    // Refresh click listeners for cable removal
    if (window.patchingController) {
        window.patchingController.refreshCableListeners();
    }
    
    console.log(`🔌 Drew ${svg.children.length} of ${currentPatchConnections.length} patch cables`);
}

/**
 * Create a single cable path SVG element
 * @param {Object} connection - Connection object {source, target, type}
 * @param {number} index - Cable index for unique identification
 * @returns {SVGElement|null} - Cable path element
 */
function createCablePath(connection, index) {
    const { source, target, type } = connection;
    
    // Find source and target ports
    const sourcePort = findPortByID(source);
    const targetPort = findPortByID(target);
    
    if (!sourcePort || !targetPort) {
        // For CV connections to parameters, draw cable to CV input port instead
        if (type === 'cv' && target.includes('/frequency')) {
            const [moduleId] = target.split('/');
            const cvTargetPort = findPortByID(`${moduleId}/cv_in`);
            if (cvTargetPort && sourcePort) {
                console.log(`🔌 Drawing CV cable to cv-in port instead of parameter: ${source} → ${moduleId}/cv_in`);
                return createCablePathBetweenPorts(sourcePort, cvTargetPort, type, index, `${source} → ${target}`);
            }
        }
        console.warn(`🔌 Could not find ports for connection: ${source} → ${target}`);
        return null;
    }
    
    // Get coordinates
    const sourceCoords = getPortCoordinates(sourcePort);
    const targetCoords = getPortCoordinates(targetPort);
    
    // Create cable path element
    const cable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Generate curved cable path
    const pathData = generateCablePath(sourceCoords, targetCoords);
    cable.setAttribute('d', pathData);
    
    // Style the cable
    cable.setAttribute('class', 'patch-cable');
    cable.setAttribute('data-signal', type);
    cable.setAttribute('data-cable', `cable-${index}`);
    cable.setAttribute('data-connection', `${source} → ${target}`);
    cable.style.pointerEvents = 'auto'; // Enable click for removal
    
    // Set color based on signal type - use CSS custom properties to preserve hover effects
    const color = getCableColor(type);
    cable.style.stroke = color;
    cable.style.fill = 'none';
    cable.style.cursor = 'pointer';
    
    // Don't set strokeWidth inline - let CSS handle it for hover effects
    
    return cable;
}

/**
 * Create cable path between two specific ports
 */
function createCablePathBetweenPorts(sourcePort, targetPort, type, index, originalConnection) {
    const sourceCoords = getPortCoordinates(sourcePort);
    const targetCoords = getPortCoordinates(targetPort);
    
    const cable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = generateCablePath(sourceCoords, targetCoords);
    cable.setAttribute('d', pathData);
    
    cable.setAttribute('class', 'patch-cable');
    cable.setAttribute('data-signal', type);
    cable.setAttribute('data-cable', `cable-${index}`);
    cable.setAttribute('data-connection', originalConnection);
    cable.style.pointerEvents = 'auto';
    
    const color = getCableColor(type);
    cable.style.stroke = color;
    cable.style.fill = 'none';
    cable.style.cursor = 'pointer';
    
    return cable;
}

/**
 * Generate SVG path data for a curved cable
 * @param {Object} start - Start coordinates {x, y}
 * @param {Object} end - End coordinates {x, y}
 * @returns {string} - SVG path data
 */
function generateCablePath(start, end) {
    const dx = Math.abs(end.x - start.x);
    const controlOffset = Math.min(dx * 0.6, 150); // More pronounced curve for longer cables
    
    return `
        M ${start.x} ${start.y}
        C ${start.x + controlOffset} ${start.y}
          ${end.x - controlOffset} ${end.y}
          ${end.x} ${end.y}
    `.trim();
}

/**
 * Get cable color based on signal type
 * @param {string} signalType - Signal type (audio, cv, gate)
 * @returns {string} - CSS color value
 */
function getCableColor(signalType) {
    const colors = {
        'audio': '#ffcc00',    // TE Yellow
        'cv': '#8866ff',       // TE Purple
        'gate': '#0066ff'      // TE Blue
    };
    
    return colors[signalType] || colors.audio;
}

/**
 * Find a port element by its ID (module-id/port-type format)
 * @param {string} portId - Port ID in format "module-id/port-type"
 * @returns {HTMLElement|null} - Port element
 */
function findPortByID(portId) {
    const [moduleId, portType] = portId.split('/');
    
    // Handle special case for destination
    if (portId === 'destination') {
        console.log('🔌 Destination connection - no visual cable needed');
        return null;
    }
    
    // Find the module
    const module = document.querySelector(`[data-module-id="${moduleId}"]`);
    if (!module) {
        console.warn(`🔌 Module not found: ${moduleId}`);
        return null;
    }
    
    // Convert underscore format to dash format for HTML attributes
    // audio_out -> audio-out, cv_out -> cv-out, etc.
    const htmlPortType = portType.replace('_', '-');
    
    // Find the port within the module
    const port = module.querySelector(`[data-port-type="${htmlPortType}"]`);
    if (!port) {
        console.warn(`🔌 Port not found in module ${moduleId}: ${htmlPortType}`);
        // Debug: show available ports
        const availablePorts = module.querySelectorAll('[data-port-type]');
        const availableTypes = Array.from(availablePorts).map(p => p.getAttribute('data-port-type'));
        console.log(`🔌 Available ports in ${moduleId}:`, availableTypes);
    }
    
    return port;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * P5.JS CANVAS MANAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 */


/**
 * Initialize P5 Canvas Manager and create wave visualizers
 * Sets up responsive P5.js canvases for all wave visual elements
 */
function initializeP5Manager() {
    // Create new P5 canvas manager
    p5Manager = new P5CanvasManager();
    
    // Wait for DOM to be fully rendered before creating canvases
    setTimeout(() => {
        // Find all wave visual elements and create P5 canvases
        const waveVisuals = document.querySelectorAll('.wave-visual');
        
        waveVisuals.forEach((visual, index) => {
            const waveType = visual.dataset.waveType;
            const containerId = `wave-visual-${index}`;
            
            // Set an ID for the container if it doesn't have one
            if (!visual.id) {
                visual.id = containerId;
            }
            
            // Create P5 canvas for all wave types including reverb ripples
            
            // Create P5 canvas for other wave visuals
            if (waveType && visual.id) {
                p5Manager.createWaveCanvas(visual.id, waveType, {
                    amplitude: 45, // Slightly smaller than container
                    frequency: 2.5, // Multiple cycles visible
                    strokeWeight: 1.5,
                    strokeColor: '#000000',
                    backgroundColor: '#ffffff'
                });
                
                console.log(`T.E. Grid Synthesis: Created P5 canvas for ${waveType} wave (${visual.id})`);
            } else {
                console.warn(`T.E. Grid Synthesis: Could not create canvas - waveType: ${waveType}, visual.id: ${visual.id}`);
            }
        });
        
        console.log('T.E. Grid Synthesis: P5 Canvas Manager initialized with wave visualizers');
    }, 100); // Small delay to ensure DOM is ready
}


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
                    <select class="filter-type-selector" data-param="type">
                        <option value="lowpass" ${filterData.parameters.type === 'lowpass' ? 'selected' : ''}>LPF</option>
                        <option value="highpass" ${filterData.parameters.type === 'highpass' ? 'selected' : ''}>HPF</option>
                        <option value="bandpass" ${filterData.parameters.type === 'bandpass' ? 'selected' : ''}>BPF</option>
                        <option value="notch" ${filterData.parameters.type === 'notch' ? 'selected' : ''}>NOTCH</option>
                    </select>
                    <div class="wave-visual" data-wave-type="${filterData.parameters.type}"></div>
                </div>
                
                <div class="control-group">
                    <div class="corner-port-input secondary">
                        <div class="patch-port cv-input" data-port-type="cv-in" data-signal="cv"></div>
                        <span class="corner-port-label">CV</span>
                    </div>
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
            
            <div class="module-controls envelope-controls">
                <div class="envelope-canvas-section">
                    <div class="wave-visual" data-wave-type="adsr"></div>
                </div>
                
                <div class="envelope-knobs-section">
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
                    <div class="corner-port-output">
                        <div class="patch-port cv-output" data-port-type="cv-out" data-signal="cv"></div>
                        <span class="corner-port-label">CV</span>
                    </div>
                    <div class="corner-port-input">
                        <div class="multiplier-selector" data-param="multiplier">
                            <div class="multiplier-option ${lfoData.parameters.multiplier === 1 ? 'active' : ''}" data-value="1">1X</div>
                            <div class="multiplier-option ${lfoData.parameters.multiplier === 10 ? 'active' : ''}" data-value="10">10X</div>
                        </div>
                    </div>
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
                <div class="control-group reverb-canvas-group">
                    <div class="wave-visual" data-wave-type="reverb"></div>
                </div>
                
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
        const multiplier = node.parameters.multiplier || 1;
        const effectiveFreq = node.parameters.frequency * multiplier;
        
        lfoToneObject.frequency.value = effectiveFreq;
        lfoToneObject.type = node.parameters.type;
        lfoToneObject.min = node.parameters.min;
        lfoToneObject.max = node.parameters.max;
        
        console.log(`T.E. Grid Synthesis: Synced ${node.id} - freq: ${effectiveFreq}Hz (${node.parameters.frequency}Hz x ${multiplier}), type: ${node.parameters.type}, min: ${node.parameters.min}Hz, max: ${node.parameters.max}Hz`);
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
        // Use the oscillator module created in setupSynth
        const oscillatorHTML = oscillatorModuleInstance ? oscillatorModuleInstance.element : renderOscillatorModule(oscillatorNode);
        // Use the filter module created in setupSynth
        const filterHTML = filterModuleInstance ? filterModuleInstance.element : renderFilterModule(filterNode);
        // Use the envelope module created in setupSynth
        const envelopeHTML = envelopeModuleInstance ? envelopeModuleInstance.element : renderEnvelopeModule(envelopeNode);
        // Use the LFO module created in setupSynth
        const lfoHTML = lfoModuleInstance ? lfoModuleInstance.element : renderLFOModule(lfoNode);
        // Use the reverb module created in setupSynth
        const reverbHTML = reverbModuleInstance ? reverbModuleInstance.element : renderReverbModule(reverbNode);
        
        // Create a module container with flex layout, SVG overlay, and spacer
        appContainer.innerHTML = `
            <div class="modules-container" style="position: relative;">
                ${oscillatorHTML}
                ${filterHTML}
                ${envelopeHTML}
                ${lfoHTML}
                ${reverbHTML}
                <svg id="patch-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Patch cables will be drawn here by PatchingController -->
                </svg>
            </div>
            <div class="scroll-spacer"></div>
        `;
        
        // Add keyboard container to body
        const keyboardContainer = document.createElement('div');
        keyboardContainer.className = 'keyboard-container';
        keyboardContainer.innerHTML = `
            <div class="virtual-keyboard">
                <div class="key white-key" data-note="C3"></div>
                <div class="key white-key" data-note="D3"></div>
                <div class="key white-key" data-note="E3"></div>
                <div class="key white-key" data-note="F3"></div>
                <div class="key white-key" data-note="G3"></div>
                <div class="key white-key" data-note="A3"></div>
                <div class="key white-key" data-note="B3"></div>
                <div class="key white-key" data-note="C4"></div>
                
                <!-- Black keys positioned with right edge at white key boundaries -->
                <div class="key black-key" data-note="C#3" style="left: 8.5%;"></div>
                <div class="key black-key" data-note="D#3" style="left: 21%;"></div>
                <div class="key black-key" data-note="F#3" style="left: 46%;"></div>
                <div class="key black-key" data-note="G#3" style="left: 58.5%;"></div>
                <div class="key black-key" data-note="A#3" style="left: 71%;"></div>
            </div>
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
        
        // Touch events for mobile
        knob.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            startValue = parseFloat(knob.dataset.value) || 0;
            
            // Prevent scrolling and text selection
            e.preventDefault();
            
            knob.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !param) return;
            
            // Calculate value change based on vertical movement
            const deltaY = startY - e.clientY; // Inverted: up = increase
            let newValue = startValue;
            
            if (param === 'frequency') {
                // Check if this is an LFO frequency
                const moduleElement = knob.closest('.synth-module');
                const moduleId = moduleElement.dataset.moduleId;
                
                if (moduleId === 'lfo-1') {
                    // LFO frequency range: 1Hz to 20Hz with logarithmic scaling
                    const sensitivity = 1.5;
                    const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                    newValue = Math.max(1, Math.min(20, startValue * multiplier));
                    newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
                } else {
                    // VCO frequency range: 20Hz to 20000Hz with logarithmic scaling
                    const sensitivity = 2;
                    const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                    newValue = Math.max(20, Math.min(20000, startValue * multiplier));
                    newValue = Math.round(newValue * 10) / 10; // Round to 1 decimal
                }
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
                
                // Update ADSR visual if this is an envelope parameter
                if (moduleId === 'envelope-1' && p5Manager) {
                    const adsrCanvas = document.querySelector('[data-wave-type="adsr"]');
                    if (adsrCanvas && adsrCanvas.id) {
                        // The P5 canvas will automatically use the updated envelopeNode.parameters
                        // on the next frame since calculateADSRValue() reads from window.envelopeNode
                        console.log(`T.E. Grid Synthesis: ADSR visual will update for ${param} = ${newValue}`);
                    }
                }
                
                // Update reverb visual if this is a reverb parameter
                if (moduleId === 'reverb-1' && p5Manager) {
                    const reverbCanvas = document.querySelector('[data-wave-type="reverb"]');
                    if (reverbCanvas && reverbCanvas.id) {
                        // The P5 canvas will automatically use the updated reverbNode.parameters
                        // on the next frame since calculateReverbStatic() reads from window.reverbNode
                        console.log(`T.E. Grid Synthesis: Reverb visual will update for ${param} = ${newValue}`);
                    }
                }
                
                // Update LFO visual if this is an LFO parameter
                if (moduleId === 'lfo-1' && p5Manager) {
                    const lfoCanvas = document.querySelector('[data-module-id="lfo-1"] .wave-visual');
                    if (lfoCanvas && lfoCanvas.id) {
                        // The P5 canvas should automatically use the updated lfoNode.parameters
                        // on the next frame since drawSmoothWaveform() reads from window.lfoNode
                        console.log(`T.E. Grid Synthesis: LFO visual will update for ${param} = ${newValue}`);
                    }
                }
                
                // Update code display in real-time
                updateCodeDisplay();
            }
        });
        
        // Touch move event for mobile
        document.addEventListener('touchmove', (e) => {
            if (!isDragging || !param) return;
            
            // Calculate value change based on vertical movement
            const deltaY = startY - e.touches[0].clientY; // Inverted: up = increase
            let newValue = startValue;
            
            if (param === 'frequency') {
                // Check if this is an LFO frequency
                const moduleElement = knob.closest('.synth-module');
                const moduleId = moduleElement.dataset.moduleId;
                
                if (moduleId === 'lfo-1') {
                    // LFO frequency range: 1Hz to 20Hz with logarithmic scaling
                    const sensitivity = 1.5;
                    const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                    newValue = Math.max(1, Math.min(20, startValue * multiplier));
                    newValue = Math.round(newValue * 100) / 100; // Round to 2 decimals
                } else {
                    // VCO frequency range: 20Hz to 20000Hz with logarithmic scaling
                    const sensitivity = 2;
                    const multiplier = Math.pow(2, deltaY / (100 / sensitivity));
                    newValue = Math.max(20, Math.min(20000, startValue * multiplier));
                    newValue = Math.round(newValue * 10) / 10; // Round to 1 decimal
                }
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
                
                // Update ADSR visual if this is an envelope parameter
                if (moduleId === 'envelope-1' && p5Manager) {
                    const adsrCanvas = document.querySelector('[data-wave-type="adsr"]');
                    if (adsrCanvas && adsrCanvas.id) {
                        console.log(`T.E. Grid Synthesis: ADSR visual will update for ${param} = ${newValue}`);
                    }
                }
                
                // Update reverb visual if this is a reverb parameter
                if (moduleId === 'reverb-1' && p5Manager) {
                    const reverbCanvas = document.querySelector('[data-wave-type="reverb"]');
                    if (reverbCanvas && reverbCanvas.id) {
                        console.log(`T.E. Grid Synthesis: Reverb visual will update for ${param} = ${newValue}`);
                    }
                }
                
                // Update code display in real-time
                updateCodeDisplay();
            }
        }, { passive: false });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                knob.style.cursor = 'pointer';
            }
        });
        
        // Touch end event for mobile
        document.addEventListener('touchend', () => {
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
            // Check if this is an LFO frequency
            const moduleElement = knob.closest('.synth-module');
            const moduleId = moduleElement?.dataset.moduleId;
            
            if (moduleId === 'lfo-1') {
                // Map LFO frequency (1-20 Hz) to rotation (-135° to +135°)
                const logMin = Math.log(1);
                const logMax = Math.log(20);
                const logValue = Math.log(value);
                const normalized = (logValue - logMin) / (logMax - logMin);
                rotation = -135 + (normalized * 270); // -135° to +135°
                displayText = `${value}Hz`;
            } else {
                // Map VCO frequency (20-20000 Hz) to rotation (-135° to +135°)
                const logMin = Math.log(20);
                const logMax = Math.log(20000);
                const logValue = Math.log(value);
                const normalized = (logValue - logMin) / (logMax - logMin);
                rotation = -135 + (normalized * 270); // -135° to +135°
                displayText = `${value}Hz`;
            }
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
    // Waveform selector (includes both oscillator and LFO selectors)
    const waveformSelectors = document.querySelectorAll('.waveform-selector, .lfo-type-selector');
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
            } else if (moduleId === 'lfo-1') {
                targetNode = lfoNode;
            }
            
            if (targetNode && param) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Sync with Tone.js
                syncToneEngine(targetNode);
                
                // Update P5 wave visual if it exists (for both waveform and type parameters)
                if (p5Manager && (param === 'waveform' || param === 'type')) {
                    const waveVisual = moduleElement.querySelector('.wave-visual');
                    if (waveVisual && waveVisual.id) {
                        // Update wave visual data attribute
                        waveVisual.dataset.waveType = newValue;
                        
                        // Update P5 canvas wave type
                        p5Manager.updateWaveType(waveVisual.id, newValue);
                        
                        console.log(`T.E. Grid Synthesis: Updated P5 wave visual to ${newValue} (param: ${param})`);
                    }
                }
                
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
                
                // Update P5 wave visual if it exists (for LFO type changes)
                if (p5Manager && param === 'type') {
                    const waveVisual = moduleElement.querySelector('.wave-visual');
                    if (waveVisual && waveVisual.id) {
                        // Update wave visual data attribute
                        waveVisual.dataset.waveType = newValue;
                        
                        // Update P5 canvas wave type
                        p5Manager.updateWaveType(waveVisual.id, newValue);
                        
                        console.log(`T.E. Grid Synthesis: Updated LFO P5 wave visual to ${newValue}`);
                    }
                }
                
                // Update code display in real-time
                updateCodeDisplay();
                
                console.log(`T.E. Grid Synthesis: Updated ${moduleId} ${param} to ${newValue}`);
            }
        });
    });
}

/**
 * Setup Multiplier Interaction
 * Adds event listeners for LFO multiplier selector
 */
function setupMultiplierInteraction() {
    // LFO multiplier selector
    const multiplierOptions = document.querySelectorAll('.multiplier-option');
    multiplierOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selector = option.closest('.multiplier-selector');
            const param = selector.dataset.param;
            const newValue = parseInt(option.dataset.value);
            
            // Determine which node to update based on module
            const moduleElement = option.closest('.synth-module');
            const moduleId = moduleElement.dataset.moduleId;
            let targetNode;
            
            if (moduleId === 'lfo-1') {
                targetNode = lfoNode;
            }
            
            if (targetNode && param) {
                // Update data structure
                targetNode.parameters[param] = newValue;
                
                // Sync with Tone.js (this will apply the multiplier to the actual LFO frequency)
                syncToneEngine(targetNode);
                
                // Update visual active state
                selector.querySelectorAll('.multiplier-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update code display in real-time
                updateCodeDisplay();
                
                console.log(`T.E. Grid Synthesis: Updated ${moduleId} ${param} to ${newValue}X`);
            }
        });
    });
}

/**
 * Play Key Function
 * Triggers a note with the synthesizer
 * 
 * @param {string} note - The musical note to play (e.g., "C3", "F#3")
 */
function playKey(note) {
    if (vco1ToneObject && envelopeToneObject) {
        // Get base frequency from VCO knob setting
        const baseFrequency = oscillatorNode.parameters.frequency;
        
        // Convert note to frequency and calculate ratio
        const noteFrequency = Tone.Frequency(note).toFrequency();
        const C4Frequency = Tone.Frequency("C4").toFrequency(); // Reference frequency (261.63 Hz)
        const ratio = noteFrequency / C4Frequency;
        
        // Apply the note ratio to the base frequency from the knob
        const finalFrequency = baseFrequency * ratio;
        
        // Set the oscillator frequency
        vco1ToneObject.frequency.setValueAtTime(finalFrequency, Tone.now());
        
        // Trigger the envelope with a short duration
        envelopeToneObject.triggerAttackRelease("8n", Tone.now());
        
        console.log(`T.E. Grid Synthesis: Playing note ${note} at ${finalFrequency.toFixed(2)}Hz (base: ${baseFrequency}Hz)`);
    }
}

/**
 * Setup Virtual Keyboard
 * Adds event listeners for all keyboard keys
 */
function setupVirtualKeyboard() {
    const keys = document.querySelectorAll('.key[data-note]');
    
    keys.forEach(key => {
        const note = key.dataset.note;
        
        if (note) {
            // Mouse events
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                key.classList.add('pressed');
                playKey(note);
            });
            
            key.addEventListener('mouseup', () => {
                key.classList.remove('pressed');
            });
            
            key.addEventListener('mouseleave', () => {
                key.classList.remove('pressed');
            });
            
            // Touch events for mobile
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                key.classList.add('pressed');
                playKey(note);
            });
            
            key.addEventListener('touchend', (e) => {
                e.preventDefault();
                key.classList.remove('pressed');
            });
        }
    });
    
    console.log('T.E. Grid Synthesis: Virtual keyboard setup complete');
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
    let code = `await Tone.start();

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
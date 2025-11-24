/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * T.E. GRID SYNTHESIS - MODULAR SYNTHESIZER LIBRARY
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * 
 * This file contains all synthesizer module definitions and the factory system
 * for creating modules dynamically. Each module follows the Synth Node Pattern:
 * 
 * Visual Module � Synth Node Object � Tone.js Object
 * 
 * ARCHITECTURE:
 * - ModuleFactory: Central factory for creating modules
 * - ModuleRegistry: Stores module definitions
 * - Each module definition includes: nodeConfig, renderFunction, toneFactory
 * 
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * MODULE FACTORY SYSTEM
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

/**
 * Central registry for all module definitions
 */
const ModuleRegistry = {};

/**
 * Module Factory - Creates instances of synthesizer modules
 */
class ModuleFactory {
    /**
     * Register a new module type
     * @param {string} type - Module type identifier (e.g., 'oscillator')
     * @param {Object} definition - Module definition with nodeConfig, renderFunction, toneFactory
     */
    static register(type, definition) {
        ModuleRegistry[type] = definition;
        console.log(`T.E. Grid: Registered module type "${type}"`);
    }
    
    /**
     * Create a new module instance
     * @param {string} type - Module type to create
     * @param {string} id - Unique identifier for this instance
     * @param {Object} customParams - Optional parameter overrides
     * @returns {Object} Module instance with node, toneObject, and element
     */
    static create(type, id, customParams = {}) {
        const definition = ModuleRegistry[type];
        if (!definition) {
            throw new Error(`Unknown module type: ${type}`);
        }
        
        // Create node with custom parameters
        const node = {
            id: id,
            type: definition.nodeConfig.type,
            parameters: { ...definition.nodeConfig.parameters, ...customParams }
        };
        
        // Create Tone.js object
        const toneObject = definition.toneFactory(node.parameters);
        
        // Create visual element
        const element = definition.renderFunction(node);
        
        console.log(`T.E. Grid: Created ${type} module with id "${id}"`);
        
        return {
            node,
            toneObject,
            element,
            type
        };
    }
    
    /**
     * Get list of available module types
     * @returns {Array} List of registered module types
     */
    static getAvailableTypes() {
        return Object.keys(ModuleRegistry);
    }
}

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * OSCILLATOR MODULE DEFINITION
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

/**
 * Oscillator Module - VCO (Voltage Controlled Oscillator)
 * Generates raw sound waveforms (Sine, Square, Sawtooth, Triangle)
 */
const OscillatorModule = {
    nodeConfig: {
        type: "OmniOscillator",
        parameters: {
            waveform: "sine",
            frequency: 440,
            detune: 0
        }
    },
    
    toneFactory: (params) => {
        return new Tone.Oscillator({
            frequency: params.frequency,
            type: params.waveform,
            detune: params.detune
        });
    },
    
    renderFunction: (oscillatorData) => {
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
};

// Register the oscillator module
ModuleFactory.register('oscillator', OscillatorModule);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FILTER MODULE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Filter Module - VCF (Voltage Controlled Filter)
 * Shapes timbre with lowpass/highpass/bandpass/notch filtering
 */
const FilterModule = {
    nodeConfig: {
        type: "Filter",
        parameters: {
            type: "lowpass",
            frequency: 8000,
            Q: 1
        }
    },
    
    toneFactory: (params) => {
        return new Tone.Filter({
            frequency: params.frequency,
            type: params.type,
            Q: params.Q
        });
    },
    
    renderFunction: (filterData) => {
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
};

// Register the filter module
ModuleFactory.register('filter', FilterModule);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ENVELOPE MODULE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Envelope Module - ENV/VCA (Envelope Generator / Voltage Controlled Amplifier)
 * ADSR envelope for controlling amplitude over time
 */
const EnvelopeModule = {
    nodeConfig: {
        type: "AmplitudeEnvelope",
        parameters: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 1.0
        }
    },
    
    toneFactory: (params) => {
        return new Tone.AmplitudeEnvelope({
            attack: params.attack,
            decay: params.decay,
            sustain: params.sustain,
            release: params.release
        });
    },
    
    renderFunction: (envelopeData) => {
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
};

// Register the envelope module
ModuleFactory.register('envelope', EnvelopeModule);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LFO MODULE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * LFO Module - Low Frequency Oscillator
 * Generates control voltage for modulating other parameters
 */
const LFOModule = {
    nodeConfig: {
        type: "LFO",
        parameters: {
            frequency: 1,      // Speed of modulation in Hz
            type: "sine",      // Waveform of control signal
            min: 200,          // Minimum filter frequency
            max: 5000,         // Maximum filter frequency
            multiplier: 1      // Frequency multiplier (1x or 10x)
        }
    },
    
    toneFactory: (params) => {
        return new Tone.LFO({
            frequency: params.frequency,
            type: params.type,
            min: params.min,
            max: params.max
        });
    },
    
    renderFunction: (lfoData) => {
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
};

// Register the LFO module
ModuleFactory.register('lfo', LFOModule);

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REVERB MODULE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Reverb Module - Post-processing reverb effect
 * Adds spatial depth and ambiance to the audio signal
 */
const ReverbModule = {
    nodeConfig: {
        type: "Reverb",
        parameters: {
            decay: 1.5,        // Length of reverb tail in seconds
            wet: 0.5           // Mix level (0 = dry, 1 = wet)
        }
    },
    
    toneFactory: (params) => {
        return new Tone.Reverb({
            decay: params.decay,
            wet: params.wet
        });
    },
    
    renderFunction: (reverbData) => {
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
};

// Register the reverb module
ModuleFactory.register('reverb', ReverbModule);

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * GLOBAL EXPORTS FOR BACKWARD COMPATIBILITY
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

// Make the factory available globally
window.ModuleFactory = ModuleFactory;
window.ModuleRegistry = ModuleRegistry;
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
 * ═══════════════════════════════════════════════════════════════════════════════
 * EQ8 MODULE DEFINITION - 8-BAND EQUALIZER
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * EQ8 Module - 8-band parametric equalizer with spectrum visualization
 * Ableton-style layout with frequency bands and visual feedback
 */
const EQ8Module = {
    nodeConfig: {
        type: "EQ8",
        parameters: {
            band1Gain: 0,     // 60Hz
            band2Gain: 0,     // 170Hz  
            band3Gain: 0,     // 350Hz
            band4Gain: 0,     // 1kHz
            band5Gain: 0,     // 2.8kHz
            band6Gain: 0,     // 7kHz
            band7Gain: 0,     // 10kHz
            band8Gain: 0,     // 15kHz
            masterGain: 1.0
        }
    },
    
    toneFactory: (params) => {
        console.log('🎛️ EQ8 toneFactory called with params:', params);
        
        // Calculate EQ band values from our 8 visual bands
        // Map 8 bands to 3 EQ3 bands: Low (bands 1-3), Mid (bands 4-5), High (bands 6-8)
        const lowGains = [params.band1Gain || 0, params.band2Gain || 0, params.band3Gain || 0];
        const midGains = [params.band4Gain || 0, params.band5Gain || 0];
        const highGains = [params.band6Gain || 0, params.band7Gain || 0, params.band8Gain || 0];
        
        // Average the band gains for each EQ3 section
        const lowGain = lowGains.reduce((a, b) => a + b, 0) / lowGains.length;
        const midGain = midGains.reduce((a, b) => a + b, 0) / midGains.length;
        const highGain = highGains.reduce((a, b) => a + b, 0) / highGains.length;
        
        // Create Tone.EQ3 - this is the proper way to do EQ!
        const eq3 = new Tone.EQ3({
            low: lowGain,    // dB gain for low frequencies
            mid: midGain,    // dB gain for mid frequencies  
            high: highGain   // dB gain for high frequencies
        });
        
        // Create master gain stage
        const masterGain = new Tone.Gain(params.masterGain || 1.0);
        eq3.connect(masterGain);
        
        // Create spectrum analyzer for visualization
        const analyzer = new Tone.FFT(128);
        masterGain.connect(analyzer);
        
        // Store band mapping for sync updates
        const frequencies = [60, 170, 350, 1000, 2800, 7000, 10000, 15000];
        const eqBands = [];
        for (let i = 0; i < 8; i++) {
            const bandGain = params[`band${i+1}Gain`] || 0;
            eqBands.push({
                frequency: frequencies[i],
                gainDb: bandGain,
                // Map to which EQ3 band this visual band affects
                eqSection: i < 3 ? 'low' : i < 5 ? 'mid' : 'high'
            });
        }
        
        // Attach components to master for easy access
        masterGain.eq3 = eq3;
        masterGain.eqBands = eqBands; // For UI sync
        masterGain.analyzer = analyzer;
        masterGain.inputNode = eq3; // Input connects to EQ3
        
        console.log('🎛️ EQ8 created with Tone.EQ3:', {
            low: lowGain + 'dB',
            mid: midGain + 'dB', 
            high: highGain + 'dB'
        });
        
        return masterGain;
    },
    
    renderFunction: (eqData) => {
        // Generate 8 EQ band controls in 4x2 grid
        let bandControls = '';
        const frequencies = ['60Hz', '170Hz', '350Hz', '1kHz', '2.8kHz', '7kHz', '10kHz', '15kHz'];
        
        for (let i = 1; i <= 8; i++) {
            bandControls += `
                <div class="control-group">
                    <label class="control-label">${frequencies[i-1]}</label>
                    <div class="synth-knob eq-knob" data-param="band${i}Gain" data-value="${eqData.parameters[`band${i}Gain`]}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${eqData.parameters[`band${i}Gain`].toFixed(2)}</span>
                </div>
            `;
        }
        
        return `
            <div class="synth-module eq8-module" data-module-id="${eqData.id}">
                <div class="corner-port-input">
                    <div class="patch-port audio-input" data-port-type="audio-in" data-signal="audio"></div>
                    <span class="corner-port-label">IN</span>
                </div>
                <div class="corner-port-output">
                    <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                    <span class="corner-port-label">EQ</span>
                </div>
                
                <div class="module-header">
                    <div class="module-title">EQ8</div>
                </div>
                
                <div class="module-controls eq8-controls">
                    ${bandControls}
                    <div class="eq8-visual-container">
                        <div class="wave-visual eq8-spectrum" id="eq8-visual-${eqData.id}" data-wave-type="eq8">EQ RESPONSE</div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">MASTER</label>
                        <div class="synth-knob eq-knob" data-param="masterGain" data-value="${eqData.parameters.masterGain}">
                            <div class="knob-indicator"></div>
                        </div>
                        <span class="control-value">${eqData.parameters.masterGain.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIXER MODULE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Mixer Module - 8-Channel Audio Mixer
 * Sums multiple audio inputs with individual level controls
 */
const MixerModule = {
    nodeConfig: {
        type: "Mixer",
        parameters: {
            channel1Gain: 0.7,
            channel2Gain: 0.7,
            channel3Gain: 0.7,
            channel4Gain: 0.7,
            channel5Gain: 0.7,
            channel6Gain: 0.7,
            channel7Gain: 0.7,
            channel8Gain: 0.7,
            masterGain: 0.8
        }
    },
    
    toneFactory: (params) => {
        const master = new Tone.Channel({
            volume: Tone.gainToDb(params.masterGain),
            pan: 0
        });
        
        // Create 8 individual input gain nodes
        const inputGains = [];
        for (let i = 1; i <= 8; i++) {
            const inputGain = new Tone.Gain(params[`channel${i}Gain`]);
            inputGain.connect(master);
            inputGains.push(inputGain);
        }
        
        // Create FFT analyzer for frequency visualization
        const analyzer = new Tone.FFT(32); // 32 frequency bins
        
        // Connect analyzer directly to Tone.Destination to capture all output
        Tone.Destination.connect(analyzer);
        
        // Attach components to master for easy access
        master.inputGains = inputGains;
        master.analyzer = analyzer;
        
        return master;
    },
    
    renderFunction: (mixerData) => {
        // Generate 8 channel strips in 4x2 grid
        let channelStrips = '';
        for (let i = 1; i <= 8; i++) {
            channelStrips += `
                <div class="control-group">
                    <div class="patch-port audio-input" data-port-type="input" data-signal="audio" data-input-id="${i}"></div>
                    <label class="control-label">CH${i}</label>
                    <div class="synth-knob mixer-knob" data-param="channel${i}Gain" data-value="${mixerData.parameters[`channel${i}Gain`]}">
                        <div class="knob-indicator"></div>
                    </div>
                    <span class="control-value">${Math.round(mixerData.parameters[`channel${i}Gain`] * 100)}%</span>
                </div>
            `;
        }
        
        return `
            <div class="synth-module mixer-module" data-module-id="${mixerData.id}">
                <div class="corner-port-output">
                    <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                    <span class="corner-port-label">MIX</span>
                </div>
                
                <div class="module-header">
                    <h3 class="module-title">MIXER-1</h3>
                </div>
                
                <div class="module-controls mixer-controls">
                    ${channelStrips}
                    <div class="mixer-visual-container">
                        <div class="wave-visual" data-wave-type="mixer"></div>
                    </div>
                    <div class="control-group">
                        <label class="control-label">MASTER</label>
                        <div class="synth-knob mixer-knob" data-param="masterGain" data-value="${mixerData.parameters.masterGain}">
                            <div class="knob-indicator"></div>
                        </div>
                        <span class="control-value">${Math.round(mixerData.parameters.masterGain * 100)}%</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// Register the EQ8 module
ModuleFactory.register('eq8', EQ8Module);

// Register the mixer module
ModuleFactory.register('mixer', MixerModule);

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * CODE GENERATOR REGISTRY SYSTEM
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

/**
 * Central registry for module code generators
 * Each module type can register a function that generates Tone.js code
 */
const CodeGeneratorRegistry = {};

/**
 * Code Generator Factory - Creates Tone.js code for modules
 */
class CodeGeneratorFactory {
    /**
     * Register a code generator for a module type
     * @param {string} type - Module type identifier (matches ModuleRegistry)
     * @param {Function} generator - Function that takes a node and returns Tone.js code
     */
    static register(type, generator) {
        CodeGeneratorRegistry[type] = generator;
        console.log(`T.E. Grid: Registered code generator for "${type}"`);
    }
    
    /**
     * Generate code for a specific module
     * @param {Object} node - Module node with id, type, parameters
     * @returns {string} Tone.js instantiation code
     */
    static generateModuleCode(node) {
        const generator = CodeGeneratorRegistry[node.type];
        if (!generator) {
            console.warn(`No code generator found for module type: ${node.type}`);
            return `// Unknown module type: ${node.type}\n`;
        }
        return generator(node);
    }
    
    /**
     * Get list of available code generators
     * @returns {Array} List of registered generator types
     */
    static getAvailableGenerators() {
        return Object.keys(CodeGeneratorRegistry);
    }
}

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * MODULE CODE GENERATORS
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

/**
 * Oscillator Code Generator
 */
function generateOscillatorCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.Oscillator({
    type: "${node.parameters.waveform}",
    frequency: ${node.parameters.frequency},
    detune: ${node.parameters.detune}
}).start();

`;
}

/**
 * Filter Code Generator
 */
function generateFilterCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.Filter({
    type: "${node.parameters.type}",
    frequency: ${node.parameters.frequency},
    Q: ${node.parameters.Q}
});

`;
}

/**
 * Envelope Code Generator
 */
function generateEnvelopeCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.AmplitudeEnvelope({
    attack: ${node.parameters.attack},
    decay: ${node.parameters.decay},
    sustain: ${node.parameters.sustain},
    release: ${node.parameters.release}
});

`;
}

/**
 * LFO Code Generator
 */
function generateLFOCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.LFO({
    type: "${node.parameters.type}",
    frequency: ${node.parameters.frequency},
    min: ${node.parameters.min},
    max: ${node.parameters.max}
}).start();

`;
}

/**
 * Reverb Code Generator
 */
function generateReverbCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.Reverb({
    decay: ${node.parameters.decay},
    wet: ${node.parameters.wet}
});

`;
}

/**
 * EQ8 Code Generator
 */
function generateEQ8Code(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.EQ3({
    low: ${node.parameters.low},
    mid: ${node.parameters.mid},
    high: ${node.parameters.high}
});

`;
}

/**
 * Mixer Code Generator
 */
function generateMixerCode(node) {
    const id = node.id.replace('-', '');
    return `const ${id} = new Tone.Channel({
    volume: ${node.parameters.volume}
});

`;
}

// Register all code generators
CodeGeneratorFactory.register('OmniOscillator', generateOscillatorCode);
CodeGeneratorFactory.register('Filter', generateFilterCode);
CodeGeneratorFactory.register('AmplitudeEnvelope', generateEnvelopeCode);
CodeGeneratorFactory.register('LFO', generateLFOCode);
CodeGeneratorFactory.register('Reverb', generateReverbCode);
CodeGeneratorFactory.register('EQ3', generateEQ8Code);
CodeGeneratorFactory.register('Channel', generateMixerCode);
CodeGeneratorFactory.register('Mixer', generateMixerCode); // Add missing Mixer type

/**
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 * GLOBAL EXPORTS FOR BACKWARD COMPATIBILITY
 * PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
 */

// Make the factories available globally
window.ModuleFactory = ModuleFactory;
window.ModuleRegistry = ModuleRegistry;
window.CodeGeneratorFactory = CodeGeneratorFactory;
window.CodeGeneratorRegistry = CodeGeneratorRegistry;
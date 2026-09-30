# TONEDESIGNER

**A Modular Synthesizer Platform for Web Audio**

ToneDesigner is a visual, modular synthesizer platform that creates production-ready Tone.js code. Built with minimalist design principles inspired by Teenage Engineering and Nothing aesthetics, it provides an intuitive interface for building complex audio synthesizer patches.

> A visual modular synthesizer that exports production-ready Tone.js code.
> Built by [Watusi](https://watusi.cloud) · [Case study](https://watusi.cloud/tonedesigner) · laervin.lightray@gmail.com

## ✨ Core Features

- **Visual Modular Synthesis**: Drag-and-drop interface for building synthesizer patches
- **Real-time Audio Processing**: Powered by Tone.js for professional-quality audio
- **Code Generation**: Exports clean, production-ready JavaScript code
- **Professional UX**: Cable patching system matching hardware modular synthesizer conventions
- **Minimalist Design**: Clean, functional interface with constrained visual elements

## 🏗️ Architecture Overview

ToneDesigner follows the **Synth Node Pattern**:

```
Visual Module ⟷ Synth Node Object ⟷ Tone.js Object
```

This three-way correspondence ensures:
1. Each visual module represents a synthesizer component
2. Each module maps to a standardized JavaScript object (Synth Node)
3. Each Synth Node contains or controls a Tone.js audio object

### Core Components

#### ModuleFactory System
- **ModuleFactory**: Central factory for creating module instances
- **ModuleRegistry**: Stores all module definitions
- **CodeGeneratorFactory**: Generates Tone.js code from module configurations

#### PatchingController
- Handles visual cable connections between modules
- Manages drag-and-drop interactions
- Validates signal routing and compatibility

## 📦 Module System

### Module Definition Structure

Each module consists of three required components:

```javascript
const YourModule = {
    // 1. Node Configuration - Defines parameters and type
    nodeConfig: {
        type: "YourModuleType",
        parameters: {
            param1: defaultValue1,
            param2: defaultValue2,
            bypass: false  // Standard bypass parameter
        }
    },
    
    // 2. Tone.js Factory Function - Creates audio processing object
    toneFactory: (params) => {
        const audioNode = new Tone.YourToneObject({
            param1: params.param1,
            param2: params.param2
        });
        
        // Bypass functionality (if applicable)
        if (params.bypass) {
            // Implementation depends on module type
        }
        
        return audioNode;
    },
    
    // 3. Visual Render Function - Creates HTML interface
    renderFunction: (moduleData) => {
        return `
            <div class="synth-module" data-module-id="${moduleData.id}">
                <!-- Port definitions -->
                <div class="corner-port-input">
                    <div class="patch-port audio-input" data-port-type="audio-in" data-signal="audio"></div>
                    <span class="corner-port-label">IN</span>
                </div>
                <div class="corner-port-output">
                    <div class="patch-port audio-output" data-port-type="audio-out" data-signal="audio"></div>
                    <span class="corner-port-label">OUT</span>
                </div>
                
                <!-- Module header with bypass -->
                <div class="module-header">
                    <h3 class="module-title">YOUR-MODULE-1</h3>
                    <button class="bypass-toggle ${moduleData.parameters.bypass ? 'bypassed' : ''}" 
                            data-param="bypass" 
                            data-value="${moduleData.parameters.bypass}">
                        ${moduleData.parameters.bypass ? 'BYP' : 'ON'}
                    </button>
                </div>
                
                <!-- Module controls -->
                <div class="module-controls">
                    <!-- Your parameter controls here -->
                </div>
            </div>
        `;
    }
};
```

### Module Registration

```javascript
// Register the module type
ModuleFactory.register('yourtype', YourModule);

// Register code generator
CodeGeneratorFactory.register('YourModuleType', generateYourModuleCode);
```

## 🎛️ Available Modules

### Sound Sources
- **VCO (Oscillator)**: Generates basic waveforms (sine, square, sawtooth, triangle)
  - Parameters: waveform, frequency, detune, bypass

### Signal Processing
- **VCF (Filter)**: Frequency filtering with multiple types
  - Parameters: type (lowpass/highpass/bandpass/notch), frequency, Q, bypass
- **ENV/VCA (Envelope)**: ADSR amplitude envelope
  - Parameters: attack, decay, sustain, release, noteMode, bypass

### Effects
- **REVERB**: Spatial depth and ambiance
  - Parameters: decay, wet, bypass
- **EQ8**: 3-band equalizer (using Tone.EQ3)
  - Parameters: low, mid, high, bypass

### Modulation
- **LFO**: Low-frequency oscillator for parameter modulation
  - Parameters: frequency, type, min, max, multiplier, bypass

### Utilities
- **MIXER**: 8-channel audio mixer
  - Parameters: 8 channel gains + master gain, bypass

## 🔌 Signal Routing

### Port Types
- **Audio Ports**: Carry audio signals between modules
- **CV Ports**: Control voltage for parameter modulation
- **Gate Ports**: Trigger signals for envelopes and sequencers

### Connection Rules
1. **Output → Input**: Drag from output port to input port
2. **Signal Compatibility**: Audio connects to audio, CV to CV, etc.
3. **Multiple Connections**: Outputs can connect to multiple inputs
4. **Visual Feedback**: Real-time cable visualization during patching

## 💻 Code Generation

ToneDesigner generates clean, production-ready Tone.js code with **pure synthesis setup**:

```javascript
await Tone.start();

// ═══════════════════════════════════════════════════════════════
// INSTANTIATION BLOCK - Module Declarations  
// ═══════════════════════════════════════════════════════════════

const oscillator1 = new Tone.Oscillator({
    type: "sine",
    frequency: 440,
    detune: 0
}).start();

const filter1 = new Tone.Filter({
    type: "lowpass",
    frequency: 8000,
    Q: 1
});

const envelope1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 1.0
});

// ═══════════════════════════════════════════════════════════════
// PATCHING BLOCK - Signal Routing (DYNAMIC)
// ═══════════════════════════════════════════════════════════════

oscillator1.connect(filter1);
filter1.connect(envelope1);
envelope1.toDestination();

// Your Tone Designer patch is ready!
console.log("🎛️ Synthesizer loaded and ready");
```

### Code Generation Philosophy
- **Pure Export**: Only exports the exact synthesis setup, no triggering logic
- **Portable**: Generated code works in any Tone.js environment  
- **Clean**: No application-specific code or dependencies
- **Ready to Use**: Receiving application adds its own triggering/keyboard logic as needed

### Testing Code Portability
Use `simple-test.html` to verify exported code works independently:

1. **Design** your patch in ToneDesigner
2. **Export** the generated code 
3. **Paste** code into simple-test.html (replacing the ToneDesigner block)
4. **Test** keyboard - should sound identical to ToneDesigner

The simple test automatically adds keyboard functionality while preserving your exact synthesis design.

## 🛠️ Development Guide

### Adding a New Module

1. **Define Module Object** following the three-component structure
2. **Implement toneFactory** with proper Tone.js object creation
3. **Create renderFunction** with consistent HTML structure
4. **Add Code Generator** for export functionality
5. **Register Module** with both factories
6. **Test Integration** with existing modules and patching system

### Best Practices

#### HTML Structure
- Use semantic class names: `synth-module`, `module-header`, `module-controls`
- Include proper port definitions with `data-port-type` attributes
- Implement bypass toggle in module header
- Use `data-param` attributes for automatic parameter binding

#### Parameter Management
- Include `bypass: false` in all module parameters
- Use consistent parameter naming conventions
- Provide sensible default values
- Validate parameter ranges in toneFactory

#### CSS Integration
- Follow existing visual design patterns
- Use consistent spacing and typography
- Implement proper hover states for interactive elements
- Ensure responsive layout for different screen sizes

### Code Style Guidelines

```javascript
// Use consistent naming
const ModuleName = {
    nodeConfig: {
        type: "ToneObjectName",
        parameters: {
            parameterName: defaultValue,
            bypass: false
        }
    },
    
    // Document complex logic
    toneFactory: (params) => {
        // Create main audio object
        const audioNode = new Tone.ObjectType(params);
        
        // Handle bypass logic if applicable
        if (params.bypass) {
            // Bypass implementation
        }
        
        return audioNode;
    },
    
    // Keep HTML readable with proper indentation
    renderFunction: (data) => {
        return `
            <div class="synth-module" data-module-id="${data.id}">
                <!-- Well-commented structure -->
            </div>
        `;
    }
};
```

## 📁 Project Structure

```
ToneDesigner/
├── index.html              # Main application entry point
├── styles.css             # Complete visual styling
├── app.js                 # Main application logic and grid management
├── modules.js             # Module definitions and factory system
├── PatchingController.js  # Cable patching and connection management
├── simple-test.html       # Portability tester for exported code
├── patch.txt             # Latest exported patch for testing
└── README.md             # This documentation
```

## 🎯 Design Philosophy

### Minimalist Interface
- Clean, functional design with constrained visual elements
- Professional hardware synthesizer aesthetics
- Intuitive drag-and-drop interactions

### Modular Architecture
- Self-contained, reusable components
- Clear separation of concerns
- Standardized interfaces between components

### Production Ready
- Generated code works independently of the platform
- Professional-quality audio processing
- Clean, maintainable JavaScript output

## 🚀 Getting Started

1. **Clone the repository**
2. **Open `index.html`** in a modern web browser
3. **Start creating**: Drag modules onto the grid
4. **Connect modules**: Click and drag from output to input ports
5. **Adjust parameters**: Use knobs and selectors to shape your sound
6. **Export code**: Click "CODE" to view generated Tone.js code

## 🔧 Technical Requirements

- Modern web browser with Web Audio API support
- No additional dependencies beyond included libraries:
  - Tone.js (latest)
  - p5.js (for visualizations)

## 🎵 Example Patches

### Basic Synth Voice
1. Add VCO (Oscillator) → VCF (Filter) → ENV/VCA (Envelope)
2. Connect audio path: VCO OUT → VCF IN → ENV IN → Destination
3. Add LFO → VCF CV for filter modulation

### Ambient Pad
1. Multiple oscillators with slight detuning
2. Lowpass filter with long envelope
3. Reverb for spatial depth
4. EQ8 for tonal shaping

## 🤝 Contributing

ToneDesigner follows strict architectural patterns. When contributing:

1. **Follow the Synth Node Pattern** for all modules
2. **Maintain visual consistency** with existing design
3. **Test code generation** thoroughly
4. **Document new features** in this README

## 📄 License

[License information to be added]

## Links

- **All work** — [watusi.cloud](https://watusi.cloud)
- **Contact** — laervin.lightray@gmail.com
- **Support** — [Ko-fi](https://ko-fi.com/vivacarta)

## License

MIT

---

**Built with ❤️ by watusiii**

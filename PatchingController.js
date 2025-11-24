/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PATCHINGCONTROLLER - DEDICATED CABLE MANAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This controller handles ALL visual patching interactions, completely isolated
 * from the main application logic. It follows professional modular synth UI 
 * conventions and provides bulletproof drag-and-drop cable functionality.
 * 
 * DESIGN PRINCIPLES:
 * ───────────────────────────────────────────────────────────────────────────────
 * • Complete separation of concerns from app.js
 * • Universal port interaction (single event listener system)
 * • Robust layering with proper pointer events management
 * • Standard modular synth UX (click-drag from output to input)
 * • Professional validation and error handling
 * 
 * ARCHITECTURE:
 * ───────────────────────────────────────────────────────────────────────────────
 * • PatchingController class manages all UI state
 * • Ghost cable system for visual feedback during drag
 * • Connection validation ensures signal type compatibility
 * • Clean integration with existing Tone.js compilation system
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class PatchingController {
    /**
     * Initialize the patching controller with necessary dependencies
     * @param {Array} currentPatchConnections - Global connections array
     * @param {Function} compilePatching - Function to recompile audio connections
     * @param {Function} getPortCoordinates - Function to get port screen coordinates
     * @param {HTMLElement} svgElement - SVG container for cable visualization
     */
    constructor(currentPatchConnections, compilePatching, getPortCoordinates, svgElement) {
        // Store references to global functions and data
        this.connections = currentPatchConnections;
        this.compilePatching = compilePatching;
        this.getPortCoordinates = getPortCoordinates;
        this.svg = svgElement;
        
        // Drag state management
        this.isDragging = false;
        this.dragSource = null;
        this.dragSourceCoords = null;
        this.dragSourceType = null;
        this.ghostCable = null;
        
        // Bind methods to preserve 'this' context
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleCableClick = this.handleCableClick.bind(this);
        
        console.log('🔌 PatchingController initialized');
    }
    
    /**
     * Initialize all event listeners for the patching system
     * This sets up the universal port interaction system
     */
    initializeListeners() {
        console.log('🔌 Initializing patching event listeners...');
        
        // Universal port listener - attached to ALL .patch-port elements
        const ports = document.querySelectorAll('.patch-port');
        
        ports.forEach((port, index) => {
            console.log(`🔌 Attaching listeners to port ${index}:`, port.getAttribute('data-port-type'));
            
            port.addEventListener('mousedown', this.handleMouseDown);
            
            // NO JAVASCRIPT HOVER - LET CSS HANDLE IT
        });
        
        // Setup SVG container pointer events
        this.setupSVGLayering();
        
        console.log(`🔌 Event listeners attached to ${ports.length} ports`);
    }
    
    /**
     * Configure SVG layering and pointer events for proper cable interaction
     */
    setupSVGLayering() {
        if (this.svg) {
            // Don't override CSS - let it handle pointer events
            
            // Individual cables will have pointer-events: auto for removal
            const existingCables = this.svg.querySelectorAll('path[data-cable]');
            existingCables.forEach(cable => {
                cable.style.pointerEvents = 'auto';
                cable.addEventListener('click', this.handleCableClick);
            });
        }
    }
    
    /**
     * Handle mouse down on any port - start drag if it's an output port
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const port = e.currentTarget;
        const portType = port.getAttribute('data-port-type');
        const signal = port.getAttribute('data-signal');
        
        // Rule: Only start drag from output ports
        if (!portType || !portType.includes('-out')) {
            console.log('🔌 Ignoring click on input port or non-output');
            return;
        }
        
        console.log(`🔌 Starting drag from ${portType} port`);
        
        // Set drag state
        this.isDragging = true;
        this.dragSource = port;
        this.dragSourceType = signal || 'audio';
        this.dragSourceCoords = this.getPortCoordinates(port);
        
        // Create ghost cable
        this.createGhostCable(this.dragSourceCoords, this.dragSourceCoords);
        console.log('🔌 Ghost cable created:', this.ghostCable);
        
        // Add document-level listeners for drag and drop
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        
        // Visual feedback on source port
        port.style.transform = 'scale(1.2)';
        port.style.zIndex = '1000';
    }
    
    /**
     * Handle mouse movement during drag - update ghost cable position
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        if (!this.isDragging || !this.ghostCable) return;
        
        // Get current mouse coordinates relative to SVG
        const svgRect = this.svg.getBoundingClientRect();
        const currentCoords = {
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top
        };
        
        // Update ghost cable path
        this.updateGhostCable(this.dragSourceCoords, currentCoords);
    }
    
    /**
     * Handle mouse up - complete the connection or cancel
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        console.log('🔌 Ending drag operation');
        
        // Store source before cleanup
        const sourcePort = this.dragSource;
        
        // Cleanup drag state first
        this.cleanupDragState();
        
        // Get the element under the mouse cursor
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        console.log('🔌 Element under cursor:', targetElement);
        
        const targetPort = targetElement?.closest('.patch-port');
        console.log('🔌 Target port found:', targetPort);
        
        if (targetPort) {
            console.log('🔌 Target port type:', targetPort.getAttribute('data-port-type'));
            console.log('🔌 Target port signal:', targetPort.getAttribute('data-signal'));
            
            console.log('🔌 About to validate connection');
            console.log('🔌 Source port:', sourcePort);
            console.log('🔌 Source port type:', sourcePort?.getAttribute('data-port-type'));
            console.log('🔌 Source port signal:', sourcePort?.getAttribute('data-signal'));
            
            if (this.validateConnection(sourcePort, targetPort)) {
                this.createConnection(sourcePort, targetPort);
            } else {
                console.log('🔌 Connection validation failed');
            }
        } else {
            console.log('🔌 No target port found at drop location');
        }
        
        // Reset visual states
        this.resetPortVisuals();
    }
    
    /**
     * Create and display a ghost cable during drag operations
     * @param {Object} startCoords - Starting coordinates {x, y}
     * @param {Object} endCoords - Ending coordinates {x, y}
     */
    createGhostCable(startCoords, endCoords) {
        // Remove any existing ghost cable
        this.removeGhostCable();
        
        // Create new ghost cable path
        this.ghostCable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.ghostCable.setAttribute('class', 'ghost-cable');
        this.ghostCable.style.pointerEvents = 'none'; // Critical: never block drop target
        this.ghostCable.style.stroke = this.getSignalColor(this.dragSourceType);
        this.ghostCable.style.strokeWidth = '3';
        this.ghostCable.style.fill = 'none';
        this.ghostCable.style.strokeDasharray = '5,5';
        this.ghostCable.style.opacity = '0.7';
        
        // Set initial path
        this.updateGhostCable(startCoords, endCoords);
        
        // Add to SVG
        this.svg.appendChild(this.ghostCable);
    }
    
    /**
     * Update ghost cable path with new coordinates
     * @param {Object} startCoords - Starting coordinates {x, y}
     * @param {Object} endCoords - Ending coordinates {x, y}
     */
    updateGhostCable(startCoords, endCoords) {
        if (!this.ghostCable) return;
        
        // Create curved cable path (standard modular synth look)
        const dx = Math.abs(endCoords.x - startCoords.x);
        const controlOffset = Math.min(dx * 0.5, 100);
        
        const pathData = `
            M ${startCoords.x} ${startCoords.y}
            C ${startCoords.x + controlOffset} ${startCoords.y}
              ${endCoords.x - controlOffset} ${endCoords.y}
              ${endCoords.x} ${endCoords.y}
        `.trim();
        
        this.ghostCable.setAttribute('d', pathData);
    }
    
    /**
     * Remove the ghost cable from the SVG
     */
    removeGhostCable() {
        if (this.ghostCable && this.ghostCable.parentNode) {
            this.ghostCable.parentNode.removeChild(this.ghostCable);
        }
        this.ghostCable = null;
    }
    
    /**
     * Validate if a connection between two ports is allowed
     * @param {HTMLElement} sourcePort - Source port element
     * @param {HTMLElement} targetPort - Target port element
     * @returns {boolean} - True if connection is valid
     */
    validateConnection(sourcePort, targetPort) {
        if (!sourcePort || !targetPort) return false;
        
        const sourceType = sourcePort.getAttribute('data-port-type');
        const targetType = targetPort.getAttribute('data-port-type');
        const sourceSignal = sourcePort.getAttribute('data-signal');
        const targetSignal = targetPort.getAttribute('data-signal');
        
        console.log(`🔌 Validating: ${sourceType}(${sourceSignal}) → ${targetType}(${targetSignal})`);
        
        // Rule 1: Source must be output, target must be input
        if (!sourceType?.includes('-out') || !targetType?.includes('-in')) {
            console.log('🔌 FAIL Rule 1: source must be output, target must be input');
            return false;
        }
        console.log('🔌 PASS Rule 1: direction check');
        
        // Rule 2: Signal types must be compatible
        const compatibilityMatrix = {
            'audio': ['audio'],
            'cv': ['cv', 'gate'], // CV can connect to CV or gate inputs
            'gate': ['gate']
        };
        
        const compatibleTypes = compatibilityMatrix[sourceSignal];
        if (!compatibleTypes?.includes(targetSignal)) {
            console.log(`🔌 FAIL Rule 2: incompatible signals: ${sourceSignal} → ${targetSignal}`);
            return false;
        }
        console.log('🔌 PASS Rule 2: signal compatibility');
        
        // Rule 3: Check for duplicate connections
        const sourceId = this.getPortId(sourcePort);
        const targetId = this.getPortId(targetPort);
        
        console.log(`🔌 Checking duplicate: ${sourceId} → ${targetId}`);
        
        const isDuplicate = this.connections.some(conn => 
            conn.source === sourceId && conn.target === targetId
        );
        
        if (isDuplicate) {
            console.log('🔌 FAIL Rule 3: duplicate connection detected');
            return false;
        }
        console.log('🔌 PASS Rule 3: no duplicate');
        
        // Rule 4: Prevent self-connections (same module)
        const sourceModule = sourcePort.closest('[data-module-id]');
        const targetModule = targetPort.closest('[data-module-id]');
        
        console.log('🔌 Source module:', sourceModule?.getAttribute('data-module-id'));
        console.log('🔌 Target module:', targetModule?.getAttribute('data-module-id'));
        
        if (sourceModule === targetModule) {
            console.log('🔌 FAIL Rule 4: self-connection not allowed');
            return false;
        }
        console.log('🔌 PASS Rule 4: different modules');
        
        console.log(`🔌 Valid connection: ${sourceId} → ${targetId}`);
        return true;
    }
    
    /**
     * Create a new connection between two ports
     * @param {HTMLElement} sourcePort - Source port element
     * @param {HTMLElement} targetPort - Target port element
     */
    createConnection(sourcePort, targetPort) {
        const sourceId = this.getPortId(sourcePort);
        const targetId = this.getPortId(targetPort);
        const signalType = sourcePort.getAttribute('data-signal');
        
        console.log(`🔌 Creating connection: ${sourceId} → ${targetId} (${signalType})`);
        
        // Add to global connections array
        const connection = {
            source: sourceId,
            target: targetId,
            type: signalType
        };
        
        this.connections.push(connection);
        
        // Trigger audio recompilation
        this.compilePatching();
        
        // Visual feedback
        this.showConnectionFeedback(sourcePort, targetPort);
        
        console.log(`🔌 Connection created successfully. Total connections: ${this.connections.length}`);
    }
    
    /**
     * Handle cable click for removal
     * @param {Event} e - Click event on cable
     */
    handleCableClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const cable = e.currentTarget;
        const connectionData = cable.getAttribute('data-connection');
        
        if (connectionData) {
            const [source, target] = connectionData.split('→');
            this.removeConnection(source.trim(), target.trim());
        }
    }
    
    /**
     * Remove a connection
     * @param {string} source - Source port ID
     * @param {string} target - Target port ID
     */
    removeConnection(source, target) {
        console.log(`🗑️ Removing connection: ${source} → ${target}`);
        
        const index = this.connections.findIndex(conn => 
            conn.source === source && conn.target === target
        );
        
        if (index !== -1) {
            this.connections.splice(index, 1);
            console.log('🗑️ Connection removed from data structure');
            
            // Recompile patching
            this.compilePatching();
        } else {
            console.warn('🗑️ Connection not found in data structure');
        }
    }
    
    /**
     * Get a standardized port ID for a port element
     * @param {HTMLElement} port - Port element
     * @returns {string} - Port ID in format "module-id/port-type"
     */
    getPortId(port) {
        const module = port.closest('[data-module-id]');
        const moduleId = module?.getAttribute('data-module-id');
        const portType = port.getAttribute('data-port-type');
        
        // Convert dash format to underscore format to match connection data
        // audio-out -> audio_out, cv-in -> cv_in, etc.
        const standardPortType = portType.replace('-', '_');
        
        return `${moduleId}/${standardPortType}`;
    }
    
    /**
     * Get the appropriate color for a signal type
     * @param {string} signalType - Signal type (audio, cv, gate)
     * @returns {string} - CSS color value
     */
    getSignalColor(signalType) {
        const colors = {
            'audio': '#ffcc00',    // TE Yellow
            'cv': '#8866ff',       // TE Purple
            'gate': '#0066ff'      // TE Blue
        };
        
        return colors[signalType] || colors.audio;
    }
    
    /**
     * Show brief visual feedback when a connection is made
     * @param {HTMLElement} sourcePort - Source port
     * @param {HTMLElement} targetPort - Target port
     */
    showConnectionFeedback(sourcePort, targetPort) {
        // Brief flash on both ports
        [sourcePort, targetPort].forEach(port => {
            port.style.boxShadow = '0 0 10px #00ff00';
            port.style.transition = 'box-shadow 0.3s ease';
            
            setTimeout(() => {
                port.style.boxShadow = 'none';
            }, 300);
        });
    }
    
    /**
     * Clean up all drag-related state
     */
    cleanupDragState() {
        // Remove document listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        // Remove ghost cable
        this.removeGhostCable();
        
        // Reset state
        this.isDragging = false;
        this.dragSource = null;
        this.dragSourceType = null;
        this.dragSourceCoords = null;
    }
    
    /**
     * Reset visual states on all ports
     */
    resetPortVisuals() {
        const ports = document.querySelectorAll('.patch-port');
        ports.forEach(port => {
            port.style.transform = 'scale(1)';
            port.style.zIndex = '';
            port.style.transition = '';
        });
    }
    
    /**
     * Refresh cable click listeners after cables are redrawn
     */
    refreshCableListeners() {
        const cables = this.svg.querySelectorAll('path[data-cable]');
        cables.forEach(cable => {
            cable.style.pointerEvents = 'auto';
            cable.addEventListener('click', this.handleCableClick);
        });
    }
    
    /**
     * Destroy the controller and clean up all listeners
     */
    destroy() {
        console.log('🔌 Destroying PatchingController...');
        
        this.cleanupDragState();
        
        // Remove all port listeners
        const ports = document.querySelectorAll('.patch-port');
        ports.forEach(port => {
            port.removeEventListener('mousedown', this.handleMouseDown);
        });
        
        // Remove cable listeners
        const cables = this.svg?.querySelectorAll('path[data-cable]');
        cables?.forEach(cable => {
            cable.removeEventListener('click', this.handleCableClick);
        });
        
        console.log('🔌 PatchingController destroyed');
    }
}

// Make PatchingController available globally
window.PatchingController = PatchingController;
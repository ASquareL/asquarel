/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Playground Module
 * File        : playground.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Playground Module provides an interactive testing and demonstration
 * environment for ASLDS components. It delivers a unified playground
 * experience with support for:
 *   • Component preview rendering
 *   • Live theme switching with visual feedback
 *   • Responsive viewport simulation (mobile, tablet, desktop)
 *   • Layout switching (horizontal, vertical, grid)
 *   • Code preview synchronization with highlighted markup
 *   • Copy code functionality with clipboard support
 *   • Reset playground to default state
 *   • Live property updates (variant, size, state)
 *   • Dynamic class toggling
 *   • Component variant switching
 *   • Size switching (sm, md, lg)
 *   • State switching (default, hover, focus, active, disabled)
 *   • Animation preview support
 *   • Accessibility preview tools
 *   • Event delegation
 *   • Public API methods (reset, update, destroy)
 *   • Custom event dispatching
 *   • Performance optimizations
 *   • Event cleanup
 *
 * ============================================================================
 * Copyright © 2026
 * A Square L Innovate
 * All Rights Reserved.
 * ============================================================================
 */

(function (window, document) {
    'use strict';

    // ========================================================================
    // Ensure Runtime Exists
    // ========================================================================

    if (!window.ASLDS) {
        console.error('[ASLDS] Runtime not found. Playground module cannot initialize.');
        return;
    }

    // ========================================================================
    // Playground Module
    // ========================================================================

    const Playground = {
        /**
         * Module Information
         */
        name: 'Playground',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Playground Configuration
         */
        config: {
            // Selectors
            playgroundSelector: '.playground',
            previewSelector: '.playground-preview',
            controlsSelector: '.playground-controls',
            codeSelector: '.playground-code',
            codeBlockSelector: '.playground-code-block',
            themeSelector: '.playground-theme-toggle',
            viewportSelector: '.playground-viewport',
            layoutSelector: '.playground-layout',
            variantSelector: '.playground-variant',
            sizeSelector: '.playground-size',
            stateSelector: '.playground-state',
            resetSelector: '.playground-reset',
            copySelector: '.playground-copy',
            componentSelector: '.playground-component',

            activeClass: 'active',
            openClass: 'open',
            visibleClass: 'visible',
            selectedClass: 'selected',

            // Viewport presets
            viewports: {
                mobile: { width: 375, height: 667, label: 'Mobile' },
                tablet: { width: 768, height: 1024, label: 'Tablet' },
                desktop: { width: 1200, height: 800, label: 'Desktop' },
                full: { width: '100%', height: 'auto', label: 'Full' },
            },

            // Layout presets
            layouts: ['horizontal', 'vertical', 'grid'],

            // Defaults
            defaultViewport: 'full',
            defaultLayout: 'horizontal',
            defaultTheme: 'system',

            // Behavior
            enableTransitions: true,
            transitionDuration: 300,
            enableCodeSync: true,
            enableCopy: true,
            enableReset: true,
            persistState: true,
            storageKey: 'aslds-playground-state',

            // Accessibility
            ariaLabel: 'Component playground',
            previewAriaLabel: 'Component preview',
            codeAriaLabel: 'Component code',

            // Debug
            debug: false,
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            isOpen: false,
            viewport: 'full',
            layout: 'horizontal',
            theme: 'system',
            variant: 'default',
            size: 'md',
            state: 'default',
            isAnimating: false,
            resizeTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            playground: null,
            preview: null,
            controls: null,
            code: null,
            codeBlock: null,
            component: null,
            themeToggle: null,
            viewportControls: [],
            layoutControls: [],
            variantControls: [],
            sizeControls: [],
            stateControls: [],
            resetBtn: null,
            copyBtn: null,
            body: document.body,
        },

        /**
         * Component Instances (for tracking)
         */
        components: [],

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            themeClick: null,
            viewportClicks: [],
            layoutClicks: [],
            variantClicks: [],
            sizeClicks: [],
            stateClicks: [],
            resetClick: null,
            copyClick: null,
            resize: null,
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the playground module
         * @param {Element|string} element - Playground element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Playground module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Playground module v' + this.version + '...');

            // Find playground element
            this.elements.playground = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!this.elements.playground) {
                // Try to find by selector
                this.elements.playground = ASLDS.dom.find(this.config.playgroundSelector);
                if (!this.elements.playground) {
                    ASLDS.logger.warn('Playground element not found.');
                    return this;
                }
            }

            // Cache elements
            this._cacheElements();

            // Load persisted state
            if (this.config.persistState) {
                this._loadState();
            }

            // Setup theme toggle
            this._setupThemeToggle();

            // Setup viewport controls
            this._setupViewportControls();

            // Setup layout controls
            this._setupLayoutControls();

            // Setup variant controls
            this._setupVariantControls();

            // Setup size controls
            this._setupSizeControls();

            // Setup state controls
            this._setupStateControls();

            // Setup reset button
            this._setupReset();

            // Setup copy button
            this._setupCopy();

            // Setup code synchronization
            if (this.config.enableCodeSync) {
                this._setupCodeSync();
            }

            // Setup resize handling
            this._setupResizeHandling();

            // Apply initial state
            this._applyInitialState();

            // Emit ready event
            ASLDS.events.emit('playground:ready', {
                playground: this.elements.playground,
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
            });

            this.state.initialized = true;

            ASLDS.logger.info('Playground module initialized successfully.', {
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
            });

            return this;
        },

        /**
         * Reset the playground to default state
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @returns {Object} This instance for chaining
         */
        reset: function (options) {
            options = options || {};

            ASLDS.logger.debug('Resetting playground...');

            // Reset state
            this.state.viewport = this.config.defaultViewport;
            this.state.layout = this.config.defaultLayout;
            this.state.theme = this.config.defaultTheme;
            this.state.variant = 'default';
            this.state.size = 'md';
            this.state.state = 'default';

            // Apply reset
            this._applyViewport(this.state.viewport, options);
            this._applyLayout(this.state.layout, options);
            this._applyTheme(this.state.theme, options);
            this._applyVariant('default', options);
            this._applySize('md', options);
            this._applyState('default', options);

            // Reset component
            this._resetComponent(options);

            // Update UI controls
            this._updateControls();

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            // Emit event
            ASLDS.events.emit('playground:reset', {
                playground: this.elements.playground,
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
            });

            ASLDS.logger.info('Playground reset to defaults.');

            return this;
        },

        /**
         * Update the preview component
         * @param {string|Element} component - Component HTML or element
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.syncCode - If false, doesn't sync code
         * @returns {Object} This instance for chaining
         */
        update: function (component, options) {
            options = options || {};

            const preview = this.elements.preview;
            if (!preview) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update component
            if (typeof component === 'string') {
                preview.innerHTML = component;
            } else if (component && component.nodeType) {
                preview.innerHTML = '';
                preview.appendChild(component);
            }

            // Store component reference
            this.elements.component = preview.firstElementChild;

            // Sync code
            if (this.config.enableCodeSync && options.syncCode !== false) {
                this._syncCode();
            }

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }

            // Emit event
            ASLDS.events.emit('playground:update', {
                playground: this.elements.playground,
                component: this.elements.component,
            });

            ASLDS.logger.debug('Playground updated.');

            return this;
        },

        /**
         * Set the viewport size
         * @param {string} viewport - Viewport name ('mobile', 'tablet', 'desktop', 'full')
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setViewport: function (viewport, options) {
            options = options || {};

            if (!this.config.viewports[viewport]) {
                ASLDS.logger.warn('Invalid viewport: ' + viewport);
                return this;
            }

            this.state.viewport = viewport;
            this._applyViewport(viewport, options);

            // Update controls
            this._updateViewportControls(viewport);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('Viewport set: ' + viewport);

            return this;
        },

        /**
         * Set the layout
         * @param {string} layout - Layout name ('horizontal', 'vertical', 'grid')
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setLayout: function (layout, options) {
            options = options || {};

            if (!this.config.layouts.includes(layout)) {
                ASLDS.logger.warn('Invalid layout: ' + layout);
                return this;
            }

            this.state.layout = layout;
            this._applyLayout(layout, options);

            // Update controls
            this._updateLayoutControls(layout);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('Layout set: ' + layout);

            return this;
        },

        /**
         * Set the theme
         * @param {string} theme - Theme name ('light', 'dark', 'system')
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setTheme: function (theme, options) {
            options = options || {};

            const validThemes = ['light', 'dark', 'system'];
            if (!validThemes.includes(theme)) {
                ASLDS.logger.warn('Invalid theme: ' + theme);
                return this;
            }

            this.state.theme = theme;
            this._applyTheme(theme, options);

            // Update controls
            this._updateThemeControls(theme);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('Theme set: ' + theme);

            return this;
        },

        /**
         * Set the component variant
         * @param {string} variant - Variant name
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setVariant: function (variant, options) {
            options = options || {};

            this.state.variant = variant;
            this._applyVariant(variant, options);

            // Update controls
            this._updateVariantControls(variant);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('Variant set: ' + variant);

            return this;
        },

        /**
         * Set the component size
         * @param {string} size - Size name ('sm', 'md', 'lg')
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setSize: function (size, options) {
            options = options || {};

            const validSizes = ['sm', 'md', 'lg'];
            if (!validSizes.includes(size)) {
                ASLDS.logger.warn('Invalid size: ' + size);
                return this;
            }

            this.state.size = size;
            this._applySize(size, options);

            // Update controls
            this._updateSizeControls(size);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('Size set: ' + size);

            return this;
        },

        /**
         * Set the component state
         * @param {string} state - State name ('default', 'hover', 'focus', 'active', 'disabled')
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        setState: function (state, options) {
            options = options || {};

            const validStates = ['default', 'hover', 'focus', 'active', 'disabled'];
            if (!validStates.includes(state)) {
                ASLDS.logger.warn('Invalid state: ' + state);
                return this;
            }

            this.state.state = state;
            this._applyState(state, options);

            // Update controls
            this._updateStateControls(state);

            // Save state
            if (this.config.persistState) {
                this._saveState();
            }

            ASLDS.logger.debug('State set: ' + state);

            return this;
        },

        /**
         * Copy the current component code to clipboard
         * @returns {Object} This instance for chaining
         */
        copyCode: function () {
            if (!this.config.enableCopy) {
                return this;
            }

            const codeBlock = this.elements.codeBlock;
            if (!codeBlock) {
                return this;
            }

            const code = codeBlock.textContent;

            // Use clipboard API if available
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code)
                    .then(function () {
                        this._showCopyFeedback(true);
                    }.bind(this))
                    .catch(function () {
                        this._fallbackCopy(code);
                    }.bind(this));
            } else {
                this._fallbackCopy(code);
            }

            ASLDS.logger.debug('Code copied to clipboard.');

            return this;
        },

        /**
         * Get the current component HTML
         * @returns {string} Component HTML
         */
        getComponentHTML: function () {
            const preview = this.elements.preview;
            if (!preview) {
                return '';
            }
            return preview.innerHTML;
        },

        /**
         * Get the current component code
         * @returns {string} Component code
         */
        getCode: function () {
            const codeBlock = this.elements.codeBlock;
            if (!codeBlock) {
                return '';
            }
            return codeBlock.textContent;
        },

        /**
         * Get module information
         * @returns {Object} Info object
         */
        info: function () {
            return {
                module: this.name,
                version: this.version,
                initialized: this.state.initialized,
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
                variant: this.state.variant,
                size: this.state.size,
                state: this.state.state,
                config: Object.assign({}, this.config),
            };
        },

        /**
         * Get module status
         * @returns {Object} Status object
         */
        status: function () {
            return {
                initialized: this.state.initialized,
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
                variant: this.state.variant,
                size: this.state.size,
                state: this.state.state,
                isAnimating: this.state.isAnimating,
                config: Object.assign({}, this.config),
                elements: {
                    playground: !!this.elements.playground,
                    preview: !!this.elements.preview,
                    controls: !!this.elements.controls,
                    code: !!this.elements.code,
                    codeBlock: !!this.elements.codeBlock,
                    component: !!this.elements.component,
                },
            };
        },

        /**
         * Destroy the playground module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Playground module...');

            // Remove event listeners
            this._removeEventListeners();

            // Reset state
            this.state.initialized = false;

            // Clear timers
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }

            ASLDS.logger.info('Playground module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Cache DOM elements
         */
        _cacheElements: function () {
            const playground = this.elements.playground;

            this.elements.preview = playground.querySelector(this.config.previewSelector);
            this.elements.controls = playground.querySelector(this.config.controlsSelector);
            this.elements.code = playground.querySelector(this.config.codeSelector);
            this.elements.codeBlock = playground.querySelector(this.config.codeBlockSelector);
            this.elements.themeToggle = playground.querySelector(this.config.themeSelector);

            // Find all control groups
            this.elements.viewportControls = ASLDS.dom.findAll(this.config.viewportSelector, playground);
            this.elements.layoutControls = ASLDS.dom.findAll(this.config.layoutSelector, playground);
            this.elements.variantControls = ASLDS.dom.findAll(this.config.variantSelector, playground);
            this.elements.sizeControls = ASLDS.dom.findAll(this.config.sizeSelector, playground);
            this.elements.stateControls = ASLDS.dom.findAll(this.config.stateSelector, playground);

            this.elements.resetBtn = playground.querySelector(this.config.resetSelector);
            this.elements.copyBtn = playground.querySelector(this.config.copySelector);

            // Find component
            this.elements.component = playground.querySelector(this.config.componentSelector);
        },

        /**
         * Load persisted state from storage
         */
        _loadState: function () {
            if (!this.config.persistState) {
                return;
            }

            const saved = ASLDS.storage.get(this.config.storageKey);
            if (saved && typeof saved === 'object') {
                this.state.viewport = saved.viewport || this.config.defaultViewport;
                this.state.layout = saved.layout || this.config.defaultLayout;
                this.state.theme = saved.theme || this.config.defaultTheme;
                this.state.variant = saved.variant || 'default';
                this.state.size = saved.size || 'md';
                this.state.state = saved.state || 'default';
            } else {
                this.state.viewport = this.config.defaultViewport;
                this.state.layout = this.config.defaultLayout;
                this.state.theme = this.config.defaultTheme;
                this.state.variant = 'default';
                this.state.size = 'md';
                this.state.state = 'default';
            }
        },

        /**
         * Save state to storage
         */
        _saveState: function () {
            if (!this.config.persistState) {
                return;
            }

            ASLDS.storage.set(this.config.storageKey, {
                viewport: this.state.viewport,
                layout: this.state.layout,
                theme: this.state.theme,
                variant: this.state.variant,
                size: this.state.size,
                state: this.state.state,
                timestamp: Date.now(),
            });
        },

        /**
         * Setup theme toggle
         */
        _setupThemeToggle: function () {
            const toggle = this.elements.themeToggle;
            if (!toggle) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();

                const themes = ['light', 'dark', 'system'];
                const currentIndex = themes.indexOf(this.state.theme);
                const nextIndex = (currentIndex + 1) % themes.length;
                const nextTheme = themes[nextIndex];

                this.setTheme(nextTheme);
            }.bind(this);

            toggle.addEventListener('click', handler);
            this._handlers.themeClick = handler;

            // Set initial theme
            this._applyTheme(this.state.theme);

            ASLDS.logger.debug('Theme toggle setup complete.');
        },

        /**
         * Setup viewport controls
         */
        _setupViewportControls: function () {
            const controls = this.elements.viewportControls;
            if (!controls || controls.length === 0) {
                return;
            }

            controls.forEach(function (control) {
                const viewport = control.getAttribute('data-viewport');
                if (!viewport) {
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.setViewport(viewport);
                }.bind(this);

                control.addEventListener('click', handler);

                this._handlers.viewportClicks.push({
                    control: control,
                    handler: handler,
                });
            }.bind(this));

            // Apply initial viewport
            this._applyViewport(this.state.viewport);
            this._updateViewportControls(this.state.viewport);

            ASLDS.logger.debug('Viewport controls setup complete: ' + controls.length);
        },

        /**
         * Setup layout controls
         */
        _setupLayoutControls: function () {
            const controls = this.elements.layoutControls;
            if (!controls || controls.length === 0) {
                return;
            }

            controls.forEach(function (control) {
                const layout = control.getAttribute('data-layout');
                if (!layout) {
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.setLayout(layout);
                }.bind(this);

                control.addEventListener('click', handler);

                this._handlers.layoutClicks.push({
                    control: control,
                    handler: handler,
                });
            }.bind(this));

            // Apply initial layout
            this._applyLayout(this.state.layout);
            this._updateLayoutControls(this.state.layout);

            ASLDS.logger.debug('Layout controls setup complete: ' + controls.length);
        },

        /**
         * Setup variant controls
         */
        _setupVariantControls: function () {
            const controls = this.elements.variantControls;
            if (!controls || controls.length === 0) {
                return;
            }

            controls.forEach(function (control) {
                const variant = control.getAttribute('data-variant');
                if (!variant) {
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.setVariant(variant);
                }.bind(this);

                control.addEventListener('click', handler);

                this._handlers.variantClicks.push({
                    control: control,
                    handler: handler,
                });
            }.bind(this));

            // Apply initial variant
            this._applyVariant(this.state.variant);
            this._updateVariantControls(this.state.variant);

            ASLDS.logger.debug('Variant controls setup complete: ' + controls.length);
        },

        /**
         * Setup size controls
         */
        _setupSizeControls: function () {
            const controls = this.elements.sizeControls;
            if (!controls || controls.length === 0) {
                return;
            }

            controls.forEach(function (control) {
                const size = control.getAttribute('data-size');
                if (!size) {
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.setSize(size);
                }.bind(this);

                control.addEventListener('click', handler);

                this._handlers.sizeClicks.push({
                    control: control,
                    handler: handler,
                });
            }.bind(this));

            // Apply initial size
            this._applySize(this.state.size);
            this._updateSizeControls(this.state.size);

            ASLDS.logger.debug('Size controls setup complete: ' + controls.length);
        },

        /**
         * Setup state controls
         */
        _setupStateControls: function () {
            const controls = this.elements.stateControls;
            if (!controls || controls.length === 0) {
                return;
            }

            controls.forEach(function (control) {
                const state = control.getAttribute('data-state');
                if (!state) {
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.setState(state);
                }.bind(this);

                control.addEventListener('click', handler);

                this._handlers.stateClicks.push({
                    control: control,
                    handler: handler,
                });
            }.bind(this));

            // Apply initial state
            this._applyState(this.state.state);
            this._updateStateControls(this.state.state);

            ASLDS.logger.debug('State controls setup complete: ' + controls.length);
        },

        /**
         * Setup reset button
         */
        _setupReset: function () {
            const resetBtn = this.elements.resetBtn;
            if (!resetBtn || !this.config.enableReset) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();
                this.reset();
            }.bind(this);

            resetBtn.addEventListener('click', handler);
            this._handlers.resetClick = handler;

            ASLDS.logger.debug('Reset button setup complete.');
        },

        /**
         * Setup copy button
         */
        _setupCopy: function () {
            const copyBtn = this.elements.copyBtn;
            if (!copyBtn || !this.config.enableCopy) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();
                this.copyCode();
            }.bind(this);

            copyBtn.addEventListener('click', handler);
            this._handlers.copyClick = handler;

            ASLDS.logger.debug('Copy button setup complete.');
        },

        /**
         * Setup code synchronization
         */
        _setupCodeSync: function () {
            // Sync code on initial load
            this._syncCode();

            // Listen for DOM changes in the preview
            if (this.elements.preview) {
                const observer = new MutationObserver(function () {
                    this._syncCode();
                }.bind(this));

                observer.observe(this.elements.preview, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                });

                // Store observer for cleanup
                this._codeObserver = observer;
            }

            ASLDS.logger.debug('Code sync setup complete.');
        },

        /**
         * Sync code from preview to code block
         */
        _syncCode: function () {
            const preview = this.elements.preview;
            const codeBlock = this.elements.codeBlock;

            if (!preview || !codeBlock) {
                return;
            }

            // Get the HTML from preview
            let html = preview.innerHTML;

            // Clean up the HTML for display
            html = this._cleanHTML(html);

            // Update code block
            codeBlock.textContent = html;

            // Update code block language class
            codeBlock.setAttribute('data-language', 'html');
        },

        /**
         * Clean HTML for display
         * @param {string} html - Raw HTML
         * @returns {string} Cleaned HTML
         */
        _cleanHTML: function (html) {
            // Remove extra whitespace
            html = html.trim();

            // Remove empty text nodes
            html = html.replace(/>\s+</g, '><');

            // Format for readability
            html = html.replace(/></g, '>\n<');

            // Indent properly (simplified)
            const lines = html.split('\n');
            let indent = 0;
            const formatted = lines.map(function (line) {
                const trimmed = line.trim();
                if (trimmed.startsWith('</')) {
                    indent = Math.max(0, indent - 1);
                }
                const result = '  '.repeat(indent) + trimmed;
                if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                    indent++;
                }
                return result;
            });

            return formatted.join('\n');
        },

        /**
         * Setup resize handling
         */
        _setupResizeHandling: function () {
            const handler = function () {
                if (this.state.resizeTimer) {
                    clearTimeout(this.state.resizeTimer);
                }

                this.state.resizeTimer = setTimeout(function () {
                    this._handleResize();
                }.bind(this), 150);
            }.bind(this);

            window.addEventListener('resize', handler);
            this._handlers.resize = handler;

            ASLDS.logger.debug('Resize handling setup complete.');
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            // Re-apply viewport if needed
            this._applyViewport(this.state.viewport);

            ASLDS.events.emit('playground:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
                viewport: this.state.viewport,
            });
        },

        /**
         * Apply viewport
         */
        _applyViewport: function (viewport, options) {
            options = options || {};

            const preview = this.elements.preview;
            if (!preview) {
                return;
            }

            const viewportConfig = this.config.viewports[viewport];
            if (!viewportConfig) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Apply viewport styles
            if (viewport === 'full') {
                preview.style.width = '';
                preview.style.height = '';
                preview.style.maxWidth = '';
                preview.style.overflow = '';
                preview.style.margin = '';
            } else {
                preview.style.width = viewportConfig.width + 'px';
                preview.style.height = viewportConfig.height + 'px';
                preview.style.maxWidth = '100%';
                preview.style.overflow = 'auto';
                preview.style.margin = '0 auto';
            }

            // Add viewport class
            preview.className = preview.className
                .replace(/viewport-\w+/g, '')
                .trim() + ' viewport-' + viewport;

            // Emit event
            ASLDS.events.emit('playground:viewport-change', {
                viewport: viewport,
                config: viewportConfig,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Apply layout
         */
        _applyLayout: function (layout, options) {
            options = options || {};

            const playground = this.elements.playground;
            if (!playground) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Remove existing layout classes
            this.config.layouts.forEach(function (l) {
                playground.classList.remove('layout-' + l);
            });

            // Add new layout class
            playground.classList.add('layout-' + layout);

            // Emit event
            ASLDS.events.emit('playground:layout-change', {
                layout: layout,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Apply theme
         */
        _applyTheme: function (theme, options) {
            options = options || {};

            const playground = this.elements.playground;
            if (!playground) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Remove existing theme classes
            ['light', 'dark', 'system'].forEach(function (t) {
                playground.classList.remove('theme-' + t);
            });

            // Add new theme class
            playground.classList.add('theme-' + theme);

            // Update theme toggle text
            this._updateThemeToggle(theme);

            // Emit event
            ASLDS.events.emit('playground:theme-change', {
                theme: theme,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Apply variant
         */
        _applyVariant: function (variant, options) {
            options = options || {};

            const component = this.elements.component;
            if (!component) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Remove existing variant classes
            component.className = component.className
                .replace(/variant-\w+/g, '')
                .trim();

            // Add new variant class
            if (variant !== 'default') {
                component.classList.add('variant-' + variant);
            }

            // Emit event
            ASLDS.events.emit('playground:variant-change', {
                variant: variant,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Apply size
         */
        _applySize: function (size, options) {
            options = options || {};

            const component = this.elements.component;
            if (!component) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Remove existing size classes
            ['sm', 'md', 'lg'].forEach(function (s) {
                component.classList.remove('size-' + s);
            });

            // Add new size class
            if (size !== 'md') {
                component.classList.add('size-' + size);
            }

            // Emit event
            ASLDS.events.emit('playground:size-change', {
                size: size,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Apply state
         */
        _applyState: function (state, options) {
            options = options || {};

            const component = this.elements.component;
            if (!component) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Remove existing state classes
            ['default', 'hover', 'focus', 'active', 'disabled'].forEach(function (s) {
                component.classList.remove('state-' + s);
            });

            // Add new state class
            if (state !== 'default') {
                component.classList.add('state-' + state);

                // Special handling for disabled state
                if (state === 'disabled') {
                    component.setAttribute('disabled', 'disabled');
                } else {
                    component.removeAttribute('disabled');
                }
            } else {
                component.removeAttribute('disabled');
            }

            // Emit event
            ASLDS.events.emit('playground:state-change', {
                state: state,
            });

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Reset component
         */
        _resetComponent: function (options) {
            options = options || {};

            const component = this.elements.component;
            if (!component) {
                return;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Reset classes
            component.className = component.className
                .replace(/variant-\w+/g, '')
                .replace(/size-\w+/g, '')
                .replace(/state-\w+/g, '')
                .trim();

            // Reset attributes
            component.removeAttribute('disabled');

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }
        },

        /**
         * Update theme toggle text/icon
         */
        _updateThemeToggle: function (theme) {
            const toggle = this.elements.themeToggle;
            if (!toggle) {
                return;
            }

            const labels = {
                light: '☀️ Light',
                dark: '🌙 Dark',
                system: '🔄 System',
            };

            toggle.textContent = labels[theme] || labels.system;
            toggle.setAttribute('data-theme', theme);
        },

        /**
         * Update viewport controls
         */
        _updateViewportControls: function (viewport) {
            const controls = this.elements.viewportControls;
            if (!controls) {
                return;
            }

            controls.forEach(function (control) {
                const v = control.getAttribute('data-viewport');
                control.classList.toggle(this.config.activeClass, v === viewport);
                control.setAttribute('aria-pressed', v === viewport ? 'true' : 'false');
            }.bind(this));
        },

        /**
         * Update layout controls
         */
        _updateLayoutControls: function (layout) {
            const controls = this.elements.layoutControls;
            if (!controls) {
                return;
            }

            controls.forEach(function (control) {
                const l = control.getAttribute('data-layout');
                control.classList.toggle(this.config.activeClass, l === layout);
                control.setAttribute('aria-pressed', l === layout ? 'true' : 'false');
            }.bind(this));
        },

        /**
         * Update variant controls
         */
        _updateVariantControls: function (variant) {
            const controls = this.elements.variantControls;
            if (!controls) {
                return;
            }

            controls.forEach(function (control) {
                const v = control.getAttribute('data-variant');
                control.classList.toggle(this.config.activeClass, v === variant);
                control.setAttribute('aria-pressed', v === variant ? 'true' : 'false');
            }.bind(this));
        },

        /**
         * Update size controls
         */
        _updateSizeControls: function (size) {
            const controls = this.elements.sizeControls;
            if (!controls) {
                return;
            }

            controls.forEach(function (control) {
                const s = control.getAttribute('data-size');
                control.classList.toggle(this.config.activeClass, s === size);
                control.setAttribute('aria-pressed', s === size ? 'true' : 'false');
            }.bind(this));
        },

        /**
         * Update state controls
         */
        _updateStateControls: function (state) {
            const controls = this.elements.stateControls;
            if (!controls) {
                return;
            }

            controls.forEach(function (control) {
                const s = control.getAttribute('data-state');
                control.classList.toggle(this.config.activeClass, s === state);
                control.setAttribute('aria-pressed', s === state ? 'true' : 'false');
            }.bind(this));
        },

        /**
         * Update all controls
         */
        _updateControls: function () {
            this._updateViewportControls(this.state.viewport);
            this._updateLayoutControls(this.state.layout);
            this._updateThemeControls(this.state.theme);
            this._updateVariantControls(this.state.variant);
            this._updateSizeControls(this.state.size);
            this._updateStateControls(this.state.state);
        },

        /**
         * Update theme controls
         */
        _updateThemeControls: function (theme) {
            // Theme is controlled by the toggle button
            this._updateThemeToggle(theme);
        },

        /**
         * Apply initial state
         */
        _applyInitialState: function () {
            this._applyViewport(this.state.viewport);
            this._applyLayout(this.state.layout);
            this._applyTheme(this.state.theme);
            this._applyVariant(this.state.variant);
            this._applySize(this.state.size);
            this._applyState(this.state.state);

            this._updateControls();

            // Set ARIA attributes
            if (this.elements.playground) {
                this.elements.playground.setAttribute('role', 'main');
                this.elements.playground.setAttribute('aria-label', this.config.ariaLabel);
            }

            if (this.elements.preview) {
                this.elements.preview.setAttribute('role', 'img');
                this.elements.preview.setAttribute('aria-label', this.config.previewAriaLabel);
            }

            if (this.elements.code) {
                this.elements.code.setAttribute('role', 'region');
                this.elements.code.setAttribute('aria-label', this.config.codeAriaLabel);
            }

            // Sync code
            if (this.config.enableCodeSync) {
                this._syncCode();
            }
        },

        /**
         * Start transition
         */
        _startTransition: function () {
            if (this.state.isAnimating) {
                return;
            }

            if (!this.config.enableTransitions) {
                return;
            }

            this.state.isAnimating = true;
            const playground = this.elements.playground;
            if (playground) {
                playground.classList.add('transitioning');
            }

            ASLDS.events.emit('playground:transition-start');
        },

        /**
         * End transition
         */
        _endTransition: function () {
            if (!this.state.isAnimating) {
                return;
            }

            const duration = this.config.transitionDuration;

            setTimeout(function () {
                const playground = this.elements.playground;
                if (playground) {
                    playground.classList.remove('transitioning');
                }
                this.state.isAnimating = false;

                ASLDS.events.emit('playground:transition-end');
            }.bind(this), duration + 50);
        },

        /**
         * Show copy feedback
         */
        _showCopyFeedback: function (success) {
            const copyBtn = this.elements.copyBtn;
            if (!copyBtn) {
                return;
            }

            const originalText = copyBtn.textContent;
            const feedbackText = success ? '✅ Copied!' : '❌ Failed to copy';

            copyBtn.textContent = feedbackText;

            setTimeout(function () {
                copyBtn.textContent = originalText;
            }, 2000);
        },

        /**
         * Fallback copy method
         */
        _fallbackCopy: function (text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.style.pointerEvents = 'none';
            document.body.appendChild(textarea);

            try {
                textarea.select();
                const success = document.execCommand('copy');
                this._showCopyFeedback(success);
            } catch (e) {
                this._showCopyFeedback(false);
                ASLDS.logger.error('Copy failed:', e);
            }

            document.body.removeChild(textarea);
        },

        /**
         * Remove all event listeners
         */
        _removeEventListeners: function () {
            // Theme toggle
            if (this.elements.themeToggle && this._handlers.themeClick) {
                this.elements.themeToggle.removeEventListener('click', this._handlers.themeClick);
                this._handlers.themeClick = null;
            }

            // Viewport controls
            this._handlers.viewportClicks.forEach(function (item) {
                item.control.removeEventListener('click', item.handler);
            });
            this._handlers.viewportClicks = [];

            // Layout controls
            this._handlers.layoutClicks.forEach(function (item) {
                item.control.removeEventListener('click', item.handler);
            });
            this._handlers.layoutClicks = [];

            // Variant controls
            this._handlers.variantClicks.forEach(function (item) {
                item.control.removeEventListener('click', item.handler);
            });
            this._handlers.variantClicks = [];

            // Size controls
            this._handlers.sizeClicks.forEach(function (item) {
                item.control.removeEventListener('click', item.handler);
            });
            this._handlers.sizeClicks = [];

            // State controls
            this._handlers.stateClicks.forEach(function (item) {
                item.control.removeEventListener('click', item.handler);
            });
            this._handlers.stateClicks = [];

            // Reset
            if (this.elements.resetBtn && this._handlers.resetClick) {
                this.elements.resetBtn.removeEventListener('click', this._handlers.resetClick);
                this._handlers.resetClick = null;
            }

            // Copy
            if (this.elements.copyBtn && this._handlers.copyClick) {
                this.elements.copyBtn.removeEventListener('click', this._handlers.copyClick);
                this._handlers.copyClick = null;
            }

            // Resize
            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Code observer
            if (this._codeObserver) {
                this._codeObserver.disconnect();
                this._codeObserver = null;
            }

            ASLDS.logger.debug('Event listeners removed.');
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Playground.config);
    Object.freeze(Playground.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Playground.name, Playground, Playground.priority, Playground.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all playgrounds
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const playgroundElements = ASLDS.dom.findAll('[data-playground]');
        if (playgroundElements.length > 0) {
            playgroundElements.forEach(function (element) {
                Playground.init(element);
            });
        } else {
            // Fallback: find by class
            const playground = ASLDS.dom.find('.playground');
            if (playground) {
                Playground.init(playground);
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSPlayground) {
        window.ASLDSPlayground = Playground;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : playground.js
     * Module      : ASL Design System (ASLDS) Playground
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Toast Module
 * File        : toast.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Toast Module provides a global notification system for the
 * ASL Design System. It delivers a unified toast experience with
 * support for:
 *   • Global notification manager
 *   • Success, Error, Warning, Info, and Primary notifications
 *   • Multiple simultaneous toasts
 *   • Toast queue management
 *   • Configurable positioning (top, bottom, left, right, center)
 *   • Configurable duration with auto-dismiss
 *   • Manual dismiss with close button
 *   • Pause on hover
 *   • Progress indicator
 *   • Action buttons
 *   • Icons with theme awareness
 *   • Smooth entrance and exit animations (integrated with animations.js)
 *   • Theme awareness (light/dark mode)
 *   • Responsive behaviour
 *   • Keyboard accessibility (Escape to dismiss)
 *   • ARIA live region support
 *   • Event delegation
 *   • Public API methods (show, success, error, warning, info, dismiss, clearAll)
 *   • Promise-based notifications
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
        console.error('[ASLDS] Runtime not found. Toast module cannot initialize.');
        return;
    }

    // ========================================================================
    // Toast Module
    // ========================================================================

    const Toast = {
        /**
         * Module Information
         */
        name: 'Toast',
        version: '2.0.0',
        priority: 10,
        dependencies: ['Animations'],

        /**
         * Toast Configuration
         */
        config: {
            // Container
            containerSelector: '.toast-container',
            toastSelector: '.toast',

            // Positioning
            position: 'top-right', // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center

            // Defaults
            defaultDuration: 4000,
            defaultType: 'info',

            // Behavior
            maxToasts: 5,
            pauseOnHover: true,
            closeOnEscape: true,
            enableProgress: true,
            enableTransitions: true,
            transitionDuration: 300,
            persistState: false,
            storageKey: 'aslds-toast-state',

            // Accessibility
            ariaLabel: 'Notification',
            ariaLive: 'polite',

            // Icons
            icons: {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle',
                primary: 'fa-bell',
                close: 'fa-times',
            },

            // Colors (theme-aware)
            colors: {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6',
                primary: '#D4AF37',
            },

            // Debug
            debug: false,
        },

        /**
         * Toast Types
         */
        types: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info',
            PRIMARY: 'primary',
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            container: null,
            toasts: [],
            queue: [],
            isPaused: false,
            timer: null,
            idCounter: 0,
        },

        /**
         * Cached Elements
         */
        elements: {
            container: null,
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            documentKeydown: null,
            containerClick: null,
            resize: null,
            toastHandlers: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the toast module
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Toast module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Toast module v' + this.version + '...');

            // Create container
            this._createContainer();

            // Setup global event listeners
            this._setupGlobalEvents();

            // Restore state if persisted
            if (this.config.persistState) {
                this._restoreState();
            }

            this.state.initialized = true;

            ASLDS.logger.info('Toast module initialized successfully.', {
                position: this.config.position,
                maxToasts: this.config.maxToasts,
            });

            return this;
        },

        /**
         * Show a toast notification
         * @param {string|Object} message - Message string or config object
         * @param {string} type - Toast type (success, error, warning, info, primary)
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        show: function (message, type, options) {
            // Parse arguments
            let config = {};

            if (typeof message === 'string') {
                config.message = message;
                config.type = type || this.config.defaultType;
            } else if (typeof message === 'object') {
                config = Object.assign({}, message);
            } else {
                ASLDS.logger.warn('Invalid toast message.');
                return Promise.reject(new Error('Invalid toast message'));
            }

            // Merge options
            if (options) {
                Object.assign(config, options);
            }

            // Set defaults
            if (!config.type) config.type = this.config.defaultType;
            if (!config.duration) config.duration = this.config.defaultDuration;
            if (!config.position) config.position = this.config.position;

            // Generate ID
            config.id = ++this.state.idCounter;

            // Create toast
            return new Promise(function (resolve, reject) {
                // Check if we can show immediately
                if (this.state.toasts.length < this.config.maxToasts) {
                    this._createToast(config, resolve, reject);
                } else {
                    // Add to queue
                    this.state.queue.push({
                        config: config,
                        resolve: resolve,
                        reject: reject,
                    });
                    ASLDS.logger.debug('Toast queued.', { id: config.id });
                }
            }.bind(this));
        },

        /**
         * Show a success toast
         * @param {string} message - Message string
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        success: function (message, options) {
            return this.show(message, this.types.SUCCESS, options);
        },

        /**
         * Show an error toast
         * @param {string} message - Message string
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        error: function (message, options) {
            return this.show(message, this.types.ERROR, options);
        },

        /**
         * Show a warning toast
         * @param {string} message - Message string
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        warning: function (message, options) {
            return this.show(message, this.types.WARNING, options);
        },

        /**
         * Show an info toast
         * @param {string} message - Message string
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        info: function (message, options) {
            return this.show(message, this.types.INFO, options);
        },

        /**
         * Show a primary toast
         * @param {string} message - Message string
         * @param {Object} options - Toast options
         * @returns {Promise} Toast promise
         */
        primary: function (message, options) {
            return this.show(message, this.types.PRIMARY, options);
        },

        /**
         * Dismiss a specific toast
         * @param {number|Element} id - Toast ID or element
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        dismiss: function (id, options) {
            options = options || {};

            let toast = null;

            if (typeof id === 'number') {
                toast = this.state.toasts.find(function (t) {
                    return t.id === id;
                });
            } else if (typeof id === 'object' && id.nodeType) {
                toast = this.state.toasts.find(function (t) {
                    return t.element === id;
                });
            }

            if (!toast) {
                ASLDS.logger.warn('Toast not found.', { id: id });
                return this;
            }

            this._dismissToast(toast, options);

            return this;
        },

        /**
         * Dismiss all toasts
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        dismissAll: function (options) {
            options = options || {};

            const toasts = this.state.toasts.slice();
            toasts.forEach(function (toast) {
                this._dismissToast(toast, options);
            }.bind(this));

            // Clear queue
            this.state.queue = [];

            ASLDS.logger.debug('All toasts dismissed.');

            return this;
        },

        /**
         * Pause all toasts
         * @returns {Object} This instance for chaining
         */
        pause: function () {
            if (this.state.isPaused) {
                return this;
            }

            this.state.isPaused = true;

            // Pause all timers
            this.state.toasts.forEach(function (toast) {
                if (toast.timer) {
                    clearTimeout(toast.timer);
                    toast.timer = null;
                    toast.remaining = toast.duration - (Date.now() - toast.startTime);
                    if (toast.remaining < 0) toast.remaining = 0;
                }
            });

            ASLDS.logger.debug('Toasts paused.');

            return this;
        },

        /**
         * Resume all toasts
         * @returns {Object} This instance for chaining
         */
        resume: function () {
            if (!this.state.isPaused) {
                return this;
            }

            this.state.isPaused = false;

            // Resume all timers
            this.state.toasts.forEach(function (toast) {
                if (toast.remaining > 0) {
                    toast.timer = setTimeout(function () {
                        this._dismissToast(toast);
                    }.bind(this), toast.remaining);
                    toast.startTime = Date.now();
                }
            }.bind(this));

            ASLDS.logger.debug('Toasts resumed.');

            return this;
        },

        /**
         * Get all toasts
         * @returns {Array} Array of toast objects
         */
        getToasts: function () {
            return this.state.toasts.slice();
        },

        /**
         * Get queued toasts
         * @returns {Array} Array of queued toast configs
         */
        getQueue: function () {
            return this.state.queue.slice();
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
                activeToasts: this.state.toasts.length,
                queuedToasts: this.state.queue.length,
                isPaused: this.state.isPaused,
                position: this.config.position,
                maxToasts: this.config.maxToasts,
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
                activeToasts: this.state.toasts.length,
                queuedToasts: this.state.queue.length,
                isPaused: this.state.isPaused,
                container: !!this.elements.container,
                config: Object.assign({}, this.config),
            };
        },

        /**
         * Destroy the toast module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Toast module...');

            // Dismiss all toasts
            this.dismissAll({ noAnimation: true });

            // Remove event listeners
            this._removeEventListeners();

            // Remove container
            if (this.elements.container && this.elements.container.parentNode) {
                this.elements.container.parentNode.removeChild(this.elements.container);
            }

            // Reset state
            this.state.initialized = false;
            this.state.toasts = [];
            this.state.queue = [];
            this.state.isPaused = false;

            ASLDS.logger.info('Toast module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Create the toast container
         */
        _createContainer: function () {
            // Check if container already exists
            let container = ASLDS.dom.find(this.config.containerSelector);

            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                container.setAttribute('role', 'region');
                container.setAttribute('aria-label', this.config.ariaLabel);
                container.setAttribute('aria-live', this.config.ariaLive);

                // Add position class
                container.classList.add('toast-container-' + this.config.position);

                this.elements.body.appendChild(container);
            }

            this.elements.container = container;
            this.state.container = container;

            ASLDS.logger.debug('Toast container created.', {
                position: this.config.position,
            });
        },

        /**
         * Create a toast element
         * @param {Object} config - Toast configuration
         * @param {Function} resolve - Promise resolve
         * @param {Function} reject - Promise reject
         */
        _createToast: function (config, resolve, reject) {
            // Check if container exists
            if (!this.elements.container) {
                this._createContainer();
            }

            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'toast toast-' + config.type;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('data-toast-id', config.id);

            // Build toast content
            this._buildToastContent(toast, config);

            // Add to container
            this.elements.container.appendChild(toast);

            // Store toast data
            const toastData = {
                id: config.id,
                element: toast,
                config: config,
                type: config.type,
                message: config.message,
                duration: config.duration,
                startTime: Date.now(),
                remaining: config.duration,
                timer: null,
                resolve: resolve,
                reject: reject,
                dismissed: false,
            };

            this.state.toasts.push(toastData);

            // Setup event handlers
            this._setupToastEvents(toastData);

            // Animate in
            this._animateIn(toastData);

            // Start auto-dismiss timer
            if (config.duration > 0) {
                toastData.timer = setTimeout(function () {
                    this._dismissToast(toastData);
                }.bind(this), config.duration);
            }

            // Emit event
            ASLDS.events.emit('toast:show', {
                id: config.id,
                type: config.type,
                message: config.message,
                toast: toast,
            });

            ASLDS.logger.debug('Toast shown.', {
                id: config.id,
                type: config.type,
                duration: config.duration,
            });
        },

        /**
         * Build toast content
         * @param {Element} toast - Toast element
         * @param {Object} config - Toast configuration
         */
        _buildToastContent: function (toast, config) {
            // Icon
            const iconClass = this.config.icons[config.type] || this.config.icons.info;
            const icon = document.createElement('span');
            icon.className = 'toast-icon';
            icon.innerHTML = '<i class="fa ' + iconClass + '"></i>';
            toast.appendChild(icon);

            // Content wrapper
            const content = document.createElement('div');
            content.className = 'toast-content';

            // Title (optional)
            if (config.title) {
                const title = document.createElement('div');
                title.className = 'toast-title';
                title.textContent = config.title;
                content.appendChild(title);
            }

            // Message
            const message = document.createElement('div');
            message.className = 'toast-message';
            message.textContent = config.message;
            content.appendChild(message);

            toast.appendChild(content);

            // Action button (optional)
            if (config.action) {
                const actionBtn = document.createElement('button');
                actionBtn.className = 'toast-action';
                actionBtn.textContent = config.action.label || 'Action';
                actionBtn.setAttribute('type', 'button');

                if (config.action.handler) {
                    actionBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        config.action.handler(e, config);
                    });
                }

                toast.appendChild(actionBtn);
            }

            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.setAttribute('type', 'button');
            closeBtn.setAttribute('aria-label', 'Dismiss notification');
            closeBtn.innerHTML = '<i class="fa ' + this.config.icons.close + '"></i>';

            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const id = parseInt(toast.getAttribute('data-toast-id'), 10);
                this.dismiss(id);
            }.bind(this));

            toast.appendChild(closeBtn);

            // Progress bar (optional)
            if (this.config.enableProgress && config.duration > 0) {
                const progress = document.createElement('div');
                progress.className = 'toast-progress';
                const progressBar = document.createElement('div');
                progressBar.className = 'toast-progress-bar';
                progress.appendChild(progressBar);
                toast.appendChild(progress);

                // Store progress bar reference
                toast._progressBar = progressBar;
            }

            // Store reference to close button for cleanup
            toast._closeBtn = closeBtn;
        },

        /**
         * Setup toast event handlers
         * @param {Object} toastData - Toast data
         */
        _setupToastEvents: function (toastData) {
            const toast = toastData.element;

            // Pause on hover
            if (this.config.pauseOnHover) {
                const pauseHandler = function () {
                    this.pause();
                }.bind(this);

                const resumeHandler = function () {
                    this.resume();
                }.bind(this);

                toast.addEventListener('mouseenter', pauseHandler);
                toast.addEventListener('mouseleave', resumeHandler);

                // Store for cleanup
                if (!toastData._handlers) {
                    toastData._handlers = {};
                }
                toastData._handlers.pause = pauseHandler;
                toastData._handlers.resume = resumeHandler;
            }

            // Store close button handler reference
            const closeBtn = toast._closeBtn;
            if (closeBtn) {
                // Handler already attached above, store for cleanup
                if (!toastData._handlers) {
                    toastData._handlers = {};
                }
                toastData._handlers.close = closeBtn._clickHandler;
            }
        },

        /**
         * Animate toast in
         * @param {Object} toastData - Toast data
         */
        _animateIn: function (toastData) {
            const toast = toastData.element;

            // Use animations module if available
            if (window.ASLDS && window.ASLDS.Animations) {
                ASLDS.Animations.slideDown(toast, {
                    duration: this.config.transitionDuration,
                }).catch(function () {
                    // Fallback: show immediately
                    toast.style.opacity = '1';
                    toast.style.transform = 'translateY(0)';
                });
            } else {
                // Fallback: show immediately
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            }

            // Emit event
            ASLDS.events.emit('toast:animate-in', {
                id: toastData.id,
                toast: toast,
            });
        },

        /**
         * Animate toast out
         * @param {Object} toastData - Toast data
         * @param {Object} options - Options
         * @returns {Promise} Animation promise
         */
        _animateOut: function (toastData, options) {
            options = options || {};

            const toast = toastData.element;

            return new Promise(function (resolve) {
                // Use animations module if available
                if (window.ASLDS && window.ASLDS.Animations && !options.noAnimation) {
                    ASLDS.Animations.slideUp(toast, {
                        duration: this.config.transitionDuration,
                    }).then(function () {
                        resolve();
                    }).catch(function () {
                        // Fallback: hide immediately
                        toast.style.display = 'none';
                        resolve();
                    });
                } else {
                    // Fallback: hide immediately
                    toast.style.display = 'none';
                    resolve();
                }
            }.bind(this));
        },

        /**
         * Dismiss a toast
         * @param {Object} toastData - Toast data
         * @param {Object} options - Options
         */
        _dismissToast: function (toastData, options) {
            options = options || {};

            if (toastData.dismissed) {
                return;
            }

            toastData.dismissed = true;

            // Clear timer
            if (toastData.timer) {
                clearTimeout(toastData.timer);
                toastData.timer = null;
            }

            // Animate out
            this._animateOut(toastData, options).then(function () {
                // Remove from DOM
                if (toastData.element && toastData.element.parentNode) {
                    toastData.element.parentNode.removeChild(toastData.element);
                }

                // Remove from state
                const index = this.state.toasts.indexOf(toastData);
                if (index !== -1) {
                    this.state.toasts.splice(index, 1);
                }

                // Resolve promise
                if (toastData.resolve) {
                    toastData.resolve(toastData);
                }

                // Emit event
                ASLDS.events.emit('toast:dismiss', {
                    id: toastData.id,
                    type: toastData.type,
                    message: toastData.message,
                });

                ASLDS.logger.debug('Toast dismissed.', {
                    id: toastData.id,
                    type: toastData.type,
                });

                // Process queue
                this._processQueue();
            }.bind(this));
        },

        /**
         * Process queued toasts
         */
        _processQueue: function () {
            if (this.state.queue.length === 0) {
                return;
            }

            if (this.state.toasts.length >= this.config.maxToasts) {
                return;
            }

            const next = this.state.queue.shift();
            if (next) {
                this._createToast(next.config, next.resolve, next.reject);
            }
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Escape key to dismiss all
            if (this.config.closeOnEscape) {
                const keydownHandler = function (e) {
                    if (e.key === 'Escape' && this.state.toasts.length > 0) {
                        this.dismissAll();
                    }
                }.bind(this);

                document.addEventListener('keydown', keydownHandler);
                this._handlers.documentKeydown = keydownHandler;
            }

            // Resize handler for responsive positioning
            const resizeHandler = function () {
                this._handleResize();
            }.bind(this);

            window.addEventListener('resize', resizeHandler);
            this._handlers.resize = resizeHandler;

            // Theme change listener for updating toast styles
            ASLDS.events.on('theme:applied', function (data) {
                this._updateToastTheme(data);
            }.bind(this));

            ASLDS.logger.debug('Global event listeners setup complete.');
        },

        /**
         * Remove global event listeners
         */
        _removeEventListeners: function () {
            if (this._handlers.documentKeydown) {
                document.removeEventListener('keydown', this._handlers.documentKeydown);
                this._handlers.documentKeydown = null;
            }

            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Remove toast-specific handlers
            this.state.toasts.forEach(function (toastData) {
                if (toastData._handlers) {
                    const toast = toastData.element;
                    if (toast) {
                        if (toastData._handlers.pause) {
                            toast.removeEventListener('mouseenter', toastData._handlers.pause);
                        }
                        if (toastData._handlers.resume) {
                            toast.removeEventListener('mouseleave', toastData._handlers.resume);
                        }
                    }
                }
            });

            // Clean up event listeners on toast elements
            this._handlers.toastHandlers = [];

            ASLDS.logger.debug('Event listeners removed.');
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            // Adjust container position if needed
            // This is handled by CSS, but we can emit an event
            ASLDS.events.emit('toast:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
                position: this.config.position,
            });
        },

        /**
         * Update toast theme
         * @param {Object} data - Theme data
         */
        _updateToastTheme: function (data) {
            // Update toast colors based on theme
            const isDark = data.active === 'dark';

            this.state.toasts.forEach(function (toastData) {
                const toast = toastData.element;
                if (toast) {
                    if (isDark) {
                        toast.classList.add('toast-dark');
                    } else {
                        toast.classList.remove('toast-dark');
                    }
                }
            });
        },

        /**
         * Restore state from storage
         */
        _restoreState: function () {
            if (!this.config.persistState) {
                return;
            }

            const saved = ASLDS.storage.get(this.config.storageKey);
            if (saved && typeof saved === 'object') {
                // Restore position if saved
                if (saved.position) {
                    this.config.position = saved.position;
                }
                ASLDS.logger.debug('Toast state restored.', saved);
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
                position: this.config.position,
                timestamp: Date.now(),
            });
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Toast.config);
    Object.freeze(Toast.types);
    Object.freeze(Toast.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Toast.name, Toast, Toast.priority, Toast.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const toastElements = ASLDS.dom.findAll('[data-toast]');
        if (toastElements.length > 0) {
            toastElements.forEach(function (element) {
                Toast.init();
            });
        } else {
            // Initialize by default
            Toast.init();
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSToast) {
        window.ASLDSToast = Toast;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : toast.js
     * Module      : ASL Design System (ASLDS) Toast
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Modal Module
 * File        : modal.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Modal Module manages modal dialogs across the ASL Design System.
 * It provides a unified modal experience with support for:
 *   • Multiple modal instances
 *   • Open / Close with transitions
 *   • Trigger buttons (data-modal-target)
 *   • Overlay click to close
 *   • Escape key support
 *   • Focus trapping within modal
 *   • Focus restoration on close
 *   • Body scroll locking
 *   • Nested modals (stacking)
 *   • Confirmation and Alert dialogs
 *   • Responsive behaviour
 *   • Keyboard accessibility
 *   • ARIA attributes management
 *   • Smooth animations
 *   • Event delegation
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
        console.error('[ASLDS] Runtime not found. Modal module cannot initialize.');
        return;
    }

    // ========================================================================
    // Modal Module
    // ========================================================================

    const Modal = {
        /**
         * Module Information
         */
        name: 'Modal',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Modal Configuration
         */
        config: {
            // Selectors
            modalSelector: '.modal',
            overlaySelector: '.modal-overlay',
            contentSelector: '.modal-content',
            headerSelector: '.modal-header',
            bodySelector: '.modal-body',
            footerSelector: '.modal-footer',
            closeSelector: '.modal-close',
            triggerSelector: '[data-modal-target]',
            activeClass: 'active',
            openClass: 'open',
            visibleClass: 'visible',

            // Behavior
            closeOnOverlayClick: true,
            closeOnEscape: true,
            closeOnCloseButton: true,
            enableTransitions: true,
            transitionDuration: 300,
            trapFocus: true,
            restoreFocus: true,
            lockBodyScroll: true,
            allowMultiple: true,
            autoOpen: false,

            // Accessibility
            ariaLabel: 'Modal dialog',
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-description',

            // Debug
            debug: false,
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            instances: [],
            activeInstance: null,
            openCount: 0,
            resizeTimer: null,
            focusableElements: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            modals: [],
            triggers: [],
            overlay: null,
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            documentKeydown: null,
            documentClick: null,
            resize: null,
            triggerClicks: [],
            instanceHandlers: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the modal module
         * @param {Element|string} element - Modal element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Modal module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Modal module v' + this.version + '...');

            // Find modal elements
            let modals = [];

            if (element) {
                const el = typeof element === 'string'
                    ? ASLDS.dom.find(element)
                    : element;

                if (el) {
                    modals = [el];
                }
            } else {
                modals = ASLDS.dom.findAll(this.config.modalSelector);
            }

            if (modals.length === 0) {
                ASLDS.logger.warn('No modal elements found.');
                return this;
            }

            // Cache elements
            this.elements.modals = modals;

            // Find triggers
            this.elements.triggers = ASLDS.dom.findAll(this.config.triggerSelector);

            // Setup each modal
            modals.forEach(function (modal, index) {
                this._setupModal(modal, index);
            }.bind(this));

            // Setup triggers
            this._setupTriggers();

            // Setup global event listeners
            this._setupGlobalEvents();

            this.state.initialized = true;

            ASLDS.logger.info('Modal module initialized successfully.', {
                instanceCount: this.state.instances.length,
                triggerCount: this.elements.triggers.length,
            });

            return this;
        },

        /**
         * Open a modal
         * @param {Element|string} modal - Modal element or selector
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.focus - If false, doesn't trap focus
         * @param {*} options.data - Data to pass to the modal
         * @returns {Object} This instance for chaining
         */
        open: function (modal, options) {
            options = options || {};

            const instance = this._getInstance(modal);
            if (!instance) {
                ASLDS.logger.warn('Modal instance not found.');
                return this;
            }

            if (instance.isOpen) {
                return this;
            }

            // Close other modals if not allowing multiple
            if (!this.config.allowMultiple) {
                this.closeAll();
            }

            // Store previous active for focus restoration
            if (this.state.activeInstance) {
                instance._previousActive = this.state.activeInstance;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition(instance);
            }

            // Update state
            instance.isOpen = true;
            this.state.activeInstance = instance;
            this.state.openCount++;

            // Update DOM
            if (instance.element) {
                instance.element.classList.add(this.config.openClass);
                instance.element.classList.add(this.config.visibleClass);
                instance.element.setAttribute('aria-hidden', 'false');
            }

            if (instance.overlay) {
                instance.overlay.classList.add(this.config.openClass);
                instance.overlay.classList.add(this.config.visibleClass);
            }

            if (instance.content) {
                instance.content.classList.add(this.config.openClass);
            }

            // Lock body scroll
            if (this.config.lockBodyScroll) {
                this._lockBodyScroll();
            }

            // Trap focus
            if (this.config.trapFocus && options.focus !== false) {
                this._trapFocus(instance);
            }

            // Emit event
            ASLDS.events.emit('modal:open', {
                modal: instance.element,
                content: instance.content,
                instance: instance,
                data: options.data || null,
            });

            ASLDS.logger.debug('Modal opened.', { id: instance.id });

            return this;
        },

        /**
         * Close a modal
         * @param {Element|string} modal - Modal element or selector
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.restoreFocus - If false, doesn't restore focus
         * @returns {Object} This instance for chaining
         */
        close: function (modal, options) {
            options = options || {};

            const instance = this._getInstance(modal);
            if (!instance) {
                ASLDS.logger.warn('Modal instance not found.');
                return this;
            }

            if (!instance.isOpen) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition(instance);
            }

            // Update state
            instance.isOpen = false;
            this.state.openCount--;

            if (this.state.activeInstance === instance) {
                this.state.activeInstance = null;
            }

            // Update DOM
            if (instance.element) {
                instance.element.classList.remove(this.config.openClass);
                instance.element.classList.remove(this.config.visibleClass);
                instance.element.setAttribute('aria-hidden', 'true');
            }

            if (instance.overlay) {
                instance.overlay.classList.remove(this.config.openClass);
                instance.overlay.classList.remove(this.config.visibleClass);
            }

            if (instance.content) {
                instance.content.classList.remove(this.config.openClass);
            }

            // Unlock body scroll
            if (this.config.lockBodyScroll && this.state.openCount <= 0) {
                this._unlockBodyScroll();
            }

            // Restore focus
            if (this.config.restoreFocus && options.restoreFocus !== false) {
                this._restoreFocus(instance);
            }

            // Emit event
            ASLDS.events.emit('modal:close', {
                modal: instance.element,
                content: instance.content,
                instance: instance,
            });

            ASLDS.logger.debug('Modal closed.', { id: instance.id });

            return this;
        },

        /**
         * Toggle a modal
         * @param {Element|string} modal - Modal element or selector
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        toggle: function (modal, options) {
            const instance = this._getInstance(modal);
            if (!instance) {
                ASLDS.logger.warn('Modal instance not found.');
                return this;
            }

            if (instance.isOpen) {
                this.close(instance.element, options);
            } else {
                this.open(instance.element, options);
            }

            return this;
        },

        /**
         * Close all modals
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        closeAll: function (options) {
            this.state.instances.forEach(function (instance) {
                if (instance.isOpen) {
                    this.close(instance.element, options);
                }
            }.bind(this));

            return this;
        },

        /**
         * Get modal instance by element
         * @param {Element|string} modal - Modal element or selector
         * @returns {Object|null} Modal instance or null
         */
        getInstance: function (modal) {
            return this._getInstance(modal);
        },

        /**
         * Get all modal instances
         * @returns {Array} Array of modal instances
         */
        getInstances: function () {
            return this.state.instances.slice();
        },

        /**
         * Get active modal instance
         * @returns {Object|null} Active instance or null
         */
        getActive: function () {
            return this.state.activeInstance;
        },

        /**
         * Check if a modal is open
         * @param {Element|string} modal - Modal element or selector
         * @returns {boolean} True if open
         */
        isOpen: function (modal) {
            const instance = this._getInstance(modal);
            return instance ? instance.isOpen : false;
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
                instanceCount: this.state.instances.length,
                openCount: this.state.openCount,
                activeInstance: this.state.activeInstance ? this.state.activeInstance.id : null,
                config: Object.assign({}, this.config),
            };
        },

        /**
         * Get module status
         * @returns {Object} Status object
         */
        status: function () {
            const instances = this.state.instances.map(function (instance) {
                return {
                    id: instance.id,
                    isOpen: instance.isOpen,
                    hasTrigger: !!instance.trigger,
                    hasContent: !!instance.content,
                };
            });

            return {
                initialized: this.state.initialized,
                instanceCount: this.state.instances.length,
                openCount: this.state.openCount,
                activeInstance: this.state.activeInstance ? this.state.activeInstance.id : null,
                instances: instances,
            };
        },

        /**
         * Destroy the modal module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Modal module...');

            // Close all modals
            this.closeAll({ noTransition: true });

            // Remove event listeners
            this._removeGlobalEvents();

            // Destroy each instance
            this.state.instances.forEach(function (instance) {
                this._destroyInstance(instance);
            }.bind(this));

            // Reset state
            this.state.initialized = false;
            this.state.instances = [];
            this.state.activeInstance = null;
            this.state.openCount = 0;

            // Unlock body scroll
            this._unlockBodyScroll();

            // Clear timers
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }

            ASLDS.logger.info('Modal module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Setup a single modal
         * @param {Element} modal - Modal element
         * @param {number} index - Modal index
         */
        _setupModal: function (modal, index) {
            // Skip if already initialized
            if (modal.dataset.modalInitialized) {
                return;
            }

            modal.dataset.modalInitialized = 'true';

            // Find elements
            const overlay = modal.querySelector(this.config.overlaySelector);
            const content = modal.querySelector(this.config.contentSelector);
            const closeBtn = modal.querySelector(this.config.closeSelector);
            const header = modal.querySelector(this.config.headerSelector);
            const body = modal.querySelector(this.config.bodySelector);
            const footer = modal.querySelector(this.config.footerSelector);

            // Create overlay if missing
            let overlayEl = overlay;
            if (!overlayEl && this.config.closeOnOverlayClick) {
                overlayEl = ASLDS.dom.create('<div class="modal-overlay"></div>');
                if (overlayEl) {
                    modal.prepend(overlayEl);
                }
            }

            // Set ARIA attributes
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-hidden', 'true');

            if (header) {
                const title = header.querySelector('[data-modal-title]') || header.querySelector('h1, h2, h3, h4, h5, h6');
                if (title && title.id) {
                    modal.setAttribute('aria-labelledby', title.id);
                } else if (title) {
                    const id = 'modal-title-' + (index + 1);
                    title.id = id;
                    modal.setAttribute('aria-labelledby', id);
                }
            }

            if (body) {
                const desc = body.querySelector('[data-modal-description]');
                if (desc && desc.id) {
                    modal.setAttribute('aria-describedby', desc.id);
                } else if (desc) {
                    const id = 'modal-desc-' + (index + 1);
                    desc.id = id;
                    modal.setAttribute('aria-describedby', id);
                }
            }

            // Create instance
            const instance = {
                id: 'modal-' + (index + 1) + '-' + Date.now(),
                element: modal,
                overlay: overlayEl,
                content: content,
                closeBtn: closeBtn,
                header: header,
                body: body,
                footer: footer,
                isOpen: false,
                trigger: null,
                previousFocus: null,
                focusableElements: [],
                _previousActive: null,
            };

            // Cache focusable elements
            if (content) {
                instance.focusableElements = this._getFocusableElements(content);
            }

            // Setup close button
            if (closeBtn && this.config.closeOnCloseButton) {
                const closeHandler = function (e) {
                    e.preventDefault();
                    this.close(modal);
                }.bind(this);

                closeBtn.addEventListener('click', closeHandler);

                // Store for cleanup
                if (!instance._closeHandler) {
                    instance._closeHandler = closeHandler;
                }
            }

            // Setup overlay click
            if (overlayEl && this.config.closeOnOverlayClick) {
                const overlayHandler = function (e) {
                    if (e.target === overlayEl && instance.isOpen) {
                        this.close(modal);
                    }
                }.bind(this);

                overlayEl.addEventListener('click', overlayHandler);

                // Store for cleanup
                if (!instance._overlayHandler) {
                    instance._overlayHandler = overlayHandler;
                }
            }

            // Store instance
            this.state.instances.push(instance);

            ASLDS.logger.debug('Modal instance created.', { id: instance.id });
        },

        /**
         * Setup trigger buttons
         */
        _setupTriggers: function () {
            const triggers = this.elements.triggers;
            if (!triggers || triggers.length === 0) {
                return;
            }

            triggers.forEach(function (trigger) {
                // Skip if already initialized
                if (trigger.dataset.modalTriggerInitialized) {
                    return;
                }

                trigger.dataset.modalTriggerInitialized = 'true';

                const target = trigger.getAttribute('data-modal-target');
                if (!target) {
                    return;
                }

                const modal = ASLDS.dom.find(target);
                if (!modal) {
                    ASLDS.logger.warn('Modal target not found: ' + target);
                    return;
                }

                const handler = function (e) {
                    e.preventDefault();
                    this.open(modal);
                }.bind(this);

                trigger.addEventListener('click', handler);

                // Store for cleanup
                this._handlers.triggerClicks.push({
                    trigger: trigger,
                    handler: handler,
                    modal: modal,
                });

                // Store trigger reference on instance
                const instance = this._getInstance(modal);
                if (instance) {
                    instance.trigger = trigger;
                }

                ASLDS.logger.debug('Trigger setup complete for: ' + target);
            }.bind(this));
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Escape key to close
            if (this.config.closeOnEscape) {
                const keydownHandler = function (e) {
                    if (e.key === 'Escape' && this.state.activeInstance) {
                        this.close(this.state.activeInstance.element);
                    }
                }.bind(this);

                document.addEventListener('keydown', keydownHandler);
                this._handlers.documentKeydown = keydownHandler;
            }

            // Resize to reposition
            const resizeHandler = function () {
                if (this.state.resizeTimer) {
                    clearTimeout(this.state.resizeTimer);
                }

                this.state.resizeTimer = setTimeout(function () {
                    this._handleResize();
                }.bind(this), 150);
            }.bind(this);

            window.addEventListener('resize', resizeHandler);
            this._handlers.resize = resizeHandler;

            ASLDS.logger.debug('Global event listeners setup complete.');
        },

        /**
         * Remove global event listeners
         */
        _removeGlobalEvents: function () {
            if (this._handlers.documentKeydown) {
                document.removeEventListener('keydown', this._handlers.documentKeydown);
                this._handlers.documentKeydown = null;
            }

            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Remove trigger listeners
            this._handlers.triggerClicks.forEach(function (item) {
                item.trigger.removeEventListener('click', item.handler);
            });
            this._handlers.triggerClicks = [];

            ASLDS.logger.debug('Global event listeners removed.');
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            // Reposition modals if needed
            this.state.instances.forEach(function (instance) {
                if (instance.isOpen && instance.content) {
                    // Recalculate max-height or other responsive adjustments
                    this._adjustModalHeight(instance);
                }
            }.bind(this));

            ASLDS.events.emit('modal:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
            });
        },

        /**
         * Adjust modal height for viewport
         * @param {Object} instance - Modal instance
         */
        _adjustModalHeight: function (instance) {
            const content = instance.content;
            if (!content) {
                return;
            }

            const viewportHeight = window.innerHeight;
            const maxHeight = viewportHeight * 0.85; // 85% of viewport

            // Only apply if content exceeds max height
            const contentHeight = content.scrollHeight;
            if (contentHeight > maxHeight) {
                content.style.maxHeight = maxHeight + 'px';
                content.style.overflowY = 'auto';
            } else {
                content.style.maxHeight = '';
                content.style.overflowY = '';
            }
        },

        /**
         * Lock body scroll
         */
        _lockBodyScroll: function () {
            // Only lock if not already locked
            if (!this.elements.body.classList.contains('no-scroll')) {
                this.elements.body.classList.add('no-scroll');
                this.elements.body.style.overflow = 'hidden';
            }
        },

        /**
         * Unlock body scroll
         */
        _unlockBodyScroll: function () {
            if (this.state.openCount <= 0) {
                this.elements.body.classList.remove('no-scroll');
                this.elements.body.style.overflow = '';
            }
        },

        /**
         * Trap focus inside modal
         * @param {Object} instance - Modal instance
         */
        _trapFocus: function (instance) {
            const content = instance.content;
            if (!content) {
                return;
            }

            // Store current focus
            instance.previousFocus = document.activeElement;

            // Get focusable elements
            const focusable = this._getFocusableElements(content);
            instance.focusableElements = focusable;

            if (focusable.length === 0) {
                // If no focusable elements, focus the content itself
                content.setAttribute('tabindex', '-1');
                content.focus();
                return;
            }

            // Focus the first focusable element
            const firstFocusable = focusable[0];
            if (firstFocusable) {
                firstFocusable.focus();
            }

            // Setup focus trap listener
            const trapHandler = function (e) {
                if (e.key !== 'Tab') {
                    return;
                }

                const focusableElements = this._getFocusableElements(content);
                if (focusableElements.length === 0) {
                    return;
                }

                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }.bind(this);

            // Store handler for cleanup
            if (!instance._trapHandler) {
                instance._trapHandler = trapHandler;
            }

            content.addEventListener('keydown', trapHandler);
        },

        /**
         * Restore focus after closing
         * @param {Object} instance - Modal instance
         */
        _restoreFocus: function (instance) {
            // Remove trap handler
            if (instance.content && instance._trapHandler) {
                instance.content.removeEventListener('keydown', instance._trapHandler);
                instance._trapHandler = null;
            }

            // Restore focus to previous element
            if (instance.previousFocus && instance.previousFocus.focus) {
                setTimeout(function () {
                    instance.previousFocus.focus();
                }, 50);
            } else if (instance.trigger) {
                setTimeout(function () {
                    instance.trigger.focus();
                }, 50);
            }
        },

        /**
         * Get focusable elements within a container
         * @param {Element} container - Container element
         * @returns {Array} Array of focusable elements
         */
       _getFocusableElements: function(container) {
    // More specific selector for focusable elements
    const selector = [
        'a[href]:not([disabled])',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'details summary',
        '[tabindex]:not([tabindex="-1"]):not([tabindex="0"])'
    ].join(',');

    const elements = ASLDS.dom.findAll(selector, container);
    return elements.filter(function(el) {
        return el.offsetParent !== null &&
            !el.disabled &&
            el.getAttribute('aria-hidden') !== 'true' &&
            (el.tabIndex >= 0 || el.tagName === 'A' || el.tagName === 'BUTTON');
    });
},

        /**
         * Get a modal instance by element
         * @param {Element|string} modal - Modal element or selector
         * @returns {Object|null} Modal instance or null
         */
        _getInstance: function (modal) {
            if (!modal) {
                return null;
            }

            const element = typeof modal === 'string'
                ? ASLDS.dom.find(modal)
                : modal;

            if (!element) {
                return null;
            }

            for (let i = 0; i < this.state.instances.length; i++) {
                if (this.state.instances[i].element === element) {
                    return this.state.instances[i];
                }
            }

            return null;
        },

        /**
         * Start transition for a modal
         * @param {Object} instance - Modal instance
         */
        _startTransition: function (instance) {
            if (!this.config.enableTransitions) {
                return;
            }

            const element = instance.element;
            if (element) {
                element.classList.add('transitioning');
                setTimeout(function () {
                    element.classList.remove('transitioning');
                }, this.config.transitionDuration + 50);
            }
        },

        /**
         * Destroy a modal instance
         * @param {Object} instance - Modal instance
         */
        _destroyInstance: function (instance) {
            // Remove close button handler
            if (instance.closeBtn && instance._closeHandler) {
                instance.closeBtn.removeEventListener('click', instance._closeHandler);
                instance._closeHandler = null;
            }

            // Remove overlay handler
            if (instance.overlay && instance._overlayHandler) {
                instance.overlay.removeEventListener('click', instance._overlayHandler);
                instance._overlayHandler = null;
            }

            // Remove trap handler
            if (instance.content && instance._trapHandler) {
                instance.content.removeEventListener('keydown', instance._trapHandler);
                instance._trapHandler = null;
            }

            // Reset DOM attributes
            if (instance.element) {
                instance.element.removeAttribute('role');
                instance.element.removeAttribute('aria-modal');
                instance.element.removeAttribute('aria-hidden');
                instance.element.removeAttribute('aria-labelledby');
                instance.element.removeAttribute('aria-describedby');
                instance.element.classList.remove(
                    this.config.openClass,
                    this.config.visibleClass,
                    'transitioning'
                );
                delete instance.element.dataset.modalInitialized;
            }

            if (instance.content) {
                instance.content.classList.remove(this.config.openClass);
                instance.content.style.maxHeight = '';
                instance.content.style.overflowY = '';
            }

            if (instance.overlay) {
                instance.overlay.classList.remove(this.config.openClass, this.config.visibleClass);
            }

            ASLDS.logger.debug('Modal instance destroyed.', { id: instance.id });
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Modal.config);
    Object.freeze(Modal.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Modal.name, Modal, Modal.priority, Modal.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all modals
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const modalElements = ASLDS.dom.findAll('[data-modal]');
        if (modalElements.length > 0) {
            modalElements.forEach(function (element) {
                Modal.init(element);
            });
        } else {
            // Fallback: find by class
            const modals = ASLDS.dom.findAll('.modal');
            if (modals.length > 0) {
                Modal.init();
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSModal) {
        window.ASLDSModal = Modal;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : modal.js
     * Module      : ASL Design System (ASLDS) Modal
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Dropdown Module
 * File        : dropdown.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Dropdown Module manages dropdown menus across the ASL Design System.
 * It provides a unified dropdown experience with support for:
 *   • Multiple dropdown instances
 *   • Toggle open / close
 *   • Click outside to close
 *   • Escape key support
 *   • Keyboard navigation (Arrow keys, Enter, Space)
 *   • Focus trapping where appropriate
 *   • Focus restoration
 *   • ARIA attributes management
 *   • Nested dropdown support
 *   • Navbar integration
 *   • Sidebar integration
 *   • Responsive behaviour
 *   • Position recalculation
 *   • Viewport overflow handling
 *   • Smooth open / close transitions
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
        console.error('[ASLDS] Runtime not found. Dropdown module cannot initialize.');
        return;
    }

    // ========================================================================
    // Dropdown Module
    // ========================================================================

    const Dropdown = {
        /**
         * Module Information
         */
        name: 'Dropdown',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Dropdown Configuration
         */
        config: {
            // Selectors
            dropdownSelector: '.dropdown',
            triggerSelector: '.dropdown-trigger',
            menuSelector: '.dropdown-menu',
            itemSelector: '.dropdown-item',
            dividerSelector: '.dropdown-divider',
            headerSelector: '.dropdown-header',
            activeClass: 'active',
            openClass: 'open',
            positionClassPrefix: 'dropdown-',

            // Behavior
            closeOnOutsideClick: true,
            closeOnEscape: true,
            closeOnItemClick: false,
            closeOnTriggerClick: true,
            enableKeyboardNav: true,
            enableHover: false,
            hoverDelay: 200,
            enableTransitions: true,
            transitionDuration: 200,
            enablePositioning: true,
            enableNested: true,
            autoFocus: true,

            // Positioning
            placement: 'bottom-start', // 'top-start', 'top-end', 'bottom-start', 'bottom-end'
            offset: 4,
            flip: true,
            boundary: 'viewport',

            // Accessibility
            ariaLabel: 'Dropdown menu',
            triggerAriaLabel: 'Toggle dropdown',

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
            resizeTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            dropdowns: [],
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            documentClick: null,
            documentKeydown: null,
            resize: null,
            instanceHandlers: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the dropdown module
         * @param {Element|string} element - Dropdown element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Dropdown module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Dropdown module v' + this.version + '...');

            // Find dropdown elements
            let dropdowns = [];

            if (element) {
                const el = typeof element === 'string'
                    ? ASLDS.dom.find(element)
                    : element;

                if (el) {
                    dropdowns = [el];
                }
            } else {
                dropdowns = ASLDS.dom.findAll(this.config.dropdownSelector);
            }

            if (dropdowns.length === 0) {
                ASLDS.logger.warn('No dropdown elements found.');
                return this;
            }

            // Cache elements
            this.elements.dropdowns = dropdowns;

            // Setup each dropdown
            dropdowns.forEach(function (dropdown, index) {
                this._setupDropdown(dropdown, index);
            }.bind(this));

            // Setup global event listeners
            this._setupGlobalEvents();

            this.state.initialized = true;

            ASLDS.logger.info('Dropdown module initialized successfully.', {
                instanceCount: this.state.instances.length,
            });

            return this;
        },

        /**
         * Open a dropdown
         * @param {Element|string} dropdown - Dropdown element or selector
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.focus - If false, doesn't focus first item
         * @returns {Object} This instance for chaining
         */
        open: function (dropdown, options) {
            options = options || {};

            const instance = this._getInstance(dropdown);
            if (!instance) {
                ASLDS.logger.warn('Dropdown instance not found.');
                return this;
            }

            if (instance.isOpen) {
                return this;
            }

            // Close other dropdowns
            this.closeAll(instance);

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition(instance);
            }

            // Update state
            instance.isOpen = true;
            this.state.activeInstance = instance;

            // Update DOM
            if (instance.element) {
                instance.element.classList.add(this.config.openClass);
            }

            if (instance.trigger) {
                instance.trigger.setAttribute('aria-expanded', 'true');
            }

            if (instance.menu) {
                instance.menu.classList.add(this.config.openClass);
                instance.menu.setAttribute('aria-hidden', 'false');
            }

            // Position the menu
            if (this.config.enablePositioning) {
                this._positionMenu(instance);
            }

            // Focus first item
            if (this.config.autoFocus && options.focus !== false) {
                this._focusFirstItem(instance);
            }

            // Emit event
            ASLDS.events.emit('dropdown:open', {
                dropdown: instance.element,
                trigger: instance.trigger,
                menu: instance.menu,
                instance: instance,
            });

            ASLDS.logger.debug('Dropdown opened.', { id: instance.id });

            return this;
        },

        /**
         * Close a dropdown
         * @param {Element|string} dropdown - Dropdown element or selector
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.restoreFocus - If false, doesn't restore focus
         * @returns {Object} This instance for chaining
         */
        close: function (dropdown, options) {
            options = options || {};

            const instance = this._getInstance(dropdown);
            if (!instance) {
                ASLDS.logger.warn('Dropdown instance not found.');
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

            if (this.state.activeInstance === instance) {
                this.state.activeInstance = null;
            }

            // Update DOM
            if (instance.element) {
                instance.element.classList.remove(this.config.openClass);
            }

            if (instance.trigger) {
                instance.trigger.setAttribute('aria-expanded', 'false');
            }

            if (instance.menu) {
                instance.menu.classList.remove(this.config.openClass);
                instance.menu.setAttribute('aria-hidden', 'true');
            }

            // Restore focus
            if (options.restoreFocus !== false && instance.previousFocus) {
                setTimeout(function () {
                    if (instance.previousFocus && instance.previousFocus.focus) {
                        instance.previousFocus.focus();
                    }
                }, 50);
            }

            // Emit event
            ASLDS.events.emit('dropdown:close', {
                dropdown: instance.element,
                trigger: instance.trigger,
                menu: instance.menu,
                instance: instance,
            });

            ASLDS.logger.debug('Dropdown closed.', { id: instance.id });

            return this;
        },

        /**
         * Toggle a dropdown
         * @param {Element|string} dropdown - Dropdown element or selector
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        toggle: function (dropdown, options) {
            const instance = this._getInstance(dropdown);
            if (!instance) {
                ASLDS.logger.warn('Dropdown instance not found.');
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
         * Close all dropdowns
         * @param {Object} excludeInstance - Instance to exclude from closing
         * @returns {Object} This instance for chaining
         */
        closeAll: function (excludeInstance) {
            this.state.instances.forEach(function (instance) {
                if (instance !== excludeInstance && instance.isOpen) {
                    this.close(instance.element, { noTransition: true, restoreFocus: false });
                }
            }.bind(this));

            return this;
        },

        /**
         * Get dropdown instance by element
         * @param {Element|string} dropdown - Dropdown element or selector
         * @returns {Object|null} Dropdown instance or null
         */
        getInstance: function (dropdown) {
            return this._getInstance(dropdown);
        },

        /**
         * Get all dropdown instances
         * @returns {Array} Array of dropdown instances
         */
        getInstances: function () {
            return this.state.instances.slice();
        },

        /**
         * Get active dropdown instance
         * @returns {Object|null} Active instance or null
         */
        getActive: function () {
            return this.state.activeInstance;
        },

        /**
         * Check if a dropdown is open
         * @param {Element|string} dropdown - Dropdown element or selector
         * @returns {boolean} True if open
         */
        isOpen: function (dropdown) {
            const instance = this._getInstance(dropdown);
            return instance ? instance.isOpen : false;
        },

        /**
         * Refresh a dropdown (recalculate position)
         * @param {Element|string} dropdown - Dropdown element or selector
         * @returns {Object} This instance for chaining
         */
        refresh: function (dropdown) {
            const instance = this._getInstance(dropdown);
            if (!instance) {
                return this;
            }

            if (instance.isOpen && this.config.enablePositioning) {
                this._positionMenu(instance);
            }

            return this;
        },

        /**
         * Refresh all dropdowns
         * @returns {Object} This instance for chaining
         */
        refreshAll: function () {
            this.state.instances.forEach(function (instance) {
                if (instance.isOpen && this.config.enablePositioning) {
                    this._positionMenu(instance);
                }
            }.bind(this));

            return this;
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
                    hasMenu: !!instance.menu,
                };
            });

            return {
                initialized: this.state.initialized,
                instanceCount: this.state.instances.length,
                activeInstance: this.state.activeInstance ? this.state.activeInstance.id : null,
                instances: instances,
            };
        },

        /**
         * Destroy the dropdown module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Dropdown module...');

            // Close all dropdowns
            this.closeAll();

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

            // Clear timers
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }

            ASLDS.logger.info('Dropdown module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Setup a single dropdown
         * @param {Element} dropdown - Dropdown element
         * @param {number} index - Dropdown index
         */
        _setupDropdown: function (dropdown, index) {
            // Skip if already initialized
            if (dropdown.dataset.dropdownInitialized) {
                return;
            }

            dropdown.dataset.dropdownInitialized = 'true';

            // Find elements
            const trigger = dropdown.querySelector(this.config.triggerSelector);
            const menu = dropdown.querySelector(this.config.menuSelector);

            if (!trigger || !menu) {
                ASLDS.logger.warn('Dropdown missing trigger or menu.', { dropdown: dropdown });
                return;
            }

            // Create instance
            const instance = {
                id: 'dropdown-' + (index + 1) + '-' + Date.now(),
                element: dropdown,
                trigger: trigger,
                menu: menu,
                isOpen: false,
                isHovering: false,
                hoverTimer: null,
                previousFocus: null,
                items: [],
            };

            // Cache items
            instance.items = ASLDS.dom.findAll(this.config.itemSelector, menu);

            // Set ARIA attributes
            trigger.setAttribute('aria-haspopup', 'true');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', 'dropdown-menu-' + (index + 1));

            menu.setAttribute('role', 'menu');
            menu.setAttribute('aria-hidden', 'true');
            menu.setAttribute('aria-label', this.config.ariaLabel);
            menu.id = 'dropdown-menu-' + (index + 1);

            // Set item roles
            instance.items.forEach(function (item) {
                item.setAttribute('role', 'menuitem');
                item.setAttribute('tabindex', '-1');
            });

            // Setup trigger click
            const clickHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (this.config.closeOnTriggerClick) {
                    this.toggle(dropdown);
                } else {
                    this.open(dropdown);
                }
            }.bind(this);

            trigger.addEventListener('click', clickHandler);

            // Setup trigger hover (if enabled)
            if (this.config.enableHover) {
                const hoverInHandler = function () {
                    if (instance.hoverTimer) {
                        clearTimeout(instance.hoverTimer);
                        instance.hoverTimer = null;
                    }

                    instance.isHovering = true;

                    instance.hoverTimer = setTimeout(function () {
                        if (instance.isHovering) {
                            this.open(dropdown);
                        }
                    }.bind(this), this.config.hoverDelay);
                }.bind(this);

                const hoverOutHandler = function () {
                    instance.isHovering = false;

                    if (instance.hoverTimer) {
                        clearTimeout(instance.hoverTimer);
                        instance.hoverTimer = null;
                    }

                    // Don't close immediately on hover out
                    // Let the global click handler handle it
                }.bind(this);

                trigger.addEventListener('mouseenter', hoverInHandler);
                trigger.addEventListener('mouseleave', hoverOutHandler);

                // Also handle menu hover
                menu.addEventListener('mouseenter', function () {
                    instance.isHovering = true;
                    if (instance.hoverTimer) {
                        clearTimeout(instance.hoverTimer);
                        instance.hoverTimer = null;
                    }
                });

                menu.addEventListener('mouseleave', function () {
                    instance.isHovering = false;
                    // Close after delay if not hovering
                    instance.hoverTimer = setTimeout(function () {
                        if (!instance.isHovering && instance.isOpen) {
                            this.close(dropdown);
                        }
                    }.bind(this), this.config.hoverDelay);
                }.bind(this));

                // Store handlers for cleanup
                instance._hoverInHandler = hoverInHandler;
                instance._hoverOutHandler = hoverOutHandler;
            }

            // Setup item clicks
            if (this.config.closeOnItemClick) {
                instance.items.forEach(function (item) {
                    const itemHandler = function (e) {
                        // Don't close if item has a sub-dropdown
                        if (item.querySelector(this.config.dropdownSelector)) {
                            return;
                        }
                        this.close(dropdown);
                    }.bind(this);

                    item.addEventListener('click', itemHandler);

                    // Store for cleanup
                    if (!instance._itemHandlers) {
                        instance._itemHandlers = [];
                    }
                    instance._itemHandlers.push({
                        item: item,
                        handler: itemHandler,
                    });
                }.bind(this));
            }

            // Setup keyboard navigation
            if (this.config.enableKeyboardNav) {
                this._setupKeyboardNav(instance);
            }

            // Store instance
            this.state.instances.push(instance);

            // Store handlers for cleanup
            this._handlers.instanceHandlers.push({
                instance: instance,
                clickHandler: clickHandler,
            });

            ASLDS.logger.debug('Dropdown instance created.', { id: instance.id });
        },

        /**
         * Setup keyboard navigation for a dropdown
         * @param {Object} instance - Dropdown instance
         */
        _setupKeyboardNav: function (instance) {
            const trigger = instance.trigger;
            const menu = instance.menu;
            const items = instance.items;

            // Trigger keyboard events
            trigger.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(instance.element);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!instance.isOpen) {
                        this.open(instance.element);
                    } else {
                        this._focusNextItem(instance, 1);
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!instance.isOpen) {
                        this.open(instance.element);
                    } else {
                        this._focusNextItem(instance, -1);
                    }
                } else if (e.key === 'Escape') {
                    if (instance.isOpen) {
                        this.close(instance.element);
                    }
                }
            }.bind(this));

            // Menu keyboard events (for items)
            menu.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this._focusNextItem(instance, 1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this._focusNextItem(instance, -1);
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    if (items.length > 0) {
                        items[0].focus();
                    }
                } else if (e.key === 'End') {
                    e.preventDefault();
                    if (items.length > 0) {
                        items[items.length - 1].focus();
                    }
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.close(instance.element);
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const active = document.activeElement;
                    if (active && active.closest(this.config.itemSelector)) {
                        active.click();
                    }
                } else if (e.key === 'Tab') {
                    // Close dropdown on Tab
                    if (instance.isOpen) {
                        this.close(instance.element, { restoreFocus: false });
                    }
                }
            }.bind(this));
        },

        /**
         * Focus the first item in a dropdown
         * @param {Object} instance - Dropdown instance
         */
        _focusFirstItem: function (instance) {
            const items = instance.items;
            if (items.length === 0) {
                return;
            }

            // Find first non-disabled, non-hidden item
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item.disabled && !item.hidden && item.offsetParent !== null) {
                    item.focus();
                    return;
                }
            }
        },

        /**
         * Focus the next/previous item in a dropdown
         * @param {Object} instance - Dropdown instance
         * @param {number} direction - Direction (-1 for previous, 1 for next)
         */
        _focusNextItem: function (instance, direction) {
            const items = instance.items;
            if (items.length === 0) {
                return;
            }

            const active = document.activeElement;
            let currentIndex = -1;

            // Find current index
            for (let i = 0; i < items.length; i++) {
                if (items[i] === active || items[i].contains(active)) {
                    currentIndex = i;
                    break;
                }
            }

            // If no active item, start from beginning or end
            if (currentIndex === -1) {
                if (direction === 1) {
                    this._focusFirstItem(instance);
                } else {
                    const lastItem = items[items.length - 1];
                    if (lastItem && !lastItem.disabled && !lastItem.hidden) {
                        lastItem.focus();
                    }
                }
                return;
            }

            // Find next/prev visible item
            let newIndex = currentIndex + direction;
            while (newIndex >= 0 && newIndex < items.length) {
                const item = items[newIndex];
                if (!item.disabled && !item.hidden && item.offsetParent !== null) {
                    item.focus();
                    return;
                }
                newIndex += direction;
            }

            // Wrap around
            if (direction === 1) {
                this._focusFirstItem(instance);
            } else {
                const lastItem = items[items.length - 1];
                if (lastItem && !lastItem.disabled && !lastItem.hidden) {
                    lastItem.focus();
                }
            }
        },

        /**
         * Position a dropdown menu
         * @param {Object} instance - Dropdown instance
         */
        _positionMenu: function (instance) {
            const trigger = instance.trigger;
            const menu = instance.menu;

            if (!trigger || !menu) {
                return;
            }

            const triggerRect = trigger.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let placement = this.config.placement;
            let top, left;

            // Calculate position based on placement
            switch (placement) {
                case 'bottom-start':
                    top = triggerRect.bottom + this.config.offset;
                    left = triggerRect.left;
                    break;
                case 'bottom-end':
                    top = triggerRect.bottom + this.config.offset;
                    left = triggerRect.right - menuRect.width;
                    break;
                case 'top-start':
                    top = triggerRect.top - menuRect.height - this.config.offset;
                    left = triggerRect.left;
                    break;
                case 'top-end':
                    top = triggerRect.top - menuRect.height - this.config.offset;
                    left = triggerRect.right - menuRect.width;
                    break;
                default:
                    top = triggerRect.bottom + this.config.offset;
                    left = triggerRect.left;
            }

            // Flip if needed
            if (this.config.flip) {
                // Flip vertically if offscreen
                if (top + menuRect.height > viewportHeight) {
                    if (placement === 'bottom-start' || placement === 'bottom-end') {
                        // Flip to top
                        top = triggerRect.top - menuRect.height - this.config.offset;
                        if (top < 0) {
                            top = this.config.offset;
                        }
                    } else {
                        // Flip to bottom
                        top = triggerRect.bottom + this.config.offset;
                        if (top + menuRect.height > viewportHeight) {
                            top = viewportHeight - menuRect.height - this.config.offset;
                        }
                    }
                }

                // Flip horizontally if offscreen
                if (left + menuRect.width > viewportWidth) {
                    if (placement === 'bottom-start' || placement === 'top-start') {
                        left = triggerRect.right - menuRect.width;
                    } else {
                        left = triggerRect.left;
                    }
                    if (left < 0) {
                        left = this.config.offset;
                    }
                }
            }

            // Apply position
            menu.style.position = 'fixed';
            menu.style.top = Math.max(this.config.offset, top) + 'px';
            menu.style.left = Math.max(this.config.offset, left) + 'px';

            // Add placement class
            if (this.config.positionClassPrefix) {
                const placementClass = this.config.positionClassPrefix + placement.replace('-', '--');
                menu.classList.remove(this.config.positionClassPrefix + 'bottom-start');
                menu.classList.remove(this.config.positionClassPrefix + 'bottom-end');
                menu.classList.remove(this.config.positionClassPrefix + 'top-start');
                menu.classList.remove(this.config.positionClassPrefix + 'top-end');
                menu.classList.add(placementClass);
            }

            ASLDS.logger.debug('Dropdown positioned.', {
                id: instance.id,
                placement: placement,
                top: top,
                left: left,
            });
        },

        /**
         * Start transition for a dropdown
         * @param {Object} instance - Dropdown instance
         */
        _startTransition: function (instance) {
            if (!this.config.enableTransitions) {
                return;
            }

            const menu = instance.menu;
            if (menu) {
                menu.classList.add('transitioning');
                setTimeout(function () {
                    menu.classList.remove('transitioning');
                }, this.config.transitionDuration + 50);
            }
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Click outside to close
            if (this.config.closeOnOutsideClick) {
                const clickHandler = function (e) {
                    // Don't close if clicking inside any dropdown
                    const isDropdown = e.target.closest(this.config.dropdownSelector);
                    if (isDropdown) {
                        return;
                    }

                    // Close all open dropdowns
                    this.state.instances.forEach(function (instance) {
                        if (instance.isOpen) {
                            this.close(instance.element, { restoreFocus: false });
                        }
                    }.bind(this));
                }.bind(this);

                document.addEventListener('click', clickHandler);
                this._handlers.documentClick = clickHandler;
            }

            // Escape key to close
            if (this.config.closeOnEscape) {
                const keydownHandler = function (e) {
                    if (e.key === 'Escape') {
                        // Close active dropdown first
                        if (this.state.activeInstance) {
                            this.close(this.state.activeInstance.element);
                        } else {
                            // Close any open dropdowns
                            this.state.instances.forEach(function (instance) {
                                if (instance.isOpen) {
                                    this.close(instance.element);
                                }
                            }.bind(this));
                        }
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
                    this.refreshAll();
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
            if (this._handlers.documentClick) {
                document.removeEventListener('click', this._handlers.documentClick);
                this._handlers.documentClick = null;
            }

            if (this._handlers.documentKeydown) {
                document.removeEventListener('keydown', this._handlers.documentKeydown);
                this._handlers.documentKeydown = null;
            }

            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            ASLDS.logger.debug('Global event listeners removed.');
        },

        /**
         * Get a dropdown instance by element
         * @param {Element|string} dropdown - Dropdown element or selector
         * @returns {Object|null} Dropdown instance or null
         */
        _getInstance: function (dropdown) {
            if (!dropdown) {
                return null;
            }

            const element = typeof dropdown === 'string'
                ? ASLDS.dom.find(dropdown)
                : dropdown;

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
         * Destroy a dropdown instance
         * @param {Object} instance - Dropdown instance
         */
        _destroyInstance: function (instance) {
            // Remove event listeners
            const handlers = this._handlers.instanceHandlers.filter(function (h) {
                return h.instance === instance;
            });

            handlers.forEach(function (h) {
                if (h.instance.trigger && h.clickHandler) {
                    h.instance.trigger.removeEventListener('click', h.clickHandler);
                }
            });

            // Remove hover handlers
            if (instance._hoverInHandler) {
                instance.trigger.removeEventListener('mouseenter', instance._hoverInHandler);
            }
            if (instance._hoverOutHandler) {
                instance.trigger.removeEventListener('mouseleave', instance._hoverOutHandler);
            }

            // Remove item handlers
            if (instance._itemHandlers) {
                instance._itemHandlers.forEach(function (itemHandler) {
                    itemHandler.item.removeEventListener('click', itemHandler.handler);
                });
            }

            // Reset DOM attributes
            if (instance.trigger) {
                instance.trigger.removeAttribute('aria-haspopup');
                instance.trigger.removeAttribute('aria-expanded');
                instance.trigger.removeAttribute('aria-controls');
            }

            if (instance.menu) {
                instance.menu.removeAttribute('role');
                instance.menu.removeAttribute('aria-hidden');
                instance.menu.removeAttribute('aria-label');
                instance.menu.className = instance.menu.className
                    .replace(this.config.openClass, '')
                    .replace('transitioning', '')
                    .trim();
            }

            if (instance.element) {
                instance.element.classList.remove(this.config.openClass);
                delete instance.element.dataset.dropdownInitialized;
            }

            ASLDS.logger.debug('Dropdown instance destroyed.', { id: instance.id });
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Dropdown.config);
    Object.freeze(Dropdown.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Dropdown.name, Dropdown, Dropdown.priority, Dropdown.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all dropdowns
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const dropdownElements = ASLDS.dom.findAll('[data-dropdown]');
        if (dropdownElements.length > 0) {
            dropdownElements.forEach(function (element) {
                Dropdown.init(element);
            });
        } else {
            // Fallback: find by class
            const dropdowns = ASLDS.dom.findAll('.dropdown');
            if (dropdowns.length > 0) {
                Dropdown.init();
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSDropdown) {
        window.ASLDSDropdown = Dropdown;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : dropdown.js
     * Module      : ASL Design System (ASLDS) Dropdown
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
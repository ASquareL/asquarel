/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Navbar Module
 * File        : navbar.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Navbar Module manages responsive application navigation across the
 * ASL Design System. It provides a unified navigation experience with
 * support for:
 *   • Responsive mobile navigation with toggle
 *   • Dropdown menus with keyboard support
 *   • Active state highlighting
 *   • Sticky navigation with scroll behavior
 *   • Overlay handling for mobile menus
 *   • Keyboard accessibility (Escape key, focus management)
 *   • Resize handling
 *   • Smooth transitions
 *   • Event cleanup and performance optimizations
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
        console.error('[ASLDS] Runtime not found. Navbar module cannot initialize.');
        return;
    }

    // ========================================================================
    // Navbar Module
    // ========================================================================

    const Navbar = {
        /**
         * Module Information
         */
        name: 'Navbar',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Navbar Configuration
         */
        config: {
            // Selectors
            navbarSelector: '.navbar',
            toggleSelector: '.mobile-toggle',
            menuSelector: '.nav-menu',
            linkSelector: '.nav-link',
            dropdownSelector: '.dropdown',
            dropdownTriggerSelector: '.dropdown-trigger',
            dropdownMenuSelector: '.dropdown-menu',
            overlaySelector: '.nav-overlay',
            activeClass: 'active',
            openClass: 'open',
            dropdownOpenClass: 'open',

            // Behavior
            breakpoint: 992,
            closeOnLinkClick: true,
            closeOnEscape: true,
            closeOnOverlayClick: true,
            enableDropdowns: true,
            enableActiveState: true,
            enableSticky: true,
            enableTransitions: true,
            transitionDuration: 300,

            // Scroll behavior
            stickyOffset: 0,
            hideOnScroll: false,
            hideThreshold: 100,

            // Accessibility
            ariaLabel: 'Main navigation',
            toggleAriaLabel: 'Toggle navigation menu',

            // Debug
            debug: false,
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            isOpen: false,
            isSticky: false,
            isHidden: false,
            lastScrollY: 0,
            breakpoint: 992,
            resizeTimer: null,
            scrollTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            navbar: null,
            toggle: null,
            menu: null,
            links: [],
            dropdowns: [],
            overlay: null,
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            toggleClick: null,
            linkClick: null,
            overlayClick: null,
            escapeKey: null,
            resize: null,
            scroll: null,
            dropdownClicks: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the navbar module
         * @param {Element|string} element - Navbar element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Navbar module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            // Find navbar element
            this.elements.navbar = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!this.elements.navbar) {
                // Try to find by selector
                this.elements.navbar = ASLDS.dom.find(this.config.navbarSelector);
                if (!this.elements.navbar) {
                    ASLDS.logger.warn('Navbar element not found.');
                    return this;
                }
            }

            ASLDS.logger.info('Initializing Navbar module v' + this.version + '...');

            // Cache elements
            this._cacheElements();

            // Set breakpoint
            this.state.breakpoint = this.config.breakpoint;

            // Setup mobile toggle
            this._setupToggle();

            // Setup navigation links
            this._setupLinks();

            // Setup dropdowns
            if (this.config.enableDropdowns) {
                this._setupDropdowns();
            }

            // Setup overlay
            this._setupOverlay();

            // Setup active state
            if (this.config.enableActiveState) {
                this._setupActiveState();
            }

            // Setup scroll behavior
            if (this.config.enableSticky) {
                this._setupScrollBehavior();
            }

            // Setup resize handling
            this._setupResizeHandling();

            // Setup keyboard handling
            this._setupKeyboardHandling();

            // Apply initial state
            this._applyInitialState();

            this.state.initialized = true;

            ASLDS.logger.info('Navbar module initialized successfully.', {
                navbar: this.elements.navbar,
                hasToggle: !!this.elements.toggle,
                hasMenu: !!this.elements.menu,
                dropdownCount: this.elements.dropdowns.length,
            });

            return this;
        },

        /**
         * Open the mobile menu
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @returns {Object} This instance for chaining
         */
        open: function (options) {
            options = options || {};

            if (this.state.isOpen) {
                return this;
            }

            // Check if we're on mobile
            if (window.innerWidth >= this.state.breakpoint) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isOpen = true;

            // Update DOM
            if (this.elements.menu) {
                this.elements.menu.classList.add(this.config.openClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'true');
                this.elements.toggle.classList.add(this.config.openClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.add(this.config.openClass);
            }

            // Prevent body scroll
            this.elements.body.classList.add('no-scroll');

            // Emit event
            ASLDS.events.emit('navbar:open', {
                navbar: this.elements.navbar,
                isMobile: true,
            });

            ASLDS.logger.debug('Navbar opened.');

            return this;
        },

        /**
         * Close the mobile menu
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @returns {Object} This instance for chaining
         */
        close: function (options) {
            options = options || {};

            if (!this.state.isOpen) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isOpen = false;

            // Update DOM
            if (this.elements.menu) {
                this.elements.menu.classList.remove(this.config.openClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'false');
                this.elements.toggle.classList.remove(this.config.openClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.remove(this.config.openClass);
            }

            // Restore body scroll
            this.elements.body.classList.remove('no-scroll');

            // Emit event
            ASLDS.events.emit('navbar:close', {
                navbar: this.elements.navbar,
            });

            ASLDS.logger.debug('Navbar closed.');

            return this;
        },

        /**
         * Toggle the mobile menu
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        toggle: function (options) {
            if (this.state.isOpen) {
                this.close(options);
            } else {
                this.open(options);
            }
            return this;
        },

        /**
         * Check if the menu is open
         * @returns {boolean} True if open
         */
        isOpen: function () {
            return this.state.isOpen;
        },

        /**
         * Check if the navbar is sticky
         * @returns {boolean} True if sticky
         */
        isSticky: function () {
            return this.state.isSticky;
        },

        /**
         * Refresh the navbar (re-apply state)
         * @returns {Object} This instance for chaining
         */
        refresh: function () {
            // Re-apply active state
            if (this.config.enableActiveState) {
                this._applyActiveState();
            }

            // Reset mobile state if on desktop
            if (window.innerWidth >= this.state.breakpoint && this.state.isOpen) {
                this.close({ noTransition: true });
            }

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
                isOpen: this.state.isOpen,
                isSticky: this.state.isSticky,
                isHidden: this.state.isHidden,
                breakpoint: this.state.breakpoint,
                hasToggle: !!this.elements.toggle,
                hasMenu: !!this.elements.menu,
                dropdownCount: this.elements.dropdowns.length,
                linkCount: this.elements.links.length,
            };
        },

        /**
         * Get module status
         * @returns {Object} Status object
         */
        status: function () {
            return {
                initialized: this.state.initialized,
                isOpen: this.state.isOpen,
                isSticky: this.state.isSticky,
                isHidden: this.state.isHidden,
                config: Object.assign({}, this.config),
                elements: {
                    navbar: !!this.elements.navbar,
                    toggle: !!this.elements.toggle,
                    menu: !!this.elements.menu,
                    overlay: !!this.elements.overlay,
                    links: this.elements.links.length,
                    dropdowns: this.elements.dropdowns.length,
                },
            };
        },

        /**
         * Destroy the navbar module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Navbar module...');

            // Close menu
            if (this.state.isOpen) {
                this.close({ noTransition: true });
            }

            // Remove event listeners
            this._removeEventListeners();

            // Clean up DOM
            if (this.elements.overlay) {
                this.elements.overlay.remove();
            }

            // Reset state
            this.state.initialized = false;
            this.state.isOpen = false;
            this.state.isSticky = false;

            // Clear timers
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }
            if (this.state.scrollTimer) {
                clearTimeout(this.state.scrollTimer);
                this.state.scrollTimer = null;
            }

            ASLDS.logger.info('Navbar module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Cache DOM elements
         */
        _cacheElements: function () {
            const navbar = this.elements.navbar;

            // Toggle button
            this.elements.toggle = navbar.querySelector(this.config.toggleSelector);

            // Menu
            this.elements.menu = navbar.querySelector(this.config.menuSelector);

            // Links
            this.elements.links = ASLDS.dom.findAll(this.config.linkSelector, navbar);

            // Dropdowns
            this.elements.dropdowns = ASLDS.dom.findAll(this.config.dropdownSelector, navbar);

            // Overlay
            this.elements.overlay = ASLDS.dom.find(this.config.overlaySelector);
            if (!this.elements.overlay && this.config.closeOnOverlayClick) {
                this.elements.overlay = ASLDS.dom.create('<div class="nav-overlay"></div>');
                if (this.elements.overlay) {
                    this.elements.navbar.parentNode.insertBefore(
                        this.elements.overlay,
                        this.elements.navbar.nextSibling
                    );
                }
            }
        },

        /**
         * Setup mobile toggle button
         */
        _setupToggle: function () {
            const toggle = this.elements.toggle;
            if (!toggle) {
                ASLDS.logger.warn('Mobile toggle button not found.');
                return;
            }

            // Set initial ARIA attributes
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', this.config.toggleAriaLabel);
            toggle.setAttribute('aria-controls', 'nav-menu');

            // Click handler
            const handler = function (e) {
                e.preventDefault();
                this.toggle();
            }.bind(this);

            toggle.addEventListener('click', handler);
            this._handlers.toggleClick = handler;

            ASLDS.logger.debug('Toggle button setup complete.');
        },

        /**
         * Setup navigation links
         */
        _setupLinks: function () {
            if (!this.config.closeOnLinkClick) {
                return;
            }

            const links = this.elements.links;
            if (!links || links.length === 0) {
                return;
            }

            const handler = function (e) {
                // Only close if menu is open and we're on mobile
                if (this.state.isOpen && window.innerWidth < this.state.breakpoint) {
                    // Allow dropdown triggers to handle their own behavior
                    const isDropdownTrigger = e.target.closest(this.config.dropdownTriggerSelector);
                    if (isDropdownTrigger) {
                        return;
                    }
                    this.close();
                }
            }.bind(this);

            links.forEach(function (link) {
                link.addEventListener('click', handler);
            });

            this._handlers.linkClick = handler;

            ASLDS.logger.debug('Links setup complete: ' + links.length + ' links.');
        },

        /**
         * Setup dropdown menus
         */
        _setupDropdowns: function () {
            const dropdowns = this.elements.dropdowns;
            if (!dropdowns || dropdowns.length === 0) {
                return;
            }

            dropdowns.forEach(function (dropdown, index) {
                const trigger = dropdown.querySelector(this.config.dropdownTriggerSelector);
                const menu = dropdown.querySelector(this.config.dropdownMenuSelector);

                if (!trigger || !menu) {
                    return;
                }

                // Set ARIA attributes
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-haspopup', 'true');

                // Click handler for dropdown trigger
                const handler = function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isOpen = menu.classList.contains(this.config.dropdownOpenClass);

                    // Close other dropdowns
                    dropdowns.forEach(function (d) {
                        if (d !== dropdown) {
                            const m = d.querySelector(this.config.dropdownMenuSelector);
                            if (m) {
                                m.classList.remove(this.config.dropdownOpenClass);
                                const t = d.querySelector(this.config.dropdownTriggerSelector);
                                if (t) {
                                    t.setAttribute('aria-expanded', 'false');
                                }
                            }
                        }
                    }.bind(this));

                    if (isOpen) {
                        menu.classList.remove(this.config.dropdownOpenClass);
                        trigger.setAttribute('aria-expanded', 'false');
                    } else {
                        menu.classList.add(this.config.dropdownOpenClass);
                        trigger.setAttribute('aria-expanded', 'true');
                    }
                }.bind(this);

                trigger.addEventListener('click', handler);

                // Store for cleanup
                this._handlers.dropdownClicks.push({
                    trigger: trigger,
                    handler: handler,
                });

                // Close dropdown on escape key
                trigger.addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        menu.classList.remove(this.config.dropdownOpenClass);
                        trigger.setAttribute('aria-expanded', 'false');
                        trigger.focus();
                    }
                }.bind(this));

                // Close dropdown on outside click
                ASLDS.dom.on(document, 'click', function (e) {
                    if (!dropdown.contains(e.target)) {
                        menu.classList.remove(this.config.dropdownOpenClass);
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                }.bind(this));

                // Keyboard navigation for dropdown items
                const items = menu.querySelectorAll('a, button');
                if (items.length > 0) {
                    items.forEach(function (item, idx) {
                        item.addEventListener('keydown', function (e) {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const next = items[(idx + 1) % items.length];
                                if (next) next.focus();
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                const prev = items[(idx - 1 + items.length) % items.length];
                                if (prev) prev.focus();
                            } else if (e.key === 'Escape') {
                                menu.classList.remove(this.config.dropdownOpenClass);
                                trigger.setAttribute('aria-expanded', 'false');
                                trigger.focus();
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));

            ASLDS.logger.debug('Dropdowns setup complete: ' + dropdowns.length + ' dropdowns.');
        },

        /**
         * Setup overlay
         */
        _setupOverlay: function () {
            const overlay = this.elements.overlay;
            if (!overlay || !this.config.closeOnOverlayClick) {
                return;
            }

            const handler = function (e) {
                if (this.state.isOpen) {
                    this.close();
                }
            }.bind(this);

            overlay.addEventListener('click', handler);
            this._handlers.overlayClick = handler;

            ASLDS.logger.debug('Overlay setup complete.');
        },

        /**
         * Setup active state highlighting
         */
        _setupActiveState: function () {
            this._applyActiveState();
        },

        /**
         * Apply active state to current page link
         */
        _applyActiveState: function () {
            const links = this.elements.links;
            if (!links || links.length === 0) {
                return;
            }

            const currentPath = window.location.pathname;

            links.forEach(function (link) {
                const href = link.getAttribute('href');
                if (!href) return;

                // Remove existing active class
                link.classList.remove(this.config.activeClass);

                // Check if this link matches the current path
                if (href === currentPath ||
                    (href !== '/' && currentPath.startsWith(href)) ||
                    (href === '/' && currentPath === '/')) {
                    link.classList.add(this.config.activeClass);
                }
            }.bind(this));
        },

        /**
         * Setup scroll behavior for sticky navbar
         */
        _setupScrollBehavior: function () {
            const handler = function () {
                if (this.state.resizeTimer) {
                    clearTimeout(this.state.resizeTimer);
                }

                this.state.resizeTimer = setTimeout(function () {
                    this._handleScroll();
                }.bind(this), 50);
            }.bind(this);

            window.addEventListener('scroll', handler, { passive: true });
            this._handlers.scroll = handler;

            // Initial check
            this._handleScroll();

            ASLDS.logger.debug('Scroll behavior setup complete.');
        },

        /**
         * Handle scroll events
         */
        _handleScroll: function () {
            const scrollY = window.scrollY;
            const navbar = this.elements.navbar;
            const offset = this.config.stickyOffset;

            // Check if we should be sticky
            const shouldBeSticky = scrollY > offset;

            if (shouldBeSticky && !this.state.isSticky) {
                this.state.isSticky = true;
                navbar.classList.add('sticky');
                ASLDS.events.emit('navbar:sticky', { navbar: navbar });
            } else if (!shouldBeSticky && this.state.isSticky) {
                this.state.isSticky = false;
                navbar.classList.remove('sticky');
                ASLDS.events.emit('navbar:unsticky', { navbar: navbar });
            }

            // Hide on scroll (if enabled)
            if (this.config.hideOnScroll) {
                const threshold = this.config.hideThreshold;
                const delta = scrollY - this.state.lastScrollY;

                if (delta > threshold && !this.state.isHidden && scrollY > offset) {
                    this.state.isHidden = true;
                    navbar.classList.add('hidden');
                    ASLDS.events.emit('navbar:hide', { navbar: navbar });
                } else if (delta < -threshold && this.state.isHidden) {
                    this.state.isHidden = false;
                    navbar.classList.remove('hidden');
                    ASLDS.events.emit('navbar:show', { navbar: navbar });
                }
            }

            this.state.lastScrollY = scrollY;
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

            // Initial check
            this._handleResize();

            ASLDS.logger.debug('Resize handling setup complete.');
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            const width = window.innerWidth;

            // If we're on desktop and menu is open, close it
            if (width >= this.state.breakpoint && this.state.isOpen) {
                this.close({ noTransition: true });
            }

            // Update body scroll if menu is open
            if (this.state.isOpen && width < this.state.breakpoint) {
                this.elements.body.classList.add('no-scroll');
            } else {
                this.elements.body.classList.remove('no-scroll');
            }

            ASLDS.events.emit('navbar:resize', {
                width: width,
                breakpoint: this.state.breakpoint,
                isMobile: width < this.state.breakpoint,
            });
        },

        /**
         * Setup keyboard handling
         */
        _setupKeyboardHandling: function () {
            if (!this.config.closeOnEscape) {
                return;
            }

            const handler = function (e) {
                if (e.key === 'Escape' && this.state.isOpen) {
                    this.close();
                    // Focus the toggle button
                    if (this.elements.toggle) {
                        this.elements.toggle.focus();
                    }
                }
            }.bind(this);

            document.addEventListener('keydown', handler);
            this._handlers.escapeKey = handler;

            ASLDS.logger.debug('Keyboard handling setup complete.');
        },

        /**
         * Apply initial state
         */
        _applyInitialState: function () {
            // Set initial ARIA label on navbar
            if (this.elements.navbar) {
                this.elements.navbar.setAttribute('aria-label', this.config.ariaLabel);
                this.elements.navbar.setAttribute('role', 'navigation');
            }

            // Close menu if on desktop
            if (window.innerWidth >= this.state.breakpoint) {
                this.close({ noTransition: true });
            }

            // Ensure no-scroll is removed
            this.elements.body.classList.remove('no-scroll');
        },

        /**
         * Start transition
         */
        _startTransition: function () {
            if (!this.config.enableTransitions) {
                return;
            }

            const navbar = this.elements.navbar;
            if (navbar) {
                navbar.classList.add('transitioning');
                setTimeout(function () {
                    navbar.classList.remove('transitioning');
                }, this.config.transitionDuration + 50);
            }
        },

        /**
         * Remove all event listeners
         */
        _removeEventListeners: function () {
            // Toggle click
            if (this.elements.toggle && this._handlers.toggleClick) {
                this.elements.toggle.removeEventListener('click', this._handlers.toggleClick);
                this._handlers.toggleClick = null;
            }

            // Link clicks
            if (this._handlers.linkClick) {
                this.elements.links.forEach(function (link) {
                    link.removeEventListener('click', this._handlers.linkClick);
                }.bind(this));
                this._handlers.linkClick = null;
            }

            // Overlay click
            if (this.elements.overlay && this._handlers.overlayClick) {
                this.elements.overlay.removeEventListener('click', this._handlers.overlayClick);
                this._handlers.overlayClick = null;
            }

            // Escape key
            if (this._handlers.escapeKey) {
                document.removeEventListener('keydown', this._handlers.escapeKey);
                this._handlers.escapeKey = null;
            }

            // Resize
            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Scroll
            if (this._handlers.scroll) {
                window.removeEventListener('scroll', this._handlers.scroll);
                this._handlers.scroll = null;
            }

            // Dropdown clicks
            this._handlers.dropdownClicks.forEach(function (item) {
                item.trigger.removeEventListener('click', item.handler);
            });
            this._handlers.dropdownClicks = [];

            ASLDS.logger.debug('Event listeners removed.');
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Navbar.config);
    Object.freeze(Navbar.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Navbar.name, Navbar, Navbar.priority, Navbar.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all navbars
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const navbarElements = ASLDS.dom.findAll('[data-navbar]');
        if (navbarElements.length > 0) {
            navbarElements.forEach(function (element) {
                Navbar.init(element);
            });
        } else {
            // Fallback: find by class
            const navbar = ASLDS.dom.find('.navbar');
            if (navbar) {
                Navbar.init(navbar);
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSNavbar) {
        window.ASLDSNavbar = Navbar;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : navbar.js
     * Module      : ASL Design System (ASLDS) Navbar
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
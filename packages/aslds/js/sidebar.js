/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Sidebar Module
 * File        : sidebar.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Sidebar Module manages application navigation sidebars across the
 * ASL Design System. It provides a unified sidebar experience with
 * support for:
 *   • Desktop and mobile sidebar layouts
 *   • Expand / Collapse with persistence
 *   • Overlay support for mobile
 *   • Nested navigation with expandable groups
 *   • Active page highlighting
 *   • Current section highlighting
 *   • Auto-scroll active item into view
 *   • Keyboard accessibility (Escape key, focus management)
 *   • Resize handling
 *   • Smooth animations
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
        console.error('[ASLDS] Runtime not found. Sidebar module cannot initialize.');
        return;
    }

    // ========================================================================
    // Sidebar Module
    // ========================================================================

    const Sidebar = {
        /**
         * Module Information
         */
        name: 'Sidebar',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Sidebar Configuration
         */
        config: {
            // Selectors
            sidebarSelector: '.sidebar',
            toggleSelector: '.sidebar-toggle',
            closeSelector: '.sidebar-close',
            overlaySelector: '.sidebar-overlay',
            menuSelector: '.sidebar-menu',
            linkSelector: '.sidebar-link',
            groupSelector: '.sidebar-group',
            groupToggleSelector: '.sidebar-group-toggle',
            groupMenuSelector: '.sidebar-group-menu',
            activeClass: 'active',
            openClass: 'open',
            collapsedClass: 'collapsed',
            expandedClass: 'expanded',

            // Behavior
            breakpoint: 992,
            defaultCollapsed: false,
            closeOnLinkClick: true,
            closeOnEscape: true,
            closeOnOverlayClick: true,
            enableNested: true,
            enableActiveState: true,
            enableTransitions: true,
            transitionDuration: 300,
            persistState: true,
            storageKey: 'aslds-sidebar-state',

            // Scroll behavior
            autoScrollActive: true,
            scrollOffset: 0,

            // Accessibility
            ariaLabel: 'Sidebar navigation',
            toggleAriaLabel: 'Toggle sidebar',

            // Debug
            debug: false,
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            isOpen: false,
            isCollapsed: false,
            isMobile: false,
            breakpoint: 992,
            resizeTimer: null,
            scrollTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            sidebar: null,
            toggle: null,
            close: null,
            overlay: null,
            menu: null,
            links: [],
            groups: [],
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            toggleClick: null,
            closeClick: null,
            overlayClick: null,
            escapeKey: null,
            resize: null,
            groupClicks: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the sidebar module
         * @param {Element|string} element - Sidebar element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Sidebar module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            // Find sidebar element
            this.elements.sidebar = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!this.elements.sidebar) {
                // Try to find by selector
                this.elements.sidebar = ASLDS.dom.find(this.config.sidebarSelector);
                if (!this.elements.sidebar) {
                    ASLDS.logger.warn('Sidebar element not found.');
                    return this;
                }
            }

            ASLDS.logger.info('Initializing Sidebar module v' + this.version + '...');

            // Set breakpoint
            this.state.breakpoint = this.config.breakpoint;

            // Cache elements
            this._cacheElements();

            // Load persisted state
            this._loadState();

            // Setup toggle button
            this._setupToggle();

            // Setup close button
            this._setupClose();

            // Setup overlay
            this._setupOverlay();

            // Setup navigation links
            this._setupLinks();

            // Setup nested groups
            if (this.config.enableNested) {
                this._setupGroups();
            }

            // Setup active state
            if (this.config.enableActiveState) {
                this._setupActiveState();
            }

            // Setup resize handling
            this._setupResizeHandling();

            // Setup keyboard handling
            this._setupKeyboardHandling();

            // Apply initial state
            this._applyInitialState();

            // Emit ready event
            ASLDS.events.emit('sidebar:ready', {
                sidebar: this.elements.sidebar,
                isCollapsed: this.state.isCollapsed,
                isMobile: this.state.isMobile,
            });

            this.state.initialized = true;

            ASLDS.logger.info('Sidebar module initialized successfully.', {
                sidebar: this.elements.sidebar,
                isCollapsed: this.state.isCollapsed,
                isMobile: this.state.isMobile,
                linkCount: this.elements.links.length,
                groupCount: this.elements.groups.length,
            });

            return this;
        },

        /**
         * Open the sidebar (mobile)
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @returns {Object} This instance for chaining
         */
        open: function (options) {
            options = options || {};

            if (this.state.isOpen) {
                return this;
            }

            // Only works on mobile
            if (!this.state.isMobile) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isOpen = true;

            // Update DOM
            if (this.elements.sidebar) {
                this.elements.sidebar.classList.add(this.config.openClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.add(this.config.openClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'true');
                this.elements.toggle.classList.add(this.config.openClass);
            }

            // Prevent body scroll
            this.elements.body.classList.add('no-scroll');

            // Emit event
            ASLDS.events.emit('sidebar:open', {
                sidebar: this.elements.sidebar,
                isMobile: true,
            });

            ASLDS.logger.debug('Sidebar opened.');

            return this;
        },

        /**
         * Close the sidebar (mobile)
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
            if (this.elements.sidebar) {
                this.elements.sidebar.classList.remove(this.config.openClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.remove(this.config.openClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'false');
                this.elements.toggle.classList.remove(this.config.openClass);
            }

            // Restore body scroll
            this.elements.body.classList.remove('no-scroll');

            // Emit event
            ASLDS.events.emit('sidebar:close', {
                sidebar: this.elements.sidebar,
            });

            ASLDS.logger.debug('Sidebar closed.');

            return this;
        },

        /**
         * Toggle the sidebar (mobile)
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
         * Collapse the sidebar (desktop)
         * @param {Object} options - Options
         * @param {boolean} options.save - If false, doesn't save to storage
         * @returns {Object} This instance for chaining
         */
        collapse: function (options) {
            options = options || {};

            if (this.state.isCollapsed) {
                return this;
            }

            // Only works on desktop
            if (this.state.isMobile) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isCollapsed = true;

            // Update DOM
            if (this.elements.sidebar) {
                this.elements.sidebar.classList.add(this.config.collapsedClass);
                this.elements.sidebar.classList.remove(this.config.expandedClass);
            }

            // Save state
            if (this.config.persistState && options.save !== false) {
                this._saveState();
            }

            // Emit event
            ASLDS.events.emit('sidebar:collapse', {
                sidebar: this.elements.sidebar,
            });

            ASLDS.logger.debug('Sidebar collapsed.');

            return this;
        },

        /**
         * Expand the sidebar (desktop)
         * @param {Object} options - Options
         * @param {boolean} options.save - If false, doesn't save to storage
         * @returns {Object} This instance for chaining
         */
        expand: function (options) {
            options = options || {};

            if (!this.state.isCollapsed) {
                return this;
            }

            // Only works on desktop
            if (this.state.isMobile) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isCollapsed = false;

            // Update DOM
            if (this.elements.sidebar) {
                this.elements.sidebar.classList.remove(this.config.collapsedClass);
                this.elements.sidebar.classList.add(this.config.expandedClass);
            }

            // Save state
            if (this.config.persistState && options.save !== false) {
                this._saveState();
            }

            // Emit event
            ASLDS.events.emit('sidebar:expand', {
                sidebar: this.elements.sidebar,
            });

            ASLDS.logger.debug('Sidebar expanded.');

            return this;
        },

        /**
         * Toggle collapse/expand (desktop)
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        toggleCollapse: function (options) {
            if (this.state.isCollapsed) {
                this.expand(options);
            } else {
                this.collapse(options);
            }
            return this;
        },

        /**
         * Check if the sidebar is open (mobile)
         * @returns {boolean} True if open
         */
        isOpen: function () {
            return this.state.isOpen;
        },

        /**
         * Check if the sidebar is collapsed (desktop)
         * @returns {boolean} True if collapsed
         */
        isCollapsed: function () {
            return this.state.isCollapsed;
        },

        /**
         * Check if the sidebar is in mobile mode
         * @returns {boolean} True if mobile
         */
        isMobile: function () {
            return this.state.isMobile;
        },

        /**
         * Refresh the sidebar (re-apply state)
         * @returns {Object} This instance for chaining
         */
        refresh: function () {
            // Re-apply active state
            if (this.config.enableActiveState) {
                this._applyActiveState();
            }

            // Re-apply collapse state
            if (this.state.isCollapsed && !this.state.isMobile) {
                if (this.elements.sidebar) {
                    this.elements.sidebar.classList.add(this.config.collapsedClass);
                    this.elements.sidebar.classList.remove(this.config.expandedClass);
                }
            } else if (!this.state.isCollapsed && !this.state.isMobile) {
                if (this.elements.sidebar) {
                    this.elements.sidebar.classList.remove(this.config.collapsedClass);
                    this.elements.sidebar.classList.add(this.config.expandedClass);
                }
            }

            // Reset mobile state if on desktop
            if (!this.state.isMobile && this.state.isOpen) {
                this.close({ noTransition: true });
            }

            // Auto-scroll active item
            if (this.config.autoScrollActive) {
                this._scrollToActive();
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
                isCollapsed: this.state.isCollapsed,
                isMobile: this.state.isMobile,
                breakpoint: this.state.breakpoint,
                linkCount: this.elements.links.length,
                groupCount: this.elements.groups.length,
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
                isCollapsed: this.state.isCollapsed,
                isMobile: this.state.isMobile,
                config: Object.assign({}, this.config),
                elements: {
                    sidebar: !!this.elements.sidebar,
                    toggle: !!this.elements.toggle,
                    close: !!this.elements.close,
                    overlay: !!this.elements.overlay,
                    menu: !!this.elements.menu,
                    links: this.elements.links.length,
                    groups: this.elements.groups.length,
                },
            };
        },

        /**
         * Destroy the sidebar module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Sidebar module...');

            // Close mobile menu
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

            // Clear timers
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }
            if (this.state.scrollTimer) {
                clearTimeout(this.state.scrollTimer);
                this.state.scrollTimer = null;
            }

            ASLDS.logger.info('Sidebar module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Cache DOM elements
         */
        _cacheElements: function () {
            const sidebar = this.elements.sidebar;

            // Toggle button
            this.elements.toggle = sidebar.querySelector(this.config.toggleSelector);

            // Close button
            this.elements.close = sidebar.querySelector(this.config.closeSelector);

            // Menu
            this.elements.menu = sidebar.querySelector(this.config.menuSelector);

            // Links
            this.elements.links = ASLDS.dom.findAll(this.config.linkSelector, sidebar);

            // Groups
            this.elements.groups = ASLDS.dom.findAll(this.config.groupSelector, sidebar);

            // Overlay
            this.elements.overlay = ASLDS.dom.find(this.config.overlaySelector);
            if (!this.elements.overlay && this.config.closeOnOverlayClick) {
                this.elements.overlay = ASLDS.dom.create('<div class="sidebar-overlay"></div>');
                if (this.elements.overlay) {
                    this.elements.sidebar.parentNode.insertBefore(
                        this.elements.overlay,
                        this.elements.sidebar.nextSibling
                    );
                }
            }
        },

        /**
         * Load persisted state from storage
         */
        _loadState: function () {
            if (!this.config.persistState) {
                this.state.isCollapsed = this.config.defaultCollapsed;
                return;
            }

            const saved = ASLDS.storage.get(this.config.storageKey);
            if (saved && typeof saved === 'object') {
                this.state.isCollapsed = saved.isCollapsed || this.config.defaultCollapsed;
            } else {
                this.state.isCollapsed = this.config.defaultCollapsed;
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
                isCollapsed: this.state.isCollapsed,
                timestamp: Date.now(),
            });

            ASLDS.logger.debug('Sidebar state saved.');
        },

        /**
         * Setup toggle button
         */
        _setupToggle: function () {
            const toggle = this.elements.toggle;
            if (!toggle) {
                ASLDS.logger.warn('Sidebar toggle button not found.');
                return;
            }

            // Set initial ARIA attributes
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', this.config.toggleAriaLabel);

            // Click handler
            const handler = function (e) {
                e.preventDefault();

                if (this.state.isMobile) {
                    this.toggle();
                } else {
                    this.toggleCollapse();
                }
            }.bind(this);

            toggle.addEventListener('click', handler);
            this._handlers.toggleClick = handler;

            ASLDS.logger.debug('Toggle button setup complete.');
        },

        /**
         * Setup close button
         */
        _setupClose: function () {
            const close = this.elements.close;
            if (!close) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();
                if (this.state.isOpen) {
                    this.close();
                }
            }.bind(this);

            close.addEventListener('click', handler);
            this._handlers.closeClick = handler;

            ASLDS.logger.debug('Close button setup complete.');
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
                // Only close if sidebar is open and we're on mobile
                if (this.state.isOpen && this.state.isMobile) {
                    // Allow group toggles to handle their own behavior
                    const isGroupToggle = e.target.closest(this.config.groupToggleSelector);
                    if (isGroupToggle) {
                        return;
                    }
                    // Small delay to allow click to register before closing
                    setTimeout(function () {
                        this.close();
                    }.bind(this), 100);
                }
            }.bind(this);

            links.forEach(function (link) {
                link.addEventListener('click', handler);
            });

            this._handlers.linkClick = handler;

            ASLDS.logger.debug('Links setup complete: ' + links.length + ' links.');
        },

        /**
         * Setup nested navigation groups
         */
        _setupGroups: function () {
            const groups = this.elements.groups;
            if (!groups || groups.length === 0) {
                return;
            }

            groups.forEach(function (group, index) {
                const toggle = group.querySelector(this.config.groupToggleSelector);
                const menu = group.querySelector(this.config.groupMenuSelector);

                if (!toggle || !menu) {
                    return;
                }

                // Set ARIA attributes
                const isOpen = menu.classList.contains(this.config.openClass);
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                toggle.setAttribute('aria-haspopup', 'true');

                // Click handler
                const handler = function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isCurrentlyOpen = menu.classList.contains(this.config.openClass);

                    if (isCurrentlyOpen) {
                        menu.classList.remove(this.config.openClass);
                        toggle.setAttribute('aria-expanded', 'false');
                        group.classList.remove(this.config.openClass);
                    } else {
                        // Optionally close other groups
                        groups.forEach(function (g) {
                            if (g !== group) {
                                const m = g.querySelector(this.config.groupMenuSelector);
                                const t = g.querySelector(this.config.groupToggleSelector);
                                if (m) {
                                    m.classList.remove(this.config.openClass);
                                }
                                if (t) {
                                    t.setAttribute('aria-expanded', 'false');
                                }
                                g.classList.remove(this.config.openClass);
                            }
                        }.bind(this));

                        menu.classList.add(this.config.openClass);
                        toggle.setAttribute('aria-expanded', 'true');
                        group.classList.add(this.config.openClass);
                    }
                }.bind(this);

                toggle.addEventListener('click', handler);

                // Store for cleanup
                this._handlers.groupClicks.push({
                    toggle: toggle,
                    handler: handler,
                });

                // Keyboard support for group items
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
                                menu.classList.remove(this.config.openClass);
                                toggle.setAttribute('aria-expanded', 'false');
                                group.classList.remove(this.config.openClass);
                                toggle.focus();
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));

            ASLDS.logger.debug('Groups setup complete: ' + groups.length + ' groups.');
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
            let activeFound = false;

            links.forEach(function (link) {
                const href = link.getAttribute('href');
                if (!href) return;

                // Remove existing active class
                link.classList.remove(this.config.activeClass);

                // Check if this link matches the current path
                const isMatch = href === currentPath ||
                    (href !== '/' && currentPath.startsWith(href)) ||
                    (href === '/' && currentPath === '/');

                if (isMatch) {
                    link.classList.add(this.config.activeClass);
                    activeFound = true;

                    // If this link is inside a group, expand the group
                    const parentGroup = link.closest(this.config.groupSelector);
                    if (parentGroup) {
                        const menu = parentGroup.querySelector(this.config.groupMenuSelector);
                        const toggle = parentGroup.querySelector(this.config.groupToggleSelector);
                        if (menu) {
                            menu.classList.add(this.config.openClass);
                        }
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'true');
                        }
                        parentGroup.classList.add(this.config.openClass);
                    }
                }
            }.bind(this));

            // Auto-scroll to active item
            if (this.config.autoScrollActive && activeFound) {
                // Defer to allow DOM to update
                setTimeout(function () {
                    this._scrollToActive();
                }.bind(this), 50);
            }

            ASLDS.logger.debug('Active state applied.');
        },

        /**
         * Scroll to the active link
         */
        _scrollToActive: function () {
            const activeLink = this.elements.sidebar.querySelector('.' + this.config.activeClass);
            if (!activeLink) {
                return;
            }

            const sidebar = this.elements.sidebar;
            const offset = this.config.scrollOffset;

            // Get the position of the active link relative to the sidebar
            const linkRect = activeLink.getBoundingClientRect();
            const sidebarRect = sidebar.getBoundingClientRect();

            // Calculate scroll position
            const scrollTop = linkRect.top - sidebarRect.top + sidebar.scrollTop - offset;

            // Smooth scroll
            sidebar.scrollTo({
                top: scrollTop,
                behavior: 'smooth',
            });

            ASLDS.logger.debug('Scrolled to active item.');
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
            const wasMobile = this.state.isMobile;
            const isMobile = width < this.state.breakpoint;

            this.state.isMobile = isMobile;

            // If switching from desktop to mobile
            if (!wasMobile && isMobile) {
                // Ensure sidebar is closed on mobile
                if (this.state.isOpen) {
                    this.close({ noTransition: true });
                }
                // Remove collapse state on mobile
                if (this.state.isCollapsed) {
                    this.state.isCollapsed = false;
                    if (this.elements.sidebar) {
                        this.elements.sidebar.classList.remove(this.config.collapsedClass);
                        this.elements.sidebar.classList.add(this.config.expandedClass);
                    }
                }
            }

            // If switching from mobile to desktop
            if (wasMobile && !isMobile) {
                // Ensure sidebar is closed
                if (this.state.isOpen) {
                    this.close({ noTransition: true });
                }
                // Restore collapse state
                if (this.state.isCollapsed) {
                    if (this.elements.sidebar) {
                        this.elements.sidebar.classList.add(this.config.collapsedClass);
                        this.elements.sidebar.classList.remove(this.config.expandedClass);
                    }
                } else {
                    if (this.elements.sidebar) {
                        this.elements.sidebar.classList.remove(this.config.collapsedClass);
                        this.elements.sidebar.classList.add(this.config.expandedClass);
                    }
                }
            }

            // Update body scroll
            if (this.state.isOpen && isMobile) {
                this.elements.body.classList.add('no-scroll');
            } else {
                this.elements.body.classList.remove('no-scroll');
            }

            // Emit resize event
            ASLDS.events.emit('sidebar:resize', {
                width: width,
                breakpoint: this.state.breakpoint,
                isMobile: isMobile,
                wasMobile: wasMobile,
            });

            ASLDS.logger.debug('Resize handled: isMobile=' + isMobile);
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
            const sidebar = this.elements.sidebar;

            // Set ARIA label
            if (sidebar) {
                sidebar.setAttribute('aria-label', this.config.ariaLabel);
                sidebar.setAttribute('role', 'navigation');
            }

            // Set initial collapse state
            if (!this.state.isMobile && this.state.isCollapsed) {
                if (sidebar) {
                    sidebar.classList.add(this.config.collapsedClass);
                    sidebar.classList.remove(this.config.expandedClass);
                }
            } else if (!this.state.isMobile && !this.state.isCollapsed) {
                if (sidebar) {
                    sidebar.classList.remove(this.config.collapsedClass);
                    sidebar.classList.add(this.config.expandedClass);
                }
            }

            // Set initial mobile state
            if (this.state.isMobile) {
                if (sidebar) {
                    sidebar.classList.add('mobile');
                }
            } else {
                if (sidebar) {
                    sidebar.classList.remove('mobile');
                }
            }

            // Ensure no-scroll is removed
            this.elements.body.classList.remove('no-scroll');

            // Close mobile menu if on desktop
            if (!this.state.isMobile && this.state.isOpen) {
                this.close({ noTransition: true });
            }

            // Auto-scroll to active item after initial render
            if (this.config.autoScrollActive) {
                setTimeout(function () {
                    this._scrollToActive();
                }.bind(this), 100);
            }
        },

        /**
         * Start transition
         */
        _startTransition: function () {
            if (!this.config.enableTransitions) {
                return;
            }

            const sidebar = this.elements.sidebar;
            if (sidebar) {
                sidebar.classList.add('transitioning');
                setTimeout(function () {
                    sidebar.classList.remove('transitioning');
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

            // Close click
            if (this.elements.close && this._handlers.closeClick) {
                this.elements.close.removeEventListener('click', this._handlers.closeClick);
                this._handlers.closeClick = null;
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

            // Group clicks
            this._handlers.groupClicks.forEach(function (item) {
                item.toggle.removeEventListener('click', item.handler);
            });
            this._handlers.groupClicks = [];

            // Link clicks
            if (this._handlers.linkClick) {
                this.elements.links.forEach(function (link) {
                    link.removeEventListener('click', this._handlers.linkClick);
                }.bind(this));
                this._handlers.linkClick = null;
            }

            ASLDS.logger.debug('Event listeners removed.');
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Sidebar.config);
    Object.freeze(Sidebar.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Sidebar.name, Sidebar, Sidebar.priority, Sidebar.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all sidebars
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const sidebarElements = ASLDS.dom.findAll('[data-sidebar]');
        if (sidebarElements.length > 0) {
            sidebarElements.forEach(function (element) {
                Sidebar.init(element);
            });
        } else {
            // Fallback: find by class
            const sidebar = ASLDS.dom.find('.sidebar');
            if (sidebar) {
                Sidebar.init(sidebar);
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSSidebar) {
        window.ASLDSSidebar = Sidebar;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : sidebar.js
     * Module      : ASL Design System (ASLDS) Sidebar
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Tabs Module
 * File        : tabs.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Tabs Module manages tabbed interfaces across the ASL Design System.
 * It provides a unified tabs experience with support for:
 *   • Multiple independent tab groups
 *   • Tab activation with active state management
 *   • Associated panel switching
 *   • Deep linking using URL hash
 *   • Browser history integration
 *   • Keyboard navigation (Arrow keys, Home, End, Enter, Space)
 *   • Focus management
 *   • ARIA roles and attributes
 *   • Lazy loading support for tab panels
 *   • Nested tab groups
 *   • Responsive behaviour
 *   • Smooth transitions
 *   • Event delegation
 *   • Public API methods (activate, next, previous, destroy)
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
        console.error('[ASLDS] Runtime not found. Tabs module cannot initialize.');
        return;
    }

    // ========================================================================
    // Tabs Module
    // ========================================================================

    const Tabs = {
        /**
         * Module Information
         */
        name: 'Tabs',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Tabs Configuration
         */
        config: {
            // Selectors
            tabsSelector: '.tabs',
            tablistSelector: '.tab-list',
            tabSelector: '.tab',
            panelSelector: '.tab-panel',
            activeClass: 'active',
            openClass: 'open',
            visibleClass: 'visible',

            // Behavior
            enableDeepLinking: true,
            enableHistory: true,
            enableKeyboardNav: true,
            enableLazyLoad: true,
            enableTransitions: true,
            transitionDuration: 300,
            autoActivate: true,
            persistState: true,
            storageKey: 'aslds-tabs-state',

            // Accessibility
            ariaLabel: 'Tabs',
            tabListLabel: 'Tab list',

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
            hashChangeHandler: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            tabGroups: [],
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            documentClick: null,
            documentKeydown: null,
            resize: null,
            hashChange: null,
            instanceHandlers: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the tabs module
         * @param {Element|string} element - Tabs element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Tabs module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Tabs module v' + this.version + '...');

            // Find tab group elements
            let tabGroups = [];

            if (element) {
                const el = typeof element === 'string'
                    ? ASLDS.dom.find(element)
                    : element;

                if (el) {
                    tabGroups = [el];
                }
            } else {
                tabGroups = ASLDS.dom.findAll(this.config.tabsSelector);
            }

            if (tabGroups.length === 0) {
                ASLDS.logger.warn('No tab elements found.');
                return this;
            }

            // Cache elements
            this.elements.tabGroups = tabGroups;

            // Setup each tab group
            tabGroups.forEach(function (group, index) {
                this._setupTabGroup(group, index);
            }.bind(this));

            // Setup global event listeners
            this._setupGlobalEvents();

            // Setup hash change listener for deep linking
            if (this.config.enableDeepLinking) {
                this._setupHashChangeListener();
            }

            // Restore persisted state
            if (this.config.persistState) {
                this._restoreState();
            }

            this.state.initialized = true;

            ASLDS.logger.info('Tabs module initialized successfully.', {
                instanceCount: this.state.instances.length,
            });

            return this;
        },

        /**
         * Activate a tab
         * @param {Element|string} tab - Tab element or selector
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.updateHash - If false, doesn't update URL hash
         * @param {boolean} options.pushHistory - If false, doesn't push to history
         * @returns {Object} This instance for chaining
         */
        activate: function (tab, options) {
            options = options || {};

            const tabElement = typeof tab === 'string'
                ? ASLDS.dom.find(tab)
                : tab;

            if (!tabElement) {
                ASLDS.logger.warn('Tab element not found.');
                return this;
            }

            const instance = this._getInstanceByTab(tabElement);
            if (!instance) {
                ASLDS.logger.warn('Tab instance not found.');
                return this;
            }

            // Don't activate if already active
            if (tabElement.classList.contains(this.config.activeClass)) {
                return this;
            }

            // Get panel ID from tab
            const panelId = tabElement.getAttribute('aria-controls') ||
                tabElement.getAttribute('data-panel');

            if (!panelId) {
                ASLDS.logger.warn('Tab missing panel reference.', { tab: tabElement });
                return this;
            }

            const panel = ASLDS.dom.find('#' + panelId);
            if (!panel) {
                ASLDS.logger.warn('Panel not found for tab.', { panelId: panelId });
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition(instance);
            }

            // Deactivate all tabs in this group
            const tabs = instance.tabs;
            const panels = instance.panels;

            tabs.forEach(function (t) {
                t.classList.remove(this.config.activeClass);
                t.setAttribute('aria-selected', 'false');
                t.setAttribute('tabindex', '-1');
            }.bind(this));

            panels.forEach(function (p) {
                p.classList.remove(this.config.activeClass);
                p.classList.remove(this.config.visibleClass);
                p.setAttribute('aria-hidden', 'true');

                // Lazy load: if the panel is lazy-loaded, load content now
                if (this.config.enableLazyLoad && p.dataset.lazy) {
                    this._loadPanelContent(p);
                }
            }.bind(this));

            // Activate the selected tab
            tabElement.classList.add(this.config.activeClass);
            tabElement.setAttribute('aria-selected', 'true');
            tabElement.setAttribute('tabindex', '0');

            // Activate the associated panel
            panel.classList.add(this.config.activeClass);
            panel.classList.add(this.config.visibleClass);
            panel.setAttribute('aria-hidden', 'false');

            // Update instance state
            instance.activeTab = tabElement;
            instance.activePanel = panel;
            instance.activeIndex = tabs.indexOf(tabElement);

            // Update URL hash for deep linking
            if (this.config.enableDeepLinking && options.updateHash !== false) {
                const hash = this._getTabHash(instance, tabElement);
                if (hash) {
                    this._updateHash(hash, options.pushHistory !== false);
                }
            }

            // Save state
            if (this.config.persistState) {
                this._saveState(instance);
            }

            // Emit event
            ASLDS.events.emit('tabs:activate', {
                tab: tabElement,
                panel: panel,
                instance: instance,
                index: instance.activeIndex,
            });

            ASLDS.logger.debug('Tab activated.', {
                instance: instance.id,
                index: instance.activeIndex,
            });

            return this;
        },

        /**
         * Activate the next tab
         * @param {Element|string} tabs - Tabs element or selector
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        next: function (tabs, options) {
            const instance = this._getInstance(tabs);
            if (!instance) {
                ASLDS.logger.warn('Tab instance not found.');
                return this;
            }

            const tabsCount = instance.tabs.length;
            const nextIndex = (instance.activeIndex + 1) % tabsCount;
            const nextTab = instance.tabs[nextIndex];

            if (nextTab && !nextTab.disabled) {
                this.activate(nextTab, options);
            }

            return this;
        },

        /**
         * Activate the previous tab
         * @param {Element|string} tabs - Tabs element or selector
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        previous: function (tabs, options) {
            const instance = this._getInstance(tabs);
            if (!instance) {
                ASLDS.logger.warn('Tab instance not found.');
                return this;
            }

            const tabsCount = instance.tabs.length;
            const prevIndex = (instance.activeIndex - 1 + tabsCount) % tabsCount;
            const prevTab = instance.tabs[prevIndex];

            if (prevTab && !prevTab.disabled) {
                this.activate(prevTab, options);
            }

            return this;
        },

        /**
         * Get tab instance by element
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {Object|null} Tab instance or null
         */
        getInstance: function (tabs) {
            return this._getInstance(tabs);
        },

        /**
         * Get all tab instances
         * @returns {Array} Array of tab instances
         */
        getInstances: function () {
            return this.state.instances.slice();
        },

        /**
         * Get active tab for an instance
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {Element|null} Active tab element or null
         */
        getActiveTab: function (tabs) {
            const instance = this._getInstance(tabs);
            return instance ? instance.activeTab : null;
        },

        /**
         * Get active panel for an instance
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {Element|null} Active panel element or null
         */
        getActivePanel: function (tabs) {
            const instance = this._getInstance(tabs);
            return instance ? instance.activePanel : null;
        },

        /**
         * Get active index for an instance
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {number} Active index or -1
         */
        getActiveIndex: function (tabs) {
            const instance = this._getInstance(tabs);
            return instance ? instance.activeIndex : -1;
        },

        /**
         * Refresh a tab group (re-apply state)
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {Object} This instance for chaining
         */
        refresh: function (tabs) {
            const instance = this._getInstance(tabs);
            if (!instance) {
                return this;
            }

            // Re-apply active state
            if (instance.activeTab) {
                const tabsList = instance.tabs;
                const panelsList = instance.panels;

                tabsList.forEach(function (t) {
                    t.classList.remove(this.config.activeClass);
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                }.bind(this));

                panelsList.forEach(function (p) {
                    p.classList.remove(this.config.activeClass);
                    p.classList.remove(this.config.visibleClass);
                    p.setAttribute('aria-hidden', 'true');
                }.bind(this));

                instance.activeTab.classList.add(this.config.activeClass);
                instance.activeTab.setAttribute('aria-selected', 'true');
                instance.activeTab.setAttribute('tabindex', '0');

                if (instance.activePanel) {
                    instance.activePanel.classList.add(this.config.activeClass);
                    instance.activePanel.classList.add(this.config.visibleClass);
                    instance.activePanel.setAttribute('aria-hidden', 'false');
                }
            }

            return this;
        },

        /**
         * Refresh all tab groups
         * @returns {Object} This instance for chaining
         */
        refreshAll: function () {
            this.state.instances.forEach(function (instance) {
                this.refresh(instance.element);
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
                    tabCount: instance.tabs.length,
                    panelCount: instance.panels.length,
                    activeIndex: instance.activeIndex,
                    hasActiveTab: !!instance.activeTab,
                };
            });

            return {
                initialized: this.state.initialized,
                instanceCount: this.state.instances.length,
                instances: instances,
            };
        },

        /**
         * Destroy the tabs module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Tabs module...');

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

            ASLDS.logger.info('Tabs module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Setup a single tab group
         * @param {Element} element - Tabs element
         * @param {number} index - Tab group index
         */
        _setupTabGroup: function (element, index) {
            // Skip if already initialized
            if (element.dataset.tabsInitialized) {
                return;
            }

            element.dataset.tabsInitialized = 'true';

            // Find tab list, tabs, and panels
            const tablist = element.querySelector(this.config.tablistSelector) || element;
            const tabs = ASLDS.dom.findAll(this.config.tabSelector, tablist);
            const panels = ASLDS.dom.findAll(this.config.panelSelector, element);

            if (tabs.length === 0 || panels.length === 0) {
                ASLDS.logger.warn('Tab group missing tabs or panels.', { element: element });
                return;
            }

            // Create instance
            const instance = {
                id: 'tabs-' + (index + 1) + '-' + Date.now(),
                element: element,
                tablist: tablist,
                tabs: tabs,
                panels: panels,
                activeTab: null,
                activePanel: null,
                activeIndex: -1,
                isTransitioning: false,
                _keydownHandler: null,
            };

            // Set ARIA attributes on tablist
            tablist.setAttribute('role', 'tablist');
            tablist.setAttribute('aria-label', this.config.tabListLabel);

            // Setup each tab and its associated panel
            tabs.forEach(function (tab, i) {
                const panel = panels[i] || null;

                // Set tab ARIA attributes
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');

                if (panel) {
                    const panelId = panel.id || 'panel-' + instance.id + '-' + (i + 1);
                    if (!panel.id) {
                        panel.id = panelId;
                    }
                    tab.setAttribute('aria-controls', panelId);
                    tab.setAttribute('data-panel', panelId);

                    // Set panel ARIA attributes
                    panel.setAttribute('role', 'tabpanel');
                    panel.setAttribute('aria-labelledby', tab.id || 'tab-' + instance.id + '-' + (i + 1));
                    panel.setAttribute('aria-hidden', 'true');
                    if (!tab.id) {
                        tab.id = 'tab-' + instance.id + '-' + (i + 1);
                    }
                }

                // Click handler
                const clickHandler = function (e) {
                    e.preventDefault();
                    if (!this.classList.contains(this.config.activeClass)) {
                        this.activate(this);
                    }
                }.bind(this);

                tab.addEventListener('click', clickHandler);

                // Store handler for cleanup
                if (!instance._clickHandlers) {
                    instance._clickHandlers = [];
                }
                instance._clickHandlers.push({
                    tab: tab,
                    handler: clickHandler,
                });

                // Mark panel for lazy loading if it has lazy data attribute
                if (panel && panel.dataset.lazy) {
                    panel.dataset.lazyLoaded = 'false';
                }
            }.bind(this));

            // Determine initial active tab
            let activeTab = null;
            let activeIndex = 0;

            // Check for active class
            tabs.forEach(function (tab, i) {
                if (tab.classList.contains(this.config.activeClass)) {
                    activeTab = tab;
                    activeIndex = i;
                }
            }.bind(this));

            // If no active tab, use the first one
            if (!activeTab && tabs.length > 0) {
                activeTab = tabs[0];
                activeIndex = 0;
            }

            // Set initial active state
            if (activeTab) {
                const panelId = activeTab.getAttribute('aria-controls');
                const panel = panelId ? ASLDS.dom.find('#' + panelId) : null;

                tabs.forEach(function (t) {
                    t.classList.remove(this.config.activeClass);
                    t.setAttribute('aria-selected', 'false');
                    t.setAttribute('tabindex', '-1');
                }.bind(this));

                panels.forEach(function (p) {
                    p.classList.remove(this.config.activeClass);
                    p.classList.remove(this.config.visibleClass);
                    p.setAttribute('aria-hidden', 'true');
                }.bind(this));

                activeTab.classList.add(this.config.activeClass);
                activeTab.setAttribute('aria-selected', 'true');
                activeTab.setAttribute('tabindex', '0');

                if (panel) {
                    panel.classList.add(this.config.activeClass);
                    panel.classList.add(this.config.visibleClass);
                    panel.setAttribute('aria-hidden', 'false');

                    // Lazy load initial panel if needed
                    if (this.config.enableLazyLoad && panel.dataset.lazy) {
                        this._loadPanelContent(panel);
                    }
                }

                instance.activeTab = activeTab;
                instance.activePanel = panel;
                instance.activeIndex = activeIndex;
            }

            // Store instance
            this.state.instances.push(instance);

            // Setup keyboard navigation
            if (this.config.enableKeyboardNav) {
                this._setupKeyboardNav(instance);
            }

            // Handle deep linking
            if (this.config.enableDeepLinking) {
                this._checkHashForInstance(instance);
            }

            ASLDS.logger.debug('Tab instance created.', {
                id: instance.id,
                tabCount: tabs.length,
                panelCount: panels.length,
                activeIndex: instance.activeIndex,
            });
        },

        /**
         * Setup keyboard navigation for a tab group
         * @param {Object} instance - Tab instance
         */
        _setupKeyboardNav: function (instance) {
            const tablist = instance.tablist;
            const tabs = instance.tabs;

            const keydownHandler = function (e) {
                const target = e.target;
                if (!target.closest(this.config.tabSelector)) {
                    return;
                }

                const currentTab = target.closest(this.config.tabSelector);
                const currentIndex = tabs.indexOf(currentTab);

                let newIndex = -1;

                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        newIndex = (currentIndex + 1) % tabs.length;
                        break;

                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                        break;

                    case 'Home':
                        e.preventDefault();
                        newIndex = 0;
                        break;

                    case 'End':
                        e.preventDefault();
                        newIndex = tabs.length - 1;
                        break;

                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        const tab = target.closest(this.config.tabSelector);
                        if (tab && !tab.classList.contains(this.config.activeClass)) {
                            this.activate(tab);
                        }
                        break;

                    default:
                        return;
                }

                if (newIndex >= 0 && newIndex < tabs.length) {
                    const tabToFocus = tabs[newIndex];
                    if (tabToFocus && !tabToFocus.disabled) {
                        tabToFocus.focus();
                        // If autoActivate is enabled, activate the tab
                        if (this.config.autoActivate) {
                            this.activate(tabToFocus);
                        }
                    }
                }
            }.bind(this);

            tablist.addEventListener('keydown', keydownHandler);
            instance._keydownHandler = keydownHandler;

            ASLDS.logger.debug('Keyboard navigation setup for: ' + instance.id);
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Resize handler for responsive adjustments
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
         * Setup hash change listener for deep linking
         */
        _setupHashChangeListener: function () {
            const hashChangeHandler = function () {
                this.state.instances.forEach(function (instance) {
                    this._checkHashForInstance(instance);
                }.bind(this));
            }.bind(this);

            window.addEventListener('hashchange', hashChangeHandler);
            this._handlers.hashChange = hashChangeHandler;

            ASLDS.logger.debug('Hash change listener setup complete.');
        },

        /**
         * Remove global event listeners
         */
        _removeGlobalEvents: function () {
            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            if (this._handlers.hashChange) {
                window.removeEventListener('hashchange', this._handlers.hashChange);
                this._handlers.hashChange = null;
            }

            ASLDS.logger.debug('Global event listeners removed.');
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            // Responsive adjustments for tabs if needed
            ASLDS.events.emit('tabs:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
            });
        },

        /**
         * Check hash for a tab instance and activate matching tab
         * @param {Object} instance - Tab instance
         */
        _checkHashForInstance: function (instance) {
            const hash = window.location.hash;
            if (!hash) {
                return;
            }

            const tabId = hash.replace('#', '');
            const tab = instance.tabs.find(function (t) {
                return t.id === tabId ||
                    t.getAttribute('aria-controls') === tabId ||
                    t.getAttribute('data-panel') === tabId;
            });

            if (tab && !tab.classList.contains(this.config.activeClass)) {
                this.activate(tab, { updateHash: false });
            }
        },

        /**
         * Get hash for a tab
         * @param {Object} instance - Tab instance
         * @param {Element} tab - Tab element
         * @returns {string} Hash string
         */
        _getTabHash: function (instance, tab) {
            const panelId = tab.getAttribute('aria-controls') || tab.getAttribute('data-panel');
            if (panelId) {
                return panelId;
            }
            if (tab.id) {
                return tab.id;
            }
            return null;
        },

        /**
         * Update URL hash
         * @param {string} hash - Hash value
         * @param {boolean} pushHistory - Whether to push to history
         */
        _updateHash: function (hash, pushHistory) {
            if (!hash) {
                return;
            }

            if (pushHistory !== false && window.history && window.history.pushState) {
                window.history.pushState(null, null, '#' + hash);
            } else {
                window.location.hash = hash;
            }
        },

        /**
         * Load lazy panel content
         * @param {Element} panel - Panel element
         */
        _loadPanelContent: function (panel) {
            if (panel.dataset.lazyLoaded === 'true') {
                return;
            }

            const src = panel.dataset.src || panel.getAttribute('data-src');
            if (src) {
                // If it's a URL, load via fetch
                fetch(src)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('Failed to load panel content');
                        }
                        return response.text();
                    })
                    .then(function (html) {
                        panel.innerHTML = html;
                        panel.dataset.lazyLoaded = 'true';
                        ASLDS.logger.debug('Panel content loaded.', { panel: panel.id });
                    })
                    .catch(function (error) {
                        ASLDS.logger.error('Failed to load panel content.', { error: error });
                    });
            } else {
                // Otherwise, just mark as loaded
                panel.dataset.lazyLoaded = 'true';
            }
        },

        /**
         * Start transition for a tab group
         * @param {Object} instance - Tab instance
         */
        _startTransition: function (instance) {
            if (instance.isTransitioning) {
                return;
            }

            if (!this.config.enableTransitions) {
                return;
            }

            instance.isTransitioning = true;
            instance.element.classList.add('transitioning');

            setTimeout(function () {
                instance.element.classList.remove('transitioning');
                instance.isTransitioning = false;
            }, this.config.transitionDuration + 50);
        },

        /**
         * Save tab state to storage
         * @param {Object} instance - Tab instance
         */
        _saveState: function (instance) {
            if (!this.config.persistState) {
                return;
            }

            const state = {
                instanceId: instance.id,
                activeIndex: instance.activeIndex,
                timestamp: Date.now(),
            };

            ASLDS.storage.set(this.config.storageKey + '-' + instance.id, state);
        },

        /**
         * Restore tab state from storage
         */
        _restoreState: function () {
            this.state.instances.forEach(function (instance) {
                const state = ASLDS.storage.get(this.config.storageKey + '-' + instance.id);
                if (state && state.activeIndex !== undefined) {
                    const tab = instance.tabs[state.activeIndex];
                    if (tab && !tab.classList.contains(this.config.activeClass)) {
                        this.activate(tab, { updateHash: false, pushHistory: false });
                    }
                }
            }.bind(this));
        },

        /**
         * Get a tab instance by element
         * @param {Element|string} tabs - Tabs element or selector
         * @returns {Object|null} Tab instance or null
         */
        _getInstance: function (tabs) {
            if (!tabs) {
                return null;
            }

            const element = typeof tabs === 'string'
                ? ASLDS.dom.find(tabs)
                : tabs;

            if (!element) {
                return null;
            }

            for (let i = 0; i < this.state.instances.length; i++) {
                if (this.state.instances[i].element === element ||
                    this.state.instances[i].element.contains(element)) {
                    return this.state.instances[i];
                }
            }

            return null;
        },

        /**
         * Get a tab instance by tab element
         * @param {Element} tab - Tab element
         * @returns {Object|null} Tab instance or null
         */
        _getInstanceByTab: function (tab) {
            const group = tab.closest(this.config.tabsSelector);
            if (!group) {
                return null;
            }

            for (let i = 0; i < this.state.instances.length; i++) {
                if (this.state.instances[i].element === group) {
                    return this.state.instances[i];
                }
            }

            return null;
        },

        /**
         * Destroy a tab instance
         * @param {Object} instance - Tab instance
         */
        _destroyInstance: function (instance) {
            // Remove click handlers
            if (instance._clickHandlers) {
                instance._clickHandlers.forEach(function (item) {
                    item.tab.removeEventListener('click', item.handler);
                });
                instance._clickHandlers = null;
            }

            // Remove keyboard handler
            if (instance._keydownHandler) {
                instance.tablist.removeEventListener('keydown', instance._keydownHandler);
                instance._keydownHandler = null;
            }

            // Reset DOM attributes
            if (instance.element) {
                instance.element.classList.remove('transitioning');
                delete instance.element.dataset.tabsInitialized;
            }

            if (instance.tablist) {
                instance.tablist.removeAttribute('role');
                instance.tablist.removeAttribute('aria-label');
            }

            instance.tabs.forEach(function (tab) {
                tab.removeAttribute('role');
                tab.removeAttribute('aria-selected');
                tab.removeAttribute('tabindex');
                tab.removeAttribute('aria-controls');
                tab.removeAttribute('data-panel');
                tab.classList.remove(this.config.activeClass);
            }.bind(this));

            instance.panels.forEach(function (panel) {
                panel.removeAttribute('role');
                panel.removeAttribute('aria-labelledby');
                panel.removeAttribute('aria-hidden');
                panel.classList.remove(this.config.activeClass);
                panel.classList.remove(this.config.visibleClass);
            }.bind(this));

            ASLDS.logger.debug('Tab instance destroyed.', { id: instance.id });
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Tabs.config);
    Object.freeze(Tabs.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Tabs.name, Tabs, Tabs.priority, Tabs.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all tabs
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const tabElements = ASLDS.dom.findAll('[data-tabs]');
        if (tabElements.length > 0) {
            tabElements.forEach(function (element) {
                Tabs.init(element);
            });
        } else {
            // Fallback: find by class
            const tabs = ASLDS.dom.findAll('.tabs');
            if (tabs.length > 0) {
                Tabs.init();
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSTabs) {
        window.ASLDSTabs = Tabs;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : tabs.js
     * Module      : ASL Design System (ASLDS) Tabs
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
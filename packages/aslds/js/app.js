/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Runtime Core
 * File        : app.js
 * Version     : 1.2.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The ASLDS Runtime is the central JavaScript engine responsible for
 * bootstrapping and coordinating every frontend module within the
 * A Square L Innovate ecosystem.
 *
 * This runtime provides:
 *   • Global ASLDS namespace
 *   • Module management (register, unregister, boot)
 *   • Runtime lifecycle (init, refresh, destroy, reset)
 *   • Shared utilities (DOM, storage, events, logging)
 *   • Accessibility helpers
 *   • Performance helpers
 *   • Configuration management
 *   • Auto-initialization of components via data attributes
 *
 * This file intentionally contains NO component logic.
 * Component behavior belongs inside:
 *   theme.js, navbar.js, sidebar.js, dropdown.js, modal.js,
 *   tabs.js, toast.js, search.js, playground.js, animations.js
 *
 * ============================================================================
 * Copyright © 2026
 * A Square L Innovate
 * All Rights Reserved.
 * ============================================================================
 */

'use strict';

(function (window, document) {
    'use strict';

    // ========================================================================
    // Prevent Multiple Runtime Instances
    // ========================================================================

    if (window.ASLDS) {
        console.warn('[ASLDS] Runtime already exists.');
        return;
    }

    // ========================================================================
    // Runtime Namespace
    // ========================================================================

    const ASLDS = {
        /**
         * Framework Information
         */
        name: 'ASL Design System',
        shortName: 'ASLDS',
        version: '1.2.0',
        release: 'Stable',
        author: 'A Square L Innovate',
        initialized: false,

        /**
         * Runtime Configuration
         */
        config: {
            debug: false,
            logLevel: 1, // 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR, 4=NONE
            autoInitialize: true,
            autoInitComponents: true,
            componentPrefix: 'aslds',
            enableAccessibility: true,
            enableAnimations: true,
            enableLogging: true,
            observeDOM: true,
        },

        /**
         * Runtime State
         */
        state: {
            booting: false,
            initialized: false,
            ready: false,
            destroyed: false,
        },

        /**
         * Runtime Containers
         */
        modules: {},
        services: {},
        plugins: {},
        dependencies: {},
        cache: {
            elements: new Map(),
            listeners: [],
            observers: [],
        },

        /**
         * Shared Namespaces
         */
        utils: {},
        events: {},
        accessibility: {},
        performance: {},
        storage: {},
        dom: {},
    };

    // ========================================================================
    // Logger
    // ========================================================================

    ASLDS.logger = {
        levels: {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            NONE: 4,
        },

        _shouldLog: function (level) {
            if (!ASLDS.config.enableLogging) return false;
            return level >= ASLDS.config.logLevel;
        },

        _format: function (level, args) {
            const prefix = '[ASLDS]';
            const timestamp = new Date().toISOString();
            return [`${prefix} ${timestamp}`, ...args];
        },

        debug: function (...args) {
            if (this._shouldLog(this.levels.DEBUG)) {
                console.debug(...this._format('DEBUG', args));
            }
        },

        info: function (...args) {
            if (this._shouldLog(this.levels.INFO)) {
                console.info(...this._format('INFO', args));
            }
        },

        warn: function (...args) {
            if (this._shouldLog(this.levels.WARN)) {
                console.warn(...this._format('WARN', args));
            }
        },

        error: function (...args) {
            if (this._shouldLog(this.levels.ERROR)) {
                console.error(...this._format('ERROR', args));
            }
        },
    };

    // ========================================================================
    // Runtime Constants
    // ========================================================================

    ASLDS.constants = Object.freeze({
        VERSION: ASLDS.version,
        RELEASE: ASLDS.release,
        PREFIX: 'aslds',

        EVENTS: Object.freeze({
            // Runtime lifecycle
            BEFORE_INIT: 'runtime:before-init',
            AFTER_INIT: 'runtime:after-init',
            READY: 'runtime:ready',
            REFRESH: 'runtime:refresh',
            DESTROY: 'runtime:destroy',
            RESET: 'runtime:reset',

            // Module lifecycle
            MODULE_REGISTERED: 'module:registered',
            MODULE_UNREGISTERED: 'module:unregistered',
            MODULE_DESTROYED: 'module:destroyed',

            // Component lifecycle
            COMPONENT_INIT: 'component:init',
            COMPONENT_DESTROY: 'component:destroy',

            // Theme
            THEME_CHANGE: 'theme:change',

            // Sidebar
            SIDEBAR_OPEN: 'sidebar:open',
            SIDEBAR_CLOSE: 'sidebar:close',
            SIDEBAR_TOGGLE: 'sidebar:toggle',

            // Modal
            MODAL_OPEN: 'modal:open',
            MODAL_CLOSE: 'modal:close',

            // Toast
            TOAST_SHOW: 'toast:show',
            TOAST_HIDE: 'toast:hide',

            // DOM
            DOM_CHANGE: 'runtime:dom-change',
        }),

        SELECTORS: Object.freeze({
            navbar: '.navbar',
            sidebar: '.sidebar',
            dropdown: '.dropdown',
            modal: '.modal',
            tabs: '.tabs',
            toast: '.toast',
            tooltip: '.tooltip',
            accordion: '.accordion',
            button: '.btn',
        }),
    });

    // ========================================================================
    // Storage Service
    // ========================================================================

    ASLDS.storage = {
        /**
         * Storage key prefix to avoid collisions
         */
        prefix: 'ASLDS::',

        /**
         * Get a value from localStorage
         * @param {string} key - Storage key
         * @param {*} defaultValue - Default value if key doesn't exist
         * @returns {*} Stored value or defaultValue
         */
        get: function (key, defaultValue) {
            try {
                const value = localStorage.getItem(this.prefix + key);
                if (value === null) return defaultValue;
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            } catch (e) {
                ASLDS.logger.debug('Storage get failed', { key, error: e });
                return defaultValue;
            }
        },

        /**
         * Set a value in localStorage
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {boolean} Success status
         */
        set: function (key, value) {
            try {
                localStorage.setItem(this.prefix + key, JSON.stringify(value));
                return true;
            } catch (e) {
                ASLDS.logger.debug('Storage set failed', { key, error: e });
                return false;
            }
        },

        /**
         * Remove a key from localStorage
         * @param {string} key - Storage key
         * @returns {boolean} Success status
         */
        remove: function (key) {
            try {
                localStorage.removeItem(this.prefix + key);
                return true;
            } catch (e) {
                ASLDS.logger.debug('Storage remove failed', { key, error: e });
                return false;
            }
        },

        /**
         * Check if a key exists in localStorage
         * @param {string} key - Storage key
         * @returns {boolean} True if key exists
         */
        has: function (key) {
            return localStorage.getItem(this.prefix + key) !== null;
        },

        /**
         * Get all keys with the ASLDS prefix
         * @returns {Array} Array of keys (without prefix)
         */
        keys: function () {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key.replace(this.prefix, ''));
                }
            }
            return keys;
        },

        /**
         * Get all stored values as an object
         * @returns {Object} All stored key-value pairs
         */
        getAll: function () {
            const result = {};
            const keys = this.keys();
            for (const key of keys) {
                result[key] = this.get(key);
            }
            return result;
        },

        /**
         * Clear all ASLDS storage
         */
        clear: function () {
            const keys = this.keys();
            for (const key of keys) {
                this.remove(key);
            }
        },
    };

    // ========================================================================
    // Event Bus
    // ========================================================================

    ASLDS.events = {
        /**
         * Event listeners registry
         */
        _listeners: {},

        /**
         * Register an event listener
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         * @param {Object} context - Context to bind to callback
         * @returns {Object} This instance for chaining
         */
        on: function (event, callback, context) {
            if (!this._listeners[event]) {
                this._listeners[event] = [];
            }
            this._listeners[event].push({
                callback: callback,
                context: context || null,
            });
            return this;
        },

        /**
         * Register a one-time event listener
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         * @param {Object} context - Context to bind to callback
         * @returns {Object} This instance for chaining
         */
        once: function (event, callback, context) {
            const wrapper = function (data) {
                this.off(event, wrapper);
                callback.call(context || null, data);
            }.bind(this);
            this.on(event, wrapper, context);
            return this;
        },

        /**
         * Remove an event listener
         * @param {string} event - Event name
         * @param {Function} callback - Callback function to remove
         * @returns {Object} This instance for chaining
         */
        off: function (event, callback) {
            if (!this._listeners[event]) return this;
            if (callback) {
                this._listeners[event] = this._listeners[event].filter(
                    (listener) => listener.callback !== callback
                );
            } else {
                delete this._listeners[event];
            }
            return this;
        },

        /**
         * Emit an event
         * @param {string} event - Event name
         * @param {*} data - Data to pass to listeners
         * @returns {Object} This instance for chaining
         */
        emit: function (event, data) {
            if (!this._listeners[event]) return this;
            const listeners = this._listeners[event].slice();
            for (let i = 0; i < listeners.length; i++) {
                try {
                    listeners[i].callback.call(
                        listeners[i].context || window,
                        data,
                        event
                    );
                } catch (e) {
                    ASLDS.logger.error('Event handler error', { event, error: e });
                }
            }
            return this;
        },

        /**
         * Get the number of listeners for an event
         * @param {string} event - Event name
         * @returns {number} Number of listeners
         */
        count: function (event) {
            if (!this._listeners[event]) return 0;
            return this._listeners[event].length;
        },

        /**
         * Clear all event listeners
         * @param {string} event - Optional specific event to clear
         * @returns {Object} This instance for chaining
         */
        clear: function (event) {
            if (event) {
                delete this._listeners[event];
            } else {
                this._listeners = {};
            }
            return this;
        },
    };

    // ========================================================================
    // DOM Utilities
    // ========================================================================

    ASLDS.dom = {
        /**
         * Execute callback when DOM is ready
         * @param {Function} callback - Callback function
         * @returns {Object} This instance for chaining
         */
        ready: function (callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback, { once: true });
            } else {
                callback();
            }
            return this;
        },

        /**
         * Select a single element
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element
         * @returns {Element|null} Found element or null
         */
        find: function (selector, context) {
            context = context || document;
            return context.querySelector(selector);
        },

        /**
         * Select multiple elements
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element
         * @returns {Array} Array of found elements
         */
        findAll: function (selector, context) {
            context = context || document;
            return Array.from(context.querySelectorAll(selector));
        },

        /**
         * Check if an element exists
         * @param {string} selector - CSS selector
         * @param {Element} context - Context element
         * @returns {boolean} True if element exists
         */
        exists: function (selector, context) {
            return this.find(selector, context) !== null;
        },

        /**
         * Check if an element has a class
         * @param {Element} element - DOM element
         * @param {string} className - Class name
         * @returns {boolean} True if class exists
         */
        hasClass: function (element, className) {
            if (!element) return false;
            return element.classList.contains(className);
        },

        /**
         * Add a class to an element
         * @param {Element|string} element - DOM element or selector
         * @param {string} className - Class name
         * @returns {Object} This instance for chaining
         */
        addClass: function (element, className) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (element) {
                element.classList.add(className);
            }
            return this;
        },

        /**
         * Remove a class from an element
         * @param {Element|string} element - DOM element or selector
         * @param {string} className - Class name
         * @returns {Object} This instance for chaining
         */
        removeClass: function (element, className) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (element) {
                element.classList.remove(className);
            }
            return this;
        },

        /**
         * Toggle a class on an element
         * @param {Element|string} element - DOM element or selector
         * @param {string} className - Class name
         * @param {boolean} force - Force add or remove
         * @returns {boolean} New class state
         */
        toggleClass: function (element, className, force) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (!element) return false;
            if (force !== undefined) {
                element.classList.toggle(className, force);
                return force;
            }
            return element.classList.toggle(className);
        },

        /**
         * Get or set an attribute
         * @param {Element|string} element - DOM element or selector
         * @param {string} name - Attribute name
         * @param {string} value - Attribute value (optional, for setting)
         * @returns {string|null|Object} Attribute value or this instance
         */
        attr: function (element, name, value) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (!element) return null;
            if (value === undefined) {
                return element.getAttribute(name);
            }
            element.setAttribute(name, value);
            return this;
        },

        /**
         * Get or set a data attribute
         * @param {Element|string} element - DOM element or selector
         * @param {string} name - Data attribute name (without 'data-')
         * @param {*} value - Value (optional, for setting)
         * @returns {*} Data value or this instance
         */
        data: function (element, name, value) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (!element) return null;
            const key = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (value === undefined) {
                const raw = element.getAttribute(key);
                if (raw === null) return null;
                try {
                    return JSON.parse(raw);
                } catch {
                    return raw;
                }
            }
            element.setAttribute(key, typeof value === 'string' ? value : JSON.stringify(value));
            return this;
        },

        /**
         * Create an element from HTML string
         * @param {string} html - HTML string
         * @returns {Element} Created element
         */
        create: function (html) {
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content.firstChild;
        },

        /**
         * Create multiple elements from HTML string
         * @param {string} html - HTML string
         * @returns {DocumentFragment} Document fragment
         */
        createFragment: function (html) {
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            return template.content;
        },

        /**
         * Append a child to a parent
         * @param {Element|string} parent - Parent element or selector
         * @param {Element|string} child - Child element or HTML string
         * @returns {Object} This instance for chaining
         */
        append: function (parent, child) {
            if (typeof parent === 'string') {
                parent = this.find(parent);
            }
            if (!parent) return this;
            if (typeof child === 'string') {
                child = this.create(child);
            }
            if (child) {
                parent.appendChild(child);
            }
            return this;
        },

        /**
         * Prepend a child to a parent
         * @param {Element|string} parent - Parent element or selector
         * @param {Element|string} child - Child element or HTML string
         * @returns {Object} This instance for chaining
         */
        prepend: function (parent, child) {
            if (typeof parent === 'string') {
                parent = this.find(parent);
            }
            if (!parent) return this;
            if (typeof child === 'string') {
                child = this.create(child);
            }
            if (child) {
                parent.prepend(child);
            }
            return this;
        },

        /**
         * Empty an element of all children
         * @param {Element|string} element - Element or selector
         * @returns {Object} This instance for chaining
         */
        empty: function (element) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (element) {
                element.innerHTML = '';
            }
            return this;
        },

        /**
         * Remove an element from the DOM
         * @param {Element|string} element - Element or selector
         * @returns {Object} This instance for chaining
         */
        remove: function (element) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            return this;
        },

        /**
         * Add an event listener with automatic cleanup tracking
         * @param {Element|string} element - Element or selector
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         * @param {Object} options - Event listener options
         * @returns {Object} This instance for chaining
         */
        on: function (element, event, callback, options) {
            if (typeof element === 'string') {
                element = this.find(element);
            }
            if (!element) return this;
            element.addEventListener(event, callback, options || false);
            ASLDS.cache.listeners.push({
                element: element,
                event: event,
                callback: callback,
                options: options || false,
            });
            return this;
        },

        /**
         * Event delegation
         * @param {Element|string} parent - Parent element or selector
         * @param {string} event - Event name
         * @param {string} selector - Child selector
         * @param {Function} handler - Handler function
         * @returns {Object} This instance for chaining
         */
        delegate: function (parent, event, selector, handler) {
            if (typeof parent === 'string') {
                parent = this.find(parent);
            }
            if (!parent) return this;
            parent.addEventListener(event, function (e) {
                const target = e.target.closest(selector);
                if (target) {
                    handler.call(target, e, target);
                }
            });
            return this;
        },
    };

    // ========================================================================
    // Type Helpers
    // ========================================================================

    ASLDS.utils = {
        /**
         * DOM Ready (legacy - use ASLDS.dom.ready instead)
         */
        domReady: function (callback) {
            return ASLDS.dom.ready(callback);
        },

        /**
         * Type checks
         */
        isFunction: function (value) {
            return typeof value === 'function';
        },

        isObject: function (value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },

        isString: function (value) {
            return typeof value === 'string';
        },

        isNumber: function (value) {
            return typeof value === 'number' && !isNaN(value);
        },

        isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        isElement: function (value) {
            return value instanceof Element;
        },

        isArray: function (value) {
            return Array.isArray(value);
        },

        isUndefined: function (value) {
            return value === undefined;
        },

        isNull: function (value) {
            return value === null;
        },

        isEmpty: function (value) {
            if (value === null || value === undefined) return true;
            if (typeof value === 'string') return value.trim() === '';
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === 'object') return Object.keys(value).length === 0;
            return false;
        },

        /**
         * Select element (legacy - use ASLDS.dom.find)
         */
        select: function (selector, scope) {
            return ASLDS.dom.find(selector, scope);
        },

        /**
         * Select all elements (legacy - use ASLDS.dom.findAll)
         */
        selectAll: function (selector, scope) {
            return ASLDS.dom.findAll(selector, scope);
        },

        /**
         * Check if element exists (legacy - use ASLDS.dom.exists)
         */
        exists: function (selector, scope) {
            return ASLDS.dom.exists(selector, scope);
        },

        /**
         * Element cache
         */
        cacheElement: function (key, element) {
            ASLDS.cache.elements.set(key, element);
        },

        getCachedElement: function (key) {
            return ASLDS.cache.elements.get(key);
        },

        clearCache: function () {
            ASLDS.cache.elements.clear();
        },

        /**
         * Remove all event listeners (cleanup)
         */
        offAll: function () {
            ASLDS.cache.listeners.forEach(function (listener) {
                listener.element.removeEventListener(
                    listener.event,
                    listener.callback,
                    listener.options
                );
            });
            ASLDS.cache.listeners = [];
        },
    };

    // ========================================================================
    // Module Registry
    // ========================================================================

    /**
     * Register a module
     * @param {string} name - Module name
     * @param {Object} module - Module object with init/destroy methods
     * @param {number} priority - Load priority (lower = earlier)
     * @param {Array} dependencies - Array of module names this depends on
     * @returns {boolean} Success status
     */
    ASLDS.register = function (name, module, priority, dependencies) {
        priority = priority || 100;
        dependencies = dependencies || [];

        if (!ASLDS.utils.isString(name)) {
            ASLDS.logger.error('Module name must be a string.');
            return false;
        }

        if (!ASLDS.utils.isObject(module)) {
            ASLDS.logger.error('"' + name + '" is not a valid module.');
            return false;
        }

        if (ASLDS.modules[name]) {
            ASLDS.logger.warn('"' + name + '" is already registered.');
            return false;
        }

        ASLDS.modules[name] = {
            module: module,
            priority: priority,
            dependencies: dependencies,
        };

        ASLDS.logger.info('Registered module: ' + name);
        ASLDS.events.emit(ASLDS.constants.EVENTS.MODULE_REGISTERED, { name: name });
        return true;
    };

    /**
     * Unregister a module
     * @param {string} name - Module name
     * @returns {boolean} Success status
     */
    ASLDS.unregister = function (name) {
        if (!ASLDS.modules[name]) {
            ASLDS.logger.warn('Unknown module: ' + name);
            return false;
        }

        const module = ASLDS.modules[name];
        if (ASLDS.utils.isFunction(module.destroy)) {
            try {
                module.destroy();
            } catch (e) {
                ASLDS.logger.error('Module destroy failed: ' + name, e);
            }
        }

        delete ASLDS.modules[name];
        ASLDS.logger.info('Removed module: ' + name);
        ASLDS.events.emit(ASLDS.constants.EVENTS.MODULE_UNREGISTERED, { name: name });
        return true;
    };

    /**
     * Get a module
     * @param {string} name - Module name
     * @returns {Object|null} Module object or null
     */
    ASLDS.getModule = function (name) {
        return ASLDS.modules[name] || null;
    };

    /**
     * Check if a module exists
     * @param {string} name - Module name
     * @returns {boolean} True if module exists
     */
    ASLDS.hasModule = function (name) {
        return Object.prototype.hasOwnProperty.call(ASLDS.modules, name);
    };

    /**
     * Get all registered module names
     * @returns {Array} Array of module names
     */
    ASLDS.getModules = function () {
        return Object.keys(ASLDS.modules);
    };

    /**
     * Check if module dependencies are satisfied
     * @param {Object} module - Module object
     * @returns {boolean} True if all dependencies are met
     */
    ASLDS.dependenciesSatisfied = function (module) {
        if (!module.dependencies || module.dependencies.length === 0) {
            return true;
        }
        return module.dependencies.every(function (dependency) {
            return ASLDS.hasModule(dependency);
        });
    };

    // ========================================================================
    // Service Registry
    // ========================================================================

    /**
     * Register a service
     * @param {string} name - Service name
     * @param {*} service - Service instance
     * @returns {boolean} Success status
     */
    ASLDS.registerService = function (name, service) {
        if (!ASLDS.utils.isString(name)) {
            ASLDS.logger.error('Service name must be a string.');
            return false;
        }
        ASLDS.services[name] = service;
        ASLDS.logger.debug('Service registered: ' + name);
        return true;
    };

    /**
     * Get a service
     * @param {string} name - Service name
     * @returns {*} Service instance or null
     */
    ASLDS.getService = function (name) {
        return ASLDS.services[name] || null;
    };

    // ========================================================================
    // Plugin Registry
    // ========================================================================

    /**
     * Register a plugin
     * @param {string} name - Plugin name
     * @param {Object} plugin - Plugin object
     * @returns {boolean} Success status
     */
    ASLDS.use = function (name, plugin) {
        if (!ASLDS.utils.isObject(plugin)) {
            ASLDS.logger.error('Invalid plugin.');
            return false;
        }
        ASLDS.plugins[name] = plugin;
        ASLDS.logger.info('Plugin loaded: ' + name);
        return true;
    };

    // ========================================================================
    // Accessibility Helpers
    // ========================================================================

    ASLDS.accessibility = {
        /**
         * Set aria-expanded attribute
         */
        setExpanded: function (element, expanded) {
            if (!element) return;
            element.setAttribute('aria-expanded', expanded);
        },

        /**
         * Set aria-hidden attribute
         */
        setHidden: function (element, hidden) {
            if (!element) return;
            element.setAttribute('aria-hidden', hidden);
        },

        /**
         * Set aria-label attribute
         */
        setLabel: function (element, label) {
            if (!element) return;
            element.setAttribute('aria-label', label);
        },

        /**
         * Set role attribute
         */
        setRole: function (element, role) {
            if (!element) return;
            element.setAttribute('role', role);
        },

        /**
         * Focus an element
         */
        focus: function (element) {
            if (!element) return;
            element.focus();
        },

        /**
         * Trap focus within a container
         */
        trapFocus: function (container) {
            if (!container) return;
            const focusable = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            container.addEventListener('keydown', function (e) {
                if (e.key !== 'Tab') return;
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
            });
        },
    };

    // ========================================================================
    // Performance Helpers
    // ========================================================================

    ASLDS.performance = {
        /**
         * Create a performance mark
         */
        mark: function (name) {
            if (window.performance && performance.mark) {
                performance.mark(name);
            }
        },

        /**
         * Measure between two marks
         */
        measure: function (name, start, end) {
            if (window.performance && performance.measure) {
                performance.measure(name, start, end);
            }
        },

        /**
         * Get current high-resolution time
         */
        now: function () {
            if (window.performance && performance.now) {
                return performance.now();
            }
            return Date.now();
        },
    };

    // ========================================================================
    // Error Manager
    // ========================================================================

    ASLDS.errors = {
        /**
         * Report an error
         */
        report: function (error, context) {
            ASLDS.logger.error(context || 'Error', error);
            return this;
        },

        /**
         * Log a warning
         */
        warn: function (message) {
            ASLDS.logger.warn(message);
            return this;
        },
    };

    // ========================================================================
    // Configuration
    // ========================================================================

    /**
     * Update runtime configuration
     * @param {Object} options - Configuration options
     * @returns {boolean} Success status
     */
    ASLDS.configure = function (options) {
        if (!ASLDS.utils.isObject(options)) {
            ASLDS.logger.error('Configuration must be an object.');
            return false;
        }
        Object.assign(ASLDS.config, options);
        ASLDS.logger.info('Runtime configuration updated.');
        return true;
    };

    // ========================================================================
    // Runtime Bootstrap
    // ========================================================================

    /**
     * Boot the runtime - initialize all registered modules
     */
    ASLDS.boot = function () {
        if (ASLDS.state.booting) {
            ASLDS.logger.warn('Boot already in progress.');
            return;
        }

        ASLDS.state.booting = true;
        ASLDS.logger.info('Boot sequence started.');

        // Sort modules by priority
        const sortedModules = Object.values(ASLDS.modules).sort(function (a, b) {
            return a.priority - b.priority;
        });

        // Initialize each module
        sortedModules.forEach(function (item) {
            const module = item.module;
            if (!ASLDS.utils.isFunction(module.init)) {
                return;
            }

            // Check dependencies
            if (!ASLDS.dependenciesSatisfied(item)) {
                ASLDS.logger.warn('Dependencies not satisfied for module', item);
                return;
            }

            try {
                module.init();
            } catch (error) {
                ASLDS.errors.report(error, 'Module initialization failed');
            }
        });

        ASLDS.state.ready = true;
        ASLDS.state.booting = false;

        ASLDS.events.emit(ASLDS.constants.EVENTS.READY);
        ASLDS.logger.info('Boot sequence completed.');
    };

    /**
     * Auto-initialize components via data attributes
     */
    ASLDS._autoInit = function () {
        if (!ASLDS.config.autoInitComponents) return;

        const selector = '[data-' + ASLDS.config.componentPrefix + '-component]';
        const components = ASLDS.dom.findAll(selector);

        components.forEach(function (element) {
            const componentName = element.getAttribute(
                'data-' + ASLDS.config.componentPrefix + '-component'
            );
            if (!componentName) return;

            // Convert kebab-case to PascalCase: e.g., 'theme-toggle' -> 'ThemeToggle'
            const methodName = 'init' + componentName
                .split('-')
                .map(function (part) {
                    return part.charAt(0).toUpperCase() + part.slice(1);
                })
                .join('');

            if (ASLDS.utils.isFunction(ASLDS[methodName])) {
                try {
                    ASLDS[methodName](element);
                    ASLDS.logger.debug('Auto-initialized: ' + componentName);
                } catch (e) {
                    ASLDS.logger.error('Auto-init failed: ' + componentName, e);
                }
            } else {
                ASLDS.logger.debug('No init method for: ' + componentName);
            }
        });
    };

    // ========================================================================
    // DOM Observer
    // ========================================================================

    ASLDS.observer = null;

    /**
     * Start DOM mutation observer
     */
    ASLDS.startObserver = function () {
        if (!ASLDS.config.observeDOM) return;
        if (!document.body) return;

        ASLDS.observer = new MutationObserver(function () {
            ASLDS.events.emit(ASLDS.constants.EVENTS.DOM_CHANGE);
        });

        ASLDS.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        ASLDS.logger.debug('DOM observer started.');
    };

    // ========================================================================
    // Runtime Lifecycle
    // ========================================================================

    /**
     * Initialize the runtime
     */
    ASLDS.init = function () {
        if (ASLDS.initialized) {
            ASLDS.logger.warn('Runtime already initialized.');
            return;
        }

        ASLDS.events.emit(ASLDS.constants.EVENTS.BEFORE_INIT);
        ASLDS.logger.info('Initializing ASLDS Runtime v' + ASLDS.version);

        ASLDS.boot();
        ASLDS.startObserver();
        ASLDS._autoInit();

        ASLDS.initialized = true;
        ASLDS.state.initialized = true;

        ASLDS.events.emit(ASLDS.constants.EVENTS.AFTER_INIT);
        ASLDS.logger.info('ASLDS Runtime initialized successfully.');
    };

    /**
     * Refresh the runtime (re-boot modules)
     */
    ASLDS.refresh = function () {
        ASLDS.logger.info('Refreshing runtime...');
        ASLDS.boot();
        ASLDS.events.emit(ASLDS.constants.EVENTS.REFRESH);
    };

    /**
     * Destroy the runtime
     */
    ASLDS.destroy = function () {
        if (ASLDS.state.destroyed) {
            return;
        }

        ASLDS.logger.info('Destroying runtime...');

        // Destroy all modules
        Object.entries(ASLDS.modules).forEach(function (_ref) {
            var name = _ref[0];
            var module = _ref[1];
            if (ASLDS.utils.isFunction(module.destroy)) {
                try {
                    module.destroy();
                    ASLDS.logger.debug(name + ' destroyed.');
                } catch (error) {
                    ASLDS.logger.error(name + ' destroy failed.', error);
                }
            }
        });

        // Disconnect observer
        if (ASLDS.observer) {
            ASLDS.observer.disconnect();
            ASLDS.observer = null;
        }

        // Clean up event listeners
        ASLDS.utils.offAll();
        ASLDS.utils.clearCache();
        ASLDS.events.clear();

        // Clear containers
        ASLDS.plugins = {};
        ASLDS.services = {};
        ASLDS.modules = {};

        ASLDS.events.emit(ASLDS.constants.EVENTS.DESTROY);
        ASLDS.state.destroyed = true;
        ASLDS.initialized = false;

        ASLDS.logger.info('Runtime destroyed.');
    };

    /**
     * Reset the runtime (destroy + re-init)
     */
    ASLDS.reset = function () {
        ASLDS.logger.warn('Resetting runtime...');
        ASLDS.destroy();

        ASLDS.state.booting = false;
        ASLDS.state.initialized = false;
        ASLDS.state.ready = false;
        ASLDS.state.destroyed = false;
        ASLDS.initialized = false;

        ASLDS.events.emit(ASLDS.constants.EVENTS.RESET);
        ASLDS.init();
    };

    // ========================================================================
    // Runtime Info / Status
    // ========================================================================

    /**
     * Get runtime information
     * @returns {Object} Runtime info
     */
    ASLDS.info = function () {
        return {
            framework: ASLDS.name,
            version: ASLDS.version,
            release: ASLDS.release,
            author: ASLDS.author,
            initialized: ASLDS.initialized,
            ready: ASLDS.state.ready,
            modules: ASLDS.getModules(),
            services: Object.keys(ASLDS.services),
            plugins: Object.keys(ASLDS.plugins),
        };
    };

    /**
     * Get runtime status
     * @returns {Object} Runtime status
     */
    ASLDS.status = function () {
        return {
            initialized: ASLDS.initialized,
            booting: ASLDS.state.booting,
            ready: ASLDS.state.ready,
            destroyed: ASLDS.state.destroyed,
            modules: ASLDS.getModules(),
            configuration: Object.assign({}, ASLDS.config),
        };
    };

    /**
     * Get runtime version
     * @returns {Object} Version info
     */
    ASLDS.getVersion = function () {
        return {
            framework: ASLDS.shortName,
            version: ASLDS.version,
            release: ASLDS.release,
        };
    };

    // ========================================================================
    // Runtime Initialization (Auto)
    // ========================================================================

    // Destroy on page unload
    window.addEventListener('beforeunload', function () {
        ASLDS.destroy();
    });

    // Auto-initialize on load
    window.addEventListener('load', function () {
        if (ASLDS.config.autoInitialize) {
            ASLDS.init();
        }
    });

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(ASLDS.utils);
    
    Object.freeze(ASLDS.storage);
    Object.freeze(ASLDS.errors);
    Object.freeze(ASLDS.constants);
    Object.freeze(ASLDS.logger);
    Object.freeze(ASLDS.accessibility);
    Object.freeze(ASLDS.performance);

    // ========================================================================
    // Export Runtime
    // ========================================================================

    window.ASLDS = ASLDS;

    /*!
     * ============================================================================
     * End of File
     * File        : app.js
     * Runtime     : ASL Design System (ASLDS)
     * Version     : 1.2.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
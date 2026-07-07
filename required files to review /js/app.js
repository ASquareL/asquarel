/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 *
 * ASL Design System (ASLDS)
 * Runtime Core
 *
 * ----------------------------------------------------------------------------
 * File        : app.js
 * Version     : 1.1.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description
 * ----------------------------------------------------------------------------
 * The ASLDS Runtime is the central JavaScript engine responsible for
 * bootstrapping and coordinating every frontend module within the
 * A Square L Innovate ecosystem.
 *
 * This runtime provides:
 *
 * • Global ASLDS namespace
 * • Module management
 * • Runtime lifecycle
 * • Shared utilities
 * • Accessibility helpers
 * • Event system
 * • Performance helpers
 * • Configuration management
 *
 * This file intentionally contains NO component logic.
 *
 * Component behavior belongs inside:
 *
 * theme.js
 * navbar.js
 * sidebar.js
 * dropdown.js
 * modal.js
 * tabs.js
 * toast.js
 * search.js
 * playground.js
 * animations.js
 *
 * ============================================================================
 * Copyright © 2026
 * A Square L Innovate
 * All Rights Reserved.
 * ============================================================================
 */

"use strict";

(function (window, document) {

    /**
     * ========================================================================
     * Prevent Multiple Runtime Instances
     * ========================================================================
     */

    if (window.ASLDS) {

        console.warn(

            "[ASLDS] Runtime already exists."

        );

        return;

    }

    /**
     * ========================================================================
     * Runtime Namespace
     * ========================================================================
     */

    const ASLDS = {

        /**
         * --------------------------------------------------------------------
         * Framework Information
         * --------------------------------------------------------------------
         */

        name: "ASL Design System",

        shortName: "ASLDS",

        version: "1.1.0",

        release: "Stable",

        author: "A Square L Innovate",

        initialized: false,

        /**
         * --------------------------------------------------------------------
         * Runtime Configuration
         * --------------------------------------------------------------------
         */

        config: {

            debug: false,

            autoInitialize: true,

            enableAccessibility: true,

            enableAnimations: true,

            enableLogging: true,

            observeDOM: true

        },

        /**
         * --------------------------------------------------------------------
         * Runtime State
         * --------------------------------------------------------------------
         */

        state: {

            booting: false,

            initialized: false,

            ready: false,

            destroyed: false

        },

        /**
         * --------------------------------------------------------------------
         * Runtime Containers
         * --------------------------------------------------------------------
         */

        modules: {},

        services: {},

        plugins: {},
        
        dependencies: {},

        cache: {

            elements: new Map(),

            listeners: [],

            observers: []

        },

        /**
         * --------------------------------------------------------------------
         * Shared Namespaces
         * --------------------------------------------------------------------
         */

        utils: {},

        events: {},

        accessibility: {},

        performance: {},

        /**
         * --------------------------------------------------------------------
         * Logger
         * --------------------------------------------------------------------
         */

        logger: {

            log(...message) {

                if (!ASLDS.config.enableLogging) {

                    return;

                }

                console.log(

                    "[ASLDS]",

                    ...message

                );

            },

            info(...message) {

                if (

                    !ASLDS.config.enableLogging ||

                    !ASLDS.config.debug

                ) {

                    return;

                }

                console.info(

                    "[ASLDS]",

                    ...message

                );

            },

            warn(...message) {

                console.warn(

                    "[ASLDS]",

                    ...message

                );

            },

            error(...message) {

                console.error(

                    "[ASLDS]",

                    ...message

                );

            }

        }

    };
    
    
    /**
 * ========================================================================
 * Runtime Constants
 * ========================================================================
 */

ASLDS.constants = Object.freeze({

    VERSION: ASLDS.version,

    RELEASE: ASLDS.release,

    EVENTS: Object.freeze({

        BEFORE_INIT: "runtime:before-init",

        AFTER_INIT: "runtime:after-init",

        REFRESH: "runtime:refresh",

        DESTROY: "runtime:destroy",

        MODULE_REGISTERED: "module:registered",

        MODULE_DESTROYED: "module:destroyed"

    })

});


    /**
     * ========================================================================
     * DOM Ready Utility
     * ========================================================================
     */

    ASLDS.utils.domReady = function (callback) {

        if (

            document.readyState === "loading"

        ) {

            document.addEventListener(

                "DOMContentLoaded",

                callback,

                {

                    once: true

                }

            );

            return;

        }

        callback();

    };

    /**
     * ========================================================================
     * Runtime Type Helpers
     * ========================================================================
     */

    ASLDS.utils.isFunction = function (value) {

        return typeof value === "function";

    };

    ASLDS.utils.isObject = function (value) {

        return (

            value !== null &&

            typeof value === "object" &&

            !Array.isArray(value)

        );

    };

    ASLDS.utils.isString = function (value) {

        return typeof value === "string";

    };

    ASLDS.utils.isElement = function (value) {

        return value instanceof Element;

    };

    ASLDS.utils.isArray = function (value) {

        return Array.isArray(value);

    };
    
        /**
     * ========================================================================
     * Module Registry
     * ========================================================================
     */

    ASLDS.register = function (

    name,

    module,

    priority = 100,

    dependencies = []

) {

        if (!ASLDS.utils.isString(name)) {

            ASLDS.logger.error(
                "Module name must be a string."
            );

            return false;

        }

        if (!ASLDS.utils.isObject(module)) {

            ASLDS.logger.error(
                `"${name}" is not a valid module.`
            );

            return false;

        }

        if (ASLDS.modules[name]) {

            ASLDS.logger.warn(
                `"${name}" is already registered.`
            );

            return false;

        }

        ASLDS.modules[name] = {

    module,

    priority,

    dependencies

};

        ASLDS.logger.info(
            `Registered module: ${name}`
        );

        return true;

    };

    /**
     * ========================================================================
     * Unregister Module
     * ========================================================================
     */

    ASLDS.unregister = function (name) {

        if (!ASLDS.modules[name]) {

            ASLDS.logger.warn(
                `Unknown module: ${name}`
            );

            return false;

        }

        delete ASLDS.modules[name];

        ASLDS.logger.info(
            `Removed module: ${name}`
        );

        return true;

    };

    /**
     * ========================================================================
     * Get Module
     * ========================================================================
     */

    ASLDS.getModule = function (name) {

        return ASLDS.modules[name] || null;

    };

    /**
     * ========================================================================
     * Check Module
     * ========================================================================
     */

    ASLDS.hasModule = function (name) {

        return Object.prototype.hasOwnProperty.call(

            ASLDS.modules,

            name

        );

    };

    /**
     * ========================================================================
     * List Registered Modules
     * ========================================================================
     */

    ASLDS.getModules = function () {

        return Object.keys(

            ASLDS.modules

        );

    };

    /**
     * ========================================================================
     * Register Runtime Service
     * ========================================================================
     */

    ASLDS.registerService = function (

        name,

        service

    ) {

        if (!ASLDS.utils.isString(name)) {

            return false;

        }

        ASLDS.services[name] = service;

        return true;

    };

    /**
     * ========================================================================
     * Get Runtime Service
     * ========================================================================
     */

    ASLDS.getService = function (name) {

        return ASLDS.services[name] || null;

    };

    /**
     * ========================================================================
     * Plugin Registration
     * ========================================================================
     */

    ASLDS.use = function (

        name,

        plugin

    ) {

        if (!ASLDS.utils.isObject(plugin)) {

            ASLDS.logger.error(

                "Invalid plugin."

            );

            return false;

        }

        ASLDS.plugins[name] = plugin;

        ASLDS.logger.info(

            `Plugin loaded: ${name}`

        );

        return true;

    };
    
    /**
 * ========================================================================
 * Check Module Dependencies
 * ========================================================================
 */

ASLDS.dependenciesSatisfied = function (

    module

) {

    if (

        !module.dependencies ||

        module.dependencies.length === 0

    ) {

        return true;

    }

    return module.dependencies.every(

        dependency =>

            ASLDS.hasModule(

                dependency

            )

    );

};

    /**
     * ========================================================================
     * Runtime Bootstrap
     * ========================================================================
     */

    ASLDS.boot = function () {

        if (ASLDS.state.booting) {

            return;

        }

        ASLDS.state.booting = true;

        ASLDS.logger.info(

            "Boot sequence started."

        );

        Object.values(

    ASLDS.modules

)

.sort(

    (a, b) =>

        a.priority - b.priority

)

.forEach(

    item => {

        const module = item.module;

        if (

            !ASLDS.utils.isFunction(

                module.init

            )

        ) {

            return;

        }

        try {

            module.init();

        }

        catch (error) {

            ASLDS.errors.report(

                error,

                "Module initialization"

            );

        }

    }
    
);

        ASLDS.state.ready = true;

        ASLDS.state.booting = false;
        
        ASLDS.events.emit(
    "runtime:ready"
);

        ASLDS.logger.info(

            "Runtime boot completed."

        );

    };

    /**
     * ========================================================================
     * Destroy Runtime Modules
     * ========================================================================
     */

    ASLDS.destroyModules = function () {

        Object.entries(

            ASLDS.modules

        ).forEach(

            ([name, module]) => {

                if (

                    !ASLDS.utils.isFunction(

                        module.destroy

                    )

                ) {

                    return;

                }

                try {

                    module.destroy();

                    ASLDS.logger.info(

                        `${name} destroyed.`

                    );

                }

                catch (error) {

                    ASLDS.logger.error(

                        `${name} destroy failed.`,

                        error

                    );

                }

            }

        );

    };
    
        /**
     * ========================================================================
     * Runtime Event Bus
     * ========================================================================
     */

    ASLDS.events.listeners = {};

    /**
     * ------------------------------------------------------------------------
     * Register Event Listener
     * ------------------------------------------------------------------------
     */

    ASLDS.events.on = function (

        event,

        callback

    ) {

        if (!ASLDS.events.listeners[event]) {

            ASLDS.events.listeners[event] = [];

        }

        ASLDS.events.listeners[event].push(

            callback

        );

    };

    /**
     * ------------------------------------------------------------------------
     * Remove Event Listener
     * ------------------------------------------------------------------------
     */

    ASLDS.events.off = function (

        event,

        callback

    ) {

        if (!ASLDS.events.listeners[event]) {

            return;

        }

        ASLDS.events.listeners[event] =

            ASLDS.events.listeners[event].filter(

                listener => listener !== callback

            );

    };

    /**
     * ------------------------------------------------------------------------
     * Emit Event
     * ------------------------------------------------------------------------
     */

    ASLDS.events.emit = function (

        event,

        payload = {}

    ) {

        if (!ASLDS.events.listeners[event]) {

            return;

        }

        ASLDS.events.listeners[event].forEach(

            listener => {

                try {

                    listener(payload);

                }

                catch (error) {

                    ASLDS.logger.error(

                        `Event "${event}" failed.`,

                        error

                    );

                }

            }

        );

    };

    /**
     * ========================================================================
     * DOM Utilities
     * ========================================================================
     */

    ASLDS.utils.select = function (

        selector,

        scope = document

    ) {

        return scope.querySelector(

            selector

        );

    };

    ASLDS.utils.selectAll = function (

        selector,

        scope = document

    ) {

        return Array.from(

            scope.querySelectorAll(

                selector

            )

        );

    };

    ASLDS.utils.exists = function (

        selector,

        scope = document

    ) {

        return scope.querySelector(

            selector

        ) !== null;

    };

    /**
     * ========================================================================
     * Element Cache
     * ========================================================================
     */

    ASLDS.utils.cacheElement = function (

        key,

        element

    ) {

        ASLDS.cache.elements.set(

            key,

            element

        );

    };

    ASLDS.utils.getCachedElement = function (

        key

    ) {

        return ASLDS.cache.elements.get(

            key

        );

    };

    ASLDS.utils.clearCache = function () {

        ASLDS.cache.elements.clear();

    };

    /**
     * ========================================================================
     * Event Helpers
     * ========================================================================
     */

    ASLDS.utils.on = function (

        element,

        event,

        callback,

        options = false

    ) {

        if (!element) {

            return;

        }

        element.addEventListener(

            event,

            callback,

            options

        );

        ASLDS.cache.listeners.push({

            element,

            event,

            callback,

            options

        });

    };

    ASLDS.utils.offAll = function () {

        ASLDS.cache.listeners.forEach(

            listener => {

                listener.element.removeEventListener(

                    listener.event,

                    listener.callback,

                    listener.options

                );

            }

        );

        ASLDS.cache.listeners = [];

    };
    
    
    /**
 * ========================================================================
 * Event Delegation
 * ========================================================================
 */

ASLDS.utils.delegate = function (

    parent,

    event,

    selector,

    handler

) {

    if (!parent) {

        return;

    }

    parent.addEventListener(

        event,

        function (e) {

            const target = e.target.closest(selector);

            if (!target) {

                return;

            }

            handler.call(

                target,

                e,

                target

            );

        }

    );

};

    /**
     * ========================================================================
     * Accessibility Helpers
     * ========================================================================
     */

    ASLDS.accessibility.setExpanded = function (

        element,

        expanded

    ) {

        if (!element) {

            return;

        }

        element.setAttribute(

            "aria-expanded",

            expanded

        );

    };

    ASLDS.accessibility.setHidden = function (

        element,

        hidden

    ) {

        if (!element) {

            return;

        }

        element.setAttribute(

            "aria-hidden",

            hidden

        );

    };

    ASLDS.accessibility.focus = function (

        element

    ) {

        if (!element) {

            return;

        }

        element.focus();

    };
    
    /**
 * ========================================================================
 * Runtime Storage
 * ========================================================================
 */

ASLDS.storage = {

    prefix: "ASLDS::",

    get(key) {

        try {

            const value = localStorage.getItem(

                this.prefix + key

            );

            return value === null

                ? null

                : JSON.parse(value);

        }

        catch {

            return null;

        }

    },

    set(key, value) {

        localStorage.setItem(

            this.prefix + key,

            JSON.stringify(value)

        );

    },

    remove(key) {

        localStorage.removeItem(

            this.prefix + key

        );

    },

    clear() {

        Object.keys(localStorage)

            .forEach(key => {

                if (

                    key.startsWith(this.prefix)

                ) {

                    localStorage.removeItem(key);

                }

            });

    }

};



/**
 * ========================================================================
 * Runtime Error Manager
 * ========================================================================
 */

ASLDS.errors = {

    report(error, context = "") {

        ASLDS.logger.error(

            context,

            error

        );

    },

    warn(message) {

        ASLDS.logger.warn(

            message

        );

    }

};


/**
 * ========================================================================
 * Shared Selectors
 * ========================================================================
 */

ASLDS.selectors = Object.freeze({

    navbar: ".navbar",

    sidebar: ".sidebar",

    dropdown: ".dropdown",

    modal: ".modal",

    tabs: ".tabs",

    toast: ".toast",

    tooltip: ".tooltip",

    accordion: ".accordion",

    button: ".btn"

});

    /**
     * ========================================================================
     * Performance Helpers
     * ========================================================================
     */

    ASLDS.performance.mark = function (

        name

    ) {

        performance.mark(

            name

        );

    };

    ASLDS.performance.measure = function (

        name,

        start,

        end

    ) {

        performance.measure(

            name,

            start,

            end

        );

    };

    ASLDS.performance.now = function () {

        return performance.now();

    };
    
    /**
 * ========================================================================
 * Runtime Observer
 * ========================================================================
 */

ASLDS.observer = null;

ASLDS.startObserver = function () {

    if (

        !ASLDS.config.observeDOM

    ) {

        return;

    }

    ASLDS.observer = new MutationObserver(

        function () {

            ASLDS.events.emit(

                "runtime:dom-change"

            );

        }

    );

    ASLDS.observer.observe(

        document.body,

        {

            childList: true,

            subtree: true

        }

    );

};

    /**
     * ========================================================================
     * Runtime Information
     * ========================================================================
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

            services: Object.keys(

                ASLDS.services

            ),

            plugins: Object.keys(

                ASLDS.plugins

            )

        };

    };
    
    
        /**
     * ========================================================================
     * Runtime Configuration
     * ========================================================================
     */

    ASLDS.configure = function (options = {}) {

        if (!ASLDS.utils.isObject(options)) {

            ASLDS.logger.error(
                "Configuration must be an object."
            );

            return false;

        }

        Object.assign(
            ASLDS.config,
            options
        );

        ASLDS.logger.info(
            "Runtime configuration updated."
        );

        return true;

    };

    /**
     * ========================================================================
     * Runtime Status
     * ========================================================================
     */

    ASLDS.status = function () {

        return {

            initialized: ASLDS.initialized,

            booting: ASLDS.state.booting,

            ready: ASLDS.state.ready,

            destroyed: ASLDS.state.destroyed,

            modules: ASLDS.getModules(),

            configuration: {

                ...ASLDS.config

            }

        };

    };

    /**
     * ========================================================================
     * Runtime Version
     * ========================================================================
     */

    ASLDS.getVersion = function () {

        return {

            framework: ASLDS.shortName,

            version: ASLDS.version,

            release: ASLDS.release

        };

    };

    /**
     * ========================================================================
     * Refresh Runtime
     * ========================================================================
     */

    ASLDS.refresh = function () {

        ASLDS.logger.info(
            "Refreshing runtime..."
        );

        ASLDS.boot();

        ASLDS.events.emit(
    ASLDS.constants.EVENTS.REFRESH
);

    };

    /**
     * ========================================================================
     * Runtime Initialization
     * ========================================================================
     */

    ASLDS.init = function () {

        if (ASLDS.initialized) {

            ASLDS.logger.warn(
                "Runtime already initialized."
            );

            return;

        }
        
        
        ASLDS.events.emit(
            ASLDS.constants.EVENTS.BEFORE_INIT
            
        );


        ASLDS.boot();
        
        ASLDS.startObserver();

        ASLDS.initialized = true;

        ASLDS.state.initialized = true;
        
       ASLDS.events.emit(
    ASLDS.constants.EVENTS.AFTER_INIT
); 
        ASLDS.logger.info(
            "ASLDS Runtime initialized successfully."
        );

    };

    /**
     * ========================================================================
     * Runtime Destroy
     * ========================================================================
     */

    ASLDS.destroy = function () {

        if (ASLDS.state.destroyed) {

            return;

        }

        ASLDS.destroyModules();
        
        if (

    ASLDS.observer

) {

    ASLDS.observer.disconnect();

}

        ASLDS.utils.offAll();

        ASLDS.utils.clearCache();
        
        ASLDS.events.emit(
            ASLDS.constants.EVENTS.DESTROY
            
        );
        
        ASLDS.events.listeners = {};

ASLDS.plugins = {};

ASLDS.services = {};

ASLDS.dependencies = {};

ASLDS.cache.elements.clear();

ASLDS.cache.listeners = [];

ASLDS.cache.observers = [];


        ASLDS.state.destroyed = true;

        ASLDS.logger.info(
            "Runtime destroyed."
        );

    };

    /**
     * ========================================================================
     * Runtime Reset
     * ========================================================================
     */

    ASLDS.reset = function () {

        ASLDS.logger.warn(
            "Resetting runtime..."
        );

        ASLDS.destroy();

        ASLDS.state.booting = false;

        ASLDS.state.initialized = false;

        ASLDS.state.ready = false;

        ASLDS.state.destroyed = false;

        ASLDS.initialized = false;

        ASLDS.init();

    };

    /**
     * ========================================================================
     * ========================================================================
     */

    window.addEventListener(

        "beforeunload",

        function () {

            ASLDS.destroy();

        }

    );

    /**
     * ========================================================================
     * Freeze Public Namespaces
     * ========================================================================
     */

    Object.freeze(ASLDS.utils);

Object.freeze(ASLDS.storage);

Object.freeze(ASLDS.errors);

Object.freeze(ASLDS.constants);

Object.freeze(ASLDS.selectors);

Object.freeze(ASLDS.logger);

Object.freeze(ASLDS.accessibility);

Object.freeze(ASLDS.performance);

Object.freeze(ASLDS.selectors);

    /**
     * ========================================================================
     * Export Runtime
     * ========================================================================
     */

    window.ASLDS = ASLDS;

window.addEventListener(

    "load",

    function () {

        if (

            ASLDS.config.autoInitialize

        ) {

            ASLDS.init();

        }

    }

);

/*!
 * ============================================================================
 * End of File
 * ----------------------------------------------------------------------------
 * File      : app.js
 * Runtime   : ASL Design System (ASLDS)
 * Version   : 1.1.0 Stable
 *
 * © 2026 A Square L Innovate
 * All Rights Reserved.
 * ============================================================================
 */
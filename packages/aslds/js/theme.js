/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 *
 * ASL Design System (ASLDS)
 * Theme Module
 *
 * File      : theme.js
 * Version   : 1.0.0
 * Author    : A Square L Innovate
 *
 * Description
 * ----------------------------------------------------------------------------
 * Manages application themes across the ASL Design System.
 *
 * Responsibilities:
 *
 * • Theme registration
 * • Theme initialization
 * • Theme persistence
 * • System theme detection
 * • Theme switching
 * • Accessibility integration
 * • Runtime communication
 *
 * ============================================================================
 */

"use strict";

(function () {

    /**
     * ========================================================================
     * Ensure Runtime Exists
     * ========================================================================
     */

    if (!window.ASLDS) {

        console.error(

            "[ASLDS] Runtime not found."

        );

        return;

    }

    /**
     * ========================================================================
     * Theme Module
     * ========================================================================
     */

    const Theme = {

        /**
         * --------------------------------------------------------------------
         * Module Information
         * --------------------------------------------------------------------
         */

        name: "Theme",

        version: "1.0.0",

        priority: 1,

        dependencies: [],

        /**
         * --------------------------------------------------------------------
         * Configuration
         * --------------------------------------------------------------------
         */

        config: {

            storageKey: "theme",

            defaultTheme: "dark",

            followSystem: true,

            attribute: "data-theme"

        },

        /**
         * --------------------------------------------------------------------
         * Runtime State
         * --------------------------------------------------------------------
         */

        state: {

            initialized: false,

            current: null,

            system: null,

            previous: null

        },

        /**
         * --------------------------------------------------------------------
         * Available Themes
         * --------------------------------------------------------------------
         */

        themes: [

            "light",

            "dark"

        ],

        /**
         * --------------------------------------------------------------------
         * Cached Elements
         * --------------------------------------------------------------------
         */

        elements: {

            root: document.documentElement

        }

    };






    /**
     * ========================================================================
     * Get Stored Theme
     * ========================================================================
     */

    Theme.getStoredTheme = function () {

        return ASLDS.storage.get(

            Theme.config.storageKey

        );

    };

    /**
     * ========================================================================
     * Save Theme
     * ========================================================================
     */

    Theme.saveTheme = function (

        theme

    ) {

        ASLDS.storage.set(

            Theme.config.storageKey,

            theme

        );

    };

    /**
     * ========================================================================
     * Detect System Theme
     * ========================================================================
     */

    Theme.getSystemTheme = function () {

        return window.matchMedia(

            "(prefers-color-scheme: dark)"

        ).matches

            ? "dark"

            : "light";

    };

    /**
     * ========================================================================
     * Apply Theme
     * ========================================================================
     */

    Theme.apply = function (

        theme

    ) {

        if (

            !Theme.themes.includes(

                theme

            )

        ) {

            ASLDS.logger.warn(

                `Unknown theme: ${theme}`

            );

            return;

        }

        Theme.state.previous =

            Theme.state.current;

        Theme.state.current = theme;

        Theme.elements.root.setAttribute(

            Theme.config.attribute,

            theme

        );

        Theme.saveTheme(

            theme

        );
        
        document

    .querySelectorAll(

        "[data-theme-toggle]"

    )

    .forEach(button => {

        button.textContent =

            theme === "dark"

                ? "☀ Light"

                : "🌙 Dark";

    });

        ASLDS.events.emit(

            "theme:changed",

            {

                current: theme,

                previous: Theme.state.previous

            }

        );

        ASLDS.logger.info(

            `Theme applied: ${theme}`

        );

    };

    /**
     * ========================================================================
     * Toggle Theme
     * ========================================================================
     */

    Theme.toggle = function () {

        Theme.apply(

            Theme.state.current === "dark"

                ? "light"

                : "dark"

        );

    };

    /**
     * ========================================================================
     * Load Theme
     * ========================================================================
     */

    Theme.load = function () {

        const saved =

            Theme.getStoredTheme();

        Theme.state.system =

            Theme.getSystemTheme();

        if (

            saved

        ) {

            Theme.apply(

                saved

            );

            return;

        }

        if (

            Theme.config.followSystem

        ) {

            Theme.apply(

                Theme.state.system

            );

            return;

        }

        Theme.apply(

            Theme.config.defaultTheme

        );

    };


    
    
        /**
     * ========================================================================
     * Listen for System Theme Changes
     * ========================================================================
     */

    Theme.watchSystemTheme = function () {

        const mediaQuery = window.matchMedia(

            "(prefers-color-scheme: dark)"

        );

        mediaQuery.addEventListener(

            "change",

            function (event) {

                Theme.state.system =

                    event.matches

                        ? "dark"

                        : "light";

                if (

                    Theme.config.followSystem

                ) {

                    Theme.apply(

                        Theme.state.system

                    );

                }

            }

        );

    };

    /**
     * ========================================================================
     * Get Current Theme
     * ========================================================================
     */

    Theme.getCurrentTheme = function () {

        return Theme.state.current;

    };

    /**
     * ========================================================================
     * Get Available Themes
     * ========================================================================
     */

    Theme.getThemes = function () {

        return [

            ...Theme.themes

        ];

    };

    /**
     * ========================================================================
     * Check Theme
     * ========================================================================
     */

    Theme.isDark = function () {

        return Theme.state.current === "dark";

    };

    Theme.isLight = function () {

        return Theme.state.current === "light";

    };

    /**
     * ========================================================================
     * Accessibility Support
     * ========================================================================
     */

    Theme.applyAccessibility = function () {

        const reducedMotion = window.matchMedia(

            "(prefers-reduced-motion: reduce)"

        ).matches;

        Theme.elements.root.setAttribute(

            "data-motion",

            reducedMotion

                ? "reduced"

                : "normal"

        );

        ASLDS.events.emit(

            "theme:accessibility",

            {

                reducedMotion

            }

        );

    };

    /**
     * ========================================================================
     * Theme Utilities
     * ========================================================================
     */

    Theme.refresh = function () {

        Theme.apply(

            Theme.state.current

        );

    };

    Theme.reset = function () {

        ASLDS.storage.remove(

            Theme.config.storageKey

        );

        Theme.state.current = null;

        Theme.state.previous = null;

        Theme.load();

    };

    /**
     * ========================================================================
     * Runtime Information
     * ========================================================================
     */

    Theme.info = function () {

        return {

            module: Theme.name,

            version: Theme.version,

            initialized: Theme.state.initialized,

            current: Theme.state.current,

            system: Theme.state.system,

            availableThemes: Theme.getThemes()

        };

    };


    
        /**
     * ========================================================================
     * Set Theme
     * ========================================================================
     */

    Theme.set = function (theme) {

        if (

            !Theme.themes.includes(

                theme

            )

        ) {

            ASLDS.errors.warn(

                `Unsupported theme: ${theme}`

            );

            return false;

        }

        Theme.apply(

            theme

        );

        return true;

    };

    /**
     * ========================================================================
     * Enable / Disable System Theme
     * ========================================================================
     */

    Theme.enableSystemTheme = function () {

        Theme.config.followSystem = true;

        Theme.apply(

            Theme.getSystemTheme()

        );

    };

    Theme.disableSystemTheme = function () {

        Theme.config.followSystem = false;

    };

    /**
     * ========================================================================
     * Register Theme Events
     * ========================================================================
     */

    Theme.registerEvents = function () {

        ASLDS.events.on(

            "runtime:refresh",

            function () {

                Theme.refresh();

            }

        );

        ASLDS.events.on(

            "runtime:destroy",

            function () {

                Theme.destroy();

            }

        );
        
        ASLDS.utils.delegate(
           
            document,
            
            "click",
            
            "[data-theme-toggle]",
            
            function () {
                
                Theme.toggle();
                
            }
            
        );
    };

    /**
     * ========================================================================
     * Destroy Theme Module
     * ========================================================================
     */

    Theme.destroy = function () {

        Theme.state.initialized = false;

        Theme.state.previous = null;

        Theme.state.system = null;

        ASLDS.logger.info(

            "Theme module destroyed."

        );

    };

    /**
     * ========================================================================
     * Update Initialization
     * ========================================================================
     */

    Theme.init = function () {

        if (

            Theme.state.initialized

        ) {

            return;

        }

        ASLDS.logger.info(

            "Initializing Theme module..."

        );

        Theme.load();

        Theme.watchSystemTheme();

        Theme.applyAccessibility();

        Theme.registerEvents();

        Theme.state.initialized = true;

        ASLDS.events.emit(

            "theme:ready",

            {

                current: Theme.state.current,

                system: Theme.state.system

            }

        );

    };

    /**
     * ========================================================================
     * Public API
     * ========================================================================
     */

    Object.freeze(

        Theme.config

    );

    Object.freeze(

        Theme.themes

    );

    Object.freeze(

        Theme.elements

    );

    /**
     * ========================================================================
     * Runtime Registration
     * ========================================================================
     */

    ASLDS.register(

        Theme.name,

        Theme,

        Theme.priority,

        Theme.dependencies

    );

})();



/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 *
 * ASL Design System (ASLDS)
 * Theme Module v2.0
 *
 * File      : theme.js
 * Version   : 2.0.0
 * Author    : A Square L Innovate
 *
 * Description
 * ----------------------------------------------------------------------------
 * Advanced theme management with Auto (system), Light, and Dark modes.
 * Persists user preference, watches OS changes, and provides a clean API.
 *
 * Features:
 *   • Three modes: 'auto', 'light', 'dark'
 *   • System theme detection & live updates
 *   • Smooth transitions with flash prevention
 *   • Persistent storage via ASLDS.storage
 *   • Full runtime integration
 *   • Toggle cycling with visual feedback
 *
 * ============================================================================
 */

"use strict";

(function (window, document) {

    // ========================================================================
    // Ensure Runtime Exists
    // ========================================================================

    if (!window.ASLDS) {
        console.error("[ASLDS] Theme module requires ASLDS runtime.");
        return;
    }

    // ========================================================================
    // Theme Module Definition
    // ========================================================================

    const Theme = {

        // --------------------------------------------------------------------
        // Module Metadata
        // --------------------------------------------------------------------

        name: "Theme",
        version: "2.0.0",
        priority: 10, // Early, but after storage is ready
        dependencies: [],

        // --------------------------------------------------------------------
        // Configuration
        // --------------------------------------------------------------------

        config: {
            storageKey: "theme-mode", // stores 'auto', 'light', or 'dark'
            attribute: "data-theme", // applied to <html>
            modeAttribute: "data-theme-mode", // applied to <html> to indicate mode
            transitionClass: "theme-transitioning",
            defaultMode: "auto", // fallback if no storage
            debounceDelay: 100, // ms for system theme changes
        },

        // --------------------------------------------------------------------
        // State
        // --------------------------------------------------------------------

        state: {
            initialized: false,
            mode: null, // 'auto' | 'light' | 'dark' (user preference)
            effective: null, // 'light' | 'dark' (actually applied)
            system: null, // cached system preference
            isTransitioning: false,
            mediaQuery: null,
            mediaListener: null,
            toggleTimeout: null,
        },

        // --------------------------------------------------------------------
        // Available Modes & Display Labels
        // --------------------------------------------------------------------

        modes: ["auto", "light", "dark"],

        labels: {
            auto: "🌓 Auto",
            light: "☀️ Light",
            dark: "🌙 Dark",
        },

        // --------------------------------------------------------------------
        // Cached Elements
        // --------------------------------------------------------------------

        elements: {
            root: document.documentElement,
            toggleButtons: null, // populated on init
        },
    };

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /**
     * Get the system theme (OS preference)
     */
    function getSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    /**
     * Resolve the effective theme based on current mode and system.
     */
    function resolveEffective(mode) {
        if (mode === "auto") {
            return getSystemTheme();
        }
        return mode; // 'light' or 'dark'
    }

    /**
     * Check if a mode is valid.
     */
    function isValidMode(mode) {
        return Theme.modes.indexOf(mode) !== -1;
    }

    /**
     * Get the user's stored mode, with backward compatibility.
     * Old storage might have 'light' or 'dark' directly.
     */
    function getStoredMode() {
        const stored = ASLDS.storage.get(Theme.config.storageKey);
        if (stored && isValidMode(stored)) {
            return stored;
        }
        // Backward compatibility: if they had 'dark' or 'light' saved without 'auto',
        // treat it as a forced mode.
        if (stored === "light" || stored === "dark") {
            return stored;
        }
        return Theme.config.defaultMode;
    }

    /**
     * Save the current mode to storage.
     */
    function saveMode(mode) {
        ASLDS.storage.set(Theme.config.storageKey, mode);
    }

    // ========================================================================
    // CORE THEME APPLICATION
    // ========================================================================

    /**
     * Apply a theme to the root element with transition handling.
     * @param {string} theme - 'light' or 'dark'
     * @param {boolean} instant - Skip transition if true
     */
    function applyTheme(theme, instant) {
        if (theme !== "light" && theme !== "dark") {
            ASLDS.logger.warn("[Theme] Invalid theme:", theme);
            return;
        }

        const root = Theme.elements.root;

        // Set the effective theme state
        Theme.state.effective = theme;

        // If instant, remove transitions to prevent flash
        if (instant) {
            root.classList.add(Theme.config.transitionClass);
        } else {
            root.classList.remove(Theme.config.transitionClass);
        }

        // Apply the theme attribute
        root.setAttribute(Theme.config.attribute, theme);

        // Update the mode attribute on root (so CSS can style based on mode)
        root.setAttribute(Theme.config.modeAttribute, Theme.state.mode);

        // Update toggle buttons text to reflect the current mode
        updateToggleButtons();

        // Emit effective change event (for other modules)
        ASLDS.events.emit("theme:effective-changed", {
            mode: Theme.state.mode,
            effective: Theme.state.effective,
            system: Theme.state.system,
        });

        ASLDS.logger.info(
            `[Theme] Applied effective theme: ${theme} (mode: ${Theme.state.mode})`
        );
    }

    /**
     * Resolve and apply the correct effective theme based on current mode.
     */
    function resolveAndApply(instant) {
        const effective = resolveEffective(Theme.state.mode);
        applyTheme(effective, instant);
        // Watch system if mode is auto, otherwise unwatch
        if (Theme.state.mode === "auto") {
            watchSystemTheme();
        } else {
            unwatchSystemTheme();
        }
    }

    // ========================================================================
    // SYSTEM THEME WATCHER
    // ========================================================================

    /**
     * Watch for OS theme changes (only active when mode === 'auto').
     */
    function watchSystemTheme() {
        if (Theme.state.mediaListener) return; // already watching

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        Theme.state.mediaQuery = mq;

        const handler = function (event) {
            const newSystem = event.matches ? "dark" : "light";
            Theme.state.system = newSystem;

            // Only re-apply if we're in auto mode and the system actually changed
            if (Theme.state.mode === "auto") {
                ASLDS.logger.info(
                    `[Theme] System theme changed to: ${newSystem} (auto mode)`
                );
                // Debounce to avoid rapid flashes
                clearTimeout(Theme.state.toggleTimeout);
                Theme.state.toggleTimeout = setTimeout(function () {
                    resolveAndApply(false);
                }, Theme.config.debounceDelay);
            }
        };

        // Initial system cache
        Theme.state.system = mq.matches ? "dark" : "light";

        // Use .addEventListener if available, else .addListener (legacy)
        if (mq.addEventListener) {
            mq.addEventListener("change", handler);
        } else {
            mq.addListener(handler);
        }

        Theme.state.mediaListener = handler;
        ASLDS.logger.info("[Theme] System theme watcher enabled.");
    }

    /**
     * Unwatch system theme changes.
     */
    function unwatchSystemTheme() {
        if (!Theme.state.mediaListener) return;

        const mq = Theme.state.mediaQuery;
        if (mq) {
            if (mq.removeEventListener) {
                mq.removeEventListener("change", Theme.state.mediaListener);
            } else {
                mq.removeListener(Theme.state.mediaListener);
            }
        }

        Theme.state.mediaQuery = null;
        Theme.state.mediaListener = null;
        ASLDS.logger.info("[Theme] System theme watcher disabled.");
    }

    // ========================================================================
    // TOGGLE BUTTONS
    // ========================================================================

    /**
     * Update all [data-theme-toggle] buttons with the current mode label.
     */
    function updateToggleButtons() {
        const buttons = document.querySelectorAll("[data-theme-toggle]");
        const label = Theme.labels[Theme.state.mode] || Theme.state.mode;
        buttons.forEach(function (btn) {
            btn.textContent = label;
        });
        // Cache for later
        Theme.elements.toggleButtons = buttons;
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    /**
     * Set the theme mode.
     * @param {string} mode - 'auto', 'light', or 'dark'
     * @param {boolean} instant - Skip transition if true
     * @returns {boolean} - Success
     */
    Theme.setMode = function (mode, instant) {
        if (!isValidMode(mode)) {
            ASLDS.logger.warn("[Theme] Invalid mode:", mode);
            return false;
        }

        if (mode === Theme.state.mode) {
            // Same mode, but maybe we still need to refresh if system changed?
            // We can just re-apply to be safe.
            Theme.state.mode = mode;
            saveMode(mode);
            resolveAndApply(instant);
            return true;
        }

        Theme.state.mode = mode;
        saveMode(mode);
        resolveAndApply(instant);

        // Emit mode change event
        ASLDS.events.emit("theme:mode-changed", {
            mode: mode,
            effective: Theme.state.effective,
        });

        ASLDS.logger.info(`[Theme] Mode set to: ${mode}`);
        return true;
    };

    /**
     * Toggle the theme mode in a cycle: auto → light → dark → auto.
     * @param {boolean} instant - Skip transition if true
     */
    Theme.toggle = function (instant) {
        const currentIndex = Theme.modes.indexOf(Theme.state.mode);
        const nextIndex = (currentIndex + 1) % Theme.modes.length;
        const nextMode = Theme.modes[nextIndex];
        Theme.setMode(nextMode, instant);
    };

    /**
     * Get the current mode (user preference).
     * @returns {string} 'auto', 'light', or 'dark'
     */
    Theme.getMode = function () {
        return Theme.state.mode;
    };

    /**
     * Get the currently applied theme.
     * @returns {string} 'light' or 'dark'
     */
    Theme.getEffectiveTheme = function () {
        return Theme.state.effective;
    };

    /**
     * Get the system theme.
     * @returns {string} 'light' or 'dark'
     */
    Theme.getSystemTheme = function () {
        return Theme.state.system || getSystemTheme();
    };

    /**
     * Check if dark mode is currently effective.
     * @returns {boolean}
     */
    Theme.isDark = function () {
        return Theme.state.effective === "dark";
    };

    /**
     * Check if light mode is currently effective.
     * @returns {boolean}
     */
    Theme.isLight = function () {
        return Theme.state.effective === "light";
    };

    /**
     * Check if auto mode is active.
     * @returns {boolean}
     */
    Theme.isAuto = function () {
        return Theme.state.mode === "auto";
    };

    /**
     * Refresh the current theme (re-apply without changing mode).
     * Useful after CSS changes or layout shifts.
     */
    Theme.refresh = function () {
        if (!Theme.state.initialized) return;
        resolveAndApply(true);
    };

    /**
     * Reset the theme to default (auto) and clear storage.
     */
    Theme.reset = function () {
        ASLDS.storage.remove(Theme.config.storageKey);
        Theme.state.mode = Theme.config.defaultMode;
        Theme.state.effective = null;
        saveMode(Theme.state.mode);
        resolveAndApply(true);
        ASLDS.logger.info("[Theme] Reset to default.");
    };

    /**
     * Get module information.
     * @returns {Object}
     */
    Theme.info = function () {
        return {
            module: Theme.name,
            version: Theme.version,
            mode: Theme.state.mode,
            effective: Theme.state.effective,
            system: Theme.state.system,
            initialized: Theme.state.initialized,
            availableModes: Theme.modes,
        };
    };

    // ========================================================================
    // LIFECYCLE: INIT, DESTROY
    // ========================================================================

    /**
     * Initialize the theme module.
     */
    Theme.init = function () {
        if (Theme.state.initialized) {
            ASLDS.logger.warn("[Theme] Already initialized.");
            return;
        }

        ASLDS.logger.info("[Theme] Initializing...");

        // Load stored mode (with backward compatibility)
        const storedMode = getStoredMode();
        Theme.state.mode = storedMode;
        Theme.state.system = getSystemTheme();

        // Apply the theme (instant to avoid flash)
        resolveAndApply(true);

        // Update toggle buttons
        updateToggleButtons();

        // Listen for runtime refresh
        ASLDS.events.on("runtime:refresh", function () {
            Theme.refresh();
        });

        // Listen for runtime destroy
        ASLDS.events.on("runtime:destroy", function () {
            Theme.destroy();
        });

        // Delegate click events on toggle buttons
        ASLDS.utils.delegate(
            document,
            "click",
            "[data-theme-toggle]",
            function (e) {
                e.preventDefault();
                Theme.toggle(false);
            }
        );

        Theme.state.initialized = true;

        ASLDS.events.emit("theme:ready", {
            mode: Theme.state.mode,
            effective: Theme.state.effective,
            system: Theme.state.system,
        });

        ASLDS.logger.info(
            `[Theme] Ready. Mode: ${Theme.state.mode}, Effective: ${Theme.state.effective}`
        );
    };

    /**
     * Destroy the theme module – clean up watchers and state.
     */
    Theme.destroy = function () {
        if (!Theme.state.initialized) return;

        unwatchSystemTheme();
        clearTimeout(Theme.state.toggleTimeout);

        Theme.state.initialized = false;
        Theme.state.mode = null;
        Theme.state.effective = null;
        Theme.state.system = null;

        ASLDS.logger.info("[Theme] Destroyed.");
    };

    // ========================================================================
    // REGISTER WITH RUNTIME
    // ========================================================================

    // Freeze config to prevent runtime mutation
    Object.freeze(Theme.config);
    Object.freeze(Theme.modes);
    Object.freeze(Theme.labels);

    // Register the module with ASLDS runtime
    ASLDS.register(Theme.name, Theme, Theme.priority, Theme.dependencies);

    // Expose on the global namespace for manual usage
    window.ASLDS.Theme = Theme;

})(window, document);
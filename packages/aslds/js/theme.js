/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Theme Module
 * File        : theme.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Theme Module manages application themes across the ASL Design System.
 * It provides a premium theming experience with support for:
 *   • Light, Dark, System, and Auto themes
 *   • Smooth theme transitions
 *   • Multiple theme toggle buttons
 *   • Theme preview (temporary theme application)
 *   • Theme suggestions based on time of day
 *   • Theme history with undo/redo
 *   • Theme scheduling (time-based)
 *   • Cross-tab synchronization
 *   • Accessibility (reduced motion, high contrast)
 *   • CSS Custom Properties support
 *   • Theme analytics tracking
 *   • Developer API for debugging
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
        console.error('[ASLDS] Runtime not found. Theme module cannot initialize.');
        return;
    }

    // ========================================================================
    // Theme Module
    // ========================================================================

    const Theme = {
        /**
         * Module Information
         */
        name: 'Theme',
        version: '2.0.0',
        priority: 1,
        dependencies: [],

        /**
         * Theme Configuration
         */
        config: {
            // Storage
            storageKey: 'aslds-theme',
            storagePrefix: 'ASLDS::',

            // Defaults
            defaultTheme: 'system',
            fallbackTheme: 'light',

            // Behavior
            followSystem: true,
            enableTransitions: true,
            transitionDuration: 300,
            enableHistory: true,
            maxHistory: 20,
            enableAnalytics: true,
            enableCrossTabSync: true,
            enableScheduling: true,
            enableSuggestions: true,

            // CSS
            attribute: 'data-theme',
            transitionClass: 'theme-transitioning',
            cssVariablesPrefix: '--theme-',

            // Toggles
            toggleSelector: '[data-theme-toggle]',
            toggleActiveClass: 'is-active',
            toggleInactiveClass: 'is-inactive',

            // Accessibility
            respectReducedMotion: true,
            respectHighContrast: true,

            // Auto Theme (time-based)
            auto: {
                enabled: false,
                darkStart: 18, // 6 PM
                darkEnd: 6, // 6 AM
                latitude: null,
                longitude: null,
            },

            // Custom themes
            customThemes: {},

            // Debug
            debug: false,
        },

        /**
         * Available Themes
         */
        themes: ['light', 'dark', 'system', 'auto'],

        /**
         * Theme Display Names
         */
        displayNames: {
            light: 'Light',
            dark: 'Dark',
            system: 'System',
            auto: 'Auto',
        },

        /**
         * Theme Icons
         */
        icons: {
            light: 'fa-sun',
            dark: 'fa-moon',
            system: 'fa-desktop',
            auto: 'fa-clock',
        },

        /**
         * Theme Emojis (fallback for no icons)
         */
        emojis: {
            light: '☀️',
            dark: '🌙',
            system: '🖥️',
            auto: '🕐',
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            current: null,
            active: null, // Resolved theme (light/dark)
            system: null,
            previous: null,
            history: [],
            historyIndex: -1,
            isTransitioning: false,
            isPreviewing: false,
            previewTheme: null,
            scheduledTheme: null,
            scheduleTimer: null,
            autoTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            root: document.documentElement,
            toggles: [],
            metaThemeColor: null,
        },

        /**
         * Theme CSS Variables
         */
        cssVariables: {
            light: {
                '--theme-bg': '#ffffff',
                '--theme-text': '#1a1a1a',
                '--theme-primary': '#D4AF37',
                '--theme-secondary': '#b8860b',
                '--theme-surface': '#f5f5f5',
                '--theme-border': '#e0e0e0',
                '--theme-shadow': 'rgba(0,0,0,0.1)',
                '--theme-hover': 'rgba(0,0,0,0.05)',
                '--theme-scrollbar': '#d1d1d1',
            },
            dark: {
                '--theme-bg': '#000000',
                '--theme-text': '#ffffff',
                '--theme-primary': '#D4AF37',
                '--theme-secondary': '#b8860b',
                '--theme-surface': '#1a1a1a',
                '--theme-border': '#333333',
                '--theme-shadow': 'rgba(0,0,0,0.5)',
                '--theme-hover': 'rgba(255,255,255,0.05)',
                '--theme-scrollbar': '#333333',
            },
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the theme module
         */
        init: function () {
            if (this.state.initialized) {
                ASLDS.logger.warn('Theme module already initialized.');
                return this;
            }

            ASLDS.logger.info('Initializing Theme module v' + this.version + '...');

            // Load saved theme
            this._load();

            // Watch system theme
            this._watchSystemTheme();

            // Watch for reduced motion
            this._watchReducedMotion();

            // Watch for high contrast
            this._watchHighContrast();

            // Apply accessibility settings
            this._applyAccessibility();

            // Register events
            this._registerEvents();

            // Setup cross-tab sync
            if (this.config.enableCrossTabSync) {
                this._setupCrossTabSync();
            }

            // Setup auto theme (time-based)
            if (this.config.auto.enabled) {
                this._setupAutoTheme();
            }

            // Find and setup toggle buttons
            this._setupToggles();

            // Apply CSS variables
            this._applyCSSVariables();

            this.state.initialized = true;

            ASLDS.events.emit('theme:ready', {
                current: this.state.current,
                active: this.state.active,
                system: this.state.system,
            });

            ASLDS.logger.info('Theme module initialized successfully.', {
                current: this.state.current,
                active: this.state.active,
            });

            return this;
        },

        /**
         * Apply a theme
         * @param {string} theme - Theme name ('light', 'dark', 'system', 'auto')
         * @param {Object} options - Options
         * @param {boolean} options.preview - If true, applies temporarily
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.save - If false, doesn't save to storage
         * @returns {Object} Result with success status and details
         */
        apply: function (theme, options) {
            options = options || {};

            // Validate theme
            if (!this.isValid(theme)) {
                ASLDS.logger.warn('Invalid theme: ' + theme);
                return { success: false, error: 'Invalid theme: ' + theme };
            }

            // Resolve the actual theme
            const resolved = this._resolveTheme(theme);

            // Don't apply if already on this theme (unless forced)
            if (!options.force && this.state.active === resolved && this.state.current === theme) {
                ASLDS.logger.debug('Theme already applied: ' + theme);
                return { success: true, alreadyApplied: true };
            }

            // Handle preview mode
            if (options.preview) {
                this.state.isPreviewing = true;
                this.state.previewTheme = theme;
                ASLDS.events.emit('theme:preview', {
                    theme: theme,
                    resolved: resolved,
                });
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Store previous
            this.state.previous = this.state.current;

            // Update state
            this.state.current = theme;
            this.state.active = resolved;

            // Apply to DOM
            this.elements.root.setAttribute(this.config.attribute, resolved);

            // Apply CSS variables
            this._applyCSSVariables();

            // Update meta theme color
            this._updateMetaThemeColor(resolved);

            // Save to storage (unless preview or no-save)
            if (!options.preview && options.save !== false) {
                this._save(theme);
            }

            // Add to history
            if (this.config.enableHistory && !options.preview && !options.noHistory) {
                this._addHistory(theme);
            }

            // Update toggles
            this._updateToggles(theme);

            // Track analytics
            if (this.config.enableAnalytics && !options.preview) {
                this._track(theme, resolved);
            }

            // End transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._endTransition();
            }

            // Clear preview state
            if (options.preview) {
                // Keep preview state until committed or discarded
            } else {
                this.state.isPreviewing = false;
                this.state.previewTheme = null;
            }

            // Emit event
            ASLDS.events.emit('theme:applied', {
                theme: theme,
                resolved: resolved,
                previous: this.state.previous,
                preview: options.preview || false,
            });

            ASLDS.logger.info('Theme applied: ' + theme + ' (resolved: ' + resolved + ')');

            return {
                success: true,
                theme: theme,
                resolved: resolved,
                previous: this.state.previous,
                preview: options.preview || false,
            };
        },

        /**
         * Toggle between themes
         * @param {string} mode - 'cycle' (default), 'dark', 'light', 'next', 'prev'
         * @returns {Object} Result
         */
        toggle: function (mode) {
            mode = mode || 'cycle';

            let nextTheme;

            switch (mode) {
                case 'dark':
                    nextTheme = 'dark';
                    break;
                case 'light':
                    nextTheme = 'light';
                    break;
                case 'cycle':
                    const currentIndex = this.themes.indexOf(this.state.current);
                    nextTheme = this.themes[(currentIndex + 1) % this.themes.length];
                    break;
                case 'next':
                    // Go to next available theme (skip system/auto if not enabled)
                    const available = this.getAvailableThemes();
                    const idx = available.indexOf(this.state.current);
                    nextTheme = available[(idx + 1) % available.length] || available[0];
                    break;
                case 'prev':
                    const availablePrev = this.getAvailableThemes();
                    const idxPrev = availablePrev.indexOf(this.state.current);
                    nextTheme = availablePrev[(idxPrev - 1 + availablePrev.length) % availablePrev.length] || availablePrev[0];
                    break;
                default:
                    // If mode is a theme name, apply it directly
                    if (this.isValid(mode)) {
                        nextTheme = mode;
                    } else {
                        ASLDS.logger.warn('Invalid toggle mode: ' + mode);
                        return { success: false, error: 'Invalid toggle mode' };
                    }
            }

            return this.apply(nextTheme);
        },

        /**
         * Preview a theme (temporary)
         * @param {string} theme - Theme to preview
         * @returns {Object} Result
         */
        preview: function (theme) {
            if (!this.isValid(theme)) {
                ASLDS.logger.warn('Invalid preview theme: ' + theme);
                return { success: false, error: 'Invalid theme' };
            }

            return this.apply(theme, { preview: true });
        },

        /**
         * Commit a preview (make it permanent)
         * @returns {Object} Result
         */
        commitPreview: function () {
            if (!this.state.isPreviewing) {
                ASLDS.logger.warn('No preview to commit.');
                return { success: false, error: 'No preview active' };
            }

            const theme = this.state.previewTheme;
            this.state.isPreviewing = false;
            this.state.previewTheme = null;

            // Re-apply without preview mode
            return this.apply(theme, { force: true });
        },

        /**
         * Discard a preview (revert to previous)
         * @returns {Object} Result
         */
        discardPreview: function () {
            if (!this.state.isPreviewing) {
                ASLDS.logger.warn('No preview to discard.');
                return { success: false, error: 'No preview active' };
            }

            const previous = this.state.previous || this.config.defaultTheme;
            this.state.isPreviewing = false;
            this.state.previewTheme = null;

            return this.apply(previous, { force: true });
        },

        /**
         * Suggest a theme based on time of day or system
         * @returns {string} Suggested theme
         */
        suggest: function () {
            if (!this.config.enableSuggestions) {
                return this.state.current;
            }

            // If system theme is available and followSystem is true
            if (this.config.followSystem) {
                return 'system';
            }

            // Time-based suggestion
            const hour = new Date().getHours();
            const darkStart = this.config.auto.darkStart || 18;
            const darkEnd = this.config.auto.darkEnd || 6;

            let isDarkTime;
            if (darkStart > darkEnd) {
                // Overnight: e.g., 18:00 - 06:00
                isDarkTime = hour >= darkStart || hour < darkEnd;
            } else {
                // Same day: e.g., 18:00 - 22:00
                isDarkTime = hour >= darkStart && hour < darkEnd;
            }

            const suggested = isDarkTime ? 'dark' : 'light';

            ASLDS.events.emit('theme:suggested', {
                suggested: suggested,
                hour: hour,
                darkStart: darkStart,
                darkEnd: darkEnd,
            });

            return suggested;
        },

        /**
         * Schedule a theme change
         * @param {string} theme - Theme to schedule
         * @param {number} delay - Delay in milliseconds
         * @param {Function} callback - Optional callback
         * @returns {Object} Result
         */
        schedule: function (theme, delay, callback) {
            if (!this.config.enableScheduling) {
                ASLDS.logger.warn('Scheduling is disabled.');
                return { success: false, error: 'Scheduling disabled' };
            }

            if (!this.isValid(theme)) {
                ASLDS.logger.warn('Invalid scheduled theme: ' + theme);
                return { success: false, error: 'Invalid theme' };
            }

            // Clear existing timer
            if (this.state.scheduleTimer) {
                clearTimeout(this.state.scheduleTimer);
                this.state.scheduleTimer = null;
            }

            this.state.scheduledTheme = theme;

            this.state.scheduleTimer = setTimeout(function () {
                this.apply(theme);
                this.state.scheduledTheme = null;
                if (callback) callback(theme);
            }.bind(this), delay);

            ASLDS.logger.debug('Theme scheduled: ' + theme + ' in ' + delay + 'ms');

            return {
                success: true,
                theme: theme,
                delay: delay,
                timerId: this.state.scheduleTimer,
            };
        },

        /**
         * Cancel scheduled theme change
         * @returns {Object} Result
         */
        cancelSchedule: function () {
            if (this.state.scheduleTimer) {
                clearTimeout(this.state.scheduleTimer);
                this.state.scheduleTimer = null;
                this.state.scheduledTheme = null;
                ASLDS.logger.debug('Scheduled theme cancelled.');
                return { success: true };
            }
            return { success: false, error: 'No schedule active' };
        },

        /**
         * Undo last theme change
         * @returns {Object} Result
         */
        undo: function () {
            if (!this.config.enableHistory) {
                ASLDS.logger.warn('History is disabled.');
                return { success: false, error: 'History disabled' };
            }

            if (this.state.historyIndex <= 0) {
                ASLDS.logger.warn('No theme to undo.');
                return { success: false, error: 'No history to undo' };
            }

            this.state.historyIndex--;
            const theme = this.state.history[this.state.historyIndex];
            return this.apply(theme, { noHistory: true });
        },

        /**
         * Redo last undone theme change
         * @returns {Object} Result
         */
        redo: function () {
            if (!this.config.enableHistory) {
                ASLDS.logger.warn('History is disabled.');
                return { success: false, error: 'History disabled' };
            }

            if (this.state.historyIndex >= this.state.history.length - 1) {
                ASLDS.logger.warn('No theme to redo.');
                return { success: false, error: 'No history to redo' };
            }

            this.state.historyIndex++;
            const theme = this.state.history[this.state.historyIndex];
            return this.apply(theme, { noHistory: true });
        },

        /**
         * Reset theme to default
         * @param {boolean} confirm - Require confirmation
         * @returns {Object} Result
         */
        reset: function (confirm) {
            if (confirm && !window.confirm('Reset theme to default?')) {
                return { success: false, cancelled: true };
            }

            const defaultTheme = this.config.defaultTheme;
            this.clearHistory();
            return this.apply(defaultTheme, { force: true });
        },

        /**
         * Clear theme history
         * @returns {Object} Result
         */
        clearHistory: function () {
            this.state.history = [];
            this.state.historyIndex = -1;
            ASLDS.logger.debug('Theme history cleared.');
            return { success: true };
        },

        /**
         * Get theme history
         * @returns {Array} History array
         */
        getHistory: function () {
            return this.state.history.slice();
        },

        /**
         * Get available themes (excluding system/auto if not applicable)
         * @returns {Array} Available theme names
         */
        getAvailableThemes: function () {
            const available = ['light', 'dark'];

            if (this.config.followSystem) {
                available.push('system');
            }

            if (this.config.auto.enabled) {
                available.push('auto');
            }

            // Add custom themes
            Object.keys(this.config.customThemes).forEach(function (key) {
                if (!available.includes(key)) {
                    available.push(key);
                }
            });

            return available;
        },

        /**
         * Check if a theme is valid
         * @param {string} theme - Theme name
         * @returns {boolean} True if valid
         */
        isValid: function (theme) {
            if (this.themes.includes(theme)) return true;
            if (this.config.customThemes[theme]) return true;
            return false;
        },

        /**
         * Get current theme
         * @returns {string} Current theme name
         */
        getCurrent: function () {
            return this.state.current;
        },

        /**
         * Get active (resolved) theme
         * @returns {string} Active theme ('light' or 'dark')
         */
        getActive: function () {
            return this.state.active;
        },

        /**
         * Get system theme
         * @returns {string} System theme ('light' or 'dark')
         */
        getSystem: function () {
            return this.state.system;
        },

        /**
         * Check if current theme is dark
         * @returns {boolean} True if dark
         */
        isDark: function () {
            return this.state.active === 'dark';
        },

        /**
         * Check if current theme is light
         * @returns {boolean} True if light
         */
        isLight: function () {
            return this.state.active === 'light';
        },

        /**
         * Check if using system theme
         * @returns {boolean} True if system
         */
        isSystem: function () {
            return this.state.current === 'system';
        },

        /**
         * Check if using auto theme
         * @returns {boolean} True if auto
         */
        isAuto: function () {
            return this.state.current === 'auto';
        },

        /**
         * Get theme display name
         * @param {string} theme - Theme name
         * @returns {string} Display name
         */
        getDisplayName: function (theme) {
            return this.displayNames[theme] || theme;
        },

        /**
         * Get theme icon
         * @param {string} theme - Theme name
         * @returns {string} Icon class or emoji
         */
        getIcon: function (theme) {
            if (this.icons[theme]) {
                return this.icons[theme];
            }
            return this.emojis[theme] || '🎨';
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
                current: this.state.current,
                active: this.state.active,
                system: this.state.system,
                previous: this.state.previous,
                isPreviewing: this.state.isPreviewing,
                availableThemes: this.getAvailableThemes(),
                history: this.state.history.length,
                isDark: this.isDark(),
                isLight: this.isLight(),
                isSystem: this.isSystem(),
                isAuto: this.isAuto(),
            };
        },

        /**
         * Get module status
         * @returns {Object} Status object
         */
        status: function () {
            return {
                initialized: this.state.initialized,
                current: this.state.current,
                active: this.state.active,
                config: Object.assign({}, this.config),
                toggles: this.elements.toggles.length,
            };
        },

        /**
         * Get module configuration
         * @returns {Object} Configuration
         */
        getConfig: function () {
            return Object.assign({}, this.config);
        },

        /**
         * Update configuration
         * @param {Object} options - Configuration options
         * @returns {Object} Result
         */
        setConfig: function (options) {
            Object.assign(this.config, options);
            ASLDS.logger.debug('Theme config updated.', options);
            return { success: true };
        },

        /**
         * Refresh the theme (re-apply)
         */
        refresh: function () {
            return this.apply(this.state.current, { force: true });
        },

        /**
         * Destroy the theme module
         */
        destroy: function () {
            this.state.initialized = false;

            // Clear timers
            if (this.state.scheduleTimer) {
                clearTimeout(this.state.scheduleTimer);
                this.state.scheduleTimer = null;
            }
            if (this.state.autoTimer) {
                clearInterval(this.state.autoTimer);
                this.state.autoTimer = null;
            }

            // Clear history
            this.state.history = [];
            this.state.historyIndex = -1;

            // Remove event listeners
            this._unregisterEvents();

            ASLDS.logger.info('Theme module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Resolve a theme to actual light/dark
         */
        _resolveTheme: function (theme) {
            if (theme === 'light') return 'light';
            if (theme === 'dark') return 'dark';

            if (theme === 'system') {
                return this.state.system || this.getSystemTheme();
            }

            if (theme === 'auto') {
                const suggested = this.suggest();
                return suggested === 'dark' ? 'dark' : 'light';
            }

            // Custom theme - fallback to light
            return 'light';
        },

        /**
         * Get system theme
         */
        getSystemTheme: function () {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        },

        /**
         * Load theme from storage
         */
        _load: function () {
            const saved = ASLDS.storage.get(this.config.storageKey);

            if (saved && this.isValid(saved)) {
                this.state.current = saved;
                ASLDS.logger.debug('Loaded theme from storage: ' + saved);
            } else {
                this.state.current = this.config.defaultTheme;
                ASLDS.logger.debug('Using default theme: ' + this.state.current);
            }

            // Resolve and apply
            const resolved = this._resolveTheme(this.state.current);
            this.state.active = resolved;
            this.state.system = this.getSystemTheme();

            // Apply to DOM
            this.elements.root.setAttribute(this.config.attribute, resolved);

            // Apply CSS variables
            this._applyCSSVariables();

            // Update meta theme color
            this._updateMetaThemeColor(resolved);

            // Add to history
            if (this.config.enableHistory) {
                this.state.history = [this.state.current];
                this.state.historyIndex = 0;
            }
        },

        /**
         * Save theme to storage
         */
        _save: function (theme) {
            ASLDS.storage.set(this.config.storageKey, theme);
            ASLDS.logger.debug('Theme saved: ' + theme);
        },

        /**
         * Add to history
         */
        _addHistory: function (theme) {
            // If we're not at the end, truncate
            if (this.state.historyIndex < this.state.history.length - 1) {
                this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
            }

            // Don't add duplicate consecutive entries
            if (this.state.history[this.state.history.length - 1] !== theme) {
                this.state.history.push(theme);
                this.state.historyIndex = this.state.history.length - 1;
            }

            // Limit history size
            if (this.state.history.length > this.config.maxHistory) {
                this.state.history.shift();
                this.state.historyIndex--;
            }

            ASLDS.logger.debug('History updated. Length: ' + this.state.history.length);
        },

        /**
         * Watch system theme changes
         */
        _watchSystemTheme: function () {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handler = function (event) {
                this.state.system = event.matches ? 'dark' : 'light';

                if (this.state.current === 'system' || this.config.followSystem) {
                    this.apply('system', { force: true });
                }

                ASLDS.logger.debug('System theme changed: ' + this.state.system);
            }.bind(this);

            try {
                mediaQuery.addEventListener('change', handler);
                // Store reference for cleanup
                this._systemThemeHandler = handler;
            } catch (e) {
                // Fallback for older browsers
                mediaQuery.addListener(handler);
                this._systemThemeHandler = handler;
            }

            // Initial system theme
            this.state.system = this.getSystemTheme();
        },

        /**
         * Watch reduced motion preference
         */
        _watchReducedMotion: function () {
            if (!this.config.respectReducedMotion) return;

            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

            const handler = function (event) {
                const reduced = event.matches;
                this.elements.root.setAttribute('data-reduced-motion', reduced ? 'reduce' : 'normal');
                ASLDS.logger.debug('Reduced motion: ' + (reduced ? 'enabled' : 'disabled'));
            }.bind(this);

            try {
                mediaQuery.addEventListener('change', handler);
                this._reducedMotionHandler = handler;
            } catch (e) {
                mediaQuery.addListener(handler);
                this._reducedMotionHandler = handler;
            }

            // Initial state
            const initialReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.elements.root.setAttribute('data-reduced-motion', initialReduced ? 'reduce' : 'normal');
        },

        /**
         * Watch high contrast preference
         */
        _watchHighContrast: function () {
            if (!this.config.respectHighContrast) return;

            const mediaQuery = window.matchMedia('(prefers-contrast: high)');

            const handler = function (event) {
                const highContrast = event.matches;
                this.elements.root.setAttribute('data-high-contrast', highContrast ? 'high' : 'normal');
                ASLDS.logger.debug('High contrast: ' + (highContrast ? 'enabled' : 'disabled'));
            }.bind(this);

            try {
                mediaQuery.addEventListener('change', handler);
                this._highContrastHandler = handler;
            } catch (e) {
                mediaQuery.addListener(handler);
                this._highContrastHandler = handler;
            }

            // Initial state
            const initialContrast = window.matchMedia('(prefers-contrast: high)').matches;
            this.elements.root.setAttribute('data-high-contrast', initialContrast ? 'high' : 'normal');
        },

        /**
         * Apply accessibility attributes
         */
        _applyAccessibility: function () {
            // Reduced motion
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.elements.root.setAttribute('data-reduced-motion', reducedMotion ? 'reduce' : 'normal');

            // High contrast
            const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
            this.elements.root.setAttribute('data-high-contrast', highContrast ? 'high' : 'normal');

            // ARIA live region for theme announcements
            let liveRegion = document.getElementById('aslds-theme-announcer');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'aslds-theme-announcer';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';
                document.body.appendChild(liveRegion);
            }
            this.elements.liveRegion = liveRegion;

            ASLDS.events.emit('theme:accessibility', {
                reducedMotion: reducedMotion,
                highContrast: highContrast,
            });
        },

        /**
         * Apply CSS custom properties for the current theme
         */
        _applyCSSVariables: function () {
            const active = this.state.active;
            const variables = this.cssVariables[active];

            if (!variables) return;

            const root = this.elements.root;
            Object.keys(variables).forEach(function (key) {
                root.style.setProperty(key, variables[key]);
            });
        },

        /**
         * Update meta theme color
         */
        _updateMetaThemeColor: function (theme) {
            let meta = this.elements.metaThemeColor;
            if (!meta) {
                meta = document.querySelector('meta[name="theme-color"]');
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.name = 'theme-color';
                    document.head.appendChild(meta);
                }
                this.elements.metaThemeColor = meta;
            }

            const color = theme === 'dark' ? '#000000' : '#ffffff';
            meta.content = color;
        },

        /**
         * Setup theme toggle buttons
         */
        _setupToggles: function () {
            const toggles = document.querySelectorAll(this.config.toggleSelector);
            this.elements.toggles = [];

            toggles.forEach(function (button) {
                // Skip if already initialized
                if (button.dataset.themeInitialized) return;

                button.dataset.themeInitialized = 'true';

                // Store reference
                this.elements.toggles.push(button);

                // Set initial state
                this._updateToggle(button, this.state.current);

                // Click handler
                button.addEventListener('click', function (e) {
                    e.preventDefault();

                    // If holding modifier keys, use different mode
                    if (e.shiftKey) {
                        this.toggle('prev');
                    } else if (e.ctrlKey || e.metaKey) {
                        this.toggle('system');
                    } else {
                        this.toggle('cycle');
                    }
                }.bind(this));

                // Keyboard support
                button.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle('cycle');
                    }
                }.bind(this));
            }.bind(this));

            ASLDS.logger.debug('Found ' + this.elements.toggles.length + ' theme toggle(s)');
        },

        /**
         * Update a toggle button
         */
        _updateToggle: function (button, theme) {
            const displayName = this.getDisplayName(theme);
            const icon = this.getIcon(theme);

            // Update text
            button.textContent = '';

            // Add icon
            const iconEl = document.createElement('i');
            iconEl.className = 'fa ' + icon;
            button.appendChild(iconEl);

            // Add text
            const textEl = document.createTextNode(' ' + displayName);
            button.appendChild(textEl);

            // Update ARIA
            button.setAttribute('aria-label', 'Switch to ' + displayName + ' theme');
            button.setAttribute('aria-pressed', this.state.active === 'light' ? 'false' : 'true');

            // Update classes
            button.classList.remove(this.config.toggleActiveClass, this.config.toggleInactiveClass);
            if (theme === this.state.current) {
                button.classList.add(this.config.toggleActiveClass);
            } else {
                button.classList.add(this.config.toggleInactiveClass);
            }

            // Update data attribute
            button.dataset.theme = theme;
        },

        /**
         * Update all toggle buttons
         */
        _updateToggles: function (theme) {
            this.elements.toggles.forEach(function (button) {
                this._updateToggle(button, theme);
            }.bind(this));

            // Update live region
            if (this.elements.liveRegion) {
                const displayName = this.getDisplayName(theme);
                this.elements.liveRegion.textContent = 'Theme changed to ' + displayName;
            }
        },

        /**
         * Start theme transition
         */
        _startTransition: function () {
            if (this.state.isTransitioning) return;

            // Check if reduced motion is enabled
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion && this.config.respectReducedMotion) {
                return;
            }

            this.state.isTransitioning = true;
            this.elements.root.classList.add(this.config.transitionClass);

            ASLDS.events.emit('theme:transition-start', {
                duration: this.config.transitionDuration,
            });
        },

        /**
         * End theme transition
         */
        _endTransition: function () {
            if (!this.state.isTransitioning) return;

            const duration = this.config.transitionDuration;

            setTimeout(function () {
                this.elements.root.classList.remove(this.config.transitionClass);
                this.state.isTransitioning = false;

                ASLDS.events.emit('theme:transition-end');
            }.bind(this), duration + 50);
        },

        /**
         * Setup cross-tab synchronization
         */
        _setupCrossTabSync: function () {
            window.addEventListener('storage', function (event) {
                if (event.key === this.config.storagePrefix + this.config.storageKey) {
                    const newTheme = event.newValue;
                    if (newTheme && this.isValid(newTheme)) {
                        ASLDS.logger.debug('Cross-tab theme sync: ' + newTheme);
                        this.apply(newTheme, { save: false, noHistory: true });
                    }
                }
            }.bind(this));
        },

        /**
         * Setup auto theme (time-based)
         */
        _setupAutoTheme: function () {
            // Check every 5 minutes
            this.state.autoTimer = setInterval(function () {
                if (this.state.current === 'auto') {
                    const suggested = this.suggest();
                    const resolved = this._resolveTheme('auto');
                    if (resolved !== this.state.active) {
                        this.apply('auto', { force: true });
                    }
                }
            }.bind(this), 5 * 60 * 1000);

            ASLDS.logger.debug('Auto theme scheduler started.');
        },

        /**
         * Track theme analytics
         */
        _track: function (theme, resolved) {
            // Log to console in development
            if (this.config.debug) {
                ASLDS.logger.debug('Theme analytics:', {
                    theme: theme,
                    resolved: resolved,
                    timestamp: new Date().toISOString(),
                    previous: this.state.previous,
                    historyLength: this.state.history.length,
                });
            }

            // Emit analytics event (can be captured by external analytics)
            ASLDS.events.emit('theme:analytics', {
                theme: theme,
                resolved: resolved,
                timestamp: Date.now(),
                previous: this.state.previous,
            });
        },

        /**
         * Register theme events
         */
        _registerEvents: function () {
            // Runtime events
            ASLDS.events.on('runtime:refresh', function () {
                this.refresh();
            }.bind(this));

            ASLDS.events.on('runtime:destroy', function () {
                this.destroy();
            }.bind(this));

            // Custom theme events
            ASLDS.events.on('theme:apply', function (data) {
                if (data && data.theme) {
                    this.apply(data.theme, data.options || {});
                }
            }.bind(this));

            ASLDS.events.on('theme:toggle', function (data) {
                this.toggle(data && data.mode);
            }.bind(this));

            ASLDS.logger.debug('Theme events registered.');
        },

        /**
         * Unregister theme events
         */
        _unregisterEvents: function () {
            ASLDS.events.off('runtime:refresh');
            ASLDS.events.off('runtime:destroy');
            ASLDS.events.off('theme:apply');
            ASLDS.events.off('theme:toggle');

            // Remove event listeners from toggles
            this.elements.toggles.forEach(function (button) {
                // Remove listeners (simplified - would need to store references)
            });

            ASLDS.logger.debug('Theme events unregistered.');
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Theme.config);
    Object.freeze(Theme.themes);
    Object.freeze(Theme.displayNames);
    Object.freeze(Theme.icons);
    Object.freeze(Theme.emojis);
    Object.freeze(Theme.cssVariables);
    Object.freeze(Theme.elements);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Theme.name, Theme, Theme.priority, Theme.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        Theme.init();
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSTheme) {
        window.ASLDSTheme = Theme;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : theme.js
     * Module      : ASL Design System (ASLDS) Theme
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Toast
Author: A Square L Innovate
Created: 2026

Description:
Toast notification system for user feedback, alerts,
and system messages. Supports multiple types, stacking,
auto-dismiss, and manual dismissal.

Dependencies:
- Runtime: ASLDS (app.js)

Usage:
    ASLDS.Toast.show({
        type: 'success',
        title: 'Success!',
        message: 'Your changes have been saved.',
        duration: 3000,
        position: 'top-right'
    });

    ASLDS.Toast.configure({
        duration: 4000,
        position: 'bottom-right',
        maxToasts: 5
    });

    ASLDS.Toast.clear();
    ASLDS.Toast.dismiss(toastElement);
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Toast';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        duration: 3500, // milliseconds
        position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        maxToasts: 5,
        showProgress: true,
        showIcon: true,
        pauseOnHover: true,
        closeButton: true,
    };

    // ======================================================
    // TOAST TYPES
    // ======================================================

    const TYPES = {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
    };

    const TYPE_ICONS = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        config: {},
        container: null,
        toasts: [],
        _timerIds: [],
    };

    // ======================================================
    // UTILITY HELPERS
    // ======================================================

    function mergeConfig(userConfig) {
        const config = Object.assign({}, defaults);
        if (userConfig && typeof userConfig === 'object') {
            for (let key in userConfig) {
                if (userConfig.hasOwnProperty(key)) {
                    config[key] = userConfig[key];
                }
            }
        }
        return config;
    }

    function generateId() {
        return 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    }

    function getPositionClass(position) {
        return 'toast-container--' + position;
    }

    function getTypeClass(type) {
        return 'toast--' + type;
    }

    function getTypeIcon(type) {
        return TYPE_ICONS[type] || 'ℹ';
    }

    // ======================================================
    // CONTAINER MANAGEMENT
    // ======================================================

    function getOrCreateContainer(position) {
        const positionClass = getPositionClass(position);
        let container = document.querySelector('.toast-container.' + positionClass);

        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container ' + positionClass;
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }

        return container;
    }

    // ======================================================
    // TOAST CREATION
    // ======================================================

    function createToastElement(options) {
        const {
            type = TYPES.INFO,
            title = '',
            message = '',
            duration = state.config.duration,
            position = state.config.position,
            showProgress = state.config.showProgress,
            showIcon = state.config.showIcon,
            closeButton = state.config.closeButton,
        } = options;

        const toastId = generateId();
        const typeClass = getTypeClass(type);
        const icon = showIcon ? getTypeIcon(type) : '';

        // Main container
        const toast = document.createElement('div');
        toast.className = 'toast ' + typeClass;
        toast.dataset.toastId = toastId;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        // Content wrapper
        const content = document.createElement('div');
        content.className = 'toast-content';

        // Icon
        if (showIcon) {
            const iconEl = document.createElement('span');
            iconEl.className = 'toast-icon';
            iconEl.textContent = icon;
            content.appendChild(iconEl);
        }

        // Body
        const body = document.createElement('div');
        body.className = 'toast-body';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'toast-title';
            titleEl.textContent = title;
            body.appendChild(titleEl);
        }

        if (message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'toast-message';
            messageEl.textContent = message;
            body.appendChild(messageEl);
        }

        content.appendChild(body);
        toast.appendChild(content);

        // Close button
        if (closeButton) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.setAttribute('type', 'button');
            closeBtn.setAttribute('aria-label', 'Dismiss notification');
            closeBtn.innerHTML = '✕';
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dismissToast(toast);
            });
            toast.appendChild(closeBtn);
        }

        // Progress bar
        if (showProgress && duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            progress.style.width = '100%';
            toast.appendChild(progress);

            // Store progress reference for updating
            toast._progress = progress;
        }

        // Store duration for progress animation
        toast._duration = duration;

        // Pause on hover
        if (state.config.pauseOnHover) {
            toast.addEventListener('mouseenter', function () {
                pauseToastTimer(toast);
            });
            toast.addEventListener('mouseleave', function () {
                resumeToastTimer(toast);
            });
        }

        // Store toast data
        toast._toastData = {
            id: toastId,
            type: type,
            title: title,
            message: message,
            duration: duration,
            position: position,
            timerId: null,
            startTime: null,
            remaining: duration,
            isPaused: false,
        };

        return toast;
    }

    // ======================================================
    // TOAST TIMER MANAGEMENT
    // ======================================================

    function startToastTimer(toast) {
        const data = toast._toastData;
        if (!data || data.duration <= 0) return;

        data.startTime = Date.now();
        data.remaining = data.duration;

        function tick() {
            if (data.isPaused) return;

            const elapsed = Date.now() - data.startTime;
            const remaining = Math.max(0, data.duration - elapsed);
            const progress = (remaining / data.duration) * 100;

            // Update progress bar
            if (toast._progress) {
                toast._progress.style.width = progress + '%';
            }

            if (remaining <= 0) {
                dismissToast(toast);
                return;
            }

            // Store remaining for pause/resume
            data.remaining = remaining;

            // Schedule next tick
            data.timerId = requestAnimationFrame(tick);
        }

        data.timerId = requestAnimationFrame(tick);
        state._timerIds.push(data.timerId);
    }

    function pauseToastTimer(toast) {
        const data = toast._toastData;
        if (!data || data.isPaused) return;

        data.isPaused = true;
        if (data.timerId) {
            cancelAnimationFrame(data.timerId);
            data.timerId = null;
        }

        // Update remaining time
        const elapsed = Date.now() - data.startTime;
        data.remaining = Math.max(0, data.duration - elapsed);
    }

    function resumeToastTimer(toast) {
        const data = toast._toastData;
        if (!data || !data.isPaused) return;

        data.isPaused = false;

        // Restart timer with remaining time
        data.duration = data.remaining;
        data.startTime = Date.now();

        function tick() {
            if (data.isPaused) return;

            const elapsed = Date.now() - data.startTime;
            const remaining = Math.max(0, data.duration - elapsed);
            const progress = (remaining / data.duration) * 100;

            if (toast._progress) {
                toast._progress.style.width = progress + '%';
            }

            if (remaining <= 0) {
                dismissToast(toast);
                return;
            }

            data.remaining = remaining;
            data.timerId = requestAnimationFrame(tick);
        }

        data.timerId = requestAnimationFrame(tick);
        state._timerIds.push(data.timerId);
    }

    // ======================================================
    // TOAST DISMISSAL
    // ======================================================

    function dismissToast(toast, immediate) {
        if (!toast || toast._dismissed) return;

        toast._dismissed = true;

        // Cancel timer
        const data = toast._toastData;
        if (data && data.timerId) {
            cancelAnimationFrame(data.timerId);
            data.timerId = null;
        }

        if (immediate) {
            // Remove immediately
            removeToastElement(toast);
        } else {
            // Animate out
            toast.classList.add('toast--exiting');
            setTimeout(function () {
                removeToastElement(toast);
            }, 300);
        }
    }

    function removeToastElement(toast) {
        const container = toast.parentElement;
        if (container) {
            container.removeChild(toast);
        }

        // Remove from state
        const index = state.toasts.indexOf(toast);
        if (index !== -1) {
            state.toasts.splice(index, 1);
        }

        // Emit event
        const event = new CustomEvent('asl:toast:dismiss', {
            detail: {
                toast: toast,
                data: toast._toastData || null,
            }
        });
        document.dispatchEvent(event);

        // If container is empty, remove it
        if (container && container.children.length === 0) {
            if (container.parentElement) {
                container.parentElement.removeChild(container);
            }
        }
    }

    // ======================================================
    // PUBLIC API
    // ======================================================

    const API = {

        /**
         * Show a toast notification.
         * @param {Object} options - Toast options.
         * @param {string} options.type - 'success', 'error', 'warning', 'info'
         * @param {string} options.title - Toast title
         * @param {string} options.message - Toast message
         * @param {number} options.duration - Auto-dismiss time in ms (0 = no auto-dismiss)
         * @param {string} options.position - 'top-right', 'top-left', 'bottom-right', 'bottom-left'
         * @param {boolean} options.showProgress - Show progress bar
         * @param {boolean} options.showIcon - Show icon
         * @param {boolean} options.closeButton - Show close button
         * @returns {HTMLElement} The toast element
         */
        show: function (options) {
            if (!state.initialized) {
                console.warn('[ASLDS Toast] Not initialized. Call init() first.');
                return null;
            }

            const opts = Object.assign({}, state.config, options);
            const position = opts.position || state.config.position;

            // Check max toasts
            if (state.toasts.length >= state.config.maxToasts) {
                // Remove oldest toast (with animation)
                const oldest = state.toasts[0];
                if (oldest) {
                    dismissToast(oldest, false);
                }
            }

            // Get or create container
            const container = getOrCreateContainer(position);

            // Create toast element
            const toast = createToastElement(opts);
            container.appendChild(toast);
            state.toasts.push(toast);

            // Start auto-dismiss timer
            if (opts.duration > 0) {
                startToastTimer(toast);
            }

            // Emit event
            const event = new CustomEvent('asl:toast:show', {
                detail: {
                    toast: toast,
                    data: toast._toastData || null,
                    options: opts,
                }
            });
            document.dispatchEvent(event);

            return toast;
        },

        /**
         * Dismiss a specific toast.
         * @param {HTMLElement} toast - The toast element to dismiss.
         * @param {boolean} immediate - Dismiss without animation.
         */
        dismiss: function (toast, immediate) {
            if (!state.initialized) {
                console.warn('[ASLDS Toast] Not initialized.');
                return;
            }
            if (!toast || toast._dismissed) return;
            dismissToast(toast, immediate);
        },

        /**
         * Clear all toasts.
         * @param {boolean} immediate - Clear without animations.
         */
        clear: function (immediate) {
            if (!state.initialized) {
                console.warn('[ASLDS Toast] Not initialized.');
                return;
            }

            const toasts = state.toasts.slice();
            toasts.forEach(function (toast) {
                dismissToast(toast, immediate);
            });

            const event = new CustomEvent('asl:toast:clear');
            document.dispatchEvent(event);
        },

        /**
         * Configure the toast system.
         * @param {Object} config - Configuration options.
         */
        configure: function (config) {
            if (!state.initialized) {
                console.warn('[ASLDS Toast] Not initialized. Call init() first.');
                return;
            }
            Object.assign(state.config, config);
        },

        /**
         * Get the current configuration.
         * @returns {Object}
         */
        getConfig: function () {
            return Object.assign({}, state.config);
        },

        /**
         * Get all active toasts.
         * @returns {HTMLElement[]}
         */
        getToasts: function () {
            return state.toasts.slice();
        },

        /**
         * Get the toast container for a position.
         * @param {string} position - 'top-right', 'top-left', etc.
         * @returns {HTMLElement|null}
         */
        getContainer: function (position) {
            const pos = position || state.config.position;
            const positionClass = getPositionClass(pos);
            return document.querySelector('.toast-container.' + positionClass);
        },

        /**
         * Get module information.
         * @returns {Object}
         */
        info: function () {
            return {
                module: MODULE_NAME,
                version: VERSION,
                initialized: state.initialized,
                config: state.config,
                toastCount: state.toasts.length,
            };
        },

        /**
         * Initialize the toast module.
         * @param {Object} userConfig - Configuration options.
         */
        init: function (userConfig) {
            if (state.initialized) {
                console.warn('[ASLDS Toast] Already initialized.');
                return this;
            }

            state.config = mergeConfig(userConfig);
            state.initialized = true;

            // Create default container
            getOrCreateContainer(state.config.position);

            // Listen for runtime destroy
            ASLDS.events.on('runtime:destroy', function () {
                API.destroy();
            });

            const event = new CustomEvent('asl:toast:init', {
                detail: { config: state.config }
            });
            document.dispatchEvent(event);

            return this;
        },

        /**
         * Destroy the toast module – clear all toasts and clean up.
         */
        destroy: function () {
            if (!state.initialized) return this;

            // Clear all toasts immediately
            API.clear(true);

            // Clear timer IDs
            state._timerIds.forEach(function (id) {
                cancelAnimationFrame(id);
            });
            state._timerIds = [];

            // Remove containers
            document.querySelectorAll('.toast-container').forEach(function (container) {
                if (container.parentElement) {
                    container.parentElement.removeChild(container);
                }
            });

            state.initialized = false;
            state.config = {};
            state.toasts = [];

            const event = new CustomEvent('asl:toast:destroy');
            document.dispatchEvent(event);

            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Toast = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        window.ASLDS.register('Toast', API, 70, []);
    } else {
        console.warn('[ASLDS Toast] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
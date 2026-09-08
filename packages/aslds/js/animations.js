/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Module: Animations
Author: A Square L Innovate
Created: 2026

Description:
Scroll-triggered animation engine for the ASL Design System.
Detects when elements enter the viewport and applies
animation classes automatically.

Features:
- Intersection Observer for scroll-triggered animations
- Supports all CSS animation classes (fade-in, slide-up, etc.)
- Respects prefers-reduced-motion
- Configurable threshold and root margin
- Public API for manual triggering

Dependencies:
- Runtime: ASLDS (app.js)

Usage:
    // Automatic: runtime auto-initializes via ASLDS.register()

    // Manual: 
    ASLDS.Animations.init({
        selector: '[data-animate], .fade-in, .slide-up, .scale-in',
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
        once: true,
        animationClass: 'is-visible'
    });

    // Programmatic trigger
    ASLDS.Animations.trigger(element);
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Animations';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        selector: '[data-animate], .fade-in, .slide-up, .slide-down, .slide-left, .slide-right, .scale-in, .stagger > *',
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
        once: true,
        animationClass: 'is-visible',
        disableOnReducedMotion: true,
        delayStagger: 150, // ms between staggered items
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        config: {},
        observer: null,
        triggeredElements: new Set(),
        _idCounter: 0,
        reducedMotion: false,
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

    function generateId(prefix) {
        state._idCounter += 1;
        return 'asl-' + prefix + '-' + state._idCounter;
    }

    function getElementId(element) {
        if (!element.id) {
            element.id = generateId('anim');
        }
        return element.id;
    }

    function hasReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // ======================================================
    // ANIMATION TRIGGERING
    // ======================================================

    function triggerElement(element) {
        if (!element) return;

        // Skip if already triggered (once mode)
        if (state.config.once && state.triggeredElements.has(element)) {
            return;
        }

        // Skip if reduced motion is enabled
        if (state.config.disableOnReducedMotion && state.reducedMotion) {
            return;
        }

        // Find the actual animation class (the element should have one)
        const animationClasses = [
            'fade-in', 'fade-out',
            'slide-up', 'slide-down', 'slide-left', 'slide-right',
            'scale-in', 'float', 'pulse', 'spin', 'shake', 'bounce', 'glow',
            'page-enter'
        ];

        let hasAnimationClass = false;
        animationClasses.forEach(function (cls) {
            if (element.classList.contains(cls)) {
                hasAnimationClass = true;
            }
        });

        // If element has no animation class, skip
        if (!hasAnimationClass) {
            return;
        }

        // Add visibility class to trigger the animation
        element.classList.add(state.config.animationClass);

        // Handle stagger children
        if (element.classList.contains('stagger')) {
            const children = element.children;
            Array.from(children).forEach(function (child, index) {
                setTimeout(function () {
                    child.classList.add(state.config.animationClass);
                }, state.config.delayStagger * (index + 1));
            });
        }

        // Mark as triggered
        if (state.config.once) {
            state.triggeredElements.add(element);
        }

        // Emit event
        const event = new CustomEvent('asl:animations:triggered', {
            detail: {
                element: element,
                id: getElementId(element),
            }
        });
        document.dispatchEvent(event);
    }

    // ======================================================
    // INTERSECTION OBSERVER
    // ======================================================

    function setupObserver() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }

        const elements = document.querySelectorAll(state.config.selector);
        if (elements.length === 0) {
            // No elements to observe
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    triggerElement(target);
                }
            });
        }, {
            threshold: state.config.threshold,
            rootMargin: state.config.rootMargin,
        });

        elements.forEach(function (element) {
            observer.observe(element);
        });

        state.observer = observer;

        // Also check for elements already in view
        elements.forEach(function (element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            if (isVisible) {
                // Trigger immediately if already visible
                setTimeout(function () {
                    triggerElement(element);
                }, 50);
            }
        });
    }

    // ======================================================
    // WATCH FOR NEW ELEMENTS (MutationObserver)
    // ======================================================

    function setupMutationObserver() {
        if (!window.MutationObserver) return;

        const mutObserver = new MutationObserver(function (mutations) {
            let shouldRefresh = false;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node;
                            // Check if the added element or its children match the selector
                            if (el.matches && el.matches(state.config.selector)) {
                                shouldRefresh = true;
                            } else if (el.querySelectorAll) {
                                const found = el.querySelectorAll(state.config.selector);
                                if (found.length > 0) {
                                    shouldRefresh = true;
                                }
                            }
                        }
                    });
                }
            });
            if (shouldRefresh) {
                // Re-run observer setup to include new elements
                setupObserver();
            }
        });

        mutObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Store for cleanup
        state._mutObserver = mutObserver;
    }

    // ======================================================
    // REDUCED MOTION HANDLING
    // ======================================================

    function setupReducedMotionListener() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        state.reducedMotion = mediaQuery.matches;

        const handler = function (event) {
            state.reducedMotion = event.matches;
            if (state.reducedMotion) {
                // Remove all animation classes when reduced motion is enabled
                document.querySelectorAll('.' + state.config.animationClass).forEach(function (el) {
                    el.classList.remove(state.config.animationClass);
                });
                state.triggeredElements.clear();
            } else {
                // Re-trigger visible elements
                document.querySelectorAll(state.config.selector).forEach(function (el) {
                    const rect = el.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    const isVisible = rect.top < windowHeight && rect.bottom > 0;
                    if (isVisible) {
                        triggerElement(el);
                    }
                });
            }
        };

        mediaQuery.addEventListener('change', handler);
        state._mediaListener = { mediaQuery: mediaQuery, handler: handler };
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[Animations] Already initialized.');
            return this;
        }

        state.config = mergeConfig(userConfig);
        state.reducedMotion = hasReducedMotion();

        // Setup observers
        setupObserver();
        setupMutationObserver();
        setupReducedMotionListener();

        state.initialized = true;

        // Emit event
        const event = new CustomEvent('asl:animations:init', {
            detail: {
                config: state.config,
                observedElements: document.querySelectorAll(state.config.selector).length,
                reducedMotion: state.reducedMotion,
            }
        });
        document.dispatchEvent(event);

        console.log('[Animations] Initialized. Watching for elements matching:', state.config.selector);
        return this;
    }

    function destroy() {
        if (!state.initialized) return this;

        // Disconnect observers
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }
        if (state._mutObserver) {
            state._mutObserver.disconnect();
            state._mutObserver = null;
        }
        if (state._mediaListener) {
            state._mediaListener.mediaQuery.removeEventListener('change', state._mediaListener.handler);
            state._mediaListener = null;
        }

        state.initialized = false;
        state.triggeredElements.clear();

        const event = new CustomEvent('asl:animations:destroy');
        document.dispatchEvent(event);

        return this;
    }

    // ======================================================
    // PUBLIC API
    // ======================================================

    const API = {
        init: init,
        destroy: destroy,

        /**
         * Manually trigger animations on an element
         * @param {HTMLElement} element - The element to animate
         */
        trigger: function (element) {
            if (!state.initialized) {
                console.warn('[Animations] Not initialized.');
                return this;
            }
            if (!element) {
                console.warn('[Animations] No element provided.');
                return this;
            }
            triggerElement(element);
            return this;
        },

        /**
         * Refresh the observer — useful after dynamic content updates
         */
        refresh: function () {
            if (!state.initialized) {
                console.warn('[Animations] Not initialized.');
                return this;
            }
            setupObserver();
            return this;
        },

        /**
         * Check if reduced motion is enabled
         * @returns {boolean}
         */
        isReducedMotion: function () {
            return state.reducedMotion;
        },

        /**
         * Get all observed elements
         * @returns {NodeList}
         */
        getObservedElements: function () {
            if (!state.initialized) return [];
            return document.querySelectorAll(state.config.selector);
        },

        /**
         * Get triggered elements
         * @returns {Set}
         */
        getTriggeredElements: function () {
            return state.triggeredElements;
        },

        /**
         * Get module information
         * @returns {Object}
         */
        info: function () {
            return {
                module: MODULE_NAME,
                version: VERSION,
                initialized: state.initialized,
                observedCount: document.querySelectorAll(state.config.selector).length,
                triggeredCount: state.triggeredElements.size,
                reducedMotion: state.reducedMotion,
                config: state.config,
            };
        },

        /**
         * Update configuration (limited runtime options)
         * @param {Object} newConfig
         */
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[Animations] Not initialized.');
                return this;
            }
            if (newConfig.threshold !== undefined) {
                state.config.threshold = newConfig.threshold;
            }
            if (newConfig.rootMargin !== undefined) {
                state.config.rootMargin = newConfig.rootMargin;
            }
            if (newConfig.once !== undefined) {
                state.config.once = !!newConfig.once;
            }
            if (newConfig.disableOnReducedMotion !== undefined) {
                state.config.disableOnReducedMotion = !!newConfig.disableOnReducedMotion;
            }
            // Refresh observer with new config
            setupObserver();
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Animations = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        // Priority 50 - loads after all components, before playground
        window.ASLDS.register('Animations', API, 50, []);
    } else {
        console.warn('[Animations] Runtime not found. Module registered directly on ASLDS namespace.');
        // Auto-init if runtime not present
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                API.init();
            });
        } else {
            API.init();
        }
    }

})(window, document);
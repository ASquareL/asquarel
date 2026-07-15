/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Animations Module
 * File        : animations.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Animations Module provides a centralized animation engine for the
 * ASL Design System. It delivers a unified animation experience with
 * support for:
 *   • Fade animations (in, out, up, down, left, right)
 *   • Slide animations (up, down, left, right)
 *   • Scale animations (in, out, pulse)
 *   • Zoom animations (in, out)
 *   • Rotation animations (clockwise, counter-clockwise)
 *   • Bounce effects
 *   • Ripple effects
 *   • Hover animations
 *   • Focus animations
 *   • Scroll-triggered animations (reveal-on-scroll)
 *   • Staggered animations for lists
 *   • Page transition animations
 *   • Component entrance and exit animations
 *   • Loading animations (spinner, pulse, shimmer)
 *   • Reduced-motion support (prefers-reduced-motion)
 *   • Animation queue management
 *   • Animation cancellation
 *   • Animation lifecycle callbacks
 *   • Intersection Observer integration
 *   • Event delegation
 *   • Performance optimizations (requestAnimationFrame)
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
        console.error('[ASLDS] Runtime not found. Animations module cannot initialize.');
        return;
    }

    // ========================================================================
    // Animations Module
    // ========================================================================

    const Animations = {
        /**
         * Module Information
         */
        name: 'Animations',
        version: '2.0.0',
        priority: 5,
        dependencies: [],

        /**
         * Animation Configuration
         */
        config: {
            // Default animation settings
            defaultDuration: 400,
            defaultEasing: 'ease',
            defaultDelay: 0,
            defaultFillMode: 'forwards',

            // Scroll animation settings
            scrollThreshold: 0.15,
            scrollRootMargin: '0px 0px -50px 0px',
            scrollOnce: true,

            // Stagger settings
            staggerDelay: 100,
            staggerMaxItems: 20,

            // Ripple settings
            rippleDuration: 600,
            rippleColor: 'rgba(255, 255, 255, 0.3)',

            // Performance
            useRAF: true,
            throttleScroll: 50,

            // Accessibility
            respectReducedMotion: true,

            // Selectors
            animateSelector: '[data-animate]',
            scrollSelector: '[data-scroll]',
            staggerSelector: '[data-stagger]',
            rippleSelector: '[data-ripple]',
            hoverSelector: '[data-hover]',
            focusSelector: '[data-focus]',

            // Active class
            activeClass: 'animated',
            visibleClass: 'visible',
            hiddenClass: 'hidden',

            // Debug
            debug: false,
        },

        /**
         * Animation Types
         */
        types: {
            fade: 'fade',
            fadeUp: 'fade-up',
            fadeDown: 'fade-down',
            fadeLeft: 'fade-left',
            fadeRight: 'fade-right',
            slideUp: 'slide-up',
            slideDown: 'slide-down',
            slideLeft: 'slide-left',
            slideRight: 'slide-right',
            scale: 'scale',
            scaleIn: 'scale-in',
            scaleOut: 'scale-out',
            pulse: 'pulse',
            zoomIn: 'zoom-in',
            zoomOut: 'zoom-out',
            rotate: 'rotate',
            rotateCW: 'rotate-cw',
            rotateCCW: 'rotate-ccw',
            bounce: 'bounce',
            bounceIn: 'bounce-in',
            bounceOut: 'bounce-out',
            shimmer: 'shimmer',
            spinner: 'spinner',
            pop: 'pop',
            flip: 'flip',
            flipX: 'flip-x',
            flipY: 'flip-y',
        },

        /**
         * Easing Functions
         */
        easings: {
            linear: 'linear',
            ease: 'ease',
            easeIn: 'ease-in',
            easeOut: 'ease-out',
            easeInOut: 'ease-in-out',
            easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
            easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
            easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            isAnimating: false,
            queue: [],
            running: [],
            observers: [],
            reducedMotion: false,
            scrollTimer: null,
            rafId: null,
            frameCallbacks: [],
            animationIdCounter: 0,
        },

        /**
         * Cached Elements
         */
        elements: {
            animated: [],
            root: document.documentElement,
            body: document.body,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            scroll: null,
            resize: null,
            click: null,
            mouseenter: null,
            mouseleave: null,
            focus: null,
            blur: null,
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the animations module
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Animations module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Animations module v' + this.version + '...');

            // Check for reduced motion
            this._checkReducedMotion();

            // Setup scroll animations
            this._setupScrollAnimations();

            // Setup hover animations
            this._setupHoverAnimations();

            // Setup focus animations
            this._setupFocusAnimations();

            // Setup ripple effects
            this._setupRippleEffects();

            // Setup stagger animations
            this._setupStaggerAnimations();

            // Setup page transition animations
            this._setupPageTransitions();

            // Setup global event listeners
            this._setupGlobalEvents();

            // Process existing animated elements
            this._processAnimatedElements();

            this.state.initialized = true;

            ASLDS.logger.info('Animations module initialized successfully.', {
                reducedMotion: this.state.reducedMotion,
                animatedElements: this.elements.animated.length,
            });

            return this;
        },

        /**
         * Animate an element
         * @param {Element|string} element - Element or selector
         * @param {string|Object} animation - Animation type or config object
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        animate: function (element, animation, options) {
            const el = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!el) {
                ASLDS.logger.warn('Element not found for animation.');
                return Promise.reject(new Error('Element not found'));
            }

            // Check reduced motion
            if (this.config.respectReducedMotion && this.state.reducedMotion) {
                return Promise.resolve();
            }

            // Parse animation config
            const config = this._parseAnimationConfig(animation, options);
            if (!config) {
                return Promise.reject(new Error('Invalid animation configuration'));
            }

            // Create animation
            return this._animateElement(el, config);
        },

        /**
         * Fade in an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        fadeIn: function (element, options) {
            return this.animate(element, 'fade', Object.assign({ direction: 'in' }, options));
        },

        /**
         * Fade out an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        fadeOut: function (element, options) {
            return this.animate(element, 'fade', Object.assign({ direction: 'out' }, options));
        },

        /**
         * Slide an element
         * @param {Element|string} element - Element or selector
         * @param {string} direction - 'up', 'down', 'left', 'right'
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        slide: function (element, direction, options) {
            return this.animate(element, 'slide-' + direction, options);
        },

        /**
         * Slide up an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        slideUp: function (element, options) {
            return this.slide(element, 'up', options);
        },

        /**
         * Slide down an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        slideDown: function (element, options) {
            return this.slide(element, 'down', options);
        },

        /**
         * Scale an element
         * @param {Element|string} element - Element or selector
         * @param {string} type - 'in', 'out', 'pulse'
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        scale: function (element, type, options) {
            return this.animate(element, 'scale-' + type, options);
        },

        /**
         * Pulse an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        pulse: function (element, options) {
            return this.animate(element, 'pulse', options);
        },

        /**
         * Bounce an element
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        bounce: function (element, options) {
            return this.animate(element, 'bounce', options);
        },

        /**
         * Pop an element (scale in with bounce)
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        pop: function (element, options) {
            return this.animate(element, 'pop', options);
        },

        /**
         * Shimmer loading animation
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        shimmer: function (element, options) {
            return this.animate(element, 'shimmer', options);
        },

        /**
         * Create a spinner animation
         * @param {Element|string} element - Element or selector
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        spinner: function (element, options) {
            return this.animate(element, 'spinner', options);
        },

        /**
         * Animate a list with staggered timing
         * @param {Element|string} parent - Parent element or selector
         * @param {string} childSelector - Child selector
         * @param {string|Object} animation - Animation type or config
         * @param {Object} options - Animation options
         * @returns {Promise} Animation promise
         */
        stagger: function (parent, childSelector, animation, options) {
            const parentEl = typeof parent === 'string'
                ? ASLDS.dom.find(parent)
                : parent;

            if (!parentEl) {
                ASLDS.logger.warn('Parent element not found for stagger.');
                return Promise.reject(new Error('Parent element not found'));
            }

            const children = ASLDS.dom.findAll(childSelector, parentEl);
            if (children.length === 0) {
                return Promise.resolve();
            }

            // Parse animation config
            const config = this._parseAnimationConfig(animation, options);
            if (!config) {
                return Promise.reject(new Error('Invalid animation configuration'));
            }

            // Check reduced motion
            if (this.config.respectReducedMotion && this.state.reducedMotion) {
                // Show all children immediately
                children.forEach(function (child) {
                    child.style.opacity = '1';
                    child.style.transform = 'none';
                });
                return Promise.resolve();
            }

            // Limit stagger items
            const maxItems = this.config.staggerMaxItems;
            const items = children.slice(0, maxItems);

            // Calculate stagger delay
            const staggerDelay = options && options.staggerDelay !== undefined
                ? options.staggerDelay
                : this.config.staggerDelay;

            const promises = [];

            items.forEach(function (child, index) {
                const delay = config.delay || 0 + (index * staggerDelay);
                const childConfig = Object.assign({}, config, {
                    delay: delay,
                });

                promises.push(this._animateElement(child, childConfig));
            }.bind(this));

            return Promise.all(promises);
        },

        /**
         * Reveal elements on scroll
         * @param {Element|string} element - Element or selector
         * @param {string|Object} animation - Animation type or config
         * @param {Object} options - Animation options
         * @returns {Object} This instance for chaining
         */
        revealOnScroll: function (element, animation, options) {
            const el = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!el) {
                ASLDS.logger.warn('Element not found for reveal-on-scroll.');
                return this;
            }

            // Parse animation config
            const config = this._parseAnimationConfig(animation, options);
            if (!config) {
                return this;
            }

            // Store animation config on element
            el.dataset.animation = JSON.stringify(config);

            // Add to scroll observer
            this._observeElement(el);

            return this;
        },

        /**
         * Cancel all running animations on an element
         * @param {Element|string} element - Element or selector
         * @returns {Object} This instance for chaining
         */
        cancel: function (element) {
            const el = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!el) {
                return this;
            }

            // Cancel animations
            const animations = el.getAnimations ? el.getAnimations() : [];
            animations.forEach(function (anim) {
                anim.cancel();
            });

            // Remove from running list
            this.state.running = this.state.running.filter(function (item) {
                return item.element !== el;
            });

            ASLDS.logger.debug('Animations cancelled on element.');

            return this;
        },

        /**
         * Cancel all running animations
         * @returns {Object} This instance for chaining
         */
        cancelAll: function () {
            this.state.running.forEach(function (item) {
                if (item.animation) {
                    item.animation.cancel();
                }
            });

            this.state.running = [];
            this.state.queue = [];

            ASLDS.logger.debug('All animations cancelled.');

            return this;
        },

        /**
         * Check if an element is currently animating
         * @param {Element|string} element - Element or selector
         * @returns {boolean} True if animating
         */
        isAnimating: function (element) {
            const el = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!el) {
                return false;
            }

            return this.state.running.some(function (item) {
                return item.element === el;
            });
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
                reducedMotion: this.state.reducedMotion,
                runningAnimations: this.state.running.length,
                queuedAnimations: this.state.queue.length,
                observedElements: this.state.observers.length,
                config: Object.assign({}, this.config),
            };
        },

        /**
         * Get module status
         * @returns {Object} Status object
         */
        status: function () {
            return {
                initialized: this.state.initialized,
                isAnimating: this.state.isAnimating,
                reducedMotion: this.state.reducedMotion,
                running: this.state.running.length,
                queued: this.state.queue.length,
                observers: this.state.observers.length,
                config: Object.assign({}, this.config),
            };
        },

        /**
         * Destroy the animations module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Animations module...');

            // Cancel all animations
            this.cancelAll();

            // Disconnect observers
            this.state.observers.forEach(function (observer) {
                observer.disconnect();
            });
            this.state.observers = [];

            // Remove event listeners
            this._removeEventListeners();

            // Clear timers
            if (this.state.scrollTimer) {
                clearTimeout(this.state.scrollTimer);
                this.state.scrollTimer = null;
            }

            if (this.state.rafId) {
                cancelAnimationFrame(this.state.rafId);
                this.state.rafId = null;
            }

            // Reset state
            this.state.initialized = false;
            this.state.running = [];
            this.state.queue = [];
            this.state.frameCallbacks = [];

            ASLDS.logger.info('Animations module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Check for reduced motion preference
         */
        _checkReducedMotion: function () {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.state.reducedMotion = mediaQuery.matches;

            if (this.state.reducedMotion) {
                this.elements.root.setAttribute('data-reduced-motion', 'reduce');
                ASLDS.logger.debug('Reduced motion enabled.');
            } else {
                this.elements.root.setAttribute('data-reduced-motion', 'normal');
            }

            // Listen for changes
            const handler = function (event) {
                this.state.reducedMotion = event.matches;
                this.elements.root.setAttribute(
                    'data-reduced-motion',
                    event.matches ? 'reduce' : 'normal'
                );
                ASLDS.logger.debug('Reduced motion changed: ' + (event.matches ? 'reduce' : 'normal'));
            }.bind(this);

            try {
                mediaQuery.addEventListener('change', handler);
                this._reducedMotionHandler = handler;
            } catch (e) {
                mediaQuery.addListener(handler);
                this._reducedMotionHandler = handler;
            }
        },

        /**
         * Parse animation configuration
         * @param {string|Object} animation - Animation type or config object
         * @param {Object} options - Options
         * @returns {Object|null} Parsed config
         */
        _parseAnimationConfig: function (animation, options) {
            let config = {};

            if (typeof animation === 'string') {
                config.type = animation;
            } else if (typeof animation === 'object') {
                config = Object.assign({}, animation);
            } else {
                return null;
            }

            // Merge options
            if (options) {
                Object.assign(config, options);
            }

            // Set defaults
            if (!config.duration) config.duration = this.config.defaultDuration;
            if (!config.easing) config.easing = this.config.defaultEasing;
            if (!config.delay) config.delay = this.config.defaultDelay;
            if (!config.fillMode) config.fillMode = this.config.defaultFillMode;

            return config;
        },

        /**
         * Animate a single element
         * @param {Element} element - DOM element
         * @param {Object} config - Animation config
         * @returns {Promise} Animation promise
         */
        _animateElement: function (element, config) {
            return new Promise(function (resolve, reject) {
                // Check if element exists
                if (!element) {
                    reject(new Error('Element not found'));
                    return;
                }

                // Check reduced motion
                if (this.config.respectReducedMotion && this.state.reducedMotion) {
                    // Apply final state immediately
                    this._applyFinalState(element, config);
                    resolve();
                    return;
                }

                // Generate unique animation ID
                const animId = ++this.state.animationIdCounter;

                // Store running animation
                this.state.running.push({
                    id: animId,
                    element: element,
                    resolve: resolve,
                    reject: reject,
                });

                // Build keyframes
                const keyframes = this._buildKeyframes(element, config);
                if (!keyframes) {
                    // Remove from running
                    this.state.running = this.state.running.filter(function (item) {
                        return item.id !== animId;
                    });
                    reject(new Error('Failed to build keyframes'));
                    return;
                }

                // Build options
                const options = {
                    duration: config.duration,
                    easing: config.easing,
                    delay: config.delay || 0,
                    fill: config.fillMode || 'forwards',
                };

                // Use Web Animations API if available
                if (element.animate) {
                    const animation = element.animate(keyframes, options);

                    // Store reference
                    const runningItem = this.state.running.find(function (item) {
                        return item.id === animId;
                    });
                    if (runningItem) {
                        runningItem.animation = animation;
                    }

                    // Handle completion
                    animation.onfinish = function () {
                        this._onAnimationComplete(animId, resolve);
                    }.bind(this);

                    animation.oncancel = function () {
                        this._onAnimationCancel(animId);
                    }.bind(this);

                    // If duration is 0, resolve immediately
                    if (config.duration === 0) {
                        animation.finish();
                    }
                } else {
                    // Fallback: apply styles directly
                    this._applyFinalState(element, config);
                    this._onAnimationComplete(animId, resolve);
                }

                // Emit event
                ASLDS.events.emit('animation:start', {
                    element: element,
                    config: config,
                    id: animId,
                });
            }.bind(this));
        },

        /**
         * Build animation keyframes
         * @param {Element} element - DOM element
         * @param {Object} config - Animation config
         * @returns {Array|null} Keyframes array
         */
        _buildKeyframes: function (element, config) {
            const type = config.type;
            let keyframes = [];

            switch (type) {
                case 'fade':
                    keyframes = this._buildFadeKeyframes(config);
                    break;
                case 'fade-up':
                case 'fade-down':
                case 'fade-left':
                case 'fade-right':
                    keyframes = this._buildFadeDirectionKeyframes(type, config);
                    break;
                case 'slide-up':
                case 'slide-down':
                case 'slide-left':
                case 'slide-right':
                    keyframes = this._buildSlideKeyframes(type, config);
                    break;
                case 'scale':
                case 'scale-in':
                case 'scale-out':
                    keyframes = this._buildScaleKeyframes(type, config);
                    break;
                case 'pulse':
                    keyframes = this._buildPulseKeyframes(config);
                    break;
                case 'zoom-in':
                case 'zoom-out':
                    keyframes = this._buildZoomKeyframes(type, config);
                    break;
                case 'rotate':
                case 'rotate-cw':
                case 'rotate-ccw':
                    keyframes = this._buildRotateKeyframes(type, config);
                    break;
                case 'bounce':
                    keyframes = this._buildBounceKeyframes(config);
                    break;
                case 'bounce-in':
                case 'bounce-out':
                    keyframes = this._buildBounceDirectionKeyframes(type, config);
                    break;
                case 'pop':
                    keyframes = this._buildPopKeyframes(config);
                    break;
                case 'shimmer':
                    keyframes = this._buildShimmerKeyframes(config);
                    break;
                case 'spinner':
                    keyframes = this._buildSpinnerKeyframes(config);
                    break;
                case 'flip':
                case 'flip-x':
                case 'flip-y':
                    keyframes = this._buildFlipKeyframes(type, config);
                    break;
                default:
                    ASLDS.logger.warn('Unknown animation type: ' + type);
                    return null;
            }

            return keyframes;
        },

        /**
         * Build fade keyframes
         */
        _buildFadeKeyframes: function (config) {
            const direction = config.direction || 'in';
            if (direction === 'in') {
                return [
                    { opacity: 0 },
                    { opacity: 1 }
                ];
            } else {
                return [
                    { opacity: 1 },
                    { opacity: 0 }
                ];
            }
        },

        /**
         * Build fade + direction keyframes
         */
        _buildFadeDirectionKeyframes: function (type, config) {
            const direction = type.replace('fade-', '');
            const distance = config.distance || '30px';
            let translate = '';

            switch (direction) {
                case 'up': translate = '0, ' + distance + ', 0'; break;
                case 'down': translate = '0, -' + distance + ', 0'; break;
                case 'left': translate = distance + ', 0, 0'; break;
                case 'right': translate = '-' + distance + ', 0, 0'; break;
            }

            return [
                { opacity: 0, transform: 'translate3d(' + translate + ')' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)' }
            ];
        },

        /**
         * Build slide keyframes
         */
        _buildSlideKeyframes: function (type, config) {
            const direction = type.replace('slide-', '');
            const distance = config.distance || '100%';
            let translate = '';

            switch (direction) {
                case 'up': translate = '0, ' + distance + ', 0'; break;
                case 'down': translate = '0, -' + distance + ', 0'; break;
                case 'left': translate = distance + ', 0, 0'; break;
                case 'right': translate = '-' + distance + ', 0, 0'; break;
            }

            return [
                { transform: 'translate3d(' + translate + ')' },
                { transform: 'translate3d(0, 0, 0)' }
            ];
        },

        /**
         * Build scale keyframes
         */
        _buildScaleKeyframes: function (type, config) {
            const scale = config.scale || 0.5;

            if (type === 'scale' || type === 'scale-in') {
                return [
                    { transform: 'scale(' + scale + ')' },
                    { transform: 'scale(1)' }
                ];
            } else if (type === 'scale-out') {
                return [
                    { transform: 'scale(1)' },
                    { transform: 'scale(' + scale + ')' }
                ];
            }

            return [
                { transform: 'scale(' + scale + ')' },
                { transform: 'scale(1)' }
            ];
        },

        /**
         * Build pulse keyframes
         */
        _buildPulseKeyframes: function (config) {
            const scale = config.scale || 1.05;
            return [
                { transform: 'scale(1)' },
                { transform: 'scale(' + scale + ')' },
                { transform: 'scale(1)' }
            ];
        },

        /**
         * Build zoom keyframes
         */
        _buildZoomKeyframes: function (type, config) {
            const scale = config.scale || 0.5;

            if (type === 'zoom-in') {
                return [
                    { opacity: 0, transform: 'scale(' + scale + ')' },
                    { opacity: 1, transform: 'scale(1)' }
                ];
            } else {
                return [
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 0, transform: 'scale(' + scale + ')' }
                ];
            }
        },

        /**
         * Build rotate keyframes
         */
        _buildRotateKeyframes: function (type, config) {
            const degrees = config.degrees || 360;

            if (type === 'rotate' || type === 'rotate-cw') {
                return [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(' + degrees + 'deg)' }
                ];
            } else {
                return [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(-' + degrees + 'deg)' }
                ];
            }
        },

        /**
         * Build bounce keyframes
         */
        _buildBounceKeyframes: function (config) {
            const distance = config.distance || '30px';
            return [
                { transform: 'translate3d(0, 0, 0)', offset: 0 },
                { transform: 'translate3d(0, -' + distance + ', 0)', offset: 0.3 },
                { transform: 'translate3d(0, 0, 0)', offset: 0.6 },
                { transform: 'translate3d(0, -' + parseInt(distance) / 2 + 'px, 0)', offset: 0.8 },
                { transform: 'translate3d(0, 0, 0)', offset: 1 }
            ];
        },

        /**
         * Build bounce direction keyframes
         */
        _buildBounceDirectionKeyframes: function (type, config) {
            const isIn = type === 'bounce-in';
            const distance = config.distance || '50px';
            let translate = isIn ? '-' + distance : distance;

            if (isIn) {
                return [
                    { opacity: 0, transform: 'translate3d(0, ' + distance + ', 0) scale(0.8)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1.05)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(0.98)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
                ];
            } else {
                return [
                    { opacity: 1, transform: 'scale(1)' },
                    { opacity: 1, transform: 'scale(1.05)' },
                    { opacity: 0, transform: 'translate3d(0, ' + distance + ', 0) scale(0.8)' }
                ];
            }
        },

        /**
         * Build pop keyframes (scale in with bounce)
         */
        _buildPopKeyframes: function (config) {
            return [
                { opacity: 0, transform: 'scale(0.5)' },
                { opacity: 1, transform: 'scale(1.1)' },
                { opacity: 1, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ];
        },

        /**
         * Build shimmer keyframes
         */
        _buildShimmerKeyframes: function (config) {
            const angle = config.angle || '45deg';
            const bgColor = config.bgColor || '#f6f7f8';
            const shimmerColor = config.shimmerColor || '#edeef1';

            const gradient = 'linear-gradient(' + angle + ', ' +
                bgColor + ' 40%, ' + shimmerColor + ' 50%, ' +
                bgColor + ' 60%)';

            return [
                { background: gradient, backgroundSize: '200% 100%', backgroundPosition: '-200% 0' },
                { background: gradient, backgroundSize: '200% 100%', backgroundPosition: '200% 0' }
            ];
        },

        /**
         * Build spinner keyframes
         */
        _buildSpinnerKeyframes: function (config) {
            const duration = config.duration || 1000;
            config.duration = duration;
            return [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ];
        },

        /**
         * Build flip keyframes
         */
        _buildFlipKeyframes: function (type, config) {
            const degrees = config.degrees || 180;

            if (type === 'flip' || type === 'flip-x') {
                return [
                    { transform: 'perspective(400px) rotateX(0deg)' },
                    { transform: 'perspective(400px) rotateX(' + degrees + 'deg)' }
                ];
            } else {
                return [
                    { transform: 'perspective(400px) rotateY(0deg)' },
                    { transform: 'perspective(400px) rotateY(' + degrees + 'deg)' }
                ];
            }
        },

        /**
         * Apply final animation state
         */
        _applyFinalState: function (element, config) {
            const type = config.type;

            // Reset styles
            element.style.opacity = '';
            element.style.transform = '';
            element.style.background = '';
            element.style.backgroundSize = '';
            element.style.backgroundPosition = '';

            // Apply final state based on animation type
            if (type === 'fade' && config.direction === 'out') {
                element.style.opacity = '0';
            } else if (type === 'fade' && config.direction === 'in') {
                element.style.opacity = '1';
            } else if (type === 'fade-out') {
                element.style.opacity = '0';
            } else if (type === 'fade-in') {
                element.style.opacity = '1';
            } else if (type === 'slide-up' || type === 'slide-down' ||
                type === 'slide-left' || type === 'slide-right') {
                element.style.transform = 'translate3d(0, 0, 0)';
            } else if (type === 'scale-out') {
                element.style.transform = 'scale(0)';
            } else if (type === 'scale-in' || type === 'scale') {
                element.style.transform = 'scale(1)';
            } else if (type === 'zoom-out') {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.5)';
            } else if (type === 'zoom-in') {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            } else if (type === 'bounce-out') {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
            } else if (type === 'bounce-in' || type === 'bounce' || type === 'pop') {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }
        },

        /**
         * Handle animation completion
         */
        _onAnimationComplete: function (animId, resolve) {
            // Remove from running
            this.state.running = this.state.running.filter(function (item) {
                return item.id !== animId;
            });

            // Resolve promise
            if (resolve) {
                resolve();
            }

            ASLDS.events.emit('animation:complete', {
                id: animId,
            });
        },

        /**
         * Handle animation cancellation
         */
        _onAnimationCancel: function (animId) {
            this.state.running = this.state.running.filter(function (item) {
                return item.id !== animId;
            });

            ASLDS.events.emit('animation:cancel', {
                id: animId,
            });
        },

        /**
         * Setup scroll-triggered animations
         */
        _setupScrollAnimations: function () {
            // Find all scroll-triggered elements
            const elements = ASLDS.dom.findAll(this.config.scrollSelector);

            elements.forEach(function (el) {
                // Get animation config from data attribute
                const animation = el.getAttribute('data-scroll-animation') || 'fade-up';
                const config = this._parseAnimationConfig(animation, {});

                // Store config on element
                el.dataset.animation = JSON.stringify(config);

                // Observe element
                this._observeElement(el);
            }.bind(this));

            ASLDS.logger.debug('Scroll animations setup complete: ' + elements.length + ' elements.');
        },

        /**
         * Observe an element for intersection
         */
        _observeElement: function (element) {
            // Create intersection observer if needed
            if (this.state.observers.length === 0) {
                this._createIntersectionObserver();
            }

            // Use the last observer
            const observer = this.state.observers[this.state.observers.length - 1];
            observer.observe(element);
        },

        /**
         * Create intersection observer
         */
        _createIntersectionObserver: function () {
            if (!window.IntersectionObserver) {
                return;
            }

            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const animationData = el.dataset.animation;

                        if (animationData) {
                            try {
                                const config = JSON.parse(animationData);
                                this._animateElement(el, config);

                                // Unobserve if only once
                                if (this.config.scrollOnce) {
                                    observer.unobserve(el);
                                }
                            } catch (e) {
                                // Fallback: use default animation
                                this._animateElement(el, { type: 'fade-up' });
                            }
                        } else {
                            this._animateElement(el, { type: 'fade-up' });
                        }
                    }
                }.bind(this));
            }.bind(this), {
                threshold: this.config.scrollThreshold,
                rootMargin: this.config.scrollRootMargin,
            });

            this.state.observers.push(observer);

            ASLDS.logger.debug('Intersection observer created.');
        },

        /**
         * Process existing animated elements
         */
        _processAnimatedElements: function () {
            const elements = ASLDS.dom.findAll(this.config.animateSelector);

            elements.forEach(function (el) {
                const animation = el.getAttribute('data-animate');
                const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
                const duration = parseInt(el.getAttribute('data-duration') || '400', 10);

                if (animation) {
                    // Add to cache
                    this.elements.animated.push(el);

                    // Check if should animate immediately
                    const shouldAnimate = el.hasAttribute('data-animate-now');

                    if (shouldAnimate) {
                        this._animateElement(el, {
                            type: animation,
                            duration: duration,
                            delay: delay,
                        });
                    }
                }
            }.bind(this));

            ASLDS.logger.debug('Processed ' + this.elements.animated.length + ' animated elements.');
        },

        /**
         * Setup hover animations
         */
        _setupHoverAnimations: function () {
            const elements = ASLDS.dom.findAll(this.config.hoverSelector);

            elements.forEach(function (el) {
                const animation = el.getAttribute('data-hover') || 'scale';
                const config = this._parseAnimationConfig(animation, {});

                // Store config
                if (!el._hoverConfig) {
                    el._hoverConfig = config;
                }

                // Mouse enter
                const enterHandler = function (e) {
                    if (this.config.respectReducedMotion && this.state.reducedMotion) {
                        return;
                    }
                    this._animateElement(el, config);
                }.bind(this);

                // Mouse leave
                const leaveHandler = function (e) {
                    // Reset animation
                    el.style.transform = '';
                    el.style.opacity = '';
                };

                el.addEventListener('mouseenter', enterHandler);
                el.addEventListener('mouseleave', leaveHandler);

                // Store handlers for cleanup
                if (!el._hoverHandlers) {
                    el._hoverHandlers = {
                        enter: enterHandler,
                        leave: leaveHandler,
                    };
                }
            }.bind(this));

            ASLDS.logger.debug('Hover animations setup complete: ' + elements.length + ' elements.');
        },

        /**
         * Setup focus animations
         */
        _setupFocusAnimations: function () {
            const elements = ASLDS.dom.findAll(this.config.focusSelector);

            elements.forEach(function (el) {
                const animation = el.getAttribute('data-focus') || 'scale';
                const config = this._parseAnimationConfig(animation, {});

                // Focus
                const focusHandler = function (e) {
                    if (this.config.respectReducedMotion && this.state.reducedMotion) {
                        return;
                    }
                    this._animateElement(el, config);
                }.bind(this);

                // Blur
                const blurHandler = function (e) {
                    el.style.transform = '';
                    el.style.opacity = '';
                };

                el.addEventListener('focus', focusHandler);
                el.addEventListener('blur', blurHandler);

                // Store handlers for cleanup
                if (!el._focusHandlers) {
                    el._focusHandlers = {
                        focus: focusHandler,
                        blur: blurHandler,
                    };
                }
            }.bind(this));

            ASLDS.logger.debug('Focus animations setup complete: ' + elements.length + ' elements.');
        },

        /**
         * Setup ripple effects
         */
        _setupRippleEffects: function () {
            const elements = ASLDS.dom.findAll(this.config.rippleSelector);

            elements.forEach(function (el) {
                const color = el.getAttribute('data-ripple-color') || this.config.rippleColor;
                const duration = parseInt(el.getAttribute('data-ripple-duration') || this.config.rippleDuration, 10);

                el.addEventListener('click', function (e) {
                    if (this.config.respectReducedMotion && this.state.reducedMotion) {
                        return;
                    }

                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    ripple.style.cssText =
                        'position:absolute;' +
                        'border-radius:50%;' +
                        'background:' + color + ';' +
                        'width:100px;height:100px;' +
                        'margin-left:-50px;margin-top:-50px;' +
                        'left:' + x + 'px;top:' + y + 'px;' +
                        'pointer-events:none;' +
                        'transform:scale(0);' +
                        'opacity:1;' +
                        'animation:ripple ' + duration + 'ms ease-out forwards;';

                    el.style.position = 'relative';
                    el.style.overflow = 'hidden';
                    el.appendChild(ripple);

                    // Remove ripple after animation
                    setTimeout(function () {
                        if (ripple.parentNode) {
                            ripple.remove();
                        }
                    }, duration);
                }.bind(this));
            }.bind(this));

            ASLDS.logger.debug('Ripple effects setup complete: ' + elements.length + ' elements.');
        },

        /**
         * Setup stagger animations
         */
        _setupStaggerAnimations: function () {
            const elements = ASLDS.dom.findAll(this.config.staggerSelector);

            elements.forEach(function (parent) {
                const childSelector = parent.getAttribute('data-stagger-child') || '> *';
                const animation = parent.getAttribute('data-stagger-animation') || 'fade-up';
                const delay = parseInt(parent.getAttribute('data-stagger-delay') || this.config.staggerDelay, 10);

                // Check if should animate immediately
                const shouldAnimate = parent.hasAttribute('data-stagger-now');

                if (shouldAnimate) {
                    this.stagger(parent, childSelector, animation, {
                        staggerDelay: delay,
                    });
                }

                // Store for later use
                parent._staggerConfig = {
                    childSelector: childSelector,
                    animation: animation,
                    delay: delay,
                };
            }.bind(this));

            ASLDS.logger.debug('Stagger animations setup complete: ' + elements.length + ' elements.');
        },

        /**
         * Setup page transition animations
         */
        _setupPageTransitions: function () {
            // Check if page should transition on load
            const transition = this.elements.body.getAttribute('data-page-transition');

            if (transition) {
                // Fade in on load
                this.elements.body.style.opacity = '0';
                this.elements.body.style.transition = 'opacity ' + (this.config.defaultDuration / 1000) + 's ease';

                // Trigger on load
                window.addEventListener('load', function () {
                    this.elements.body.style.opacity = '1';
                }.bind(this));
            }
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Scroll listener for scroll animations
            const scrollHandler = function () {
                if (this.state.scrollTimer) {
                    clearTimeout(this.state.scrollTimer);
                }

                this.state.scrollTimer = setTimeout(function () {
                    this._handleScroll();
                }.bind(this), this.config.throttleScroll);
            }.bind(this);

            window.addEventListener('scroll', scrollHandler, { passive: true });
            this._handlers.scroll = scrollHandler;

            // Resize listener
            const resizeHandler = function () {
                this._handleResize();
            }.bind(this);

            window.addEventListener('resize', resizeHandler);
            this._handlers.resize = resizeHandler;

            ASLDS.logger.debug('Global event listeners setup complete.');
        },

        /**
         * Remove global event listeners
         */
        _removeEventListeners: function () {
            if (this._handlers.scroll) {
                window.removeEventListener('scroll', this._handlers.scroll);
                this._handlers.scroll = null;
            }

            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Remove hover handlers
            const hoverElements = ASLDS.dom.findAll(this.config.hoverSelector);
            hoverElements.forEach(function (el) {
                if (el._hoverHandlers) {
                    el.removeEventListener('mouseenter', el._hoverHandlers.enter);
                    el.removeEventListener('mouseleave', el._hoverHandlers.leave);
                }
            });

            // Remove focus handlers
            const focusElements = ASLDS.dom.findAll(this.config.focusSelector);
            focusElements.forEach(function (el) {
                if (el._focusHandlers) {
                    el.removeEventListener('focus', el._focusHandlers.focus);
                    el.removeEventListener('blur', el._focusHandlers.blur);
                }
            });

            ASLDS.logger.debug('Event listeners removed.');
        },

        /**
         * Handle scroll events
         */
        _handleScroll: function () {
            // IntersectionObserver handles scroll-triggered animations
            // This is just for any additional scroll-based logic
            ASLDS.events.emit('animation:scroll', {
                scrollY: window.scrollY,
                scrollX: window.scrollX,
            });
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            ASLDS.events.emit('animation:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
            });
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Animations.config);
    Object.freeze(Animations.types);
    Object.freeze(Animations.easings);
    Object.freeze(Animations.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Animations.name, Animations, Animations.priority, Animations.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        Animations.init();
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSAnimations) {
        window.ASLDSAnimations = Animations;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : animations.js
     * Module      : ASL Design System (ASLDS) Animations
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
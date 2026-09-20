/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Navbar
Author: A Square L Innovate
Created: 2026

Description:
Responsive navigation controller. Handles the mobile
menu toggle, aria state, close-on-link, close-on-escape,
close-on-outside-click, and viewport resize reset.

Dependencies:
- Runtime: ASLDS (app.js)

Usage (automatic):
    The runtime will auto-initialize via ASLDS.register().

Usage (manual):
    ASLDS.Navbar.init({
        navbarSelector: '.navbar',
        toggleSelector: '.mobile-toggle',
        menuSelector: '.nav-menu',
        linkSelector: '.nav-link',
        openClass: 'open',
        resizeBreakpoint: 992,
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnResize: true,
        closeOnLinkClick: true,
        restoreFocusOnClose: true
    });
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Navbar';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        navbarSelector: '.navbar',
        toggleSelector: '.mobile-toggle',
        menuSelector: '.nav-menu',
        linkSelector: '.nav-link',
        openClass: 'open',
        resizeBreakpoint: 992,
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnResize: true,
        closeOnLinkClick: true,
        restoreFocusOnClose: true,
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        isOpen: false,
        config: {},
        eventListeners: [],
    };

    // ======================================================
    // CACHED ELEMENTS
    // ======================================================

    let cached = {
        navbar: null,
        toggle: null,
        menu: null,
        links: [],
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

    // ======================================================
    // ACCESSIBILITY
    // ======================================================

    function updateAriaExpanded(isOpen) {
        if (!cached.toggle) return;
        cached.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function updateMenuAria(isOpen) {
        if (!cached.menu) return;
        // Only apply aria-hidden on mobile widths — never hide the desktop menu
        if (window.innerWidth <= state.config.resizeBreakpoint) {
            cached.menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        } else {
            cached.menu.removeAttribute('aria-hidden');
        }
    }

    function restoreFocus() {
        if (!state.config.restoreFocusOnClose) return;
        if (cached.toggle && typeof cached.toggle.focus === 'function') {
            cached.toggle.focus();
        }
    }

    // ======================================================
    // PRIVATE LOGIC
    // ======================================================

    function openMenu() {
        if (!cached.menu || state.isOpen) return;

        state.isOpen = true;
        cached.menu.classList.add(state.config.openClass);
        updateAriaExpanded(true);
        updateMenuAria(true);

        const event = new CustomEvent('asl:navbar:open', {
            detail: { menu: cached.menu, toggle: cached.toggle }
        });
        document.dispatchEvent(event);
    }

    function closeMenu(shouldRestoreFocus) {
        if (!cached.menu || !state.isOpen) return;

        state.isOpen = false;
        cached.menu.classList.remove(state.config.openClass);
        updateAriaExpanded(false);
        updateMenuAria(false);

        if (shouldRestoreFocus) {
            restoreFocus();
        }

        const event = new CustomEvent('asl:navbar:close', {
            detail: { menu: cached.menu, toggle: cached.toggle }
        });
        document.dispatchEvent(event);
    }

    function toggleMenu() {
        if (state.isOpen) {
            closeMenu(false);   // user toggled — don't steal focus
        } else {
            openMenu();
        }
    }

    // ======================================================
    // EVENT HANDLERS
    // ======================================================

    function handleToggleClick(event) {
        event.preventDefault();
        toggleMenu();
    }

    function handleLinkClick() {
        if (!state.config.closeOnLinkClick) return;
        if (!state.isOpen) return;
        closeMenu(false);
    }

    function handleEscape(event) {
        if (!state.config.closeOnEscape) return;
        if (event.key !== 'Escape') return;
        if (!state.isOpen) return;
        closeMenu(true);
    }

    function handleOutsideClick(event) {
        if (!state.config.closeOnOutsideClick) return;
        if (!state.isOpen) return;
        if (!cached.navbar) return;
        if (cached.navbar.contains(event.target)) return;
        closeMenu(false);
    }

    function handleResize() {
        if (!state.config.closeOnResize) return;
        if (!state.isOpen) return;
        if (window.innerWidth > state.config.resizeBreakpoint) {
            closeMenu(false);
        }
    }

    // ======================================================
    // EVENT BINDING
    // ======================================================

    function bindEvents() {
        if (cached.toggle) {
            cached.toggle.addEventListener('click', handleToggleClick);
            state.eventListeners.push({
                element: cached.toggle,
                event: 'click',
                handler: handleToggleClick
            });
        }

        if (state.config.closeOnLinkClick && cached.links.length > 0) {
            cached.links.forEach(function (link) {
                link.addEventListener('click', handleLinkClick);
                state.eventListeners.push({
                    element: link,
                    event: 'click',
                    handler: handleLinkClick
                });
            });
        }

        if (state.config.closeOnEscape) {
            document.addEventListener('keydown', handleEscape);
            state.eventListeners.push({
                element: document,
                event: 'keydown',
                handler: handleEscape
            });
        }

        if (state.config.closeOnOutsideClick) {
            document.addEventListener('click', handleOutsideClick);
            state.eventListeners.push({
                element: document,
                event: 'click',
                handler: handleOutsideClick
            });
        }

        if (state.config.closeOnResize) {
            window.addEventListener('resize', handleResize);
            state.eventListeners.push({
                element: window,
                event: 'resize',
                handler: handleResize
            });
        }
    }

    function unbindEvents() {
        state.eventListeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        state.eventListeners = [];
    }

    // ======================================================
    // ELEMENT CACHING
    // ======================================================

    function cacheElements(config) {
        const toggle = document.querySelector(config.toggleSelector);
        const menu = document.querySelector(config.menuSelector);

        if (!toggle || !menu) {
            console.warn(
                '[ASLDS Navbar] Missing toggle or menu. Expected:',
                config.toggleSelector,
                '/',
                config.menuSelector
            );
            return false;
        }

        cached.navbar = toggle.closest('.navbar') || document.querySelector(config.navbarSelector);
        cached.toggle = toggle;
        cached.menu = menu;
        cached.links = Array.from(menu.querySelectorAll(config.linkSelector));

        // Ensure toggle has a starting aria-expanded
        if (!cached.toggle.hasAttribute('aria-expanded')) {
            cached.toggle.setAttribute('aria-expanded', 'false');
        }

        return true;
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[ASLDS Navbar] Already initialized.');
            return this;
        }

        state.config = mergeConfig(userConfig);

        if (!cacheElements(state.config)) {
            return this;
        }

        // Sync initial state with the DOM
        if (cached.menu.classList.contains(state.config.openClass)) {
            state.isOpen = true;
            updateAriaExpanded(true);
            updateMenuAria(true);
        } else {
            state.isOpen = false;
            updateAriaExpanded(false);
            updateMenuAria(false);
        }

        bindEvents();

        state.initialized = true;

        const event = new CustomEvent('asl:navbar:init', {
            detail: { menu: cached.menu, toggle: cached.toggle }
        });
        document.dispatchEvent(event);

        return this;
    }

    function destroy() {
        if (!state.initialized) return this;

        if (state.isOpen) {
            closeMenu(false);
        }

        unbindEvents();

        cached.navbar = null;
        cached.toggle = null;
        cached.menu = null;
        cached.links = [];

        state.initialized = false;
        state.isOpen = false;
        state.config = {};

        const event = new CustomEvent('asl:navbar:destroy');
        document.dispatchEvent(event);

        return this;
    }

    // ======================================================
    // PUBLIC API
    // ======================================================

    const API = {
        init: init,
        destroy: destroy,

        open: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Navbar] Not initialized.');
                return this;
            }
            openMenu();
            return this;
        },

        close: function (shouldRestoreFocus) {
            if (!state.initialized) {
                console.warn('[ASLDS Navbar] Not initialized.');
                return this;
            }
            closeMenu(shouldRestoreFocus === true);
            return this;
        },

        toggle: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Navbar] Not initialized.');
                return this;
            }
            toggleMenu();
            return this;
        },

        isOpen: function () {
            return state.isOpen;
        },

        getState: function () {
            return {
                isOpen: state.isOpen,
                initialized: state.initialized,
            };
        },

        getToggle: function () {
            return cached.toggle;
        },

        getMenu: function () {
            return cached.menu;
        },

        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[ASLDS Navbar] Not initialized.');
                return this;
            }
            if (newConfig.closeOnOutsideClick !== undefined) {
                state.config.closeOnOutsideClick = !!newConfig.closeOnOutsideClick;
            }
            if (newConfig.closeOnEscape !== undefined) {
                state.config.closeOnEscape = !!newConfig.closeOnEscape;
            }
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Navbar = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        window.ASLDS.register('Navbar', API, 100, []);
    } else {
        console.warn('[ASLDS Navbar] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Sidebar
Author: A Square L Innovate
Created: 2026

Description:
Responsive sidebar component for dashboards, admin panels,
and documentation sites. Toggles visibility on mobile,
supports keyboard accessibility, and provides a clean
public API.

Dependencies:
- Runtime: ASLDS (app.js)

Usage (automatic):
    The runtime will auto-initialize via ASLDS.register().

Usage (manual):
    ASLDS.Sidebar.init({
        sidebarSelector: '.sidebar',
        toggleSelector: '.mobile-toggle',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnResize: true
    });
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Sidebar';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        sidebarSelector: '.sidebar',
        toggleSelector: '.mobile-toggle',
        openClass: 'open',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnResize: true,
        resizeBreakpoint: 992,
        ariaExpandedAttribute: 'aria-expanded',
        ariaControlsAttribute: 'aria-controls',
        activeStateAttribute: 'aria-current',
        activeLinkClass: 'active',
        linkSelector: '.sidebar-link',
        focusOnOpen: false,
        trapFocus: false,
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        isOpen: false,
        sidebar: null,
        toggle: null,
        config: {},
        eventListeners: [],
        resizeTimer: null,
        outsideClickHandler: null,
        escapeHandler: null,
        resizeHandler: null,
        mutationObserver: null,
        focusableElements: [],
        previousActiveElement: null,
    };

    // ======================================================
    // CACHED ELEMENTS
    // ======================================================

    let cached = {
        sidebar: null,
        toggle: null,
        allLinks: [],
        focusableChildren: [],
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

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function getFocusableElements(element) {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(element.querySelectorAll(selector));
    }

    function setAttributes(el, attrs) {
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.setAttribute(key, attrs[key]);
            }
        }
    }

    // ======================================================
    // ACCESSIBILITY
    // ======================================================

    function updateAriaExpanded(isOpen) {
        if (!cached.toggle) return;
        cached.toggle.setAttribute(state.config.ariaExpandedAttribute, isOpen ? 'true' : 'false');
    }

    function updateSidebarAccessibility(isOpen) {
        if (!cached.sidebar) return;
        cached.sidebar.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }

    function manageFocus(isOpen) {
        if (isOpen) {
            state.previousActiveElement = document.activeElement;
            if (state.config.focusOnOpen) {
                const focusable = getFocusableElements(cached.sidebar);
                if (focusable.length > 0) {
                    focusable[0].focus();
                } else {
                    cached.sidebar.setAttribute('tabindex', '-1');
                    cached.sidebar.focus();
                }
            }
        } else {
            if (state.previousActiveElement && state.previousActiveElement.focus) {
                state.previousActiveElement.focus();
                state.previousActiveElement = null;
            }
            if (cached.sidebar && cached.sidebar.getAttribute('tabindex') === '-1') {
                cached.sidebar.removeAttribute('tabindex');
            }
        }
    }

    // ======================================================
    // PRIVATE LOGIC
    // ======================================================

    function openSidebar() {
        if (!cached.sidebar || state.isOpen) return;
        state.isOpen = true;
        cached.sidebar.classList.add(state.config.openClass);
        updateAriaExpanded(true);
        updateSidebarAccessibility(true);
        manageFocus(true);
        const event = new CustomEvent('asl:sidebar:open', {
            detail: { sidebar: cached.sidebar }
        });
        document.dispatchEvent(event);
    }

    function closeSidebar() {
        if (!cached.sidebar || !state.isOpen) return;
        state.isOpen = false;
        cached.sidebar.classList.remove(state.config.openClass);
        updateAriaExpanded(false);
        updateSidebarAccessibility(false);
        manageFocus(false);
        const event = new CustomEvent('asl:sidebar:close', {
            detail: { sidebar: cached.sidebar }
        });
        document.dispatchEvent(event);
    }

    function toggleSidebar() {
        state.isOpen ? closeSidebar() : openSidebar();
    }

    function handleOutsideClick(event) {
        if (!state.isOpen || !cached.sidebar) return;
        const target = event.target;
        const isInsideSidebar = cached.sidebar.contains(target);
        const isToggle = cached.toggle && cached.toggle.contains(target);
        if (!isInsideSidebar && !isToggle) {
            closeSidebar();
        }
    }

    function handleEscape(event) {
        if (event.key === 'Escape' && state.isOpen) {
            closeSidebar();
            if (cached.toggle) cached.toggle.focus();
        }
    }

    function handleResize() {
        if (!state.config.closeOnResize || !state.isOpen) return;
        if (window.innerWidth > state.config.resizeBreakpoint) {
            closeSidebar();
        }
    }

    function handleFocusTrap(event) {
        if (!state.config.trapFocus || !state.isOpen || !cached.sidebar) return;
        const focusable = getFocusableElements(cached.sidebar);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }
    }

    function bindEvents() {
        if (cached.toggle) {
            const toggleClickHandler = function (event) {
                event.preventDefault();
                toggleSidebar();
            };
            cached.toggle.addEventListener('click', toggleClickHandler);
            state.eventListeners.push({ element: cached.toggle, event: 'click', handler: toggleClickHandler });
        }
        if (state.config.closeOnOutsideClick) {
            state.outsideClickHandler = handleOutsideClick.bind(this);
            document.addEventListener('click', state.outsideClickHandler);
            state.eventListeners.push({ element: document, event: 'click', handler: state.outsideClickHandler });
        }
        if (state.config.closeOnEscape) {
            state.escapeHandler = handleEscape.bind(this);
            document.addEventListener('keydown', state.escapeHandler);
            state.eventListeners.push({ element: document, event: 'keydown', handler: state.escapeHandler });
        }
        if (state.config.closeOnResize) {
            const debouncedResize = debounce(handleResize.bind(this), 250);
            state.resizeHandler = debouncedResize;
            window.addEventListener('resize', state.resizeHandler);
            state.eventListeners.push({ element: window, event: 'resize', handler: state.resizeHandler });
        }
        if (state.config.trapFocus) {
            const trapHandler = handleFocusTrap.bind(this);
            cached.sidebar.addEventListener('keydown', trapHandler);
            state.eventListeners.push({ element: cached.sidebar, event: 'keydown', handler: trapHandler });
        }
    }

    function unbindEvents() {
        state.eventListeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        state.eventListeners = [];
        state.outsideClickHandler = null;
        state.escapeHandler = null;
        state.resizeHandler = null;
    }

    function cacheElements(config) {
        const sidebar = document.querySelector(config.sidebarSelector);
        if (!sidebar) {
            console.warn('[ASLDS Sidebar] Element not found:', config.sidebarSelector);
            return false;
        }
        cached.sidebar = sidebar;
        let toggle = null;
        if (config.toggleSelector) {
            toggle = document.querySelector(config.toggleSelector);
        }
        if (!toggle) {
            toggle = document.querySelector('[data-sidebar-toggle]');
        }
        if (!toggle) {
            console.warn('[ASLDS Sidebar] Toggle button not found. Use API methods manually.');
        }
        cached.toggle = toggle;
        cached.allLinks = Array.from(sidebar.querySelectorAll(config.linkSelector || '.sidebar-link'));
        updateAriaExpanded(false);
        updateSidebarAccessibility(false);
        return true;
    }

    function setActiveLink() {
        const currentPath = window.location.pathname;
        cached.allLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href && href !== '#' && currentPath.includes(href)) {
                link.classList.add(state.config.activeLinkClass);
                link.setAttribute(state.config.activeStateAttribute, 'page');
            }
        });
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[ASLDS Sidebar] Already initialized.');
            return this;
        }
        state.config = mergeConfig(userConfig);
        const elementsFound = cacheElements(state.config);
        if (!elementsFound) {
            console.error('[ASLDS Sidebar] Init failed – sidebar not found.');
            return this;
        }
        if (cached.sidebar.classList.contains(state.config.openClass)) {
            state.isOpen = true;
            updateAriaExpanded(true);
            updateSidebarAccessibility(true);
        } else {
            state.isOpen = false;
            updateAriaExpanded(false);
            updateSidebarAccessibility(false);
        }
        setActiveLink();
        bindEvents();
        state.initialized = true;
        const event = new CustomEvent('asl:sidebar:init', {
            detail: { sidebar: cached.sidebar }
        });
        document.dispatchEvent(event);
        return this;
    }

    function destroy() {
        if (!state.initialized) return this;
        if (state.isOpen) closeSidebar();
        unbindEvents();
        cached.sidebar = null;
        cached.toggle = null;
        cached.allLinks = [];
        state.initialized = false;
        state.isOpen = false;
        state.config = {};
        state.previousActiveElement = null;
        const event = new CustomEvent('asl:sidebar:destroy');
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
                console.warn('[ASLDS Sidebar] Not initialized.');
                return this;
            }
            openSidebar();
            return this;
        },
        close: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Sidebar] Not initialized.');
                return this;
            }
            closeSidebar();
            return this;
        },
        toggle: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Sidebar] Not initialized.');
                return this;
            }
            toggleSidebar();
            return this;
        },
        getState: function () {
            return {
                isOpen: state.isOpen,
                initialized: state.initialized,
            };
        },
        getElement: function () {
            return cached.sidebar;
        },
        getToggle: function () {
            return cached.toggle;
        },
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[ASLDS Sidebar] Not initialized.');
                return this;
            }
            if (newConfig.closeOnOutsideClick !== undefined) {
                state.config.closeOnOutsideClick = !!newConfig.closeOnOutsideClick;
            }
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    // Ensure ASLDS namespace exists
    window.ASLDS = window.ASLDS || {};

    // Direct attachment for manual access
    window.ASLDS.Sidebar = API;

    // Register with the runtime module registry
    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        // Priority 90 – loads after core utilities, before modals/navbar (100)
        window.ASLDS.register('Sidebar', API, 90, []);
    } else {
        console.warn('[ASLDS Sidebar] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Modal
Author: A Square L Innovate
Created: 2026

Description:
Accessible modal dialog component for forms, confirmations,
previews, and focused workflows. Supports focus trapping,
scroll locking, and keyboard accessibility.

Dependencies:
- Runtime: ASLDS (app.js)

Usage (automatic):
    The runtime will auto-initialize via ASLDS.register().

Usage (manual):
    ASLDS.Modal.init({
        modalSelector: '.modal',
        dialogSelector: '.modal-dialog',
        closeButtonSelector: '.modal-close',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        focusOnOpen: true,
        trapFocus: true,
        lockScroll: true
    });
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Modal';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        modalSelector: '.modal',
        dialogSelector: '.modal-dialog',
        openClass: 'is-open',
        closeButtonSelector: '.modal-close',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        focusOnOpen: true,
        trapFocus: true,
        lockScroll: true,
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        isOpen: false,
        config: {},
        eventListeners: [],
        previousActiveElement: null,
        scrollbarWidth: 0,
        bodyPaddingRight: 0,
    };

    // ======================================================
    // CACHED ELEMENTS
    // ======================================================

    let cached = {
        modal: null,
        dialog: null,
        closeButton: null,
        focusableElements: [],
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

    function getFocusableElements(element) {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(element.querySelectorAll(selector));
    }

    function getScrollbarWidth() {
        const scrollDiv = document.createElement('div');
        scrollDiv.style.width = '100px';
        scrollDiv.style.height = '100px';
        scrollDiv.style.overflow = 'scroll';
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.top = '-9999px';
        document.body.appendChild(scrollDiv);
        const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return width;
    }

    // ======================================================
    // SCROLL LOCK
    // ======================================================

    function lockBodyScroll() {
        if (!state.config.lockScroll) return;
        state.scrollbarWidth = getScrollbarWidth();
        state.bodyPaddingRight = document.body.style.paddingRight || '0px';
        document.body.style.paddingRight = `${parseFloat(state.bodyPaddingRight) + state.scrollbarWidth}px`;
        document.body.classList.add('asl-modal-open');
    }

    function unlockBodyScroll() {
        if (!state.config.lockScroll) return;
        document.body.style.paddingRight = state.bodyPaddingRight;
        document.body.classList.remove('asl-modal-open');
    }

    // ======================================================
    // ACCESSIBILITY
    // ======================================================

    function setModalAria(isOpen) {
        if (!cached.modal) return;
        cached.modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (cached.dialog) {
            cached.dialog.setAttribute('aria-modal', isOpen ? 'true' : 'false');
            cached.dialog.setAttribute('role', 'dialog');
        }
    }

    function manageFocus(isOpen) {
        if (isOpen) {
            state.previousActiveElement = document.activeElement;
            if (state.config.focusOnOpen) {
                const focusable = getFocusableElements(cached.dialog || cached.modal);
                if (focusable.length > 0) {
                    focusable[0].focus();
                } else {
                    cached.dialog.setAttribute('tabindex', '-1');
                    cached.dialog.focus();
                }
            }
        } else {
            if (state.previousActiveElement && state.previousActiveElement.focus) {
                state.previousActiveElement.focus();
                state.previousActiveElement = null;
            }
            if (cached.dialog && cached.dialog.getAttribute('tabindex') === '-1') {
                cached.dialog.removeAttribute('tabindex');
            }
        }
    }

    // ======================================================
    // PRIVATE LOGIC
    // ======================================================

    function openModal() {
        if (!cached.modal || state.isOpen) return;
        state.isOpen = true;
        cached.modal.classList.add(state.config.openClass);
        setModalAria(true);
        lockBodyScroll();
        manageFocus(true);
        const event = new CustomEvent('asl:modal:open', {
            detail: { modal: cached.modal }
        });
        document.dispatchEvent(event);
    }

    function closeModal() {
        if (!cached.modal || !state.isOpen) return;
        state.isOpen = false;
        cached.modal.classList.remove(state.config.openClass);
        setModalAria(false);
        unlockBodyScroll();
        manageFocus(false);
        const event = new CustomEvent('asl:modal:close', {
            detail: { modal: cached.modal }
        });
        document.dispatchEvent(event);
    }

    function toggleModal() {
        state.isOpen ? closeModal() : openModal();
    }

    function handleOutsideClick(event) {
        if (!state.isOpen || !cached.modal || !state.config.closeOnOutsideClick) return;
        const target = event.target;
        const isInsideDialog = cached.dialog && cached.dialog.contains(target);
        const isModal = cached.modal === target;
        if (isModal && !isInsideDialog) {
            closeModal();
        }
    }

    function handleEscape(event) {
        if (event.key === 'Escape' && state.isOpen && state.config.closeOnEscape) {
            closeModal();
        }
    }

    function handleFocusTrap(event) {
        if (!state.config.trapFocus || !state.isOpen || !cached.dialog) return;
        const focusable = getFocusableElements(cached.dialog);
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
        if (cached.closeButton) {
            const closeHandler = function (event) {
                event.preventDefault();
                closeModal();
            };
            cached.closeButton.addEventListener('click', closeHandler);
            state.eventListeners.push({ element: cached.closeButton, event: 'click', handler: closeHandler });
        }

        if (state.config.closeOnOutsideClick) {
            const outsideHandler = handleOutsideClick.bind(this);
            cached.modal.addEventListener('click', outsideHandler);
            state.eventListeners.push({ element: cached.modal, event: 'click', handler: outsideHandler });
        }

        if (state.config.closeOnEscape) {
            const escapeHandler = handleEscape.bind(this);
            document.addEventListener('keydown', escapeHandler);
            state.eventListeners.push({ element: document, event: 'keydown', handler: escapeHandler });
        }

        if (state.config.trapFocus) {
            const trapHandler = handleFocusTrap.bind(this);
            cached.dialog.addEventListener('keydown', trapHandler);
            state.eventListeners.push({ element: cached.dialog, event: 'keydown', handler: trapHandler });
        }
    }

    function unbindEvents() {
        state.eventListeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        state.eventListeners = [];
    }

    function cacheElements(config) {
        const modal = document.querySelector(config.modalSelector);
        if (!modal) {
          // No modal on this page — silent skip
          return false;
        }
        cached.modal = modal;
        cached.dialog = modal.querySelector(config.dialogSelector) || modal;
        cached.closeButton = modal.querySelector(config.closeButtonSelector) || null;

        // Initial accessibility
        setModalAria(false);
        return true;
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[ASLDS Modal] Already initialized.');
            return this;
        }
        state.config = mergeConfig(userConfig);
                const elementsFound = cacheElements(state.config);
        if (!elementsFound) {
            // No modal on this page — mark initialized to prevent retry
            state.initialized = true;
            return this;
        }
        if (cached.modal.classList.contains(state.config.openClass)) {
            state.isOpen = true;
            setModalAria(true);
            lockBodyScroll();
        } else {
            state.isOpen = false;
            setModalAria(false);
        }
        bindEvents();
        state.initialized = true;
        const event = new CustomEvent('asl:modal:init', {
            detail: { modal: cached.modal }
        });
        document.dispatchEvent(event);
        return this;
    }

    function destroy() {
        if (!state.initialized) return this;
        if (state.isOpen) closeModal();
        unbindEvents();
        unlockBodyScroll();
        cached.modal = null;
        cached.dialog = null;
        cached.closeButton = null;
        state.initialized = false;
        state.isOpen = false;
        state.config = {};
        state.previousActiveElement = null;
        const event = new CustomEvent('asl:modal:destroy');
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
                console.warn('[ASLDS Modal] Not initialized.');
                return this;
            }
            openModal();
            return this;
        },
        close: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Modal] Not initialized.');
                return this;
            }
            closeModal();
            return this;
        },
        toggle: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Modal] Not initialized.');
                return this;
            }
            toggleModal();
            return this;
        },
        getState: function () {
            return {
                isOpen: state.isOpen,
                initialized: state.initialized,
            };
        },
        getElement: function () {
            return cached.modal;
        },
        getDialog: function () {
            return cached.dialog;
        },
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[ASLDS Modal] Not initialized.');
                return this;
            }
            // Only allow runtime config updates for simple flags
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
    window.ASLDS.Modal = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        window.ASLDS.register('Modal', API, 85, []);
    } else {
        console.warn('[ASLDS Modal] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
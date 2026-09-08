/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Module: Playground
Author: A Square L Innovate
Created: 2026

Description:
Interactive playground controller for the ASL Design System
showcase. Handles demo interactions, live previews, and
component demonstrations.

Dependencies:
- Runtime: ASLDS (app.js)

Features:
- Toast demos (success, error, warning, info)
- Modal demo
- Dropdown demo
- Tabs demo
- Interactive component previews
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Playground';
    const VERSION = '1.0.0';

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        toastDemoCount: 0,
        modalOpen: false,
    };

    // ======================================================
    // DEMO FUNCTIONS
    // ======================================================

    /**
     * Demo toast messages
     */
    const DEMO_TOASTS = {
        success: {
            title: '✨ Success!',
            message: 'Your changes have been saved successfully.',
        },
        error: {
            title: '❌ Error',
            message: 'Something went wrong. Please try again.',
        },
        warning: {
            title: '⚠️ Warning',
            message: 'Your session will expire in 5 minutes.',
        },
        info: {
            title: 'ℹ️ Info',
            message: 'New update available. Click here to install.',
        },
        custom: {
            title: '👋 Custom Toast',
            message: 'You can customize the title, message, duration, and position.',
        },
    };

    /**
     * Show a demo toast
     */
    function showDemoToast(type) {
        if (!window.ASLDS || !window.ASLDS.Toast) {
            console.warn('[Playground] Toast module not available.');
            return;
        }

        const data = DEMO_TOASTS[type] || DEMO_TOASTS.info;
        const duration = type === 'custom' ? 5000 : 3500;

        window.ASLDS.Toast.show({
            type: type === 'custom' ? 'info' : type,
            title: data.title,
            message: data.message,
            duration: duration,
            showProgress: true,
            closeButton: true,
        });

        state.toastDemoCount++;
    }

    /**
     * Demo modal
     */
    function showDemoModal() {
        if (!window.ASLDS || !window.ASLDS.Modal) {
            console.warn('[Playground] Modal module not available.');
            return;
        }

        // Check if modal exists
        const modal = document.querySelector('.modal');
        if (!modal) {
            console.warn('[Playground] Modal element not found.');
            return;
        }

        window.ASLDS.Modal.open();
    }

    /**
     * Demo dropdown toggle
     */
    function toggleDemoDropdown(container) {
        if (!window.ASLDS || !window.ASLDS.Dropdown) {
            console.warn('[Playground] Dropdown module not available.');
            return;
        }

        if (!container) {
            container = document.querySelector('.dropdown');
        }

        if (!container) {
            console.warn('[Playground] Dropdown element not found.');
            return;
        }

        window.ASLDS.Dropdown.toggle(container);
    }

    /**
     * Demo tabs - activate a specific tab
     */
    function activateDemoTab(container, index) {
        if (!window.ASLDS || !window.ASLDS.Tabs) {
            console.warn('[Playground] Tabs module not available.');
            return;
        }

        if (!container) {
            container = document.querySelector('.tabs');
        }

        if (!container) {
            console.warn('[Playground] Tabs element not found.');
            return;
        }

        window.ASLDS.Tabs.activateByIndex(container, index, true);
    }

    // ======================================================
    // SETUP FUNCTIONS
    // ======================================================

    /**
     * Setup toast demo buttons
     */
    function setupToastDemos() {
        const demoButtons = document.querySelectorAll('[data-demo-toast]');
        demoButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const type = this.dataset.demoToast;
                showDemoToast(type);
            });
        });
    }

    /**
     * Setup modal demo buttons
     */
    function setupModalDemos() {
        const modalButtons = document.querySelectorAll('[data-demo-modal]');
        modalButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                showDemoModal();
            });
        });

        // Also find any "Open Modal" buttons that aren't data-triggered
        const openModalBtns = document.querySelectorAll('.playground-modal-trigger');
        openModalBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                showDemoModal();
            });
        });
    }

    /**
     * Setup dropdown demo buttons
     */
    function setupDropdownDemos() {
        const dropdownTriggers = document.querySelectorAll('[data-demo-dropdown]');
        dropdownTriggers.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const containerId = this.dataset.demoDropdown;
                const container = containerId
                    ? document.querySelector(containerId)
                    : this.closest('.dropdown');

                if (container) {
                    toggleDemoDropdown(container);
                }
            });
        });

        // Setup static dropdown previews in the component gallery
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.btn, .dropdown-toggle');
            if (toggle && !toggle.dataset.demoDropdown) {
                toggle.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDemoDropdown(dropdown);
                });
            }
        });
    }

    /**
     * Setup tabs demo
     */
    function setupTabsDemos() {
        const tabButtons = document.querySelectorAll('[data-demo-tab]');
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const index = parseInt(this.dataset.demoTab, 10);
                if (!isNaN(index)) {
                    const container = this.closest('.tabs') || document.querySelector('.tabs');
                    if (container) {
                        activateDemoTab(container, index);
                    }
                }
            });
        });

        // Setup gallery tab previews
        const tabContainers = document.querySelectorAll('.tabs.demo-tabs');
        tabContainers.forEach(function (container) {
            const buttons = container.querySelectorAll('.tab, .tab-button');
            buttons.forEach(function (btn, index) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const allButtons = container.querySelectorAll('.tab, .tab-button');
                    const allPanels = container.querySelectorAll('.tab-content');

                    allButtons.forEach(function (b) {
                        b.classList.remove('is-active', 'active');
                    });
                    allPanels.forEach(function (p) {
                        p.classList.remove('is-active', 'active');
                    });

                    btn.classList.add('is-active', 'active');
                    if (allPanels[index]) {
                        allPanels[index].classList.add('is-active', 'active');
                    }
                });
            });
        });
    }

    /**
     * Setup theme toggle integration
     */
    function setupThemeToggle() {
        const themeToggle = document.querySelector('[data-theme-toggle]');
        if (themeToggle && window.ASLDS && window.ASLDS.Theme) {
            // The theme.js already handles this via delegation,
            // but we can also update the button text here if needed
            const updateThemeLabel = function () {
                if (window.ASLDS.Theme.getMode) {
                    const mode = window.ASLDS.Theme.getMode();
                    const labels = {
                        auto: '🌓 Auto',
                        light: '☀️ Light',
                        dark: '🌙 Dark',
                    };
                    if (themeToggle) {
                        themeToggle.textContent = labels[mode] || 'Theme';
                    }
                }
            };

            // Listen for theme changes
            document.addEventListener('theme:mode-changed', updateThemeLabel);
            document.addEventListener('theme:ready', updateThemeLabel);

            // Initial update
            setTimeout(updateThemeLabel, 100);
        }
    }

    /**
     * Setup "Copy Code" buttons (just a placeholder demo)
     */
    function setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.btn-copy, .hero-actions .btn-primary');
        copyButtons.forEach(function (btn) {
            if (btn.textContent.trim() === 'Copy Component' || btn.textContent.trim() === 'Copy Code') {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    // Find the code block in the same card
                    const card = this.closest('.card, .documentation-card');
                    const codeBlock = card ? card.querySelector('pre code') : null;
                    if (codeBlock) {
                        const text = codeBlock.textContent;
                        navigator.clipboard.writeText(text).then(function () {
                            const originalText = btn.textContent;
                            btn.textContent = '✅ Copied!';
                            setTimeout(function () {
                                btn.textContent = originalText;
                            }, 2000);
                        }).catch(function () {
                            // Fallback: select and copy manually
                            const range = document.createRange();
                            range.selectNode(codeBlock);
                            window.getSelection().removeAllRanges();
                            window.getSelection().addRange(range);
                            document.execCommand('copy');
                            const originalText = btn.textContent;
                            btn.textContent = '✅ Copied!';
                            setTimeout(function () {
                                btn.textContent = originalText;
                            }, 2000);
                        });
                    } else {
                        // If no code block, just show feedback
                        const originalText = btn.textContent;
                        btn.textContent = '✅ Copied!';
                        setTimeout(function () {
                            btn.textContent = originalText;
                        }, 2000);
                    }
                });
            }
        });
    }

    /**
     * Setup playground navigation interactions
     */
    function setupNavigationDemos() {
        // Preview navigation links (prevent actual navigation)
        const navLinks = document.querySelectorAll('.nav-menu .nav-link, .quick-link-card');
        navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#') {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            }
        });
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init() {
        if (state.initialized) {
            console.warn('[Playground] Already initialized.');
            return this;
        }

        // Wait for DOM and runtime
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                initPlayground();
            });
        } else {
            initPlayground();
        }

        return this;
    }

    function initPlayground() {
        // Check if runtime is ready
        if (!window.ASLDS) {
            console.warn('[Playground] ASLDS runtime not found. Some demos may not work.');
        }

        setupToastDemos();
        setupModalDemos();
        setupDropdownDemos();
        setupTabsDemos();
        setupThemeToggle();
        setupCopyButtons();
        setupNavigationDemos();

        state.initialized = true;

        const event = new CustomEvent('asl:playground:ready', {
            detail: {
                toasts: state.toastDemoCount,
                modal: state.modalOpen,
            }
        });
        document.dispatchEvent(event);

        console.log('[Playground] Interactive demos initialized.');
    }

    function destroy() {
        if (!state.initialized) return this;

        // Clean up event listeners if needed
        // Most are on page-specific elements that will be cleaned up on page unload

        state.initialized = false;
        state.toastDemoCount = 0;

        const event = new CustomEvent('asl:playground:destroy');
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
         * Show a demo toast
         * @param {string} type - 'success', 'error', 'warning', 'info', 'custom'
         */
        showToast: function (type) {
            showDemoToast(type);
            return this;
        },

        /**
         * Show the demo modal
         */
        showModal: function () {
            showDemoModal();
            return this;
        },

        /**
         * Toggle a demo dropdown
         * @param {HTMLElement} container
         */
        toggleDropdown: function (container) {
            toggleDemoDropdown(container);
            return this;
        },

        /**
         * Activate a demo tab
         * @param {HTMLElement} container
         * @param {number} index
         */
        activateTab: function (container, index) {
            activateDemoTab(container, index);
            return this;
        },

        /**
         * Get playground state
         * @returns {Object}
         */
        getState: function () {
            return {
                initialized: state.initialized,
                toastDemoCount: state.toastDemoCount,
                modalOpen: state.modalOpen,
            };
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Playground = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        // Priority 60 - loads after all components but before page-specific scripts
        window.ASLDS.register('Playground', API, 60, []);
    } else {
        console.warn('[Playground] Runtime not found. Module registered directly on ASLDS namespace.');
        // Auto-init if runtime not present
        API.init();
    }

})(window, document);
/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Tabs
Author: A Square L Innovate
Created: 2026

Description:
Accessible tabs component for organizing content into
switchable panels. Supports keyboard navigation, ARIA
attributes, and multiple independent tab groups on a page.

Dependencies:
- Runtime: ASLDS (app.js)

Usage (automatic):
    The runtime will auto-initialize via ASLDS.register().

Usage (manual):
    ASLDS.Tabs.init({
        tabSelector: '.tabs',
        buttonSelector: '.tab-button',
        panelSelector: '.tab-content',
        activeClass: 'is-active'
    });
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Tabs';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        tabSelector: '.tabs',
        buttonSelector: '.tab-button',
        panelSelector: '.tab-content',
        listSelector: '.tab-list',
        activeClass: 'is-active',
        activateOnInit: true, // activate first tab on init
        keyboardNavigation: true, // enable arrow keys
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        config: {},
        groups: new Map(), // container -> { buttons, panels, eventListeners }
        _idCounter: 0,
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

    function getFocusableButtons(container) {
        const list = container.querySelector(state.config.listSelector);
        if (!list) return [];
        return Array.from(list.querySelectorAll(state.config.buttonSelector));
    }

    function getPanels(container) {
        return Array.from(container.querySelectorAll(state.config.panelSelector));
    }

    // ======================================================
    // ACCESSIBILITY & ARIA
    // ======================================================

    function setupAria(container, buttons, panels) {
        const list = container.querySelector(state.config.listSelector);
        if (list && !list.hasAttribute('role')) {
            list.setAttribute('role', 'tablist');
        }

        buttons.forEach(function (button, index) {
            if (!button.id) {
                button.id = generateId('tab');
            }
            if (!button.hasAttribute('role')) {
                button.setAttribute('role', 'tab');
            }
            // Link button to panel
            let panel = panels[index];
            if (!panel) return;

            if (!panel.id) {
                panel.id = generateId('panel');
            }
            button.setAttribute('aria-controls', panel.id);
            panel.setAttribute('aria-labelledby', button.id);
            panel.setAttribute('role', 'tabpanel');
        });
    }

    function setActiveTab(container, button, buttons, panels, focus) {
        const index = buttons.indexOf(button);
        if (index === -1) return;

        // Deactivate all
        buttons.forEach(function (btn) {
            btn.classList.remove(state.config.activeClass);
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        panels.forEach(function (panel) {
            panel.classList.remove(state.config.activeClass);
        });

        // Activate selected
        button.classList.add(state.config.activeClass);
        button.setAttribute('aria-selected', 'true');
        button.setAttribute('tabindex', '0');

        if (panels[index]) {
            panels[index].classList.add(state.config.activeClass);
        }

        if (focus) {
            button.focus();
        }

        // Emit custom event
        const event = new CustomEvent('asl:tabs:activate', {
            detail: {
                container: container,
                button: button,
                index: index,
                panel: panels[index] || null,
            }
        });
        document.dispatchEvent(event);
    }

    function getActiveTab(container) {
        const buttons = getFocusableButtons(container);
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].getAttribute('aria-selected') === 'true') {
                return buttons[i];
            }
        }
        return null;
    }

    // ======================================================
    // KEYBOARD NAVIGATION
    // ======================================================

    function handleKeydown(event, container) {
        if (!state.config.keyboardNavigation) return;

        const button = event.target.closest(state.config.buttonSelector);
        if (!button) return;

        const buttons = getFocusableButtons(container);
        const currentIndex = buttons.indexOf(button);
        if (currentIndex === -1) return;

        let newIndex = -1;

        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault();
                newIndex = (currentIndex + 1) % buttons.length;
                break;
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = buttons.length - 1;
                break;
            default:
                return;
        }

        if (newIndex !== -1 && buttons[newIndex]) {
            const panels = getPanels(container);
            setActiveTab(container, buttons[newIndex], buttons, panels, true);
        }
    }

    // ======================================================
    // PRIVATE LOGIC
    // ======================================================

    function setupTabGroup(container) {
        const buttons = getFocusableButtons(container);
        const panels = getPanels(container);

        if (buttons.length === 0 || panels.length === 0) {
            console.warn('[ASLDS Tabs] No buttons or panels found in:', container);
            return false;
        }

        if (buttons.length !== panels.length) {
            console.warn(
                '[ASLDS Tabs] Mismatch:',
                buttons.length,
                'buttons vs',
                panels.length,
                'panels in:',
                container
            );
        }

        // Setup ARIA
        setupAria(container, buttons, panels);

        // Activate first tab by default
        if (state.config.activateOnInit) {
            const activeButton = buttons.find(function (btn) {
                return btn.classList.contains(state.config.activeClass);
            });

            if (activeButton) {
                setActiveTab(container, activeButton, buttons, panels, false);
            } else {
                setActiveTab(container, buttons[0], buttons, panels, false);
            }
        } else {
            // Ensure aria-selected matches class state
            buttons.forEach(function (btn, index) {
                const isActive = btn.classList.contains(state.config.activeClass);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.setAttribute('tabindex', isActive ? '0' : '-1');
                if (panels[index]) {
                    panels[index].classList.toggle(state.config.activeClass, isActive);
                }
            });
        }

        // Store group data
        const groupData = {
            buttons: buttons,
            panels: panels,
            listeners: [],
        };

        // Event: Click on tab buttons (delegation on the list)
        const list = container.querySelector(state.config.listSelector);
        if (list) {
            const clickHandler = function (event) {
                const target = event.target.closest(state.config.buttonSelector);
                if (!target) return;
                if (target.closest(state.config.listSelector) !== list) return;

                event.preventDefault();
                const allButtons = getFocusableButtons(container);
                const allPanels = getPanels(container);
                setActiveTab(container, target, allButtons, allPanels, true);
            };
            list.addEventListener('click', clickHandler);
            groupData.listeners.push({ element: list, event: 'click', handler: clickHandler });

            // Event: Keyboard navigation
            const keydownHandler = function (event) {
                handleKeydown(event, container);
            };
            list.addEventListener('keydown', keydownHandler);
            groupData.listeners.push({ element: list, event: 'keydown', handler: keydownHandler });
        } else {
            // Fallback: bind to each button individually if no list wrapper
            buttons.forEach(function (btn) {
                const clickHandler = function (event) {
                    event.preventDefault();
                    const allButtons = getFocusableButtons(container);
                    const allPanels = getPanels(container);
                    setActiveTab(container, btn, allButtons, allPanels, true);
                };
                btn.addEventListener('click', clickHandler);
                groupData.listeners.push({ element: btn, event: 'click', handler: clickHandler });

                const keydownHandler = function (event) {
                    handleKeydown(event, container);
                };
                btn.addEventListener('keydown', keydownHandler);
                groupData.listeners.push({ element: btn, event: 'keydown', handler: keydownHandler });
            });
        }

        state.groups.set(container, groupData);
        return true;
    }

    function destroyTabGroup(container) {
        const groupData = state.groups.get(container);
        if (!groupData) return;

        groupData.listeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });

        // Optional: remove ARIA attributes? Not necessary, but we can leave them.
        state.groups.delete(container);
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[ASLDS Tabs] Already initialized.');
            return this;
        }

        state.config = mergeConfig(userConfig);

        const containers = document.querySelectorAll(state.config.tabSelector);
        if (containers.length === 0) {
            console.warn('[ASLDS Tabs] No tab containers found with selector:', state.config.tabSelector);
            state.initialized = true;
            return this;
        }

        containers.forEach(function (container) {
            setupTabGroup(container);
        });

        state.initialized = true;

        const event = new CustomEvent('asl:tabs:init', {
            detail: { count: state.groups.size }
        });
        document.dispatchEvent(event);

        return this;
    }

    function destroy() {
        if (!state.initialized) return this;

        const containers = Array.from(state.groups.keys());
        containers.forEach(function (container) {
            destroyTabGroup(container);
        });

        state.groups.clear();
        state.initialized = false;
        state.config = {};

        const event = new CustomEvent('asl:tabs:destroy');
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
         * Activate a tab by index
         * @param {HTMLElement} container - The .tabs container
         * @param {number} index - 0-based index
         * @param {boolean} focus - Whether to focus the button
         */
        activateByIndex: function (container, index, focus) {
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Tabs] Container not initialized:', container);
                return this;
            }

            const buttons = getFocusableButtons(container);
            const panels = getPanels(container);
            if (index < 0 || index >= buttons.length) {
                console.warn('[ASLDS Tabs] Index out of range:', index);
                return this;
            }

            setActiveTab(container, buttons[index], buttons, panels, focus);
            return this;
        },

        /**
         * Get the currently active tab button
         * @param {HTMLElement} container
         * @returns {HTMLElement|null}
         */
        getActiveTab: function (container) {
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Tabs] Container not initialized.');
                return null;
            }
            return getActiveTab(container);
        },

        /**
         * Get all tab buttons in a container
         * @param {HTMLElement} container
         * @returns {HTMLElement[]}
         */
        getTabs: function (container) {
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Tabs] Container not initialized.');
                return [];
            }
            return getFocusableButtons(container);
        },

        /**
         * Get all tab panels in a container
         * @param {HTMLElement} container
         * @returns {HTMLElement[]}
         */
        getPanels: function (container) {
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Tabs] Container not initialized.');
                return [];
            }
            return getPanels(container);
        },

        /**
         * Get state for a specific container
         * @param {HTMLElement} container
         * @returns {Object|null}
         */
        getState: function (container) {
            if (!container || !state.groups.has(container)) {
                return null;
            }
            const buttons = getFocusableButtons(container);
            const panels = getPanels(container);
            const activeButton = getActiveTab(container);
            return {
                initialized: state.initialized,
                tabCount: buttons.length,
                panelCount: panels.length,
                activeIndex: activeButton ? buttons.indexOf(activeButton) : -1,
                container: container,
            };
        },

        /**
         * Update configuration (limited runtime options)
         * @param {Object} newConfig
         */
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[ASLDS Tabs] Not initialized.');
                return this;
            }
            if (newConfig.keyboardNavigation !== undefined) {
                state.config.keyboardNavigation = !!newConfig.keyboardNavigation;
            }
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Tabs = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        window.ASLDS.register('Tabs', API, 80, []);
    } else {
        console.warn('[ASLDS Tabs] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
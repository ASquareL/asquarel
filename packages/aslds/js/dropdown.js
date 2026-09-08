/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Dropdown
Author: A Square L Innovate
Created: 2026

Description:
Accessible dropdown component for menus, actions, filters,
and navigation. Supports keyboard navigation, click-outside
to close, and multiple independent dropdowns on a page.

Dependencies:
- Runtime: ASLDS (app.js)

Usage (automatic):
    The runtime will auto-initialize via ASLDS.register().

Usage (manual):
    ASLDS.Dropdown.init({
        dropdownSelector: '.dropdown',
        toggleSelector: '.dropdown-toggle',
        menuSelector: '.dropdown-menu',
        openClass: 'is-open',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnItemClick: false
    });
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Dropdown';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        dropdownSelector: '.dropdown',
        toggleSelector: '.dropdown-toggle',
        menuSelector: '.dropdown-menu',
        itemSelector: '.dropdown-link, .dropdown-item',
        openClass: 'is-open',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        closeOnItemClick: false,
        focusOnOpen: true,
        trapFocus: false, // optional, if true traps focus inside menu
    };

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        config: {},
        groups: new Map(), // container -> { toggle, menu, items, isOpen, listeners }
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

    function getFocusableElements(container) {
        const menu = container.querySelector(state.config.menuSelector);
        if (!menu) return [];
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(menu.querySelectorAll(selector));
    }

    function getVisibleMenus() {
        const result = [];
        state.groups.forEach(function (group, container) {
            if (group.isOpen) {
                result.push(container);
            }
        });
        return result;
    }

    // ======================================================
    // ACCESSIBILITY & ARIA
    // ======================================================

    function setupAria(container, toggle, menu) {
        // Setup toggle
        if (toggle) {
            if (!toggle.id) {
                toggle.id = generateId('dropdown-toggle');
            }
            toggle.setAttribute('aria-haspopup', 'true');
            toggle.setAttribute('aria-expanded', 'false');
        }

        // Setup menu
        if (menu) {
            if (!menu.id) {
                menu.id = generateId('dropdown-menu');
            }
            menu.setAttribute('role', 'menu');
            menu.setAttribute('aria-labelledby', toggle ? toggle.id : '');

            // Setup items
            const items = menu.querySelectorAll(state.config.itemSelector);
            items.forEach(function (item) {
                item.setAttribute('role', 'menuitem');
                if (item.tagName === 'A' && !item.getAttribute('tabindex')) {
                    item.setAttribute('tabindex', '-1');
                }
            });
        }

        // Link toggle to menu
        if (toggle && menu) {
            toggle.setAttribute('aria-controls', menu.id);
        }
    }

    function updateAria(container, isOpen) {
        const group = state.groups.get(container);
        if (!group) return;

        if (group.toggle) {
            group.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        if (group.menu) {
            group.menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        }
    }

    // ======================================================
    // PRIVATE LOGIC
    // ======================================================

    function openDropdown(container, focus) {
        const group = state.groups.get(container);
        if (!group || group.isOpen) return;

        // Close all other open dropdowns
        closeAllDropdowns(container);

        group.isOpen = true;
        container.classList.add(state.config.openClass);
        updateAria(container, true);

        // Focus management
        if (state.config.focusOnOpen && focus !== false) {
            const focusable = getFocusableElements(container);
            if (focusable.length > 0) {
                focusable[0].focus();
            } else if (group.menu) {
                group.menu.setAttribute('tabindex', '-1');
                group.menu.focus();
            }
        }

        const event = new CustomEvent('asl:dropdown:open', {
            detail: { container: container, toggle: group.toggle }
        });
        document.dispatchEvent(event);
    }

    function closeDropdown(container) {
        const group = state.groups.get(container);
        if (!group || !group.isOpen) return;

        group.isOpen = false;
        container.classList.remove(state.config.openClass);
        updateAria(container, false);

        // Return focus to toggle if it was focused
        if (group.toggle && document.activeElement && group.menu && group.menu.contains(document.activeElement)) {
            group.toggle.focus();
        }

        const event = new CustomEvent('asl:dropdown:close', {
            detail: { container: container, toggle: group.toggle }
        });
        document.dispatchEvent(event);
    }

    function toggleDropdown(container) {
        const group = state.groups.get(container);
        if (!group) return;

        if (group.isOpen) {
            closeDropdown(container);
        } else {
            openDropdown(container);
        }
    }

    function closeAllDropdowns(excludeContainer) {
        state.groups.forEach(function (group, container) {
            if (excludeContainer && container === excludeContainer) return;
            if (group.isOpen) {
                closeDropdown(container);
            }
        });
    }

    function handleToggleClick(event, container) {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(container);
    }

    function handleOutsideClick(event) {
        if (!state.config.closeOnOutsideClick) return;

        const target = event.target;
        state.groups.forEach(function (group, container) {
            if (!group.isOpen) return;
            // Check if click is inside the dropdown container
            const isInside = container.contains(target);
            if (!isInside) {
                closeDropdown(container);
            }
        });
    }

    function handleEscape(event) {
        if (event.key !== 'Escape' || !state.config.closeOnEscape) return;
        const openMenus = getVisibleMenus();
        if (openMenus.length === 0) return;
        // Close all open dropdowns
        openMenus.forEach(function (container) {
            closeDropdown(container);
        });
    }

    function handleItemClick(event, container) {
        if (!state.config.closeOnItemClick) return;
        const group = state.groups.get(container);
        if (!group || !group.isOpen) return;
        // Close after a brief delay to allow the click event to complete
        setTimeout(function () {
            closeDropdown(container);
        }, 50);
    }

    function handleFocusTrap(event) {
        if (!state.config.trapFocus) return;
        // Find the open dropdown containing the target
        let targetContainer = null;
        state.groups.forEach(function (group, container) {
            if (group.isOpen && container.contains(event.target)) {
                targetContainer = container;
            }
        });
        if (!targetContainer) return;

        const focusable = getFocusableElements(targetContainer);
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

    function setupDropdownGroup(container) {
        const toggle = container.querySelector(state.config.toggleSelector);
        const menu = container.querySelector(state.config.menuSelector);

        if (!toggle || !menu) {
            console.warn('[ASLDS Dropdown] Missing toggle or menu in:', container);
            return false;
        }

        const group = {
            toggle: toggle,
            menu: menu,
            isOpen: container.classList.contains(state.config.openClass),
            listeners: [],
        };

        // Setup ARIA
        setupAria(container, toggle, menu);

        // Update initial state
        updateAria(container, group.isOpen);

        // Bind events
        const clickHandler = function (event) {
            handleToggleClick(event, container);
        };
        toggle.addEventListener('click', clickHandler);
        group.listeners.push({ element: toggle, event: 'click', handler: clickHandler });

        // Item click to close
        const items = menu.querySelectorAll(state.config.itemSelector);
        items.forEach(function (item) {
            const itemClickHandler = function (event) {
                handleItemClick(event, container);
            };
            item.addEventListener('click', itemClickHandler);
            group.listeners.push({ element: item, event: 'click', handler: itemClickHandler });
        });

        // Keyboard navigation on menu items (Arrow keys, Home, End)
        const keydownHandler = function (event) {
            handleMenuKeydown(event, container);
        };
        menu.addEventListener('keydown', keydownHandler);
        group.listeners.push({ element: menu, event: 'keydown', handler: keydownHandler });

        state.groups.set(container, group);
        return true;
    }

    function handleMenuKeydown(event, container) {
        const group = state.groups.get(container);
        if (!group || !group.isOpen) return;

        const items = Array.from(group.menu.querySelectorAll(state.config.itemSelector));
        if (items.length === 0) return;

        const currentIndex = items.indexOf(document.activeElement);
        let newIndex = -1;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                newIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
                event.preventDefault();
                newIndex = (currentIndex - 1 + items.length) % items.length;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = items.length - 1;
                break;
            default:
                return;
        }

        if (newIndex !== -1 && items[newIndex]) {
            items[newIndex].focus();
        }
    }

    function destroyDropdownGroup(container) {
        const group = state.groups.get(container);
        if (!group) return;

        // Close if open
        if (group.isOpen) {
            closeDropdown(container);
        }

        // Remove event listeners
        group.listeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });

        state.groups.delete(container);
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[ASLDS Dropdown] Already initialized.');
            return this;
        }

        state.config = mergeConfig(userConfig);

        const containers = document.querySelectorAll(state.config.dropdownSelector);
        if (containers.length === 0) {
            console.warn('[ASLDS Dropdown] No dropdown containers found with selector:', state.config.dropdownSelector);
            state.initialized = true;
            return this;
        }

        containers.forEach(function (container) {
            setupDropdownGroup(container);
        });

        // Global listeners (outside click, escape)
        const outsideHandler = handleOutsideClick.bind(this);
        document.addEventListener('click', outsideHandler);
        // Store for cleanup
        state._globalListeners = state._globalListeners || [];
        state._globalListeners.push({ element: document, event: 'click', handler: outsideHandler });

        const escapeHandler = handleEscape.bind(this);
        document.addEventListener('keydown', escapeHandler);
        state._globalListeners.push({ element: document, event: 'keydown', handler: escapeHandler });

        if (state.config.trapFocus) {
            const trapHandler = handleFocusTrap.bind(this);
            document.addEventListener('keydown', trapHandler);
            state._globalListeners.push({ element: document, event: 'keydown', handler: trapHandler });
        }

        state.initialized = true;

        const event = new CustomEvent('asl:dropdown:init', {
            detail: { count: state.groups.size }
        });
        document.dispatchEvent(event);

        return this;
    }

    function destroy() {
        if (!state.initialized) return this;

        // Destroy all groups
        const containers = Array.from(state.groups.keys());
        containers.forEach(function (container) {
            destroyDropdownGroup(container);
        });

        // Remove global listeners
        if (state._globalListeners) {
            state._globalListeners.forEach(function (listener) {
                listener.element.removeEventListener(listener.event, listener.handler);
            });
            state._globalListeners = [];
        }

        state.groups.clear();
        state.initialized = false;
        state.config = {};

        const event = new CustomEvent('asl:dropdown:destroy');
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
         * Open a dropdown by container element
         * @param {HTMLElement} container - The .dropdown container
         * @param {boolean} focus - Whether to focus the first item
         */
        open: function (container, focus) {
            if (!state.initialized) {
                console.warn('[ASLDS Dropdown] Not initialized.');
                return this;
            }
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Dropdown] Container not found:', container);
                return this;
            }
            openDropdown(container, focus);
            return this;
        },

        /**
         * Close a dropdown by container element
         * @param {HTMLElement} container - The .dropdown container
         */
        close: function (container) {
            if (!state.initialized) {
                console.warn('[ASLDS Dropdown] Not initialized.');
                return this;
            }
            if (!container) {
                // Close all
                closeAllDropdowns();
                return this;
            }
            if (!state.groups.has(container)) {
                console.warn('[ASLDS Dropdown] Container not found:', container);
                return this;
            }
            closeDropdown(container);
            return this;
        },

        /**
         * Toggle a dropdown by container element
         * @param {HTMLElement} container - The .dropdown container
         */
        toggle: function (container) {
            if (!state.initialized) {
                console.warn('[ASLDS Dropdown] Not initialized.');
                return this;
            }
            if (!container || !state.groups.has(container)) {
                console.warn('[ASLDS Dropdown] Container not found:', container);
                return this;
            }
            toggleDropdown(container);
            return this;
        },

        /**
         * Close all open dropdowns
         */
        closeAll: function () {
            if (!state.initialized) {
                console.warn('[ASLDS Dropdown] Not initialized.');
                return this;
            }
            closeAllDropdowns();
            return this;
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
            const group = state.groups.get(container);
            return {
                isOpen: group.isOpen,
                initialized: state.initialized,
                container: container,
                toggle: group.toggle,
                menu: group.menu,
            };
        },

        /**
         * Get all registered dropdown containers
         * @returns {HTMLElement[]}
         */
        getContainers: function () {
            return Array.from(state.groups.keys());
        },

        /**
         * Get the toggle button for a container
         * @param {HTMLElement} container
         * @returns {HTMLElement|null}
         */
        getToggle: function (container) {
            if (!container || !state.groups.has(container)) return null;
            return state.groups.get(container).toggle;
        },

        /**
         * Get the menu for a container
         * @param {HTMLElement} container
         * @returns {HTMLElement|null}
         */
        getMenu: function (container) {
            if (!container || !state.groups.has(container)) return null;
            return state.groups.get(container).menu;
        },

        /**
         * Update configuration (limited runtime options)
         * @param {Object} newConfig
         */
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[ASLDS Dropdown] Not initialized.');
                return this;
            }
            if (newConfig.closeOnOutsideClick !== undefined) {
                state.config.closeOnOutsideClick = !!newConfig.closeOnOutsideClick;
            }
            if (newConfig.closeOnEscape !== undefined) {
                state.config.closeOnEscape = !!newConfig.closeOnEscape;
            }
            if (newConfig.closeOnItemClick !== undefined) {
                state.config.closeOnItemClick = !!newConfig.closeOnItemClick;
            }
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Dropdown = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        window.ASLDS.register('Dropdown', API, 75, []);
    } else {
        console.warn('[ASLDS Dropdown] Runtime not found. Module registered directly on ASLDS namespace.');
    }

})(window, document);
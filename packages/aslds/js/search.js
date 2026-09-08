/*
==========================================================
A SQUARE L INNOVATE DESIGN SYSTEM (ASLDS)
Version: 1.0.0
Component: Search
Author: A Square L Innovate
Created: 2026

Description:
Full-featured search system for documentation and
applications. Opens a search overlay with live filtering,
keyboard navigation, and shortcut support (Ctrl+K / Cmd+K).

Dependencies:
- Runtime: ASLDS (app.js)

Features:
- Click .nav-search or press Ctrl+K to open
- Live filtering of search index
- Keyboard navigation (↑/↓ to navigate, Enter to select)
- Escape to close
- Auto-focus on open
- Result highlighting
- Configurable search index

Usage:
    // Automatic: the runtime will initialize via ASLDS.register()
    // Manual: ASLDS.Search.init()
==========================================================
*/

(function (window, document, undefined) {
    'use strict';

    // ======================================================
    // MODULE METADATA
    // ======================================================

    const MODULE_NAME = 'Search';
    const VERSION = '1.0.0';

    // ======================================================
    // DEFAULT CONFIGURATION
    // ======================================================

    const defaults = {
        searchButtonSelector: '.nav-search',
        overlayClass: 'search-overlay',
        inputSelector: '#search-input',
        resultsSelector: '#search-results',
        resultItemSelector: '.search-result-item',
        activeClass: 'is-active',
        highlightClass: 'search-highlight',
        shortcutKey: 'k', // Ctrl+K or Cmd+K
        maxResults: 10,
        placeholder: 'Search documentation...',
        noResultsText: 'No results found',
        openOnLoad: false,
        closeOnEscape: true,
        closeOnOutsideClick: true,
    };

    // ======================================================
    // SEARCH INDEX
    // ======================================================

    const searchIndex = [
        // Foundations
        { title: 'Colors', url: '../foundations/colors.html', category: 'Foundations', keywords: 'color palette theme primary secondary' },
        { title: 'Typography', url: '../foundations/typography.html', category: 'Foundations', keywords: 'font text type size weight' },
        { title: 'Spacing', url: '../foundations/spacing.html', category: 'Foundations', keywords: 'margin padding space layout grid' },
        { title: 'Layout', url: '../foundations/layout.html', category: 'Foundations', keywords: 'container grid flexbox alignment' },
        { title: 'Shadows', url: '../foundations/shadows.html', category: 'Foundations', keywords: 'shadow elevation depth box-shadow' },
        { title: 'Borders', url: '../foundations/borders.html', category: 'Foundations', keywords: 'border radius rounded outline' },
        { title: 'Icons', url: '../foundations/icons.html', category: 'Foundations', keywords: 'icon symbol svg glyph' },
        { title: 'Animations', url: '../foundations/animations.html', category: 'Foundations', keywords: 'animation transition motion keyframes' },

        // Components
        { title: 'Buttons', url: '../components/buttons.html', category: 'Components', keywords: 'button click action primary secondary outline' },
        { title: 'Cards', url: '../components/cards.html', category: 'Components', keywords: 'card container panel widget' },
        { title: 'Forms', url: '../components/forms.html', category: 'Components', keywords: 'form input select checkbox validation' },
        { title: 'Navbar', url: '../components/navbar.html', category: 'Components', keywords: 'navbar navigation header menu' },
        { title: 'Sidebar', url: '../components/sidebar.html', category: 'Components', keywords: 'sidebar navigation drawer menu' },
        { title: 'Dashboard', url: '../components/dashboard.html', category: 'Components', keywords: 'dashboard analytics stats metrics' },
        { title: 'Alerts', url: '../components/alerts.html', category: 'Components', keywords: 'alert notification message feedback' },
        { title: 'Badges', url: '../components/badges.html', category: 'Components', keywords: 'badge label tag status' },
        { title: 'Progress', url: '../components/progress.html', category: 'Components', keywords: 'progress bar loading indicator' },
        { title: 'Avatars', url: '../components/avatars.html', category: 'Components', keywords: 'avatar profile user image' },
        { title: 'Dropdowns', url: '../components/dropdowns.html', category: 'Components', keywords: 'dropdown menu select options' },
        { title: 'Modals', url: '../components/modals.html', category: 'Components', keywords: 'modal dialog overlay popup' },
        { title: 'Tables', url: '../components/tables.html', category: 'Components', keywords: 'table data grid rows columns' },
        { title: 'Tabs', url: '../components/tabs.html', category: 'Components', keywords: 'tabs navigation panel switch' },
        { title: 'Toasts', url: '../components/toast.html', category: 'Components', keywords: 'toast notification alert message' },
        { title: 'Footer', url: '../components/footer.html', category: 'Components', keywords: 'footer copyright links' },

        // Guides
        { title: 'Getting Started', url: '../getting-started.html', category: 'Guides', keywords: 'start install setup guide' },
        { title: 'Installation', url: '../installation.html', category: 'Guides', keywords: 'install setup download npm' },
        { title: 'Playground', url: '../playground.html', category: 'Guides', keywords: 'playground demo preview interact' },
        { title: 'Accessibility', url: '../guides/accessibility.html', category: 'Guides', keywords: 'accessibility a11y aria keyboard' },
        { title: 'Engineering', url: '../guides/engineering.html', category: 'Guides', keywords: 'engineering architecture standards' },
        { title: 'Roadmap', url: '../guides/roadmap.html', category: 'Guides', keywords: 'roadmap future plan milestone' },
        { title: 'Changelog', url: '../guides/changelog.html', category: 'Guides', keywords: 'changelog release version history' },
    ];

    // ======================================================
    // STATE
    // ======================================================

    let state = {
        initialized: false,
        config: {},
        isOpen: false,
        currentResults: [],
        selectedIndex: -1,
        overlay: null,
        input: null,
        resultsContainer: null,
        eventListeners: [],
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

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getBaseUrl() {
        // Determine the base URL for the documentation
        const path = window.location.pathname;
        if (path.includes('/components/') || path.includes('/foundations/') || path.includes('/guides/')) {
            return '..';
        }
        return '.';
    }

    // ======================================================
    // SEARCH LOGIC
    // ======================================================

    function performSearch(query) {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const terms = query.toLowerCase().trim().split(/\s+/);
        const results = [];

        searchIndex.forEach(function (item) {
            let score = 0;
            const searchable = (item.title + ' ' + item.keywords + ' ' + item.category).toLowerCase();

            terms.forEach(function (term) {
                if (searchable.includes(term)) {
                    score += 1;
                }
                // Boost score for title matches
                if (item.title.toLowerCase().includes(term)) {
                    score += 2;
                }
                // Boost score for exact start matches
                if (item.title.toLowerCase().startsWith(term)) {
                    score += 3;
                }
            });

            if (score > 0) {
                results.push({
                    ...item,
                    score: score,
                });
            }
        });

        // Sort by score (highest first)
        results.sort(function (a, b) {
            return b.score - a.score;
        });

        // Limit results
        return results.slice(0, state.config.maxResults);
    }

    function highlightText(text, query) {
        if (!query || !query.trim()) return escapeHtml(text);
        const terms = query.trim().split(/\s+/);
        let result = escapeHtml(text);
        terms.forEach(function (term) {
            const regex = new RegExp('(' + escapeHtml(term) + ')', 'gi');
            result = result.replace(regex, '<span class="' + state.config.highlightClass + '">$1</span>');
        });
        return result;
    }

    // ======================================================
    // OVERLAY DOM CREATION
    // ======================================================

    function createOverlay() {
        // Check if overlay already exists
        let overlay = document.querySelector('.' + state.config.overlayClass);
        if (overlay) {
            return overlay;
        }

        overlay = document.createElement('div');
        overlay.className = state.config.overlayClass;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Search');

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'search-backdrop';
        overlay.appendChild(backdrop);

        // Modal
        const modal = document.createElement('div');
        modal.className = 'search-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'search-header';

        const icon = document.createElement('span');
        icon.className = 'search-icon';
        icon.textContent = '🔍';
        header.appendChild(icon);

        const input = document.createElement('input');
        input.id = state.config.inputSelector.replace('#', '');
        input.type = 'text';
        input.className = 'search-input';
        input.placeholder = state.config.placeholder;
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
        header.appendChild(input);

        const shortcutHint = document.createElement('span');
        shortcutHint.className = 'search-shortcut';
        shortcutHint.textContent = 'Esc';
        header.appendChild(shortcutHint);

        modal.appendChild(header);

        // Results container
        const resultsContainer = document.createElement('div');
        resultsContainer.id = state.config.resultsSelector.replace('#', '');
        resultsContainer.className = 'search-results';
        modal.appendChild(resultsContainer);

        // No results message (hidden by default)
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.textContent = state.config.noResultsText;
        noResults.style.display = 'none';
        resultsContainer.appendChild(noResults);

        overlay.appendChild(modal);

        // Append to body
        document.body.appendChild(overlay);

        // Store references
        state.overlay = overlay;
        state.input = input;
        state.resultsContainer = resultsContainer;

        // Bind events
        bindOverlayEvents(overlay, input, resultsContainer);

        return overlay;
    }

    // ======================================================
    // OVERLAY EVENTS
    // ======================================================

    function bindOverlayEvents(overlay, input, resultsContainer) {
        // Close on backdrop click
        const backdrop = overlay.querySelector('.search-backdrop');
        if (backdrop) {
            const backdropHandler = function (e) {
                if (e.target === backdrop && state.config.closeOnOutsideClick) {
                    closeSearch();
                }
            };
            backdrop.addEventListener('click', backdropHandler);
            state.eventListeners.push({ element: backdrop, event: 'click', handler: backdropHandler });
        }

        // Input events
        const inputHandler = function (e) {
            const query = this.value;
            const results = performSearch(query);
            state.currentResults = results;
            renderResults(results, query);
            state.selectedIndex = -1;
            if (results.length === 0 && query.trim().length > 0) {
                const noResults = resultsContainer.querySelector('.search-no-results');
                if (noResults) {
                    noResults.style.display = 'block';
                }
            } else {
                const noResults = resultsContainer.querySelector('.search-no-results');
                if (noResults) {
                    noResults.style.display = 'none';
                }
            }
        };
        input.addEventListener('input', inputHandler);
        state.eventListeners.push({ element: input, event: 'input', handler: inputHandler });

        // Keyboard events on input
        const keydownHandler = function (e) {
            const results = resultsContainer.querySelectorAll('.' + state.config.resultItemSelector);
            if (results.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    state.selectedIndex = Math.min(state.selectedIndex + 1, results.length - 1);
                    updateSelectedResult(results);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    state.selectedIndex = Math.max(state.selectedIndex - 1, 0);
                    updateSelectedResult(results);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (state.selectedIndex >= 0 && state.selectedIndex < results.length) {
                        const selected = results[state.selectedIndex];
                        const url = selected.dataset.url;
                        if (url) {
                            window.location.href = url;
                        }
                    } else if (results.length > 0) {
                        // If no selection, go to first result
                        const first = results[0];
                        const url = first.dataset.url;
                        if (url) {
                            window.location.href = url;
                        }
                    }
                    break;
            }
        };
        input.addEventListener('keydown', keydownHandler);
        state.eventListeners.push({ element: input, event: 'keydown', handler: keydownHandler });
    }

    function updateSelectedResult(results) {
        results.forEach(function (el, index) {
            if (index === state.selectedIndex) {
                el.classList.add(state.config.activeClass);
                el.scrollIntoView({ block: 'nearest' });
            } else {
                el.classList.remove(state.config.activeClass);
            }
        });
    }

    // ======================================================
    // RENDER RESULTS
    // ======================================================

    function renderResults(results, query) {
        const container = state.resultsContainer;
        if (!container) return;

        // Remove old result items (keep no-results)
        const items = container.querySelectorAll('.' + state.config.resultItemSelector);
        items.forEach(function (el) {
            el.remove();
        });

        const noResults = container.querySelector('.search-no-results');
        if (noResults) {
            noResults.style.display = results.length === 0 && query && query.trim().length > 0 ? 'block' : 'none';
        }

        if (results.length === 0) return;

        results.forEach(function (item) {
            const div = document.createElement('div');
            div.className = state.config.resultItemSelector;
            div.dataset.url = item.url;

            const title = document.createElement('div');
            title.className = 'search-result-title';
            title.innerHTML = highlightText(item.title, query);
            div.appendChild(title);

            const meta = document.createElement('div');
            meta.className = 'search-result-meta';
            meta.innerHTML = '<span class="search-result-category">' + escapeHtml(item.category) + '</span>';
            if (item.keywords) {
                const keywords = document.createElement('span');
                keywords.className = 'search-result-keywords';
                keywords.textContent = item.keywords.split(' ').slice(0, 3).join(' ');
                meta.appendChild(keywords);
            }
            div.appendChild(meta);

            // Click handler
            div.addEventListener('click', function () {
                if (item.url) {
                    window.location.href = item.url;
                }
            });

            container.appendChild(div);
        });
    }

    // ======================================================
    // SEARCH CONTROLS
    // ======================================================

    function openSearch() {
        if (state.isOpen) return;

        const overlay = createOverlay();
        state.isOpen = true;
        overlay.classList.add(state.config.activeClass);
        document.body.classList.add('search-open');

        // Focus input after a small delay
        setTimeout(function () {
            if (state.input) {
                state.input.focus();
                state.input.select();
            }
        }, 100);

        const event = new CustomEvent('asl:search:open');
        document.dispatchEvent(event);
    }

    function closeSearch() {
        if (!state.isOpen) return;

        const overlay = document.querySelector('.' + state.config.overlayClass);
        if (overlay) {
            overlay.classList.remove(state.config.activeClass);
        }
        document.body.classList.remove('search-open');

        state.isOpen = false;
        state.currentResults = [];
        state.selectedIndex = -1;

        // Clear input and results
        if (state.input) {
            state.input.value = '';
        }
        if (state.resultsContainer) {
            const items = state.resultsContainer.querySelectorAll('.' + state.config.resultItemSelector);
            items.forEach(function (el) {
                el.remove();
            });
            const noResults = state.resultsContainer.querySelector('.search-no-results');
            if (noResults) {
                noResults.style.display = 'none';
            }
        }

        // Return focus to search button
        const searchBtn = document.querySelector(state.config.searchButtonSelector);
        if (searchBtn) {
            searchBtn.focus();
        }

        const event = new CustomEvent('asl:search:close');
        document.dispatchEvent(event);
    }

    function toggleSearch() {
        if (state.isOpen) {
            closeSearch();
        } else {
            openSearch();
        }
    }

    // ======================================================
    // INJECT STYLES
    // ======================================================

    function injectStyles() {
        if (document.getElementById('aslds-search-styles')) return;

        const style = document.createElement('style');
        style.id = 'aslds-search-styles';
        style.textContent = `
            /* ================================================
               SEARCH OVERLAY
            ================================================ */

            .search-overlay {
                position: fixed;
                inset: 0;
                z-index: var(--z-modal, 1050);
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding: 80px 24px 24px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }

            .search-overlay.is-active {
                opacity: 1;
                visibility: visible;
            }

            .search-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.72);
                backdrop-filter: blur(8px);
                cursor: pointer;
            }

            /* ================================================
               SEARCH MODAL
            ================================================ */

            .search-modal {
                position: relative;
                width: 100%;
                max-width: 640px;
                max-height: 70vh;
                background: var(--card-bg, #111111);
                border: 1px solid var(--border-color, #222222);
                border-radius: var(--radius-xl, 24px);
                box-shadow: var(--shadow-lg, 0 15px 40px rgba(0,0,0,0.35));
                overflow: hidden;
                transform: translateY(-20px) scale(0.96);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                flex-direction: column;
            }

            .search-overlay.is-active .search-modal {
                transform: translateY(0) scale(1);
            }

            /* ================================================
               SEARCH HEADER
            ================================================ */

            .search-header {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 18px 24px;
                border-bottom: 1px solid var(--border-color, #222222);
            }

            .search-icon {
                font-size: 20px;
                color: var(--gray-400, #B3B3B3);
                flex-shrink: 0;
            }

            .search-input {
                flex: 1;
                border: none;
                background: transparent;
                color: var(--white, #FFFFFF);
                font-size: 18px;
                font-weight: 500;
                outline: none;
                min-width: 0;
                font-family: var(--font-family, 'Nunito', sans-serif);
            }

            .search-input::placeholder {
                color: var(--gray-500, #999999);
                font-weight: 400;
            }

            .search-shortcut {
                flex-shrink: 0;
                padding: 4px 10px;
                border-radius: var(--radius-sm, 8px);
                background: rgba(255, 255, 255, 0.06);
                color: var(--gray-400, #B3B3B3);
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            /* ================================================
               SEARCH RESULTS
            ================================================ */

            .search-results {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
                max-height: 50vh;
            }

            .search-results::-webkit-scrollbar {
                width: 6px;
            }

            .search-results::-webkit-scrollbar-track {
                background: transparent;
            }

            .search-results::-webkit-scrollbar-thumb {
                background: rgba(212, 175, 55, 0.3);
                border-radius: 999px;
            }

            .search-results::-webkit-scrollbar-thumb:hover {
                background: var(--primary-gold, #D4AF37);
            }

            /* ================================================
               RESULT ITEM
            ================================================ */

            .search-result-item {
                display: block;
                padding: 14px 24px;
                cursor: pointer;
                transition: background 0.15s ease;
                border-left: 3px solid transparent;
            }

            .search-result-item:hover,
            .search-result-item.is-active {
                background: rgba(212, 175, 55, 0.08);
                border-left-color: var(--primary-gold, #D4AF37);
            }

            .search-result-title {
                font-size: 16px;
                font-weight: 600;
                color: var(--white, #FFFFFF);
                margin-bottom: 4px;
            }

            .search-result-title .search-highlight {
                color: var(--primary-gold, #D4AF37);
                font-weight: 700;
            }

            .search-result-meta {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 13px;
                color: var(--gray-500, #999999);
            }

            .search-result-category {
                display: inline-block;
                padding: 2px 10px;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.06);
                font-size: 11px;
                font-weight: 600;
                color: var(--gray-400, #B3B3B3);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .search-result-keywords {
                color: var(--gray-500, #999999);
                font-size: 12px;
            }

            /* ================================================
               NO RESULTS
            ================================================ */

            .search-no-results {
                padding: 40px 24px;
                text-align: center;
                color: var(--gray-400, #B3B3B3);
                font-size: 16px;
            }

            /* ================================================
               BODY STATE
            ================================================ */

            body.search-open {
                overflow: hidden;
            }

            /* ================================================
               RESPONSIVE
            ================================================ */

            @media (max-width: 768px) {
                .search-overlay {
                    padding: 60px 16px 16px;
                    align-items: flex-start;
                }

                .search-modal {
                    max-height: 80vh;
                    border-radius: var(--radius-lg, 18px);
                }

                .search-header {
                    padding: 14px 18px;
                }

                .search-input {
                    font-size: 16px;
                }

                .search-result-item {
                    padding: 12px 18px;
                }

                .search-result-title {
                    font-size: 14px;
                }

                .search-shortcut {
                    display: none;
                }

                .search-overlay {
                    padding-top: 40px;
                }
            }

            @media (max-width: 480px) {
                .search-overlay {
                    padding: 8px;
                }

                .search-modal {
                    border-radius: var(--radius-md, 12px);
                    max-height: 90vh;
                }

                .search-header {
                    padding: 12px 14px;
                }

                .search-input {
                    font-size: 14px;
                }

                .search-result-item {
                    padding: 10px 14px;
                }
            }

            /* ================================================
               THEME ADAPTATION
            ================================================ */

            /* Light theme adjustments */
            [data-theme="light"] .search-modal {
                background: #FFFFFF;
                border-color: #D8D8D8;
            }

            [data-theme="light"] .search-header {
                border-color: #D8D8D8;
            }

            [data-theme="light"] .search-input {
                color: #111111;
            }

            [data-theme="light"] .search-input::placeholder {
                color: #999999;
            }

            [data-theme="light"] .search-result-title {
                color: #111111;
            }

            [data-theme="light"] .search-result-item:hover,
            [data-theme="light"] .search-result-item.is-active {
                background: rgba(212, 175, 55, 0.08);
            }

            [data-theme="light"] .search-shortcut {
                background: rgba(0, 0, 0, 0.06);
                color: #777777;
            }

            [data-theme="light"] .search-result-category {
                background: rgba(0, 0, 0, 0.06);
                color: #777777;
            }

            [data-theme="light"] .search-no-results {
                color: #777777;
            }

            [data-theme="light"] .search-backdrop {
                background: rgba(0, 0, 0, 0.5);
            }
        `;

        document.head.appendChild(style);
    }

    // ======================================================
    // SETUP
    // ======================================================

    function setupSearchButton() {
        const searchBtn = document.querySelector(state.config.searchButtonSelector);
        if (!searchBtn) {
            // If no search button found, we can still use keyboard shortcut
            return;
        }

        // Ensure button has proper attributes
        if (!searchBtn.getAttribute('aria-label')) {
            searchBtn.setAttribute('aria-label', 'Search documentation');
        }

        // Override click handler
        const clickHandler = function (e) {
            e.preventDefault();
            toggleSearch();
        };
        searchBtn.addEventListener('click', clickHandler);
        state.eventListeners.push({ element: searchBtn, event: 'click', handler: clickHandler });
    }

    function setupKeyboardShortcuts() {
        const keydownHandler = function (e) {
            // Ctrl+K or Cmd+K
            const isCtrl = e.ctrlKey || e.metaKey;
            if (isCtrl && e.key === state.config.shortcutKey) {
                e.preventDefault();
                toggleSearch();
                return;
            }

            // Escape key
            if (e.key === 'Escape' && state.isOpen && state.config.closeOnEscape) {
                e.preventDefault();
                closeSearch();
                return;
            }
        };

        document.addEventListener('keydown', keydownHandler);
        state.eventListeners.push({ element: document, event: 'keydown', handler: keydownHandler });
    }

    function setupGlobalEvents() {
        // Listen for theme changes to update the search styles (already handled via CSS variables)
        document.addEventListener('theme:mode-changed', function () {
            // Nothing needed — CSS variables handle it automatically
        });

        // Listen for runtime events
        if (window.ASLDS && window.ASLDS.events) {
            window.ASLDS.events.on('runtime:destroy', function () {
                API.destroy();
            });
        }
    }

    // ======================================================
    // LIFECYCLE
    // ======================================================

    function init(userConfig) {
        if (state.initialized) {
            console.warn('[Search] Already initialized.');
            return this;
        }

        state.config = mergeConfig(userConfig);

        // Inject styles
        injectStyles();

        // Setup search button
        setupSearchButton();

        // Setup keyboard shortcuts
        setupKeyboardShortcuts();

        // Setup global events
        setupGlobalEvents();

        // Create overlay (hidden by default)
        createOverlay();

        state.initialized = true;

        // If openOnLoad is true, open search
        if (state.config.openOnLoad) {
            setTimeout(openSearch, 500);
        }

        const event = new CustomEvent('asl:search:init', {
            detail: { config: state.config }
        });
        document.dispatchEvent(event);

        console.log('[Search] Initialized. Press Ctrl+K to search.');
        return this;
    }

    function destroy() {
        if (!state.initialized) return this;

        // Remove event listeners
        state.eventListeners.forEach(function (listener) {
            listener.element.removeEventListener(listener.event, listener.handler);
        });
        state.eventListeners = [];

        // Remove overlay
        if (state.overlay && state.overlay.parentElement) {
            state.overlay.parentElement.removeChild(state.overlay);
        }

        // Remove styles
        const styleEl = document.getElementById('aslds-search-styles');
        if (styleEl) {
            styleEl.remove();
        }

        // Remove body class
        document.body.classList.remove('search-open');

        state.initialized = false;
        state.isOpen = false;

        const event = new CustomEvent('asl:search:destroy');
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
         * Open the search overlay
         */
        open: function () {
            if (!state.initialized) {
                console.warn('[Search] Not initialized. Call init() first.');
                return this;
            }
            openSearch();
            return this;
        },

        /**
         * Close the search overlay
         */
        close: function () {
            if (!state.initialized) {
                console.warn('[Search] Not initialized. Call init() first.');
                return this;
            }
            closeSearch();
            return this;
        },

        /**
         * Toggle the search overlay
         */
        toggle: function () {
            if (!state.initialized) {
                console.warn('[Search] Not initialized. Call init() first.');
                return this;
            }
            toggleSearch();
            return this;
        },

        /**
         * Check if search is open
         * @returns {boolean}
         */
        isOpen: function () {
            return state.isOpen;
        },

        /**
         * Get the current search results
         * @returns {Array}
         */
        getResults: function () {
            return state.currentResults.slice();
        },

        /**
         * Get the search index (for customization)
         * @returns {Array}
         */
        getIndex: function () {
            return searchIndex.slice();
        },

        /**
         * Set a custom search index
         * @param {Array} newIndex
         */
        setIndex: function (newIndex) {
            if (!Array.isArray(newIndex)) {
                console.warn('[Search] Index must be an array.');
                return this;
            }
            searchIndex.length = 0;
            searchIndex.push.apply(searchIndex, newIndex);
            return this;
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
                isOpen: state.isOpen,
                indexSize: searchIndex.length,
                config: state.config,
            };
        },

        /**
         * Update configuration (limited runtime options)
         * @param {Object} newConfig
         */
        updateConfig: function (newConfig) {
            if (!state.initialized) {
                console.warn('[Search] Not initialized.');
                return this;
            }
            if (newConfig.placeholder !== undefined) {
                state.config.placeholder = newConfig.placeholder;
                if (state.input) {
                    state.input.placeholder = state.config.placeholder;
                }
            }
            if (newConfig.maxResults !== undefined) {
                state.config.maxResults = newConfig.maxResults;
            }
            if (newConfig.noResultsText !== undefined) {
                state.config.noResultsText = newConfig.noResultsText;
                const noResults = state.resultsContainer ? state.resultsContainer.querySelector('.search-no-results') : null;
                if (noResults) {
                    noResults.textContent = state.config.noResultsText;
                }
            }
            return this;
        }
    };

    // ======================================================
    // REGISTER UNDER NAMESPACE & RUNTIME
    // ======================================================

    window.ASLDS = window.ASLDS || {};
    window.ASLDS.Search = API;

    if (window.ASLDS && typeof window.ASLDS.register === 'function') {
        // Priority 55 - loads after components (toast, dropdown, etc.) but before playground
        window.ASLDS.register('Search', API, 55, []);
    } else {
        console.warn('[Search] Runtime not found. Module registered directly on ASLDS namespace.');
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
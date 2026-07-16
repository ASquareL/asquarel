/*!
 * ============================================================================
 * A Square L Innovate
 * ============================================================================
 * ASL Design System (ASLDS) - Search Module
 * File        : search.js
 * Version     : 2.0.0 Stable
 * Author      : A Square L Innovate
 * License     : Proprietary
 *
 * Description :
 * The Search Module provides global documentation search functionality across
 * the ASL Design System Showcase. It delivers a unified search experience
 * with support for:
 *   • Global documentation search
 *   • Real-time search while typing
 *   • Debounced input handling
 *   • Search suggestions and result ranking
 *   • Keyboard navigation through results (Arrow keys, Enter, Escape)
 *   • Highlight matched text
 *   • Search across page titles, headings, component names, descriptions
 *   • Search history and recent searches
 *   • Empty state and no-results state handling
 *   • Accessible ARIA support
 *   • Responsive behaviour
 *   • Event delegation
 *   • Performance optimizations
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
        console.error('[ASLDS] Runtime not found. Search module cannot initialize.');
        return;
    }

    // ========================================================================
    // Search Module
    // ========================================================================

    const Search = {
        /**
         * Module Information
         */
        name: 'Search',
        version: '2.0.0',
        priority: 10,
        dependencies: [],

        /**
         * Search Configuration
         */
        config: {
            // Selectors
            searchSelector: '.search-container',
            inputSelector: '.search-input',
            toggleSelector: '.search-toggle',
            overlaySelector: '.search-overlay',
            resultsSelector: '.search-results',
            resultItemSelector: '.search-result-item',
            emptySelector: '.search-empty',
            noResultsSelector: '.search-no-results',
            loadingSelector: '.search-loading',
            historySelector: '.search-history',
            clearSelector: '.search-clear',
            closeSelector: '.search-close',

            activeClass: 'active',
            openClass: 'open',
            visibleClass: 'visible',
            focusedClass: 'focused',
            highlightedClass: 'highlighted',

            // Behavior
            debounceDelay: 300,
            minQueryLength: 2,
            maxResults: 15,
            maxHistory: 10,
            enableHistory: true,
            enableSuggestions: true,
            enableHighlight: true,
            enableKeyboardNav: true,
            closeOnEscape: true,
            closeOnOverlayClick: true,
            closeOnResultClick: true,
            persistHistory: true,
            storageKey: 'aslds-search-history',

            // Accessibility
            ariaLabel: 'Search documentation',
            inputAriaLabel: 'Search input',
            resultsAriaLabel: 'Search results',

            // Debug
            debug: false,
        },

        /**
         * Runtime State
         */
        state: {
            initialized: false,
            isOpen: false,
            isFocused: false,
            query: '',
            results: [],
            selectedIndex: -1,
            history: [],
            isSearching: false,
            debounceTimer: null,
            resizeTimer: null,
        },

        /**
         * Cached Elements
         */
        elements: {
            container: null,
            input: null,
            toggle: null,
            overlay: null,
            results: null,
            empty: null,
            noResults: null,
            loading: null,
            history: null,
            clear: null,
            close: null,
            body: document.body,
        },

        /**
         * Search Index
         */
        index: {
            pages: [],
            items: [],
            initialized: false,
        },

        /**
         * Bound event handlers (for cleanup)
         */
        _handlers: {
            input: null,
            toggle: null,
            overlay: null,
            close: null,
            clear: null,
            documentKeydown: null,
            resize: null,
            resultClicks: [],
        },

        // ========================================================================
        // Core API
        // ========================================================================

        /**
         * Initialize the search module
         * @param {Element|string} element - Search container element or selector
         * @param {Object} options - Configuration options
         * @returns {Object} This instance for chaining
         */
        init: function (element, options) {
            if (this.state.initialized) {
                ASLDS.logger.warn('Search module already initialized.');
                return this;
            }

            // Merge configuration
            if (options) {
                Object.assign(this.config, options);
            }

            ASLDS.logger.info('Initializing Search module v' + this.version + '...');

            // Find search container
            this.elements.container = typeof element === 'string'
                ? ASLDS.dom.find(element)
                : element;

            if (!this.elements.container) {
                // Try to find by selector
                this.elements.container = ASLDS.dom.find(this.config.searchSelector);
                if (!this.elements.container) {
                    ASLDS.logger.warn('Search container not found.');
                    return this;
                }
            }

            // Cache elements
            this._cacheElements();

            // Load search history
            if (this.config.enableHistory && this.config.persistHistory) {
                this._loadHistory();
            }

            // Build search index from page data
            this._buildIndex();

            // Setup toggle button
            this._setupToggle();

            // Setup input
            this._setupInput();

            // Setup overlay
            this._setupOverlay();

            // Setup close button
            this._setupClose();

            // Setup clear button
            this._setupClear();

            // Setup global event listeners
            this._setupGlobalEvents();

            // Apply initial state
            this._applyInitialState();

            this.state.initialized = true;

            ASLDS.logger.info('Search module initialized successfully.', {
                indexItems: this.index.items.length,
                historyCount: this.state.history.length,
            });

            return this;
        },

        /**
         * Open the search panel
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.focus - If false, doesn't focus input
         * @returns {Object} This instance for chaining
         */
        open: function (options) {
            options = options || {};

            if (this.state.isOpen) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isOpen = true;

            // Update DOM
            if (this.elements.container) {
                this.elements.container.classList.add(this.config.openClass);
                this.elements.container.classList.add(this.config.visibleClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.add(this.config.openClass);
                this.elements.overlay.classList.add(this.config.visibleClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'true');
                this.elements.toggle.classList.add(this.config.openClass);
            }

            // Prevent body scroll
            this.elements.body.classList.add('no-scroll');

            // Focus input
            if (options.focus !== false && this.elements.input) {
                setTimeout(function () {
                    this.elements.input.focus();
                }.bind(this), 100);
            }

            // Show history if available
            if (this.config.enableHistory && this.state.history.length > 0 && !this.state.query) {
                this._showHistory();
            }

            // Emit event
            ASLDS.events.emit('search:open', {
                container: this.elements.container,
                input: this.elements.input,
            });

            ASLDS.logger.debug('Search opened.');

            return this;
        },

        /**
         * Close the search panel
         * @param {Object} options - Options
         * @param {boolean} options.animate - If false, disables transition
         * @param {boolean} options.clearQuery - If true, clears the query
         * @returns {Object} This instance for chaining
         */
        close: function (options) {
            options = options || {};

            if (!this.state.isOpen) {
                return this;
            }

            // Start transition
            if (this.config.enableTransitions && !options.noTransition) {
                this._startTransition();
            }

            // Update state
            this.state.isOpen = false;
            this.state.selectedIndex = -1;

            // Update DOM
            if (this.elements.container) {
                this.elements.container.classList.remove(this.config.openClass);
                this.elements.container.classList.remove(this.config.visibleClass);
            }

            if (this.elements.overlay) {
                this.elements.overlay.classList.remove(this.config.openClass);
                this.elements.overlay.classList.remove(this.config.visibleClass);
            }

            if (this.elements.toggle) {
                this.elements.toggle.setAttribute('aria-expanded', 'false');
                this.elements.toggle.classList.remove(this.config.openClass);
            }

            if (this.elements.results) {
                this.elements.results.classList.remove(this.config.visibleClass);
                this.elements.results.innerHTML = '';
            }

            if (this.elements.history) {
                this.elements.history.classList.remove(this.config.visibleClass);
            }

            if (this.elements.empty) {
                this.elements.empty.classList.remove(this.config.visibleClass);
            }

            if (this.elements.noResults) {
                this.elements.noResults.classList.remove(this.config.visibleClass);
            }

            if (this.elements.loading) {
                this.elements.loading.classList.remove(this.config.visibleClass);
            }

            // Restore body scroll
            this.elements.body.classList.remove('no-scroll');

            // Clear query if requested
            if (options.clearQuery && this.elements.input) {
                this.elements.input.value = '';
                this.state.query = '';
            }

            // Emit event
            ASLDS.events.emit('search:close', {
                container: this.elements.container,
            });

            ASLDS.logger.debug('Search closed.');

            return this;
        },

        /**
         * Toggle the search panel
         * @param {Object} options - Options
         * @returns {Object} This instance for chaining
         */
        toggle: function (options) {
            if (this.state.isOpen) {
                this.close(options);
            } else {
                this.open(options);
            }
            return this;
        },

        /**
         * Perform a search with the given query
         * @param {string} query - Search query
         * @param {Object} options - Options
         * @param {boolean} options.saveHistory - If false, doesn't save to history
         * @returns {Object} This instance for chaining
         */
        search: function (query, options) {
            options = options || {};

            // Normalize query
            const normalizedQuery = this._normalizeQuery(query);

            // Update state
            this.state.query = normalizedQuery;

            // Clear previous results
            this.state.results = [];
            this.state.selectedIndex = -1;

            // Show loading state
            this._showLoading();

            // Perform search
            const results = this._performSearch(normalizedQuery);

            // Hide loading
            this._hideLoading();

            // Update results
            this.state.results = results;

            // Render results
            this._renderResults(results);

            // Save to history if we have results and query is not empty
            if (this.config.enableHistory &&
                options.saveHistory !== false &&
                normalizedQuery.length >= this.config.minQueryLength &&
                results.length > 0) {
                this._addToHistory(normalizedQuery);
            }

            // Emit event
            ASLDS.events.emit('search:results', {
                query: normalizedQuery,
                results: results,
                count: results.length,
            });

            ASLDS.logger.debug('Search performed.', {
                query: normalizedQuery,
                results: results.length,
            });

            return this;
        },

        /**
         * Clear the search input and results
         * @returns {Object} This instance for chaining
         */
        clear: function () {
            if (this.elements.input) {
                this.elements.input.value = '';
            }

            this.state.query = '';
            this.state.results = [];
            this.state.selectedIndex = -1;

            if (this.elements.results) {
                this.elements.results.innerHTML = '';
                this.elements.results.classList.remove(this.config.visibleClass);
            }

            if (this.elements.noResults) {
                this.elements.noResults.classList.remove(this.config.visibleClass);
            }

            if (this.elements.empty) {
                this.elements.empty.classList.remove(this.config.visibleClass);
            }

            if (this.elements.clear) {
                this.elements.clear.classList.remove(this.config.visibleClass);
            }

            // Show history if available
            if (this.config.enableHistory && this.state.history.length > 0) {
                this._showHistory();
            }

            // Focus input
            if (this.elements.input) {
                this.elements.input.focus();
            }

            ASLDS.logger.debug('Search cleared.');

            return this;
        },

        /**
         * Get the current search results
         * @returns {Array} Array of result objects
         */
        getResults: function () {
            return this.state.results.slice();
        },

        /**
         * Get search history
         * @returns {Array} Array of history items
         */
        getHistory: function () {
            return this.state.history.slice();
        },

        /**
         * Clear search history
         * @returns {Object} This instance for chaining
         */
        clearHistory: function () {
            this.state.history = [];
            if (this.config.persistHistory) {
                ASLDS.storage.remove(this.config.storageKey);
            }
            this._hideHistory();
            ASLDS.logger.debug('Search history cleared.');
            return this;
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
                isOpen: this.state.isOpen,
                isFocused: this.state.isFocused,
                query: this.state.query,
                resultsCount: this.state.results.length,
                historyCount: this.state.history.length,
                indexItems: this.index.items.length,
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
                isOpen: this.state.isOpen,
                isFocused: this.state.isFocused,
                query: this.state.query,
                resultsCount: this.state.results.length,
                selectedIndex: this.state.selectedIndex,
                historyCount: this.state.history.length,
                indexItems: this.index.items.length,
                config: Object.assign({}, this.config),
                elements: {
                    container: !!this.elements.container,
                    input: !!this.elements.input,
                    toggle: !!this.elements.toggle,
                    overlay: !!this.elements.overlay,
                    results: !!this.elements.results,
                    history: !!this.elements.history,
                },
            };
        },

        /**
         * Destroy the search module
         * @returns {Object} This instance for chaining
         */
        destroy: function () {
            if (!this.state.initialized) {
                return this;
            }

            ASLDS.logger.info('Destroying Search module...');

            // Close search
            if (this.state.isOpen) {
                this.close({ noTransition: true });
            }

            // Remove event listeners
            this._removeEventListeners();

            // Reset state
            this.state.initialized = false;
            this.state.isOpen = false;
            this.state.results = [];
            this.state.history = [];

            // Clear timers
            if (this.state.debounceTimer) {
                clearTimeout(this.state.debounceTimer);
                this.state.debounceTimer = null;
            }
            if (this.state.resizeTimer) {
                clearTimeout(this.state.resizeTimer);
                this.state.resizeTimer = null;
            }

            ASLDS.logger.info('Search module destroyed.');

            return this;
        },

        // ========================================================================
        // Private Methods
        // ========================================================================

        /**
         * Cache DOM elements
         */
        _cacheElements: function () {
            const container = this.elements.container;

            this.elements.input = container.querySelector(this.config.inputSelector);
            this.elements.toggle = container.querySelector(this.config.toggleSelector);
            this.elements.overlay = container.querySelector(this.config.overlaySelector);
            this.elements.results = container.querySelector(this.config.resultsSelector);
            this.elements.empty = container.querySelector(this.config.emptySelector);
            this.elements.noResults = container.querySelector(this.config.noResultsSelector);
            this.elements.loading = container.querySelector(this.config.loadingSelector);
            this.elements.history = container.querySelector(this.config.historySelector);
            this.elements.clear = container.querySelector(this.config.clearSelector);
            this.elements.close = container.querySelector(this.config.closeSelector);

            // Create overlay if missing
            if (!this.elements.overlay && this.config.closeOnOverlayClick) {
                this.elements.overlay = ASLDS.dom.create('<div class="search-overlay"></div>');
                if (this.elements.overlay) {
                    this.elements.container.parentNode.insertBefore(
                        this.elements.overlay,
                        this.elements.container.nextSibling
                    );
                }
            }

            // Create results container if missing
            if (!this.elements.results) {
                this.elements.results = ASLDS.dom.create('<div class="search-results" role="listbox" aria-label="' + this.config.resultsAriaLabel + '"></div>');
                if (this.elements.results) {
                    this.elements.container.appendChild(this.elements.results);
                }
            }
        },

        /**
 * Build search index from all documentation pages
 */
_buildIndex: function() {
    if (this.index.initialized) return;

    // First, try to load a static index (if available)
    this._loadSearchIndexFromFile()
        .then(function(data) {
            if (data && data.length > 0) {
                this.index.items = data;
                this.index.initialized = true;
                ASLDS.logger.debug('Search index loaded from static file.', { count: data.length });
            } else {
                // Fallback: build index from current page and crawl links
                this._buildIndexFromNavigation();
            }
        }.bind(this))
        .catch(function() {
            // Fallback: build index from current page only
            this._buildIndexFromNavigation();
        }.bind(this));
},

/**
 * Load search index from a static JSON file (if exists)
 */
_loadSearchIndexFromFile: function() {
    return fetch('/search-index.json')
        .then(function(response) {
            if (!response.ok) throw new Error('Index file not found');
            return response.json();
        })
        .catch(function() {
            return null;
        });
},

/**
 * Build index by crawling navigation links
 */
_buildIndexFromNavigation: function() {
    // Collect all internal links from the main navigation
    const navLinks = ASLDS.dom.findAll('nav a[href]');
    const urls = [];
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            urls.push(href);
        }
    });

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    // Index the current page first
    const currentItems = this._collectPageData();
    this.index.items = currentItems;

    // Then fetch and index other pages (limit to avoid too many requests)
    const maxPages = 10;
    const pagesToFetch = uniqueUrls.slice(0, maxPages);

    const fetchPromises = pagesToFetch.map(function(url) {
        return fetch(url)
            .then(function(response) {
                if (!response.ok) return null;
                return response.text();
            })
            .then(function(html) {
                if (!html) return null;
                // Parse HTML to extract title, headings, components
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const title = doc.querySelector('title')?.textContent || '';
                const headings = [];
                doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function(h) {
                    const text = h.textContent.trim();
                    if (text) {
                        headings.push({
                            text: text,
                            id: h.id || '',
                        });
                    }
                });
                // Extract component names from data-component attributes
                const components = [];
                doc.querySelectorAll('[data-component]').forEach(function(el) {
                    const name = el.getAttribute('data-component');
                    if (name) {
                        components.push({
                            name: name,
                            id: el.id || '',
                            description: el.getAttribute('data-description') || '',
                        });
                    }
                });
                // Return page data
                return {
                    title: title,
                    url: url,
                    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                    headings: headings,
                    components: components,
                };
            });
    }.bind(this));

    Promise.all(fetchPromises)
        .then(function(pages) {
            pages.forEach(function(page) {
                if (page) {
                    // Add page title
                    this.index.items.push({
                        type: 'page',
                        title: page.title,
                        url: page.url,
                        description: page.description || '',
                        category: 'Page',
                        weight: 10,
                    });
                    // Add headings
                    page.headings.forEach(function(heading) {
                        this.index.items.push({
                            type: 'heading',
                            title: heading.text,
                            url: page.url + (heading.id ? '#' + heading.id : ''),
                            description: page.title,
                            category: 'Heading',
                            weight: 8,
                        });
                    }.bind(this));
                    // Add components
                    page.components.forEach(function(component) {
                        this.index.items.push({
                            type: 'component',
                            title: component.name,
                            url: page.url + (component.id ? '#' + component.id : ''),
                            description: component.description || '',
                            category: 'Component',
                            weight: 9,
                        });
                    }.bind(this));
                }
            }.bind(this));

            this.index.initialized = true;
            ASLDS.logger.debug('Search index built via crawling.', { count: this.index.items.length });
        }.bind(this))
        .catch(function(error) {
            ASLDS.logger.error('Failed to build search index:', error);
            // Fallback: use current page only
            this.index.items = this._collectPageData();
            this.index.initialized = true;
        }.bind(this));
},


        /**
         * Collect page data from the document
         * @returns {Array} Array of page objects
         */
        _collectPageData: function () {
            const pages = [];
            const currentUrl = window.location.pathname;

            // Get page title
            const title = document.querySelector('title');
            const pageTitle = title ? title.textContent : '';

            // Get page description (meta description)
            const metaDesc = document.querySelector('meta[name="description"]');
            const description = metaDesc ? metaDesc.getAttribute('content') : '';

            // Get headings
            const headings = [];
            const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headingElements.forEach(function (heading) {
                const text = heading.textContent.trim();
                if (text) {
                    headings.push({
                        text: text,
                        id: heading.id || '',
                    });
                }
            });

            // Get component names from the page
            const components = [];
            const componentElements = document.querySelectorAll('[data-component]');
            componentElements.forEach(function (el) {
                const name = el.getAttribute('data-component');
                const desc = el.getAttribute('data-description') || '';
                if (name) {
                    components.push({
                        name: name,
                        id: el.id || '',
                        description: desc,
                    });
                }
            });

            // Also look for component documentation sections
            const componentSections = document.querySelectorAll('.component-section, [data-component-section]');
            componentSections.forEach(function (section) {
                const nameEl = section.querySelector('h2, h3, .component-name');
                if (nameEl) {
                    const name = nameEl.textContent.trim();
                    const descEl = section.querySelector('.component-description, p');
                    const desc = descEl ? descEl.textContent.trim() : '';
                    if (name) {
                        components.push({
                            name: name,
                            id: section.id || '',
                            description: desc,
                        });
                    }
                }
            });

            pages.push({
                title: pageTitle,
                url: currentUrl,
                description: description,
                headings: headings,
                components: components,
            });

            // If there are navigation links, we could crawl them for more pages
            // For now, just use the current page

            return pages;
        },

        /**
         * Perform search on the index
         * @param {string} query - Search query
         * @returns {Array} Array of result objects
         */
        _performSearch: function (query) {
            if (!query || query.length < this.config.minQueryLength) {
                return [];
            }

            const results = [];
            const queryLower = query.toLowerCase();
            const queryWords = queryLower.split(/\s+/).filter(function (w) { return w.length > 0; });

            // Score each item
            this.index.items.forEach(function (item) {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const descLower = (item.description || '').toLowerCase();
                const categoryLower = (item.category || '').toLowerCase();

                // Exact match on title (highest score)
                if (titleLower === queryLower) {
                    score += 100;
                }

                // Title contains the full query
                if (titleLower.indexOf(queryLower) !== -1) {
                    score += 50;
                }

                // Title starts with the query
                if (titleLower.indexOf(queryLower) === 0) {
                    score += 30;
                }

                // Check each word in the query
                queryWords.forEach(function (word) {
                    if (titleLower.indexOf(word) !== -1) {
                        score += 10;
                    }
                    if (descLower.indexOf(word) !== -1) {
                        score += 5;
                    }
                    if (categoryLower.indexOf(word) !== -1) {
                        score += 8;
                    }
                });

                // Boost score for exact word matches
                queryWords.forEach(function (word) {
                    const wordRegex = new RegExp('\\b' + word + '\\b');
                    if (wordRegex.test(titleLower)) {
                        score += 15;
                    }
                    if (wordRegex.test(descLower)) {
                        score += 7;
                    }
                });

                // Add base weight
                score += item.weight || 0;

                if (score > 0) {
                    results.push({
                        item: item,
                        score: score,
                        title: item.title,
                        url: item.url,
                        description: item.description || '',
                        category: item.category || '',
                        type: item.type || '',
                        matchedQuery: query,
                    });
                }
            }.bind(this));

            // Sort by score (descending)
            results.sort(function (a, b) {
                return b.score - a.score;
            });

            // Limit results
            const maxResults = this.config.maxResults;
            return results.slice(0, maxResults);
        },

        /**
         * Normalize a query string
         * @param {string} query - Raw query
         * @returns {string} Normalized query
         */
        _normalizeQuery: function (query) {
            if (!query) return '';
            return query.trim().replace(/\s+/g, ' ');
        },

        /**
         * Render search results
         * @param {Array} results - Array of result objects
         */
        _renderResults: function (results) {
            const resultsContainer = this.elements.results;
            if (!resultsContainer) {
                return;
            }

            // Clear previous results
            resultsContainer.innerHTML = '';

            // Hide other states
            this._hideEmpty();
            this._hideNoResults();
            this._hideHistory();

            if (results.length === 0) {
                // Show no results state if there was a query
                if (this.state.query && this.state.query.length >= this.config.minQueryLength) {
                    this._showNoResults();
                } else if (this.state.query && this.state.query.length > 0) {
                    this._showEmpty();
                }
                resultsContainer.classList.remove(this.config.visibleClass);
                return;
            }

            // Render each result
            results.forEach(function (result, index) {
                const item = this._createResultItem(result, index);
                resultsContainer.appendChild(item);
            }.bind(this));

            resultsContainer.classList.add(this.config.visibleClass);

            // Store result items for keyboard navigation
            this._resultItems = resultsContainer.querySelectorAll(this.config.resultItemSelector);

            // Reset selection
            this.state.selectedIndex = -1;
        },

        /**
         * Create a result item element
         * @param {Object} result - Result object
         * @param {number} index - Result index
         * @returns {Element} Result item element
         */
        _createResultItem: function (result, index) {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.setAttribute('role', 'option');
            item.setAttribute('data-index', index);
            item.setAttribute('href', result.url);

            // Highlight matched text
            let titleHtml = this._highlightText(result.title, result.matchedQuery);
            let descHtml = result.description ? this._highlightText(result.description, result.matchedQuery) : '';

            // Category badge
            let categoryHtml = '';
            if (result.category) {
                categoryHtml = '<span class="result-category">' + result.category + '</span>';
            }

            item.innerHTML = `
                <div class="result-content">
                    <div class="result-title">${titleHtml}</div>
                    ${descHtml ? '<div class="result-description">' + descHtml + '</div>' : ''}
                </div>
                ${categoryHtml}
            `;

            // Click handler
            const clickHandler = function (e) {
                e.preventDefault();

                // Save to history
                if (this.config.enableHistory) {
                    this._addToHistory(this.state.query);
                }

                // Close search
                if (this.config.closeOnResultClick) {
                    this.close({ clearQuery: false });
                }

                // Navigate to the result
                window.location.href = result.url;

                // Emit event
                ASLDS.events.emit('search:result-click', {
                    result: result,
                    index: index,
                });
            }.bind(this);

            item.addEventListener('click', clickHandler);

            // Store for cleanup
            this._handlers.resultClicks.push({
                item: item,
                handler: clickHandler,
            });

            return item;
        },

        /**
         * Highlight matched text in a string
         * @param {string} text - Text to highlight
         * @param {string} query - Search query
         * @returns {string} HTML with highlighted text
         */
        _highlightText: function (text, query) {
            if (!this.config.enableHighlight || !text || !query) {
                return text;
            }

            const queryLower = query.toLowerCase();
            const textLower = text.toLowerCase();

            // Check if text contains the query
            if (textLower.indexOf(queryLower) === -1) {
                // Check individual words
                const words = queryLower.split(/\s+/).filter(function (w) { return w.length > 1; });
                let result = text;
                words.forEach(function (word) {
                    const regex = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                    result = result.replace(regex, '<mark class="highlight">$1</mark>');
                });
                return result;
            }

            // Highlight the full query
            const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            return text.replace(regex, '<mark class="highlight">$1</mark>');
        },

        /**
         * Show search history
         */
        _showHistory: function () {
            const historyContainer = this.elements.history;
            if (!historyContainer || this.state.history.length === 0) {
                return;
            }

            // Clear previous content
            historyContainer.innerHTML = '';

            // Create history items
            const historyItems = this.state.history.slice(0, this.config.maxHistory);

            historyItems.forEach(function (query) {
                const item = document.createElement('button');
                item.className = 'history-item';
                item.setAttribute('type', 'button');
                item.textContent = query;

                const clickHandler = function (e) {
                    e.preventDefault();
                    if (this.elements.input) {
                        this.elements.input.value = query;
                    }
                    this.search(query);
                    this._hideHistory();
                }.bind(this);

                item.addEventListener('click', clickHandler);

                // Store for cleanup
                if (!this._historyHandlers) {
                    this._historyHandlers = [];
                }
                this._historyHandlers.push({
                    item: item,
                    handler: clickHandler,
                });

                historyContainer.appendChild(item);
            }.bind(this));

            historyContainer.classList.add(this.config.visibleClass);

            // Hide other states
            this._hideEmpty();
            this._hideNoResults();
            if (this.elements.results) {
                this.elements.results.classList.remove(this.config.visibleClass);
            }
        },

        /**
         * Hide search history
         */
        _hideHistory: function () {
            if (this.elements.history) {
                this.elements.history.classList.remove(this.config.visibleClass);
                this.elements.history.innerHTML = '';
            }
        },

        /**
         * Show empty state
         */
        _showEmpty: function () {
            if (this.elements.empty) {
                this.elements.empty.classList.add(this.config.visibleClass);
            }
        },

        /**
         * Hide empty state
         */
        _hideEmpty: function () {
            if (this.elements.empty) {
                this.elements.empty.classList.remove(this.config.visibleClass);
            }
        },

        /**
         * Show no results state
         */
        _showNoResults: function () {
            if (this.elements.noResults) {
                this.elements.noResults.classList.add(this.config.visibleClass);
            }
        },

        /**
         * Hide no results state
         */
        _hideNoResults: function () {
            if (this.elements.noResults) {
                this.elements.noResults.classList.remove(this.config.visibleClass);
            }
        },

        /**
         * Show loading state
         */
        _showLoading: function () {
            if (this.elements.loading) {
                this.elements.loading.classList.add(this.config.visibleClass);
            }
        },

        /**
         * Hide loading state
         */
        _hideLoading: function () {
            if (this.elements.loading) {
                this.elements.loading.classList.remove(this.config.visibleClass);
            }
        },

        /**
         * Add a query to search history
         * @param {string} query - Search query
         */
        _addToHistory: function (query) {
            if (!query || query.length < this.config.minQueryLength) {
                return;
            }

            // Remove duplicate
            this.state.history = this.state.history.filter(function (q) {
                return q !== query;
            });

            // Add to front
            this.state.history.unshift(query);

            // Limit history size
            if (this.state.history.length > this.config.maxHistory) {
                this.state.history = this.state.history.slice(0, this.config.maxHistory);
            }

            // Save to storage
            if (this.config.persistHistory) {
                ASLDS.storage.set(this.config.storageKey, this.state.history);
            }

            ASLDS.logger.debug('Added to history: ' + query);
        },

        /**
         * Load search history from storage
         */
        _loadHistory: function () {
            const history = ASLDS.storage.get(this.config.storageKey);
            if (history && Array.isArray(history)) {
                this.state.history = history.slice(0, this.config.maxHistory);
                ASLDS.logger.debug('Loaded history: ' + this.state.history.length + ' items');
            } else {
                this.state.history = [];
            }
        },

        /**
         * Setup toggle button
         */
        _setupToggle: function () {
            const toggle = this.elements.toggle;
            if (!toggle) {
                return;
            }

            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Toggle search');

            const handler = function (e) {
                e.preventDefault();
                this.toggle();
            }.bind(this);

            toggle.addEventListener('click', handler);
            this._handlers.toggle = handler;

            ASLDS.logger.debug('Toggle button setup complete.');
        },

        /**
         * Setup input field
         */
        _setupInput: function () {
            const input = this.elements.input;
            if (!input) {
                return;
            }

            input.setAttribute('type', 'search');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('aria-label', this.config.inputAriaLabel);
            input.setAttribute('role', 'searchbox');

            // Input handler with debounce
            const handler = function (e) {
                const value = e.target.value;

                // Update clear button visibility
                if (this.elements.clear) {
                    if (value.length > 0) {
                        this.elements.clear.classList.add(this.config.visibleClass);
                    } else {
                        this.elements.clear.classList.remove(this.config.visibleClass);
                    }
                }

                // Debounce search
                if (this.state.debounceTimer) {
                    clearTimeout(this.state.debounceTimer);
                    this.state.debounceTimer = null;
                }

                if (value.length >= this.config.minQueryLength) {
                    this.state.debounceTimer = setTimeout(function () {
                        this.search(value);
                    }.bind(this), this.config.debounceDelay);
                } else if (value.length > 0) {
                    // Show empty state for short queries
                    this.state.query = value;
                    this.state.results = [];
                    this._hideHistory();
                    this._showEmpty();
                    if (this.elements.results) {
                        this.elements.results.classList.remove(this.config.visibleClass);
                    }
                } else {
                    // Clear everything
                    this.clear();
                }
            }.bind(this);

            input.addEventListener('input', handler);
            this._handlers.input = handler;

            // Focus handler
            input.addEventListener('focus', function () {
                this.state.isFocused = true;
                this.elements.container.classList.add(this.config.focusedClass);
            }.bind(this));

            // Blur handler
            input.addEventListener('blur', function () {
                this.state.isFocused = false;
                this.elements.container.classList.remove(this.config.focusedClass);
            }.bind(this));

            // Keyboard navigation
            if (this.config.enableKeyboardNav) {
                input.addEventListener('keydown', function (e) {
                    this._handleKeyboard(e);
                }.bind(this));
            }

            ASLDS.logger.debug('Input setup complete.');
        },

        /**
         * Setup overlay
         */
        _setupOverlay: function () {
            const overlay = this.elements.overlay;
            if (!overlay || !this.config.closeOnOverlayClick) {
                return;
            }

            const handler = function (e) {
                if (this.state.isOpen) {
                    this.close({ clearQuery: true });
                }
            }.bind(this);

            overlay.addEventListener('click', handler);
            this._handlers.overlay = handler;

            ASLDS.logger.debug('Overlay setup complete.');
        },

        /**
         * Setup close button
         */
        _setupClose: function () {
            const close = this.elements.close;
            if (!close) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();
                this.close({ clearQuery: true });
            }.bind(this);

            close.addEventListener('click', handler);
            this._handlers.close = handler;

            ASLDS.logger.debug('Close button setup complete.');
        },

        /**
         * Setup clear button
         */
        _setupClear: function () {
            const clear = this.elements.clear;
            if (!clear) {
                return;
            }

            const handler = function (e) {
                e.preventDefault();
                this.clear();
            }.bind(this);

            clear.addEventListener('click', handler);
            this._handlers.clear = handler;

            ASLDS.logger.debug('Clear button setup complete.');
        },

        /**
         * Setup global event listeners
         */
        _setupGlobalEvents: function () {
            // Keyboard shortcuts
            const keydownHandler = function (e) {
                // Ctrl+K or Cmd+K to open search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggle();
                }

                // Escape to close
                if (e.key === 'Escape' && this.state.isOpen && this.config.closeOnEscape) {
                    if (this.elements.input && this.elements.input.value.length > 0) {
                        // Clear input first if there's text
                        this.clear();
                    } else {
                        this.close({ clearQuery: true });
                    }
                }
            }.bind(this);

            document.addEventListener('keydown', keydownHandler);
            this._handlers.documentKeydown = keydownHandler;

            // Resize handler
            const resizeHandler = function () {
                if (this.state.resizeTimer) {
                    clearTimeout(this.state.resizeTimer);
                }

                this.state.resizeTimer = setTimeout(function () {
                    this._handleResize();
                }.bind(this), 150);
            }.bind(this);

            window.addEventListener('resize', resizeHandler);
            this._handlers.resize = resizeHandler;

            ASLDS.logger.debug('Global event listeners setup complete.');
        },

        /**
         * Remove all event listeners
         */
        _removeEventListeners: function () {
            // Input
            if (this.elements.input && this._handlers.input) {
                this.elements.input.removeEventListener('input', this._handlers.input);
                this._handlers.input = null;
            }

            // Toggle
            if (this.elements.toggle && this._handlers.toggle) {
                this.elements.toggle.removeEventListener('click', this._handlers.toggle);
                this._handlers.toggle = null;
            }

            // Overlay
            if (this.elements.overlay && this._handlers.overlay) {
                this.elements.overlay.removeEventListener('click', this._handlers.overlay);
                this._handlers.overlay = null;
            }

            // Close
            if (this.elements.close && this._handlers.close) {
                this.elements.close.removeEventListener('click', this._handlers.close);
                this._handlers.close = null;
            }

            // Clear
            if (this.elements.clear && this._handlers.clear) {
                this.elements.clear.removeEventListener('click', this._handlers.clear);
                this._handlers.clear = null;
            }

            // Document keydown
            if (this._handlers.documentKeydown) {
                document.removeEventListener('keydown', this._handlers.documentKeydown);
                this._handlers.documentKeydown = null;
            }

            // Resize
            if (this._handlers.resize) {
                window.removeEventListener('resize', this._handlers.resize);
                this._handlers.resize = null;
            }

            // Result clicks
            this._handlers.resultClicks.forEach(function (item) {
                item.item.removeEventListener('click', item.handler);
            });
            this._handlers.resultClicks = [];

            // History clicks
            if (this._historyHandlers) {
                this._historyHandlers.forEach(function (item) {
                    item.item.removeEventListener('click', item.handler);
                });
                this._historyHandlers = [];
            }

            ASLDS.logger.debug('Event listeners removed.');
        },

        /**
         * Handle keyboard navigation
         * @param {KeyboardEvent} e - Keyboard event
         */
        _handleKeyboard: function (e) {
            const results = this._resultItems || [];
            const total = results.length;

            if (total === 0) {
                return;
            }

            let newIndex = this.state.selectedIndex;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = (this.state.selectedIndex + 1) % total;
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = (this.state.selectedIndex - 1 + total) % total;
                    break;

                case 'Home':
                    e.preventDefault();
                    newIndex = 0;
                    break;

                case 'End':
                    e.preventDefault();
                    newIndex = total - 1;
                    break;

                case 'Enter':
                    e.preventDefault();
                    if (this.state.selectedIndex >= 0 && this.state.selectedIndex < total) {
                        const selectedItem = results[this.state.selectedIndex];
                        if (selectedItem) {
                            selectedItem.click();
                        }
                    }
                    return;

                default:
                    return;
            }

            // Update selection
            this.state.selectedIndex = newIndex;

            // Update UI
            results.forEach(function (item, index) {
                if (index === newIndex) {
                    item.classList.add(this.config.highlightedClass);
                    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    item.classList.remove(this.config.highlightedClass);
                }
            }.bind(this));

            // Update ARIA
            if (this.elements.results) {
                this.elements.results.setAttribute('aria-activedescendant', '');
            }
            if (newIndex >= 0 && newIndex < total) {
                const activeItem = results[newIndex];
                if (activeItem && this.elements.results) {
                    this.elements.results.setAttribute('aria-activedescendant', activeItem.id || '');
                }
            }
        },

        /**
         * Handle resize events
         */
        _handleResize: function () {
            // Responsive adjustments if needed
            ASLDS.events.emit('search:resize', {
                width: window.innerWidth,
                height: window.innerHeight,
            });
        },

        /**
         * Apply initial state
         */
        _applyInitialState: function () {
            // Ensure search is closed
            if (this.state.isOpen) {
                this.close({ noTransition: true, clearQuery: true });
            }

            // Hide all state containers
            this._hideHistory();
            this._hideEmpty();
            this._hideNoResults();
            this._hideLoading();

            if (this.elements.results) {
                this.elements.results.classList.remove(this.config.visibleClass);
                this.elements.results.innerHTML = '';
            }

            if (this.elements.clear) {
                this.elements.clear.classList.remove(this.config.visibleClass);
            }

            // Ensure no-scroll is removed
            this.elements.body.classList.remove('no-scroll');

            // Set initial ARIA attributes
            if (this.elements.container) {
                this.elements.container.setAttribute('role', 'search');
            }

            if (this.elements.results) {
                this.elements.results.setAttribute('role', 'listbox');
                this.elements.results.setAttribute('aria-label', this.config.resultsAriaLabel);
            }
        },

        /**
         * Start transition
         */
        _startTransition: function () {
            if (!this.config.enableTransitions) {
                return;
            }

            const container = this.elements.container;
            if (container) {
                container.classList.add('transitioning');
                setTimeout(function () {
                    container.classList.remove('transitioning');
                }, this.config.transitionDuration + 50);
            }
        },
    };

    // ========================================================================
    // Freeze Public Namespaces
    // ========================================================================

    Object.freeze(Search.config);
    Object.freeze(Search.state);

    // ========================================================================
    // Runtime Registration
    // ========================================================================

    ASLDS.register(Search.name, Search, Search.priority, Search.dependencies);

    // ========================================================================
    // Auto-Initialization
    // ========================================================================

    ASLDS.dom.ready(function () {
        // Auto-initialize via data attribute or find all search containers
        const autoInit = ASLDS.config.autoInitComponents !== false;
        if (!autoInit) {
            return;
        }

        // Check for data attribute
        const searchElements = ASLDS.dom.findAll('[data-search]');
        if (searchElements.length > 0) {
            searchElements.forEach(function (element) {
                Search.init(element);
            });
        } else {
            // Fallback: find by class
            const search = ASLDS.dom.find('.search-container');
            if (search) {
                Search.init(search);
            }
        }
    });

    // ========================================================================
    // Export to Global
    // ========================================================================

    if (!window.ASLDSSearch) {
        window.ASLDSSearch = Search;
    }

    /*!
     * ============================================================================
     * End of File
     * File        : search.js
     * Module      : ASL Design System (ASLDS) Search
     * Version     : 2.0.0 Stable
     * © 2026 A Square L Innovate
     * All Rights Reserved.
     * ============================================================================
     */
})(window, document);
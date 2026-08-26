/**
 * TAB GRAVEYARD - CLIENT LOGIC
 * Senior Frontend Developer & UI/UX Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. STATE MANAGEMENT
    // ----------------------------------------------------
    let allTabs = [];
    let currentTabs = [];
    const selectedIds = new Set();
    let activeCategoryFilter = null;

    // ----------------------------------------------------
    // 2. DOM ELEMENTS
    // ----------------------------------------------------
    const tabTextarea = document.getElementById('tabTextarea');
    const tabCounter = document.getElementById('tabCounter');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const demoBtn = document.getElementById('demoBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    const resultsContainer = document.getElementById('resultsContainer');
    const statTotal = document.getElementById('statTotal');
    const statDuplicates = document.getElementById('statDuplicates');
    const statAtRisk = document.getElementById('statAtRisk');
    const statCategories = document.getElementById('statCategories');
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    const activeFilterBadge = document.getElementById('activeFilterBadge');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    
    const graveyardList = document.getElementById('graveyardList');
    const graveyardEmptyState = document.getElementById('graveyardEmptyState');
    const emptyStateTitle = document.getElementById('emptyStateTitle');
    const emptyStateDesc = document.getElementById('emptyStateDesc');
    
    const selectedCountText = document.getElementById('selectedCountText');
    const selectDeadBtn = document.getElementById('selectDeadBtn');
    const selectDuplicatesBtn = document.getElementById('selectDuplicatesBtn');
    const selectNoneBtn = document.getElementById('selectNoneBtn');
    
    const buryBtn = document.getElementById('buryBtn');
    const copySurvivorsBtn = document.getElementById('copySurvivorsBtn');
    const exportTxtBtn = document.getElementById('exportTxtBtn');
    const toastContainer = document.getElementById('toastContainer');
    const logoLink = document.getElementById('logoLink');

    // ----------------------------------------------------
    // 3. CATEGORY DOMAIN DEFINITIONS
    // ----------------------------------------------------
    const CATEGORIES = {
        DEVELOPMENT: {
            name: 'Development',
            color: '#10b981', // green
            domains: [
                'github.com', 'gitlab.com', 'stackoverflow.com', 'npmjs.com', 
                'vercel.com', 'developer.mozilla.org', 'codepen.io', 'dev.to', 
                'bitbucket.org', 'localhost', 'stackblitz.com', 'github.io',
                'jsfiddle.net', 'w3schools.com', 'geeksforgeeks.org'
            ]
        },
        ENTERTAINMENT: {
            name: 'Entertainment',
            color: '#a855f7', // purple
            domains: [
                'youtube.com', 'youtu.be', 'netflix.com', 'spotify.com', 
                'twitch.tv', 'primevideo.com', 'disneyplus.com', 'hulu.com', 
                'vimeo.com', 'soundcloud.com', 'crunchyroll.com'
            ]
        },
        SOCIAL: {
            name: 'Social',
            color: '#3b82f6', // blue
            domains: [
                'reddit.com', 'x.com', 'twitter.com', 'instagram.com', 
                'facebook.com', 'linkedin.com', 'tiktok.com', 'pinterest.com', 
                'discord.com', 'discordapp.com', 'tumblr.com'
            ]
        },
        SHOPPING: {
            name: 'Shopping',
            color: '#fb923c', // orange/amber
            domains: [
                'amazon.com', 'amazon.in', 'amazon.co.uk', 'amazon.de', 
                'amazon.co.jp', 'flipkart.com', 'ebay.com', 'myntra.com', 
                'aliexpress.com', 'etsy.com', 'target.com', 'walmart.com'
            ]
        },
        EDUCATION: {
            name: 'Education',
            color: '#06b6d4', // cyan
            domains: [
                'coursera.org', 'udemy.com', 'khanacademy.org', 'wikipedia.org', 
                'medium.com', 'edx.org', 'duolingo.com', 'scholar.google.com', 
                'researchgate.net', 'arxiv.org'
            ]
        },
        NEWS: {
            name: 'News',
            color: '#e2e8f0', // slate
            domains: [
                'bbc.com', 'bbc.co.uk', 'cnn.com', 'reuters.com', 'nytimes.com', 
                'theguardian.com', 'forbes.com', 'bloomberg.com', 'techcrunch.com', 
                'wired.com', 'wsj.com', 'huffpost.com'
            ]
        },
        OTHER: {
            name: 'Other',
            color: '#6b7280', // gray
            domains: []
        }
    };

    // Fast domain-to-category lookup
    const domainCategoryLookup = {};
    Object.entries(CATEGORIES).forEach(([key, value]) => {
        value.domains.forEach(domain => {
            domainCategoryLookup[domain] = key;
        });
    });

    // ----------------------------------------------------
    // 4. SAMPLE DEMO DATA (22 URLs)
    // ----------------------------------------------------
    const DEMO_TABS_TEXT = 
`https://github.com/google/deepmind Google DeepMind Project
https://github.com/google/deepmind Google DeepMind Project
https://stackoverflow.com/questions/11227809/how-to-clone-a-git-repo How to clone a git repo - StackOverflow
https://stackoverflow.com/questions/11227809/how-to-clone-a-git-repo How to clone a git repo - StackOverflow
https://www.youtube.com/watch?v=dQw4w9WgXcQ Rick Astley - Never Gonna Give You Up (Video)
https://www.youtube.com/watch?v=dQw4w9WgXcQ Rick Astley - Never Gonna Give You Up (Video)
https://www.youtube.com/watch?v=y6120QOlsfU Darude - Sandstorm
https://www.youtube.com/watch?v=kJQP7kiw5Fk Luis Fonsi - Despacito
https://www.youtube.com/watch?v=9bZkp7q19f0 PSY - GANGNAM STYLE
https://www.youtube.com/watch?v=OPf0YbXqDm0 Mark Ronson - Uptown Funk
https://www.youtube.com/watch?v=60ItHLz5WEA Alan Walker - Faded
https://www.amazon.com/dp/B08N5WRWNW MacBook Air M1 Amazon
https://www.amazon.com/dp/B08N5WRWNW MacBook Air M1 Amazon
https://www.amazon.com/dp/B09G96TFFG iPad Mini Amazon Product
https://reddit.com/r/javascript Javascript Reddit Community
https://reddit.com/r/webdev WebDev Community Reddit
https://reddit.com/r/technology Tech News Subreddit
https://en.wikipedia.org/wiki/Web_development Web Development - Wikipedia
https://en.wikipedia.org/wiki/Browser_extension Browser extension - Wikipedia
https://www.nytimes.com/section/technology Technology News - The New York Times
https://www.nytimes.com/section/science Science News - The New York Times
https://medium.com/engineering-at-medium Engineering at Medium
https://invalid-url-that-is-broken
Not a URL at all, just a random note left in the tab list`;

    // ----------------------------------------------------
    // 5. TOAST NOTIFICATION SYSTEM
    // ----------------------------------------------------
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : type === 'warning' ? 'toast-warning' : ''}`;
        
        toast.innerHTML = `
            <div class="toast-content">${message}</div>
            <button class="toast-close" aria-label="Dismiss notification">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                removeToast(toast);
            }
        }, 4000);
    }

    function removeToast(toast) {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }

    // ----------------------------------------------------
    // 6. REAL-TIME INPUT DETECTION
    // ----------------------------------------------------
    function countDetectedTabs(text) {
        if (!text.trim()) return 0;
        const lines = text.split('\n');
        let count = 0;
        
        // Simple regex to locate URLs inside text
        const urlRegex = /https?:\/\/[^\s"']+/i;
        const domainWithoutProtocolRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s"']*)?$/i;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;
            
            // Check if line contains a standard URL or looks like a direct domain path
            if (urlRegex.test(trimmed) || domainWithoutProtocolRegex.test(trimmed.split(/\s+/)[0])) {
                count++;
            }
        });
        return count;
    }

    tabTextarea.addEventListener('input', () => {
        const count = countDetectedTabs(tabTextarea.value);
        tabCounter.textContent = `${count} tab${count === 1 ? '' : 's'} detected`;
    });

    // Support Ctrl + Enter to analyze
    tabTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            analyzeBtn.click();
        }
    });

    // ----------------------------------------------------
    // 7. PARSING ENGINE
    // ----------------------------------------------------
    function cleanAndNormalizeUrl(urlString) {
        let cleanString = urlString.trim();
        
        // Remove enclosing bracket/parentheses commonly attached during export formats
        if (cleanString.startsWith('(') && cleanString.endsWith(')')) {
            cleanString = cleanString.slice(1, -1);
        }
        if (cleanString.startsWith('[') && cleanString.endsWith(']')) {
            cleanString = cleanString.slice(1, -1);
        }
        
        // Trim trailing punctuation marks like . , ; : ) ]
        cleanString = cleanString.replace(/[.,;:\]\)]+$/, '');

        // If URL doesn't start with protocol, try prepending standard https
        if (!/^https?:\/\//i.test(cleanString)) {
            // Check if it looks like a file path or local chrome page first
            if (/^(chrome|file|about|brave):\/\//i.test(cleanString)) {
                // Keep it
            } else {
                cleanString = 'https://' + cleanString;
            }
        }

        try {
            const urlObj = new URL(cleanString);
            
            // Normalize domain
            let domain = urlObj.hostname.toLowerCase();
            if (domain.startsWith('www.')) {
                domain = domain.slice(4);
            }
            
            // Normalize URL path and query parameters for duplicate matching
            // We ignore common tracking variables
            const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'fbclid', 'gclid'];
            const searchParams = new URLSearchParams(urlObj.search);
            
            // Filter tracking params out
            trackingParams.forEach(param => searchParams.delete(param));
            
            // Rebuild clean path
            let path = urlObj.pathname;
            if (path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            
            const sortedParams = Array.from(searchParams.entries()).sort((a, b) => a[0].localeCompare(b[0]));
            const cleanQuery = sortedParams.length > 0 
                ? '?' + sortedParams.map(([k, v]) => `${k}=${v}`).join('&')
                : '';
                
            const normalizedUrl = `${domain}${path}${cleanQuery}`;

            return {
                isValid: true,
                rawUrl: urlString,
                protocol: urlObj.protocol,
                domain: domain,
                path: path || '/',
                query: urlObj.search,
                cleanQuery: cleanQuery,
                fullCleanUrl: urlObj.origin + urlObj.pathname + urlObj.search,
                normalizedUrl: normalizedUrl
            };
        } catch (e) {
            return {
                isValid: false,
                rawUrl: urlString
            };
        }
    }

    function parseInput(text) {
        const lines = text.split('\n');
        const parsedTabs = [];
        let ignoredLinesCount = 0;
        
        const urlRegex = /(https?:\/\/[^\s"']+)/gi;
        // Also capture strings starting with common domains if pasted without protocol
        const fallbackUrlRegex = /([a-zA-Z0-9-]+\.[a-zA-Z]{2,20}(?:\/[^\s"']*)?)/gi;

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            let detectedUrl = null;
            let titlePart = '';

            // Match URL pattern
            urlRegex.lastIndex = 0;
            const match = urlRegex.exec(trimmed);
            if (match) {
                detectedUrl = match[1];
                // Extract whatever is left as title
                titlePart = trimmed.replace(detectedUrl, '').replace(/\[|\]|\(|\)/g, ' ').replace(/\s+/g, ' ').trim();
            } else {
                // Try fallback regex
                fallbackUrlRegex.lastIndex = 0;
                const fallbackMatch = fallbackUrlRegex.exec(trimmed);
                if (fallbackMatch) {
                    detectedUrl = fallbackMatch[1];
                    titlePart = trimmed.replace(detectedUrl, '').replace(/\[|\]|\(|\)/g, ' ').replace(/\s+/g, ' ').trim();
                }
            }

            if (!detectedUrl) {
                ignoredLinesCount++;
                return;
            }

            const cleanInfo = cleanAndNormalizeUrl(detectedUrl);
            if (!cleanInfo.isValid) {
                ignoredLinesCount++;
                return;
            }

            // Derive a user-friendly fallback title if none existed in text
            let finalTitle = titlePart;
            if (!finalTitle) {
                if (cleanInfo.path && cleanInfo.path !== '/') {
                    // Extract last path element or meaningful segment
                    const segments = cleanInfo.path.split('/').filter(Boolean);
                    if (segments.length > 0) {
                        finalTitle = segments.map(s => s.replace(/-|_/g, ' ')).join(' / ');
                    }
                }
                
                if (!finalTitle) {
                    finalTitle = cleanInfo.domain.split('.')[0];
                }
                
                // Capitalize
                finalTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);
            }

            parsedTabs.push({
                id: `tab-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
                title: finalTitle,
                rawUrl: cleanInfo.rawUrl,
                domain: cleanInfo.domain,
                path: cleanInfo.path,
                query: cleanInfo.query,
                cleanQuery: cleanInfo.cleanQuery,
                normalizedUrl: cleanInfo.normalizedUrl,
                protocol: cleanInfo.protocol
            });
        });

        if (ignoredLinesCount > 0) {
            showToast(`${ignoredLinesCount} line${ignoredLinesCount === 1 ? '' : 's'} ignored. No valid URL found.`, 'warning');
        }

        return parsedTabs;
    }

    // ----------------------------------------------------
    // 8. ANALYSIS & SCORING ENGINE
    // ----------------------------------------------------
    function runAnalysis(tabs) {
        // Step 1: Count domain frequencies
        const domainCounts = {};
        tabs.forEach(tab => {
            domainCounts[tab.domain] = (domainCounts[tab.domain] || 0) + 1;
        });

        // Step 2: Track normalized URLs to flag duplicates
        const normalizedSeen = {};
        
        // Step 3: Track path duplicates (same path on same domain, but query variables differ)
        const domainPathSeen = {};

        // Process each tab to determine attributes
        tabs.forEach(tab => {
            const norm = tab.normalizedUrl;
            
            // Check duplicates
            if (normalizedSeen[norm]) {
                tab.isDuplicate = true;
                tab.duplicateOfId = normalizedSeen[norm];
            } else {
                tab.isDuplicate = false;
                normalizedSeen[norm] = tab.id;
            }

            // Check domain path duplicates (useful for search pages, listings)
            const domPath = `${tab.domain}${tab.path}`;
            if (domainPathSeen[domPath]) {
                tab.isPathDuplicate = true;
                domainPathSeen[domPath].push(tab.id);
            } else {
                tab.isPathDuplicate = false;
                domainPathSeen[domPath] = [tab.id];
            }

            // Categorize based on domain
            tab.category = 'OTHER';
            for (const [catKey, catVal] of Object.entries(CATEGORIES)) {
                if (catKey === 'OTHER') continue;
                
                const matches = catVal.domains.some(d => {
                    return tab.domain === d || tab.domain.endsWith('.' + d);
                });
                
                if (matches) {
                    tab.category = catKey;
                    break;
                }
            }

            tab.isCluster = domainCounts[tab.domain] >= 5;
            tab.domainCount = domainCounts[tab.domain];
        });

        // Step 4: Calculate death scores and construct reasoning arrays
        tabs.forEach(tab => {
            let score = 0;
            const reasons = [];

            if (tab.isDuplicate) {
                score += 80;
                reasons.push('Exact duplicate URL');
            }

            if (tab.isCluster) {
                score += 25;
                reasons.push(`Domain cluster: ${tab.domainCount} tabs open for ${tab.domain}`);
            }

            // Category modifiers
            if (tab.category === 'ENTERTAINMENT') {
                score += 10;
                reasons.push('Entertainment site (high distraction index)');
            } else if (tab.category === 'SHOPPING') {
                score += 15;
                reasons.push('Shopping site (often forgotten cart/listings)');
            } else if (tab.category === 'SOCIAL') {
                score += 10;
                reasons.push('Social media feed tab');
            } else if (tab.category === 'NEWS') {
                score += 5;
                reasons.push('News article (likely read & forget)');
            }

            // URL modifiers
            if (tab.query && tab.query.length > 5) {
                score += 5;
                reasons.push('URL contains search query parameters');
            }

            if (tab.rawUrl.length > 100) {
                score += 5;
                reasons.push('Extremely long URL path');
            }

            // Path duplicates with different parameters (e.g. searching same site multiple times)
            if (!tab.isDuplicate && tab.isPathDuplicate) {
                score += 50;
                reasons.push('Duplicate path with different search parameters');
            }

            // Cap death score
            tab.deathScore = Math.min(score, 100);

            // Assign status label
            if (tab.deathScore <= 29) {
                tab.deathLabel = 'ALIVE';
                tab.deathStatusClass = 'status-alive';
            } else if (tab.deathScore <= 59) {
                tab.deathLabel = 'AT RISK';
                tab.deathStatusClass = 'status-risk';
            } else if (tab.deathScore <= 79) {
                tab.deathLabel = 'PROBABLY DEAD';
                tab.deathStatusClass = 'status-dead';
            } else {
                tab.deathLabel = 'BURY IT';
                tab.deathStatusClass = 'status-bury';
            }

            tab.reasons = reasons.length > 0 ? reasons : ['No elevated flags detected'];
        });

        return tabs;
    }

    // ----------------------------------------------------
    // 9. ANIMATED RESULTS DRAWING
    // ----------------------------------------------------
    function animateStat(element, targetValue) {
        let currentValue = 0;
        const duration = 800; // ms
        const frameRate = 1000 / 60; // 60 fps
        const totalFrames = duration / frameRate;
        const step = targetValue / totalFrames;
        
        const counter = setInterval(() => {
            currentValue += step;
            if (currentValue >= targetValue) {
                element.textContent = Math.round(targetValue);
                clearInterval(counter);
            } else {
                element.textContent = Math.round(currentValue);
            }
        }, frameRate);
    }

    function renderDashboardStats() {
        const totalCount = currentTabs.length;
        const duplicatesCount = currentTabs.filter(t => t.isDuplicate).length;
        const deadCount = currentTabs.filter(t => t.deathScore >= 60).length;
        
        // Count unique active categories
        const activeCats = new Set(currentTabs.map(t => t.category));
        const categoriesCount = activeCats.size;

        // Trigger animations
        animateStat(statTotal, totalCount);
        animateStat(statDuplicates, duplicatesCount);
        animateStat(statAtRisk, deadCount);
        animateStat(statCategories, categoriesCount);
    }

    function renderCategories() {
        categoriesGrid.innerHTML = '';
        
        // Calculate counts per category based on active tabs
        const categoryCounts = {};
        currentTabs.forEach(tab => {
            categoryCounts[tab.category] = (categoryCounts[tab.category] || 0) + 1;
        });

        // Filter and sort categories based on count
        const activeCategories = Object.entries(CATEGORIES)
            .filter(([key]) => categoryCounts[key] > 0)
            .sort((a, b) => categoryCounts[b[0]] - categoryCounts[a[0]]);

        activeCategories.forEach(([key, val]) => {
            const count = categoryCounts[key];
            const percent = (count / currentTabs.length) * 100;
            
            const card = document.createElement('div');
            card.className = `category-card ${activeCategoryFilter === key ? 'active' : ''}`;
            card.dataset.category = key;
            card.style.borderLeft = `3px solid ${val.color}`;

            card.innerHTML = `
                <div class="category-name">${val.name}</div>
                <div class="category-meta">
                    <span>${count} tab${count === 1 ? '' : 's'}</span>
                    <span>${Math.round(percent)}%</span>
                </div>
                <div class="category-bar-bg">
                    <div class="category-bar-fill" style="width: ${percent}%; background-color: ${val.color}"></div>
                </div>
            `;

            card.addEventListener('click', () => {
                toggleCategoryFilter(key);
            });

            categoriesGrid.appendChild(card);
        });
    }

    function toggleCategoryFilter(categoryKey) {
        if (activeCategoryFilter === categoryKey) {
            // Remove filter
            activeCategoryFilter = null;
            activeFilterBadge.classList.add('hidden');
        } else {
            // Set filter
            activeCategoryFilter = categoryKey;
            activeFilterBadge.querySelector('span').textContent = `Filter: ${CATEGORIES[categoryKey].name}`;
            activeFilterBadge.classList.remove('hidden');
        }
        
        // Highlight active card
        document.querySelectorAll('.category-card').forEach(card => {
            if (card.dataset.category === categoryKey && activeCategoryFilter !== null) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        renderGraveyardList();
    }

    clearFilterBtn.addEventListener('click', () => {
        activeCategoryFilter = null;
        activeFilterBadge.classList.add('hidden');
        document.querySelectorAll('.category-card').forEach(card => card.classList.remove('active'));
        renderGraveyardList();
    });

    // ----------------------------------------------------
    // 10. RENDER THE GRAVEYARD LIST
    // ----------------------------------------------------
    function renderGraveyardList() {
        graveyardList.innerHTML = '';
        
        // Filter tabs
        const filteredTabs = activeCategoryFilter 
            ? currentTabs.filter(t => t.category === activeCategoryFilter)
            : currentTabs;

        if (filteredTabs.length === 0) {
            graveyardEmptyState.classList.remove('hidden');
            // Check if there are no tabs globally or just in filter
            if (currentTabs.length === 0) {
                emptyStateTitle.textContent = 'GRAVEYARD EMPTY';
                emptyStateDesc.textContent = 'You did it. No tabs survived.';
            } else {
                emptyStateTitle.textContent = 'NO TABS MATCHING FILTER';
                emptyStateDesc.textContent = `All tabs in ${CATEGORIES[activeCategoryFilter].name} have been buried.`;
            }
            return;
        } else {
            graveyardEmptyState.classList.add('hidden');
        }

        filteredTabs.forEach(tab => {
            const card = document.createElement('div');
            card.className = `tab-card ${selectedIds.has(tab.id) ? 'selected' : ''}`;
            card.dataset.id = tab.id;

            // Simple SVG icon for fallback domain icon
            const domainSvgIcon = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            `;

            card.innerHTML = `
                <label class="checkbox-container" aria-label="Select tab card">
                    <input type="checkbox" ${selectedIds.has(tab.id) ? 'checked' : ''} data-id="${tab.id}">
                    <span class="checkmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </span>
                </label>
                <div class="tab-info">
                    <div class="tab-title-row">
                        <div class="tab-domain-icon" id="icon-container-${tab.id}">${domainSvgIcon}</div>
                        <span class="tab-title" title="${tab.title}">${tab.title}</span>
                    </div>
                    <div class="tab-url-path">
                        <span class="tab-domain">${tab.domain}</span>
                        <span class="tab-path">${tab.path === '/' ? '' : tab.path}</span>
                        <span class="tab-query">${tab.cleanQuery}</span>
                    </div>
                    <div class="tab-reason-container">
                        ${tab.reasons.map(r => `<span class="reason-tag">${r}</span>`).join('')}
                    </div>
                </div>
                <div class="tab-badge-col">
                    <span class="score-badge ${tab.deathStatusClass}">${tab.deathLabel}</span>
                    <span class="card-score-num">Death Score: ${tab.deathScore}</span>
                </div>
            `;

            // Setup asynchronous favicon load
            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${tab.domain}&sz=32`;
            img.className = 'tab-favicon';
            img.alt = 'Favicon';
            
            img.onload = () => {
                const container = document.getElementById(`icon-container-${tab.id}`);
                if (container) {
                    container.innerHTML = '';
                    container.appendChild(img);
                }
            };
            // On error we keep default domain SVG already in HTML

            // Handle card selection clicks
            card.addEventListener('click', (e) => {
                // Prevent toggle if clicking checkbox directly (that has separate native handler)
                if (e.target.closest('input[type="checkbox"]') || e.target.closest('a')) {
                    return;
                }
                toggleSelection(tab.id);
            });

            // Handle checkbox state changes
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                toggleSelection(tab.id);
            });

            graveyardList.appendChild(card);
        });

        updateSelectionStats();
    }

    function toggleSelection(tabId) {
        if (selectedIds.has(tabId)) {
            selectedIds.delete(tabId);
        } else {
            selectedIds.add(tabId);
        }
        
        // Re-toggle CSS class locally for speed without full re-render
        const card = document.querySelector(`.tab-card[data-id="${tabId}"]`);
        if (card) {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (selectedIds.has(tabId)) {
                card.classList.add('selected');
                checkbox.checked = true;
            } else {
                card.classList.remove('selected');
                checkbox.checked = false;
            }
        }
        
        updateSelectionStats();
    }

    function updateSelectionStats() {
        const selectedCount = selectedIds.size;
        selectedCountText.textContent = `${selectedCount} tab${selectedCount === 1 ? '' : 's'} selected`;
    }

    // ----------------------------------------------------
    // 11. BATCH SELECT SYSTEM
    // ----------------------------------------------------
    selectDeadBtn.addEventListener('click', () => {
        // Select all tabs with deathScore >= 60 in current filtered view
        const filteredTabs = activeCategoryFilter 
            ? currentTabs.filter(t => t.category === activeCategoryFilter)
            : currentTabs;

        filteredTabs.forEach(tab => {
            if (tab.deathScore >= 60) {
                selectedIds.add(tab.id);
            }
        });
        
        renderGraveyardList();
        showToast('Selected all dead and at-risk tabs.');
    });

    selectDuplicatesBtn.addEventListener('click', () => {
        // Select all duplicate tabs in current filtered view
        const filteredTabs = activeCategoryFilter 
            ? currentTabs.filter(t => t.category === activeCategoryFilter)
            : currentTabs;

        filteredTabs.forEach(tab => {
            if (tab.isDuplicate) {
                selectedIds.add(tab.id);
            }
        });

        renderGraveyardList();
        showToast('Selected all exact duplicate tabs.');
    });

    selectNoneBtn.addEventListener('click', () => {
        selectedIds.clear();
        renderGraveyardList();
        showToast('Selection cleared.');
    });

    // ----------------------------------------------------
    // 12. BURY ACTION & CRUMBLE PARTICLES
    // ----------------------------------------------------
    function createAshParticles(x, y, color) {
        const particlesCount = 12;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('span');
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = `${Math.random() * 6 + 3}px`;
            particle.style.height = `${Math.random() * 6 + 3}px`;
            particle.style.backgroundColor = color || '#ef4444';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';
            particle.style.opacity = '1';
            
            // Random direction angles
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 60 + 30; // distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - (Math.random() * 40 + 20); // float up bias

            document.body.appendChild(particle);

            // Animate using Web Animations API
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: Math.random() * 600 + 400,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }

    buryBtn.addEventListener('click', () => {
        if (selectedIds.size === 0) {
            showToast('No tabs selected to bury.', 'warning');
            return;
        }

        const countToBury = selectedIds.size;
        const cardsToAnimate = [];

        // 1. Gather coordinates to trigger crumble particles
        selectedIds.forEach(id => {
            const cardEl = document.querySelector(`.tab-card[data-id="${id}"]`);
            if (cardEl) {
                cardsToAnimate.push(cardEl);
                const rect = cardEl.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Fetch badge status for color selection
                const tabData = currentTabs.find(t => t.id === id);
                const particleColor = tabData && tabData.deathScore >= 80 ? '#ef4444' : '#fb923c';

                // Spawn particles delayed slightly to simulate crumble
                setTimeout(() => {
                    createAshParticles(centerX, centerY, particleColor);
                }, Math.random() * 150);
            }
        });

        // 2. Add 'burying' CSS animations to selected cards
        cardsToAnimate.forEach(card => {
            card.classList.add('burying');
        });

        // 3. After collapse phase starts (600ms)
        setTimeout(() => {
            cardsToAnimate.forEach(card => {
                card.classList.remove('burying');
                card.classList.add('collapsing');
            });
        }, 600);

        // 4. Finally clean data structures and fully refresh lists (900ms total)
        setTimeout(() => {
            // Remove buried tabs from state
            currentTabs = currentTabs.filter(tab => !selectedIds.has(tab.id));
            selectedIds.clear();

            // Recalculate frequencies and updates
            // (Note: This prevents domain cluster warnings from hanging around if cluster is broken!)
            runAnalysis(currentTabs);

            // Re-render
            renderDashboardStats();
            renderCategories();
            renderGraveyardList();
            
            showToast(`${countToBury} tab${countToBury === 1 ? '' : 's'} buried.`);
            
            // Show secondary custom toast alert message
            setTimeout(() => {
                showToast('"Your browser feels lighter already."', 'success');
            }, 800);
        }, 900);
    });

    // ----------------------------------------------------
    // 13. survivors EXPORT & CLIPBOARD COPY
    // ----------------------------------------------------
    copySurvivorsBtn.addEventListener('click', () => {
        if (currentTabs.length === 0) {
            showToast('No survivors left to copy.', 'error');
            return;
        }

        const survivorUrls = currentTabs.map(t => t.rawUrl).join('\n');
        
        navigator.clipboard.writeText(survivorUrls).then(() => {
            showToast('Surviving tabs copied to clipboard.');
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
            showToast('Failed to copy. Clipboard permission denied.', 'error');
        });
    });

    exportTxtBtn.addEventListener('click', () => {
        if (currentTabs.length === 0) {
            showToast('No survivors left to export.', 'error');
            return;
        }

        const fileContent = currentTabs.map(t => t.rawUrl).join('\n');
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'surviving-tabs.txt';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);  
        }, 0);

        showToast('Exported surviving-tabs.txt successfully.');
    });

    // ----------------------------------------------------
    // 14. INITIATE ANALYSIS ACTION
    // ----------------------------------------------------
    analyzeBtn.addEventListener('click', () => {
        const text = tabTextarea.value.trim();
        if (!text) {
            showToast('Console buffer is empty. Paste some URLs first.', 'error');
            return;
        }

        // Parse and calculate rules
        allTabs = parseInput(text);
        
        if (allTabs.length === 0) {
            showToast('No valid URLs recognized. Try formatting your paste.', 'error');
            return;
        }

        // Clone tabs list to maintain mutation state
        currentTabs = JSON.parse(JSON.stringify(allTabs));
        
        // Initialize filters and selections
        selectedIds.clear();
        activeCategoryFilter = null;
        activeFilterBadge.classList.add('hidden');

        // Analyze elements
        runAnalysis(currentTabs);

        // Transition Dashboard
        resultsContainer.classList.remove('hidden');
        
        // Smooth scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });

        // Populate elements
        renderDashboardStats();
        renderCategories();
        renderGraveyardList();

        showToast(`${allTabs.length} tab${allTabs.length === 1 ? '' : 's'} parsed & analyzed.`);
    });

    // ----------------------------------------------------
    // 15. UTILITY ACTIONS (CLEAR & DEMO DATA)
    // ----------------------------------------------------
    demoBtn.addEventListener('click', () => {
        tabTextarea.value = DEMO_TABS_TEXT;
        // Trigger textarea input event to recalculate counts
        tabTextarea.dispatchEvent(new Event('input'));
        showToast('Example URL dataset loaded.');
    });

    function resetApplication() {
        tabTextarea.value = '';
        tabCounter.textContent = '0 tabs detected';
        allTabs = [];
        currentTabs = [];
        selectedIds.clear();
        activeCategoryFilter = null;
        activeFilterBadge.classList.add('hidden');
        resultsContainer.classList.add('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Console buffer and stats cleared.');
    }

    clearBtn.addEventListener('click', resetApplication);
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ----------------------------------------------------
    // 16. TAMPER PROTECTION SYSTEM (SECURITY)
    // ----------------------------------------------------
    function initSecurityCheck() {
        const checkIntegrity = () => {
            const headerBtn = document.getElementById('headerBmcBtn');
            const footerBtn = document.getElementById('footerBmcBtn');
            
            let isTampered = false;
            
            if (!headerBtn || !footerBtn) {
                isTampered = true;
            } else {
                const headerHref = headerBtn.getAttribute('href');
                const footerHref = footerBtn.getAttribute('href');
                
                // Verify URL destination matches the target developer account
                if (!headerHref || !headerHref.startsWith('https://buymeacoffee.com/danielpark12')) {
                    isTampered = true;
                }
                if (!footerHref || !footerHref.startsWith('https://buymeacoffee.com/danielpark12')) {
                    isTampered = true;
                }
                
                // Verify elements aren't hidden by display/visibility/opacity
                const headerStyle = window.getComputedStyle(headerBtn);
                const footerStyle = window.getComputedStyle(footerBtn);
                
                if (headerStyle.display === 'none' || 
                    headerStyle.visibility === 'hidden' || 
                    parseFloat(headerStyle.opacity) === 0) {
                    isTampered = true;
                }
                
                if (footerStyle.display === 'none' || 
                    footerStyle.visibility === 'hidden' || 
                    parseFloat(footerStyle.opacity) === 0) {
                    isTampered = true;
                }
                
                // Verify bounding boxes have positive area (no height/width zeroing)
                const headerRect = headerBtn.getBoundingClientRect();
                const footerRect = footerBtn.getBoundingClientRect();
                if (headerRect.width === 0 || headerRect.height === 0 || 
                    footerRect.width === 0 || footerRect.height === 0) {
                    isTampered = true;
                }
            }
            
            if (isTampered) {
                triggerTamperState();
            }
        };
        
        function triggerTamperState() {
            // Unbind key actions to disable programmatic bypassing
            window.parseInput = () => [];
            window.runAnalysis = () => {};
            
            // Scrub standard content and render terminal block screen
            document.body.innerHTML = '';
            
            const overlay = document.createElement('div');
            overlay.className = 'tamper-overlay';
            overlay.innerHTML = `
                <div class="tamper-box">
                    <div class="tamper-header">
                        <span class="tamper-dot"></span>
                        <span class="tamper-dot"></span>
                        <span class="tamper-dot"></span>
                        <span class="tamper-title">INTEGRITY_COMPROMISED.log</span>
                    </div>
                    <div class="tamper-body">
                        <div class="tamper-icon">☠</div>
                        <h2>TAMPER DETECTED</h2>
                        <p class="tamper-message">
                            Attribution links or donation badges have been modified or removed. This web app requires original creator credits to operate.
                        </p>
                        <p class="tamper-action-hint">
                            Please restore the original developer credits and "Buy Me a Coffee" links to continue using Tab Graveyard.
                        </p>
                        <a href="https://buymeacoffee.com/danielpark12" target="_blank" rel="noopener noreferrer" class="btn btn-bmc buy-me-a-coffee" style="display:inline-flex;align-items:center;padding:12px 20px;text-decoration:none;border-radius:4px;font-weight:700;">
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;margin-right:8px;vertical-align:middle;">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                <line x1="6" y1="2" x2="6" y2="4"></line>
                                <line x1="10" y1="2" x2="10" y2="4"></line>
                                <line x1="14" y1="2" x2="14" y2="4"></line>
                            </svg>
                            <span style="vertical-align:middle;color:#000;">Buy Me a Coffee</span>
                        </a>
                    </div>
                </div>
            `;
            
            // Screen constraints styling
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.width = '100vw';
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';
            document.body.style.background = '#06070a';
            document.body.style.display = 'flex';
            document.body.style.alignItems = 'center';
            document.body.style.justifyContent = 'center';
            
            document.body.appendChild(overlay);
            
            // Absolute block on user hotkeys and menus
            const blockEvent = (e) => {
                e.preventDefault();
                e.stopPropagation();
            };
            document.addEventListener('keydown', blockEvent, true);
            document.addEventListener('contextmenu', blockEvent, true);
        }
        
        // Wait initially for layout styles to compute, then check
        setTimeout(checkIntegrity, 800);
        
        // Loop checks as redundancy
        setInterval(checkIntegrity, 3500);
        
        // Hook MutationObserver to detect attributes modifications or node deletions
        const observer = new MutationObserver(() => {
            checkIntegrity();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'href', 'hidden']
        });
    }

    if (document.readyState === 'complete') {
        initSecurityCheck();
    } else {
        window.addEventListener('load', initSecurityCheck);
    }
});


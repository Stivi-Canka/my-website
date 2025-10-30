/**
 * Dynamic Updates Loader
 * Automatically loads and displays updates from JSON files in chronological order
 */

class UpdatesLoader {
    constructor() {
        this.updates = [];
        this.allUpdates = []; // Store all updates for filtering
        this.updatesContainer = null;
        this.isLoading = false;
        this.showFeaturedOnly = false;
    }

    /**
     * Initialize the updates loader
     * @param {string} containerSelector - CSS selector for the updates container
     */
    async init(containerSelector = '.updates-timeline') {
        this.updatesContainer = document.querySelector(containerSelector);
        if (!this.updatesContainer) {
            console.error('Updates container not found:', containerSelector);
            return;
        }

        try {
            console.log('Initializing updates loader...');
            await this.loadUpdates();
            console.log('Updates loaded successfully:', this.updates.length);
            
            this.renderUpdates();
            this.initializeAnimations();
        } catch (error) {
            console.error('Error initializing updates:', error);
            const errorMessage = error instanceof Error 
                ? `Failed to load updates: ${error.message}` 
                : 'Failed to load updates. Please check your internet connection and try again.';
            this.showError(errorMessage);
        }
    }

    /**
     * Load all update files from the updates directory
     */
    async loadUpdates() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // List of updates - supports both old single files and new folder structure
            const updateFiles = [
                // New folder-based updates
                'albanian-trailblazers-in-person-event/metadata.json',
                'data-ai-tirana-webinar-collaboration/metadata.json',
                'albanian-trailblazers-incorporated/metadata.json',
                'albanian-trailblazers-linkedin-launch/metadata.json',
                'honors-thesis-award/metadata.json',
                'douglas-mackay-award/metadata.json',
                'graduation-university-medal/metadata.json',
                'kpmg-technology-risk-consultant/metadata.json',
                'td-securities-market-risk-analyst/metadata.json',
                'td-bank-financial-analyst/metadata.json',
                'bank-of-canada-governors-challenge/metadata.json',
                'dalhousie-quantitative-finance-workshops/metadata.json',
                // Add new updates here when you create them
                // '2024-12-20-new-update/metadata.json',
                // '2024-12-25-holiday-update/metadata.json'
            ];

            console.log('Loading update files:', updateFiles);

            if (updateFiles.length === 0) {
                console.log('No update files found');
                this.updates = [];
                return;
            }

            const updatePromises = updateFiles.map(file => this.loadUpdateFile(file));
            const loadedUpdates = await Promise.all(updatePromises);
            
            // Filter out any failed loads and sort by date
            this.allUpdates = loadedUpdates
                .filter(update => update !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Apply current filter
            this.applyFilter();

        } catch (error) {
            console.error('Error loading updates:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }


    /**
     * Get the base path for update files
     * @returns {string} Base path
     */
    getBasePath() {
        const isOnUpdatesPage = window.location.pathname.includes('updates.html');
        return isOnUpdatesPage ? '../updates/' : 'updates/';
    }

    /**
     * Get the correct path for images
     * @param {string} imageUrl - Image URL from update data
     * @param {string} updateId - Update ID for folder-based images
     * @returns {string} Full image path
     */
    getImagePath(imageUrl, updateId = null) {
        // If imageUrl is already a full URL, return as is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        
        // If imageUrl starts with '/', it's an absolute path from root
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        
        // Determine base path based on current page
        const isOnUpdatesPage = window.location.pathname.includes('updates.html');
        const basePath = isOnUpdatesPage ? '../' : '';
        
        // If updateId is provided and imageUrl doesn't contain '/', it's a folder-based image
        if (updateId && !imageUrl.includes('/')) {
            return `${basePath}updates/${updateId}/${imageUrl}`;
        }
        
        // Otherwise, treat as relative path
        return `${basePath}${imageUrl}`;
    }

    /**
     * Load a single update file
     * @param {string} filename - Name of the update file
     * @returns {Object|null} Update object or null if failed
     */
    async loadUpdateFile(filename) {
        try {
            // Determine the correct path based on current page location
            const isOnUpdatesPage = window.location.pathname.includes('updates.html');
            const basePath = isOnUpdatesPage ? '../updates/' : 'updates/';
            const fullPath = `${basePath}${filename}`;
            
            console.log(`Loading update file: ${fullPath}`);
            const response = await fetch(`${fullPath}?t=${Date.now()}`);
            if (!response.ok) {
                console.warn(`Failed to load update file: ${filename} (Status: ${response.status})`);
                return null;
            }
            const data = await response.json();
            console.log(`Successfully loaded: ${filename}`);
            return data;
        } catch (error) {
            console.error(`Error loading update file ${filename}:`, error);
            return null;
        }
    }

    /**
     * Render all updates to the DOM
     */
    renderUpdates() {
        if (!this.updatesContainer || this.updates.length === 0) {
            this.showEmptyState();
            return;
        }

        // Clear existing content
        this.updatesContainer.innerHTML = '';

        // Render each update
        this.updates.forEach((update, index) => {
            const updateElement = this.createUpdateElement(update, index);
            this.updatesContainer.appendChild(updateElement);
        });
    }

    /**
     * Create DOM element for a single update
     * @param {Object} update - Update data object
     * @param {number} index - Index for animation delay
     * @returns {HTMLElement} Update DOM element
     */
    createUpdateElement(update, index) {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.setAttribute('data-update-id', update.id);
        
        // Add featured class if applicable
        if (update.featured === true) {
            updateItem.classList.add('featured');
        }

        // Format date for display
        const displayDate = this.formatDate(update.date);

        // Build image HTML if present (supports both old and new formats)
        let imageHtml = '';
        if (update.images && update.images.length > 0) {
            // New folder structure - use first image as hero image
            const heroImage = update.images[0];
            const imagePath = this.getImagePath(heroImage, update.id);
            imageHtml = `
                <div class="update-image-container">
                    <img src="${imagePath}" alt="${this.escapeHtml(update.title)}" class="update-image" loading="lazy">
                </div>
            `;
        } else if (update.image && update.image.url) {
            // Legacy single-file format
            const imagePath = this.getImagePath(update.image.url);
            imageHtml = `
                <div class="update-image-container">
                    <img src="${imagePath}" alt="${this.escapeHtml(update.image.alt || '')}" class="update-image" loading="lazy">
                    ${update.image.caption ? `<div class="update-image-caption">${this.escapeHtml(update.image.caption)}</div>` : ''}
                </div>
            `;
        }

        updateItem.innerHTML = `
            <div class="update-content" onclick="toggleExpand(this)">
                <div class="update-date">${displayDate}</div>
                <h3>${this.escapeHtml(update.title)}</h3>
                <div class="update-preview">${this.escapeHtml(update.preview)}</div>
                <div class="update-full-text">
                    ${this.escapeHtml(update.fullText)}
                    ${imageHtml}
                </div>
                <span class="read-more-btn">Read more</span>
            </div>
        `;

        // Add animation delay
        updateItem.style.animationDelay = `${index * 0.2}s`;

        return updateItem;
    }


    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML safe string
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Initialize scroll animations with Intersection Observer
     * Uses consistent animation configuration across loaders
     */
    initializeAnimations() {
        const updateItems = document.querySelectorAll('.update-item');
        const ANIMATION_DELAY = 200;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * ANIMATION_DELAY);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        updateItems.forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Show empty state when no updates are available
     */
    showEmptyState() {
        if (!this.updatesContainer) return;
        
        this.updatesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No updates available</h3>
                <p>Check back later for new updates!</p>
            </div>
        `;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (!this.updatesContainer) return;
        
        this.updatesContainer.innerHTML = `
            <div class="error-state">
                <h3>Error Loading Updates</h3>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }

    /**
     * Add a new update (for future use with admin interface)
     * @param {Object} updateData - New update data
     */
    async addUpdate(updateData) {
        // This would be implemented for dynamic addition of updates
        // For now, updates are added by creating new JSON files
        console.log('To add a new update, create a new JSON file in the updates/ directory');
    }

    /**
     * Apply current filter to updates
     */
    applyFilter() {
        if (this.showFeaturedOnly) {
            this.updates = this.allUpdates.filter(update => update.featured === true);
        } else {
            this.updates = [...this.allUpdates];
        }
    }

    /**
     * Toggle featured filter
     */
    toggleFeaturedFilter() {
        this.showFeaturedOnly = !this.showFeaturedOnly;
        this.applyFilter();
        this.renderUpdates();
        this.initializeAnimations();
        
        // Update button state
        const filterBtn = document.getElementById('featured-filter');
        if (filterBtn) {
            if (this.showFeaturedOnly) {
                filterBtn.classList.add('active');
            } else {
                filterBtn.classList.remove('active');
            }
        }
    }

    /**
     * Refresh updates (reload from files)
     */
    async refresh() {
        await this.loadUpdates();
        this.renderUpdates();
        this.initializeAnimations();
    }
}

// Global toggle function for expandable content
function toggleExpand(element) {
    const readMoreBtn = element.querySelector('.read-more-btn');
    if (element.classList.contains('expanded')) {
        element.classList.remove('expanded');
        readMoreBtn.textContent = 'Read more';
    } else {
        element.classList.add('expanded');
        readMoreBtn.textContent = 'Read less';
    }
}

// Global variables
let updatesLoader = null;

// Global function for filter button
function toggleFeaturedFilter() {
    if (updatesLoader) {
        updatesLoader.toggleFeaturedFilter();
    }
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on updates page
    if (document.querySelector('.updates-timeline')) {
        updatesLoader = new UpdatesLoader();
        
        // Add a small delay to ensure page is fully loaded
        setTimeout(() => {
            updatesLoader.init();
        }, 100);
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpdatesLoader;
}

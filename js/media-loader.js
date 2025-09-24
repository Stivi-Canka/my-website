/**
 * Dynamic Media Loader
 * Automatically loads and displays media entries from JSON files in chronological order
 */

class MediaLoader {
    constructor() {
        this.mediaEntries = [];
        this.mediaContainer = null;
        this.isLoading = false;
    }

    /**
     * Initialize the media loader
     * @param {string} containerSelector - CSS selector for the media container
     */
    async init(containerSelector = '.media-list') {
        this.mediaContainer = document.querySelector(containerSelector);
        if (!this.mediaContainer) {
            console.error('Media container not found:', containerSelector);
            return;
        }

        try {
            console.log('Initializing media loader...');
            await this.loadMediaEntries();
            console.log('Media entries loaded successfully:', this.mediaEntries.length);
            
            this.renderMediaEntries();
            this.initializeAnimations();
        } catch (error) {
            console.error('Error initializing media entries:', error);
            this.showError('Failed to load media entries. Please check your internet connection and try again.');
        }
    }

    /**
     * Load all media files from the media directory
     */
    async loadMediaEntries() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Simple hardcoded list of media files - just update this array when you add/remove files
            const mediaFiles = [
                '2025-01-29-data-scientist.json',
                '2024-06-01-canada-university.json',
                '2024-05-29-university-medal.json',
                '2024-04-09-poster-prize.json',
                '2024-02-27-maxwell-scholarship.json',
                '2023-11-30-boc-governors-challenge.json',
                '2018-11-01-gold-medal-asia.json',
                // Add new files here when you create them
                // '2024-12-20-new-media.json',
                // '2024-12-25-holiday-feature.json'
            ];

            console.log('Loading media files:', mediaFiles);

            if (mediaFiles.length === 0) {
                console.log('No media files found');
                this.mediaEntries = [];
                return;
            }

            const mediaPromises = mediaFiles.map(file => this.loadMediaFile(file));
            const loadedMedia = await Promise.all(mediaPromises);
            
            // Filter out any failed loads and sort by date (most recent first)
            this.mediaEntries = loadedMedia
                .filter(media => media !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            console.error('Error loading media entries:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get the base path for media files
     * @returns {string} Base path
     */
    getBasePath() {
        const isOnMediaPage = window.location.pathname.includes('media.html');
        return isOnMediaPage ? '../media/' : 'media/';
    }

    /**
     * Load a single media file
     * @param {string} filename - Name of the media file
     * @returns {Object|null} Media object or null if failed
     */
    async loadMediaFile(filename) {
        try {
            // Determine the correct path based on current page location
            const isOnMediaPage = window.location.pathname.includes('media.html');
            const basePath = isOnMediaPage ? '../media/' : 'media/';
            const fullPath = `${basePath}${filename}`;
            
            console.log(`Loading media file: ${fullPath}`);
            const response = await fetch(`${fullPath}?t=${Date.now()}`);
            if (!response.ok) {
                console.warn(`Failed to load media file: ${filename} (Status: ${response.status})`);
                return null;
            }
            const data = await response.json();
            console.log(`Successfully loaded: ${filename}`);
            return data;
        } catch (error) {
            console.error(`Error loading media file ${filename}:`, error);
            return null;
        }
    }

    /**
     * Render all media entries to the DOM
     */
    renderMediaEntries() {
        if (!this.mediaContainer || this.mediaEntries.length === 0) {
            this.showEmptyState();
            return;
        }

        // Clear existing content
        this.mediaContainer.innerHTML = '';

        // Render each media entry
        this.mediaEntries.forEach((media, index) => {
            const mediaElement = this.createMediaElement(media, index);
            this.mediaContainer.appendChild(mediaElement);
        });
    }

    /**
     * Create DOM element for a single media entry
     * @param {Object} media - Media data object
     * @param {number} index - Index for animation delay
     * @returns {HTMLElement} Media DOM element
     */
    createMediaElement(media, index) {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.setAttribute('data-media-id', media.id);
        
        // Add featured class if applicable
        if (media.featured === true) {
            mediaItem.classList.add('featured');
        }

        // Format date for display
        const displayDate = this.formatDate(media.date);

        mediaItem.innerHTML = `
            <a href="${this.escapeHtml(media.link)}" class="media-link" target="_blank" rel="noopener noreferrer">
                <span class="media-title">${this.escapeHtml(media.title)}</span>
                <span class="media-year">${displayDate}</span>
            </a>
        `;

        // Add animation delay
        mediaItem.style.animationDelay = `${index * 0.2}s`;

        return mediaItem;
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
            month: 'long'
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Initialize scroll animations
     */
    initializeAnimations() {
        const mediaItems = document.querySelectorAll('.media-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        mediaItems.forEach(item => {
            observer.observe(item);
        });
    }

    /**
     * Show empty state when no media entries are available
     */
    showEmptyState() {
        if (!this.mediaContainer) return;
        
        this.mediaContainer.innerHTML = `
            <div class="empty-state">
                <h3>No media entries available</h3>
                <p>Check back later for new media coverage!</p>
            </div>
        `;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (!this.mediaContainer) return;
        
        this.mediaContainer.innerHTML = `
            <div class="error-state">
                <h3>Error Loading Media</h3>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }

    /**
     * Add a new media entry (for future use with admin interface)
     * @param {Object} mediaData - New media data
     */
    async addMediaEntry(mediaData) {
        // This would be implemented for dynamic addition of media entries
        // For now, media entries are added by creating new JSON files
        console.log('To add a new media entry, create a new JSON file in the media/ directory');
    }

    /**
     * Refresh media entries (reload from files)
     */
    async refresh() {
        await this.loadMediaEntries();
        this.renderMediaEntries();
        this.initializeAnimations();
    }
}

// Global variables
let mediaLoader = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on media page
    if (document.querySelector('.media-list')) {
        mediaLoader = new MediaLoader();
        
        // Add a small delay to ensure page is fully loaded
        setTimeout(() => {
            mediaLoader.init();
        }, 100);
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaLoader;
}

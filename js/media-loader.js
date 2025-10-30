class MediaLoader {
    constructor() {
        this.mediaEntries = [];
        this.mediaContainer = null;
        this.isLoading = false;
    }

    async init(containerSelector = '.media-list') {
        this.mediaContainer = document.querySelector(containerSelector);
        if (!this.mediaContainer) return;

        try {
            await this.loadMediaEntries();
            this.renderMediaEntries();
            this.initializeAnimations();
        } catch (error) {
            this.showError('Failed to load media entries');
        }
    }

    async loadMediaEntries() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const mediaFiles = [
                '2025-01-29-data-scientist.json',
                '2024-06-01-canada-university.json',
                '2024-05-29-university-medal.json',
                '2024-04-09-poster-prize.json',
                '2024-02-27-maxwell-scholarship.json',
                '2023-11-30-boc-governors-challenge.json',
                '2018-11-01-gold-medal-asia.json'
            ];

            if (mediaFiles.length === 0) {
                this.mediaEntries = [];
                return;
            }

            const mediaPromises = mediaFiles.map(file => this.loadMediaFile(file));
            const loadedMedia = await Promise.all(mediaPromises);
            
            this.mediaEntries = loadedMedia
                .filter(media => media !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    getBasePath() {
        const isOnMediaPage = window.location.pathname.includes('media.html');
        return isOnMediaPage ? '../media/' : 'media/';
    }

    async loadMediaFile(filename) {
        try {
            const isOnMediaPage = window.location.pathname.includes('media.html');
            const basePath = isOnMediaPage ? '../media/' : 'media/';
            const fullPath = `${basePath}${filename}`;
            
            const response = await fetch(`${fullPath}?t=${Date.now()}`);
            if (!response.ok) return null;
            
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    renderMediaEntries() {
        if (!this.mediaContainer || this.mediaEntries.length === 0) {
            this.showEmptyState();
            return;
        }

        this.mediaContainer.innerHTML = '';

        this.mediaEntries.forEach((media, index) => {
            const mediaElement = this.createMediaElement(media, index);
            this.mediaContainer.appendChild(mediaElement);
        });
    }

    createMediaElement(media, index) {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.setAttribute('data-media-id', media.id);
        
        if (media.featured === true) {
            mediaItem.classList.add('featured');
        }

        const displayDate = this.formatDate(media.date);

        mediaItem.innerHTML = `
            <a href="${this.escapeHtml(media.link)}" class="media-link" target="_blank" rel="noopener noreferrer">
                <span class="media-title">${this.escapeHtml(media.title)}</span>
                <span class="media-year">${displayDate}</span>
            </a>
        `;

        mediaItem.style.animationDelay = `${index * 0.2}s`;

        return mediaItem;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    initializeAnimations() {
        const mediaItems = document.querySelectorAll('.media-item');
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
        
        mediaItems.forEach(item => {
            observer.observe(item);
        });
    }

    showEmptyState() {
        if (!this.mediaContainer) return;
        
        this.mediaContainer.innerHTML = `
            <div class="empty-state">
                <h3>No media entries available</h3>
                <p>Check back later for new media coverage!</p>
            </div>
        `;
    }

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

    async addMediaEntry(mediaData) {
        // Placeholder for future functionality
    }

    async refresh() {
        await this.loadMediaEntries();
        this.renderMediaEntries();
        this.initializeAnimations();
    }
}

let mediaLoader = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.media-list')) {
        mediaLoader = new MediaLoader();
        setTimeout(() => {
            mediaLoader.init();
        }, 100);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaLoader;
}

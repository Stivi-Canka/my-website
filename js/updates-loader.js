class UpdatesLoader {
    constructor() {
        this.updates = [];
        this.allUpdates = [];
        this.updatesContainer = null;
        this.isLoading = false;
        this.showFeaturedOnly = false;
    }

    async init(containerSelector = '.updates-timeline') {
        this.updatesContainer = document.querySelector(containerSelector);
        if (!this.updatesContainer) return;

        try {
            await this.loadUpdates();
            this.renderUpdates();
            this.initializeAnimations();
        } catch (error) {
            this.showError('Failed to load updates');
        }
    }

    async loadUpdates() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const updateFiles = [
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
                'dalhousie-quantitative-finance-workshops/metadata.json'
            ];

            if (updateFiles.length === 0) {
                this.updates = [];
                return;
            }

            const updatePromises = updateFiles.map(file => this.loadUpdateFile(file));
            const loadedUpdates = await Promise.all(updatePromises);
            
            this.allUpdates = loadedUpdates
                .filter(update => update !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            this.applyFilter();

        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    getBasePath() {
        const isOnUpdatesPage = window.location.pathname.includes('updates.html');
        return isOnUpdatesPage ? '../updates/' : 'updates/';
    }

    getImagePath(imageUrl, updateId = null) {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        
        if (imageUrl.startsWith('/')) {
            return imageUrl;
        }
        
        const isOnUpdatesPage = window.location.pathname.includes('updates.html');
        const basePath = isOnUpdatesPage ? '../' : '';
        
        if (updateId && !imageUrl.includes('/')) {
            return `${basePath}updates/${updateId}/${imageUrl}`;
        }
        
        return `${basePath}${imageUrl}`;
    }

    async loadUpdateFile(filename) {
        try {
            const isOnUpdatesPage = window.location.pathname.includes('updates.html');
            const basePath = isOnUpdatesPage ? '../updates/' : 'updates/';
            const fullPath = `${basePath}${filename}`;
            
            const response = await fetch(`${fullPath}?t=${Date.now()}`);
            if (!response.ok) return null;
            
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    renderUpdates() {
        if (!this.updatesContainer || this.updates.length === 0) {
            this.showEmptyState();
            return;
        }

        this.updatesContainer.innerHTML = '';

        this.updates.forEach((update, index) => {
            const updateElement = this.createUpdateElement(update, index);
            this.updatesContainer.appendChild(updateElement);
        });
    }

    createUpdateElement(update, index) {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.setAttribute('data-update-id', update.id);
        
        if (update.featured === true) {
            updateItem.classList.add('featured');
        }

        const displayDate = this.formatDate(update.date);

        let imageHtml = '';
        if (update.images && update.images.length > 0) {
            const heroImage = update.images[0];
            const imagePath = this.getImagePath(heroImage, update.id);
            imageHtml = `
                <div class="update-image-container">
                    <img src="${imagePath}" alt="${this.escapeHtml(update.title)}" class="update-image" loading="lazy">
                </div>
            `;
        } else if (update.image && update.image.url) {
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

        updateItem.style.animationDelay = `${index * 0.2}s`;

        return updateItem;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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

    showEmptyState() {
        if (!this.updatesContainer) return;
        
        this.updatesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No updates available</h3>
                <p>Check back later for new updates!</p>
            </div>
        `;
    }

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

    async addUpdate(updateData) {
        // Placeholder for future functionality
    }

    applyFilter() {
        if (this.showFeaturedOnly) {
            this.updates = this.allUpdates.filter(update => update.featured === true);
        } else {
            this.updates = [...this.allUpdates];
        }
    }

    toggleFeaturedFilter() {
        this.showFeaturedOnly = !this.showFeaturedOnly;
        this.applyFilter();
        this.renderUpdates();
        this.initializeAnimations();
        
        const filterBtn = document.getElementById('featured-filter');
        if (filterBtn) {
            if (this.showFeaturedOnly) {
                filterBtn.classList.add('active');
            } else {
                filterBtn.classList.remove('active');
            }
        }
    }

    async refresh() {
        await this.loadUpdates();
        this.renderUpdates();
        this.initializeAnimations();
    }
}

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

let updatesLoader = null;

function toggleFeaturedFilter() {
    if (updatesLoader) {
        updatesLoader.toggleFeaturedFilter();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.updates-timeline')) {
        updatesLoader = new UpdatesLoader();
        setTimeout(() => {
            updatesLoader.init();
        }, 100);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpdatesLoader;
}

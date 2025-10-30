/**
 * Dynamic Project Loader
 * Automatically loads and displays project entries from JSON files in chronological order
 */

class ProjectLoader {
    constructor() {
        this.projectEntries = [];
        this.projectContainer = null;
        this.isLoading = false;
        this.currentProjectIndex = 0;
        this.currentImageIndex = 0;
    }

    /**
     * Initialize the project loader
     * @param {string} containerSelector - CSS selector for the project container
     */
    async init(containerSelector = '.projects-grid') {
        this.projectContainer = document.querySelector(containerSelector);
        if (!this.projectContainer) {
            console.error('Project container not found:', containerSelector);
            return;
        }

        try {
            console.log('Initializing project loader...');
            await this.loadProjectEntries();
            console.log('Project entries loaded successfully:', this.projectEntries.length);
            
            this.renderProjectEntries();
            this.initializeAnimations();
            this.initializeModal();
        } catch (error) {
            console.error('Error initializing project entries:', error);
            const errorMessage = error instanceof Error 
                ? `Failed to load projects: ${error.message}` 
                : 'Failed to load project entries. Please check your internet connection and try again.';
            this.showError(errorMessage);
        }
    }

    /**
     * Load all project files from the projects directory
     */
    async loadProjectEntries() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Simple hardcoded list of project files - just update this array when you add/remove files
            const projectFiles = [
                '2025-02-15-bank-of-canada-governors-challenge.json',
                'albanian-trailblazers.json',
                '2024-09-15-dalhousie-quantitative-finance-society.json',
                '2024-03-26-academic-thesis.json'
                // Add new files here when you create them
                // '2024-12-20-new-project.json',
                // '2024-12-25-holiday-project.json'
            ];

            console.log('Loading project files:', projectFiles);

            if (projectFiles.length === 0) {
                console.log('No project files found');
                this.projectEntries = [];
                return;
            }

            const projectPromises = projectFiles.map(file => this.loadProjectFile(file));
            const loadedProjects = await Promise.all(projectPromises);
            
            // Filter out any failed loads and sort by date (most recent first)
            this.projectEntries = loadedProjects
                .filter(project => project !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            console.error('Error loading project entries:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get the base path for project files
     * @returns {string} Base path
     */
    getBasePath() {
        const isOnProjectsPage = window.location.pathname.includes('projects.html');
        return isOnProjectsPage ? '../projects/' : 'projects/';
    }

    /**
     * Load a single project file
     * @param {string} filename - Name of the project file
     * @returns {Object|null} Project object or null if failed
     */
    async loadProjectFile(filename) {
        try {
            // Determine the correct path based on current page location
            const isOnProjectsPage = window.location.pathname.includes('projects.html');
            const basePath = isOnProjectsPage ? '../projects/' : 'projects/';
            const fullPath = `${basePath}${filename}`;
            
            console.log(`Loading project file: ${fullPath}`);
            const response = await fetch(`${fullPath}?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-cache'
            });
            if (!response.ok) {
                console.warn(`Failed to load project file: ${filename} (Status: ${response.status})`);
                return null;
            }
            const data = await response.json();
            console.log(`Successfully loaded: ${filename}`);
            return data;
        } catch (error) {
            console.error(`Error loading project file ${filename}:`, error);
            return null;
        }
    }

    /**
     * Render all project entries to the DOM
     */
    renderProjectEntries() {
        if (!this.projectContainer || this.projectEntries.length === 0) {
            this.showEmptyState();
            return;
        }

        // Clear existing content
        this.projectContainer.innerHTML = '';

        // Render each project entry
        this.projectEntries.forEach((project, index) => {
            const projectElement = this.createProjectElement(project, index);
            this.projectContainer.appendChild(projectElement);
        });
    }

    /**
     * Create DOM element for a single project entry
     * @param {Object} project - Project data object
     * @param {number} index - Index for animation delay
     * @returns {HTMLElement} Project DOM element
     */
    createProjectElement(project, index) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-project', project.id);
        

        // Prepare images data attribute
        const imagesJson = JSON.stringify(project.images || []);
        projectCard.setAttribute('data-images', imagesJson);

        // Get the first image or a placeholder
        const firstImage = project.images && project.images.length > 0 
            ? this.getImagePath(project.images[0])
            : 'https://picsum.photos/400/300?random=' + (index + 1);

        projectCard.innerHTML = `
            <div class="project-image-container">
                <div class="project-image">
                    <img src="${this.escapeHtml(firstImage)}" alt="${this.escapeHtml(project.title)}" class="project-img">
                    <div class="image-fade-overlay"></div>
                </div>
            </div>
            <div class="project-content">
                <div class="project-info">
                    <h3>${this.escapeHtml(project.title)}</h3>
                    ${project.role ? `<div class="project-role">Role: ${this.escapeHtml(project.role)}</div>` : ''}
                    ${project.projectDate ? `<div class="project-date">Date: ${this.escapeHtml(project.projectDate)}</div>` : ''}
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                    ${project.skills && project.skills.length > 0 ? this.createSkillsTags(project.skills) : ''}
                </div>
            </div>
        `;

        // Add click event for modal
        projectCard.addEventListener('click', () => {
            this.openProjectModal(project, index);
        });

        // Add animation delay
        projectCard.style.animationDelay = `${index * 0.2}s`;

        return projectCard;
    }

    /**
     * Create download button HTML
     * @param {Object} project - Project data object
     * @returns {string} HTML string
     */
    createDownloadButton(project) {
        if (!project.download) return '';
        
        // Customize download button text based on project
        let downloadText = 'Download Thesis'; // Default text
        if (project.id === 'albanian-trailblazers') {
            downloadText = 'Download Albanian Trailblazers';
        }
        
        return `<div class="project-download">
            <a href="${this.escapeHtml(project.download)}" class="download-btn" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-download"></i> ${downloadText}
            </a>
        </div>`;
    }

    /**
     * Create skills tags HTML
     * @param {Array} skills - Array of skill strings
     * @returns {string} HTML string
     */
    createSkillsTags(skills) {
        if (!skills || skills.length === 0) return '';
        
        const skillTags = skills.map(skill => {
            const category = this.getSkillCategory(skill);
            return `<span class="skill-tag skill-tag-${category}">${this.escapeHtml(skill)}</span>`;
        }).join('');
        
        return `<div class="project-skills">
            <div class="skills-label">Skills:</div>
            <div class="skills-container">${skillTags}</div>
        </div>`;
    }

    /**
     * Get skill category for color coding
     * @param {string} skill - Skill name
     * @returns {string} Category name
     */
    getSkillCategory(skill) {
        const skillLower = skill.toLowerCase();
        
        // Technical/Programming skills
        if (skillLower.includes('python') || skillLower.includes('programming') || 
            skillLower.includes('vba') || skillLower.includes('coding') || 
            skillLower.includes('software') || skillLower.includes('development')) {
            return 'technical';
        }
        
        // Mathematics/Statistics skills
        if (skillLower.includes('statistical') || skillLower.includes('mathematical') || 
            skillLower.includes('econometric') || skillLower.includes('modeling') || 
            skillLower.includes('analysis') || skillLower.includes('quantitative') ||
            skillLower.includes('forecasting') || skillLower.includes('time series')) {
            return 'mathematics';
        }
        
        // Economics/Finance skills
        if (skillLower.includes('economic') || skillLower.includes('financial') || 
            skillLower.includes('policy') || skillLower.includes('derivatives') ||
            skillLower.includes('monetary') || skillLower.includes('finance')) {
            return 'economics';
        }
        
        // Leadership/Management skills
        if (skillLower.includes('leadership') || skillLower.includes('management') || 
            skillLower.includes('team') || skillLower.includes('strategic') ||
            skillLower.includes('mentorship') || skillLower.includes('organization')) {
            return 'leadership';
        }
        
        // Research/Academic skills
        if (skillLower.includes('research') || skillLower.includes('academic') || 
            skillLower.includes('writing') || skillLower.includes('presentation') ||
            skillLower.includes('data') || skillLower.includes('workshop')) {
            return 'research';
        }
        
        // Default category
        return 'general';
    }

    /**
     * Create skills tags HTML for modal
     * @param {Array} skills - Array of skill strings
     * @returns {string} HTML string
     */
    createModalSkillsTags(skills) {
        if (!skills || skills.length === 0) return '';
        
        const skillTags = skills.map(skill => {
            const category = this.getSkillCategory(skill);
            return `<span class="skill-tag skill-tag-${category}">${this.escapeHtml(skill)}</span>`;
        }).join('');
        
        return `<div class="modal-skills">
            <div class="modal-skills-label">Skills Demonstrated:</div>
            <div class="modal-skills-container">${skillTags}</div>
        </div>`;
    }

    /**
     * Get the full image path
     * @param {string} imagePath - Relative image path
     * @returns {string} Full image path
     */
    getImagePath(imagePath) {
        const basePath = this.getBasePath();
        return `${basePath}${imagePath}`;
    }

    /**
     * Initialize the project modal
     */
    initializeModal() {
        // Modal elements
        this.modal = document.getElementById('project-modal');
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.modalClose = document.getElementById('modal-close');
        this.modalImage = document.getElementById('modal-img');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDescription = document.getElementById('modal-description');
        this.carouselPrev = document.getElementById('carousel-prev');
        this.carouselNext = document.getElementById('carousel-next');
        this.carouselIndicators = document.getElementById('carousel-indicators');

        // Event listeners
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeProjectModal());
        }
        
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.closeProjectModal());
        }
        
        if (this.carouselPrev) {
            this.carouselPrev.addEventListener('click', () => this.previousImage());
        }
        
        if (this.carouselNext) {
            this.carouselNext.addEventListener('click', () => this.nextImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal && this.modal.style.display === 'flex') {
                if (e.key === 'Escape') {
                    this.closeProjectModal();
                } else if (e.key === 'ArrowLeft') {
                    this.previousImage();
                } else if (e.key === 'ArrowRight') {
                    this.nextImage();
                }
            }
        });
    }

    /**
     * Open project modal
     * @param {Object} project - Project data object
     * @param {number} projectIndex - Project index
     */
    openProjectModal(project, projectIndex) {
        this.currentProjectIndex = projectIndex;
        this.currentImageIndex = 0;
        
        if (!this.modal) return;

        // Update modal content
        this.modalTitle.textContent = project.title;
        
        // Create modal content with role and date
        let modalContent = '';
        if (project.role) {
            modalContent += `<div class="modal-role">Role: ${this.escapeHtml(project.role)}</div>`;
        }
        if (project.projectDate) {
            modalContent += `<div class="modal-date">Date: ${this.escapeHtml(project.projectDate)}</div>`;
        }
        modalContent += `<div class="modal-description-content">${this.formatDescription(project.description)}</div>`;
        
        this.modalDescription.innerHTML = modalContent;
        
        // Update skills section
        this.updateModalSkills(project);
        
        // Update actions section (links and downloads)
        this.updateModalActions(project);
        
        // Update image
        this.updateModalImage(project);
        
        // Update carousel indicators
        this.updateCarouselIndicators(project);
        
        // Update navigation arrows visibility
        this.updateNavigationArrows(project);
        
        // Show modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close project modal
     */
    closeProjectModal() {
        if (!this.modal) return;
        
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    /**
     * Update modal image
     * @param {Object} project - Project data object
     */
    updateModalImage(project) {
        if (!this.modalImage || !project.images || project.images.length === 0) return;
        
        const imagePath = this.getImagePath(project.images[this.currentImageIndex]);
        this.modalImage.src = imagePath;
        this.modalImage.alt = project.title;
    }

    /**
     * Update carousel indicators
     * @param {Object} project - Project data object
     */
    updateCarouselIndicators(project) {
        if (!this.carouselIndicators || !project.images || project.images.length <= 1) {
            this.carouselIndicators.innerHTML = '';
            return;
        }

        const indicators = project.images.map((_, index) => 
            `<span class="indicator ${index === this.currentImageIndex ? 'active' : ''}" 
                   data-index="${index}"></span>`
        ).join('');
        
        this.carouselIndicators.innerHTML = indicators;

        // Add click events to indicators
        this.carouselIndicators.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updateModalImage(project);
                this.updateCarouselIndicators(project);
            });
        });
    }

    /**
     * Update navigation arrows visibility
     * @param {Object} project - Project data object
     */
    updateNavigationArrows(project) {
        if (!this.carouselPrev || !this.carouselNext) return;
        
        // Hide arrows if there's only one image or no images
        if (!project.images || project.images.length <= 1) {
            this.carouselPrev.style.display = 'none';
            this.carouselNext.style.display = 'none';
        } else {
            this.carouselPrev.style.display = 'flex';
            this.carouselNext.style.display = 'flex';
        }
    }

    /**
     * Update modal skills section
     * @param {Object} project - Project data object
     */
    updateModalSkills(project) {
        const skillsContainer = this.modal.querySelector('.modal-skills-section');
        if (!skillsContainer) return;

        if (project.skills && project.skills.length > 0) {
            const skillTags = project.skills.map(skill => {
                const category = this.getSkillCategory(skill);
                return `<span class="skill-tag skill-tag-${category}">${this.escapeHtml(skill)}</span>`;
            }).join('');
            
            skillsContainer.innerHTML = `
                <div class="modal-skills-section-label">Skills</div>
                <div class="modal-skills-section-container">${skillTags}</div>
            `;
            skillsContainer.style.display = 'flex';
        } else {
            skillsContainer.style.display = 'none';
        }
    }

    /**
     * Update modal actions section (links and downloads)
     * @param {Object} project - Project data object
     */
    updateModalActions(project) {
        const actionsContainer = this.modal.querySelector('.modal-actions');
        if (!actionsContainer) return;

        let actionsContent = '';

        // Add external links if they exist
        if (project.links && project.links.length > 0) {
            actionsContent += '<div class="modal-actions-section">';
            actionsContent += '<div class="modal-actions-label">External Links</div>';
            actionsContent += '<div class="modal-actions-links">';
            project.links.forEach(link => {
                actionsContent += `<a href="${this.escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="modal-external-link">
                    <i class="fas fa-external-link-alt"></i> ${this.escapeHtml(link.text)}
                </a>`;
            });
            actionsContent += '</div></div>';
        }

        // Add download button if it exists
        if (project.download) {
            // Customize download button text based on project
            let downloadText = 'Download Thesis'; // Default text
            if (project.id === 'albanian-trailblazers') {
                downloadText = 'Download Albanian Trailblazers';
            }
            
            actionsContent += '<div class="modal-actions-section">';
            actionsContent += '<div class="modal-actions-label">Downloads</div>';
            actionsContent += '<div class="modal-actions-downloads">';
            actionsContent += `<a href="${this.escapeHtml(project.download)}" class="modal-download-btn" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-download"></i> ${downloadText}
            </a>`;
            actionsContent += '</div></div>';
        }

        // Show or hide the actions container
        if (actionsContent) {
            actionsContainer.innerHTML = actionsContent;
            actionsContainer.style.display = 'flex';
        } else {
            actionsContainer.style.display = 'none';
        }
    }

    /**
     * Go to previous image
     */
    previousImage() {
        const project = this.projectEntries[this.currentProjectIndex];
        if (!project || !project.images || project.images.length <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex - 1 + project.images.length) % project.images.length;
        this.updateModalImage(project);
        this.updateCarouselIndicators(project);
        this.updateNavigationArrows(project);
    }

    /**
     * Go to next image
     */
    nextImage() {
        const project = this.projectEntries[this.currentProjectIndex];
        if (!project || !project.images || project.images.length <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % project.images.length;
        this.updateModalImage(project);
        this.updateCarouselIndicators(project);
        this.updateNavigationArrows(project);
    }

    /**
     * Initialize scroll animations with Intersection Observer
     * Uses consistent animation configuration across loaders
     */
    initializeAnimations() {
        const projectCards = document.querySelectorAll('.project-card');
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
        
        projectCards.forEach(card => {
            observer.observe(card);
        });
    }

    /**
     * Show empty state when no project entries are available
     */
    showEmptyState() {
        if (!this.projectContainer) return;
        
        this.projectContainer.innerHTML = `
            <div class="empty-state">
                <h3>No projects available</h3>
                <p>Check back later for new projects!</p>
            </div>
        `;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (!this.projectContainer) return;
        
        this.projectContainer.innerHTML = `
            <div class="error-state">
                <h3>Error Loading Projects</h3>
                <p>${this.escapeHtml(message)}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }

    /**
     * Format description with proper line breaks
     * @param {string} description - Description text with \n characters
     * @returns {string} Formatted HTML
     */
    formatDescription(description) {
        if (!description) return '';
        
        // Escape HTML and convert \n\n to paragraph breaks
        const escaped = this.escapeHtml(description);
        return escaped.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
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
     * Refresh project entries (reload from files)
     */
    async refresh() {
        await this.loadProjectEntries();
        this.renderProjectEntries();
        this.initializeAnimations();
    }
}

// Global variables
let projectLoader = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on projects page
    if (document.querySelector('.projects-grid')) {
        projectLoader = new ProjectLoader();
        
        // Add a small delay to ensure page is fully loaded
        setTimeout(() => {
            projectLoader.init();
        }, 100);
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectLoader;
}

class ProjectLoader {
    constructor() {
        this.projectEntries = [];
        this.projectContainer = null;
        this.isLoading = false;
        this.currentProjectIndex = 0;
        this.currentImageIndex = 0;
    }

    async init(containerSelector = '.projects-grid') {
        this.projectContainer = document.querySelector(containerSelector);
        if (!this.projectContainer) return;

        try {
            await this.loadProjectEntries();
            this.renderProjectEntries();
            this.initializeAnimations();
            this.initializeModal();
        } catch (error) {
            this.showError('Failed to load projects');
        }
    }

    async loadProjectEntries() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const projectFiles = [
                '2025-02-15-bank-of-canada-governors-challenge.json',
                'albanian-trailblazers.json',
                '2024-09-15-dalhousie-quantitative-finance-society.json',
                '2024-03-26-academic-thesis.json'
            ];

            if (projectFiles.length === 0) {
                this.projectEntries = [];
                return;
            }

            const projectPromises = projectFiles.map(file => this.loadProjectFile(file));
            const loadedProjects = await Promise.all(projectPromises);
            
            this.projectEntries = loadedProjects
                .filter(project => project !== null)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    getBasePath() {
        const isOnProjectsPage = window.location.pathname.includes('projects.html');
        return isOnProjectsPage ? '../projects/' : 'projects/';
    }

    async loadProjectFile(filename) {
        try {
            const isOnProjectsPage = window.location.pathname.includes('projects.html');
            const basePath = isOnProjectsPage ? '../projects/' : 'projects/';
            const fullPath = `${basePath}${filename}`;
            
            const response = await fetch(`${fullPath}?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                cache: 'no-cache'
            });
            if (!response.ok) return null;
            
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    renderProjectEntries() {
        if (!this.projectContainer || this.projectEntries.length === 0) {
            this.showEmptyState();
            return;
        }

        this.projectContainer.innerHTML = '';

        this.projectEntries.forEach((project, index) => {
            const projectElement = this.createProjectElement(project, index);
            this.projectContainer.appendChild(projectElement);
        });
    }

    createProjectElement(project, index) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-project', project.id);
        
        const imagesJson = JSON.stringify(project.images || []);
        projectCard.setAttribute('data-images', imagesJson);

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

        projectCard.addEventListener('click', () => {
            this.openProjectModal(project, index);
        });

        projectCard.style.animationDelay = `${index * 0.2}s`;

        return projectCard;
    }

    createDownloadButton(project) {
        if (!project.download) return '';
        
        let downloadText = 'Download Thesis';
        if (project.id === 'albanian-trailblazers') {
            downloadText = 'Download Albanian Trailblazers';
        }
        
        return `<div class="project-download">
            <a href="${this.escapeHtml(project.download)}" class="download-btn" target="_blank" rel="noopener noreferrer">
                <i class="fas fa-download"></i> ${downloadText}
            </a>
        </div>`;
    }

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

    getSkillCategory(skill) {
        const skillLower = skill.toLowerCase();
        
        if (skillLower.includes('python') || skillLower.includes('programming') || 
            skillLower.includes('vba') || skillLower.includes('coding') || 
            skillLower.includes('software') || skillLower.includes('development')) {
            return 'technical';
        }
        
        if (skillLower.includes('statistical') || skillLower.includes('mathematical') || 
            skillLower.includes('econometric') || skillLower.includes('modeling') || 
            skillLower.includes('analysis') || skillLower.includes('quantitative') ||
            skillLower.includes('forecasting') || skillLower.includes('time series')) {
            return 'mathematics';
        }
        
        if (skillLower.includes('economic') || skillLower.includes('financial') || 
            skillLower.includes('policy') || skillLower.includes('derivatives') ||
            skillLower.includes('monetary') || skillLower.includes('finance')) {
            return 'economics';
        }
        
        if (skillLower.includes('leadership') || skillLower.includes('management') || 
            skillLower.includes('team') || skillLower.includes('strategic') ||
            skillLower.includes('mentorship') || skillLower.includes('organization')) {
            return 'leadership';
        }
        
        if (skillLower.includes('research') || skillLower.includes('academic') || 
            skillLower.includes('writing') || skillLower.includes('presentation') ||
            skillLower.includes('data') || skillLower.includes('workshop')) {
            return 'research';
        }
        
        return 'general';
    }

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

    getImagePath(imagePath) {
        const basePath = this.getBasePath();
        return `${basePath}${imagePath}`;
    }

    initializeModal() {
        this.modal = document.getElementById('project-modal');
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.modalClose = document.getElementById('modal-close');
        this.modalImage = document.getElementById('modal-img');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDescription = document.getElementById('modal-description');
        this.carouselPrev = document.getElementById('carousel-prev');
        this.carouselNext = document.getElementById('carousel-next');
        this.carouselIndicators = document.getElementById('carousel-indicators');

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

    openProjectModal(project, projectIndex) {
        this.currentProjectIndex = projectIndex;
        this.currentImageIndex = 0;
        
        if (!this.modal) return;

        this.modalTitle.textContent = project.title;
        
        let modalContent = '';
        if (project.role) {
            modalContent += `<div class="modal-role">Role: ${this.escapeHtml(project.role)}</div>`;
        }
        if (project.projectDate) {
            modalContent += `<div class="modal-date">Date: ${this.escapeHtml(project.projectDate)}</div>`;
        }
        modalContent += `<div class="modal-description-content">${this.formatDescription(project.description)}</div>`;
        
        this.modalDescription.innerHTML = modalContent;
        
        this.updateModalSkills(project);
        this.updateModalActions(project);
        this.updateModalImage(project);
        this.updateCarouselIndicators(project);
        this.updateNavigationArrows(project);
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeProjectModal() {
        if (!this.modal) return;
        
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    updateModalImage(project) {
        if (!this.modalImage || !project.images || project.images.length === 0) return;
        
        const imagePath = this.getImagePath(project.images[this.currentImageIndex]);
        this.modalImage.src = imagePath;
        this.modalImage.alt = project.title;
    }

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

        this.carouselIndicators.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updateModalImage(project);
                this.updateCarouselIndicators(project);
            });
        });
    }

    updateNavigationArrows(project) {
        if (!this.carouselPrev || !this.carouselNext) return;
        
        if (!project.images || project.images.length <= 1) {
            this.carouselPrev.style.display = 'none';
            this.carouselNext.style.display = 'none';
        } else {
            this.carouselPrev.style.display = 'flex';
            this.carouselNext.style.display = 'flex';
        }
    }

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

    updateModalActions(project) {
        const actionsContainer = this.modal.querySelector('.modal-actions');
        if (!actionsContainer) return;

        let actionsContent = '';

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

        if (project.download) {
            let downloadText = 'Download Thesis';
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

        if (actionsContent) {
            actionsContainer.innerHTML = actionsContent;
            actionsContainer.style.display = 'flex';
        } else {
            actionsContainer.style.display = 'none';
        }
    }

    previousImage() {
        const project = this.projectEntries[this.currentProjectIndex];
        if (!project || !project.images || project.images.length <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex - 1 + project.images.length) % project.images.length;
        this.updateModalImage(project);
        this.updateCarouselIndicators(project);
        this.updateNavigationArrows(project);
    }

    nextImage() {
        const project = this.projectEntries[this.currentProjectIndex];
        if (!project || !project.images || project.images.length <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % project.images.length;
        this.updateModalImage(project);
        this.updateCarouselIndicators(project);
        this.updateNavigationArrows(project);
    }

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

    showEmptyState() {
        if (!this.projectContainer) return;
        
        this.projectContainer.innerHTML = `
            <div class="empty-state">
                <h3>No projects available</h3>
                <p>Check back later for new projects!</p>
            </div>
        `;
    }

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

    formatDescription(description) {
        if (!description) return '';
        
        const escaped = this.escapeHtml(description);
        return escaped.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async refresh() {
        await this.loadProjectEntries();
        this.renderProjectEntries();
        this.initializeAnimations();
    }
}

let projectLoader = null;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.projects-grid')) {
        projectLoader = new ProjectLoader();
        setTimeout(() => {
            projectLoader.init();
        }, 100);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectLoader;
}



// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Animation configuration constants
 * Centralized settings for all animation-related behavior
 */
const ANIMATION_CONFIG = {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '0px 0px -50px 0px',
    INITIAL_OPACITY: '0',
    INITIAL_TRANSFORM: 'translateY(30px)',
    TRANSITION_DURATION: '0.6s ease',
    REVEAL_THRESHOLD: 0.1
};

/**
 * Timing configuration constants
 * Centralized settings for delays, timeouts, and intervals
 */
const TIMING_CONFIG = {
    TYPEWRITER_DELAY: 2000,
    LOADER_TIMEOUT_SHORT: 1000,
    LOADER_TIMEOUT_LONG: 3000,
    NOTIFICATION_AUTO_HIDE: 5000,
    NOTIFICATION_SLIDE_DISTANCE: 400,
    NOTIFICATION_FADE_DELAY: 100,
    TIME_UPDATE_INTERVAL: 1000
};

// Intersection Observer for animations
const observerOptions = {
    threshold: ANIMATION_CONFIG.THRESHOLD,
    rootMargin: ANIMATION_CONFIG.ROOT_MARGIN
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

/**
 * Initialize animation observers for various elements
 * Sets up intersection observers for fade-in animations
 */
function initializeAnimationObservers() {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-method');
    
    animateElements.forEach(el => {
        el.style.opacity = ANIMATION_CONFIG.INITIAL_OPACITY;
        el.style.transform = ANIMATION_CONFIG.INITIAL_TRANSFORM;
        el.style.transition = `opacity ${ANIMATION_CONFIG.TRANSITION_DURATION}, transform ${ANIMATION_CONFIG.TRANSITION_DURATION}`;
        observer.observe(el);
    });
}

/**
 * Update current year in footer elements
 * Automatically updates copyright year across the site
 */
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    
    // Update current year in page footer elements
    const pageFooterElements = document.querySelectorAll('.page-footer p');
    pageFooterElements.forEach(element => {
        const text = element.textContent;
        // Replace any 4-digit year with current year
        const yearPattern = /@\s*Stivi Canka\s*\d{4}/;
        if (yearPattern.test(text)) {
            element.textContent = text.replace(/\d{4}/, currentYear);
        }
    });
}

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimationObservers();
    updateCurrentYear();
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!Utils.isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

/**
 * Utility functions for validation and security
 */
const Utils = {
    /**
     * Validates email format
     * @param {string} email - Email address to validate
     * @returns {boolean} True if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Sanitizes HTML to prevent XSS attacks
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized HTML string
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Safely queries DOM element
     * @param {string} selector - CSS selector
     * @returns {HTMLElement|null} Element or null if not found
     */
    querySelector(selector) {
        return document.querySelector(selector);
    },

    /**
     * Safely queries multiple DOM elements
     * @param {string} selector - CSS selector
     * @returns {NodeList} NodeList of elements
     */
    querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }
};

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${Utils.sanitizeHTML(message)}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, TIMING_CONFIG.NOTIFICATION_FADE_DELAY);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = `translateX(${TIMING_CONFIG.NOTIFICATION_SLIDE_DISTANCE}px)`;
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after configured time
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = `translateX(${TIMING_CONFIG.NOTIFICATION_SLIDE_DISTANCE}px)`;
            setTimeout(() => notification.remove(), 300);
        }
    }, TIMING_CONFIG.NOTIFICATION_AUTO_HIDE);
}

/**
 * Typing animation for hero title
 * Creates a typewriter effect by gradually adding characters
 * @param {HTMLElement} element - Target element to animate
 * @param {string} text - Text to type out
 * @param {number} speed - Typing speed in milliseconds (default: 100)
 */
function typeWriter(element, text, speed = 100) {
    if (!element || typeof text !== 'string') {
        console.warn('typeWriter: Invalid element or text provided');
        return;
    }
    
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Updates the current time display
 * Formats time in 12-hour format with AM/PM
 */
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        timeElement.textContent = timeString;
    }
}

// Update time every second (only if clock element exists)
if (document.getElementById('current-time')) {
    setInterval(updateTime, TIMING_CONFIG.TIME_UPDATE_INTERVAL);
}

// Animated text phrases with IBM Plex Mono font - Sequential order starting with "wears many hats"
const animatedPhrases = [
    { text: "wears many hats.", font: "'IBM Plex Mono', monospace" },
    { text: "derives insights from complex data.", font: "'IBM Plex Mono', monospace" },
    { text: "turns caffeine into clean code.", font: "'IBM Plex Mono', monospace" },
    { text: "believes in value investing.", font: "'IBM Plex Mono', monospace" },
    { text: "finds beauty in Euler's number.", font: "'IBM Plex Mono', monospace" },
    { text: "rejects null hypotheses confidently.", font: "'IBM Plex Mono', monospace" },
    { text: "solves PDEs with a cup of tea.", font: "'IBM Plex Mono', monospace" },
    { text: "achieves Pareto optimality daily.", font: "'IBM Plex Mono', monospace" },
    { text: "solves optimization problems elegantly.", font: "'IBM Plex Mono', monospace" }
];

let currentPhraseIndex = 1;
let isDeleting = false;
let currentText = '';
let typeSpeed = 100;

// Typewriter effect function
function typewriterEffect() {
    const animatedTextElement = document.getElementById('animated-text');
    if (!animatedTextElement) return;
    
    const currentPhraseData = animatedPhrases[currentPhraseIndex];
    const currentPhrase = currentPhraseData.text;
    
    if (isDeleting) {
        // Deleting text
        currentText = currentPhrase.substring(0, currentText.length - 1);
        typeSpeed = 30;
    } else {
        // Typing text
        currentText = currentPhrase.substring(0, currentText.length + 1);
        typeSpeed = 60;
    }
    
    // Apply font and text content
    animatedTextElement.style.fontFamily = currentPhraseData.font;
    animatedTextElement.textContent = currentText;
    
    if (!isDeleting && currentText === currentPhrase) {
        // Finished typing, wait then start deleting
        typeSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        // Finished deleting, move to next phrase
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % animatedPhrases.length;
        typeSpeed = 300;
    }
    
    setTimeout(typewriterEffect, typeSpeed);
}


/**
 * Hide page loader with animation
 * Provides graceful fade-out transition before removing from DOM
 */
function hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hidden');
        // Remove loader from DOM after animation completes
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
}

/**
 * Determine if a link should trigger the page loader
 * @param {HTMLAnchorElement} link - Link element to check
 * @returns {boolean} True if loader should be shown
 */
function shouldShowLoaderForLink(link) {
    const href = link.href;
    if (!href || href.includes('#')) return false;
    
    const isGoingToHome = href.includes('index.html');
    const isDownloadLink = link.hasAttribute('download') || 
                          /\.(pdf|doc|zip)$/i.test(href);
    const isExternalLink = href.startsWith('http') && 
                          !href.includes(window.location.hostname);
    const isSocialMediaLink = /(linkedin|instagram|github)\.com|mailto:/.test(href);
    
    return !isGoingToHome && !isDownloadLink && !isExternalLink && !isSocialMediaLink;
}

/**
 * Handle page loader on navigation
 * Shows loader for internal page navigation
 */
function handleLoaderNavigation() {
    // Prevent loader from showing on page refresh
    if (performance.navigation && performance.navigation.type === 1) {
        hidePageLoader();
    }

    // Show loader only when navigating to subpages (not home, downloads, or external links)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && shouldShowLoaderForLink(link)) {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.remove('hidden');
            }
        }
    });
}

// Initialize loader navigation handling
handleLoaderNavigation();


// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize time display
    updateTime();
    
    // Start the typewriter effect
    setTimeout(() => {
        typewriterEffect();
    }, TIMING_CONFIG.TYPEWRITER_DELAY);
    
    // Hide loader quickly with multiple fallbacks
    setTimeout(() => {
        hidePageLoader();
    }, TIMING_CONFIG.LOADER_TIMEOUT_SHORT);
    
    // Fallback: Hide loader after configured time regardless
    setTimeout(() => {
        hidePageLoader();
    }, TIMING_CONFIG.LOADER_TIMEOUT_LONG);
    
    // Fallback: Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        hidePageLoader();
    });
});

/**
 * Visual effect configuration constants
 */
const VISUAL_EFFECTS_CONFIG = {
    PARALLAX_MULTIPLIER: 0.5,
    HOVER_SCALE: 1.05,
    HOVER_TRANSLATE_X: 10
};

/**
 * Parallax effect for hero section
 * Creates a subtle depth effect while scrolling
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * VISUAL_EFFECTS_CONFIG.PARALLAX_MULTIPLIER}px)`;
    }
});

/**
 * Skill items hover effect
 * Adds interactive feedback on hover
 */
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = `scale(${VISUAL_EFFECTS_CONFIG.HOVER_SCALE}) translateX(${VISUAL_EFFECTS_CONFIG.HOVER_TRANSLATE_X}px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) translateX(0)';
    });
});

// Project cards hover effect (removed 3D tilt)

/**
 * Smooth reveal animation for sections
 * Fades in sections as they enter the viewport
 */
const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: ANIMATION_CONFIG.REVEAL_THRESHOLD });

revealElements.forEach(element => {
    revealObserver.observe(element);
});


// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


// Project Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    

    // Store full descriptions for modal access and apply fade effect
    function storeFullDescriptions() {
        const descriptions = document.querySelectorAll('.project-info p');
        
        descriptions.forEach(description => {
            const fullText = description.textContent;
            // Store full text in data attribute for modal access
            description.setAttribute('data-full-text', fullText);
            
            // Add project-description class to all descriptions for fade effect
            description.classList.add('project-description');
        });
    }
    
    // Initialize description storage
    storeFullDescriptions();

    // Carousel functionality
    let currentImageIndex = 0;
    let currentImages = [];
    
    function updateCarouselImages(images) {
        currentImages = images;
        currentImageIndex = 0;
        updateCarouselDisplay();
        updateCarouselIndicators();
    }
    
    function updateCarouselDisplay() {
        const modalImg = document.getElementById('modal-img');
        if (modalImg && currentImages.length > 0) {
            modalImg.src = currentImages[currentImageIndex];
        }
    }
    
    function updateCarouselIndicators() {
        const indicatorsContainer = document.getElementById('carousel-indicators');
        if (!indicatorsContainer) return;
        
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';
        
        // Create indicators for each image
        currentImages.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === currentImageIndex) {
                indicator.classList.add('active');
            }
            
            indicator.addEventListener('click', () => {
                currentImageIndex = index;
                updateCarouselDisplay();
                updateCarouselIndicators();
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    function nextImage() {
        if (currentImages.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            updateCarouselDisplay();
            updateCarouselIndicators();
        }
    }
    
    function prevImage() {
        if (currentImages.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            updateCarouselDisplay();
            updateCarouselIndicators();
        }
    }

    // Open modal when project card is clicked
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const projectInfo = card.querySelector('.project-info');
            const projectImage = card.querySelector('.project-img');
            const imagesData = card.getAttribute('data-images');
            
            // Get project data
            const title = projectInfo.querySelector('h3').textContent;
            const descriptionElement = projectInfo.querySelector('p');
            const imageSrc = projectImage ? projectImage.src : '';
            
            // Get full description from stored data
            const fullDescription = descriptionElement.getAttribute('data-full-text') || descriptionElement.textContent;
            
            // Parse images array
            let images = [];
            if (imagesData) {
                try {
                    images = JSON.parse(imagesData);
                } catch (e) {
                    console.error('Error parsing images data:', e);
                    images = [imageSrc];
                }
            } else {
                images = [imageSrc];
            }
            
            // Update modal content
            modalTitle.textContent = title;
            modalDescription.textContent = fullDescription;
            
            // Initialize carousel
            updateCarouselImages(images);
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking backdrop
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Carousel button event listeners
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    
    if (carouselPrev) {
        carouselPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }
    
    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            }
        }
    });
});


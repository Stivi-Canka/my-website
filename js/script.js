

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


// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-method');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Update current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Update current year in page footer elements
    const pageFooterElements = document.querySelectorAll('.page-footer p');
    pageFooterElements.forEach(element => {
        if (element.textContent.includes('2025')) {
            element.textContent = element.textContent.replace('2025', new Date().getFullYear());
        }
    });
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
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

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
            <span class="notification-message">${sanitizeHTML(message)}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Typing animation for hero title
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

// Real-time clock (only if element exists)
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
    setInterval(updateTime, 1000);
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


// Simple loader functionality with error handling
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

// Prevent loader from showing on page refresh
if (performance.navigation.type === 1) {
    // Page was refreshed, hide loader immediately
    hidePageLoader();
}

// Show loader only when navigating to subpages (not home, downloads, or external links)
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#')) {
        const isGoingToHome = e.target.href.includes('index.html');
        const isDownloadLink = e.target.hasAttribute('download') || e.target.href.includes('.pdf') || e.target.href.includes('.doc') || e.target.href.includes('.zip');
        const isExternalLink = e.target.href.startsWith('http') && !e.target.href.includes(window.location.hostname);
        const isSocialMediaLink = e.target.href.includes('linkedin.com') || e.target.href.includes('instagram.com') || e.target.href.includes('github.com') || e.target.href.includes('mailto:');
        
        if (!isGoingToHome && !isDownloadLink && !isExternalLink && !isSocialMediaLink) {
            // Show loader for internal subpages only
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.remove('hidden');
            }
        }
    }
});


// Teleprompter functionality
const teleprompterMessages = [
    "Currently coding in TypeScript • Coffee level: Critical • Last commit: 2 minutes ago • Status: In the zone",
    "Debugging CSS animations • Spotify: Lo-fi hip hop • IDE: VS Code • Focus: 100%",
    "Building responsive layouts • Weather: Perfect coding weather • Energy: High • Motivation: ∞",
    "Learning new frameworks • Code quality: Improving • Fun level: Maximum",
    "Optimizing performance • Stack: React + Node.js • Coffee: Third cup • Productivity: Peak",
    "Writing clean code • Music: Electronic • Time: 2:47 AM • Status: Still going strong",
    "Refactoring legacy code • Snack: Dark chocolate • IDE theme: Dark mode • Flow state: Achieved",
    "Building APIs • Temperature: 72°F • Humidity: Perfect • Code: Bug-free",
    "Testing edge cases • Browser: Chrome DevTools open • Network: Stable • Progress: Steady",
    "Deploying to production • Confidence: High • Backup: Ready • Launch: Imminent"
];

let currentTeleprompterIndex = 0;

function updateTeleprompter() {
    const teleprompterContent = document.querySelector('.teleprompter-content');
    if (teleprompterContent) {
        // Fade out
        teleprompterContent.style.opacity = '0';
        
        setTimeout(() => {
            // Change content
            currentTeleprompterIndex = (currentTeleprompterIndex + 1) % teleprompterMessages.length;
            teleprompterContent.textContent = teleprompterMessages[currentTeleprompterIndex];
            
            // Fade in
            teleprompterContent.style.opacity = '1';
        }, 500);
    }
}

function initTeleprompter() {
    const teleprompterContent = document.querySelector('.teleprompter-content');
    if (teleprompterContent) {
        // Set initial opacity for smooth transitions
        teleprompterContent.style.transition = 'opacity 0.5s ease';
        
        // Update teleprompter every 8 seconds
        setInterval(updateTeleprompter, 8000);
        
        // Start with a random message
        currentTeleprompterIndex = Math.floor(Math.random() * teleprompterMessages.length);
        teleprompterContent.textContent = teleprompterMessages[currentTeleprompterIndex];
    }
}


// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize time display
    updateTime();
    
    // Initialize teleprompter
    initTeleprompter();
    
    // Start the typewriter effect
    setTimeout(() => {
        typewriterEffect();
    }, 2000);
    
    // Hide loader quickly with multiple fallbacks
    setTimeout(() => {
        hidePageLoader();
    }, 1000);
    
    // Fallback: Hide loader after 3 seconds regardless
    setTimeout(() => {
        hidePageLoader();
    }, 3000);
    
    // Fallback: Hide loader when page is fully loaded
    window.addEventListener('load', () => {
        hidePageLoader();
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Skill items hover effect
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05) translateX(10px)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) translateX(0)';
    });
});

// Project cards hover effect (removed 3D tilt)

// Smooth reveal animation for sections
const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

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
    
    console.log('Modal elements found:', {
        projectCards: projectCards.length,
        modal: !!modal,
        modalBackdrop: !!modalBackdrop,
        modalClose: !!modalClose,
        modalTitle: !!modalTitle,
        modalDescription: !!modalDescription
    });

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
            console.log('Card clicked!'); // Debug log
            
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
            
            console.log('Modal elements:', { modal, modalTitle, modalDescription }); // Debug log
            
            // Update modal content
            modalTitle.textContent = title;
            modalDescription.textContent = fullDescription;
            
            // Initialize carousel
            updateCarouselImages(images);
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            console.log('Modal should be visible now'); // Debug log
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


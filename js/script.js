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

const ANIMATION_CONFIG = {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '0px 0px -50px 0px',
    INITIAL_OPACITY: '0',
    INITIAL_TRANSFORM: 'translateY(30px)',
    TRANSITION_DURATION: '0.6s ease'
};

const TIMING_CONFIG = {
    TYPEWRITER_DELAY: 2000,
    LOADER_TIMEOUT_SHORT: 1000,
    LOADER_TIMEOUT_LONG: 3000,
    NOTIFICATION_AUTO_HIDE: 5000,
    NOTIFICATION_SLIDE_DISTANCE: 400,
    NOTIFICATION_FADE_DELAY: 100,
    TIME_UPDATE_INTERVAL: 1000
};

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

function initializeAnimationObservers() {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-method');
    
    animateElements.forEach(el => {
        el.style.opacity = ANIMATION_CONFIG.INITIAL_OPACITY;
        el.style.transform = ANIMATION_CONFIG.INITIAL_TRANSFORM;
        el.style.transition = `opacity ${ANIMATION_CONFIG.TRANSITION_DURATION}, transform ${ANIMATION_CONFIG.TRANSITION_DURATION}`;
        observer.observe(el);
    });
}

function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = currentYear;
    }
    
    const pageFooterElements = document.querySelectorAll('.page-footer p');
    pageFooterElements.forEach(element => {
        const text = element.textContent;
        const yearPattern = /@\s*Stivi Canka\s*\d{4}/;
        if (yearPattern.test(text)) {
            element.textContent = text.replace(/\d{4}/, currentYear);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimationObservers();
    updateCurrentYear();
});

const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!Utils.isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

const Utils = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    querySelector(selector) {
        return document.querySelector(selector);
    },

    querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }
};

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${Utils.sanitizeHTML(message)}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, TIMING_CONFIG.NOTIFICATION_FADE_DELAY);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = `translateX(${TIMING_CONFIG.NOTIFICATION_SLIDE_DISTANCE}px)`;
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = `translateX(${TIMING_CONFIG.NOTIFICATION_SLIDE_DISTANCE}px)`;
            setTimeout(() => notification.remove(), 300);
        }
    }, TIMING_CONFIG.NOTIFICATION_AUTO_HIDE);
}

function typeWriter(element, text, speed = 100) {
    if (!element || typeof text !== 'string') return;
    
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

if (document.getElementById('current-time')) {
    setInterval(updateTime, TIMING_CONFIG.TIME_UPDATE_INTERVAL);
}

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

function typewriterEffect() {
    const animatedTextElement = document.getElementById('animated-text');
    if (!animatedTextElement) return;
    
    const currentPhraseData = animatedPhrases[currentPhraseIndex];
    const currentPhrase = currentPhraseData.text;
    
    if (isDeleting) {
        currentText = currentPhrase.substring(0, currentText.length - 1);
        typeSpeed = 30;
    } else {
        currentText = currentPhrase.substring(0, currentText.length + 1);
        typeSpeed = 60;
    }
    
    animatedTextElement.style.fontFamily = currentPhraseData.font;
    animatedTextElement.textContent = currentText;
    
    if (!isDeleting && currentText === currentPhrase) {
        typeSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % animatedPhrases.length;
        typeSpeed = 300;
    }
    
    setTimeout(typewriterEffect, typeSpeed);
}

function hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
}

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

function handleLoaderNavigation() {
    if (performance.navigation && performance.navigation.type === 1) {
        hidePageLoader();
    }

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

handleLoaderNavigation();

document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    
    setTimeout(() => {
        typewriterEffect();
    }, TIMING_CONFIG.TYPEWRITER_DELAY);
    
    setTimeout(() => {
        hidePageLoader();
    }, TIMING_CONFIG.LOADER_TIMEOUT_SHORT);
    
    setTimeout(() => {
        hidePageLoader();
    }, TIMING_CONFIG.LOADER_TIMEOUT_LONG);
    
    window.addEventListener('load', () => {
        hidePageLoader();
    });
});

const VISUAL_EFFECTS_CONFIG = {
    PARALLAX_MULTIPLIER: 0.5,
    HOVER_SCALE: 1.05,
    HOVER_TRANSLATE_X: 10
};

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * VISUAL_EFFECTS_CONFIG.PARALLAX_MULTIPLIER}px)`;
    }
});

document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = `scale(${VISUAL_EFFECTS_CONFIG.HOVER_SCALE}) translateX(${VISUAL_EFFECTS_CONFIG.HOVER_TRANSLATE_X}px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) translateX(0)';
    });
});

const revealElements = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: ANIMATION_CONFIG.THRESHOLD });

revealElements.forEach(element => {
    revealObserver.observe(element);
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    
    function storeFullDescriptions() {
        const descriptions = document.querySelectorAll('.project-info p');
        
        descriptions.forEach(description => {
            const fullText = description.textContent;
            description.setAttribute('data-full-text', fullText);
            description.classList.add('project-description');
        });
    }
    
    storeFullDescriptions();

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
        
        indicatorsContainer.innerHTML = '';
        
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

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const projectInfo = card.querySelector('.project-info');
            const projectImage = card.querySelector('.project-img');
            const imagesData = card.getAttribute('data-images');
            
            const title = projectInfo.querySelector('h3').textContent;
            const descriptionElement = projectInfo.querySelector('p');
            const imageSrc = projectImage ? projectImage.src : '';
            
            const fullDescription = descriptionElement.getAttribute('data-full-text') || descriptionElement.textContent;
            
            let images = [];
            if (imagesData) {
                try {
                    images = JSON.parse(imagesData);
                } catch (e) {
                    images = [imageSrc];
                }
            } else {
                images = [imageSrc];
            }
            
            modalTitle.textContent = title;
            modalDescription.textContent = fullDescription;
            
            updateCarouselImages(images);
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
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

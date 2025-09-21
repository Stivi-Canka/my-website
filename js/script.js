

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
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
            <span class="notification-message">${message}</span>
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

// Real-time clock
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

// Update time every second
setInterval(updateTime, 1000);

// Animated text phrases with IBM Plex Mono font - Sequential order starting with "wears many hats"
const animatedPhrases = [
    { text: "wears many hats.", font: "'IBM Plex Mono', monospace" },
    { text: "writes elegant solutions.", font: "'IBM Plex Mono', monospace" },
    { text: "turns caffeine into clean code.", font: "'IBM Plex Mono', monospace" },
    { text: "finds beauty in Euler's number.", font: "'IBM Plex Mono', monospace" },
    { text: "builds scalable architectures.", font: "'IBM Plex Mono', monospace" },
    { text: "optimizes for performance.", font: "'IBM Plex Mono', monospace" },
    { text: "debugs with surgical precision.", font: "'IBM Plex Mono', monospace" },
    { text: "crafts pixel-perfect interfaces.", font: "'IBM Plex Mono', monospace" }
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


// Simple loader functionality
function hidePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Show loader only when navigating to subpages (not home or downloads)
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#')) {
        const isGoingToHome = e.target.href.includes('index.html');
        const isDownloadLink = e.target.hasAttribute('download') || e.target.href.includes('.pdf') || e.target.href.includes('.doc') || e.target.href.includes('.zip');
        
        if (!isGoingToHome && !isDownloadLink) {
            // Show loader for subpages (but not downloads)
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
    
    // Hide loader quickly
    setTimeout(() => {
        hidePageLoader();
    }, 1000);
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

// Project cards 3D tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

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


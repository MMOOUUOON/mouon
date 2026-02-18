/* =============================================
   Portfolio - Interactive JavaScript
   Background Concept Designer
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initScrollAnimations();
    initNavigation();
    initCounterAnimation();
    initContactForm();
});

/* =============================================
   TYPING ANIMATION
   ============================================= */
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const words = [
        'fantasy worlds ✨',
        'cinematic landscapes 🎬',
        'immersive environments 🌄',
        'atmospheric scenes 🌙',
        'visual stories 🎨'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
}

/* =============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================= */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger skill bar animation
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.skill-card__progress');
                    if (progressBar) {
                        const width = progressBar.getAttribute('data-width');
                        setTimeout(() => {
                            progressBar.style.width = width + '%';
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* =============================================
   NAVIGATION
   ============================================= */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
        });
    }

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            navToggle.classList.remove('is-open');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav__link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('nav__link--active');
                } else {
                    link.classList.remove('nav__link--active');
                }
            }
        });
    });
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-card__number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Message sent successfully! 🎉', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backdropFilter: 'blur(20px)',
        maxWidth: '400px'
    });

    if (type === 'success') {
        notification.style.background = 'rgba(34, 197, 94, 0.15)';
        notification.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        notification.style.color = '#86efac';
    } else {
        notification.style.background = 'rgba(239, 68, 68, 0.15)';
        notification.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        notification.style.color = '#fca5a5';
    }

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

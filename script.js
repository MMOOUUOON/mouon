/* =============================================
   MOUON — Background Concept Designer
   Interactive JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingAnimation();
    initScrollAnimations();
    initNavigation();
    initCounterAnimation();
    initContactForm();
});

/* =============================================
   CANVAS PARTICLES (Floating dust/stars)
   ============================================= */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.flickerSpeed = Math.random() * 0.02 + 0.005;
            this.flickerOffset = Math.random() * Math.PI * 2;
            this.hue = 35 + Math.random() * 15; // warm gold range
        }
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.flickerSpeed + this.flickerOffset));

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, ${this.currentOpacity})`;
            ctx.fill();

            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, ${this.currentOpacity * 0.15})`;
                ctx.fill();
            }
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    let time = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time++;
        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        animId = requestAnimationFrame(animate);
    }
    animate();
}

/* =============================================
   TYPING ANIMATION (Bilingual)
   ============================================= */
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const words = [
        'crafting fantasy worlds ✨',
        'cinematic landscapes 🎬',
        'atmospheric environments 🌄',
        'immersive game worlds 🎮',
        'visual storytelling 🎨'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 300;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

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
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* =============================================
   NAVIGATION
   ============================================= */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
        });
    }

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
                link.classList.toggle('nav__link--active', scrollY >= top && scrollY < top + height);
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
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = target;
    }
    requestAnimationFrame(step);
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
            showNotification('모든 항목을 입력해주세요. Please fill in all fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('올바른 이메일을 입력해주세요. Please enter a valid email.', 'error');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Sending... · 전송 중...</span>';
        btn.disabled = true;

        setTimeout(() => {
            showNotification('메시지가 전송되었습니다! Message sent! 🎉', 'success');
            form.reset();
            btn.innerHTML = original;
            btn.disabled = false;
        }, 1500);
    });
}

function showNotification(message, type) {
    const old = document.querySelector('.notification');
    if (old) old.remove();

    const el = document.createElement('div');
    el.className = `notification notification--${type}`;
    el.textContent = message;

    Object.assign(el.style, {
        position: 'fixed', bottom: '24px', right: '24px',
        padding: '16px 24px', borderRadius: '12px', fontSize: '14px',
        fontWeight: '500', zIndex: '9999', transform: 'translateY(100px)',
        opacity: '0', transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        backdropFilter: 'blur(20px)', maxWidth: '400px',
        fontFamily: "'Inter', 'Noto Sans KR', sans-serif"
    });

    if (type === 'success') {
        el.style.background = 'rgba(217, 170, 100, 0.15)';
        el.style.border = '1px solid rgba(217, 170, 100, 0.3)';
        el.style.color = '#d9aa64';
    } else {
        el.style.background = 'rgba(239, 68, 68, 0.15)';
        el.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        el.style.color = '#fca5a5';
    }

    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; el.style.opacity = '1'; });
    setTimeout(() => {
        el.style.transform = 'translateY(100px)'; el.style.opacity = '0';
        setTimeout(() => el.remove(), 400);
    }, 3000);
}

// ============================================
// Year in footer
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// ============================================
// Reduced motion check
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Scroll reveal — single observer, reused for
// sections, project cards, and cert rows
// ============================================
function initScrollReveal() {
    const targets = document.querySelectorAll('.section, .project-card, .cert-row');

    if (prefersReducedMotion) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
        observer.observe(el);
    });
}

// ============================================
// Navbar: scroll shadow, mobile toggle,
// smooth-scroll links, active-link tracking
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');
    const links = menu.querySelectorAll('a');
    const sections = document.querySelectorAll('section[id], header[id]');

    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            navbar.classList.toggle('scrolled', scrollY > 40);

            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop - navbar.offsetHeight - 100;
                if (scrollY >= top) {
                    current = section.id;
                }
            });

            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => {
        const isActive = menu.classList.toggle('active');
        toggle.classList.toggle('active', isActive);
        toggle.setAttribute('aria-expanded', String(isActive));
    });

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const offset = target.offsetTop - navbar.offsetHeight - 16;
            window.scrollTo({ top: offset, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// Back to top
// ============================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

// ============================================
// Contact form — real validation, inline
// status message, no DOM-spawning toast
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.btn-submit');

    const fields = {
        name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
        email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
        subject: { input: document.getElementById('subject'), error: document.getElementById('subjectError') },
        message: { input: document.getElementById('message'), error: document.getElementById('messageError') },
    };

    function validateField(key) {
        const { input, error } = fields[key];
        const value = input.value.trim();
        let message = '';

        if (!value) {
            message = 'This field is required.';
        } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = 'Enter a valid email address.';
        }

        input.classList.toggle('invalid', Boolean(message));
        error.textContent = message;
        return !message;
    }

    Object.keys(fields).forEach(key => {
        fields[key].input.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const allValid = Object.keys(fields).every(validateField);
        if (!allValid) {
            status.textContent = '';
            return;
        }

        submitBtn.disabled = true;
        status.textContent = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                status.textContent = `Thanks, ${fields.name.input.value.trim()}. Your message is on its way.`;
                form.reset();
            } else {
                status.textContent = 'Something went wrong. Try again, or email me directly.';
            }
        } catch {
            status.textContent = 'Something went wrong. Try again, or email me directly.';
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// Theme toggle — persists choice, syncs aria-pressed.
// Initial theme is set by an inline script in <head>
// so there's no flash of the wrong theme on load.
// ============================================
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const root = document.documentElement;

    function syncAria() {
        btn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'light'));
    }

    syncAria();

    btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch {
            // Storage blocked (private mode, etc.) — theme just won't persist.
        }
        syncAria();
    });
}

// ============================================
// Projects carousel — scroll-by-card buttons,
// disabled state at the scroll edges
// ============================================
function initProjectsCarousel() {
    const track = document.getElementById('projectsTrack');
    const prev = document.getElementById('projectsPrev');
    const next = document.getElementById('projectsNext');
    if (!track || !prev || !next) return;

    function cardStep() {
        const card = track.querySelector('.project-card');
        if (!card) return track.clientWidth;
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
        return card.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= maxScroll;
    }

    prev.addEventListener('click', () => {
        track.scrollBy({ left: -cardStep(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    next.addEventListener('click', () => {
        track.scrollBy({ left: cardStep(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateButtons();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener('resize', updateButtons);
    updateButtons();
}

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initBackToTop();
    initContactForm();
    initThemeToggle();
    initProjectsCarousel();
});

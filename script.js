function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    showNotification(`Thanks ${name}! Your message has been received. I'll get back to you soon! ✨`);
    
    event.target.reset();
    
    console.log('Form submitted:', { name, email, subject, message });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7c77c6, #ff77c6);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 500;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(60px)';
    section.style.transition = `all 0.8s ease-out ${index * 0.2}s`;
    observer.observe(section);
});

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

setInterval(createParticle, 200);

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(124, 119, 198, 0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.cursor');
    cursorElement.style.left = e.clientX - 10 + 'px';
    cursorElement.style.top = e.clientY - 10 + 'px';
});

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

window.addEventListener('load', () => {
    setTimeout(() => {
        const nameElement = document.querySelector('h1');
        const originalText = nameElement.textContent;
        typeWriter(nameElement, originalText, 80);
    }, 500);
});

document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(124, 119, 198, 0.1);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.background = `
        radial-gradient(circle at ${x * 100}% ${y * 100}%, 
        rgba(124, 119, 198, 0.1) 0%, 
        transparent 50%), 
        #0a0a0f
    `;

});

document.addEventListener('DOMContentLoaded', function() {
    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    const btnText = seeMoreBtn.querySelector('.btn-text');
    let isExpanded = false;

    seeMoreBtn.addEventListener('click', function() {
        if (!isExpanded) {
            hiddenCerts.forEach((cert, index) => {
                setTimeout(() => {
                    cert.classList.add('show');
                }, index * 150);
            });
            
            btnText.textContent = 'Show Less';
            seeMoreBtn.classList.add('expanded');
            isExpanded = true;
        } else {
            hiddenCerts.forEach((cert, index) => {
                setTimeout(() => {
                    cert.classList.remove('show');
                    setTimeout(() => {
                        cert.style.display = 'none';
                    }, 600);
                }, index * 50);
            });
            
            btnText.textContent = 'See More Certifications';
            seeMoreBtn.classList.remove('expanded');
            isExpanded = false;
            setTimeout(() => {
                document.querySelector('.certifications-container').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    });
    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(124, 119, 198, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

const certObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.certificate-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.8s ease-out ${index * 0.1}s`;
    certObserver.observe(card);
});

// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-menu a');

    // Scroll effect for navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled down
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Smooth scrolling for navbar links
    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    });

    // Active link highlight on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section, header');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - navbar.offsetHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navbarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
});
// Dynamically set the current year in the footer
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

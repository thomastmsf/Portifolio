/* ==========================================
   JAVASCRIPT INTERACTIVITY & LOGIC
   Pr. Thomas Magnum - Portfolio Landing Page
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initScrollAnimations();
    initModal();
    initActiveNavLinks();
});

/* ==========================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check saved preference or system default
    const savedTheme = localStorage.getItem('magnum_portfolio_theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersLight) {
        htmlElement.setAttribute('data-theme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('magnum_portfolio_theme', newTheme);
        });
    }
}

/* ==========================================
   2. NAVBAR & MOBILE DRAWER LOGIC
   ========================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });

        // Close menu when clicking outside or link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
            });
        });
    }
}

/* ==========================================
   3. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================
   4. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ========================================== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-bar-item');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================
   5. IMAGE MODAL / LIGHTBOX
   ========================================== */
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');

    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const mockupBody = document.getElementById('mockupBody');

    function openModal(imgSrc, captionText) {
        modalImg.src = imgSrc;
        modalCaption.textContent = captionText || 'Demonstração de Sistema';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach to mockup click
    if (mockupBody) {
        mockupBody.addEventListener('click', () => {
            const img = mockupBody.querySelector('img');
            if (img) {
                openModal(img.src, 'Sistema de Recepção Acolhedora - Central de Frequência e Recepção');
            }
        });
    }

    // Attach to explicit modal trigger buttons
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            if (imgSrc) {
                openModal(imgSrc, title);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================
   6. CONTACT FORM SUBMISSION FEEDBACK
   ========================================== */
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const feedback = document.getElementById('formFeedback');
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Simulate sending loading state
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <div class="spinner"></div>
        <span>Enviando...</span>
    `;

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
            <strong><i data-lucide="check-circle-2"></i> Mensagem Enviada com Sucesso!</strong><br>
            Obrigado, ${name}! Pr. Thomas Magnum recebeu seu contato e responderá em breve.
        `;
        feedback.classList.remove('hidden');

        // Re-render icons if needed
        if (window.lucide) lucide.createIcons();

        form.reset();

        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 8000);
    }, 1200);
}

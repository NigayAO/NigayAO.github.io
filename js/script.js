function setLanguage(lang) {
    const isRussian = lang === 'ru';
    document.querySelectorAll('.lang-ru').forEach(el => {
        el.style.display = isRussian ? 'block' : 'none';
    });
    document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = isRussian ? 'none' : 'block';
    });
    document.querySelectorAll('.language-toggle button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === lang.toUpperCase());
    });
    localStorage.setItem('preferredLanguage', lang);
}

function detectLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        setLanguage(savedLang);
        return;
    }
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith('ru') ? 'ru' : 'en');
}

document.addEventListener('DOMContentLoaded', function() {
    detectLanguage();

    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        lastScroll = currentScroll;
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        if (button.getAttribute('href') === '#contact') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = contactSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const isRussian = document.querySelector('.lang-ru').style.display !== 'none';
            const subject = isRussian ? 'Новый запрос с сайта' : 'New inquiry from website';
            const body = isRussian 
                ? `Имя: ${name}\nEmail: ${email}\n\nСообщение:\n${message}`
                : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            window.location.href = `mailto:ceo@nigaiao.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    function setupModal(triggerID, modalID) {
        const triggers = document.querySelectorAll(`#${triggerID}, #${triggerID}-en`);
        const modal = document.getElementById(modalID);
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.close-btn');

        triggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupModal('privacy-policy', 'privacy-modal');
    setupModal('terms-of-use', 'terms-modal');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

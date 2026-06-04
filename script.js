// ============================================
// VERACITY AUTOTRONIX - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== PROGRESS BAR =====
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ===== MOBILE HAMBURGER =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    }

    // ===== REVEAL ON SCROLL =====
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
                    siblings.forEach((el, idx) => {
                        setTimeout(() => el.classList.add('visible'), idx * 80);
                    });
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => revealObserver.observe(el));
    }

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    const suffix = target >= 100 ? '+' : '';
                    let count = 0;
                    const step = Math.max(target / 60, 1);
                    const timer = setInterval(() => {
                        count = Math.min(count + step, target);
                        entry.target.textContent = Math.floor(count) + suffix;
                        if (count >= target) clearInterval(timer);
                    }, 20);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => counterObserver.observe(el));
    }

    // ===== TESTIMONIALS CAROUSEL =====
    const track = document.getElementById('testiTrack');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    const dotsContainer = document.getElementById('testiDots');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.children);
        let current = 0;
        let autoPlay;

        // Build dots
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function getVisible() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function goTo(index) {
            const visible = getVisible();
            const max = cards.length - visible;
            current = Math.max(0, Math.min(index, max));
            const cardWidth = cards[0].offsetWidth + 24; // gap
            track.style.transform = `translateX(-${current * cardWidth}px)`;
            track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
            dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
        nextBtn.addEventListener('click', () => {
            const visible = getVisible();
            goTo(current + 1 > cards.length - visible ? 0 : current + 1);
            resetAutoplay();
        });

        function startAutoplay() {
            autoPlay = setInterval(() => {
                const visible = getVisible();
                goTo(current + 1 > cards.length - visible ? 0 : current + 1);
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(autoPlay);
            startAutoplay();
        }

        startAutoplay();
        window.addEventListener('resize', () => goTo(0));
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const originalHtml = btn.innerHTML;

            const nameVal    = document.getElementById('name').value.trim();
            const phoneVal   = document.getElementById('phone').value.trim();
            const emailVal   = document.getElementById('email').value.trim();
            const serviceEl  = document.getElementById('service');
            const serviceVal = serviceEl.options[serviceEl.selectedIndex].text !== 'Select a service...'
                ? serviceEl.options[serviceEl.selectedIndex].text : 'Not specified';
            const subjectVal = document.getElementById('subject').value.trim();
            const messageVal = document.getElementById('message').value.trim();

            // Build WhatsApp message
            const waText =
                `*New Enquiry – Veracity Autotronix Website*\n\n` +
                `*Name:* ${nameVal}\n` +
                `*Phone:* ${phoneVal}\n` +
                `*Email:* ${emailVal || 'Not provided'}\n` +
                `*Service Needed:* ${serviceVal}\n` +
                `*Subject:* ${subjectVal}\n` +
                `*Message:*\n${messageVal}`;

            const waUrl = `https://wa.me/265999732689?text=${encodeURIComponent(waText)}`;

            // Build mailto message
            const emailBody =
                `New enquiry from the Veracity Autotronix website:\n\n` +
                `Name: ${nameVal}\n` +
                `Phone: ${phoneVal}\n` +
                `Email: ${emailVal || 'Not provided'}\n` +
                `Service Needed: ${serviceVal}\n` +
                `Subject: ${subjectVal}\n\n` +
                `Message:\n${messageVal}`;

            const mailtoUrl =
                `mailto:tenny85son@gmail.com,veracityautotronix@gmail.com` +
                `?subject=${encodeURIComponent('Contact Form: ' + subjectVal)}` +
                `&body=${encodeURIComponent(emailBody)}`;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.8';

            // Open WhatsApp in a new tab
            window.open(waUrl, '_blank');

            // Trigger email client (stays on same page; browser opens mail app)
            const mailLink = document.createElement('a');
            mailLink.href = mailtoUrl;
            mailLink.style.display = 'none';
            document.body.appendChild(mailLink);
            mailLink.click();
            document.body.removeChild(mailLink);

            btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            btn.style.background = '#007a3d';
            showToast('Opening WhatsApp & email with your message!', 'success');

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.background = '';
                contactForm.reset();
            }, 3500);
        });
    }

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.va-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'va-toast';
        toast.style.cssText = `
            position:fixed;bottom:90px;right:24px;z-index:10000;
            background:${type === 'success' ? '#00A651' : '#e84040'};
            color:#fff;padding:1rem 1.5rem;border-radius:12px;
            font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:500;
            display:flex;align-items:center;gap:10px;
            box-shadow:0 8px 30px rgba(0,0,0,0.2);
            animation:toastIn 0.3s ease;
            max-width:340px;
        `;

        const style = document.createElement('style');
        style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(style);

        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => toast.remove(), 350);
        }, 3500);
    }

    // Welcome toast on index page
    if (window.location.pathname.includes('index') || window.location.pathname === '/' || window.location.pathname.endsWith('/veracity/')) {
        setTimeout(() => showToast('Welcome to Veracity Autotronix! 🔋', 'success'), 1500);
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

});

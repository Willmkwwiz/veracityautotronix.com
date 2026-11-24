// ============================================
// VERACITY AUTOTRONIX - MAIN JAVASCRIPT
// ============================================

(function () {
    'use strict';

    const WHATSAPP_NUMBER = '265999732689';
    const CONTACT_EMAIL   = 'veracityautotronix@gmail.com';
    const reduceMotion    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.va-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'va-toast va-toast-' + type;
        toast.setAttribute('role', 'status');

        const icon = document.createElement('i');
        icon.className = 'fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle');
        icon.setAttribute('aria-hidden', 'true');
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('va-toast-out');
            setTimeout(() => toast.remove(), 350);
        }, 4500);
    }

    document.addEventListener('DOMContentLoaded', () => {

        // ===== PROGRESS BAR + NAVBAR (one passive scroll handler) =====
        const progressBar = document.getElementById('progressBar');
        const navbar = document.getElementById('navbar');
        let ticking = false;

        function onScroll() {
            const h = document.documentElement;
            if (progressBar) {
                const max = h.scrollHeight - h.clientHeight;
                progressBar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
            }
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
        }, { passive: true });
        onScroll();

        // ===== MOBILE MENU =====
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks) {
            const setMenu = (open) => {
                hamburger.classList.toggle('open', open);
                navLinks.classList.toggle('open', open);
                hamburger.setAttribute('aria-expanded', String(open));
                hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            };

            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                setMenu(!navLinks.classList.contains('open'));
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => setMenu(false));
            });
            document.addEventListener('click', (e) => {
                if (navbar && !navbar.contains(e.target)) setMenu(false);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                    setMenu(false);
                    hamburger.focus();
                }
            });
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) setMenu(false);
            });
        }

        // ===== REVEAL ON SCROLL =====
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            reveals.forEach(el => revealObserver.observe(el));
        }

        // ===== COUNTER ANIMATION =====
        // The real value is already in the HTML, so the page is correct without JS.
        const counters = document.querySelectorAll('[data-target]');
        if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    const suffix = el.getAttribute('data-suffix') || '';
                    let count = 0;
                    const step = Math.max(target / 60, 1);
                    const timer = setInterval(() => {
                        count = Math.min(count + step, target);
                        el.textContent = Math.floor(count) + suffix;
                        if (count >= target) clearInterval(timer);
                    }, 20);
                    counterObserver.unobserve(el);
                });
            }, { threshold: 0.5 });
            counters.forEach(el => counterObserver.observe(el));
        }

        // ===== TESTIMONIALS CAROUSEL =====
        const track = document.getElementById('testiTrack');
        const prevBtn = document.getElementById('testPrev');
        const nextBtn = document.getElementById('testNext');
        const dotsContainer = document.getElementById('testiDots');

        if (track && prevBtn && nextBtn && dotsContainer) {
            const cards = Array.from(track.children);
            let current = 0;
            let autoPlay = null;

            prevBtn.setAttribute('aria-label', 'Previous review');
            nextBtn.setAttribute('aria-label', 'Next review');

            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Show review ' + (i + 1));
                dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
                dotsContainer.appendChild(dot);
            });

            const getVisible = () => (window.innerWidth <= 768 ? 1 : 2);

            function goTo(index) {
                const max = Math.max(0, cards.length - getVisible());
                current = Math.max(0, Math.min(index, max));
                const cardWidth = cards[0].offsetWidth + 24; // card + gap
                track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
                track.style.transition = reduceMotion ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === current);
                });
            }

            const advance = () => {
                const max = cards.length - getVisible();
                goTo(current + 1 > max ? 0 : current + 1);
            };

            prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
            nextBtn.addEventListener('click', () => { advance(); resetAutoplay(); });

            function startAutoplay() {
                if (reduceMotion) return;
                autoPlay = setInterval(advance, 5000);
            }
            function stopAutoplay() { clearInterval(autoPlay); }
            function resetAutoplay() { stopAutoplay(); startAutoplay(); }

            const carousel = track.parentElement;
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            carousel.addEventListener('focusin', stopAutoplay);
            carousel.addEventListener('focusout', startAutoplay);

            startAutoplay();
            window.addEventListener('resize', () => goTo(0));
        }

        // ===== CONTACT FORM =====
        // Opens WhatsApp (primary) or the visitor's email app (secondary) with the message pre-filled.
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const emailBtn = document.getElementById('emailBtn');
            const note = document.getElementById('formNote');

            const collect = () => {
                const serviceEl = document.getElementById('service');
                const chosen = serviceEl.options[serviceEl.selectedIndex];
                return {
                    name:    document.getElementById('name').value.trim(),
                    phone:   document.getElementById('phone').value.trim(),
                    email:   document.getElementById('email').value.trim() || 'Not provided',
                    service: chosen && chosen.value ? chosen.text : 'Not specified',
                    subject: document.getElementById('subject').value.trim(),
                    message: document.getElementById('message').value.trim()
                };
            };

            // Native validation messages, but we handle submission ourselves.
            const isValid = () => {
                if (contactForm.reportValidity()) return true;
                showToast('Please fill in the highlighted fields.', 'error');
                return false;
            };
            const isBot = () => {
                const hp = document.getElementById('website_url');
                return hp && hp.value.trim() !== '';
            };

            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (isBot() || !isValid()) return;
                const d = collect();
                const text =
                    '*New enquiry – Veracity Autotronix website*\n\n' +
                    '*Name:* ' + d.name + '\n' +
                    '*Phone:* ' + d.phone + '\n' +
                    '*Email:* ' + d.email + '\n' +
                    '*Service:* ' + d.service + '\n' +
                    '*Subject:* ' + d.subject + '\n\n' +
                    '*Message:*\n' + d.message;
                window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
                if (note) note.textContent = 'WhatsApp is open. Press send there to deliver your message.';
                showToast('WhatsApp opened. Press send to deliver your message.');
            });

            if (emailBtn) {
                emailBtn.addEventListener('click', () => {
                    if (isBot() || !isValid()) return;
                    const d = collect();
                    const body =
                        'New enquiry from the Veracity Autotronix website:\n\n' +
                        'Name: ' + d.name + '\n' +
                        'Phone: ' + d.phone + '\n' +
                        'Email: ' + d.email + '\n' +
                        'Service: ' + d.service + '\n' +
                        'Subject: ' + d.subject + '\n\n' +
                        'Message:\n' + d.message;
                    window.location.href = 'mailto:' + CONTACT_EMAIL +
                        '?subject=' + encodeURIComponent('Website enquiry: ' + d.subject) +
                        '&body=' + encodeURIComponent(body);
                    if (note) note.textContent = 'Your email app should open with the message ready. Press send there to deliver it.';
                    showToast('Opening your email app. Press send to deliver your message.');
                });
            }
        }

        // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            a.addEventListener('click', (e) => {
                const target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: reduceMotion ? 'auto' : 'smooth' });
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            });
        });
    });
})();

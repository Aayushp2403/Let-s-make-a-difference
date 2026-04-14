// ============================================
// Let's Make A Difference — Global JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var el = document.querySelector(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Active nav link highlighting ---
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(function (link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Header scroll effect ---
    var header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Hamburger menu toggle ---
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            nav.classList.toggle('nav-open');
        });

        // Close menu when a nav link is clicked
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                nav.classList.remove('nav-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                toggle.classList.remove('active');
                nav.classList.remove('nav-open');
            }
        });
    }

    // --- Scroll-triggered fade-in animations ---
    var fadeElements = document.querySelectorAll('.fade-in, .blog-post');

    if (fadeElements.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger delay for siblings in a grid
                    var parent = entry.target.parentElement;
                    var siblings = parent ? Array.from(parent.children).filter(function (c) {
                        return c.classList.contains('fade-in') || c.classList.contains('blog-post');
                    }) : [];
                    var index = siblings.indexOf(entry.target);
                    var delay = index >= 0 ? index * 100 : 0;

                    entry.target.style.animationDelay = delay + 'ms';
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    }

});

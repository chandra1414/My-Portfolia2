/* =========================================================
   Section entrance animations
   - Plays every time an element scrolls into view (also when you
     scroll away and come back) and when a menu link is clicked.
   - Skipped when the visitor prefers reduced motion, or the
     browser has no IntersectionObserver. In both cases the page
     simply shows everything normally.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        return;
    }

    // Tells the CSS that scripting is available, so it can hide elements until they animate in.
    root.classList.add('js');

    // [CSS selector, animation type]. Edit this list to change what animates and how.
    // Types: up, left, right, zoom  (see ".reveal--*" in style.css)
    var GROUPS = [
        ['.section:not(.hero) .section__head', 'left'],
        ['.section:not(.hero) .lead', 'up'],
        ['.grid--cards .card', 'up'],
        ['.chips--strengths', 'up'],
        ['.skill-filter', 'up'],
        ['.skill', 'zoom'],
        ['.timeline__item', 'left'],
        ['.project', 'zoom'],
        ['.resume', 'zoom'],
        ['.contact__info', 'left'],
        ['.form', 'right']
    ];

    var STAGGER = 0.08;      // seconds between siblings
    var MAX_DELAY = 0.5;     // never wait longer than this

    function setup() {
        var items = [];

        GROUPS.forEach(function (group) {
            var list = document.querySelectorAll(group[0]);
            Array.prototype.forEach.call(list, function (el, index) {
                el.classList.add('reveal', 'reveal--' + group[1]);
                el.style.setProperty('--d', Math.min(index * STAGGER, MAX_DELAY).toFixed(2) + 's');
                items.push(el);
            });
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var el = entry.target;
                var bigEnough = entry.intersectionRatio >= 0.1 ||
                    entry.intersectionRect.height > window.innerHeight * 0.4;

                if (entry.isIntersecting && bigEnough) {
                    el.classList.add('in-view');
                } else if (!entry.isIntersecting) {
                    el.classList.remove('in-view'); // reset, so it plays again next time
                }
            });
        }, { threshold: [0, 0.1], rootMargin: '0px 0px -6% 0px' });

        items.forEach(function (el) { observer.observe(el); });

        // Menu click: replay the target section even if it is already on screen.
        var links = document.querySelectorAll('.nav__link[href^="#"], .hero__actions a[href^="#"]');
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function () {
                var section = document.querySelector(link.getAttribute('href'));
                if (!section) { return; }

                var targets = section.querySelectorAll('.reveal');
                Array.prototype.forEach.call(targets, function (el) { el.classList.remove('in-view'); });

                window.setTimeout(function () {
                    Array.prototype.forEach.call(targets, function (el) {
                        var r = el.getBoundingClientRect();
                        if (r.top < window.innerHeight * 0.94 && r.bottom > 0 && el.offsetParent !== null) {
                            el.classList.add('in-view');
                        }
                    });
                }, 60);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
(function () {
    var sidebar = document.getElementById("site-sidebar");
    if (!sidebar) {
        return;
    }

    var links = [].slice.call(sidebar.querySelectorAll('.sidebar-nav a[href^="#"]'));
    if (!links.length) {
        return;
    }

    var targets = links
        .map(function (link) {
            var hash = link.getAttribute("href");
            var el = null;

            if (hash === "#page-top") {
                el = document.body;
            } else if (hash && hash.length > 1) {
                try {
                    el = document.querySelector(hash);
                } catch (error) {
                    el = null;
                }
            }

            return { link: link, el: el };
        })
        .filter(function (target) {
            return target.el;
        });

    if (!targets.length) {
        return;
    }

    var scheduled = false;

    function topOf(el) {
        if (el === document.body) {
            return 0;
        }
        return el.getBoundingClientRect().top + window.pageYOffset;
    }

    function update() {
        scheduled = false;

        // Probe a little below the viewport top so a section counts as "current"
        // once it meaningfully occupies the screen, not the instant it peeks in.
        var probe = window.pageYOffset + window.innerHeight * 0.3;
        var current = targets[0];

        for (var i = 0; i < targets.length; i++) {
            if (topOf(targets[i].el) <= probe) {
                current = targets[i];
            }
        }

        // At the very bottom the last section may be too short to ever cross the
        // probe line, so pin the final entry once the page is scrolled out.
        var atBottom = window.innerHeight + window.pageYOffset >=
            document.documentElement.scrollHeight - 2;
        if (atBottom) {
            current = targets[targets.length - 1];
        }

        targets.forEach(function (target) {
            var isActive = target === current;
            var item = target.link.parentNode;

            if (isActive) {
                item.classList.add("active");
                target.link.setAttribute("aria-current", "true");
            } else {
                item.classList.remove("active");
                target.link.removeAttribute("aria-current");
            }
        });
    }

    function onScroll() {
        if (!scheduled) {
            scheduled = true;
            window.setTimeout(update, 50);
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", update);
    update();
})();

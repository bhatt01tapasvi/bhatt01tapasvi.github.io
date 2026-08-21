(function () {
    var storageKey = "site-theme";
    var root = document.documentElement;
    var toggleButtons = [].slice.call(document.querySelectorAll("[data-theme-toggle]"));

    function applyTheme(theme) {
        var activeTheme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", activeTheme);

        var nextLabel = activeTheme === "dark" ? "Light" : "Dark";
        var ariaLabel = activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

        toggleButtons.forEach(function (button) {
            var label = button.querySelector("[data-theme-label]");
            if (label) {
                label.textContent = nextLabel;
            } else {
                button.textContent = nextLabel;
            }

            var icon = button.querySelector("i.fa");
            if (icon) {
                icon.className = activeTheme === "dark" ? "fa fa-sun-o" : "fa fa-moon-o";
            }

            button.setAttribute("aria-label", ariaLabel);
        });
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            return;
        }
    }

    function getSystemTheme() {
        try {
            return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } catch (error) {
            return "light";
        }
    }

    var preferred = getStoredTheme();
    applyTheme(preferred || getSystemTheme());

    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
            var next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            setStoredTheme(next);
        });
    });
})();

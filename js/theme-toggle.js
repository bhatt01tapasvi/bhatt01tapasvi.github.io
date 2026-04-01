(function () {
    var storageKey = "site-theme";
    var root = document.documentElement;
    var toggleButton = document.getElementById("theme-toggle");

    function applyTheme(theme) {
        var activeTheme = theme === "dark" ? "dark" : "light";
        root.setAttribute("data-theme", activeTheme);

        if (toggleButton) {
            toggleButton.textContent = activeTheme === "dark" ? "Light" : "Dark";
            toggleButton.setAttribute("aria-label", activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        }
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

    var preferred = getStoredTheme();
    applyTheme(preferred || "dark");

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
            var next = current === "dark" ? "light" : "dark";
            applyTheme(next);
            setStoredTheme(next);
        });
    }
})();

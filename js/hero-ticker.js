(function () {
    var items = [].slice.call(document.querySelectorAll(".hero-ticker-item"));
    var dots = [].slice.call(document.querySelectorAll(".hero-ticker-dot"));
    if (items.length < 2) {
        return;
    }

    var current = items.findIndex(function (el) {
        return el.classList.contains("is-active");
    });
    if (current < 0) {
        current = 0;
        items[0].classList.add("is-active");
    }

    setInterval(function () {
        items[current].classList.remove("is-active");
        if (dots[current]) {
            dots[current].classList.remove("is-active");
        }
        current = (current + 1) % items.length;
        items[current].classList.add("is-active");
        if (dots[current]) {
            dots[current].classList.add("is-active");
        }
    }, 3000);
})();

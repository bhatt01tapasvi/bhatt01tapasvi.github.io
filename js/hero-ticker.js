(function () {
    var items = [].slice.call(document.querySelectorAll(".hero-ticker-item"));
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
        current = (current + 1) % items.length;
        items[current].classList.add("is-active");
    }, 5000);
})();

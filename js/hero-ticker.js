(function () {
    var items = [].slice.call(document.querySelectorAll(".hero-ticker-item"));
    var captions = [].slice.call(document.querySelectorAll(".hero-ticker-caption"));
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

    function setActive(index, active) {
        if (items[index]) {
            items[index].classList.toggle("is-active", active);
        }
        if (captions[index]) {
            captions[index].classList.toggle("is-active", active);
        }
        if (dots[index]) {
            dots[index].classList.toggle("is-active", active);
        }
    }

    setInterval(function () {
        setActive(current, false);
        current = (current + 1) % items.length;
        setActive(current, true);
    }, 3000);
})();

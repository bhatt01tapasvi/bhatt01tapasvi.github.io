(function () {
    var row = document.querySelector(".research-card-row");
    if (!row) {
        return;
    }

    function getColumnCount() {
        if (window.innerWidth <= 600) {
            return 1;
        }
        if (window.innerWidth <= 991) {
            return 2;
        }
        return 3;
    }

    function arrangeCards() {
        var cards = Array.prototype.slice.call(row.querySelectorAll(".research-card-col"));
        var columns = [];
        var columnHeights = [];
        var columnCount = getColumnCount();

        columns.length = columnCount;
        columnHeights.length = columnCount;
        for (var index = 0; index < columnCount; index += 1) {
            columns[index] = document.createElement("div");
            columns[index].className = "research-masonry-column";
            columnHeights[index] = 0;
        }

        row.replaceChildren.apply(row, columns);

        cards.forEach(function (card, cardIndex) {
            var targetColumn = cardIndex < columnCount
                ? cardIndex
                : columnHeights.indexOf(Math.min.apply(Math, columnHeights));
            columns[targetColumn].appendChild(card);
            columnHeights[targetColumn] += card.offsetHeight + 20;
        });
    }

    var resizeTimer;
    function arrangeAfterResize() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(arrangeCards, 120);
    }

    arrangeCards();
    window.addEventListener("resize", arrangeAfterResize);
})();

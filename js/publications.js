(function () {
    var scholarDataUrl = "/assets/data/google-scholar.json";
    var pageSize = 8;
    var currentPage = 1;
    var allPublications = [];

    var galleryImages = [
        "img/about/asme.jpg",
        "img/about/bits.jpg",
        "img/about/bpcl.jpg",
        "img/about/ff7.JPG",
        "img/portfolio/japan2.JPG",
        "img/portfolio/japan_NTU3.jpg",
        "img/about/IMG-20250708-WA0014.jpg",
        "img/about/IMG-20250708-WA0015.jpg",
        "img/about/IMG-20250708-WA0016.jpg",
        "img/about/IMG-20250708-WA0023.jpg",
        "img/about/jsw.jpg",
        "img/about/study.jpg",
        "img/about/ta.jpg",
        "img/portfolio/japan_NTU5.jpg",
        "img/portfolio/biking.png",
        "img/portfolio/chess.png",
        "img/portfolio/ohms.jpg",
        "img/portfolio/teaching.jpg",
        "img/portfolio/japan_NTU2.jpg",
    ];

    function numberOrDash(value) {
        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatSyncDate(isoDate) {
        if (!isoDate) {
            return "Not synced yet";
        }

        var date = new Date(isoDate);
        if (isNaN(date.getTime())) {
            return "Not synced yet";
        }

        return date.toLocaleString();
    }

    function renderStats(profile, publications) {
        var statsContainer = document.getElementById("scholar-stats");
        if (!statsContainer) {
            return;
        }

        statsContainer.innerHTML = [
            '<div class="metric-card"><span class="metric-label">Publications</span><span class="metric-value">' + publications.length + '</span></div>',
            '<div class="metric-card"><span class="metric-label">Citations</span><span class="metric-value">' + numberOrDash(profile.total_citations) + '</span></div>',
            '<div class="metric-card"><span class="metric-label">h-index</span><span class="metric-value">' + numberOrDash(profile.h_index) + '</span></div>',
            '<div class="metric-card"><span class="metric-label">i10-index</span><span class="metric-value">' + numberOrDash(profile.i10_index) + '</span></div>'
        ].join("");

        var syncInfo = document.getElementById("scholar-sync-info");
        if (syncInfo) {
            syncInfo.innerHTML = 'Last synced: <strong>' + formatSyncDate(profile.last_synced_utc) + '</strong> | Auto refresh: monthly via GitHub Actions (manual run available)';
        }
    }

    function getFilteredPublications() {
        var searchInput = document.getElementById("pub-search");
        var yearSelect = document.getElementById("pub-year-filter");
        var sortSelect = document.getElementById("pub-sort");

        var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        var yearFilter = yearSelect ? yearSelect.value : "all";
        var sortMode = sortSelect ? sortSelect.value : "newest";

        var filtered = allPublications.filter(function (item) {
            var matchesYear = yearFilter === "all" || String(item.year || "") === yearFilter;
            if (!matchesYear) {
                return false;
            }

            if (!query) {
                return true;
            }

            var haystack = [item.title, item.authors, item.venue].join(" ").toLowerCase();
            return haystack.indexOf(query) !== -1;
        });

        filtered.sort(function (a, b) {
            if (sortMode === "cited") {
                return (b.citations || 0) - (a.citations || 0);
            }

            if (sortMode === "title") {
                return (a.title || "").localeCompare(b.title || "");
            }

            return (b.year || 0) - (a.year || 0);
        });

        return filtered;
    }

    function populateYearFilter(publications) {
        var yearSelect = document.getElementById("pub-year-filter");
        if (!yearSelect) {
            return;
        }

        var years = {};
        publications.forEach(function (item) {
            if (item.year) {
                years[item.year] = true;
            }
        });

        var sortedYears = Object.keys(years).sort(function (a, b) {
            return Number(b) - Number(a);
        });

        sortedYears.forEach(function (year) {
            var option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }

    function renderPublications() {
        var listContainer = document.getElementById("publication-list");
        var prevButton = document.getElementById("pub-prev");
        var nextButton = document.getElementById("pub-next");
        var pageIndicator = document.getElementById("pub-page-indicator");
        var countNode = document.getElementById("pub-count");

        if (!listContainer) {
            return;
        }

        var filteredPublications = getFilteredPublications();

        if (!filteredPublications.length) {
            listContainer.innerHTML = '<p class="text-muted">Publications are syncing. Please check back in a few minutes.</p>';
            if (countNode) {
                countNode.textContent = "No papers found for this filter.";
            }
            if (pageIndicator) {
                pageIndicator.textContent = "0 / 0";
            }
            if (prevButton) {
                prevButton.disabled = true;
            }
            if (nextButton) {
                nextButton.disabled = true;
            }
            return;
        }

        var totalPages = Math.max(1, Math.ceil(filteredPublications.length / pageSize));
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        var start = (currentPage - 1) * pageSize;
        var end = start + pageSize;
        var shownPublications = filteredPublications.slice(start, end);

        var items = shownPublications.map(function (item, index) {
            var year = item.year ? item.year : "In progress";
            var citations = typeof item.citations === "number" ? item.citations : 0;
            var venue = item.venue ? item.venue : "Venue not listed";
            var authors = item.authors ? item.authors : "Authors not listed";
            var absoluteIndex = start + index + 1;
            var paperLink = item.url
                ? '<a class="publication-link" href="' + item.url + '" target="_blank" rel="noopener noreferrer">Open paper</a>'
                : '<span class="text-muted">Link not available</span>';

            return [
                '<article class="pub-card-alt">',
                '<div class="pub-card-top">',
                '<span class="pub-pill">#' + absoluteIndex + '</span>',
                '<span class="pub-pill">' + escapeHtml(String(year)) + '</span>',
                '<span class="pub-pill">' + citations + ' cites</span>',
                '</div>',
                '<h4 class="pub-card-title">' + escapeHtml(item.title) + '</h4>',
                '<p class="pub-card-journal">Journal / Venue: ' + escapeHtml(venue) + '</p>',
                '<p class="pub-card-authors">' + escapeHtml(authors) + '</p>',
                '<div class="pub-card-actions">' + paperLink + '</div>',
                '</article>'
            ].join("");
        });

        listContainer.innerHTML = '<div class="publication-card-grid">' + items.join("") + '</div>';

        if (countNode) {
            countNode.textContent = 'Showing ' + (start + 1) + '-' + (start + shownPublications.length) + ' of ' + filteredPublications.length + ' papers';
        }

        if (pageIndicator) {
            pageIndicator.textContent = currentPage + ' / ' + totalPages;
        }

        if (prevButton) {
            prevButton.disabled = currentPage <= 1;
        }

        if (nextButton) {
            nextButton.disabled = currentPage >= totalPages;
        }
    }

    function renderGallery() {
        var galleryContainer = document.getElementById("gallery-grid");
        if (!galleryContainer) {
            return;
        }

        var cards = galleryImages.map(function (path) {
            var filename = path.split("/").pop();
            return [
                '<figure class="gallery-card">',
                '<img src="' + path + '" alt="' + filename + '" loading="lazy" data-gallery-item="true" tabindex="0">',
                '</figure>'
            ].join("");
        });

        galleryContainer.innerHTML = cards.join("");
    }

    function setupPublicationControls() {
        var searchInput = document.getElementById("pub-search");
        var yearSelect = document.getElementById("pub-year-filter");
        var sortSelect = document.getElementById("pub-sort");
        var pageSizeSelect = document.getElementById("pub-page-size");
        var prevButton = document.getElementById("pub-prev");
        var nextButton = document.getElementById("pub-next");
        var listContainer = document.getElementById("publication-list");

        function rerenderFromStart() {
            currentPage = 1;
            renderPublications();
        }

        if (searchInput) {
            searchInput.addEventListener("input", rerenderFromStart);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", rerenderFromStart);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", rerenderFromStart);
        }

        if (pageSizeSelect) {
            pageSizeSelect.addEventListener("change", function () {
                pageSize = Number(pageSizeSelect.value) || 8;
                currentPage = 1;
                renderPublications();
            });
        }

        if (prevButton) {
            prevButton.addEventListener("click", function () {
                if (currentPage > 1) {
                    currentPage -= 1;
                    renderPublications();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                currentPage += 1;
                renderPublications();
            });
        }

        // Alternate layout does not use expandable rows.
    }

    function setupGalleryLightbox() {
        var lightbox = document.getElementById("gallery-lightbox");
        var lightboxImage = document.getElementById("gallery-lightbox-image");
        var lightboxCaption = document.getElementById("gallery-lightbox-caption");
        var closeButton = document.getElementById("gallery-lightbox-close");
        var galleryContainer = document.getElementById("gallery-grid");

        if (!lightbox || !lightboxImage || !lightboxCaption || !galleryContainer) {
            return;
        }

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            lightboxImage.src = "";
            lightboxCaption.textContent = "";
        }

        galleryContainer.addEventListener("click", function (event) {
            var target = event.target;
            if (!target || target.getAttribute("data-gallery-item") !== "true") {
                return;
            }

            lightboxImage.src = target.src;
            lightboxImage.alt = target.alt;
            lightboxCaption.textContent = "";
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
        });

        galleryContainer.addEventListener("keydown", function (event) {
            var target = event.target;
            if (!target || target.getAttribute("data-gallery-item") !== "true") {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                target.click();
            }
        });

        if (closeButton) {
            closeButton.addEventListener("click", closeLightbox);
        }

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
                closeLightbox();
            }
        });
    }

    function renderScholarError() {
        var listContainer = document.getElementById("publication-list");
        if (listContainer) {
            listContainer.innerHTML = '<p class="text-muted">Could not load Google Scholar data right now. Visit <a href="https://scholar.google.com/citations?user=6h51W0EAAAAJ&hl=en" target="_blank">Google Scholar profile</a>.</p>';
        }
    }

    function initializeScholar() {
        fetch(scholarDataUrl + "?t=" + Date.now(), { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Failed to fetch Scholar data");
                }
                return response.json();
            })
            .then(function (data) {
                var profile = data.profile || {};
                var publications = Array.isArray(data.publications) ? data.publications : [];
                allPublications = publications;

                renderStats(profile, publications);
                populateYearFilter(publications);
                setupPublicationControls();
                renderPublications();
            })
            .catch(function () {
                renderScholarError();
            });
    }

    renderGallery();
    setupGalleryLightbox();
    initializeScholar();
})();

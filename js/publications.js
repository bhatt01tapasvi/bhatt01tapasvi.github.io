(function () {
    var scholarDataUrl = "/assets/data/google-scholar.json";
    var maxPublications = 12;

    var galleryImages = [
        "img/about/1.jpg",
        "img/about/2.jpg",
        "img/about/3.jpg",
        "img/about/4.jpg",
        "img/about/asme.jpg",
        "img/about/bits.jpg",
        "img/about/bpcl.jpg",
        "img/about/chinesenews.jpg",
        "img/about/ff7.JPG",
        "img/about/firstSingapore.jpg",
        "img/about/grad.JPG",
        "img/about/iisc.jpg",
        "img/about/IMG-20250708-WA0006.jpg",
        "img/about/IMG-20250708-WA0007.jpg",
        "img/about/IMG-20250708-WA0008.jpg",
        "img/about/IMG-20250708-WA0010.jpg",
        "img/about/IMG-20250708-WA0011.jpg",
        "img/about/IMG-20250708-WA0012.jpg",
        "img/about/IMG-20250708-WA0013.jpg",
        "img/about/IMG-20250708-WA0014.jpg",
        "img/about/IMG-20250708-WA0015.jpg",
        "img/about/IMG-20250708-WA0016.jpg",
        "img/about/IMG-20250708-WA0018.jpg",
        "img/about/IMG-20250708-WA0021.jpg",
        "img/about/IMG-20250708-WA0022.jpg",
        "img/about/IMG-20250708-WA0023.jpg",
        "img/about/IMG-20250708-WA0027.jpg",
        "img/about/japan.JPG",
        "img/about/japan1_square.jpg",
        "img/about/jsw.jpg",
        "img/about/ml.JPG",
        "img/about/ntu.jpg",
        "img/about/ps_test.JPG",
        "img/about/study.jpg",
        "img/about/ta.jpg",
        "img/about/twitch.JPG",
        "img/about/uw.jpg",
        "img/team/1.jpg",
        "img/team/2.jpg",
        "img/team/3.jpg"
    ];

    function numberOrDash(value) {
        if (value === null || value === undefined || value === "") {
            return "-";
        }
        return value;
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
            syncInfo.innerHTML = 'Last synced: <strong>' + formatSyncDate(profile.last_synced_utc) + '</strong> | Auto-refresh: hourly via GitHub Actions';
        }
    }

    function renderPublications(publications) {
        var listContainer = document.getElementById("publication-list");
        if (!listContainer) {
            return;
        }

        if (!publications.length) {
            listContainer.innerHTML = '<p class="text-muted">Publications are syncing. Please check back in a few minutes.</p>';
            return;
        }

        var items = publications.slice(0, maxPublications).map(function (item, index) {
            var year = item.year ? item.year : "In progress";
            var citations = typeof item.citations === "number" ? item.citations : 0;
            var venue = item.venue ? item.venue : "Venue not listed";
            var authors = item.authors ? item.authors : "Authors not listed";
            var linkStart = item.url ? '<a class="publication-link" href="' + item.url + '" target="_blank">' : "";
            var linkEnd = item.url ? "</a>" : "";

            return [
                '<article class="publication-card">',
                '<div class="publication-meta">',
                '<span class="pub-index">' + (index + 1) + '</span>',
                '<span class="pub-year">' + year + '</span>',
                '<span class="pub-citations">' + citations + ' citations</span>',
                '</div>',
                '<h4>' + linkStart + item.title + linkEnd + '</h4>',
                '<p class="pub-authors">' + authors + '</p>',
                '<p class="pub-venue">' + venue + '</p>',
                '</article>'
            ].join("");
        });

        listContainer.innerHTML = items.join("");
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
                '<img src="' + path + '" alt="' + filename + '" loading="lazy">',
                '<figcaption>' + filename + '</figcaption>',
                '</figure>'
            ].join("");
        });

        galleryContainer.innerHTML = cards.join("");
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

                renderStats(profile, publications);
                renderPublications(publications);
            })
            .catch(function () {
                renderScholarError();
            });
    }

    renderGallery();
    initializeScholar();
})();

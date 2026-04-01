import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://scholar.google.com/citations"
USER_ID = os.getenv("GOOGLE_SCHOLAR_USER_ID", "6h51W0EAAAAJ")
OUTPUT_FILE = Path("assets/data/google-scholar.json")


def fetch_html(session, params):
    response = session.get(BASE_URL, params=params, timeout=30)
    response.raise_for_status()
    return response.text


def parse_profile(soup):
    profile_name = soup.select_one("#gsc_prf_in")
    stats = [node.get_text(strip=True) for node in soup.select("td.gsc_rsb_std")]

    total_citations = None
    h_index = None
    i10_index = None

    if len(stats) >= 1:
        total_citations = int(stats[0]) if stats[0].isdigit() else stats[0]
    if len(stats) >= 3:
        h_index = int(stats[2]) if stats[2].isdigit() else stats[2]
    if len(stats) >= 5:
        i10_index = int(stats[4]) if stats[4].isdigit() else stats[4]

    return {
        "name": profile_name.get_text(strip=True) if profile_name else "",
        "user_id": USER_ID,
        "url": f"https://scholar.google.com/citations?user={USER_ID}&hl=en",
        "total_citations": total_citations,
        "h_index": h_index,
        "i10_index": i10_index,
        "last_synced_utc": datetime.now(timezone.utc).isoformat(),
    }


def parse_publication_row(row):
    title_link = row.select_one("a.gsc_a_at")
    gray_nodes = row.select(".gs_gray")
    citation_node = row.select_one(".gsc_a_c a")
    year_node = row.select_one(".gsc_a_y span")

    title = title_link.get_text(strip=True) if title_link else ""
    authors = gray_nodes[0].get_text(strip=True) if len(gray_nodes) > 0 else ""
    venue = gray_nodes[1].get_text(strip=True) if len(gray_nodes) > 1 else ""

    citations_text = citation_node.get_text(strip=True) if citation_node else "0"
    citations = int(citations_text) if citations_text.isdigit() else 0

    year_text = year_node.get_text(strip=True) if year_node else ""
    year = int(year_text) if year_text.isdigit() else None

    relative_url = title_link.get("href", "") if title_link else ""
    publication_url = urljoin("https://scholar.google.com", relative_url) if relative_url else ""

    return {
        "title": title,
        "authors": authors,
        "venue": venue,
        "year": year,
        "citations": citations,
        "url": publication_url,
    }


def fetch_publications(session):
    publications = []
    start = 0
    page_size = 100

    while True:
        html = fetch_html(
            session,
            {
                "user": USER_ID,
                "hl": "en",
                "view_op": "list_works",
                "sortby": "pubdate",
                "cstart": start,
                "pagesize": page_size,
            },
        )
        soup = BeautifulSoup(html, "html.parser")
        rows = soup.select("tr.gsc_a_tr")

        if not rows:
            break

        for row in rows:
            publication = parse_publication_row(row)
            if publication["title"]:
                publications.append(publication)

        if len(rows) < page_size:
            break

        start += page_size
        time.sleep(1)

    publications.sort(key=lambda item: ((item["year"] or 0), item["citations"]), reverse=True)
    return publications


def main():
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    }

    with requests.Session() as session:
        session.headers.update(headers)

        profile_html = fetch_html(
            session,
            {
                "user": USER_ID,
                "hl": "en",
                "view_op": "list_works",
                "sortby": "pubdate",
            },
        )
        profile_soup = BeautifulSoup(profile_html, "html.parser")
        profile = parse_profile(profile_soup)
        publications = fetch_publications(session)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    data = {
        "profile": profile,
        "publications": publications,
    }
    OUTPUT_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")

    print(f"Synced {len(publications)} publications to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

"""
CodeAlpha Data Analytics Internship
Task 1: Web Scraping

Website: https://books.toscrape.com/
This is a public demo website created specifically for web-scraping practice.
"""

import time
from pathlib import Path
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"
OUTPUT = Path("data/books.csv")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; CodeAlpha-WebScraper/1.0)"
}


def scrape_page(url: str) -> list[dict]:
    """Scrape book cards from one catalog page."""
    response = requests.get(url, headers=HEADERS, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    rows = []

    for card in soup.select("article.product_pod"):
        title_tag = card.select_one("h3 a")
        price_tag = card.select_one(".price_color")
        availability_tag = card.select_one(".availability")
        rating_tag = card.select_one("p.star-rating")

        title = title_tag.get("title", "").strip()
        detail_url = urljoin(url, title_tag.get("href", ""))
        price_text = price_tag.get_text(" ", strip=True)
        price = float(price_text.replace("£", "").replace("Â", ""))

        availability = availability_tag.get_text(" ", strip=True)
        rating = ""
        if rating_tag:
            classes = rating_tag.get("class", [])
            rating_words = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
            for word, value in rating_words.items():
                if word in classes:
                    rating = value
                    break

        rows.append({
            "title": title,
            "price_gbp": price,
            "availability": availability,
            "rating": rating,
            "product_url": detail_url,
        })

    return rows


def scrape_catalog(max_pages: int = 50, delay: float = 0.4) -> pd.DataFrame:
    """Scrape up to max_pages from the Books to Scrape catalog."""
    all_rows = []

    for page in range(1, max_pages + 1):
        url = BASE_URL.format(page)

        try:
            rows = scrape_page(url)
        except requests.RequestException as exc:
            print(f"Stopped at page {page}: {exc}")
            break

        if not rows:
            break

        all_rows.extend(rows)
        print(f"Page {page}: {len(rows)} books | Total: {len(all_rows)}")
        time.sleep(delay)

    df = pd.DataFrame(all_rows).drop_duplicates(subset=["title"])
    return df


if __name__ == "__main__":
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    books = scrape_catalog(max_pages=50)

    # Basic cleaning
    books["price_gbp"] = pd.to_numeric(books["price_gbp"], errors="coerce")
    books["rating"] = pd.to_numeric(books["rating"], errors="coerce")
    books["availability"] = (
        books["availability"]
        .str.replace(r"\s+", " ", regex=True)
        .str.strip()
    )

    books.to_csv(OUTPUT, index=False)
    print(f"\nSaved {len(books)} books to {OUTPUT}")

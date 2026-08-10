# 📚 CodeAlpha Web Scraping — Books Dataset

> **CodeAlpha Data Analytics Internship — Task 1: Web Scraping**

This project demonstrates web scraping with **Python, Requests, BeautifulSoup, and Pandas**.

The scraper collects structured book information from **Books to Scrape**, a public demo website designed for practicing web scraping.

## 🎯 Objective

The goal is to:

- Access a public webpage with Python
- Parse HTML using BeautifulSoup
- Extract useful fields from product cards
- Navigate multiple catalogue pages
- Clean the scraped data
- Store the result as a CSV dataset

## 🌐 Source Website

**Books to Scrape:** https://books.toscrape.com/

The website identifies itself as a sandbox for scraping practice. Its prices and ratings are randomly assigned and should not be interpreted as real market data.

## 📊 Data Collected

The scraper extracts:

| Field | Description |
|---|---|
| `title` | Book title |
| `price_gbp` | Listed price in GBP |
| `availability` | Stock/availability text |
| `rating` | Star rating from 1–5 |
| `product_url` | URL of the product page |

## 🛠️ Technologies

- Python
- Requests
- BeautifulSoup
- Pandas
- Jupyter Notebook
- HTML/CSS parsing

## 📂 Project Structure

```text
CodeAlpha_WebScraping_Books/
│
├── data/
│   └── sample_books.csv
│
├── notebooks/
│   └── web_scraping.ipynb
│
├── src/
│   └── scraper.py
│
├── reports/
│
├── requirements.txt
└── README.md
```

After running the scraper, it creates:

```text
data/books.csv
```

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CodeAlpha_WebScraping_Books
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the scraper

```bash
python src/scraper.py
```

The scraper checks up to 50 catalogue pages, pauses briefly between requests, removes duplicate titles, and saves the dataset to `data/books.csv`.

### 4. Run the notebook

```bash
jupyter notebook
```

Open:

```text
notebooks/web_scraping.ipynb
```

## 🔍 Scraping Workflow

```text
Public Website
      ↓
HTTP Request
      ↓
HTML Response
      ↓
BeautifulSoup Parser
      ↓
Extract Product Cards
      ↓
Clean Fields
      ↓
Pandas DataFrame
      ↓
CSV Dataset
```

## 🧠 What I Learned

This project helped me strengthen my understanding of:

- Web scraping fundamentals
- HTML structure and CSS selectors
- HTTP requests
- BeautifulSoup parsing
- Data extraction
- Data cleaning
- Pandas DataFrames
- CSV generation
- Handling pagination
- Basic error handling
- Responsible scraping practices

## ⚠️ Note

The source website is a demo/sandbox website intended for scraping practice. The displayed prices and ratings are randomly assigned and have no real-world meaning.

## 👩‍💻 Author

**Manya Suresh**

BCA Student | Data Analytics & Frontend Development

## 📌 Internship

Developed as part of the **Data Analytics Internship at CodeAlpha**.

## 📄 License

This project is created for educational and internship purposes.

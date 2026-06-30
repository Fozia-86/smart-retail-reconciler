# Smart Retail Reconciler

A cloud-based SaaS application that automates invoice reconciliation using Flask, React, Google BigQuery, and Google Cloud Platform.

---

## Project Overview

Smart Retail Reconciler helps businesses process retail invoice data, store it in BigQuery, and visualize insights through a modern dashboard.

The application reads invoice records, validates the data, prevents duplicate entries, stores them in Google BigQuery, and displays live analytics including revenue, vendors, invoices, and charts.

---

## Features

- Invoice Processing
- Google BigQuery Integration
- Revenue Dashboard
- Vendor Analytics
- Recent Invoice Table
- Duplicate Invoice Detection
- REST API with Flask
- React Dashboard
- Cloud Deployment on Render

---

## Tech Stack

### Frontend

- React.js
- Vite
- Recharts
- CSS

### Backend

- Flask
- Flask-CORS
- Python

### Database

- Google BigQuery

### Cloud

- Google Cloud Platform
- Render

---

## Project Structure

```
smart-retail-reconciler/
│
├── app.py
├── config.py
├── requirements.txt
├── README.md
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── App.jsx
│   ├── App.css
│   └── package.json
│
└── data/
    └── customer_shopping_data.csv
```

---

## Architecture

```
CSV Dataset
      │
      ▼
 Flask Backend
      │
      ▼
Google BigQuery
      │
      ▼
 REST APIs
      │
      ▼
React Dashboard
```

---

## Dashboard Features

- Total Invoices
- Total Revenue
- Total Vendors
- Pending Invoices
- Revenue Trend Chart
- Vendor Distribution Chart
- Recent Invoice Table

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health Check |
| `/stats` | GET | Dashboard Statistics |
| `/chart-data` | GET | Revenue Chart Data |
| `/vendor-chart` | GET | Vendor Analytics |
| `/invoices` | GET | Recent Invoices |

---

## Installation

Clone the repository

```bash
git clone https://github.com/Fozia-86/smart-retail-reconciler
```

Backend

```bash
pip install -r requirements.txt
python app.py
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file.

```
PROJECT_ID=your_project_id
DATASET_ID=your_dataset
TABLE_ID=your_table
```

Google Cloud credentials should be configured using a Service Account.

---

## Live Demo

### Dashboard

Add your Render Frontend URL here

```
https://smart-retail-reconciler-1.onrender.com
```

### Backend API

Add your Backend URL here

```
https://smart-retail-reconciler.onrender.com
```

---

## Future Improvements

- User Authentication
- PDF Invoice Upload
- AI-based Invoice Matching
- Export Reports
- Email Notifications
- Multi-user Support

---

## Author

**Fozia Tahira**

AI Engineer | Python | Flask | React | Google Cloud

---

## License

This project was developed for educational purposes as part of the Kaggle 5-Day AI Challenge.

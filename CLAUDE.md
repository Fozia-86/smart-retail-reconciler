# Smart Retail Reconciler

A SaaS platform for automated retail invoice reconciliation. Ingests shopping invoice CSVs from Google Cloud Storage, deduplicates them, and stores validated data in BigQuery. A React dashboard visualizes key metrics and recent transactions.

## Project Structure

```
smart-retail-reconciler/
├── app.py               # Flask backend (routes, BigQuery client)
├── config.py            # Environment configuration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (never commit)
├── service-account.json # GCP service account (never commit)
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx      # Main component
│   │   ├── App.css      # Global styles
│   │   ├── main.jsx     # React entry
│   │   ├── index.css    # CSS reset
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── Header.jsx
│   │       ├── StatCard.jsx
│   │       ├── RevenueChart.jsx
│   │       ├── InvoiceTable.jsx
│   │       └── SearchBar.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── data/                # Sample CSV data
```

## Architecture

- **Backend**: Flask + Google BigQuery (Python 3.9+)
  - Routes: `GET /` (health), `GET /stats` (KPI data), `GET /chart-data` (revenue trends), `POST /` (event-driven CSV ingestion)
  - BigQuery stores deduplicated invoices; duplicate detection by `sku_code`
  - Environment-driven config (PROJECT_ID, DATASET_ID, TABLE_ID)

- **Frontend**: React 19 + Vite + Recharts (dark SaaS theme)
  - Sidebar navigation, KPI stat cards, revenue line chart, invoice table
  - Data-wired to Flask backend (`http://127.0.0.1:8080`)
  - Responsive dark dashboard (`#0f172a`, `#1e293b`, cyan `#38bdf8` accents)

## Setup & Running

### Backend

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```

3. **Create `.env`** (example):
   ```
   PROJECT_ID=your-gcp-project
   DATASET_ID=invoices
   TABLE_ID=reconciled_invoices
   ```

4. **Run Flask**:
   ```bash
   python app.py
   ```
   Server listens on `http://127.0.0.1:8080`. Health check: `curl http://127.0.0.1:8080/`.

### Frontend

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` (Vite default).

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Lint**:
   ```bash
   npm run lint
   ```

## API Endpoints

- `GET /` → Plain text: "Smart Retail Reconciler Running"
- `GET /stats` → JSON: `{ invoices, revenue, vendors, pending }`
- `GET /chart-data` → JSON: `[{ month, revenue }, ...]`
- `POST /` → Receives GCS Pub/Sub event; processes CSV, deduplicates, inserts into BigQuery

## Environment Variables

Required in `.env` or system environment:
- `PROJECT_ID`: GCP project ID
- `DATASET_ID`: BigQuery dataset name
- `TABLE_ID`: BigQuery table name
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account JSON file (set via `export` or `.env`)

**Secrets**: Never commit `.env` or `service-account.json`. Add to `.gitignore`.

## Development Notes

- **Frontend–backend communication**: The frontend makes HTTP requests to `http://127.0.0.1:8080`. CORS is enabled.
- **BigQuery credentials**: Requires a GCP service account with BigQuery Data Editor + Job User roles.
- **CSV processing**: Expects columns: `invoice_no`, `price`, `invoice_date` (MM/DD/YYYY), `shopping_mall`.
- **Duplicate detection**: By `sku_code` (invoice_no). Duplicates are skipped with a 200 response.
- **Component conventions**: Reusable components live in `frontend/src/components/`; each file exports a default React function component.

## Common Commands

```bash
# Start both services (in separate terminals)
python app.py                              # Backend
cd frontend && npm run dev                 # Frontend

# Test API endpoints
curl http://127.0.0.1:8080/stats
curl http://127.0.0.1:8080/chart-data

# Frontend linting
cd frontend && npm run lint

# Build frontend
cd frontend && npm run build
```

## Debugging

- **Backend logs**: Flask logs to stdout; set `logging.basicConfig(level=logging.DEBUG)` for more detail.
- **Frontend console**: Browser DevTools (F12) for JS errors.
- **BigQuery queries**: Test queries in the GCP console or via `bq` CLI.
- **CORS errors**: Ensure Flask CORS is initialized *after* `app = Flask(...)`.

## Future Enhancements

- [ ] Invoice detail modal (search/filter)
- [ ] Real-time BigQuery syncing via Pub/Sub
- [ ] User authentication (OAuth 2.0)
- [ ] Export invoices to CSV
- [ ] Vendor performance reports
- [ ] Mobile-responsive layouts

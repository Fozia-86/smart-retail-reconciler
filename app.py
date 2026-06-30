import base64
import json
import csv
import logging
import time
import os

from flask import Flask, request
from google.cloud import bigquery
from google.cloud.bigquery import QueryJobConfig
from datetime import datetime
from config import PROJECT_ID, DATASET_ID, TABLE_ID
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

# BigQuery client
client = bigquery.Client.from_service_account_json(
    os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
)

# -------------------
# HEALTH CHECK ROUTE
# -------------------
@app.route("/")
def home():
    return "Smart Retail Reconciler Running"


# -------------------
# STATS ROUTE (FRONTEND USE)
# -------------------
@app.route("/stats")
def stats():

    table = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    query = f"""
    SELECT
        COUNT(*) AS invoices,
        SUM(unit_price) AS revenue,
        COUNT(DISTINCT vendor_name) AS vendors,
        SUM(CASE WHEN rebate_eligible = FALSE THEN 1 ELSE 0 END) AS pending
    FROM `{table}`
    """

    result = client.query(query).result()

    row = list(result)[0]

    return {
        "invoices": row.invoices or 0,
        "revenue": round(row.revenue or 0,2),
        "vendors": row.vendors or 0,
        "pending": row.pending or 0
    }

@app.route("/invoices")
def invoices():

    table = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    query = f"""
    SELECT
        sku_code,
        vendor_name,
        invoice_date,
        unit_price,
        rebate_eligible
    FROM `{table}`
    ORDER BY invoice_date DESC
    LIMIT 10
    """

    result = client.query(query).result()

    invoices = []

    for row in result:

        invoices.append({
            "id": row.sku_code,
            "vendor": row.vendor_name,
            "date": row.invoice_date.strftime("%d %b %Y"),
            "amount": f"${row.unit_price}",
            "status": "Processed" if row.rebate_eligible else "Pending"
        })

    return invoices

@app.route("/vendor-chart")
def vendor_chart():

    table = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    query = f"""
    SELECT
        vendor_name,
        COUNT(*) AS total
    FROM `{table}`
    GROUP BY vendor_name
    ORDER BY total DESC
    LIMIT 5
    """

    result = client.query(query).result()

    data = []

    for row in result:
        data.append({
            "name": row.vendor_name,
            "value": row.total
        })

    return data

# -------------------
# CHART DATA ROUTE (FRONTEND USE)
# -------------------
@app.route("/chart-data")
def chart_data():

    table = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    query = f"""
    SELECT
        FORMAT_DATE('%b', invoice_date) AS month,
        SUM(unit_price) AS revenue
    FROM `{table}`
    GROUP BY month
    ORDER BY MIN(invoice_date)
    """

    result = client.query(query).result()

    chart = []

    for row in result:
        chart.append({
            "month": row.month,
            "revenue": float(row.revenue)
        })

    return chart

    


# -------------------
# MAIN PROCESSING ROUTE (POST ONLY)
# -------------------
@app.route("/", methods=["POST"])
def process_event():
    data = request.get_json()
    message = data["message"]
    encoded_data = message["data"]

    decoded_data = base64.b64decode(encoded_data).decode("utf-8")
    event = json.loads(decoded_data)

    bucket = event["bucket"]
    filename = event["name"]

    print(bucket)
    print(filename)


    # Read CSV
    with open("data/customer_shopping_data.csv", newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        first_row = next(reader)

    required_fields = ["invoice_no", "price", "invoice_date", "shopping_mall"]

    for field in required_fields:
        if not first_row.get(field):
            return f"{field} is missing", 400

    vendor_name = first_row["shopping_mall"]
    invoice_date = datetime.strptime(
        first_row["invoice_date"], "%m/%d/%Y"
    ).strftime("%Y-%m-%d")

    sku_code = first_row["invoice_no"]
    unit_price = float(first_row["price"])

    row = {
        "filename": filename,
        "vendor_name": vendor_name,
        "invoice_date": invoice_date,
        "sku_code": sku_code,
        "unit_price": unit_price,
        "tax_line_items": 0.0,
        "rebate_eligible": True
    }

    logging.info(row)

    table_id = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"

    # duplicate check (parameterized to prevent SQL injection)
    query = f"""
    SELECT COUNT(*) AS total
    FROM `{table_id}`
    WHERE sku_code = @sku_code
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("sku_code", "STRING", sku_code),
        ]
    )
    query_job = client.query(query, job_config=job_config)
    result = query_job.result()

    duplicate_count = list(result)[0].total

    if duplicate_count > 0:
        logging.info(f"Duplicate entry found for sku_code: {sku_code}")
        return "Duplicate entry. Skipping insertion.", 200

    # retry insert
    max_retries = 3
    errors = []

    for _ in range(max_retries):
        errors = client.insert_rows_json(table_id, [row])
        if not errors:
            break
        time.sleep(2)

    if not errors:
        logging.info("Row inserted successfully!")
        return "POST request received", 200
    else:
        logging.error(errors)
        return "BigQuery insertion failed", 500

# -------------------
# RUN SERVER
# -------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        debug=True
    )
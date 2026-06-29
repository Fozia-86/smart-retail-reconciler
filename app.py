import base64
import json
import csv
import logging
import time
import os

from flask import Flask, request
from google.cloud import bigquery
from datetime import datetime
from config import PROJECT_ID, DATASET_ID, TABLE_ID

app = Flask(__name__)


client = bigquery.Client.from_service_account_json(
    os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
)

logging.basicConfig(level=logging.INFO)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
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

        # Validation (Loop ke andar sirf check hoga)
        for field in required_fields:
            if not first_row.get(field):
                return f"{field} is missing", 400

        # Data Processing (Loop ke bahar)
        vendor_name = first_row["shopping_mall"]
        invoice_date = datetime.strptime(first_row["invoice_date"], "%m/%d/%Y").strftime("%Y-%m-%d")
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

        # BigQuery Insert
        table_id = f"{PROJECT_ID}.{DATASET_ID}.{TABLE_ID}"
        query = f"""
        SELECT COUNT(*) AS total
        FROM `{table_id}`
        WHERE sku_code = '{sku_code}'
        """
        query_job = client.query(query)
        result = query_job.result()

        duplicate_count = list(result)[0].total
        if duplicate_count > 0:
            logging.info(f"Duplicate entry found for sku_code: {sku_code}. Skipping insertion.")
            return "Duplicate entry. Skipping insertion.", 200
        
        max_retries = 3
        for _ in range(max_retries):
            errors = client.insert_rows_json(table_id, [row])
            if not errors:
                break
            time.sleep(2)  # Wait before retrying

        # Check Results
        if errors == []:
            logging.info("Row inserted successfully!")
            return "POST request received", 200
        else:
            print(errors)
            return "BigQuery insertion failed", 500

    return "Smart Retail Reconciler Running"

import os

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8080)),
        debug=True
    )
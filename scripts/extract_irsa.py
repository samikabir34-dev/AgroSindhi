import pdfplumber
import re
import json
from datetime import datetime

def extract_irsa_data(pdf_path):
    """
    Extracts water data from the IRSA daily PDF report.
    Required: pip install pdfplumber
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = pdf.pages[0].extract_text()

        data = {
            "date": re.search(r"(\d{2}\.\d{2}\.\d{4})", text).group(1),
            "tarbela_level": re.search(r"TARBELA.*LEVEL = ([\d.]+)", text).group(1),
            "tarbela_inflow": re.search(r"TARBELA.*MEAN INFLOW = (\d+)", text).group(1),
            "sindh_allocation": re.search(r"Sindh:\s*(\d+)", text).group(1),
            "sukkur_us": re.search(r"SUKKUR:.*U/S DISCHARGE = (\d+)", text, re.DOTALL).group(1),
            "sukkur_canal": re.search(r"SUKKUR:.*Canal W/dls = (\d+)", text, re.DOTALL).group(1),
            "kotri_us": re.search(r"KOTRI:.*U/S DISCHARGE = (\d+)", text, re.DOTALL).group(1),
            "kotri_canal": re.search(r"KOTRI:.*Canal W/dls = (\d+)", text, re.DOTALL).group(1),
            "rim_inflow": re.search(r"RIM STATION INFLOWS.*TOTAL = (\d+)", text).group(1),
            "rim_outflow": re.search(r"RIM STATION OUTFLOWS.*TOTAL = (\d+)", text).group(1),
        }
        
        # Save for frontend consumption
        with open("src/data/latest_water_data.json", "w") as f:
            json.dump(data, f, indent=2)
        
        print(f"Successfully extracted data for {data['date']}")
        return data
    except Exception as e:
        print(f"Error extracting data: {e}")
        return None

# Example usage:
# extract_irsa_data("path/to/irsa_report.pdf")

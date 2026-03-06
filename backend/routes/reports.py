from fastapi import APIRouter
import pandas as pd

router = APIRouter()

DATASET_PATH = "backend/data/uploaded_files/dataset.csv"


@router.get("/report")

def generate_report():

    df = pd.read_csv(DATASET_PATH)

    total_records = len(df)

    duplicate_aadhaar = df.duplicated("aadhaar").sum()
    duplicate_phone = df.duplicated("phone").sum()
    duplicate_bank = df.duplicated("bank_account").sum()

    suspicious_df = df[
        df.duplicated("aadhaar") |
        df.duplicated("phone") |
        df.duplicated("bank_account")
    ]

    suspicious_list = suspicious_df.to_dict(orient="records")

    return {
        "total_records": total_records,
        "duplicate_aadhaar": int(duplicate_aadhaar),
        "duplicate_phone": int(duplicate_phone),
        "duplicate_bank": int(duplicate_bank),
        "suspicious_count": len(suspicious_list),
        "suspicious_list": suspicious_list
    }
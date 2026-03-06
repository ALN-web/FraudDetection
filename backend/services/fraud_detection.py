import pandas as pd

def detect_fraud(df):

    duplicates_aadhaar = df[df.duplicated("aadhaar", keep=False)]
    duplicates_phone = df[df.duplicated("phone", keep=False)]
    duplicates_bank = df[df.duplicated("bank_account", keep=False)]

    suspicious = pd.concat([
        duplicates_aadhaar,
        duplicates_phone,
        duplicates_bank
    ]).drop_duplicates()

    suspicious_table = suspicious.head(10).to_dict(orient="records")

    return {
        "total_records": len(df),
        "duplicates_aadhaar": len(duplicates_aadhaar),
        "duplicates_phone": len(duplicates_phone),
        "duplicates_bank": len(duplicates_bank),
        "suspicious_records": len(suspicious),
        "suspicious_list": suspicious_table
    }
from fastapi import APIRouter, UploadFile, File
import pandas as pd
import os

router = APIRouter()

UPLOAD_PATH = "backend/data/uploaded_files/dataset.csv"

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    # Save dataset
    df.to_csv(UPLOAD_PATH, index=False)

    preview = df.head(10).to_dict(orient="records")

    return {
        "total_records": len(df),
        "columns": list(df.columns),
        "preview": preview
    }
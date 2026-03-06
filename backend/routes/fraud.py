from fastapi import APIRouter
import pandas as pd
from backend.services.fraud_detection import detect_fraud

router = APIRouter()

DATASET_PATH = "backend/data/uploaded_files/dataset.csv"

@router.get("/analyze")
def analyze_dataset():

    df = pd.read_csv(DATASET_PATH)

    result = detect_fraud(df)

    return result
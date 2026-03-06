from fastapi import APIRouter
import pandas as pd

router = APIRouter()

DATASET_PATH = "backend/data/uploaded_files/dataset.csv"

@router.get("/network")

def fraud_network():

    df = pd.read_csv(DATASET_PATH)

    nodes = []
    edges = []

    for _, row in df.iterrows():

        person_id = f"person_{row['aadhaar']}"
        phone_id = f"phone_{row['phone']}"
        bank_id = f"bank_{row['bank_account']}"

        nodes.append({
            "data": {"id": person_id, "label": row["name"], "type": "person"}
        })

        nodes.append({
            "data": {"id": phone_id, "label": row["phone"], "type": "phone"}
        })

        nodes.append({
            "data": {"id": bank_id, "label": row["bank_account"], "type": "bank"}
        })

        edges.append({"data": {"source": person_id, "target": phone_id}})
        edges.append({"data": {"source": person_id, "target": bank_id}})

    return {
        "nodes": nodes,
        "edges": edges
    }
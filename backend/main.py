from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.upload import router as upload_router
from backend.routes.fraud import router as fraud_router

from backend.routes.reports import router as report_router

app.include_router(report_router)

from backend.routes.network import router as network_router

app.include_router(network_router)

app = FastAPI()

# ADD THIS CORS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(fraud_router)

@app.get("/")
def root():
    return {"message": "SchemeGuard AI backend running"}
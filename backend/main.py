from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .vector_store import get_vector_store
import uvicorn

app = FastAPI(title="Artha - Kannada Semantic Reverse Search")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(q: str = Query(..., min_length=1)):
    try:
        store = get_vector_store()
        results = store.search(q, top_k=20)
        return results
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from agents.query_processor import QueryProcessor
from models.database import DatabaseManager
from models.rag_engine import RAGEngine

load_dotenv()

app = FastAPI(title="QueryGPT API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
db_manager = DatabaseManager("../nf_buildathon.db")
rag_engine = RAGEngine()
query_processor = QueryProcessor(db_manager, rag_engine)

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    sql: str
    result: dict
    execution_time: int
    insights: list[str]

@app.on_event("startup")
async def startup_event():
    """Initialize RAG embeddings on startup"""
    try:
        await rag_engine.initialize_schema_embeddings(db_manager)
        print("✅ RAG embeddings initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize RAG embeddings: {e}")

@app.post("/api/query", response_model=dict)
async def process_query(request: QueryRequest):
    """Process natural language query and return SQL + results"""
    try:
        result = await query_processor.process_query(request.question)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/schema")
async def get_schema_info():
    """Get database schema information"""
    try:
        schema_info = db_manager.get_schema_info()
        return schema_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_query_history():
    """Get query history (placeholder)"""
    return []

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "QueryGPT API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
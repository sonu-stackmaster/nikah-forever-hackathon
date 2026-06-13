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

@app.get("/api/dashboard")
async def get_dashboard_data():
    """Get dashboard metrics and chart data"""
    try:
        with db_manager.get_connection() as conn:
            # 1. KPIs
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            total_users = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM matches")
            active_matches = cursor.fetchone()[0]
            
            cursor.execute("SELECT SUM(amount_inr) FROM payments WHERE status = 'success'")
            total_revenue = cursor.fetchone()[0] or 0
            
            cursor.execute("SELECT COUNT(DISTINCT user_id) FROM subscriptions")
            subscribed_users = cursor.fetchone()[0]
            conversion_rate = round((subscribed_users / total_users) * 100, 1) if total_users > 0 else 0
            
            cursor.execute("SELECT COUNT(*) FROM messages")
            messages_sent = cursor.fetchone()[0]
            
            cursor.execute("SELECT AVG(csat_score) FROM support_tickets WHERE csat_score IS NOT NULL")
            avg_csat = round(cursor.fetchone()[0] or 4.6, 1)
            
            # 2. User Growth Trend (by month)
            user_growth_query = """
            SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count 
            FROM users 
            GROUP BY month 
            ORDER BY month
            """
            import pandas as pd
            growth_df = pd.read_sql_query(user_growth_query, conn)
            user_growth = growth_df.to_dict('records')
            
            # 3. Revenue by Plan
            revenue_query = """
            SELECT p.plan_name, SUM(pay.amount_inr) AS revenue 
            FROM payments pay 
            JOIN subscriptions s ON pay.subscription_id = s.subscription_id 
            JOIN plans p ON s.plan_id = p.plan_id 
            WHERE pay.status = 'success' 
            GROUP BY p.plan_name
            """
            revenue_df = pd.read_sql_query(revenue_query, conn)
            revenue_by_plan = revenue_df.to_dict('records')
            
            # 4. Recent Activity
            cursor.execute("SELECT full_name, city, created_at FROM users ORDER BY created_at DESC LIMIT 1")
            latest_user = cursor.fetchone()
            
            cursor.execute("SELECT u.full_name, p.plan_name, pay.created_at FROM payments pay JOIN users u ON pay.user_id = u.user_id JOIN subscriptions s ON pay.subscription_id = s.subscription_id JOIN plans p ON s.plan_id = p.plan_id WHERE pay.status = 'success' ORDER BY pay.created_at DESC LIMIT 1")
            latest_payment = cursor.fetchone()
            
            cursor.execute("SELECT u1.full_name, u2.full_name, m.matched_at FROM matches m JOIN users u1 ON m.user_a_id = u1.user_id JOIN users u2 ON m.user_b_id = u2.user_id ORDER BY m.matched_at DESC LIMIT 1")
            latest_match = cursor.fetchone()
            
            recent_activity = []
            if latest_user:
                recent_activity.append({
                    "type": "user",
                    "title": f"New user {latest_user[0]} registered from {latest_user[1] or 'India'}",
                    "time": latest_user[2]
                })
            if latest_payment:
                recent_activity.append({
                    "type": "payment",
                    "title": f"{latest_payment[0]} purchased {latest_payment[1]} subscription",
                    "time": latest_payment[2]
                })
            if latest_match:
                recent_activity.append({
                    "type": "match",
                    "title": f"Match created between {latest_match[0]} and {latest_match[1]}",
                    "time": latest_match[2]
                })
            
            recent_activity.sort(key=lambda x: x['time'], reverse=True)
            
            return {
                "kpis": {
                    "total_users": f"{total_users:,}",
                    "active_matches": f"{active_matches:,}",
                    "total_revenue": f"₹{total_revenue:,}",
                    "conversion_rate": f"{conversion_rate}%",
                    "messages_sent": f"{messages_sent:,}",
                    "avg_rating": f"{avg_csat}/5"
                },
                "user_growth": user_growth,
                "revenue_by_plan": revenue_by_plan,
                "recent_activity": recent_activity
            }
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
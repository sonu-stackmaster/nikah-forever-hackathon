import asyncio
import os
from dotenv import load_dotenv
from openai import OpenAI
from agents.sql_generator import SQLGenerator
from agents.intent_classifier import IntentClassifier
from models.database import DatabaseManager
from models.rag_engine import RAGEngine

async def test():
    load_dotenv()
    db_manager = DatabaseManager("../nf_buildathon.db")
    rag_engine = RAGEngine()
    await rag_engine.initialize_schema_embeddings(db_manager)
    
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    intent_classifier = IntentClassifier(openai_client)
    sql_generator = SQLGenerator(openai_client)
    
    question = "How many users name start with letter A"
    intent = await intent_classifier.classify_intent(question)
    schema_context = rag_engine.retrieve_relevant_schema(question, top_k=5)
    
    print("Classified Intent:", intent)
    result = await sql_generator.generate_sql(question, intent, schema_context)
    print("Generated SQL:", result['sql'])
    
    # Execute query
    db_res = db_manager.execute_query(result['sql'])
    print("Execution Result:", db_res['data'])

asyncio.run(test())

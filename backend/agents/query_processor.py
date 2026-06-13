import json
import re
from typing import Dict, Any, List, Optional
from openai import OpenAI
import os

from agents.intent_classifier import IntentClassifier
from agents.sql_generator import SQLGenerator
from agents.sql_validator import SQLValidator
from agents.visualization_agent import VisualizationAgent
from agents.insight_generator import InsightGenerator

class QueryProcessor:
    def __init__(self, db_manager, rag_engine):
        self.db_manager = db_manager
        self.rag_engine = rag_engine
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Initialize agents
        self.intent_classifier = IntentClassifier(self.openai_client)
        self.sql_generator = SQLGenerator(self.openai_client)
        self.sql_validator = SQLValidator()
        self.visualization_agent = VisualizationAgent(self.openai_client)
        self.insight_generator = InsightGenerator(self.openai_client)
    
    async def process_query(self, question: str) -> Dict[str, Any]:
        """Process natural language query through the agent pipeline"""
        
        try:
            # Step 1: Classify Intent
            intent = await self.intent_classifier.classify_intent(question)
            
            # If intent is general chat/greeting, handle it directly without DB query
            if intent.get('type') == 'chat':
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are QueryGPT, a friendly, premium, pink-themed AI assistant for the NikahForever matrimonial platform. You help administrators and users query matrimonial data. Respond politely and concisely (2-4 sentences). Feel free to explain what you can do (e.g., analyze users, revenue, matches, profiles)."},
                        {"role": "user", "content": question}
                    ],
                    temperature=0.7,
                    max_tokens=400
                )
                chat_response = response.choices[0].message.content.strip()
                return {
                    'sql': None,
                    'result': {
                        'data': None,
                        'visualization_type': 'chat',
                        'chart_config': None,
                        'insights': [],
                        'message': chat_response,
                        'row_count': 0
                    },
                    'execution_time': 0
                }
            
            # Step 2: Retrieve Relevant Schema
            relevant_schema = self.rag_engine.retrieve_relevant_schema(question, top_k=8)
            
            # Step 3: Generate SQL
            sql_result = await self.sql_generator.generate_sql(
                question=question,
                intent=intent,
                schema_context=relevant_schema
            )
            
            # Step 4: Validate SQL
            validation_result = self.sql_validator.validate_sql(sql_result['sql'])
            if not validation_result['is_valid']:
                return {
                    'error': f"SQL validation failed: {validation_result['error']}",
                    'sql': sql_result['sql']
                }
            
            # Step 5: Execute Query
            query_result = self.db_manager.execute_query(sql_result['sql'])
            
            # Step 6: Determine Visualization
            viz_config = await self.visualization_agent.determine_visualization(
                question=question,
                data=query_result['data'],
                intent=intent
            )
            
            # Step 7: Generate Insights
            insights = await self.insight_generator.generate_insights(
                question=question,
                data=query_result['data'],
                context=intent
            )
            
            # Step 8: Generate conversational summary message
            message = await self._generate_conversational_response(
                question=question,
                data=query_result['data'],
                sql=query_result['sql']
            )
            
            # Combine results
            return {
                'sql': query_result['sql'],
                'result': {
                    'data': query_result['data'],
                    'visualization_type': viz_config['type'],
                    'chart_config': viz_config.get('config'),
                    'insights': insights,
                    'message': message,
                    'row_count': query_result['row_count']
                },
                'execution_time': query_result['execution_time']
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'sql': None,
                'result': None
            }
            
    async def _generate_conversational_response(self, question: str, data: List[Dict], sql: str) -> str:
        """Generate a friendly natural language response summarizing the SQL execution results"""
        if not data:
            return "I couldn't find any data matching your request in the database."
            
        prompt = f"""
You are QueryGPT, a helpful and friendly AI matrimonial analyst for the NikahForever platform.
The user asked: "{question}"

To answer this, the system executed the following SQL query:
{sql}

And retrieved the following results (first 10 rows):
{json.dumps(data[:10], indent=2)}

Total row count: {len(data)}

Please write a natural, polite, and direct response (1-3 sentences) summarizing what was found. Don't use bullet points. Make it sound like a friendly assistant answering a chat message. Include the relevant counts or key details directly in your response.
"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=300
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating conversational response: {e}")
            return f"I executed the query and found {len(data)} result(s)."
    
    def _clean_sql(self, sql: str) -> str:
        """Clean and format SQL query"""
        # Remove any markdown formatting
        sql = re.sub(r'```sql\n?', '', sql)
        sql = re.sub(r'```\n?', '', sql)
        
        # Remove extra whitespace
        sql = ' '.join(sql.split())
        
        return sql.strip()
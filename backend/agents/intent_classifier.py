import json
from typing import Dict, Any
from openai import OpenAI

class IntentClassifier:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
    
    async def classify_intent(self, question: str) -> Dict[str, Any]:
        """Classify user intent and extract key information"""
        
        prompt = f"""
You are an intent classification agent for a matrimonial platform database query system.

Analyze this user question and extract the intent and key information:

Question: "{question}"

Classify the intent and extract information in this JSON format:
{{
    "type": "analytics|lookup|comparison|trend|chat",
    "metric": "revenue|users|matches|subscriptions|etc",
    "entity": "main entity being queried",
    "timeframe": "time period if mentioned",
    "filters": {{"key": "value pairs for any filters"}},
    "aggregation": "sum|count|avg|max|min|none",
    "grouping": "field to group by if any"
}}

Intent Types:
- analytics: KPI, counts, sums (How many users, Total revenue)
- lookup: Finding specific records (Show users from Delhi)
- comparison: Comparing categories (Revenue by plan, Users by city)
- trend: Time-based analysis (Monthly growth, Daily signups)
- chat: Greetings, general conversation, explanation requests, or non-database queries (e.g., "hi", "how are you", "who are you", "what tables do you have?")

Examples:
"How many active users?" -> {{"type": "analytics", "metric": "users", "filters": {{"status": "active"}}, "aggregation": "count"}}
"Revenue by plan" -> {{"type": "comparison", "metric": "revenue", "grouping": "plan"}}
"Monthly user growth" -> {{"type": "trend", "metric": "users", "timeframe": "monthly", "aggregation": "count"}}
"Hello, who are you?" -> {{"type": "chat"}}
"What columns are in the users table?" -> {{"type": "chat"}}

Return only valid JSON.
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=300
            )
            
            result = response.choices[0].message.content.strip()
            
            # Try to parse JSON
            try:
                intent = json.loads(result)
                return intent
            except json.JSONDecodeError:
                # Fallback to basic intent
                return {
                    "type": "analytics",
                    "metric": "general",
                    "entity": "data",
                    "aggregation": "count"
                }
                
        except Exception as e:
            print(f"Intent classification error: {e}")
            return {
                "type": "analytics",
                "metric": "general", 
                "entity": "data",
                "aggregation": "count"
            }
import json
from typing import Dict, Any, List
from openai import OpenAI

class SQLGenerator:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
    
    async def generate_sql(self, question: str, intent: Dict[str, Any], schema_context: List[Dict]) -> Dict[str, Any]:
        """Generate SQL query based on natural language question"""
        
        # Build schema context
        schema_info = self._build_schema_context(schema_context)
        
        prompt = f"""
You are an expert SQL generator for a matrimonial platform database.

Convert this natural language question to SQLite query:

Question: "{question}"

Intent Analysis: {json.dumps(intent, indent=2)}

Relevant Schema:
{schema_info}

Key Tables and Relationships:
- users: Main user profiles
- profiles: Extended profile information  
- subscriptions: User subscription records
- payments: Payment transactions
- plans: Available subscription plans
- matches: Successful matches between users
- interests: Interest expressions between users
- messages: Messages between matched users
- profile_views: Profile viewing records
- support_tickets: Customer support records
- reports: User reports and complaints

Important Notes:
1. Use ONLY SELECT and WITH statements
2. Use proper JOINs for relationships
3. Handle date formats properly (YYYY-MM-DD HH:MM:SS)
4. Use LIMIT for large result sets
5. Group and aggregate appropriately
6. Use descriptive column aliases
7. SQLite string comparisons are case-sensitive by default. ALWAYS use LOWER(column) = LOWER('value') or case-insensitive LIKE to match string filters (such as plan_name, city, gender, status) to prevent casing mismatches.

For common metrics:
- Revenue: SUM(amount_inr) FROM payments WHERE status='success'
- Active users: COUNT(*) FROM users WHERE account_status='active'
- Monthly data: Use strftime('%Y-%m', created_at) for grouping

Generate a SQLite query that answers the question accurately.

Return only the SQL query, no explanations.
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=500
            )
            
            sql = response.choices[0].message.content.strip()
            
            # Clean up the SQL
            sql = self._clean_sql(sql)
            
            return {
                'sql': sql,
                'confidence': 0.9  # Placeholder confidence score
            }
            
        except Exception as e:
            print(f"SQL generation error: {e}")
            # Fallback simple query
            return {
                'sql': 'SELECT COUNT(*) as total_count FROM users WHERE account_status = "active"',
                'confidence': 0.5
            }
    
    def _build_schema_context(self, schema_items: List[Dict]) -> str:
        """Build formatted schema context from RAG results"""
        context = ""
        
        for item in schema_items:  # Include all retrieved relevant tables
            context += f"{item['document']}\n\n"
        
        return context
    
    def _clean_sql(self, sql: str) -> str:
        """Clean and validate SQL query"""
        import re
        
        # Remove markdown formatting
        sql = re.sub(r'```sql\n?', '', sql)
        sql = re.sub(r'```\n?', '', sql)
        
        # Remove extra whitespace
        sql = ' '.join(sql.split())
        
        # Ensure it starts with SELECT or WITH
        sql = sql.strip()
        if not (sql.upper().startswith('SELECT') or sql.upper().startswith('WITH')):
            # Try to extract SELECT statement
            select_match = re.search(r'(SELECT.*)', sql, re.IGNORECASE | re.DOTALL)
            if select_match:
                sql = select_match.group(1)
            else:
                raise ValueError("No valid SELECT statement found")
        
        return sql
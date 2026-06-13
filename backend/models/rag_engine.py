import json
from typing import List, Dict, Any
import os
from openai import OpenAI

class RAGEngine:
    def __init__(self):
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.schema_cache = {}
        
    def _get_embedding(self, text: str) -> List[float]:
        """Generate embedding using OpenAI"""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Embedding error: {e}")
            return []
    
    async def initialize_schema_embeddings(self, db_manager):
        """Initialize embeddings for database schema"""
        try:
            # Get schema information
            schema_info = db_manager.get_schema_info()
            
            # Store schema in memory cache for now
            self.schema_cache = schema_info
            
            print(f"✅ Initialized schema cache with {len(schema_info['tables'])} tables")
            
        except Exception as e:
            print(f"❌ RAG initialization error: {e}")
            raise
    
    def retrieve_relevant_schema(self, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant schema information for a query using simple keyword matching"""
        
        if not self.schema_cache:
            return []
        
        try:
            query_lower = query.lower()
            relevant_items = []
            
            # Simple keyword-based relevance scoring
            for table_name in self.schema_cache['tables']:
                # Set baseline score for core tables so they are always in the candidate schema list
                relevance_score = 0.2 if table_name in ['users', 'subscriptions', 'plans'] else 0.0
                
                # Check if table name matches query
                if table_name in query_lower:
                    relevance_score += 1.0
                
                # Check for business term matches (expanded with Hinglish synonyms)
                business_terms = {
                    'users': ['user', 'member', 'person', 'profile', 'users', 'log', 'people', 'accounts', 'account', 'profiles', 'ladka', 'ladki', 'male', 'female', 'men', 'women', 'banda', 'bandi', 'registered', 'joined'],
                    'subscriptions': ['subscription', 'plan', 'premium', 'gold', 'silver', 'membership', 'package', 'pack', 'subs', 'buyed', 'purchased', 'kharida', 'activate'],
                    'payments': ['payment', 'revenue', 'money', 'income', 'paid', 'earning', 'sales', 'recharge', 'rupee', 'rs', 'inr', 'amount', 'paisa', 'kamai', 'transaction'],
                    'matches': ['match', 'connection', 'couple', 'rishta', 'jodi', 'shadi', 'marriage', 'matches', 'matched'],
                    'messages': ['message', 'chat', 'communication', 'msg', 'chatting', 'message', 'baat'],
                    'support_tickets': ['support', 'ticket', 'help', 'issue', 'complaint', 'problem', 'customer care', 'helpdesk']
                }
                
                if table_name in business_terms:
                    for term in business_terms[table_name]:
                        if term in query_lower:
                            relevance_score += 0.5
                
                # Add column-based scoring
                if table_name in self.schema_cache['columns']:
                    for col in self.schema_cache['columns'][table_name]:
                        col_name = col['name'].lower()
                        if any(word in query_lower for word in col_name.split('_')):
                            relevance_score += 0.3
                
                if relevance_score > 0:
                    # Create document-like format
                    columns = self.schema_cache['columns'][table_name]
                    doc = f"Table: {table_name}\n"
                    doc += f"Purpose: Stores data related to {table_name.replace('_', ' ')}\n"
                    doc += f"Columns: {', '.join([col['name'] for col in columns])}\n"
                    
                    for col in columns:
                        doc += f"- {col['name']} ({col['type']}): "
                        doc += f"{self._get_column_description(col['name'])}\n"
                    
                    relevant_items.append({
                        'document': doc,
                        'metadata': {
                            'type': 'table',
                            'table_name': table_name,
                            'columns': [col['name'] for col in columns]
                        },
                        'relevance_score': relevance_score,
                        'rank': len(relevant_items) + 1
                    })
            
            # Sort by relevance score and return top_k
            relevant_items.sort(key=lambda x: x['relevance_score'], reverse=True)
            return relevant_items[:top_k]
            
        except Exception as e:
            print(f"❌ Schema retrieval error: {e}")
            return []
    
    def _get_column_description(self, column_name: str) -> str:
        """Generate description for database columns"""
        descriptions = {
            'user_id': 'Unique identifier for users',
            'full_name': 'Complete name of the user',
            'gender': 'Gender of the user (Male/Female)',
            'dob': 'Date of birth',
            'email': 'Email address',
            'phone': 'Phone number',
            'city': 'City where user is located',
            'state': 'State or region',
            'sect': 'Religious sect (Sunni/Shia/Other)',
            'mother_tongue': 'Native language',
            'education_level': 'Highest education completed',
            'profession': 'Job or profession',
            'annual_income_inr': 'Yearly income in Indian Rupees',
            'marital_status': 'Current marital status',
            'account_status': 'Status of user account (active/suspended/deactivated)',
            'created_at': 'Account creation timestamp',
            'last_active_at': 'Last login or activity timestamp',
            'plan_name': 'Name of subscription plan',
            'price_inr': 'Price in Indian Rupees',
            'duration_days': 'Plan duration in days',
            'contact_credits': 'Number of contacts allowed',
            'amount_inr': 'Payment amount in Rupees',
            'status': 'Current status',
            'payment_method': 'Payment method used',
            'matched_at': 'When the match occurred',
            'sent_at': 'Message or interest sent timestamp',
            'viewed_at': 'Profile view timestamp',
            'csat_score': 'Customer satisfaction rating (1-5)'
        }
        
        return descriptions.get(column_name, f"Data field: {column_name.replace('_', ' ')}")
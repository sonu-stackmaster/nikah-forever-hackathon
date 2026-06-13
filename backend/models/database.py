import sqlite3
import pandas as pd
from typing import Dict, List, Any, Optional
import json
import time

class DatabaseManager:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.connection_string = f"file:{db_path}?mode=ro"
        
    def get_connection(self):
        """Get read-only database connection"""
        return sqlite3.connect(self.connection_string, uri=True)
    
    def execute_query(self, sql: str) -> Dict[str, Any]:
        """Execute SQL query and return results with metadata"""
        start_time = time.time()
        
        try:
            with self.get_connection() as conn:
                # Security check - only allow SELECT and WITH statements
                sql_upper = sql.upper().strip()
                if not (sql_upper.startswith('SELECT') or sql_upper.startswith('WITH')):
                    raise ValueError("Only SELECT and WITH statements are allowed")
                
                # Check for forbidden keywords
                forbidden_keywords = [
                    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 
                    'CREATE', 'TRUNCATE', 'PRAGMA', 'ATTACH', 'DETACH'
                ]
                
                import re
                for keyword in forbidden_keywords:
                    pattern = r'\b' + re.escape(keyword) + r'\b'
                    if re.search(pattern, sql_upper):
                        raise ValueError(f"Forbidden SQL keyword: {keyword}")
                
                # Execute query
                df = pd.read_sql_query(sql, conn)
                
                execution_time = int((time.time() - start_time) * 1000)
                
                return {
                    'data': df.to_dict('records'),
                    'columns': df.columns.tolist(),
                    'row_count': len(df),
                    'execution_time': execution_time,
                    'sql': sql
                }
                
        except Exception as e:
            execution_time = int((time.time() - start_time) * 1000)
            raise Exception(f"Database error: {str(e)}")
    
    def get_schema_info(self) -> Dict[str, Any]:
        """Get comprehensive schema information"""
        with self.get_connection() as conn:
            # Get all tables
            tables_query = """
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name
            """
            tables_df = pd.read_sql_query(tables_query, conn)
            tables = tables_df['name'].tolist()
            
            # Get schema for each table
            schema_info = {
                'tables': tables,
                'columns': {},
                'sample_data': {},
                'relationships': []
            }
            
            for table in tables:
                # Get column info
                pragma_query = f"PRAGMA table_info({table})"
                columns_df = pd.read_sql_query(pragma_query, conn)
                
                columns = []
                for _, row in columns_df.iterrows():
                    columns.append({
                        'name': row['name'],
                        'type': row['type'],
                        'nullable': not row['notnull'],
                        'primary_key': bool(row['pk'])
                    })
                
                schema_info['columns'][table] = columns
                
                # Get sample data (first 3 rows)
                try:
                    sample_query = f"SELECT * FROM {table} LIMIT 3"
                    sample_df = pd.read_sql_query(sample_query, conn)
                    schema_info['sample_data'][table] = sample_df.to_dict('records')
                except:
                    schema_info['sample_data'][table] = []
            
            # Get foreign key relationships
            for table in tables:
                try:
                    fk_query = f"PRAGMA foreign_key_list({table})"
                    fk_df = pd.read_sql_query(fk_query, conn)
                    
                    for _, row in fk_df.iterrows():
                        relationship = {
                            'from_table': table,
                            'from_column': row['from'],
                            'to_table': row['table'],
                            'to_column': row['to']
                        }
                        schema_info['relationships'].append(relationship)
                except:
                    pass
            
            return schema_info
    
    def get_table_stats(self) -> Dict[str, Dict[str, int]]:
        """Get basic statistics for all tables"""
        stats = {}
        
        with self.get_connection() as conn:
            tables_query = """
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            """
            tables_df = pd.read_sql_query(tables_query, conn)
            
            for table in tables_df['name']:
                try:
                    count_query = f"SELECT COUNT(*) as count FROM {table}"
                    count_df = pd.read_sql_query(count_query, conn)
                    stats[table] = {'row_count': count_df.iloc[0]['count']}
                except:
                    stats[table] = {'row_count': 0}
        
        return stats
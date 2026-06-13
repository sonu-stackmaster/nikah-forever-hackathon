import re
from typing import Dict, Any

class SQLValidator:
    def __init__(self):
        self.forbidden_keywords = [
            'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER',
            'CREATE', 'TRUNCATE', 'PRAGMA', 'ATTACH', 'DETACH',
            'VACUUM', 'REINDEX'
        ]
        
        self.allowed_tables = [
            'users', 'profiles', 'partner_preferences', 'plans',
            'subscriptions', 'payments', 'interests', 'matches',
            'messages', 'profile_views', 'reports', 'support_tickets'
        ]
    
    def validate_sql(self, sql: str) -> Dict[str, Any]:
        """Validate SQL query for security and correctness"""
        
        try:
            # Basic security checks
            security_result = self._check_security(sql)
            if not security_result['is_valid']:
                return security_result
            
            # Syntax validation
            syntax_result = self._check_syntax(sql)
            if not syntax_result['is_valid']:
                return syntax_result
            
            # Table validation
            table_result = self._check_tables(sql)
            if not table_result['is_valid']:
                return table_result
            
            return {
                'is_valid': True,
                'error': None,
                'warnings': []
            }
            
        except Exception as e:
            return {
                'is_valid': False,
                'error': f"Validation error: {str(e)}",
                'warnings': []
            }
    
    def _check_security(self, sql: str) -> Dict[str, Any]:
        """Check for security violations"""
        sql_upper = sql.upper()
        
        # Check for forbidden keywords as whole words
        for keyword in self.forbidden_keywords:
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, sql_upper):
                return {
                    'is_valid': False,
                    'error': f"Forbidden SQL operation: {keyword}",
                    'warnings': []
                }
        
        # Must start with SELECT or WITH
        if not (sql_upper.strip().startswith('SELECT') or sql_upper.strip().startswith('WITH')):
            return {
                'is_valid': False,
                'error': "Query must start with SELECT or WITH",
                'warnings': []
            }
        
        # Check for SQL injection patterns
        injection_patterns = [
            r';\s*(DROP|DELETE|UPDATE|INSERT)',
            r'--.*?(DROP|DELETE|UPDATE|INSERT)',
            r'/\*.*?(DROP|DELETE|UPDATE|INSERT).*?\*/',
            r'UNION.*?(SELECT.*FROM.*INFORMATION_SCHEMA|SELECT.*FROM.*SQLITE_MASTER)',
        ]
        
        for pattern in injection_patterns:
            if re.search(pattern, sql_upper, re.IGNORECASE):
                return {
                    'is_valid': False,
                    'error': "Potential SQL injection detected",
                    'warnings': []
                }
        
        return {'is_valid': True, 'error': None, 'warnings': []}
    
    def _check_syntax(self, sql: str) -> Dict[str, Any]:
        """Basic syntax validation"""
        warnings = []
        
        # Check balanced parentheses
        if sql.count('(') != sql.count(')'):
            return {
                'is_valid': False,
                'error': "Unbalanced parentheses in SQL",
                'warnings': []
            }
        
        # Check for common syntax errors
        if re.search(r'SELECT\s+FROM', sql, re.IGNORECASE):
            return {
                'is_valid': False,
                'error': "Missing column list in SELECT statement",
                'warnings': []
            }
        
        # Check for missing semicolon (not required but good practice)
        if not sql.strip().endswith(';'):
            warnings.append("SQL query should end with semicolon")
        
        return {'is_valid': True, 'error': None, 'warnings': warnings}
    
    def _check_tables(self, sql: str) -> Dict[str, Any]:
        """Validate that only allowed tables are referenced"""
        
        # Extract table references using regex
        table_patterns = [
            r'FROM\s+(\w+)',
            r'JOIN\s+(\w+)',
            r'UPDATE\s+(\w+)',
            r'INSERT\s+INTO\s+(\w+)'
        ]
        
        referenced_tables = set()
        
        for pattern in table_patterns:
            matches = re.findall(pattern, sql, re.IGNORECASE)
            referenced_tables.update([table.lower() for table in matches])
            
        # Find CTE names defined in WITH statements (e.g. WITH cte_name AS ...)
        # CTEs look like: cte_name AS ( or , cte_name AS (
        cte_pattern = r'\b(\w+)\s+AS\s*\('
        ctes = set(re.findall(cte_pattern, sql, re.IGNORECASE))
        ctes_lower = {cte.lower() for cte in ctes}
        
        # Exclude CTE aliases from the set of referenced tables that need physical validation
        referenced_tables = referenced_tables - ctes_lower
        
        # Check if all referenced tables are allowed
        invalid_tables = referenced_tables - set(self.allowed_tables)
        
        if invalid_tables:
            return {
                'is_valid': False,
                'error': f"Invalid table(s) referenced: {', '.join(invalid_tables)}",
                'warnings': []
            }
        
        return {'is_valid': True, 'error': None, 'warnings': []}
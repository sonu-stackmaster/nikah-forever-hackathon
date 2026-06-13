from typing import Dict, Any, List
from openai import OpenAI

class VisualizationAgent:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
    
    async def determine_visualization(self, question: str, data: List[Dict], intent: Dict[str, Any]) -> Dict[str, Any]:
        """Determine the best visualization for the query result"""
        
        if not data:
            return {'type': 'table', 'config': None}
        
        # Analyze data structure
        data_analysis = self._analyze_data(data)
        
        # Rule-based visualization selection
        viz_config = self._select_visualization_type(data_analysis, intent, question)
        
        return viz_config
    
    def _analyze_data(self, data: List[Dict]) -> Dict[str, Any]:
        """Analyze data structure and characteristics"""
        if not data:
            return {'empty': True}
        
        first_row = data[0]
        columns = list(first_row.keys())
        row_count = len(data)
        
        analysis = {
            'row_count': row_count,
            'column_count': len(columns),
            'columns': columns,
            'has_numeric': False,
            'has_date': False,
            'has_categorical': False,
            'single_value': False
        }
        
        # Check if it's a single KPI value
        if row_count == 1 and len(columns) == 1:
            analysis['single_value'] = True
            return analysis
        
        # Analyze column types
        for col in columns:
            sample_values = [row.get(col) for row in data[:5] if row.get(col) is not None]
            
            if sample_values:
                # Check for numeric values
                try:
                    numeric_values = [float(val) for val in sample_values if str(val).replace('.', '').replace('-', '').isdigit()]
                    if len(numeric_values) > 0:
                        analysis['has_numeric'] = True
                except:
                    pass
                
                # Check for dates
                for val in sample_values:
                    str_val = str(val)
                    if any(x in str_val for x in ['-', '/', ':']):
                        if any(x in str_val for x in ['2020', '2021', '2022', '2023', '2024', '2025', '2026']):
                            analysis['has_date'] = True
                            break
                
                # Check for categorical data
                if len(set(str(val) for val in sample_values)) < len(sample_values):
                    analysis['has_categorical'] = True
        
        return analysis
    
    def _select_visualization_type(self, data_analysis: Dict, intent: Dict, question: str) -> Dict[str, Any]:
        """Select appropriate visualization based on data and intent"""
        
        question_lower = question.lower()
        
        # Single value KPI
        if data_analysis.get('single_value'):
            return {
                'type': 'kpi',
                'config': {
                    'title': self._generate_kpi_title(question)
                }
            }
        
        # Time series data
        if (data_analysis.get('has_date') and data_analysis.get('has_numeric') and 
            ('trend' in intent.get('type', '') or any(x in question_lower for x in ['over time', 'monthly', 'daily', 'yearly', 'growth']))):
            return {
                'type': 'chart',
                'config': {
                    'type': 'line',
                    'title': 'Time Series Analysis'
                }
            }
        
        # Comparison/breakdown charts
        if (data_analysis.get('has_categorical') and data_analysis.get('has_numeric') and
            data_analysis['row_count'] <= 20):
            
            # Pie chart for percentage breakdowns
            if any(x in question_lower for x in ['percentage', 'share', 'distribution', 'by plan', 'by city']):
                return {
                    'type': 'chart',
                    'config': {
                        'type': 'pie',
                        'title': 'Distribution Analysis'
                    }
                }
            
            # Bar chart for comparisons
            return {
                'type': 'chart',
                'config': {
                    'type': 'bar',
                    'title': 'Comparison Analysis'
                }
            }
        
        # Default to table for complex data
        return {
            'type': 'table',
            'config': {
                'title': 'Query Results'
            }
        }
    
    def _generate_kpi_title(self, question: str) -> str:
        """Generate appropriate title for KPI cards"""
        question_lower = question.lower()
        
        if 'revenue' in question_lower:
            return 'Total Revenue'
        elif 'user' in question_lower and 'count' in question_lower:
            return 'Total Users'
        elif 'active' in question_lower:
            return 'Active Count'
        elif 'match' in question_lower:
            return 'Total Matches'
        else:
            return 'Result'
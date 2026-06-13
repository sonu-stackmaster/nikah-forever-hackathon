import json
from typing import List, Dict, Any
from openai import OpenAI

class InsightGenerator:
    def __init__(self, openai_client: OpenAI):
        self.client = openai_client
    
    async def generate_insights(self, question: str, data: List[Dict], context: Dict[str, Any]) -> List[str]:
        """Generate business insights from query results"""
        
        if not data:
            return ["No data available for analysis."]
        
        # Prepare data summary
        data_summary = self._summarize_data(data)
        
        prompt = f"""
You are a business analyst for a matrimonial platform. Generate actionable insights from this data.

Original Question: "{question}"
Query Context: {json.dumps(context, indent=2)}

Data Summary:
{data_summary}

Raw Data Sample: {json.dumps(data[:5], indent=2)}

Generate 2-4 concise, business-focused insights that:
1. Interpret the data in business context
2. Identify trends or patterns
3. Suggest actionable recommendations
4. Use specific numbers from the data

Focus on matrimonial platform metrics like:
- User acquisition and growth
- Revenue and monetization
- User engagement and matches
- Subscription performance
- Geographic trends

Return insights as a JSON array of strings.
Example: ["Revenue increased 25% compared to last quarter", "Delhi users show highest engagement rates"]
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=400
            )
            
            result = response.choices[0].message.content.strip()
            
            # Try to parse JSON array
            try:
                insights = json.loads(result)
                if isinstance(insights, list):
                    return insights[:4]  # Limit to 4 insights
                else:
                    return [str(insights)]
            except json.JSONDecodeError:
                # Fallback: split by lines and clean
                lines = result.split('\n')
                insights = []
                for line in lines:
                    cleaned = line.strip(' -•"')
                    if cleaned and len(cleaned) > 10:
                        insights.append(cleaned)
                return insights[:4]
                
        except Exception as e:
            print(f"Insight generation error: {e}")
            return self._generate_fallback_insights(data, question)
    
    def _summarize_data(self, data: List[Dict]) -> str:
        """Create a summary of the data for the LLM"""
        if not data:
            return "No data"
        
        summary = f"Total rows: {len(data)}\n"
        
        first_row = data[0]
        columns = list(first_row.keys())
        summary += f"Columns: {', '.join(columns)}\n"
        
        # Calculate basic statistics for numeric columns
        for col in columns:
            try:
                numeric_values = []
                for row in data:
                    val = row.get(col)
                    if val is not None:
                        try:
                            numeric_values.append(float(val))
                        except (ValueError, TypeError):
                            continue
                
                if numeric_values:
                    summary += f"{col}: min={min(numeric_values)}, max={max(numeric_values)}, avg={sum(numeric_values)/len(numeric_values):.2f}\n"
                else:
                    # For non-numeric, show unique values
                    unique_values = set(str(row.get(col)) for row in data if row.get(col) is not None)
                    if len(unique_values) <= 10:
                        summary += f"{col}: {', '.join(list(unique_values)[:5])}\n"
            except:
                continue
        
        return summary
    
    def _generate_fallback_insights(self, data: List[Dict], question: str) -> List[str]:
        """Generate basic insights when AI fails"""
        insights = []
        
        row_count = len(data)
        insights.append(f"Query returned {row_count} result{'s' if row_count != 1 else ''}.")
        
        if row_count > 0:
            first_row = data[0]
            
            # Look for numeric values to highlight
            for key, value in first_row.items():
                try:
                    num_value = float(value)
                    if num_value > 1000:
                        insights.append(f"Highest {key.replace('_', ' ')} value is {num_value:,.0f}.")
                    break
                except (ValueError, TypeError):
                    continue
            
            # If it's a single result, highlight it
            if row_count == 1 and len(first_row) == 1:
                key, value = list(first_row.items())[0]
                insights.append(f"The {key.replace('_', ' ')} value is {value}.")
        
        return insights[:3]
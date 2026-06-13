# QueryGPT - AI-Powered Analytics for NikahForever

An intelligent database query assistant that converts natural language questions into SQL queries and provides instant insights with visualizations.

## 🚀 Features

- **Natural Language Processing**: Ask questions in English, Hindi, or Hinglish
- **AI-Powered SQL Generation**: Convert natural language to safe SQL queries
- **Multi-Agent Architecture**: Intent classification, schema retrieval, SQL validation
- **Auto-Visualization**: Automatic chart selection (KPI cards, tables, bar/line/pie charts)
- **Business Insights**: AI-generated actionable insights
- **Voice Input**: Speech-to-text query input
- **Schema-Aware RAG**: Retrieve only relevant database schema information
- **Security First**: Read-only database access with SQL injection protection

## 🏗️ Architecture

```
Frontend (Next.js) ↔ Backend (FastAPI) ↔ SQLite Database
                   ↕
              RAG Engine (ChromaDB)
                   ↕
            Multi-Agent System
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TailwindCSS** - Styling with pink theme
- **Shadcn/UI** - UI components
- **ECharts** - Data visualization
- **Zustand** - State management

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - Database ORM
- **OpenAI GPT-4** - Language model
- **ChromaDB** - Vector database for RAG
- **LangChain** - AI orchestration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key

### 1. Setup Backend

```bash
cd backend
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Add your OpenAI API key to .env

# Start the backend
python main.py
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 💡 Example Queries

Try these natural language queries:

### English
- "How many active female users joined last month?"
- "Show monthly revenue trends"
- "Which city has the most users?"

### Hindi/Hinglish
- "Gold plan kitne users ne purchase kiya?"
- "Delhi mein kitne active users hain?"
- "Revenue ka breakdown plan wise dikhao"

## 🎯 Key Components

### Multi-Agent System

1. **Intent Classifier** - Understands user intent
2. **Schema Retriever** - RAG-based relevant schema retrieval  
3. **SQL Generator** - Converts natural language to SQL
4. **SQL Validator** - Security and syntax validation
5. **Visualization Agent** - Determines best chart type
6. **Insight Generator** - Creates business insights

### Security Features

- Read-only database connection
- SQL injection prevention
- Whitelist of allowed SQL operations
- Table access validation

## 🎨 UI/UX Features

- **Pink Theme**: Custom pink color palette
- **Responsive Design**: Mobile-friendly interface
- **Real-time Processing**: Loading states and progress indicators
- **Voice Input**: Browser-based speech recognition
- **Chat Interface**: Conversational query experience

## 📊 Visualization Types

- **KPI Cards**: Single metrics with highlighting
- **Data Tables**: Structured result display
- **Line Charts**: Time series and trends
- **Bar Charts**: Category comparisons
- **Pie Charts**: Distribution analysis

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_key (optional)
```

Frontend (`next.config.mjs`):
```javascript
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
npm run build
npm start
```

## 📈 Database Schema

The system works with a matrimonial platform database containing:

- **users**: User profiles and demographics
- **subscriptions**: Subscription records  
- **payments**: Payment transactions
- **matches**: User matches
- **messages**: User communications
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version (3.9+ required)
- Verify OpenAI API key in .env
- Install all requirements: `pip install -r requirements.txt`

**Frontend build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

**Database connection errors:**
- Ensure nf_buildathon.db exists in root directory
- Check file permissions

## 🎯 Hackathon Features

This project showcases:

- **Hybrid AI Architecture** combining RAG + Text-to-SQL
- **Multi-language Support** (English, Hindi, Hinglish)
- **Production-ready Security** with comprehensive validation
- **Advanced Visualizations** with intelligent chart selection
- **Voice Interface** for accessibility
- **Real-time Processing** with responsive UI

---

Built with ❤️ for the NikahForever Buildathon
# 🚀 QueryGPT Setup Guide

## Prerequisites

Before setting up QueryGPT, ensure you have:

- **Node.js 18+** installed
- **Python 3.9+** installed  
- **OpenAI API Key** (required for AI features)
- **Git** for version control

## 🛠️ Installation Steps

### 1. Clone & Setup Project

```bash
# Clone the repository (if using git)
git clone <your-repo-url>
cd querygpt-project

# OR if starting fresh, copy all files to your project directory
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install Node.js dependencies
npm install

# Create frontend environment file (optional)
cp .env.local.example .env.local
```

### 4. Database Setup

Ensure the `nf_buildathon.db` file is in the root directory alongside your project files.

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)

```bash
# Run the automated startup script
./start.sh
```

This will:
- Start the FastAPI backend on http://localhost:8000
- Start the Next.js frontend on http://localhost:3000
- Open both services with proper logging

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 📍 Access URLs

Once running, access these URLs:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🧪 Testing the Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **Frontend Access**: 
   - Open browser to http://localhost:3000
   - You should see the QueryGPT interface

3. **Try a Sample Query**:
   - Type: "How many total users are there?"
   - The system should process and return results

## 🔧 Configuration

### Required Environment Variables

**Backend (.env):**
```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Frontend (.env.local) - Optional:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Key Setup

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `backend/.env` file
4. Ensure you have credits in your OpenAI account

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Reinstall Python dependencies
cd backend
pip install -r requirements.txt

# Reinstall Node dependencies  
cd ..
rm -rf node_modules package-lock.json
npm install
```

**Database connection errors:**
- Ensure `nf_buildathon.db` exists in root directory
- Check file permissions: `chmod 644 nf_buildathon.db`

**OpenAI API errors:**
- Verify API key is correct in `.env`
- Check OpenAI account has sufficient credits
- Ensure no extra spaces in API key

**Port already in use:**
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

**CORS errors:**
- Ensure backend is running on port 8000
- Check frontend is configured to use correct API URL

### Performance Issues

**Slow query processing:**
- Check OpenAI API response times
- Ensure stable internet connection
- Verify database file isn't corrupted

**Memory issues:**
- ChromaDB initialization may use significant RAM initially
- Consider restarting if memory usage grows too high

## 📚 Development Tips

### Adding New Queries

Test queries using the `/docs` endpoint at http://localhost:8000/docs

### Debugging Backend

```bash
cd backend
python -m uvicorn main:app --reload --log-level debug
```

### Debugging Frontend

Check browser developer tools for console errors and network requests.

### Database Inspection

```bash
# Use SQLite CLI to inspect database
sqlite3 nf_buildathon.db
.tables
.schema users
SELECT COUNT(*) FROM users;
```

## 🔄 Updating

### Pull Latest Changes
```bash
git pull origin main
npm install  # Update frontend dependencies
cd backend && pip install -r requirements.txt  # Update backend dependencies
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│   (Next.js)     │◄──►│    (FastAPI)     │◄──►│    (SQLite)     │
│   Port: 3000    │    │   Port: 8000     │    │ nf_buildathon.db│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                       ┌────────▼──────────┐
                       │   AI Services     │
                       │ - OpenAI GPT-4    │
                       │ - ChromaDB (RAG)  │
                       │ - Multi-Agents    │
                       └───────────────────┘
```

## 🎯 Next Steps

1. **Test Sample Queries**: Try the examples in `demo_queries.md`
2. **Explore Features**: Test voice input, different chart types
3. **Customize**: Modify the pink theme, add new visualizations
4. **Scale**: Add caching, authentication, more data sources

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure API keys are configured correctly
4. Check logs in terminal for error messages

Happy querying with QueryGPT! 🚀
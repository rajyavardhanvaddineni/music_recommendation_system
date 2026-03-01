# 🎵 MoodTune — AI Music Recommendation System

An AI-powered music recommendation system trained on the GTZAN dataset, featuring mood-aware recommendations, a Spotify-inspired UI, and multi-platform streaming links.

---

## 📁 Project Structure

```
music-recommendation/
├── backend/
│   ├── app.py              # Flask API + ML recommendation engine
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React app
│   │   ├── App.css         # Spotify-inspired dark theme
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Player.js
│   │   │   ├── TrackList.js
│   │   │   └── StreamingLinks.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── MoodRecommend.js
│   │   │   ├── Search.js
│   │   │   └── Library.js
│   │   └── utils/
│   │       ├── api.js
│   │       └── helpers.js
│   └── package.json
└── paper/
    └── AI_Music_Recommendation_Paper.docx
```

---

## ⚡ Setup & Run Commands (VS Code Terminal)

### Step 1 — Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask backend (keep this terminal open)
python app.py
```

Backend will be running at: **http://localhost:5000**

---

### Step 2 — Frontend Setup (New Terminal)

```bash
# Open a new terminal in VS Code (Ctrl+Shift+`)

# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```

Frontend will open automatically at: **http://localhost:3000**

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /api/health | GET | System health check |
| /api/recommend | POST | Get mood-based recommendations |
| /api/search?q=term | GET | Search tracks |
| /api/tracks | GET | Get all tracks |
| /api/tracks?genre=pop | GET | Filter by genre |
| /api/similar/{id} | GET | Get similar tracks |
| /api/genres | GET | List all genres |

### Example API Call:
```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"mood": "I am feeling happy and want to dance", "n": 8}'
```

---

## 🧠 How the ML Model Works

1. **Feature Extraction**: Audio features extracted from GTZAN .wav files using librosa
   - 13 MFCC coefficients
   - Spectral centroid & rolloff
   - Zero-crossing rate
   - Chroma STFT
   - Tempo (BPM)

2. **KNN Algorithm**: K-Nearest Neighbors (k=6, cosine similarity) finds the most acoustically similar tracks

3. **Mood Detection**: Natural language keywords map user descriptions to mood categories, which then bias the genre selection

4. **Streaming Links**: Track links to Spotify, YouTube, Apple Music, and Amazon Music are generated dynamically

---

## 📊 GTZAN Dataset

Download from: https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification

Place the dataset in: `backend/data/genres_original/`

To train on actual GTZAN audio files, run:
```bash
python train_model.py
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| ML Model | Python, scikit-learn, librosa, NumPy, pandas |
| Backend API | Flask, Flask-CORS |
| Frontend | React 18, CSS3 |
| Streaming | Google Search URL templates (Spotify, YouTube, Apple Music, Amazon) |
# Music_Recommendation_System

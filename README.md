# Artha - Kannada Semantic Reverse Search

Artha is a "reverse dictionary" designed to help you find the right Kannada word by describing its concept in English. Unlike standard translators, Artha uses semantic embeddings to search through 240,000 dictionary definitions, allowing for nuanced, conceptual search.

## Features
- **Semantic Search**: Find words like "a feeling of deep sadness" or "the time before sunrise".
- **Phonetic Notation**: Each result includes IPA-style pronunciation.
- **Rich Context**: View the full dictionary definition that matched your query.
- **Fast Local Execution**: Powered by FastAPI, ChromaDB, and `all-MiniLM-L6-v2`.

## Tech Stack
- **Backend**: FastAPI (Python 3.10+)
- **Vector DB**: ChromaDB
- **Embeddings**: `sentence-transformers` (HuggingFace)
- **Frontend**: React + Vite (Vanilla CSS)

## Setup

### Prerequisites
- Python 3.10+
- Node.js & npm

### Backend
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Ingest data (one-time process, ~10 mins):
   ```bash
   python scripts/ingest_data.py
   ```
4. Run server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```

## License
Dictionary data (c) V. Krishna (ODC-ODbL via Alar). Code licensed under MIT.

import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, BookOpen, Volume2, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/search`, {
        params: { q: query }
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background Decor */}
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />

      <main className="main-content">
        {/* Header */}
        <header className="header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge"
          >
            <BookOpen size={14} />
            <span>Kannada Semantic Dictionary</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="title"
          >
            Artha
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="subtitle"
            style={{ lineHeight: '1.6' }}
          >
            A reverse dictionary that finds Kannada words based on English concepts. <br/>
            <span style={{ fontSize: '0.9em', opacity: 0.8 }}><strong>Note:</strong> This is a semantic search engine, not a literal translator. It finds concepts, not grammar.</span> <br/>
            <span style={{ fontSize: '0.85em', opacity: 0.7 }}><em>Try: "feeling of deep sorrow", "a place where money is kept"</em></span>
          </motion.p>
        </header>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="search-section"
        >
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-glow" />
            <div className="search-input-wrapper">
              <div className="search-icon">
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'a feeling of deep sorrow'..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && <div className="error-alert">{error}</div>}

        {/* Results Grid */}
        <div className="results-grid">
          <AnimatePresence mode="popLayout">
            {results.slice(0, 6).map((res, idx) => {
              // Map distance (0.0 to ~1.2) to a 0-100% confidence.
              const confidenceScore = Math.max(0, Math.min(100, Math.round(((1.2 - res.distance) / 1.2) * 100)));
              const isHighConfidence = confidenceScore > 50;

              return (
                <motion.div
                  key={res.id + idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="result-card"
                >
                  <div className="card-header">
                    <div>
                      <h2 className="kannada-word">{res.metadata.kannada}</h2>
                      <div className="phone-line">
                        <Volume2 size={14} />
                        <span>{res.metadata.phone}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="match-score" style={{ marginBottom: '4px' }}>
                        {confidenceScore}% Match
                      </div>
                      <div style={{ fontSize: '0.75rem', color: isHighConfidence ? '#4ade80' : '#fb923c', fontWeight: 500, opacity: 0.9 }}>
                        {isHighConfidence ? 'Likely Match' : 'Possible Match'}
                      </div>
                    </div>
                  </div>
                  
                  <p className="definition-text">{res.text}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {!loading && results.length === 0 && query && (
          <div className="empty-state">
            No results found. Try describing the word differently.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Powered by the <a href="https://alar.ink/p/about" target="_blank" rel="noopener noreferrer">Alar Dataset</a></p>
        <p>Open source on <a href="https://github.com/agasthya36/artha" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, BookOpen, Volume2, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = 'http://localhost:8000';

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
          >
            Reverse search Kannada words by their definitions. 
            Type what you're looking for in English.
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
            {results.map((res, idx) => (
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
                  <div className="match-score">
                    {Math.round((1 - (res.distance || 0)) * 100)}%
                  </div>
                </div>
                
                <p className="definition-text">{res.text}</p>

                <div className="card-footer">
                  <span>View Entry</span>
                  <MoveRight size={12} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!loading && results.length === 0 && query && (
          <div className="empty-state">
            No results found. Try describing the word differently.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

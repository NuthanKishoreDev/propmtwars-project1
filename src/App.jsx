import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  ChefHat, 
  ShoppingCart, 
  Package, 
  Clock, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeFridgeImage } from './lib/gemini';
import { getStatusColor } from './lib/utils';

const App = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const samples = [
    { name: 'Full Fridge', file: 'Foods.jpg', icon: '🍎' },
    { name: 'Fruits', file: '_fruits.jpg', icon: '🍓' },
    { name: 'Empty Fridge', file: 'no_food.jpg', icon: '❄️' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setBase64Image(reader.result.split(',')[1]);
        setResults(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleSelect = async (samplePath) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/samples/${samplePath}`);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setBase64Image(reader.result.split(',')[1]);
        setResults(null);
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError("Failed to load sample image.");
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!base64Image) return;
    
    setLoading(true);
    setError(null);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const data = await analyzeFridgeImage(base64Image, mimeType);
      setResults(data);
    } catch (err) {
      setError(err.message || "Failed to analyze image. Please try again with a clearer photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container min-h-screen">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary text-white px-4 py-2 rounded-lg shadow-xl"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="flex flex-col items-center py-16 text-center animate-fade-in" role="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="p-3 rounded-2xl bg-white/10 shadow-2xl">
            <ChefHat size={48} className="text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-6xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-black m-0">
            FridgeHero
          </h1>
        </div>
        <p className="text-xl text-text-muted max-w-2xl opacity-80 leading-relaxed">
          The universal bridge between your messy fridge and a smart, sustainable kitchen.
        </p>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto">
        {/* Upload Section */}
        {!results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 mb-8"
          >
            <div 
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload Fridge Photo"
            >
              <input 
                type="file" 
                hidden 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
              />
              {image ? (
                <div className="relative group">
                  <img src={image} alt="Preview" className="rounded-xl w-full max-h-96 object-cover mx-auto shadow-2xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <p className="text-white font-semibold">Click to change photo</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-1">Upload Fridge Photo</p>
                    <p className="text-text-muted">Drag and drop or click to browse</p>
                  </div>
                </div>
              )}
            </div>

            {image && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex justify-center"
              >
                <button 
                  onClick={handleAnalyze}
                  className="btn-primary text-xl px-12 py-4"
                  aria-label="Analyze fridge image with Gemini AI"
                >
                  Analyze with Gemini <ArrowRight size={24} aria-hidden="true" />
                </button>
              </motion.div>
            )}

            {loading && (
              <div className="mt-8 flex flex-col items-center gap-4" role="status" aria-live="polite">
                <RefreshCw className="animate-spin text-primary" size={48} aria-hidden="true" />
                <p className="text-xl font-semibold animate-pulse">Scanning contents...</p>
              </div>
            )}

            {error && (
              <div 
                className="mt-6 p-4 rounded-xl bg-accent-error/10 border border-accent-error/20 text-accent-error flex items-center gap-3"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={20} aria-hidden="true" />
                <p>{error}</p>
              </div>
            )}

            {!image && !loading && (
              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-center text-text-muted mb-6 font-semibold uppercase tracking-wider text-sm">Try with sample data</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {samples.map((sample) => (
                    <button
                      key={sample.file}
                      onClick={() => handleSampleSelect(sample.file)}
                      className="glass-panel px-6 py-4 hover:bg-white/10 transition-all flex items-center gap-3 group min-w-[160px] justify-center"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">{sample.icon}</span>
                      <span className="text-sm font-bold text-text-muted group-hover:text-white">{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 pb-12"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl">Smart Inventory</h2>
                <button 
                  onClick={() => { setResults(null); setImage(null); }}
                  className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
                  aria-label="Scan another fridge image"
                >
                  <RefreshCw size={20} aria-hidden="true" /> Scan Another
                </button>
              </div>

              {/* Inventory Grid */}
              <div className="inventory-grid">
                {results.inventory.length > 0 ? (
                  results.inventory.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel inventory-card"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{item.item}</h3>
                        <span className={`status-badge ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm">{item.reason}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center glass-panel">
                    <p className="text-2xl text-text-muted mb-2 font-black italic">❄️ Oops! Your fridge looks empty.</p>
                    <p className="opacity-60">No food items were detected in this image. Try another angle!</p>
                  </div>
                )}
              </div>

              {/* Bridge Action: Recipe */}
              {results.bridge_action && (
                <div className="glass-panel recipe-section">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <ChefHat size={28} />
                    </div>
                    <h2 className="text-3xl">Sustainability Recipe</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl mb-4 text-emerald-400">{results.bridge_action.recipe_name}</h3>
                      <div className="flex items-center gap-2 text-text-muted mb-6">
                        <Clock size={18} />
                        <span>{results.bridge_action.time_estimate}</span>
                      </div>
                      <ul className="space-y-4">
                        {results.bridge_action.instructions.map((step, idx) => (
                          <li key={idx} className="instruction-item">
                            <span className="instruction-number">
                              {idx + 1}
                            </span>
                            <p className="leading-relaxed">{step}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <Package size={20} />
                        <span className="font-bold uppercase tracking-wider text-sm">Key Ingredients Used</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {results.inventory.map((item, i) => (
                          <span key={i} className="ingredient-tag">
                            {item.item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Missing Staples */}
              <div className="glass-panel p-12 mt-16 mb-20">
                <div className="flex items-center gap-4 mb-10 text-accent-warning border-b border-white/5 pb-8">
                  <div className="p-3 rounded-xl bg-accent-warning/10">
                    <ShoppingCart size={36} />
                  </div>
                  <h2 className="text-4xl font-black">Smart Shopping List</h2>
                </div>
                <p className="text-text-muted mb-8 text-lg font-medium">These essentials look low or missing from your bridge:</p>
                {results.missing_staples && (
                  <div className="flex flex-wrap gap-4">
                    {results.missing_staples.map((staple, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="ingredient-tag"
                        style={{ padding: '0.75rem 1.25rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                      >
                        <div className="w-3 h-3 rounded-full bg-primary mr-3 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                        {staple}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer-section">
        <p>© 2026 FridgeHero. Bridging Sustainability & Smart Living.</p>
        <p className="text-xs mt-2 opacity-60">Powered by Gemini Pro Vision</p>
      </footer>
    </div>
  );
};

export default App;

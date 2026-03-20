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

const App = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('soon')) return 'status-use-soon';
    if (s.includes('fresh')) return 'status-fresh';
    return 'status-check-date';
  };

  return (
    <div className="container min-h-screen">
      {/* Header */}
      <header className="flex flex-col items-center py-12 text-center animate-fade-in">
        <div className="p-3 mb-4 rounded-2xl glass-panel text-primary">
          <ChefHat size={48} />
        </div>
        <h1 className="text-5xl mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          FridgeHero
        </h1>
        <p className="text-text-muted text-lg max-w-md">
          The universal bridge between your messy fridge and a smart, sustainable kitchen.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
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
                >
                  Analyze with Gemini <ArrowRight size={24} />
                </button>
              </motion.div>
            )}

            {loading && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <RefreshCw className="animate-spin text-primary" size={48} />
                <p className="text-xl font-semibold animate-pulse">Scanning contents...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-accent-error/10 border border-accent-error/20 text-accent-error flex items-center gap-3">
                <AlertCircle size={20} />
                <p>{error}</p>
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
                >
                  <RefreshCw size={20} /> Scan Another
                </button>
              </div>

              {/* Inventory Grid */}
              <div className="inventory-grid">
                {results.inventory.map((item, idx) => (
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
                ))}
              </div>

              {/* Bridge Action: Recipe */}
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
                      <span>{results.bridge_action.time_estimate} mins</span>
                    </div>
                    <ul className="space-y-3">
                      {results.bridge_action.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-primary font-bold">{idx + 1}.</span>
                          <p>{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <Package size={20} />
                      <span className="font-bold uppercase tracking-wider text-sm">Key Ingredients Used</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {results.inventory.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                          {item.item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Staples */}
              <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <ShoppingCart size={28} />
                  </div>
                  <h2 className="text-3xl">Smart Shopping List</h2>
                </div>
                <p className="text-text-muted mb-6">These essentials look low or missing from your bridge:</p>
                <div className="missing-staples">
                  {results.missing_staples.map((staple, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="staple-item border border-white/10"
                    >
                      <div className="w-5 h-5 rounded border border-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-sm" />
                      </div>
                      <span className="font-semibold">{staple}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 py-8 text-center text-text-muted border-t border-white/5">
        <p>© 2026 FridgeHero. Bridging Sustainability & Smart Living.</p>
        <p className="text-xs mt-1">Powered by Gemini Pro Vision</p>
      </footer>
    </div>
  );
};

export default App;

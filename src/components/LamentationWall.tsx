import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

interface Prayer {
  id: number;
  type: string;
  text: string;
  author?: string;
  country?: string;
  created_at: string;
  amen_count: number;
}

interface PrayerStats {
  total_prayers: number;
  total_amens: number;
  by_type: Record<string, number>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8091';

export default function LamentationWall() {
  const { data: session, status } = useSession();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [stats, setStats] = useState<PrayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [burdenMode, setBurdenMode] = useState(false);

  // Form state
  const [prayerType, setPrayerType] = useState('petition');
  const [prayerText, setPrayerText] = useState('');
  const [author, setAuthor] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');

  const loadPrayers = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/prayers?limit=50&type=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrayers(data || []);
      }
    } catch (error) {
      console.error('Failed to load prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/prayer-stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadPrayers();
    loadStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/pray`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: prayerType,
          text: prayerText,
          author: author || undefined,
          country: country || undefined,
          hp: '', // honeypot
        }),
      });

      if (res.ok) {
        setMessage('Your prayer has been laid upon the wall. 🕊️');
        setPrayerText('');
        setAuthor('');
        setCountry('');
        setShowForm(false);
        setBurdenMode(false);
        loadPrayers();
        loadStats();
      } else {
        const text = await res.text();
        setMessage(`Error: ${text}`);
      }
    } catch (error) {
      setMessage('Failed to submit prayer. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAmen = async (prayerId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/amen/${prayerId}`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setPrayers(prayers.map(p => 
          p.id === prayerId ? { ...p, amen_count: data.amen_count } : p
        ));
        loadStats();
      } else if (res.status === 409) {
        // Already said amen
        console.log('Already said amen to this prayer');
      }
    } catch (error) {
      console.error('Amen error:', error);
    }
  };

  const handlePetition = (prayer: Prayer) => {
    if (status !== 'authenticated') {
      // User not logged in, prompt to sign in
      signIn('github');
    } else {
      // User is logged in, redirect to create petition page with prayer context
      // Store prayer context in sessionStorage for the petition page to use
      sessionStorage.setItem('petitionContext', JSON.stringify({
        prayerId: prayer.id,
        prayerText: prayer.text,
        prayerType: prayer.type,
      }));
      window.location.href = '/petition';
    }
  };

  const openBurdenMode = () => {
    setBurdenMode(true);
    setTimeout(() => setShowForm(true), 2000);
  };

  const getPrayerTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      petition: 'border-amber-400 bg-amber-50',
      thanksgiving: 'border-emerald-400 bg-emerald-50',
      lament: 'border-purple-400 bg-purple-50',
      intercession: 'border-blue-400 bg-blue-50',
    };
    return colors[type] || 'border-stone-400 bg-stone-50';
  };

  const getPrayerTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      petition: '🙏',
      thanksgiving: '✨',
      lament: '💧',
      intercession: '🕊️',
    };
    return icons[type] || '📿';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-stone-100 to-amber-50">
      {/* Burden Mode Overlay */}
      {burdenMode && !showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center animate-fade-in">
          <div className="text-center text-white p-8 max-w-2xl">
            <p className="text-3xl font-serif mb-4 animate-pulse">
              &ldquo;Cast all your cares upon Him, for He cares for you.&rdquo;
            </p>
            <p className="text-xl opacity-75">1 Peter 5:7</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-serif text-stone-800 mb-4">
            The Lamentation Wall
          </h1>
          <p className="text-xl text-stone-600 mb-6 italic">
            A sacred space to pour out your heart before God
          </p>
          
          {/* Stats */}
          {stats && (
            <div className="flex justify-center gap-8 text-stone-700 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700">{stats.total_prayers}</div>
                <div className="text-sm">Prayers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700">{stats.total_amens}</div>
                <div className="text-sm">Amens</div>
              </div>
            </div>
          )}

          {/* Main Action Button */}
          {!showForm && (
            <button
              onClick={openBurdenMode}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all transform hover:scale-105"
            >
              🕊️ Lay Your Burden Down
            </button>
          )}
        </header>

        {/* Prayer Form */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-12 bg-white rounded-lg shadow-2xl p-8 border-4 border-amber-200 animate-fade-in">
            <h2 className="text-2xl font-serif text-stone-800 mb-6 text-center">
              Place Your Prayer Upon the Wall
            </h2>
            
            <form onSubmit={handleSubmitPrayer}>
              {/* Prayer Type */}
              <div className="mb-4">
                <label className="block text-stone-700 font-semibold mb-2">
                  Type of Prayer
                </label>
                <select
                  value={prayerType}
                  onChange={(e) => setPrayerType(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-amber-500 focus:outline-none"
                >
                  <option value="petition">🙏 Petition</option>
                  <option value="thanksgiving">✨ Thanksgiving</option>
                  <option value="lament">💧 Lament</option>
                  <option value="intercession">🕊️ Intercession</option>
                </select>
              </div>

              {/* Prayer Text */}
              <div className="mb-4">
                <label className="block text-stone-700 font-semibold mb-2">
                  Your Prayer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={prayerText}
                  onChange={(e) => setPrayerText(e.target.value)}
                  required
                  maxLength={2000}
                  rows={6}
                  placeholder="Pour out your heart before the Lord..."
                  className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:border-amber-500 focus:outline-none font-serif"
                />
                <div className="text-right text-sm text-stone-500 mt-1">
                  {prayerText.length} / 2000
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-stone-700 mb-2">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    maxLength={100}
                    placeholder="Anonymous"
                    className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-2">
                    Country (optional)
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    maxLength={100}
                    placeholder="Your location"
                    className="w-full px-4 py-2 border-2 border-stone-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Honeypot (hidden) */}
              <input type="text" name="hp" className="hidden" />

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting || !prayerText.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : '🕊️ Place on Wall'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setBurdenMode(false);
                  }}
                  className="px-6 py-3 border-2 border-stone-400 text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className="mt-4 p-4 bg-amber-100 border-l-4 border-amber-600 text-stone-800">
                  {message}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {['all', 'petition', 'thanksgiving', 'lament', 'intercession'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === type
                  ? 'bg-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-2 border-stone-300'
              }`}
            >
              {type === 'all' ? '📿 All' : `${getPrayerTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Prayer Wall */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-stone-600">Loading prayers...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayers.map((prayer, index) => (
              <div
                key={prayer.id}
                className={`${getPrayerTypeColor(prayer.type)} border-l-4 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Prayer Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{getPrayerTypeIcon(prayer.type)}</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wide font-semibold">
                    {prayer.type}
                  </span>
                </div>

                {/* Prayer Text */}
                <p className="text-stone-800 mb-4 font-serif leading-relaxed">
                  {prayer.text}
                </p>

                {/* Author & Country */}
                {(prayer.author || prayer.country) && (
                  <div className="text-sm text-stone-600 mb-3 italic">
                    — {prayer.author || 'Anonymous'}
                    {prayer.country && `, ${prayer.country}`}
                  </div>
                )}

                {/* Date */}
                <div className="text-xs text-stone-500 mb-3">
                  {new Date(prayer.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAmen(prayer.id)}
                    className="flex-1 bg-white hover:bg-amber-100 text-stone-700 px-4 py-2 rounded-lg font-semibold transition-colors border-2 border-stone-300 flex items-center justify-center gap-2"
                  >
                    <span>🙏</span>
                    <span>Amen</span>
                    <span className="text-amber-700">({prayer.amen_count})</span>
                  </button>
                  
                  <button
                    onClick={() => handlePetition(prayer)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all border-2 border-blue-600 flex items-center justify-center gap-2"
                  >
                    <span>📝</span>
                    <span>Petition</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {prayers.length === 0 && !loading && (
          <div className="text-center py-12 text-stone-600">
            <p className="text-xl mb-4">No prayers yet on this wall.</p>
            <p className="text-lg">Be the first to lay your burden down.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

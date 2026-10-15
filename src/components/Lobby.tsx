import { useState, useEffect } from 'react';

interface LobbyProps {
  onGoLive: () => void;
}

interface FakeStream {
  id: number;
  username: string;
  title: string;
  category: string;
  viewers: number;
  avatar: string;
  thumbnail: string;
}

const categories = ['All', 'Gaming', 'Music', 'Just Chatting', 'Art', 'Tech', 'Sports'];

const fakeStreams: FakeStream[] = [
  { id: 1, username: 'ProGamer99', title: 'Ranked grind to Diamond!', category: 'Gaming', viewers: 1243, avatar: '🎮', thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, username: 'MusicVibes', title: 'Late night jazz session 🎷', category: 'Music', viewers: 856, avatar: '🎵', thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, username: 'ArtByLuna', title: 'Drawing your suggestions!', category: 'Art', viewers: 432, avatar: '🎨', thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, username: 'TechTalks', title: 'Building a React app from scratch', category: 'Tech', viewers: 2100, avatar: '💻', thumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, username: 'FitnessJoe', title: 'Morning workout routine', category: 'Sports', viewers: 678, avatar: '💪', thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, username: 'ChillZone', title: 'Just vibing and chatting', category: 'Just Chatting', viewers: 3421, avatar: '💬', thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { id: 7, username: 'SpeedRunner', title: 'Any% World Record Attempt', category: 'Gaming', viewers: 5670, avatar: '🏃', thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 8, username: 'CookWithMe', title: 'Making pasta from scratch!', category: 'Just Chatting', viewers: 912, avatar: '👨‍🍳', thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
];

export default function Lobby({ onGoLive }: LobbyProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredStreams = selectedCategory === 'All'
    ? fakeStreams
    : fakeStreams.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              LiveStream
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {currentTime.toLocaleTimeString()}
            </span>
            <button
              onClick={onGoLive}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6"/>
              </svg>
              Go Live
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Share Your World
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Go live in seconds. Connect with your audience, share your passion, and build your community.
          </p>
          <button
            onClick={onGoLive}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-xl shadow-red-500/30"
          >
            <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="6"/>
            </svg>
            Start Streaming Now
          </button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Live Streams Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold">Live Now</h3>
          <span className="text-gray-400 text-sm">({filteredStreams.length} streams)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStreams.map(stream => (
            <div
              key={stream.id}
              className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
            >
              <div
                className="aspect-video relative overflow-hidden"
                style={{ background: stream.thumbnail }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
                  {stream.avatar}
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  LIVE
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {stream.viewers.toLocaleString()}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {stream.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm truncate group-hover:text-red-400 transition-colors">
                      {stream.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-0.5">{stream.username}</p>
                    <span className="inline-block mt-1.5 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                      {stream.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>LiveStream © 2026 — Share your world with the community</p>
        </div>
      </footer>
    </div>
  );
}

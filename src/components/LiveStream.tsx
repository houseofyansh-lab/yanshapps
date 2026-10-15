import { useState, useRef, useEffect, useCallback } from 'react';
import { StreamInfo } from '../App';

interface LiveStreamProps {
  streamInfo: StreamInfo;
  onEndStream: () => void;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  color: string;
  timestamp: Date;
}

const fakeUsernames = [
  'StreamFan42', 'CoolViewer', 'NightOwl', 'PixelMaster', 'ChatKing',
  'LiveLover', 'ViewerPro', 'StreamSniper', 'HypeBeast', 'ChillDude',
  'EmoteQueen', 'SubAlert', 'ModSquad', 'ClipChamp', 'LurkMaster'
];

const fakeMessages = [
  'Hey! Just joined the stream 👋',
  'This is awesome!',
  'Love the content!',
  'How long have you been streaming?',
  'First time here, loving it!',
  'Can you say hi to me?',
  'Great quality stream!',
  '🔥 🔥 🔥',
  'POG',
  'Lets gooo!',
  'This is so cool',
  'How do you do that?',
  'Amazing!',
  'Subscribed! 💜',
  'Keep it up!',
  'Hello from Brazil! 🇧🇷',
  'Hello from Japan! 🇯🇵',
  'Best stream today!',
  'You are so talented!',
  'GG!',
];

const userColors = [
  'text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400',
  'text-purple-400', 'text-pink-400', 'text-cyan-400', 'text-orange-400',
  'text-emerald-400', 'text-rose-400', 'text-violet-400', 'text-amber-400'
];

export default function LiveStream({ streamInfo, onEndStream }: LiveStreamProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 5);
  const [duration, setDuration] = useState(0);
  const [cameraOn, setCameraOn] = useState(streamInfo.cameraOn);
  const [micOn, setMicOn] = useState(streamInfo.micOn);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messageIdRef = useRef(0);

  // Start camera
  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraOn,
          audio: micOn,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };
    startStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Viewer count simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, prev + change);
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Fake chat messages
  useEffect(() => {
    const addFakeMessage = () => {
      const username = fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)];
      const message = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
      const color = userColors[Math.floor(Math.random() * userColors.length)];
      messageIdRef.current += 1;
      setMessages(prev => [...prev.slice(-50), {
        id: messageIdRef.current,
        username,
        message,
        color,
        timestamp: new Date(),
      }]);
    };

    // Initial messages
    for (let i = 0; i < 3; i++) {
      setTimeout(addFakeMessage, i * 500);
    }

    const timer = setInterval(addFakeMessage, 2000 + Math.random() * 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    messageIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: messageIdRef.current,
      username: 'You',
      message: chatInput.trim(),
      color: 'text-white',
      timestamp: new Date(),
    }]);
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onEndStream();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-md">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-bold">LIVE</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold truncate max-w-[200px]">{streamInfo.title}</h1>
            <p className="text-xs text-gray-400">{streamInfo.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            <span>{viewers.toLocaleString()} watching</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span>{formatDuration(duration)}</span>
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-black">
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                style={{ transform: 'scaleX(-1)' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">Camera is off</p>
                  <p className="text-gray-500 text-sm mt-1">Viewers can still hear you</p>
                </div>
              </div>
            )}

            {/* Overlay info */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                  Y
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">You</p>
                  <p className="text-gray-300 text-xs">{streamInfo.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Controls */}
          <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-all duration-200 ${
                  cameraOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500/20 text-red-400'
                }`}
                title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {cameraOn ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>
                  </svg>
                )}
              </button>
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-all duration-200 ${
                  micOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500/20 text-red-400'
                }`}
                title={micOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micOn ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!showEndConfirm ? (
                <button
                  onClick={() => setShowEndConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9c-1.6 0-3 .6-3.8 1.6-.4.5-.2 1.2.3 1.6.5.4 1.2.2 1.6-.3.4-.4 1.1-.9 1.9-.9 2.2 0 4 1.8 4 4s-1.8 4-4 4c-.9 0-1.7-.3-2.3-.8-.5-.4-1.2-.3-1.6.2-.4.5-.3 1.2.2 1.6 1 .8 2.3 1.2 3.7 1.2 3.3 0 6-2.7 6-6s-2.7-6-6-6z"/>
                    <rect x="11" y="2" width="2" height="9" rx="1"/>
                  </svg>
                  End Stream
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Are you sure?</span>
                  <button
                    onClick={handleEndStream}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Yes, End
                  </button>
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`${isChatOpen ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-80 xl:w-96 border-l border-gray-800 bg-gray-900`}>
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
              Stream Chat
            </h3>
            <span className="text-xs text-gray-400">{messages.length} messages</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
            {messages.map(msg => (
              <div key={msg.id} className="py-1 px-2 rounded hover:bg-gray-800/50 transition-colors">
                <span className={`text-sm font-semibold ${msg.color}`}>
                  {msg.username}
                </span>
                <span className="text-gray-500 text-xs ml-1">:</span>
                <span className="text-gray-200 text-sm ml-1.5 break-words">
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send a message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

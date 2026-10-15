import { useState } from 'react';
import Lobby from './components/Lobby';
import LiveStream from './components/LiveStream';
import SetupScreen from './components/SetupScreen';

export type AppState = 'lobby' | 'setup' | 'live';

export interface StreamInfo {
  title: string;
  category: string;
  cameraOn: boolean;
  micOn: boolean;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('lobby');
  const [streamInfo, setStreamInfo] = useState<StreamInfo>({
    title: 'My Live Stream',
    category: 'Just Chatting',
    cameraOn: true,
    micOn: true,
  });

  const handleGoLive = () => {
    setAppState('setup');
  };

  const handleStartStream = (info: StreamInfo) => {
    setStreamInfo(info);
    setAppState('live');
  };

  const handleEndStream = () => {
    setAppState('lobby');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {appState === 'lobby' && <Lobby onGoLive={handleGoLive} />}
      {appState === 'setup' && (
        <SetupScreen
          streamInfo={streamInfo}
          onStartStream={handleStartStream}
          onBack={() => setAppState('lobby')}
        />
      )}
      {appState === 'live' && (
        <LiveStream streamInfo={streamInfo} onEndStream={handleEndStream} />
      )}
    </div>
  );
}

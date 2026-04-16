import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Horizon (AI Generated)',
    artist: 'SynthBot Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Dreams (AI Generated)',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Pulse (AI Generated)',
    artist: 'Algorithm X',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay might be blocked
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black/80 border border-cyan-500/50 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        className="hidden"
      />
      
      <div className="flex flex-col items-center space-y-4">
        {/* Track Info */}
        <div className="text-center space-y-1">
          <h3 className="text-cyan-400 font-bold text-lg tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
            {currentTrack.title}
          </h3>
          <p className="text-pink-500/80 text-sm font-mono uppercase tracking-widest">
            {currentTrack.artist}
          </p>
        </div>

        {/* Fake Visualizer */}
        <div className="flex items-end justify-center space-x-1 h-8 w-full opacity-80">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-pink-500 rounded-t-sm transition-all duration-150 ease-in-out shadow-[0_0_8px_rgba(255,0,255,0.6)]"
              style={{
                height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                animation: isPlaying ? `bounce ${0.5 + Math.random()}s infinite alternate` : 'none',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 pt-2">
          <button
            onClick={prevTrack}
            className="text-cyan-500 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
          >
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-cyan-500/10 border-2 border-cyan-500 rounded-full text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          
          <button
            onClick={nextTrack}
            className="text-cyan-500 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3 w-full pt-4">
          <Volume2 size={16} className="text-cyan-600" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

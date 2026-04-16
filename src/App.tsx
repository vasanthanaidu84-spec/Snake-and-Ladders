/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-pink-500/30 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 flex justify-center items-center border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
          Neon Synth Snake
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-12 p-6 md:p-12 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Game Area */}
        <div className="relative z-10 flex-shrink-0">
          <SnakeGame />
        </div>

        {/* Music Player Area */}
        <div className="relative z-10 w-full max-w-md xl:mt-0 mt-8">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}

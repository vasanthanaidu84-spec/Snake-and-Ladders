import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Use refs for state that needs to be accessed inside the game loop without triggering re-renders
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

  // Update refs when state changes
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on a button (like music controls), let them use spacebar
      if (document.activeElement?.tagName === 'BUTTON' && e.key === ' ') {
        return;
      }

      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !gameOverRef.current) {
        setIsPaused(p => !p);
        return;
      }

      if (isPausedRef.current || gameOverRef.current) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOverRef.current || isPausedRef.current) return;

      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = directionRef.current;

      head.x += currentDir.x;
      head.y += currentDir.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Check food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        setFood(generateFood(currentSnake));
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [generateFood]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (optional, for cyber aesthetic)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food (Neon Pink)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(foodRef.current.x * CELL_SIZE + 2, foodRef.current.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw snake (Neon Green)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#39ff14';
    snakeRef.current.forEach((segment, index) => {
      // Head is slightly brighter
      if (index === 0) {
        ctx.fillStyle = '#66ff4d';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = '#39ff14';
        ctx.shadowBlur = 10;
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Reset shadow for next frame
    ctx.shadowBlur = 0;

  }, [snake, food]); // Redraw when snake or food changes

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Score Board */}
      <div className="flex items-center justify-between w-full max-w-[400px] px-4 py-3 bg-black/80 border border-green-500/50 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(57,255,20,0.2)]">
        <div className="text-green-400 font-mono text-xl tracking-widest drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-cyan-500 font-mono text-sm uppercase tracking-widest">
          {isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="relative bg-[#050505] rounded-lg border border-green-500/30 shadow-[0_0_30px_rgba(57,255,20,0.15)]"
        />

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm border border-pink-500/50 shadow-[inset_0_0_50px_rgba(255,0,255,0.2)]">
            <h2 className="text-4xl font-bold text-pink-500 mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] tracking-widest">
              GAME OVER
            </h2>
            <p className="text-green-400 font-mono text-xl mb-6 drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
              FINAL SCORE: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-pink-500/10 border-2 border-pink-500 text-pink-400 font-bold rounded hover:bg-pink-500/20 hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all uppercase tracking-widest"
            >
              Play Again
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] tracking-widest animate-pulse">
              PAUSED
            </h2>
          </div>
        )}
      </div>

      <div className="text-gray-500 font-mono text-xs text-center space-y-1">
        <p>Use <span className="text-cyan-400">WASD</span> or <span className="text-cyan-400">Arrows</span> to move</p>
        <p>Press <span className="text-pink-400">SPACE</span> to pause</p>
      </div>
    </div>
  );
}

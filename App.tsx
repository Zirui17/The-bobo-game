import React, { useState, useEffect, useRef } from 'react';
import { GameState, MoveType } from './types';
import { MOVES } from './constants';
import { resolveRound, getBotMove } from './services/gameLogic';
import { MoveButton } from './components/MoveButton';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { Play, Settings, Pause, LogOut, PlayCircle, BookOpen, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  
  // Settings & Rules
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [turnDuration, setTurnDuration] = useState(3000);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Game State
  const [playerQi, setPlayerQi] = useState(0);
  const [botQi, setBotQi] = useState(0);
  const [playerMove, setPlayerMove] = useState<MoveType | null>(null);
  const [botMove, setBotMove] = useState<MoveType | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(turnDuration);
  const [roundLog, setRoundLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<'player' | 'bot' | 'draw' | null>(null);
  const [phase, setPhase] = useState<'PLANNING' | 'RESOLVING'>('PLANNING');
  const [isPaused, setIsPaused] = useState(false);

  // Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);

  // Refs for Game Loop
  const playerMoveRef = useRef(playerMove);
  const playerQiRef = useRef(playerQi);
  const botQiRef = useRef(botQi);
  const phaseRef = useRef(phase);
  const isPausedRef = useRef(isPaused);
  const turnDurationRef = useRef(turnDuration);
  const countdownRef = useRef(countdown);

  // Sync refs
  useEffect(() => { playerMoveRef.current = playerMove; }, [playerMove]);
  useEffect(() => { playerQiRef.current = playerQi; }, [playerQi]);
  useEffect(() => { botQiRef.current = botQi; }, [botQi]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { turnDurationRef.current = turnDuration; }, [turnDuration]);
  useEffect(() => { countdownRef.current = countdown; }, [countdown]);

  // Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const startGame = () => {
    setPlayerQi(0);
    setBotQi(0);
    setPlayerMove(null);
    setBotMove(null);
    setRoundLog([]);
    setWinner(null);
    setPhase('PLANNING');
    setTimeLeft(turnDuration);
    setIsPaused(false);
    setCountdown(3); // Start with Countdown
    setGameState(GameState.PLAYING);
  };

  const exitGame = () => {
    setIsPaused(false);
    setCountdown(null);
    setGameState(GameState.MENU);
  };

  const togglePause = () => {
    // Don't pause during countdown
    if (countdown !== null) return;
    setIsPaused(!isPaused);
  };

  // Countdown Effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    } else {
        // Countdown hit 0, remove it after a brief "GO" moment handled in UI or immediately
        // Let's reset it to null to start game flow
        const timer = setTimeout(() => {
            setCountdown(null);
        }, 500); // show "FIGHT!" for 0.5s
        return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Game Loop
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;
    
    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      // Block logic if Paused OR Counting Down
      if (isPausedRef.current || countdownRef.current !== null) return;

      if (phaseRef.current === 'PLANNING') {
        setTimeLeft((prev) => {
          const next = prev - delta;
          if (next <= 0) {
            handleRoundEnd();
            return 0;
          }
          return next;
        });
      } else if (phaseRef.current === 'RESOLVING') {
          // For visual timeline during resolution (optional, keeps bar full or empty)
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, turnDuration]); // Restart loop if duration changes, though Refs handle inner logic

  const handleRoundEnd = () => {
    setPhase('RESOLVING');
    
    const currentMove = playerMoveRef.current;
    const currentPQi = playerQiRef.current;
    const currentBQi = botQiRef.current;

    const finalPlayerMove = currentMove || MoveType.IDLE;
    // Pass difficulty to bot
    const finalBotMove = getBotMove(currentBQi, currentPQi, difficulty);
    
    setBotMove(finalBotMove);
    setPlayerMove(finalPlayerMove); 

    // Small delay to allow the state to settle visually before calculating result
    // This ensures the "Reveal" is visible instantly
    setTimeout(() => {
      const result = resolveRound(finalPlayerMove, finalBotMove);
      setRoundLog(result.log);

      const calculateNextQi = (current: number, move: MoveType, isAlive: boolean) => {
        const def = MOVES[move];
        let next = current - def.cost;
        if (isAlive && move === MoveType.COLLECT_QI) {
            next += 1;
        }
        return Math.max(0, next);
      };

      const nextPlayerQi = calculateNextQi(currentPQi, finalPlayerMove, result.survivors.player);
      const nextBotQi = calculateNextQi(currentBQi, finalBotMove, result.survivors.bot);

      setPlayerQi(nextPlayerQi);
      setBotQi(nextBotQi);

      if (result.winner !== 'continue') {
        setWinner(result.winner as any);
        // Delay Game Over screen slightly
        setTimeout(() => setGameState(GameState.GAME_OVER), 2000);
      } else {
        // TEMPO SYNC: Wait exactly the turnDuration before starting next round
        setTimeout(() => {
          setPhase('PLANNING');
          setPlayerMove(null);
          setBotMove(null);
          setTimeLeft(turnDurationRef.current);
          setRoundLog([]);
        }, turnDurationRef.current); 
      }
    }, 50); // Immediate logic execution, but the phase hangs for turnDuration
  };

  const getTimerProgress = () => {
      if (phase === 'RESOLVING') return 100; // Full bar during resolution
      return (timeLeft / turnDuration) * 100;
  };

  // Helper to determine the color and text of the feedback bar
  const getRoundFeedback = () => {
    const standardColor = "bg-blue-600";
    const standardText = "text-white";

    // 1. Priority: Combat Log
    if (roundLog.length > 0) {
        return { text: roundLog[0], color: standardColor, textColor: standardText };
    }

    // 2. Priority: Peaceful Resolution (No Log)
    if (phase === 'RESOLVING') {
        let text = "NO DAMAGE";
        if (playerMove === MoveType.COLLECT_QI && botMove === MoveType.COLLECT_QI) {
            text = "BOTH GATHERED QI";
        } else if (playerMove === MoveType.COLLECT_QI) {
            text = "YOU GATHERED QI";
        } else if (botMove === MoveType.COLLECT_QI) {
             text = "OPPONENT GATHERED QI";
        }
        return { text, color: standardColor, textColor: standardText };
    }

    return { text: "...", color: "bg-stone-500", textColor: "text-white" };
  };

  const feedback = getRoundFeedback();
  
  return (
    <div className={`min-h-screen font-mono select-none flex flex-col overflow-hidden transition-colors duration-300 bg-stone-100 text-stone-800 dark:bg-[#0c0c0c] dark:text-stone-200`}>
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        turnDuration={turnDuration}
        setTurnDuration={setTurnDuration}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        theme={theme}
        setTheme={setTheme}
      />

      <RulesModal
        isOpen={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />

      {/* --- MENU --- */}
      {gameState === GameState.MENU && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative">
            <div className="absolute top-6 right-6 flex gap-4">
                <button 
                    onClick={() => setRulesOpen(true)}
                    className="p-3 text-stone-400 hover:text-stone-900 dark:text-stone-600 dark:hover:text-white transition-colors"
                    title="How to Play"
                >
                    <BookOpen size={24} />
                </button>
                <button 
                    onClick={() => setSettingsOpen(true)}
                    className="p-3 text-stone-400 hover:text-stone-900 dark:text-stone-600 dark:hover:text-white transition-colors"
                    title="Settings"
                >
                    <Settings size={24} />
                </button>
            </div>

          <div className="text-center space-y-4">
            <h1 className="text-9xl font-black tracking-tighter text-stone-900 dark:text-white">BOBO</h1>
            <p className="text-stone-400 dark:text-stone-500 tracking-[0.5em] uppercase text-xs">Rhythm Combat Protocol</p>
          </div>
          
          <div className="flex flex-col gap-4 items-center w-64">
              <button 
                onClick={startGame}
                className="w-full group relative px-8 py-5 bg-stone-900 text-white dark:bg-white dark:text-black font-bold text-2xl tracking-widest overflow-hidden shadow-lg dark:shadow-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3"><Play size={24} fill="currentColor" /> START</span>
                <div className="absolute inset-0 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>
              
              <button 
                onClick={() => setRulesOpen(true)}
                className="w-full py-3 border border-stone-300 dark:border-stone-800 text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-white hover:border-stone-400 dark:hover:border-stone-600 font-bold uppercase tracking-widest text-xs transition-colors"
              >
                How to Play
              </button>
          </div>
        </div>
      )}

      {/* --- PLAYING --- */}
      {gameState === GameState.PLAYING && (
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full h-screen relative">
          
          {/* Countdown Overlay */}
          {countdown !== null && (
             <div className="absolute inset-0 z-[60] bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                <div key={countdown} className="text-9xl font-black text-stone-900 dark:text-white animate-in zoom-in duration-300">
                    {countdown === 0 ? 'FIGHT' : countdown}
                </div>
             </div>
          )}

          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                <h2 className="text-6xl font-black text-stone-900 dark:text-white tracking-widest animate-pulse">PAUSED</h2>
                <div className="flex gap-4">
                    <button onClick={togglePause} className="px-8 py-3 bg-stone-900 text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 shadow-lg">
                        <PlayCircle size={20} /> Resume
                    </button>
                    <button onClick={exitGame} className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest hover:border-stone-900 hover:text-stone-900 dark:hover:border-white dark:hover:text-white transition-colors">
                        Exit
                    </button>
                </div>
            </div>
          )}

          {/* TOP: ENEMY */}
          <div className="flex-1 bg-stone-200 dark:bg-[#111] relative flex flex-col items-center justify-center transition-colors duration-500">
             
             {/* Game Controls */}
             <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 flex justify-between items-start z-20">
                 <div className="flex gap-1 sm:gap-2">
                    <button onClick={exitGame} className="text-stone-400 hover:text-red-500 transition-colors p-2" title="Exit to Menu">
                        <LogOut size={20} />
                    </button>
                    <button onClick={togglePause} className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors p-2" title="Pause Game">
                        <Pause size={20} />
                    </button>
                 </div>
                 <button onClick={() => setRulesOpen(true)} className="text-stone-400 hover:text-orange-500 transition-colors p-2" title="Rules">
                    <HelpCircle size={20} />
                 </button>
             </div>

             <div className="absolute top-4 sm:top-6 text-[10px] sm:text-xs font-bold text-stone-400 dark:text-stone-700 uppercase tracking-widest">Opponent</div>
             
             <div className="flex items-center gap-3 sm:gap-4 mt-20 sm:mt-24">
                <div className={`text-4xl sm:text-6xl font-black ${botQi >= 5 ? 'text-orange-600 dark:text-orange-500 animate-pulse' : 'text-stone-900 dark:text-white'}`}>
                    {botQi}
                </div>
                <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-600 font-bold tracking-widest">QI</span>
             </div>

             {/* Bot Action Reveal */}
             <div className="mt-12 sm:mt-16 h-24 sm:h-32 flex items-center justify-center">
                {phase === 'RESOLVING' && botMove ? (
                    <div className="text-center animate-in zoom-in duration-300">
                        <div className="text-6xl sm:text-8xl mb-2 sm:mb-4">{MOVES[botMove].gesture.split(' ')[0]}</div>
                        <div className="text-lg sm:text-2xl font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest">{MOVES[botMove].name}</div>
                    </div>
                ) : (
                    <div className="w-16 h-16 sm:w-24 sm:h-24 border-4 border-stone-300 dark:border-stone-800/50 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stone-400 dark:bg-stone-800 rounded-full animate-ping" />
                    </div>
                )}
             </div>
          </div>

          {/* MIDDLE: TIMELINE / FEEDBACK */}
          <div className="relative w-full z-30">
            <div className="h-1 sm:h-2 bg-stone-300 dark:bg-stone-900 w-full">
                <div 
                    className={`h-full transition-all duration-75 ease-linear ${timeLeft < 1000 ? 'bg-red-600' : 'bg-stone-900 dark:bg-white'}`} 
                    style={{ width: `${getTimerProgress()}%`, display: phase === 'RESOLVING' ? 'none' : 'block' }} 
                />
            </div>

            {/* Unified Height Bar (h-10 mobile, h-14 desktop) to prevent layout shift */}
            {phase === 'RESOLVING' ? (
                 <div className={`h-10 sm:h-14 flex items-center justify-center ${feedback.color} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
                    <span className={`text-sm sm:text-lg font-bold uppercase tracking-widest ${feedback.textColor} text-center px-4 drop-shadow-md`}>
                        {feedback.text}
                    </span>
                 </div>
            ) : (
                /* Standard Status Bar */
                 <div className="h-10 sm:h-14 flex items-center justify-center bg-stone-100 dark:bg-[#0c0c0c] border-b border-stone-200 dark:border-stone-900 shrink-0">
                     <span className={`text-sm sm:text-lg font-bold tracking-widest ${timeLeft < 1000 ? 'text-red-600 dark:text-red-500 animate-pulse' : 'text-stone-400 dark:text-stone-500'}`}>
                        {timeLeft < 1000 ? 'LOCK IN' : 'CHOOSE ACTION'}
                     </span>
                 </div>
            )}
          </div>


          {/* BOTTOM: PLAYER CONTROLS */}
          <div className="flex-[2] px-2 pb-2 pt-12 sm:px-6 sm:pb-6 sm:pt-14 bg-stone-100 dark:bg-[#0c0c0c] flex flex-col gap-5 sm:gap-6 min-h-0">
             <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-900 pb-5 shrink-0">
                <div className="text-[10px] sm:text-xs font-bold text-stone-400 dark:text-stone-700 uppercase tracking-widest">You</div>
                <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-600 font-bold tracking-widest">QI</span>
                    <span className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white leading-none">{playerQi}</span>
                </div>
             </div>

             {/* Move Grid */}
             <div className="grid grid-cols-4 gap-1 sm:gap-3 h-full pb-safe">
                {/* Row 1 */}
                <MoveButton moveType={MoveType.COLLECT_QI} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.COLLECT_QI} />
                <MoveButton moveType={MoveType.BLOCK} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.BLOCK} />
                <MoveButton moveType={MoveType.BO} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.BO} />
                <MoveButton moveType={MoveType.BIUBIU} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.BIUBIU} />
                
                {/* Row 2 */}
                <MoveButton moveType={MoveType.DOUBLE_BO} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.DOUBLE_BO} />
                <MoveButton moveType={MoveType.HONG} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.HONG} />
                <MoveButton moveType={MoveType.COVER_EYES} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.COVER_EYES} />
                <MoveButton moveType={MoveType.COVER_NOSE} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.COVER_NOSE} />
                
                {/* Row 3 */}
                <div className="col-span-2">
                   <MoveButton moveType={MoveType.LIGHTNING} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.LIGHTNING} />
                </div>
                <div className="col-span-2">
                   <MoveButton moveType={MoveType.FART} currentQi={playerQi} onClick={setPlayerMove} disabled={phase !== 'PLANNING' || isPaused || countdown !== null} selected={playerMove === MoveType.FART} />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER --- */}
      {gameState === GameState.GAME_OVER && (
        <div className="fixed inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
           <div className="text-center space-y-8 max-w-lg px-6">
             <h2 className={`text-7xl font-black uppercase tracking-tighter ${winner === 'player' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400 dark:text-stone-600'}`}>
                {winner === 'player' ? 'VICTORY' : winner === 'bot' ? 'DEFEATED' : 'DRAW'}
             </h2>
             <div className="w-full h-px bg-stone-200 dark:bg-stone-800" />
             <div className="space-y-2">
               {roundLog.map((line, i) => (
                  <p key={i} className="text-stone-500 dark:text-stone-400 text-sm font-mono tracking-wide">{line}</p>
               ))}
             </div>
             <button 
                onClick={startGame}
                className="mt-12 px-10 py-4 bg-stone-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest text-sm font-bold shadow-xl"
             >
                Play Again
             </button>
             <button 
                onClick={exitGame}
                className="block mx-auto mt-4 text-stone-400 dark:text-stone-600 hover:text-black dark:hover:text-white text-xs uppercase tracking-widest"
             >
                Return to Menu
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
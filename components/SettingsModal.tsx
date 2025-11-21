import React from 'react';
import { X, Clock, Cog, Brain, Sun, Moon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  turnDuration: number;
  setTurnDuration: (ms: number) => void;
  difficulty: 'easy' | 'hard';
  setDifficulty: (d: 'easy' | 'hard') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const SettingsModal: React.FC<Props> = ({ 
    isOpen, onClose, 
    turnDuration, setTurnDuration,
    difficulty, setDifficulty,
    theme, setTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-8 max-w-md w-full relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-3">
          <Cog className="text-stone-400 dark:text-stone-500" />
          Parameters
        </h2>

        <div className="space-y-8">
          
          {/* Theme */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} Theme
             </div>
             <div className="flex gap-2">
                <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2
                        ${theme === 'light' 
                            ? 'bg-stone-200 text-black border-stone-400' 
                            : 'bg-transparent text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'}
                    `}
                >
                    <Sun size={14} /> Light
                </button>
                <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2
                        ${theme === 'dark' 
                            ? 'bg-stone-800 text-white border-stone-600' 
                            : 'bg-transparent text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'}
                    `}
                >
                    <Moon size={14} /> Dark
                </button>
             </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                <Brain size={16} /> Difficulty
             </div>
             <div className="flex gap-2">
                <button 
                    onClick={() => setDifficulty('easy')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-all
                        ${difficulty === 'easy' 
                            ? 'bg-stone-900 dark:bg-white text-white dark:text-black border-stone-900 dark:border-white' 
                            : 'bg-transparent text-stone-500 dark:text-stone-600 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'}
                    `}
                >
                    Standard
                </button>
                <button 
                    onClick={() => setDifficulty('hard')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border transition-all
                        ${difficulty === 'hard' 
                            ? 'bg-orange-600 text-white border-orange-600' 
                            : 'bg-transparent text-stone-500 dark:text-stone-600 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'}
                    `}
                >
                    Aggressive
                </button>
             </div>
          </div>

          {/* Speed */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    <Clock size={16} /> Tempo
                </div>
                <span className="text-xl font-mono text-orange-500">{turnDuration / 1000}s</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="6000" 
              step="100" 
              value={turnDuration} 
              onChange={(e) => setTurnDuration(Number(e.target.value))}
              className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:opacity-90"
            >
                Apply
            </button>
        </div>
      </div>
    </div>
  );
};
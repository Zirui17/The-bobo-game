import React from 'react';
import { X, BookOpen, Heart } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-white transition-colors sticky"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3 sticky top-0 bg-white dark:bg-stone-950 py-2 border-b border-stone-200 dark:border-stone-900">
          <BookOpen className="text-orange-500" />
          Manual
        </h2>

        <div className="space-y-8 text-stone-600 dark:text-stone-300 font-mono text-sm">
          
          {/* Section 1: Basics */}
          <section>
            <h3 className="text-stone-900 dark:text-white font-bold uppercase tracking-widest mb-2">1. The Rhythm</h3>
            <p className="mb-2">The game follows a strict tempo. You must lock in your move before the timer expires.</p>
            <ul className="list-disc pl-5 space-y-1 text-stone-500 dark:text-stone-400">
                <li>Matches begin with <span className="text-stone-900 dark:text-white">0 Qi</span>.</li>
                <li><span className="text-yellow-600 dark:text-yellow-400">Collect Qi</span> (👏) grants +1 Qi.</li>
                <li>Powerful moves require Qi. You cannot perform a move if you lack the required energy.</li>
            </ul>
          </section>

          {/* Section 2: RPS Mechanics */}
          <section>
            <h3 className="text-stone-900 dark:text-white font-bold uppercase tracking-widest mb-2">2. Combat Hierarchy</h3>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-stone-50 dark:bg-stone-900/50 p-3 rounded border border-stone-200 dark:border-stone-800">
                    <strong className="text-orange-600 dark:text-orange-400 block mb-1">Standard Attacks</strong>
                    <p>Attacks with higher cost defeat those with lower cost.</p>
                    <div className="mt-2 text-xs text-stone-500">
                        Hong (3) <span className="text-stone-900 dark:text-white">&gt;</span> 2-Bo (2) <span className="text-stone-900 dark:text-white">&gt;</span> Bo (1)
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                        <strong className="text-blue-600 dark:text-blue-400">Block (🙅)</strong> stops all standard attacks.
                    </div>
                </div>
                
                <div className="bg-stone-50 dark:bg-stone-900/50 p-3 rounded border border-stone-200 dark:border-stone-800">
                    <strong className="text-cyan-600 dark:text-cyan-400 block mb-1">The Biubiu (👉)</strong>
                    <p>A specialized counter maneuver.</p>
                    <ul className="list-disc pl-4 mt-2 text-xs text-stone-500 space-y-1">
                        <li><span className="text-green-600 dark:text-green-400">ELIMINATES</span> opponents using Bo (1).</li>
                        <li><span className="text-green-600 dark:text-green-400">ELIMINATES</span> defenseless opponents.</li>
                        <li><span className="text-red-600 dark:text-red-500">DIES</span> if opponent uses Block.</li>
                    </ul>
                </div>
            </div>
          </section>

          {/* Section 3: Ultimates */}
          <section>
            <h3 className="text-stone-900 dark:text-white font-bold uppercase tracking-widest mb-2">3. Ultimates (5 Qi)</h3>
            <p className="mb-3 text-xs text-stone-500">Ultimates execute immediately and ignore standard attacks.</p>
            
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                    <div>
                        <span className="text-yellow-600 dark:text-yellow-300 font-bold">Lightning (🖐️)</span>
                        <div className="text-xs text-stone-500">Eliminates all players, unless...</div>
                    </div>
                    <div className="text-right">
                        <span className="text-stone-600 dark:text-stone-400 font-bold">Cover Eyes (🙈)</span>
                        <div className="text-xs text-stone-500 dark:text-stone-600">Safety</div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
                    <div>
                        <span className="text-green-600 dark:text-green-500 font-bold">Fart (💨)</span>
                        <div className="text-xs text-stone-500">Eliminates all players, unless...</div>
                    </div>
                    <div className="text-right">
                        <span className="text-stone-600 dark:text-stone-400 font-bold">Cover Nose (👃)</span>
                        <div className="text-xs text-stone-500 dark:text-stone-600">Safety</div>
                    </div>
                </div>
            </div>
          </section>
          
          <hr className="border-stone-200 dark:border-stone-800" />

          {/* Section 4: Origins */}
          <section className="pt-2">
            <h3 className="text-stone-900 dark:text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Heart size={16} className="text-red-500" fill="currentColor" /> Origins
            </h3>
            <div className="bg-stone-100 dark:bg-stone-900 p-6 rounded-lg italic leading-relaxed border-l-4 border-stone-300 dark:border-stone-700">
                <p>
                    "This game is a digital recreation of a playground classic played relentlessly during my elementary school years. 
                    It serves as a memory of my childhood and the childhood friends I shared it with. 
                    I didn't come up with these rules. They are a testament to the ingenuity and brilliance of kids everywhere."
                </p>
            </div>
          </section>

        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:opacity-90"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
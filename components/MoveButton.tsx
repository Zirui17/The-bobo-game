import React from 'react';
import { MoveType } from '../types';
import { MOVES } from '../constants';

interface Props {
  moveType: MoveType;
  currentQi: number;
  onClick: (m: MoveType) => void;
  disabled: boolean;
  selected: boolean;
}

export const MoveButton: React.FC<Props> = ({ moveType, currentQi, onClick, disabled, selected }) => {
  const move = MOVES[moveType];
  const affordable = currentQi >= move.cost;
  const isClickable = !disabled && affordable;

  // Base Styles
  // Light Mode: bg-white, text-stone-500, border-stone-300
  // Dark Mode: bg-[#141414], text-stone-400, border-stone-800
  let bgClass = "bg-white dark:bg-[#141414] text-stone-500 dark:text-stone-400 border-stone-300 dark:border-stone-800";
  let activeClass = "hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-black dark:hover:text-white hover:border-stone-400 dark:hover:border-stone-500";
  let selectedClass = "bg-stone-800 dark:bg-stone-200 text-white dark:text-black border-stone-900 dark:border-white ring-1 ring-stone-900 dark:ring-white transform scale-[0.98]";

  if (!affordable) {
      bgClass = "bg-stone-100 dark:bg-black text-stone-300 dark:text-stone-800 border-stone-200 dark:border-stone-900 opacity-60 dark:opacity-40";
      activeClass = "cursor-not-allowed";
  }

  // Badge Logic
  let badgeContent = "0";
  let badgeColor = "bg-stone-200 dark:bg-stone-800 text-stone-500";

  if (moveType === MoveType.COLLECT_QI) {
    badgeContent = "+1";
    badgeColor = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500";
  } else if (move.cost > 0) {
    badgeContent = `-${move.cost}`;
    badgeColor = affordable 
        ? "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300" 
        : "bg-red-100 dark:bg-red-900/20 text-red-400 dark:text-red-900";
  }

  return (
    <button
      onClick={() => isClickable && onClick(moveType)}
      disabled={!isClickable}
      className={`
        relative flex flex-col border-2 transition-all duration-150 rounded-lg p-1 sm:p-2
        ${selected ? selectedClass : `${bgClass} ${isClickable ? activeClass : ''}`}
        ${isClickable ? 'active:scale-95' : ''}
      `}
    >
      {/* Top Right: Cost */}
      <div className="w-full flex justify-end mb-0.5 sm:mb-1">
        <span className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded ${badgeColor}`}>
            {badgeContent}
        </span>
      </div>

      {/* Center: Icon/Gesture */}
      <div className="flex-1 flex items-center justify-center overflow-visible">
        <div className="text-2xl sm:text-5xl select-none transform transition-transform group-hover:scale-110 filter drop-shadow-sm dark:drop-shadow-lg leading-none">
            {move.gesture.split(' ')[0]} 
        </div>
      </div>

      {/* Bottom: Name */}
      <div className="mt-1 sm:mt-2 text-center z-10">
        <span className={`block text-[10px] sm:text-base font-black uppercase tracking-wide leading-tight ${selected ? 'text-white dark:text-black' : 'text-stone-800 dark:text-white'}`}>
            {move.name}
        </span>
      </div>
      
      {selected && <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />}
    </button>
  );
};
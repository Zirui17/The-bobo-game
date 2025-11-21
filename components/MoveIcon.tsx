import React from 'react';
import { MoveType } from '../types';
import { Hand, Zap, Wind, Shield, Swords, Eye, EyeOff, ZapOff } from 'lucide-react';

interface Props {
  type: MoveType;
  className?: string;
}

export const MoveIcon: React.FC<Props> = ({ type, className = "" }) => {
  const baseClass = `w-8 h-8 ${className}`;

  switch (type) {
    case MoveType.COLLECT_QI:
      return <Hand className={`${baseClass} text-yellow-400`} />;
    case MoveType.BLOCK:
      return <Shield className={`${baseClass} text-blue-400`} />;
    case MoveType.BO:
      return <div className={`${baseClass} flex items-center justify-center font-bold text-orange-400 border-2 border-orange-400 rounded-full`}>Bo</div>;
    case MoveType.DOUBLE_BO:
      return <div className={`${baseClass} flex items-center justify-center font-bold text-red-500 border-2 border-red-500 rounded-full`}>2Bo</div>;
    case MoveType.HONG:
      return <div className={`${baseClass} flex items-center justify-center font-bold text-red-700 border-4 border-red-700 rounded-full`}>Ho</div>;
    case MoveType.BIUBIU:
      return <Swords className={`${baseClass} text-cyan-400`} />;
    case MoveType.LIGHTNING:
      return <Zap className={`${baseClass} text-yellow-300 fill-yellow-300`} />;
    case MoveType.FART:
      return <Wind className={`${baseClass} text-green-600`} />;
    case MoveType.COVER_EYES:
      return <EyeOff className={`${baseClass} text-stone-400`} />;
    case MoveType.COVER_NOSE:
      return <ZapOff className={`${baseClass} text-stone-400`} />; // Metaphor for blocking smell/fart
    default:
      return <div className={baseClass}>?</div>;
  }
};
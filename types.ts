export enum MoveType {
  // Level 0
  COLLECT_QI = 'COLLECT_QI',
  BLOCK = 'BLOCK',
  
  // Attacks
  BO = 'BO',
  DOUBLE_BO = 'DOUBLE_BO',
  HONG = 'HONG',
  BIUBIU = 'BIUBIU', // Counter
  
  // Ultimates
  LIGHTNING = 'LIGHTNING',
  FART = 'FART',
  
  // Ultimate Defenses
  COVER_EYES = 'COVER_EYES',
  COVER_NOSE = 'COVER_NOSE',
  
  // System
  IDLE = 'IDLE' // If player misses the beat
}

export interface MoveDef {
  id: MoveType;
  name: string;
  cost: number;
  gesture: string; // Physical action description
  description: string;
  type: 'defense' | 'attack' | 'resource' | 'ultimate';
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface PlayerState {
  id: 'player' | 'bot';
  qi: number;
  lastMove: MoveType | null;
  status: 'alive' | 'dead';
}

export interface RoundResult {
  winner: 'player' | 'bot' | 'draw' | 'continue';
  log: string[];
  survivors: { player: boolean; bot: boolean };
}
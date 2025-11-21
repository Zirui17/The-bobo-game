import { MoveType, RoundResult } from '../types';

export const resolveRound = (pMove: MoveType, bMove: MoveType): RoundResult => {
  const log: string[] = [];
  let pAlive = true;
  let bAlive = true;

  // Helper to check death
  const killPlayer = (reason: string) => {
    pAlive = false;
    log.push(`YOU DIED: ${reason}`);
  };
  const killBot = (reason: string) => {
    bAlive = false;
    log.push(`ENEMY DIED: ${reason}`);
  };

  // --- 1. Ultimate Resolution (Highest Priority) ---
  const pIsUlt = pMove === MoveType.LIGHTNING || pMove === MoveType.FART;
  const bIsUlt = bMove === MoveType.LIGHTNING || bMove === MoveType.FART;

  if (pIsUlt || bIsUlt) {
    // Player uses Lightning
    if (pMove === MoveType.LIGHTNING) {
      if (bMove !== MoveType.COVER_EYES && bMove !== MoveType.LIGHTNING && bMove !== MoveType.FART) {
        killBot('Struck by Lightning');
      } else if (bMove === MoveType.COVER_EYES) {
        log.push('Enemy Covered Eyes!');
      }
    }
    // Player uses Fart
    if (pMove === MoveType.FART) {
      if (bMove !== MoveType.COVER_NOSE && bMove !== MoveType.LIGHTNING && bMove !== MoveType.FART) {
        killBot('Suffocated by Fart');
      } else if (bMove === MoveType.COVER_NOSE) {
        log.push('Enemy Covered Nose!');
      }
    }
    // Bot uses Lightning
    if (bMove === MoveType.LIGHTNING) {
      if (pMove !== MoveType.COVER_EYES && pMove !== MoveType.LIGHTNING && pMove !== MoveType.FART) {
        killPlayer('Struck by Lightning');
      } else if (pMove === MoveType.COVER_EYES) {
        log.push('You Covered Eyes!');
      }
    }
    // Bot uses Fart
    if (bMove === MoveType.FART) {
      if (pMove !== MoveType.COVER_NOSE && pMove !== MoveType.LIGHTNING && pMove !== MoveType.FART) {
        killPlayer('Suffocated by Fart');
      } else if (pMove === MoveType.COVER_NOSE) {
        log.push('You Covered Nose!');
      }
    }
  } else {
    // --- 2. Standard Combat ---

    const tier = (m: MoveType): number => {
        switch(m) {
            case MoveType.HONG: return 3;
            case MoveType.DOUBLE_BO: return 2;
            case MoveType.BO: return 1;
            default: return 0;
        }
    };

    // Biubiu Interactions (Specific Logic)
    
    // Player uses Biubiu
    if (pMove === MoveType.BIUBIU) {
        if (bMove === MoveType.BO) {
            killBot('Countered by Biubiu');
        } else if (bMove === MoveType.BLOCK) {
            killPlayer('Biubiu reflected by Block'); // Rule: Biubiu user dies hitting block
        } else if ([MoveType.COLLECT_QI, MoveType.IDLE, MoveType.COVER_EYES, MoveType.COVER_NOSE].includes(bMove)) {
            killBot('Shot by Biubiu');
        } else if (tier(bMove) > 1) {
            killPlayer('Overpowered by heavy attack');
        }
    }

    // Bot uses Biubiu (Only check if match not already decided by Player's Biubiu interaction on Bot)
    if (bMove === MoveType.BIUBIU && pAlive && bAlive) {
        if (pMove === MoveType.BO) {
            killPlayer('Countered by Biubiu');
        } else if (pMove === MoveType.BLOCK) {
            killBot('Biubiu reflected by Block');
        } else if ([MoveType.COLLECT_QI, MoveType.IDLE, MoveType.COVER_EYES, MoveType.COVER_NOSE].includes(pMove)) {
            killPlayer('Shot by Biubiu');
        } else if (tier(pMove) > 1) {
            killBot('Overpowered by heavy attack');
        }
    }

    // Standard Clashes (If no one used Biubiu, or Biubiu didn't result in death yet)
    if (pAlive && bAlive && pMove !== MoveType.BIUBIU && bMove !== MoveType.BIUBIU) {
        const pTier = tier(pMove);
        const bTier = tier(bMove);

        // Block Interactions
        if (pMove === MoveType.BLOCK && bTier > 0) log.push('Blocked attack!');
        else if (bMove === MoveType.BLOCK && pTier > 0) log.push('Attack blocked!');
        
        // Attack vs Attack
        else if (pTier > 0 && bTier > 0) {
            if (pTier > bTier) killBot(`${pMove} breaks ${bMove}`);
            else if (bTier > pTier) killPlayer(`${bMove} breaks ${pMove}`);
            else log.push('Power Clash! Even.');
        }
        // Attack vs Passive
        else if (pTier > 0 && bTier === 0) killBot('Hit while defenseless');
        else if (bTier > 0 && pTier === 0) killPlayer('Hit while defenseless');
    }
  }

  if (!pAlive && !bAlive) return { winner: 'draw', log, survivors: { player: false, bot: false } };
  if (!pAlive) return { winner: 'bot', log, survivors: { player: false, bot: true } };
  if (!bAlive) return { winner: 'player', log, survivors: { player: true, bot: false } };
  
  return { winner: 'continue', log, survivors: { player: true, bot: true } };
};

export const getBotMove = (botQi: number, playerQi: number, difficulty: 'easy' | 'hard'): MoveType => {
    
    // 1. If Player has 0 Qi, they can only Block or Collect.
    // Strategy: Collect Qi to build advantage safely. 
    // Exception: If Bot has Ultimate, go for the kill.
    if (playerQi === 0) {
        if (botQi >= 5 && difficulty === 'hard') {
             // 50% chance to ult if hard, otherwise collect
             return Math.random() > 0.5 ? MoveType.LIGHTNING : MoveType.COLLECT_QI;
        }
        return MoveType.COLLECT_QI;
    }

    // 2. General Move Pool
    const moves: MoveType[] = [];
    
    // Basics
    moves.push(MoveType.COLLECT_QI);
    moves.push(MoveType.COLLECT_QI); // Weight: 2
    moves.push(MoveType.BLOCK);

    if (botQi >= 1) {
        moves.push(MoveType.BO);
        moves.push(MoveType.BO); // Weight: 2
        // Lower frequency of Biubiu
        if (Math.random() > 0.7) moves.push(MoveType.BIUBIU); 
    }
    
    if (botQi >= 2) moves.push(MoveType.DOUBLE_BO);
    
    if (botQi >= 3) {
        moves.push(MoveType.HONG);
        if (difficulty === 'hard') moves.push(MoveType.HONG); // Aggressive on hard
    }

    if (botQi >= 5) {
        moves.push(MoveType.LIGHTNING);
        moves.push(MoveType.FART);
    }

    // Smart Defense overrides
    if (playerQi >= 5 && difficulty === 'hard' && Math.random() > 0.4) {
        return Math.random() > 0.5 ? MoveType.COVER_EYES : MoveType.COVER_NOSE;
    }

    const idx = Math.floor(Math.random() * moves.length);
    return moves[idx];
};
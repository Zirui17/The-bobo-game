import { MoveType, MoveDef } from './types';

export const MOVES: Record<MoveType, MoveDef> = {
  [MoveType.COLLECT_QI]: {
    id: MoveType.COLLECT_QI,
    name: 'Collect',
    cost: 0,
    gesture: '👏',
    description: 'Gain +1 Qi',
    type: 'resource'
  },
  [MoveType.BLOCK]: {
    id: MoveType.BLOCK,
    name: 'Block',
    cost: 0,
    gesture: '🙅', // Cross Arms
    description: 'Blocks Lvl 1-3. Reflects Biubiu.',
    type: 'defense'
  },
  [MoveType.BO]: {
    id: MoveType.BO,
    name: 'Bo',
    cost: 1,
    gesture: '👐',
    description: 'Lvl 1 Attack.',
    type: 'attack'
  },
  [MoveType.DOUBLE_BO]: {
    id: MoveType.DOUBLE_BO,
    name: '2-Bo',
    cost: 2,
    gesture: '👐👐',
    description: 'Lvl 2 Attack. Beats Bo.',
    type: 'attack'
  },
  [MoveType.HONG]: {
    id: MoveType.HONG,
    name: 'Hong',
    cost: 3,
    gesture: '💥',
    description: 'Lvl 3 Attack. Beats Bo/Double.',
    type: 'attack'
  },
  [MoveType.BIUBIU]: {
    id: MoveType.BIUBIU,
    name: 'Biubiu',
    cost: 1,
    gesture: '👉',
    description: 'Counter. Kills Bo user. Dies to Block.',
    type: 'attack'
  },
  [MoveType.LIGHTNING]: {
    id: MoveType.LIGHTNING,
    name: 'Lightning',
    cost: 5,
    gesture: '🖐️',
    description: 'Ult. Kills all except Cover Eyes.',
    type: 'ultimate'
  },
  [MoveType.FART]: {
    id: MoveType.FART,
    name: 'Fart',
    cost: 5,
    gesture: '💨', // Air Flow
    description: 'Ult. Kills all except Cover Nose.',
    type: 'ultimate'
  },
  [MoveType.COVER_EYES]: {
    id: MoveType.COVER_EYES,
    name: 'Blind',
    cost: 0,
    gesture: '🙈',
    description: 'Survive Lightning.',
    type: 'defense'
  },
  [MoveType.COVER_NOSE]: {
    id: MoveType.COVER_NOSE,
    name: 'Stink',
    cost: 0,
    gesture: '👃',
    description: 'Survive Fart.',
    type: 'defense'
  },
  [MoveType.IDLE]: {
    id: MoveType.IDLE,
    name: 'Miss',
    cost: 0,
    gesture: '🤷',
    description: 'Missed the beat.',
    type: 'resource'
  }
};
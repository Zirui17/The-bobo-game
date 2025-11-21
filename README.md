# BOBO: Rhythm Combat Protocol

## Overview
Bobo is a minimalist, simultaneous turn-based rhythm combat web game. Players engage in 1v1 duels against an AI, managing "Qi" (energy) to unleash attacks while predicting opponent moves. The game relies on a strict tempo system where players must lock in their physical gestures before the timer expires.

## Tech Stack
- **React 18**: UI Library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Game Rules

### Core Loop
1. **Planning Phase**: Players have a set time (e.g., 3 seconds) to choose a move.
2. **Resolution Phase**: Moves are revealed simultaneously.
3. **Result**: Logic determines who takes damage or dies.

### Resources
- **Qi**: The currency for attacks. Starts at 0.
- **Gain**: "Collect Qi" grants +1 Qi.
- **Cost**: Attacks cost 1, 2, 3, or 5 Qi.

### Move Hierarchy
**Ultimates (Priority 1)**
- **Lightning (5 Qi)**: Kills everyone unless they **Cover Eyes**.
- **Fart (5 Qi)**: Kills everyone unless they **Cover Nose**.

**Counters (Priority 2)**
- **Biubiu (1 Qi)**: 
  - Kills opponent using **Bo**.
  - Kills opponent using **Collect/Idle**.
  - **REFLECT RULE**: If opponent uses **Block**, the Biubiu user dies.

**Standard Attacks (Priority 3)**
- **Hong (3 Qi)** > Double Bo > Bo.
- **Double Bo (2 Qi)** > Bo.
- **Bo (1 Qi)** > Idle/Collect.
- **Block**: Stops all Standard Attacks (Bo, Double Bo, Hong).

## Installation
1. Clone the repository.
2. Run `npm install`.
3. Run `npm start`.

## Development Notes
- **Game Logic**: Located in `services/gameLogic.ts`. This handles the resolution matrix.
- **State Management**: Uses React `useState` and `useRef` in `App.tsx` to handle the high-frequency timer loop without closure staleness.

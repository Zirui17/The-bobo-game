# BOBO: Rhythm Combat Protocol

## Overview
**Bobo** is a minimalist, simultaneous turn-based rhythm combat web game. It recreates a classic childhood playground game where players manage "Qi" (energy) to unleash attacks and counters in a rhythmic duel.

### Created via Vibe Coding
This project was built using **Vibe Coding**—an iterative, AI-assisted development process. Instead of writing strict technical specifications upfront, the application was evolved through natural language conversation, focusing on "vibes," aesthetic feedback, and real-time mechanic tuning to capture the exact feeling of the original memory.

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bobo-rhythm-combat.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The game will open at `http://localhost:3000`.

## Deployment
This is a static React application, making it easy to deploy anywhere.

### Vercel / Netlify (Recommended)
1. Push this repository to GitHub.
2. Import the project into Vercel or Netlify.
3. The platform will automatically detect the settings (`npm run build`).
4. Deploy.

### Manual Build
To create a production-ready build:
```bash
npm run build
```
The output will be in the `build/` (or `dist/`) folder, which can be served by any static web server (Nginx, Apache, GitHub Pages).

## Game Rules (Summary)
The goal is to eliminate your opponent by managing your **Qi** (Energy).

1. **Rhythm**: Moves occur simultaneously on a timer.
2. **Qi**: You start with 0. You need Qi to attack.
   - **Collect Qi (👏)**: +1 Qi.
   - **Attacks**: Cost 1-3 Qi. Higher cost = Stronger priority.
   - **Block (🙅)**: Costs 0. Defends against all standard attacks.
3. **Special Interactions**:
   - **Biubiu (👉)**: A sniper shot (1 Qi). Kills opponents charging up or attacking lightly, but **reflects back to kill you** if they Block.
   - **Ultimates (5 Qi)**: **Lightning** and **Fart** kill instantly unless the specific counter-defense (Cover Eyes/Cover Nose) is used.

## Tech Stack
- **React 18**
- **TypeScript**
- **Tailwind CSS** (Dark/Light mode support)
- **Lucide React** (Icons)

## Origins
This game is a digital preservation of an elementary school hand game. It is a tribute to childhood creativity and the friends we played with.

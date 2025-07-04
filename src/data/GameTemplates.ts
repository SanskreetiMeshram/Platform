import { GameTemplate } from '../types/GameTypes';

export const gameTemplates: GameTemplate[] = [
  {
    id: 'new-game',
    name: 'Create New Game',
    description: 'Start from scratch and build your own unique game with complete creative freedom',
    category: '3D',
    difficulty: 'Easy',
    icon: 'Plus',
    preview: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Custom Design', 'Full Control', 'Any Genre', 'Unlimited Objects'],
    estimatedTime: '60+ minutes'
  },
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    description: 'Classic side-scrolling bird game with physics-based flight mechanics',
    category: '2D',
    difficulty: 'Easy',
    icon: 'Bird',
    preview: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Physics', 'Scoring', 'Obstacles', 'Mobile Controls'],
    estimatedTime: '30 minutes'
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    description: 'Endless road-crossing adventure with dynamic traffic and obstacles',
    category: '3D',
    difficulty: 'Medium',
    icon: 'Car',
    preview: 'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['3D Movement', 'Procedural Generation', 'Traffic System', 'Collectibles'],
    estimatedTime: '45 minutes'
  },
  {
    id: 'match-3',
    name: 'Match-3',
    description: 'Addictive puzzle game with cascading combos and power-ups',
    category: '2D',
    difficulty: 'Easy',
    icon: 'Gem',
    preview: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Match Logic', 'Animations', 'Power-ups', 'Level System'],
    estimatedTime: '40 minutes'
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Fast-paced platformer with precision jumping and time challenges',
    category: '2D',
    difficulty: 'Medium',
    icon: 'Zap',
    preview: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Platforming', 'Timer System', 'Checkpoints', 'Speedrun Mechanics'],
    estimatedTime: '50 minutes'
  },
  {
    id: 'whack-a-mole',
    name: 'Whack-a-Mole',
    description: 'Reaction-based game with randomized mole appearances and scoring',
    category: '2D',
    difficulty: 'Easy',
    icon: 'Target',
    preview: 'https://images.pexels.com/photos/1666644/pexels-photo-1666644.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Reaction Time', 'Random Spawning', 'Scoring', 'Difficulty Scaling'],
    estimatedTime: '25 minutes'
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    description: 'Battle royale shooter with tactical combat and survival elements',
    category: '3D',
    difficulty: 'Hard',
    icon: 'Crosshair',
    preview: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['3D Combat', 'Weapon System', 'Multiplayer', 'Survival Mechanics'],
    estimatedTime: '90 minutes'
  },
  {
    id: 'gta-v',
    name: 'GTA V Style',
    description: 'Open-world crime simulator with vehicles and missions',
    category: '3D',
    difficulty: 'Hard',
    icon: 'Car',
    preview: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Open World', 'Vehicle System', 'Mission System', 'Crime Mechanics'],
    estimatedTime: '120 minutes'
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    description: 'Voxel-based sandbox with building and crafting mechanics',
    category: '3D',
    difficulty: 'Medium',
    icon: 'Box',
    preview: 'https://images.pexels.com/photos/1040153/pexels-photo-1040153.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Voxel Building', 'Crafting System', 'Terrain Generation', 'Inventory'],
    estimatedTime: '75 minutes'
  }
];
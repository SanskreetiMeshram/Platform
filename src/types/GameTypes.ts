export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  category: '2D' | '3D';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  preview: string;
  features: string[];
  estimatedTime: string;
}

export interface GameAsset {
  id: string;
  name: string;
  type: 'sprite' | 'model' | 'sound' | 'music';
  url: string;
  category: string;
}

export interface GameScene {
  id: string;
  name: string;
  objects: GameObject[];
  camera: Camera;
  lighting: Lighting;
}

export interface GameObject {
  id: string;
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  components: GameComponent[];
  mesh?: any;
  sprite?: string;
  color?: string;
  type: 'player' | 'enemy' | 'obstacle' | 'collectible' | 'platform' | 'background';
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Camera {
  position: Vector3;
  rotation: Vector3;
  fov: number;
}

export interface Lighting {
  ambient: string;
  directional: {
    color: string;
    intensity: number;
    direction: Vector3;
  };
}

export interface GameComponent {
  type: string;
  properties: Record<string, any>;
}

export interface AIGenerationRequest {
  type: 'reskin' | 'music' | 'logic' | 'extension' | 'object';
  prompt: string;
  targetAssets?: string[];
  parameters?: Record<string, any>;
}

export interface ExportSettings {
  format: 'html5' | 'webgl';
  resolution: string;
  quality: 'low' | 'medium' | 'high';
  includeSource: boolean;
  enableMobile: boolean;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  lives: number;
  level: number;
  gameObjects: GameObject[];
  playerPosition: Vector3;
  gameSpeed: number;
}

export interface MenuState {
  file: boolean;
  edit: boolean;
  assets: boolean;
  gameObject: boolean;
  component: boolean;
  window: boolean;
}
export type GameState = 
  | 'TITLE'
  | 'PLAYING'
  | 'LEVEL_UP'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'SHOWCASE'
  | 'HOW_TO_PLAY';

export type NodeType = 
  | 'SIGNAL_EMITTER'    // Node2D - Disparo básico rápido
  | 'COLLISION_ORBITER' // Area2D - Escudo orbital
  | 'RAYCAST_SNIPER'    // RayCast2D - Laser contínuo perfurante
  | 'GPU_PARTICLES'     // GPUParticles2D - Onda radial de choque
  | 'YIELD_DILATION'    // Timer / await - Dilatação temporal (Slow motion)
  | 'EXPORT_BOOST'      // @export GDScript - Multiplicador de dano e cadência
  | 'VULKAN_BURST';     // Renderizador Vulkan - Onda limpa-tela super ataque

export interface NodeUpgrade {
  type: NodeType;
  name: string;
  godotClass: string;
  category: 'Arma' | 'Defesa' | 'Utilidade' | 'Super';
  level: number;
  maxLevel: number;
  icon: string;
  description: string;
  lore: string;
  effectDescription: string;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  speed: number;
  baseDamage: number;
  damageMultiplier: number;
  fireRateMultiplier: number;
  dashCooldown: number;
  dashTimer: number;
  isDashing: boolean;
  dashDuration: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  score: number;
  bugsEliminated: number;
  timeSurvived: number;
  vulkanCharge: number;
  maxVulkanCharge: number;
  nodes: Record<NodeType, number>;
}

export type EnemyType = 
  | 'NULL_POINTER'       // Inseto ágil de erro nulo
  | 'MEMORY_LEAK'        // Bolha roxa que incha e se divide
  | 'INFINITE_LOOP'      // Engrenagem giratória que telegrafa investida
  | 'STACK_OVERFLOW'     // Monólito pesado que bate no chão criando ondas
  | 'BOSS_SYNTAX_ERROR'  // Chefe 1: Erro de Sintaxe
  | 'BOSS_DEADLOCK';     // Chefe 2: Deadlock de Threads

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  color: string;
  hitFlash: number;
  telegraphTimer: number;
  telegraphDuration: number;
  isTelegraphing: boolean;
  telegraphAngle?: number;
  attackTimer: number;
  splitCount?: number;
  isBoss?: boolean;
  name: string;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  pierce: number;
  lifetime: number;
  type: 'PLAYER_BULLET' | 'RAYCAST' | 'ORBITAL' | 'ENEMY_BULLET' | 'SHOCKWAVE';
  angle?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  text?: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  lifetime: number;
}

export interface GodotShowcaseGame {
  id: string;
  title: string;
  developer: string;
  genre: string;
  year: string;
  highlight: string;
  description: string;
  quote: string;
  color: string;
  icon: string;
}

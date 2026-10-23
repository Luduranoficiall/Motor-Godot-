import { soundManager } from '../audio/soundManager';
import { GODOT_UPGRADES } from '../data/godotShowcase';
import { Enemy, FloatingText, GameState, NodeType, NodeUpgrade, Particle, PlayerStats, Projectile } from '../types/game';

interface GameCallbacks {
  onStateChange: (state: GameState) => void;
  onLevelUp: (choices: NodeUpgrade[]) => void;
  onGameOver: (stats: { score: number; bugs: number; time: number; level: number }) => void;
  onVictory: (stats: { score: number; bugs: number; time: number; level: number }) => void;
  onStatsUpdate: (stats: PlayerStats) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;

  // Running state
  public state: GameState = 'TITLE';
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private hitstopTimer: number = 0;
  private cameraShake: number = 0;
  private is3DMode: boolean = false;

  // Player
  public player: PlayerStats = {
    hp: 100,
    maxHp: 100,
    speed: 280,
    baseDamage: 25,
    damageMultiplier: 1.0,
    fireRateMultiplier: 1.0,
    dashCooldown: 1.2,
    dashTimer: 0,
    isDashing: false,
    dashDuration: 0.22,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    score: 0,
    bugsEliminated: 0,
    timeSurvived: 0,
    vulkanCharge: 0,
    maxVulkanCharge: 100,
    nodes: {
      SIGNAL_EMITTER: 1,
      COLLISION_ORBITER: 0,
      RAYCAST_SNIPER: 0,
      GPU_PARTICLES: 0,
      YIELD_DILATION: 0,
      EXPORT_BOOST: 0,
      VULKAN_BURST: 0
    }
  };

  public playerPos = { x: 0, y: 0 };
  public playerVel = { x: 0, y: 0 };
  public playerFacing = 0; // radians
  public playerHitFlash = 0;
  public playerSquash = { x: 1, y: 1 };
  private blinkTimer = 0;
  private isBlinking = false;
  private dashTrail: Array<{ x: number; y: number; alpha: number; angle: number }> = [];

  // Entities
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private nextEntityId = 1;

  // Spawning & Difficulty
  private spawnTimer = 0;
  private waveDifficulty = 1;
  private bossSpawned = false;
  private finalBossSpawned = false;

  // Timers for automated node weapons
  private signalShootTimer = 0;
  private gpuParticlesTimer = 0;
  private orbiterAngle = 0;

  // Input management
  private keysHeld: Record<string, boolean> = {};
  private keysJustPressed: Record<string, boolean> = {};
  private mousePos = { x: 0, y: 0 };
  private isMouseDown = false;
  private dashBuffered = false;
  private dashBufferTimer = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.callbacks = callbacks;

    this.resizeCanvas();
    this.resetPlayerPosition();
    this.setupListeners();
  }

  public resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }

  private resetPlayerPosition() {
    this.playerPos.x = window.innerWidth / 2;
    this.playerPos.y = window.innerHeight / 2;
  }

  public toggle3DMode() {
    this.is3DMode = !this.is3DMode;
  }

  public is3DActive(): boolean {
    return this.is3DMode;
  }

  // Input Handling
  private setupListeners() {
    window.addEventListener('resize', () => this.resizeCanvas());

    window.addEventListener('keydown', (e) => {
      const code = e.code;
      if (!this.keysHeld[code]) {
        this.keysJustPressed[code] = true;
      }
      this.keysHeld[code] = true;

      // Handle pause or start
      if (code === 'KeyP' || code === 'Escape') {
        if (this.state === 'PLAYING') {
          this.pauseGame();
        } else if (this.state === 'PAUSED') {
          this.resumeGame();
        }
      }

      if ((code === 'Space' || code === 'Enter') && this.state === 'TITLE') {
        this.startGame();
      }

      // Quick dash buffer
      if (code === 'ShiftLeft' || code === 'ShiftRight' || code === 'KeyE') {
        this.dashBuffered = true;
        this.dashBufferTimer = 0.15;
      }

      // Vulkan Supercharge
      if ((code === 'KeyF' || code === 'KeyQ') && this.state === 'PLAYING') {
        this.triggerVulkanSuper();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysHeld[e.code] = false;
    });

    window.addEventListener('blur', () => {
      this.keysHeld = {};
      this.keysJustPressed = {};
      this.isMouseDown = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isMouseDown = true;
      } else if (e.button === 2) {
        e.preventDefault();
        this.dashBuffered = true;
        this.dashBufferTimer = 0.15;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mobile touch controls support
    this.canvas.addEventListener('touchstart', (e) => {
      if (this.state === 'TITLE') {
        this.startGame();
      } else if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mousePos.x = touch.clientX;
        this.mousePos.y = touch.clientY;
        this.isMouseDown = true;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mousePos.x = touch.clientX;
        this.mousePos.y = touch.clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isMouseDown = false;
    });
  }

  public startGame() {
    this.state = 'PLAYING';
    this.callbacks.onStateChange('PLAYING');
    soundManager.startBGM();

    // Reset game state
    this.player.hp = this.player.maxHp;
    this.player.level = 1;
    this.player.xp = 0;
    this.player.xpToNextLevel = 100;
    this.player.score = 0;
    this.player.bugsEliminated = 0;
    this.player.timeSurvived = 0;
    this.player.vulkanCharge = 25;
    this.player.nodes = {
      SIGNAL_EMITTER: 1,
      COLLISION_ORBITER: 0,
      RAYCAST_SNIPER: 0,
      GPU_PARTICLES: 0,
      YIELD_DILATION: 0,
      EXPORT_BOOST: 0,
      VULKAN_BURST: 0
    };

    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.bossSpawned = false;
    this.finalBossSpawned = false;
    this.resetPlayerPosition();

    // Push initial stats to React HUD
    this.callbacks.onStatsUpdate({ ...this.player });
  }

  public pauseGame() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.callbacks.onStateChange('PAUSED');
    }
  }

  public resumeGame() {
    if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.callbacks.onStateChange('PLAYING');
      this.lastTime = performance.now();
    }
  }

  public returnToTitle() {
    this.state = 'TITLE';
    this.callbacks.onStateChange('TITLE');
    this.enemies = [];
    this.projectiles = [];
    this.resetPlayerPosition();
  }

  public applyUpgrade(nodeType: NodeType) {
    this.player.nodes[nodeType] = (this.player.nodes[nodeType] || 0) + 1;
    const newLvl = this.player.nodes[nodeType];

    // Apply immediate stat bonuses
    if (nodeType === 'EXPORT_BOOST') {
      this.player.damageMultiplier += 0.25;
      this.player.speed += 25;
    } else if (nodeType === 'SIGNAL_EMITTER') {
      this.player.fireRateMultiplier += 0.2;
    } else if (nodeType === 'COLLISION_ORBITER') {
      // expands orbiter count
    } else if (nodeType === 'VULKAN_BURST') {
      this.player.vulkanCharge = Math.min(this.player.maxVulkanCharge, this.player.vulkanCharge + 50);
    }

    soundManager.playLevelUp();
    this.addFloatingText(this.playerPos.x, this.playerPos.y - 40, `+ ${GODOT_UPGRADES[nodeType].name} (Nv. ${newLvl})`, '#68b6f3');

    // Resume playing
    this.state = 'PLAYING';
    this.callbacks.onStateChange('PLAYING');
    this.callbacks.onStatsUpdate({ ...this.player });
    this.lastTime = performance.now();
  }

  public triggerDash() {
    if (this.state === 'PLAYING') {
      this.dashBuffered = true;
      this.dashBufferTimer = 0.2;
    }
  }

  public startLoop() {
    this.lastTime = performance.now();
    const loop = (currentTime: number) => {
      const rawDt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      // Clamp dt to prevent tunneling on lag spikes
      const dt = Math.min(rawDt, 0.05);

      this.update(dt);
      this.render();

      this.keysJustPressed = {};
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    soundManager.stopBGM();
  }

  // Main Simulation Update
  private update(dt: number) {
    // Hitstop freeze handling
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Decay camera shake
    if (this.cameraShake > 0) {
      this.cameraShake *= Math.pow(0.05, dt);
      if (this.cameraShake < 0.1) this.cameraShake = 0;
    }

    // Update particles and floating texts in all states
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    // Eye blinking
    this.blinkTimer += dt;
    if (this.blinkTimer > 3.5) {
      this.isBlinking = true;
      if (this.blinkTimer > 3.7) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    if (this.state === 'TITLE') {
      // Atmospheric ambient drift for mascot on title
      this.playerFacing = Math.sin(performance.now() * 0.001) * 0.3;
      this.playerPos.y = window.innerHeight / 2 + Math.sin(performance.now() * 0.002) * 12;
      return;
    }

    if (this.state !== 'PLAYING') {
      return;
    }

    // Surviving time and difficulty
    this.player.timeSurvived += dt;
    this.waveDifficulty = 1 + this.player.timeSurvived / 45;

    // Player inputs & physics
    this.updatePlayer(dt);

    // Automated Weapons & Node Powers
    this.updateWeapons(dt);

    // Glitches & Spawning
    this.updateSpawning(dt);
    this.updateEnemies(dt);

    // Projectiles
    this.updateProjectiles(dt);

    // Check collisions
    this.checkCollisions();

    // Check victory condition (e.g. at 6 minutes or defeating final boss)
    if (this.player.timeSurvived >= 360 && this.finalBossSpawned && this.enemies.filter(e => e.isBoss).length === 0) {
      this.triggerVictory();
    }
  }

  private updatePlayer(dt: number) {
    // Dash buffer countdown
    if (this.dashBufferTimer > 0) {
      this.dashBufferTimer -= dt;
      if (this.dashBufferTimer <= 0) this.dashBuffered = false;
    }

    // Dash cooldown
    if (this.player.dashTimer > 0) {
      this.player.dashTimer -= dt;
    }

    // Handle dash trigger
    if (this.dashBuffered && this.player.dashTimer <= 0 && !this.player.isDashing) {
      this.player.isDashing = true;
      this.player.dashTimer = this.player.dashCooldown;
      this.dashBuffered = false;
      soundManager.playDash();
      this.cameraShake = Math.max(this.cameraShake, 4);

      // Dash particle burst
      this.emitShockwaveParticles(this.playerPos.x, this.playerPos.y, '#68b6f3', 14);
      setTimeout(() => {
        this.player.isDashing = false;
      }, this.player.dashDuration * 1000);
    }

    // Movement Direction
    let dx = 0;
    let dy = 0;

    if (this.keysHeld['KeyW'] || this.keysHeld['ArrowUp']) dy -= 1;
    if (this.keysHeld['KeyS'] || this.keysHeld['ArrowDown']) dy += 1;
    if (this.keysHeld['KeyA'] || this.keysHeld['ArrowLeft']) dx -= 1;
    if (this.keysHeld['KeyD'] || this.keysHeld['ArrowRight']) dx += 1;

    // Normalize diagonal movement
    const len = Math.hypot(dx, dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    // Calculate velocity with Godot move_and_slide feel
    const currentSpeed = this.player.isDashing ? this.player.speed * 2.8 : this.player.speed;
    const accel = 18;
    this.playerVel.x += (dx * currentSpeed - this.playerVel.x) * Math.min(1, accel * dt);
    this.playerVel.y += (dy * currentSpeed - this.playerVel.y) * Math.min(1, accel * dt);

    this.playerPos.x += this.playerVel.x * dt;
    this.playerPos.y += this.playerVel.y * dt;

    // Bounds checking
    const margin = 28;
    this.playerPos.x = Math.max(margin, Math.min(window.innerWidth - margin, this.playerPos.x));
    this.playerPos.y = Math.max(margin, Math.min(window.innerHeight - margin, this.playerPos.y));

    // Player facing angle towards mouse or movement
    if (this.mousePos.x > 0 || this.mousePos.y > 0) {
      this.playerFacing = Math.atan2(this.mousePos.y - this.playerPos.y, this.mousePos.x - this.playerPos.x);
    } else if (len > 0) {
      this.playerFacing = Math.atan2(dy, dx);
    }

    // Squash and stretch return to normal
    this.playerSquash.x += (1 - this.playerSquash.x) * 12 * dt;
    this.playerSquash.y += (1 - this.playerSquash.y) * 12 * dt;

    // Hit flash decay
    if (this.playerHitFlash > 0) {
      this.playerHitFlash -= dt * 6;
      if (this.playerHitFlash < 0) this.playerHitFlash = 0;
    }

    // Dash trail afterimages
    if (this.player.isDashing) {
      this.dashTrail.push({
        x: this.playerPos.x,
        y: this.playerPos.y,
        alpha: 0.6,
        angle: this.playerFacing
      });
    }

    // Decay dash trails
    for (let i = this.dashTrail.length - 1; i >= 0; i--) {
      this.dashTrail[i].alpha -= dt * 3;
      if (this.dashTrail[i].alpha <= 0) {
        this.dashTrail.splice(i, 1);
      }
    }
  }

  private updateWeapons(dt: number) {
    const nodes = this.player.nodes;

    // 1. SIGNAL_EMITTER (Node2D basic weapon)
    if (nodes.SIGNAL_EMITTER > 0) {
      this.signalShootTimer -= dt;
      const baseInterval = 0.45 / (this.player.fireRateMultiplier * (1 + (nodes.SIGNAL_EMITTER - 1) * 0.15));
      if (this.signalShootTimer <= 0) {
        this.signalShootTimer = baseInterval;
        this.fireSignalBullets();
      }
    }

    // 2. COLLISION_ORBITER (Area2D rotating shapes)
    if (nodes.COLLISION_ORBITER > 0) {
      this.orbiterAngle += dt * 3.5;
    }

    // 3. RAYCAST_SNIPER (RayCast2D continuous laser)
    if (nodes.RAYCAST_SNIPER > 0) {
      this.fireRaycastLaser(dt);
    }

    // 4. GPU_PARTICLES (GPUParticles2D explosive nova)
    if (nodes.GPU_PARTICLES > 0) {
      this.gpuParticlesTimer += dt;
      const interval = Math.max(2.2, 4.5 - nodes.GPU_PARTICLES * 0.5);
      if (this.gpuParticlesTimer >= interval) {
        this.gpuParticlesTimer = 0;
        this.triggerGpuParticlesNova();
      }
    }

    // Passive charge for Vulkan
    if (nodes.VULKAN_BURST > 0 && this.player.vulkanCharge < this.player.maxVulkanCharge) {
      this.player.vulkanCharge = Math.min(this.player.maxVulkanCharge, this.player.vulkanCharge + dt * 2);
    }
  }

  private fireSignalBullets() {
    const lvl = this.player.nodes.SIGNAL_EMITTER;
    const numBullets = Math.min(5, 1 + Math.floor((lvl - 1) / 2));
    const spread = 0.18;
    const speed = 560;
    const damage = this.player.baseDamage * this.player.damageMultiplier * (1 + lvl * 0.15);

    // Aim towards nearest enemy or towards playerFacing
    let targetAngle = this.playerFacing;
    const nearest = this.getNearestEnemy();
    if (nearest) {
      targetAngle = Math.atan2(nearest.y - this.playerPos.y, nearest.x - this.playerPos.x);
    }

    const startAngle = targetAngle - ((numBullets - 1) * spread) / 2;

    for (let i = 0; i < numBullets; i++) {
      const angle = startAngle + i * spread;
      this.projectiles.push({
        id: this.nextEntityId++,
        x: this.playerPos.x + Math.cos(angle) * 20,
        y: this.playerPos.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 6,
        damage,
        color: '#478cbf',
        pierce: 1 + Math.floor(lvl / 3),
        lifetime: 1.8,
        type: 'PLAYER_BULLET',
        angle
      });
    }

    soundManager.playShoot();
    // Squash effect when shooting
    this.playerSquash.x = 1.15;
    this.playerSquash.y = 0.88;
  }

  private fireRaycastLaser(dt: number) {
    const lvl = this.player.nodes.RAYCAST_SNIPER;
    const laserRange = 400 + lvl * 80;
    const laserAngle = this.playerFacing;
    const damage = (30 + lvl * 15) * this.player.damageMultiplier * dt;

    // Check hit on enemies along line
    const cosA = Math.cos(laserAngle);
    const sinA = Math.sin(laserAngle);
    const laserEndX = this.playerPos.x + cosA * laserRange;
    const laserEndY = this.playerPos.y + sinA * laserRange;

    for (const enemy of this.enemies) {
      // Distance from enemy to segment
      const hit = this.distToSegment(
        enemy.x, enemy.y,
        this.playerPos.x, this.playerPos.y,
        laserEndX, laserEndY
      );
      if (hit < enemy.radius + 8) {
        enemy.hp -= damage;
        enemy.hitFlash = 0.15;
        this.addSparks(enemy.x, enemy.y, '#38bdf8', 2);
      }
    }
  }

  private triggerGpuParticlesNova() {
    const lvl = this.player.nodes.GPU_PARTICLES;
    const radius = 180 + lvl * 40;
    const damage = (60 + lvl * 30) * this.player.damageMultiplier;

    this.cameraShake = Math.max(this.cameraShake, 8);
    this.emitShockwaveParticles(this.playerPos.x, this.playerPos.y, '#f59e0b', 32);
    soundManager.playExplosion(true);

    // Damage all enemies in blast radius
    for (const enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.playerPos.x, enemy.y - this.playerPos.y);
      if (dist <= radius + enemy.radius) {
        enemy.hp -= damage;
        enemy.hitFlash = 0.25;
        // Push back
        const angle = Math.atan2(enemy.y - this.playerPos.y, enemy.x - this.playerPos.x);
        enemy.vx += Math.cos(angle) * 350;
        enemy.vy += Math.sin(angle) * 350;
        this.addFloatingText(enemy.x, enemy.y, `-${Math.round(damage)} NOVA!`, '#fbbf24');
      }
    }
  }

  public triggerVulkanSuper() {
    if (this.player.vulkanCharge < 80) return;
    this.player.vulkanCharge = 0;
    this.cameraShake = 22;
    this.hitstopTimer = 0.08;
    soundManager.playVulkanWave();

    this.emitShockwaveParticles(this.playerPos.x, this.playerPos.y, '#38bdf8', 60);
    this.addFloatingText(this.playerPos.x, this.playerPos.y - 60, 'PIPELINE VULKAN: PURGA DE GLITCHES!', '#38bdf8');

    // Wipe all basic enemies or deal massive damage to bosses
    for (const enemy of this.enemies) {
      if (enemy.isBoss) {
        enemy.hp -= 250 * this.player.damageMultiplier;
        enemy.hitFlash = 0.4;
      } else {
        enemy.hp = 0;
      }
    }
    this.callbacks.onStatsUpdate({ ...this.player });
  }

  // Spawning logic
  private updateSpawning(dt: number) {
    this.spawnTimer -= dt;
    const spawnRate = Math.max(0.4, 1.8 / Math.sqrt(this.waveDifficulty));

    if (this.spawnTimer <= 0) {
      this.spawnTimer = spawnRate;
      this.spawnGlitchPack();
    }

    // Boss 1 at 2 minutes (120s)
    if (this.player.timeSurvived >= 120 && !this.bossSpawned) {
      this.bossSpawned = true;
      this.spawnBoss('BOSS_SYNTAX_ERROR');
    }

    // Final Boss at 4 minutes (240s)
    if (this.player.timeSurvived >= 240 && !this.finalBossSpawned) {
      this.finalBossSpawned = true;
      this.spawnBoss('BOSS_DEADLOCK');
    }
  }

  private spawnGlitchPack() {
    const time = this.player.timeSurvived;
    const types: Array<'NULL_POINTER' | 'MEMORY_LEAK' | 'INFINITE_LOOP' | 'STACK_OVERFLOW'> = ['NULL_POINTER'];

    if (time > 30) types.push('MEMORY_LEAK');
    if (time > 60) types.push('INFINITE_LOOP');
    if (time > 100) types.push('STACK_OVERFLOW');

    const chosenType = types[Math.floor(Math.random() * types.length)];
    const count = chosenType === 'NULL_POINTER' ? Math.floor(2 + this.waveDifficulty) : 1;

    for (let i = 0; i < count; i++) {
      this.spawnEnemy(chosenType);
    }
  }

  private spawnEnemy(type: 'NULL_POINTER' | 'MEMORY_LEAK' | 'INFINITE_LOOP' | 'STACK_OVERFLOW') {
    // Spawn off-screen edges
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const pad = 50;

    if (edge === 0) { // top
      x = Math.random() * window.innerWidth;
      y = -pad;
    } else if (edge === 1) { // right
      x = window.innerWidth + pad;
      y = Math.random() * window.innerHeight;
    } else if (edge === 2) { // bottom
      x = Math.random() * window.innerWidth;
      y = window.innerHeight + pad;
    } else { // left
      x = -pad;
      y = Math.random() * window.innerHeight;
    }

    const diff = this.waveDifficulty;
    let hp = 30 * diff;
    let radius = 14;
    let speed = 120 + diff * 8;
    let damage = 10;
    let color = '#ef4444';
    let name = 'Erro Null';

    if (type === 'MEMORY_LEAK') {
      hp = 65 * diff;
      radius = 20;
      speed = 75;
      damage = 15;
      color = '#a855f7';
      name = 'Vazamento VRAM';
    } else if (type === 'INFINITE_LOOP') {
      hp = 45 * diff;
      radius = 16;
      speed = 95;
      damage = 20;
      color = '#f59e0b';
      name = 'Loop Infinito';
    } else if (type === 'STACK_OVERFLOW') {
      hp = 120 * diff;
      radius = 26;
      speed = 50;
      damage = 30;
      color = '#ec4899';
      name = 'Estouro de Pilha';
    }

    this.enemies.push({
      id: this.nextEntityId++,
      type,
      name,
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      hp,
      maxHp: hp,
      speed,
      damage,
      color,
      hitFlash: 0,
      telegraphTimer: 0,
      telegraphDuration: 1.2,
      isTelegraphing: false,
      attackTimer: Math.random() * 2
    });
  }

  private spawnBoss(type: 'BOSS_SYNTAX_ERROR' | 'BOSS_DEADLOCK') {
    soundManager.playBossAlarm();
    this.cameraShake = 16;

    const x = window.innerWidth / 2;
    const y = -100;
    const diff = this.waveDifficulty;

    if (type === 'BOSS_SYNTAX_ERROR') {
      const hp = 800 * diff;
      this.enemies.push({
        id: this.nextEntityId++,
        type: 'BOSS_SYNTAX_ERROR',
        name: 'BUG CRÍTICO: Erro de Sintaxe',
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 46,
        hp,
        maxHp: hp,
        speed: 65,
        damage: 35,
        color: '#dc2626',
        hitFlash: 0,
        telegraphTimer: 0,
        telegraphDuration: 1.0,
        isTelegraphing: false,
        attackTimer: 2.0,
        isBoss: true
      });
      this.addFloatingText(window.innerWidth / 2, window.innerHeight / 3, 'ALERTA: ERRO DE COMPILAÇÃO DETECTADO!', '#ef4444');
    } else {
      const hp = 1800 * diff;
      this.enemies.push({
        id: this.nextEntityId++,
        type: 'BOSS_DEADLOCK',
        name: 'SOBRECARGA SUPREMA: Deadlock de Threads',
        x,
        y,
        vx: 0,
        vy: 0,
        radius: 60,
        hp,
        maxHp: hp,
        speed: 50,
        damage: 45,
        color: '#7c3aed',
        hitFlash: 0,
        telegraphTimer: 0,
        telegraphDuration: 1.4,
        isTelegraphing: false,
        attackTimer: 1.5,
        isBoss: true
      });
      this.addFloatingText(window.innerWidth / 2, window.innerHeight / 3, 'PERIGO MÁXIMO: DEADLOCK DE SISTEMA!', '#a855f7');
    }
  }

  private updateEnemies(dt: number) {
    const dilationLvl = this.player.nodes.YIELD_DILATION;
    const dilationSlow = dilationLvl > 0 ? Math.max(0.45, 1 - dilationLvl * 0.12) : 1;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Hit flash decay
      if (enemy.hitFlash > 0) {
        enemy.hitFlash -= dt * 4;
      }

      // Check death
      if (enemy.hp <= 0) {
        this.eliminateEnemy(enemy);
        this.enemies.splice(i, 1);
        continue;
      }

      // Enemy specific behaviors & telegraphs
      if (enemy.type === 'INFINITE_LOOP') {
        this.updateInfiniteLoop(enemy, dt * dilationSlow);
      } else if (enemy.type === 'STACK_OVERFLOW') {
        this.updateStackOverflow(enemy, dt * dilationSlow);
      } else if (enemy.isBoss) {
        this.updateBoss(enemy, dt * dilationSlow);
      } else {
        // Standard homing towards player
        const angle = Math.atan2(this.playerPos.y - enemy.y, this.playerPos.x - enemy.x);
        enemy.vx += (Math.cos(angle) * enemy.speed * dilationSlow - enemy.vx) * 8 * dt;
        enemy.vy += (Math.sin(angle) * enemy.speed * dilationSlow - enemy.vy) * 8 * dt;

        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
      }
    }
  }

  private updateInfiniteLoop(enemy: Enemy, dt: number) {
    enemy.attackTimer -= dt;

    if (enemy.isTelegraphing) {
      enemy.telegraphTimer -= dt;
      // While telegraphing, freeze movement and show red targeting line
      if (enemy.telegraphTimer <= 0) {
        enemy.isTelegraphing = false;
        // High speed dash along telegraphed angle
        const lungeSpeed = 480;
        enemy.vx = Math.cos(enemy.telegraphAngle || 0) * lungeSpeed;
        enemy.vy = Math.sin(enemy.telegraphAngle || 0) * lungeSpeed;
        enemy.attackTimer = 2.8;
      }
    } else {
      if (enemy.attackTimer <= 0) {
        // Start telegraphing lunge
        enemy.isTelegraphing = true;
        enemy.telegraphTimer = enemy.telegraphDuration;
        enemy.telegraphAngle = Math.atan2(this.playerPos.y - enemy.y, this.playerPos.x - enemy.x);
        enemy.vx = 0;
        enemy.vy = 0;
      } else {
        // Creep slowly towards player
        const angle = Math.atan2(this.playerPos.y - enemy.y, this.playerPos.x - enemy.x);
        enemy.vx += (Math.cos(angle) * enemy.speed - enemy.vx) * 6 * dt;
        enemy.vy += (Math.sin(angle) * enemy.speed - enemy.vy) * 6 * dt;
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
      }
    }
  }

  private updateStackOverflow(enemy: Enemy, dt: number) {
    enemy.attackTimer -= dt;
    if (enemy.attackTimer <= 0) {
      // Slam ground telegraph
      enemy.isTelegraphing = true;
      enemy.telegraphTimer = 0.8;
      enemy.attackTimer = 4.0;
    }

    if (enemy.isTelegraphing) {
      enemy.telegraphTimer -= dt;
      if (enemy.telegraphTimer <= 0) {
        enemy.isTelegraphing = false;
        // Slam shockwave
        this.cameraShake = Math.max(this.cameraShake, 7);
        this.emitShockwaveParticles(enemy.x, enemy.y, '#ec4899', 24);
        soundManager.playHit();

        // Check if player is close
        const dist = Math.hypot(this.playerPos.x - enemy.x, this.playerPos.y - enemy.y);
        if (dist < 120 && !this.player.isDashing) {
          this.damagePlayer(enemy.damage);
        }
      }
    } else {
      const angle = Math.atan2(this.playerPos.y - enemy.y, this.playerPos.x - enemy.x);
      enemy.vx += (Math.cos(angle) * enemy.speed - enemy.vx) * 4 * dt;
      enemy.vy += (Math.sin(angle) * enemy.speed - enemy.vy) * 4 * dt;
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
    }
  }

  private updateBoss(enemy: Enemy, dt: number) {
    // Boss moves smoothly towards center-player zone
    const targetY = window.innerHeight * 0.25;
    const targetX = this.playerPos.x;
    const angle = Math.atan2(targetY - enemy.y, targetX - enemy.x);

    enemy.vx += (Math.cos(angle) * enemy.speed - enemy.vx) * 3 * dt;
    enemy.vy += (Math.sin(angle) * enemy.speed - enemy.vy) * 3 * dt;
    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;

    enemy.attackTimer -= dt;
    if (enemy.attackTimer <= 0) {
      enemy.attackTimer = enemy.type === 'BOSS_SYNTAX_ERROR' ? 2.2 : 1.8;
      this.bossAttack(enemy);
    }
  }

  private bossAttack(boss: Enemy) {
    const numProjectiles = boss.type === 'BOSS_SYNTAX_ERROR' ? 8 : 12;
    const baseAngle = Math.atan2(this.playerPos.y - boss.y, this.playerPos.x - boss.x);

    for (let i = 0; i < numProjectiles; i++) {
      const angle = baseAngle + ((i - (numProjectiles - 1) / 2) * 0.25);
      this.projectiles.push({
        id: this.nextEntityId++,
        x: boss.x + Math.cos(angle) * boss.radius,
        y: boss.y + Math.sin(angle) * boss.radius,
        vx: Math.cos(angle) * 230,
        vy: Math.sin(angle) * 230,
        radius: 8,
        damage: 18,
        color: boss.color,
        pierce: 1,
        lifetime: 3.5,
        type: 'ENEMY_BULLET',
        angle
      });
    }

    // Boss sound
    soundManager.playShoot(0.6);
  }

  private eliminateEnemy(enemy: Enemy) {
    this.player.bugsEliminated++;
    this.player.score += enemy.isBoss ? 2000 : 50;
    this.player.vulkanCharge = Math.min(this.player.maxVulkanCharge, this.player.vulkanCharge + (enemy.isBoss ? 40 : 4));

    soundManager.playExplosion(enemy.isBoss);
    this.emitDeathParticles(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 45 : 12);

    if (enemy.isBoss) {
      this.cameraShake = 18;
      this.hitstopTimer = 0.08;
      this.addFloatingText(enemy.x, enemy.y, 'NÓ DE ERRO ELIMINADO!', '#10b981');
    }

    // Award XP
    const xpGained = enemy.isBoss ? 150 : 25;
    this.addXp(xpGained);

    // Memory Leak splits into smaller bugs!
    if (enemy.type === 'MEMORY_LEAK' && (!enemy.splitCount || enemy.splitCount < 1)) {
      for (let s = 0; s < 2; s++) {
        const offsetAngle = Math.random() * Math.PI * 2;
        this.enemies.push({
          id: this.nextEntityId++,
          type: 'NULL_POINTER',
          name: 'Fragmento de Vazamento',
          x: enemy.x + Math.cos(offsetAngle) * 20,
          y: enemy.y + Math.sin(offsetAngle) * 20,
          vx: Math.cos(offsetAngle) * 160,
          vy: Math.sin(offsetAngle) * 160,
          radius: 10,
          hp: 20 * this.waveDifficulty,
          maxHp: 20 * this.waveDifficulty,
          speed: 160,
          damage: 8,
          color: '#c084fc',
          hitFlash: 0,
          telegraphTimer: 0,
          telegraphDuration: 1,
          isTelegraphing: false,
          attackTimer: 0,
          splitCount: 1
        });
      }
    }
  }

  private addXp(amount: number) {
    this.player.xp += amount;
    if (this.player.xp >= this.player.xpToNextLevel) {
      this.player.xp -= this.player.xpToNextLevel;
      this.player.level++;
      this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.35 + 50);

      // Trigger level-up modal
      this.triggerLevelUp();
    }
    this.callbacks.onStatsUpdate({ ...this.player });
  }

  private triggerLevelUp() {
    this.state = 'LEVEL_UP';
    this.callbacks.onStateChange('LEVEL_UP');
    soundManager.playLevelUp();

    // Select 3 random available upgrades
    const availableTypes = (Object.keys(GODOT_UPGRADES) as NodeType[]).filter(t => {
      const current = this.player.nodes[t] || 0;
      return current < GODOT_UPGRADES[t].maxLevel;
    });

    // Shuffle and pick 3
    const shuffled = availableTypes.sort(() => Math.random() - 0.5);
    const choices = shuffled.slice(0, 3).map(type => {
      const upgrade = { ...GODOT_UPGRADES[type] };
      upgrade.level = (this.player.nodes[type] || 0) + 1;
      return upgrade;
    });

    this.callbacks.onLevelUp(choices);
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      proj.lifetime -= dt;

      if (proj.lifetime <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  private checkCollisions() {
    // 1. Player Projectiles vs Enemies
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const proj = this.projectiles[pIdx];
      if (proj.type !== 'PLAYER_BULLET') continue;

      for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
        const enemy = this.enemies[eIdx];
        const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);

        if (dist <= proj.radius + enemy.radius) {
          enemy.hp -= proj.damage;
          enemy.hitFlash = 0.2;
          this.addSparks(proj.x, proj.y, proj.color, 4);

          proj.pierce--;
          if (proj.pierce <= 0) {
            this.projectiles.splice(pIdx, 1);
            break;
          }
        }
      }
    }

    // 2. Collision Orbiter (Area2D shields) vs Enemies
    const orbiterLvl = this.player.nodes.COLLISION_ORBITER;
    if (orbiterLvl > 0) {
      const orbiterCount = Math.min(6, 1 + orbiterLvl);
      const orbitRadius = 60 + orbiterLvl * 8;
      const orbiterDamage = (40 + orbiterLvl * 15) * this.player.damageMultiplier;

      for (let i = 0; i < orbiterCount; i++) {
        const angle = this.orbiterAngle + (i * Math.PI * 2) / orbiterCount;
        const ox = this.playerPos.x + Math.cos(angle) * orbitRadius;
        const oy = this.playerPos.y + Math.sin(angle) * orbitRadius;
        const oRadius = 14;

        for (const enemy of this.enemies) {
          const dist = Math.hypot(ox - enemy.x, oy - enemy.y);
          if (dist <= oRadius + enemy.radius) {
            enemy.hp -= orbiterDamage * 0.05; // continuous tick
            enemy.hitFlash = 0.1;
            // Push enemy outwards
            const pushAngle = Math.atan2(enemy.y - this.playerPos.y, enemy.x - this.playerPos.x);
            enemy.vx += Math.cos(pushAngle) * 80;
            enemy.vy += Math.sin(pushAngle) * 80;
          }
        }
      }
    }

    // 3. Enemy Projectiles vs Player
    for (let pIdx = this.projectiles.length - 1; pIdx >= 0; pIdx--) {
      const proj = this.projectiles[pIdx];
      if (proj.type !== 'ENEMY_BULLET') continue;

      const dist = Math.hypot(proj.x - this.playerPos.x, proj.y - this.playerPos.y);
      if (dist <= proj.radius + 18 && !this.player.isDashing) {
        this.damagePlayer(proj.damage);
        this.projectiles.splice(pIdx, 1);
      }
    }

    // 4. Enemy Body Contact vs Player
    for (const enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.playerPos.x, enemy.y - this.playerPos.y);
      if (dist <= enemy.radius + 18 && !this.player.isDashing) {
        this.damagePlayer(enemy.damage * 0.08); // contact burn
      }
    }
  }

  private damagePlayer(amount: number) {
    this.player.hp -= amount;
    this.playerHitFlash = 0.35;
    this.cameraShake = Math.max(this.cameraShake, 10);
    this.hitstopTimer = 0.05;
    soundManager.playHit();

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.triggerGameOver();
    }
    this.callbacks.onStatsUpdate({ ...this.player });
  }

  private triggerGameOver() {
    this.state = 'GAME_OVER';
    this.callbacks.onStateChange('GAME_OVER');
    this.cameraShake = 20;
    this.emitDeathParticles(this.playerPos.x, this.playerPos.y, '#478cbf', 40);
    this.callbacks.onGameOver({
      score: this.player.score,
      bugs: this.player.bugsEliminated,
      time: Math.round(this.player.timeSurvived),
      level: this.player.level
    });
  }

  private triggerVictory() {
    this.state = 'VICTORY';
    this.callbacks.onStateChange('VICTORY');
    soundManager.playLevelUp();
    this.callbacks.onVictory({
      score: this.player.score,
      bugs: this.player.bugsEliminated,
      time: Math.round(this.player.timeSurvived),
      level: this.player.level
    });
  }

  // Particle & Text FX
  private emitDeathParticles(x: number, y: number, color: string, count: number) {
    const symbols = ['{}', ':=', 'var', '->', 'Node', '0', '1', ';'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 240;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        color,
        alpha: 1,
        decay: 1.2 + Math.random() * 1.5,
        text: Math.random() > 0.6 ? symbols[Math.floor(Math.random() * symbols.length)] : undefined
      });
    }
  }

  private emitShockwaveParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const speed = 180 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3,
        color,
        alpha: 1,
        decay: 2.5
      });
    }
  }

  private addSparks(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 100;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2,
        color,
        alpha: 1,
        decay: 3.5
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      id: this.nextEntityId++,
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -45,
      lifetime: 1.2
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= dt / ft.lifetime;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // Helper Math
  private getNearestEnemy(): Enemy | null {
    let nearest: Enemy | null = null;
    let minD = Infinity;

    for (const e of this.enemies) {
      const d = Math.hypot(e.x - this.playerPos.x, e.y - this.playerPos.y);
      if (d < minD) {
        minD = d;
        nearest = e;
      }
    }
    return nearest;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  // ==========================================
  // RENDERING PIPELINE (Godot Engine Aesthetic)
  // ==========================================
  private render() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ctx = this.ctx;

    ctx.save();

    // Camera Shake Offset
    if (this.cameraShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.cameraShake * 2;
      const shakeY = (Math.random() - 0.5) * this.cameraShake * 2;
      ctx.translate(shakeX, shakeY);
    }

    // 1. Background Grid & Coordinates (Godot Scene Viewport)
    this.renderBackground(ctx, width, height);

    // 2. Dash Trails
    for (const trail of this.dashTrail) {
      ctx.save();
      ctx.globalAlpha = trail.alpha;
      ctx.translate(trail.x, trail.y);
      ctx.rotate(trail.angle);
      this.drawGodotRobot(ctx, true);
      ctx.restore();
    }

    // 3. Enemy Telegraphs (Aim lasers, slam circles)
    this.renderEnemyTelegraphs(ctx);

    // 4. RayCast laser beam if active
    if (this.state === 'PLAYING' && this.player.nodes.RAYCAST_SNIPER > 0) {
      this.renderRaycastLaser(ctx);
    }

    // 5. Collision Orbiters (Area2D shields)
    if (this.state === 'PLAYING' && this.player.nodes.COLLISION_ORBITER > 0) {
      this.renderOrbiters(ctx);
    }

    // 6. Projectiles
    this.renderProjectiles(ctx);

    // 7. Enemies
    this.renderEnemies(ctx);

    // 8. Player: The Godot Robot Mascot
    ctx.save();
    ctx.translate(this.playerPos.x, this.playerPos.y);
    ctx.rotate(this.playerFacing);
    ctx.scale(this.playerSquash.x, this.playerSquash.y);
    this.drawGodotRobot(ctx, false);
    ctx.restore();

    // 9. Particles
    this.renderParticles(ctx);

    // 10. Floating Combat Text
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Godot dark theme viewport tone: #1e222b / #262c3b
    ctx.fillStyle = '#161922';
    ctx.fillRect(0, 0, width, height);

    const gridSize = 48;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(71, 140, 191, 0.09)'; // Godot blue faint grid

    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Center Origin Axes (Red X, Green Y like Godot 2D/3D Editor)
    const cx = width / 2;
    const cy = height / 2;
    ctx.lineWidth = 2;

    // X Axis (Red)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    // Y Axis (Green)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Subtle 3D perspective lines if 3D wireframe mode is toggled!
    if (this.is3DMode) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      for (let i = -width; i < width * 2; i += 120) {
        ctx.moveTo(cx, cy);
        ctx.lineTo(i, height);
      }
      ctx.stroke();
    }
  }

  private renderEnemyTelegraphs(ctx: CanvasRenderingContext2D) {
    for (const enemy of this.enemies) {
      if (!enemy.isTelegraphing) continue;

      if (enemy.type === 'INFINITE_LOOP' && enemy.telegraphAngle !== undefined) {
        // Red laser aiming guide
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(
          enemy.x + Math.cos(enemy.telegraphAngle) * 600,
          enemy.y + Math.sin(enemy.telegraphAngle) * 600
        );
        ctx.stroke();
        ctx.restore();
      } else if (enemy.type === 'STACK_OVERFLOW') {
        // Warning circle expansion
        ctx.save();
        const progress = 1 - (enemy.telegraphTimer / 0.8);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, progress * 120, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  private renderRaycastLaser(ctx: CanvasRenderingContext2D) {
    const lvl = this.player.nodes.RAYCAST_SNIPER;
    const laserRange = 400 + lvl * 80;
    const cosA = Math.cos(this.playerFacing);
    const sinA = Math.sin(this.playerFacing);
    const endX = this.playerPos.x + cosA * laserRange;
    const endY = this.playerPos.y + sinA * laserRange;

    ctx.save();
    // Glow core
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3 + lvl;
    ctx.beginPath();
    ctx.moveTo(this.playerPos.x + cosA * 15, this.playerPos.y + sinA * 15);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Laser tip light
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private renderOrbiters(ctx: CanvasRenderingContext2D) {
    const lvl = this.player.nodes.COLLISION_ORBITER;
    const orbiterCount = Math.min(6, 1 + lvl);
    const orbitRadius = 60 + lvl * 8;

    for (let i = 0; i < orbiterCount; i++) {
      const angle = this.orbiterAngle + (i * Math.PI * 2) / orbiterCount;
      const ox = this.playerPos.x + Math.cos(angle) * orbitRadius;
      const oy = this.playerPos.y + Math.sin(angle) * orbitRadius;

      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(angle * 2);

      // Area2D collision diamond
      ctx.fillStyle = '#60a5fa';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(12, 0);
      ctx.moveTo(12, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D) {
    for (const proj of this.projectiles) {
      ctx.save();
      ctx.fillStyle = proj.color;
      ctx.shadowColor = proj.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    for (const enemy of this.enemies) {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      // Hit flash color
      if (enemy.hitFlash > 0) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = enemy.color;
      }

      if (enemy.type === 'NULL_POINTER') {
        // Agile bug / spider matrix
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4 glitch legs
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-enemy.radius, -enemy.radius);
        ctx.lineTo(-enemy.radius - 6, -enemy.radius - 6);
        ctx.moveTo(enemy.radius, -enemy.radius);
        ctx.lineTo(enemy.radius + 6, -enemy.radius - 6);
        ctx.moveTo(-enemy.radius, enemy.radius);
        ctx.lineTo(-enemy.radius - 6, enemy.radius + 6);
        ctx.moveTo(enemy.radius, enemy.radius);
        ctx.lineTo(enemy.radius + 6, enemy.radius + 6);
        ctx.stroke();
      } else if (enemy.type === 'MEMORY_LEAK') {
        // Swelling blob with pulsating radius
        const pulse = Math.sin(performance.now() * 0.008) * 3;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(-4, -4, enemy.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'INFINITE_LOOP') {
        // Rotating gear ouroboros
        ctx.rotate(performance.now() * 0.004);
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'STACK_OVERFLOW') {
        // Heavy square monolith
        ctx.fillRect(-enemy.radius, -enemy.radius, enemy.radius * 2, enemy.radius * 2);
      } else if (enemy.isBoss) {
        // Boss entity with health bar over head
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        // Mechanical boss core ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();

        // Boss Health Bar
        const barWidth = 80;
        const barHeight = 8;
        const hpPercent = Math.max(0, enemy.hp / enemy.maxHp);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-barWidth / 2, -enemy.radius - 22, barWidth, barHeight);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-barWidth / 2, -enemy.radius - 22, barWidth * hpPercent, barHeight);
      }

      ctx.restore();
    }
  }

  // ==========================================
  // PROCEDURAL GODOT ROBOT MASCOT DRAWING
  // ==========================================
  private drawGodotRobot(ctx: CanvasRenderingContext2D, isGhost: boolean) {
    const isFlashing = this.playerHitFlash > 0 && !isGhost;

    // Body tones
    const godotBlue = isFlashing ? '#ffffff' : (isGhost ? 'rgba(71, 140, 191, 0.3)' : '#478cbf');
    const godotDark = isFlashing ? '#ffffff' : (isGhost ? 'rgba(32, 37, 49, 0.3)' : '#202531');
    const godotTeeth = '#ffffff';

    // 1. Thruster Exhaust Fire
    if (!isGhost && (this.keysHeld['KeyW'] || this.keysHeld['KeyS'] || this.keysHeld['KeyA'] || this.keysHeld['KeyD'] || this.player.isDashing)) {
      ctx.save();
      const flameLen = this.player.isDashing ? 32 : 16 + Math.random() * 8;
      ctx.fillStyle = this.player.isDashing ? '#38bdf8' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.lineTo(-14 - flameLen, 0);
      ctx.lineTo(-14, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 2. Head (Rounded Godot Square)
    ctx.fillStyle = godotBlue;
    this.roundRect(ctx, -14, -14, 28, 28, 6);
    ctx.fill();

    // 3. Iconic Top Antenna with glowing round bulb
    ctx.fillStyle = godotBlue;
    ctx.fillRect(-2, -22, 4, 8);
    ctx.beginPath();
    ctx.arc(0, -23, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Cog Ears (Left & Right)
    ctx.fillStyle = godotBlue;
    ctx.fillRect(-18, -8, 4, 16);
    ctx.fillRect(14, -8, 4, 16);

    // 5. Expressive Eyes
    if (!isGhost) {
      if (this.isBlinking) {
        // Blink line
        ctx.strokeStyle = godotDark;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(3, -5);
        ctx.lineTo(9, -5);
        ctx.moveTo(3, 5);
        ctx.lineTo(9, 5);
        ctx.stroke();
      } else {
        // Big round Godot eyes
        ctx.fillStyle = godotDark;
        ctx.beginPath();
        ctx.arc(6, -5, 4, 0, Math.PI * 2);
        ctx.arc(6, 5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(7.5, -6, 1.5, 0, Math.PI * 2);
        ctx.arc(7.5, 4, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Godot bottom gear mouth / teeth
      ctx.fillStyle = godotDark;
      ctx.fillRect(8, -4, 4, 8);
      ctx.fillStyle = godotTeeth;
      ctx.fillRect(9, -3, 2, 2);
      ctx.fillRect(9, 1, 2, 2);
    }
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.text) {
        ctx.fillStyle = p.color;
        ctx.font = '10px monospace';
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    ctx.font = 'bold 12px "Outfit", sans-serif';
    ctx.textAlign = 'center';

    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }
}

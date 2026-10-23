import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameState, NodeType, NodeUpgrade, PlayerStats } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { LevelUpModal } from './components/LevelUpModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { ShowcaseModal } from './components/ShowcaseModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { soundManager } from './audio/soundManager';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // High-level UI state (only updated on transitions or infrequent events)
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [levelUpChoices, setLevelUpChoices] = useState<NodeUpgrade[]>([]);
  const [endStats, setEndStats] = useState({ score: 0, bugs: 0, time: 0, level: 1 });
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [is3DMode, setIs3DMode] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // HUD stats cached in state (throttled by game engine)
  const [hudStats, setHudStats] = useState<PlayerStats>({
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
    vulkanCharge: 25,
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
  });

  // Mount isolated GameEngine on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onStateChange: (state) => {
        setGameState(state);
      },
      onLevelUp: (choices) => {
        setLevelUpChoices(choices);
      },
      onGameOver: (stats) => {
        setEndStats(stats);
      },
      onVictory: (stats) => {
        setEndStats(stats);
      },
      onStatsUpdate: (stats) => {
        setHudStats(stats);
      }
    });

    engineRef.current = engine;
    engine.startLoop();

    return () => {
      engine.stopLoop();
      engineRef.current = null;
    };
  }, []);

  const handleStartGame = () => {
    engineRef.current?.startGame();
  };

  const handlePause = () => {
    engineRef.current?.pauseGame();
  };

  const handleResume = () => {
    engineRef.current?.resumeGame();
  };

  const handleReturnToTitle = () => {
    engineRef.current?.returnToTitle();
  };

  const handleUpgradeSelect = (type: NodeType) => {
    engineRef.current?.applyUpgrade(type);
  };

  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleToggle3D = () => {
    engineRef.current?.toggle3DMode();
    setIs3DMode(engineRef.current?.is3DActive() ?? false);
  };

  const handleTriggerVulkan = () => {
    engineRef.current?.triggerVulkanSuper();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#141721] select-none">
      {/* Isolated WebGL/Canvas Viewport Container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      {/* FULL-VIEWPORT GAME SHELL OVERLAYS */}
      {gameState === 'TITLE' && (
        <TitleScreen
          onStart={handleStartGame}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          is3DMode={is3DMode}
          onToggle3D={handleToggle3D}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'LEVEL_UP') && (
        <GameHUD
          stats={hudStats}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={handlePause}
          onTriggerVulkan={handleTriggerVulkan}
          onDash={() => engineRef.current?.triggerDash()}
        />
      )}

      {gameState === 'LEVEL_UP' && (
        <LevelUpModal
          choices={levelUpChoices}
          onSelect={handleUpgradeSelect}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleStartGame}
          onReturnTitle={handleReturnToTitle}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          is3DMode={is3DMode}
          onToggle3D={handleToggle3D}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={endStats}
          onRestart={handleStartGame}
          onReturnTitle={handleReturnToTitle}
        />
      )}

      {gameState === 'VICTORY' && (
        <VictoryModal
          stats={endStats}
          onRestart={handleStartGame}
          onReturnTitle={handleReturnToTitle}
        />
      )}

      {/* Global Modals for Showcase & How To Play */}
      {isShowcaseOpen && (
        <ShowcaseModal onClose={() => setIsShowcaseOpen(false)} />
      )}

      {isHowToPlayOpen && (
        <HowToPlayModal onClose={() => setIsHowToPlayOpen(false)} />
      )}
    </div>
  );
}

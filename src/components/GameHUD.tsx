import React from 'react';
import { Volume2, VolumeX, Pause, Zap, Shield, Radio, Crosshair, Sparkles, Clock, Code } from 'lucide-react';
import { NodeType, PlayerStats } from '../types/game';
import { GODOT_UPGRADES } from '../data/godotShowcase';

interface GameHUDProps {
  stats: PlayerStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onTriggerVulkan: () => void;
  onDash: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  isMuted,
  onToggleMute,
  onPause,
  onTriggerVulkan,
  onDash
}) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (stats.xp / stats.xpToNextLevel) * 100));
  const vulkanPercent = Math.max(0, Math.min(100, (stats.vulkanCharge / stats.maxVulkanCharge) * 100));
  const isVulkanReady = stats.vulkanCharge >= 80;

  // Format time (mm:ss)
  const minutes = Math.floor(stats.timeSurvived / 60);
  const seconds = Math.floor(stats.timeSurvived % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'SIGNAL_EMITTER': return <Radio className="w-3.5 h-3.5 text-sky-400" />;
      case 'COLLISION_ORBITER': return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      case 'RAYCAST_SNIPER': return <Crosshair className="w-3.5 h-3.5 text-cyan-400" />;
      case 'GPU_PARTICLES': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'YIELD_DILATION': return <Clock className="w-3.5 h-3.5 text-indigo-400" />;
      case 'EXPORT_BOOST': return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'VULKAN_BURST': return <Zap className="w-3.5 h-3.5 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-10 select-none">
      {/* TOP PERIMETER ROW */}
      <div className="flex justify-between items-start w-full">
        {/* Top-Left Cluster: Godot HP & Scene Level */}
        <div className="flex flex-col gap-1.5 bg-slate-950/80 border border-slate-800/90 rounded-lg p-2.5 min-w-[220px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Mini Godot Icon */}
              <div className="w-6 h-6 rounded bg-[#478cbf] flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-white tracking-wide">ROBÔ GODOT</span>
            </div>
            <span className="text-xs font-mono-numbers text-sky-300 font-semibold">
              Nv. {stats.level}
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-150"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono-numbers">
            <span>HP: {Math.ceil(stats.hp)} / {stats.maxHp}</span>
            <span>XP: {stats.xp} / {stats.xpToNextLevel}</span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-slate-800/60 h-1.5 rounded overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-100"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Top-Right Cluster: Telemetry & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/90 rounded-lg px-3.5 py-2 font-mono-numbers">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Tempo</span>
              <span className="text-sm font-bold text-white">{formattedTime}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Glitches</span>
              <span className="text-sm font-bold text-amber-400">{stats.bugsEliminated}</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Pontuação</span>
              <span className="text-sm font-bold text-sky-400">{stats.score}</span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              title={isMuted ? 'Ativar som' : 'Desativar som'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>

            <button
              onClick={onPause}
              className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              aria-label="Pausar jogo"
              title="Pausar (Esc / P)"
            >
              <Pause className="w-4 h-4 text-slate-200" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM PERIMETER ROW */}
      <div className="flex justify-between items-end w-full">
        {/* Bottom-Left Cluster: Active Scene Graph Nodes */}
        <div className="flex flex-col gap-1 bg-slate-950/80 border border-slate-800/90 rounded-lg p-2 max-w-sm">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1">
            Nós Compilados na Árvore
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(Object.keys(stats.nodes) as NodeType[]).map(type => {
              const lvl = stats.nodes[type] || 0;
              if (lvl === 0) return null;
              return (
                <div
                  key={type}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-700/80 rounded text-xs text-slate-200"
                  title={`${GODOT_UPGRADES[type].name} - Nível ${lvl}`}
                >
                  {getNodeIcon(type)}
                  <span className="font-mono-numbers font-bold text-sky-300">v{lvl}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom-Right Cluster: Vulkan Supercharge & Dash Gauge */}
        <div className="flex items-center gap-3">
          {/* Dash Button */}
          <button
            onClick={onDash}
            disabled={stats.dashTimer > 0}
            className={`pointer-events-auto flex flex-col items-center bg-slate-950/80 border border-slate-800/90 rounded-lg px-3 py-1.5 transition-all ${
              stats.dashTimer <= 0
                ? 'hover:border-sky-400 text-emerald-400 cursor-pointer shadow-sm active:scale-95'
                : 'text-slate-500 cursor-not-allowed opacity-75'
            }`}
            title="Pressione Shift ou clique para esquivar com Dash"
          >
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Dash [Shift]</span>
            <span className="text-xs font-bold font-mono-numbers">
              {stats.dashTimer <= 0 ? 'PRONTO' : `${stats.dashTimer.toFixed(1)}s`}
            </span>
          </button>

          {/* Vulkan Super Button */}
          <button
            onClick={onTriggerVulkan}
            disabled={!isVulkanReady}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
              isVulkanReady
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse cursor-pointer'
                : 'bg-slate-950/80 border border-slate-800/90 text-slate-500 cursor-not-allowed'
            }`}
            title="Pressione F ou clique para ativar Super Carga Vulkan"
          >
            <Zap className={`w-4 h-4 ${isVulkanReady ? 'text-amber-300' : 'text-slate-600'}`} />
            <div className="flex flex-col text-left">
              <span>VULKAN [F]</span>
              <span className="text-[9px] font-mono-numbers">
                {isVulkanReady ? 'DISPONÍVEL!' : `${Math.floor(vulkanPercent)}%`}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

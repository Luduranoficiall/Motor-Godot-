import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Layers, FileText } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface TitleScreenProps {
  onStart: () => void;
  onOpenShowcase: () => void;
  onOpenHowToPlay: () => void;
  onOpenDocs: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  is3DMode: boolean;
  onToggle3D: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenShowcase,
  onOpenHowToPlay,
  onOpenDocs,
  isMuted,
  onToggleMute,
  is3DMode,
  onToggle3D
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 sm:p-12 z-20">
      {/* Top Bar Status / Utility */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-sky-400/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Godot Engine v4.3+ · Build Oficial</span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={onToggle3D}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
              is3DMode
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
            }`}
            title="Alternar projeção 2D / 3D wireframe"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Modo: {is3DMode ? '3D Vulkan' : '2D Pixel'}</span>
            </span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-md bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
            title={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>

      {/* Atmospheric Centerpiece / Bespoke Inline SVG Title Lockup */}
      <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-auto max-w-2xl mx-auto">
        {/* Bespoke Godot Title SVG Lockup */}
        <div className="mb-4">
          <svg
            className="w-24 h-24 mx-auto mb-3 drop-shadow-[0_0_25px_rgba(71,140,191,0.5)]"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Godot Robot Head Outline */}
            <rect x="22" y="26" width="84" height="76" rx="20" fill="#478cbf" stroke="#68b6f3" strokeWidth="4" />
            {/* Top Antenna */}
            <rect x="58" y="8" width="12" height="20" rx="4" fill="#478cbf" stroke="#68b6f3" strokeWidth="3" />
            <circle cx="64" cy="8" r="8" fill="#38bdf8" />
            {/* Ears / Cogs */}
            <rect x="12" y="44" width="12" height="40" rx="4" fill="#478cbf" />
            <rect x="104" y="44" width="12" height="40" rx="4" fill="#478cbf" />
            {/* Godot Eyes */}
            <circle cx="46" cy="56" r="13" fill="#202531" />
            <circle cx="82" cy="56" r="13" fill="#202531" />
            <circle cx="49" cy="53" r="4.5" fill="#ffffff" />
            <circle cx="85" cy="53" r="4.5" fill="#ffffff" />
            {/* Godot Cog Mouth */}
            <rect x="42" y="78" width="44" height="14" rx="4" fill="#202531" />
            <rect x="46" y="78" width="6" height="6" fill="#ffffff" />
            <rect x="56" y="78" width="6" height="6" fill="#ffffff" />
            <rect x="66" y="78" width="6" height="6" fill="#ffffff" />
            <rect x="76" y="78" width="6" height="6" fill="#ffffff" />
          </svg>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
            GODOT
            <span className="text-sky-400 block sm:inline sm:ml-3 text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              DESAFIO DOS NÓS
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto font-normal leading-relaxed">
            Sobreviva a ondas de Memory Leaks, Null References e Deadlocks. Compile nós e use o poder do GDScript para salvar a árvore de cenas!
          </p>
        </div>

        {/* Primary Start CTA Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={() => {
              soundManager.playShoot();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-base rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            INICIAR JOGO
          </button>

          <button
            onClick={onOpenShowcase}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/40 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Vitrine de Jogos Godot</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Como Jogar</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="w-full sm:w-auto px-5 py-3.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Documentação & Repo</span>
          </button>
        </div>
      </div>

      {/* Flat Control Hint Line required by Game Craft */}
      <div className="w-full text-center">
        <div className="inline-block px-4 py-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs sm:text-sm text-slate-400 font-mono-numbers">
          <span className="text-sky-300 font-semibold">WASD / Setas</span> Mover
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-sky-300 font-semibold">Espaço / Clique</span> Atirar
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-sky-300 font-semibold">Shift</span> Dash
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-sky-300 font-semibold">F</span> Vulkan Super
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-sky-300 font-semibold">Esc</span> Pausa
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Layers, BookOpen, Sparkles, Home, FileText } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
  onOpenShowcase: () => void;
  onOpenHowToPlay: () => void;
  onOpenDocs: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  is3DMode: boolean;
  onToggle3D: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onReturnTitle,
  onOpenShowcase,
  onOpenHowToPlay,
  onOpenDocs,
  isMuted,
  onToggleMute,
  is3DMode,
  onToggle3D
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/80 z-30 flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-[#202531] border border-[#414b66] rounded-xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-block p-2 rounded-full bg-sky-950/80 border border-sky-800/80 text-sky-400 mb-2">
            <span className="text-xs font-mono font-bold px-2">get_tree().paused = true</span>
          </div>
          <h2 className="text-2xl font-black text-white">JOGO PAUSADO</h2>
          <p className="text-xs text-slate-300 mt-1">A árvore de cenas está congelada.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Retomar Jogo (Esc / P)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Partida</span>
          </button>

          <div className="grid grid-cols-2 gap-2 my-1">
            <button
              onClick={onToggleMute}
              className="py-2.5 px-3 bg-[#262c3b] hover:bg-[#2d3547] text-slate-200 border border-[#3f4a64] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
              <span>{isMuted ? 'Áudio Mudo' : 'Áudio Ativo'}</span>
            </button>

            <button
              onClick={onToggle3D}
              className={`py-2.5 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                is3DMode
                  ? 'bg-sky-950/60 border-sky-500 text-sky-300'
                  : 'bg-[#262c3b] hover:bg-[#2d3547] border-[#3f4a64] text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{is3DMode ? 'Modo 3D Ativo' : 'Modo 2D Ativo'}</span>
            </button>
          </div>

          <button
            onClick={onOpenShowcase}
            className="w-full py-2.5 bg-[#262c3b] hover:bg-[#2d3547] text-sky-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#3f4a64]"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Consultar Vitrine de Jogos Godot</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full py-2.5 bg-[#262c3b] hover:bg-[#2d3547] text-slate-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#3f4a64]"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Guia de Nós & Inimigos</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="w-full py-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-600/40"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Documentação Técnica do Repositório</span>
          </button>

          <button
            onClick={onReturnTitle}
            className="w-full py-2.5 mt-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/50 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Abandonar e Voltar ao Início</span>
          </button>
        </div>
      </div>
    </div>
  );
};

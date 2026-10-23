import React, { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Award, Clock } from 'lucide-react';

interface VictoryModalProps {
  stats: {
    score: number;
    bugs: number;
    time: number;
    level: number;
  };
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ stats, onRestart, onReturnTitle }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyR' || e.code === 'Space') {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  const minutes = Math.floor(stats.time / 60);
  const seconds = stats.time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="absolute inset-0 bg-slate-950/85 z-30 flex items-center justify-center p-6 select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-[#202531] border border-emerald-500/60 rounded-xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400/60 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
        </div>

        <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-1">
          COMPILAÇÃO 100% BEM-SUCEDIDA
        </div>
        <h2 className="text-3xl font-black text-white mb-2">JOGO PUBLICADO COM SUCESSO!</h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto mb-6">
          Você limpou todos os vazamentos de memória, derrotou o Deadlock e levou seu projeto feito em Godot ao topo da vitrine!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-[#1a1e28] border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Pontuação Final</span>
              <span className="text-lg font-bold text-white font-mono-numbers">{stats.score}</span>
            </div>
          </div>

          <div className="bg-[#1a1e28] border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Tempo Total</span>
              <span className="text-lg font-bold text-white font-mono-numbers">{formattedTime}</span>
            </div>
          </div>

          <div className="bg-[#1a1e28] border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Glitches Sanados</span>
              <span className="text-lg font-bold text-white font-mono-numbers">{stats.bugs}</span>
            </div>
          </div>

          <div className="bg-[#1a1e28] border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Nível dos Nós</span>
              <span className="text-lg font-bold text-white font-mono-numbers">Nv. {stats.level}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-bold text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>NOVA EXPEDIÇÃO GODOT (R ou Espaço)</span>
          </button>

          <button
            onClick={onReturnTitle}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Voltar ao Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Gamepad2, Shield, Zap, AlertTriangle, Radio, Crosshair, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 z-40 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="max-w-2xl w-full max-h-[85vh] bg-[#202531] border border-[#414b66] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#323a4e] flex justify-between items-center bg-[#1b202b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Manual do Desenvolvedor: Como Jogar</h2>
              <p className="text-xs text-slate-400">Controles, mecânicas e nós do Godot</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs text-slate-300 leading-relaxed">
          {/* Controls section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Controles Principais</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-numbers">
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex justify-between items-center">
                <span className="text-slate-400 font-sans">Movimentação:</span>
                <span className="font-bold text-sky-300">W, A, S, D / Setas</span>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex justify-between items-center">
                <span className="text-slate-400 font-sans">Disparar Projéteis:</span>
                <span className="font-bold text-sky-300">Clique Esq. / Espaço</span>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex justify-between items-center">
                <span className="text-slate-400 font-sans">Esquiva / Dash (i-frames):</span>
                <span className="font-bold text-sky-300">Shift / Clique Dir.</span>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex justify-between items-center">
                <span className="text-slate-400 font-sans">Super Limpeza Vulkan:</span>
                <span className="font-bold text-purple-300">Tecla F (ao carregar)</span>
              </div>
            </div>
          </div>

          {/* Node powers breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Nós de Sobrevivência (Upgrades)</span>
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex gap-3 items-center">
                <Radio className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Node2D (Disparo de Sinal):</span>
                  Pulsos rápidos que se ramificam nos inimigos mais próximos.
                </div>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex gap-3 items-center">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Area2D (Escudo Orbital):</span>
                  Formas de colisão que giram ao redor do mascote, repelindo danos contínuos.
                </div>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex gap-3 items-center">
                <Crosshair className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">RayCast2D (Laser Direcional):</span>
                  Linha de visão instantânea perfurando múltiplos glitches na direção da mira.
                </div>
              </div>
              <div className="p-2.5 bg-[#1b202b] border border-slate-700/60 rounded flex gap-3 items-center">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">GPUParticles2D (Nova Estelar):</span>
                  Explosão periódica em área que joga glitches para longe.
                </div>
              </div>
            </div>
          </div>

          {/* Glitches warning */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Glitches e Telegrafia de Ataque</span>
            </h3>
            <p className="mb-2">
              Inimigos perigosos avisam seus ataques antes de golpear. Quando vir uma <strong className="text-red-400">linha tracejada vermelha</strong> ou um <strong className="text-pink-400">círculo rosa em expansão</strong>, use o <strong className="text-sky-300">Dash (Shift)</strong> imediatamente para sair da trajetória!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#323a4e] bg-[#1b202b] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Entendido, Vamos Jogar!
          </button>
        </div>
      </div>
    </div>
  );
};

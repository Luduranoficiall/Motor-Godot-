import React, { useEffect } from 'react';
import { NodeType, NodeUpgrade } from '../types/game';
import { Radio, Shield, Crosshair, Sparkles, Clock, Code, Zap } from 'lucide-react';

interface LevelUpModalProps {
  choices: NodeUpgrade[];
  onSelect: (type: NodeType) => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ choices, onSelect }) => {
  // Allow keyboard 1, 2, 3 selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1' && choices[0]) onSelect(choices[0].type);
      if (e.key === '2' && choices[1]) onSelect(choices[1].type);
      if (e.key === '3' && choices[2]) onSelect(choices[2].type);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [choices, onSelect]);

  const getNodeIcon = (type: NodeType) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'SIGNAL_EMITTER': return <Radio className={`${iconClass} text-sky-400`} />;
      case 'COLLISION_ORBITER': return <Shield className={`${iconClass} text-blue-400`} />;
      case 'RAYCAST_SNIPER': return <Crosshair className={`${iconClass} text-cyan-400`} />;
      case 'GPU_PARTICLES': return <Sparkles className={`${iconClass} text-amber-400`} />;
      case 'YIELD_DILATION': return <Clock className={`${iconClass} text-indigo-400`} />;
      case 'EXPORT_BOOST': return <Code className={`${iconClass} text-emerald-400`} />;
      case 'VULKAN_BURST': return <Zap className={`${iconClass} text-purple-400`} />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 z-30 flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="max-w-3xl w-full bg-[#202531] border border-[#414b66] rounded-xl p-6 shadow-2xl">
        {/* Header styled like Godot Inspector */}
        <div className="border-b border-[#323a4e] pb-4 mb-6 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Árvore de Cenas · Compilação de Novo Nó</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Subida de Nível: Escolha um Nó Godot
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-numbers bg-slate-900/60 px-2.5 py-1 rounded border border-slate-700/60">
            [1, 2 ou 3 para escolher]
          </span>
        </div>

        {/* Upgrade Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {choices.map((choice, index) => (
            <button
              key={choice.type}
              onClick={() => onSelect(choice.type)}
              className="text-left bg-[#262c3b] hover:bg-[#2d3547] border border-[#3f4a64] hover:border-sky-400 rounded-lg p-5 transition-all flex flex-col justify-between group cursor-pointer shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/80 group-hover:border-sky-400/60 transition-colors">
                    {getNodeIcon(choice.type)}
                  </div>
                  <span className="text-xs font-mono-numbers font-bold bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded">
                    Nv. {choice.level}
                  </span>
                </div>

                <div className="text-xs font-mono text-sky-400/90 mb-1">
                  {choice.godotClass}
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {choice.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {choice.description}
                </p>
                <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 p-2 rounded mb-3">
                  {choice.effectDescription}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 italic border-t border-slate-700/50 pt-2 mb-3">
                  {choice.lore}
                </p>
                <div className="w-full py-2 bg-sky-600/20 group-hover:bg-sky-500 text-sky-300 group-hover:text-white text-xs font-bold text-center rounded transition-all">
                  Instalar Nó [{index + 1}]
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, Code2, Box, Cpu, ExternalLink, ShieldCheck } from 'lucide-react';
import { GODOT_SHOWCASE_GAMES } from '../data/godotShowcase';

interface ShowcaseModalProps {
  onClose: () => void;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'GAMES' | 'FEATURES'>('GAMES');

  return (
    <div className="absolute inset-0 bg-slate-950/85 z-40 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="max-w-4xl w-full max-h-[90vh] bg-[#202531] border border-[#414b66] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#323a4e] flex justify-between items-center bg-[#1b202b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#478cbf] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Vitrine Oficial de Jogos & Recursos Godot
              </h2>
              <p className="text-xs text-slate-400">
                Uma imagem vale mais que mil palavras: grandes sucessos criados com Godot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#323a4e] bg-[#1a1e28] px-4 gap-2">
          <button
            onClick={() => setSelectedTab('GAMES')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              selectedTab === 'GAMES'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Jogos em Destaque ({GODOT_SHOWCASE_GAMES.length})
          </button>
          <button
            onClick={() => setSelectedTab('FEATURES')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              selectedTab === 'FEATURES'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Por Que Escolher Godot?
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {selectedTab === 'GAMES' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GODOT_SHOWCASE_GAMES.map((game) => (
                <div
                  key={game.id}
                  className="bg-[#262c3b] border border-[#3f4a64] rounded-lg p-4 flex flex-col justify-between hover:border-sky-400/70 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-mono text-sky-300 font-semibold">
                        {game.developer} · {game.year}
                      </span>
                      <span className="text-[10px] font-semibold bg-sky-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded">
                        {game.genre}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">
                      {game.title}
                    </h3>
                    <div className="text-xs text-amber-300/90 font-medium mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{game.highlight}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {game.description}
                    </p>
                  </div>

                  <blockquote className="text-[11px] text-slate-400 italic bg-[#1e2330] p-2.5 rounded border border-slate-700/50">
                    {game.quote}
                  </blockquote>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#262c3b] border border-[#3f4a64] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-sky-400">
                    <Box className="w-5 h-5" />
                    <h4 className="font-bold text-white text-sm">Design Orientado a Cenas e Nós</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Construa seu jogo a partir de blocos simples chamados nós. Transforme cenas em componentes completos reutilizáveis, com parâmetros ajustáveis e recursos programáveis independentes.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <Code2 className="w-5 h-5" />
                    <h4 className="font-bold text-white text-sm">GDScript, C# e C++ GDExtension</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Escreva código sem atrito com GDScript de alto nível e tipagem estática opcional, utilize C# com .NET completo, ou vincule bibliotecas nativas de alto desempenho com GDExtension.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-amber-400">
                    <Cpu className="w-5 h-5" />
                    <h4 className="font-bold text-white text-sm">Motor 3D Vulkan & 2D Dedicado</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Renderizadores modernos Vulkan, Direct3D 12 e Metal para gráficos 3D espetaculares, combinados a um pipeline 2D dedicado com unidades reais em pixels e editor de TileMaps avançado.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h4 className="font-bold text-white text-sm">100% Livre & Licença MIT</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sem taxas por instalação, sem porcentagens de royalties e sem contratos abusivos. O código-fonte é aberto, seu projeto é exclusivamente seu e você pode modificá-lo livremente.
                  </p>
                </div>
              </div>

              {/* Godot quote banner */}
              <div className="p-4 bg-gradient-to-r from-sky-950/80 to-blue-950/80 border border-sky-800/80 rounded-lg text-center">
                <p className="text-sm text-sky-200 font-medium">
                  "O Godot pertence à sua comunidade mundial de criadores. Desenvolva uma vez e publique para PC, Consoles, Mobile e Web."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#323a4e] bg-[#1b202b] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Fechar Vitrine
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, FileText, Check, Copy, ExternalLink, ShieldCheck, Cpu, Code2, Layers, Terminal } from 'lucide-react';

interface RepoDocsModalProps {
  onClose: () => void;
}

export const RepoDocsModal: React.FC<RepoDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ARCHITECTURE' | 'INSTALL' | 'MARKDOWN'>('OVERVIEW');
  const [copied, setCopied] = useState(false);

  const rawMarkdownSnippet = `# 🤖 Godot: O Desafio dos Nós (Engine Survivors)
Uma experiência arcade imersiva de alta performance celebrando o motor Godot, arquitetura em nós e desenvolvimento web de última geração.

## 📌 Visão Executiva para Clientes
- **60 FPS Cravados**: Game loop em Canvas desacoplado do ciclo de renderização React 19.
- **Sintetizador Procedural Web Audio API**: Zero arquivos pesados de áudio, 100% sintetizado em tempo real via osciladores matemáticos.
- **Modo Híbrido 2D / 3D Vulkan**: Alternância fluida de projeção e materiais.
- **Zero Dependências Proprietárias**: 100% código aberto sob Licença MIT.

## 🚀 Como Rodar
\`\`\`bash
git clone https://github.com/seu-usuario/godot-node-survivors.git
npm install
npm run dev
\`\`\`
Acesse: http://localhost:3000`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(rawMarkdownSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 z-40 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="max-w-4xl w-full max-h-[90vh] bg-[#202531] border border-[#414b66] rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#323a4e] flex justify-between items-center bg-[#1b202b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Documentação Oficial do Repositório
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
                  v1.0 Produção
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Especificação técnica, proposta de valor para clientes e guia de arquitetura
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#323a4e] bg-[#171b24] px-4 gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Executiva & Cliente
          </button>
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ARCHITECTURE'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Arquitetura & Engenharia
          </button>
          <button
            onClick={() => setActiveTab('INSTALL')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'INSTALL'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Instalação & Deploy
          </button>
          <button
            onClick={() => setActiveTab('MARKDOWN')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'MARKDOWN'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            README Markdown
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-300 leading-relaxed">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-950/40 border border-sky-800/60 rounded-xl">
                <h3 className="text-sm font-bold text-sky-300 mb-1">
                  Resumo de Entrega para Clientes
                </h3>
                <p className="text-slate-300">
                  Esta aplicação demonstra excelência em engenharia front-end moderna. Construída sem frameworks de jogos pesados externos, roda com <strong>zero latência de carregamento</strong> em qualquer navegador, consumindo o mínimo de memória e largura de banda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#262c3b] border border-[#3f4a64] p-3.5 rounded-lg">
                  <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>60 FPS Estáveis</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Game loop com delta time fixado e física desassociada dos ciclos de re-render do React.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] p-3.5 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>Web Audio Puro</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sem downloads de MP3/WAV. Efeitos sonoros gerados dinamicamente via síntese matemática.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] p-3.5 rounded-lg">
                  <div className="text-purple-400 font-bold mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Pronto para Produção</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    TypeScript rigoroso, compatibilidade multiplataforma (desktop e touch mobile) e licença livre MIT.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Por que este projeto agrega valor ao portfólio comercial:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-[11px]">
                  <li>
                    <strong className="text-white">Autonomia Tecnológica:</strong> Não depende de servidores caros para rodar a lógica; roda no cliente de forma veloz e escalável.
                  </li>
                  <li>
                    <strong className="text-white">UI Não-Oclusiva:</strong> Design de interface estritamente alinhado com as diretrizes do ecossistema de games (mais de 85% do espaço de tela desobstruído).
                  </li>
                  <li>
                    <strong className="text-white">Código Limpo & Tipado:</strong> Arquitetura modular separando motor, sintetizador sonoro, dados e componentes de interface.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#1b202b] border border-slate-700/80 rounded-lg font-mono text-[11px]">
                <div className="text-sky-400 font-bold mb-2">// FLUXO ARQUITETURAL</div>
                <div className="text-slate-300">
                  DOM (React 19 Shell) ──► GameEngine (Canvas 2D/3D Loop) ──► SoundManager (Web Audio Synth)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#262c3b] border border-[#3f4a64] p-3.5 rounded-lg">
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <span>GameEngine.ts (Core)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Gerencia entidades, colisão circular e segmentar, hitstop de 30–80ms, tremor de câmera (screenshake decrescente) e renderização do mascote Godot com técnica de squash & stretch.
                  </p>
                </div>

                <div className="bg-[#262c3b] border border-[#3f4a64] p-3.5 rounded-lg">
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>soundManager.ts (Synth)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Sintetizador procedural baseado em <code className="text-amber-300">AudioContext</code>. Gera ondas triangulares, dente-de-serra e buffers de ruído branco para tiros, impactos e arpeggios chiptune.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#262c3b] border border-[#3f4a64] rounded-lg">
                <h4 className="font-bold text-white mb-1">Entidades do Jogo (Analogias de Engenharia):</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300 mt-2 font-mono">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-700/60">NullPointer (Ágil)</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-700/60">MemoryLeak (Incha)</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-700/60">InfiniteLoop (Mira Laser)</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-700/60">Deadlock (Boss)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INSTALL' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Instruções passo a passo para testar, compilar e implantar este projeto em qualquer ambiente de computação em nuvem ou máquina local:
              </p>

              <div className="bg-[#171b24] border border-slate-800 rounded-lg p-3.5 font-mono text-xs">
                <div className="text-slate-500 mb-1"># 1. Clonar repositório</div>
                <div className="text-sky-300 mb-3">git clone https://github.com/seu-usuario/godot-node-survivors.git</div>

                <div className="text-slate-500 mb-1"># 2. Instalar dependências</div>
                <div className="text-sky-300 mb-3">npm install</div>

                <div className="text-slate-500 mb-1"># 3. Rodar em desenvolvimento (porta 3000)</div>
                <div className="text-emerald-400 mb-3">npm run dev</div>

                <div className="text-slate-500 mb-1"># 4. Compilar versão final de produção</div>
                <div className="text-amber-300">npm run build</div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400">
                💡 <strong>Dica de Implantação:</strong> A pasta <code className="text-sky-300 font-mono">/dist</code> resultante do comando de build é estática e pode ser implantada instantaneamente em Vercel, Netlify, Cloudflare Pages ou Google Cloud Run.
              </div>
            </div>
          )}

          {activeTab === 'MARKDOWN' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">
                  Snippet do README.md pronto para copiar e colar
                </span>
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded font-bold text-xs cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#141721] border border-slate-800 rounded-lg text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64">
                {rawMarkdownSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#323a4e] bg-[#1b202b] flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Licença MIT · Código Aberto & Livre
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Fechar Documentação
          </button>
        </div>
      </div>
    </div>
  );
};

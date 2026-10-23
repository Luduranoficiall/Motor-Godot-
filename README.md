<div align="center">

# 🤖 Godot: O Desafio dos Nós (*Engine Survivors*)

### *Uma experiência arcade imersiva de alta performance celebrando o motor Godot, arquitetura em nós e desenvolvimento web de última geração.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synth-9333EA?style=for-the-badge&logo=audio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-10B981?style=for-the-badge)](LICENSE)

[🎮 Testar Demo em Produção](https://ais-pre-l5jtb44w534rnr7f7lxyv2-322169913124.us-west2.run.app) · [🛠️ Ambiente de Desenvolvimento](https://ais-dev-l5jtb44w534rnr7f7lxyv2-322169913124.us-west2.run.app) · [📖 Documentação Interativa](#-arquitetura-do-projeto)

---

</div>

## 📌 Visão Executiva para Clientes & Parceiros

Este repositório apresenta uma aplicação web de entretenimento e demonstração técnica desenvolvida com os mais rigorosos padrões da indústria contemporânea. Combinando uma **simulação gráfica fluida a 60 FPS**, um **sintetizador de áudio procedural via Web Audio API** (sem dependência de arquivos de áudio externos) e uma interface reativa construída em **React 19** e **Tailwind CSS v4**, o projeto serve como vitrine para:

- **Desenvolvimento de Jogos Web & Rich Interactive Media**: Games executáveis direto no navegador em qualquer dispositivo (desktop, tablets e smartphones), sem downloads ou instaladores.
- **Engenharia de Performance Crítica**: Ciclo de vida desacoplado onde atualizações do React não bloqueiam o ciclo de renderização do Canvas.
- **Homenagem e Vitrine do Ecossistema Godot**: Demonstração das capacidades do motor Godot (usado em grandes sucessos como *Slay the Spire 2*, *Buckshot Roulette* e *Halls of Torment*), traduzindo conceitos de nós e árvores de cenas para mecânicas de sobrevivência viciantes.

---

## 🕹️ Funcionalidades do Jogo

| Mecânica | Detalhe Técnico | Benefício para o Usuário |
| :--- | :--- | :--- |
| **Robô Godot Procedural** | Desenhado 100% via código Canvas (olhos expressivos, antenas e propulsor de fogo). | Zero tempo de carregamento de texturas pesadas e estética idêntica à marca oficial. |
| **Modo 2D & 3D Vulkan** | Alternância em tempo real entre visão pixel-art e perspectiva 3D wireframe. | Flexibilidade visual e imersão estilizada ao toque de uma tecla. |
| **Árvore de Nós (Upgrades)** | 7 nós canônicos da Godot (`Node2D`, `Area2D`, `RayCast2D`, `GPUParticles2D`, `Timer`, `@export`, `Vulkan`). | Progressão roguelite rica, inspirando o jogador com analogias reais do motor. |
| **Inimigos & Telegrafia** | Bugs do mundo real (*NullPointer*, *Memory Leak*, *Infinite Loop*, *Deadlock*). | Telegrafia visual límpida (mira laser e ondas no chão) que premia a habilidade e esquiva com *Dash*. |
| **Sintetizador de Som Procedural** | Web Audio API com osciladores e ruídos calibrados (tiros, explosões, hits e trilha chiptune). | 0kb de áudio em rede, carregamento instantâneo e controle de mudo com 1 clique. |

---

## 🏗️ Arquitetura de Software

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Shell                       │
│  (TitleScreen, GameHUD, LevelUpModal, Pause, Vitrine)   │
└───────────────────────────┬────────────────────────────┘
                            │ Dispara eventos e upgrades
                            ▼
┌────────────────────────────────────────────────────────┐
│              GameEngine (Simulação 60 FPS)              │
│  - Input Buffering & Coyote Time                       │
│  - Move & Slide Physics                                │
│  - Detecção de Colisão Segmentada                      │
│  - Hitstop (30-80ms) & Camera Shake Decrescente        │
└───────────────────────────┬────────────────────────────┘
                            │ Renderiza via Canvas API
                            ▼
┌────────────────────────────────────────────────────────┐
│       HTML5 Canvas Viewport (Isolado do DOM React)     │
│  - Mascote Robô Godot Vetorial com Squash & Stretch    │
│  - Grade de Coordenadas e Eixos X/Y do Editor Godot   │
│  - Projéteis, Lasers e Partículas Pooladas             │
└────────────────────────────────────────────────────────┘
```

### 1. Desacoplamento React / Canvas
A `<canvas>` opera através de uma instância dedicada da classe `GameEngine`, mantida por `useRef`. Isso assegura que:
- O ciclo de animação `requestAnimationFrame` opere de forma ininterrupta;
- Mudanças de estado de HUD ou modais não provoquem *re-renders* indesejados no Canvas;
- O *delta time* seja estritamente limitado (`Math.min(rawDt, 0.05)`) contra problemas de *tunneling* de colisão.

### 2. Audio Engine Sintetizado
A classe `SoundManager` utiliza nós nativos `OscillatorNode`, `GainNode`, `BiquadFilterNode` e buffers de ruído gerados matematicamente em tempo de execução, garantindo áudio retro instantâneo, compatível com as políticas de autoplay modernas do Chrome, Safari e Edge.

---

## 🎮 Controles

| Ação | Teclado & Mouse | Toque (Mobile / Tablet) |
| :--- | :--- | :--- |
| **Mover Robô** | `W`, `A`, `S`, `D` ou `Setas Direcionais` | Toque & Arrastar no Viewport |
| **Disparo Primário** | `Espaço` ou `Clique Esquerdo` | Automático / Toque Direcional |
| **Esquiva (Dash c/ I-Frames)** | `Shift`, `E` ou `Clique Direito` | Botão dedicado `Dash [Shift]` na HUD |
| **Super Limpeza Vulkan** | Tecla `F` ou `Q` | Botão interativo `Vulkan [F]` |
| **Pausar / Ajustes** | Tecla `Esc` ou `P` | Botão de Pausa no canto superior direito |
| **Mudo / Áudio** | Ícone de Alto-Falante | Toque no ícone de volume |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v18.0.0 ou superior
- Gerenciador de pacotes **npm**, **yarn** ou **bun**

### Passo a Passo

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/seu-usuario/godot-node-survivors.git
   cd godot-node-survivors
   ```

2. **Instalar Dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse no seu navegador: `http://localhost:3000`

4. **Gerar Versão de Produção**:
   ```bash
   npm run build
   ```
   Os artefatos otimizados serão compilados no diretório `/dist`.

5. **Verificação de Tipos / Linter**:
   ```bash
   npm run lint
   ```

---

## 📂 Estrutura de Diretórios

```plaintext
├── index.html                 # Ponto de entrada HTML com metadados SEO e fontes
├── package.json               # Configurações de dependências e scripts do projeto
├── tsconfig.json              # Configurações rigorosas do compilador TypeScript
├── vite.config.ts             # Setup Vite com suporte a Tailwind v4 e React
├── src/
│   ├── main.tsx               # Bootstrap da aplicação React 19
│   ├── App.tsx                # Orquestrador do Game Shell e ciclo de estados
│   ├── index.css              # Camadas base de estilo e tema Godot
│   ├── types/
│   │   └── game.ts            # Tipagem completa de nós, estatísticas e entidades
│   ├── game/
│   │   └── GameEngine.ts      # Motor de simulação 60 FPS, física e renderização
│   ├── audio/
│   │   └── soundManager.ts    # Sintetizador Web Audio procedural (SFX + BGM)
│   ├── data/
│   │   └── godotShowcase.ts   # Catálogo e dados dos jogos e tecnologias Godot
│   └── components/
│       ├── TitleScreen.tsx    # Tela de título e lockup SVG
│       ├── GameHUD.tsx        # HUD perimetral de baixa oclusão (<15% da tela)
│       ├── LevelUpModal.tsx   # Inspetor de nós e seleção de melhorias
│       ├── PauseModal.tsx     # Painel de pausa, áudio e configurações
│       ├── GameOverModal.tsx  # Relatório de compilação e estatísticas
│       ├── VictoryModal.tsx   # Celebração de vitória e subida de produção
│       ├── ShowcaseModal.tsx  # Vitrine detalhada de sucessos do Godot
│       └── HowToPlayModal.tsx # Manual interativo com guia de controles e inimigos
└── README.md                  # Esta documentação principal
```

---

## 🌟 Vitrine de Jogos Godot Homenageados

O projeto inclui homenagens documentadas a mais de 10 jogos premiados da indústria desenvolvidos na Godot Engine:

- **Derrote a Torre 2 (*Slay the Spire 2*)** — *Mega Crit*
- **Roleta de Chumbo Grosso (*Buckshot Roulette*)** — *Mike Klubnika*
- **Bestas Cassete (*Cassette Beasts*)** — *Bytten Studio*
- **Salões do Tormento (*Halls of Torment*)** — *Chasing Carrots*
- **Até lá (*Until Then*)** — *Polychroma Games*
- **Usagi Shima** — *pank0*
- **PVKK** — *Bippinbits*
- **Koira** — *Studio Tolima*
- **ColdRidge** — *Frog Collective*
- **PASSEIO COM CACHORRO** — *Blender Studio*

---

## 🛡️ Licença & Propriedade Intelectual

Este projeto está licenciado sob os termos da **Licença MIT**, promovendo código aberto, transparência e reutilização livre.

O logotipo e a marca do robô Godot são marcas registradas de Juan Linietsky e Ariel Manzur, distribuídos sob a licença Creative Commons Attribution 3.0.

---

<div align="center">
  <sub>Criado com paixão e excelência em engenharia de software para clientes, parceiros e entusiastas de jogos web.</sub>
</div>

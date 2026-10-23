import { GodotShowcaseGame, NodeUpgrade, NodeType } from '../types/game';

export const GODOT_SHOWCASE_GAMES: GodotShowcaseGame[] = [
  {
    id: 'slay-the-spire-2',
    title: 'Derrote a Torre 2 (Slay the Spire 2)',
    developer: 'Mega Crítico (Mega Crit)',
    genre: 'Roguelike Deckbuilder',
    year: '2025/2026',
    highlight: 'Migrado para Godot após anos na Unity',
    description: 'A aguardada sequência do clássico dos construtores de baralhos foi reconstruída do zero no motor Godot, demonstrando a robustez do GDScript e C# para sistemas complexos de cartas e animações.',
    quote: '"Godot nos deu total liberdade, sem taxas surpresa e com um fluxo de trabalho absurdamente rápido."',
    color: '#38bdf8',
    icon: 'Sword'
  },
  {
    id: 'buckshot-roulette',
    title: 'Roleta de Chumbo Grosso (Buckshot Roulette)',
    developer: 'Mike Klubnika',
    genre: 'Suspense Psicológico / Tabuleiro Brutal',
    year: '2023/2024',
    highlight: 'Sensação mundial indie com visual retrô 3D',
    description: 'Um jogo de roleta russa com espingarda de calibre 12 em uma boate clandestina. Utiliza a renderização 3D estilizada e a iluminação atmosférica do Godot.',
    quote: '"O motor 3D do Godot entrega exatamente a textura analógica crua e a estabilidade que o jogo precisava."',
    color: '#ef4444',
    icon: 'Zap'
  },
  {
    id: 'cassette-beasts',
    title: 'Bestas Cassete (Cassette Beasts)',
    developer: 'Bytten Studio',
    genre: 'RPG de Coleção de Monstros',
    year: '2023',
    highlight: 'Fusão procedural de monstros e mundo aberto 2.5D',
    description: 'Colecione monstros incríveis e funda dois monstros quaisquer usando fitas cassete neste RPG em mundo aberto. Feito inteiramente com Godot 3 e portado para consoles!',
    quote: '"A arquitetura de nós do Godot tornou o sistema de fusão de sprites e estatísticas simples de compor."',
    color: '#f59e0b',
    icon: 'Disc'
  },
  {
    id: 'halls-of-torment',
    title: 'Salões do Tormento (Halls of Torment)',
    developer: 'Em Busca de Cenouras (Chasing Carrots)',
    genre: 'Sobrevivência Roguelite Retrô',
    year: '2023/2024',
    highlight: 'Milhares de inimigos simultâneos na tela a 60 FPS',
    description: 'Uma homenagem aos clássicos dos anos 90 como Diablo e Vampire Survivors. O Godot gerencia com maestria centenas de projéteis e milhares de monstros sem perda de desempenho.',
    quote: '"O pipeline 2D do Godot baseado em pixels é disparado o melhor do mercado atual."',
    color: '#a855f7',
    icon: 'Flame'
  },
  {
    id: 'until-then',
    title: 'Até lá (Until Then)',
    developer: 'Polychroma Games',
    genre: 'Aventura Narrativa Cinemática',
    year: '2024',
    highlight: 'Pixel art 2.5D emocionante e direção de arte soberba',
    description: 'Em um mundo que se recupera de uma catástrofe misteriosa, Mark navega a vida escolar e o desvelamento do tempo. Gráficos pixel art em cenários tridimensionais.',
    quote: '"A facilidade de misturar arte 2D com profundidade de câmera 3D no Godot deu vida à nossa visão poética."',
    color: '#06b6d4',
    icon: 'Heart'
  },
  {
    id: 'usagi-shima',
    title: 'Usagi Shima',
    developer: 'pank0',
    genre: 'Colecionador Relaxante Aconchegante',
    year: '2023',
    highlight: 'Sucesso mobile acolhedor e visual desenhado à mão',
    description: 'Decore uma ilha e seja visitado por dezenas de coelhinhos adoráveis. O sistema de interface gráfica e o suporte mobile do Godot garantem uma experiência serena.',
    quote: '"Como desenvolvedor solo, a interface visual do Godot me permitiu focar 100% na arte dos coelhos."',
    color: '#10b981',
    icon: 'Sparkles'
  },
  {
    id: 'pvkk',
    title: 'PVKK: Planetenverteidigungskanonenkommandant',
    developer: 'Bippinbits',
    genre: 'Simulador Tático de Bunker',
    year: 'Em breve',
    highlight: 'Cockpit 3D imersivo com dezenas de interruptores físicos',
    description: 'Opere um canhão de defesa planetária colossal de dentro de um bunker opressivo. Mostra o poder do renderizador Vulkan e materiais PBR do Godot 4.',
    quote: '"Godot 4 tem a fidelidade visual e a resposta de simulação que um cockpit tático exige."',
    color: '#f97316',
    icon: 'Shield'
  },
  {
    id: 'koira',
    title: 'Koira',
    developer: 'Estúdio Tolima / DON\'T NOD',
    genre: 'Aventura Poética Sem Palavras',
    year: '2025',
    highlight: 'Animações 2D quadro a quadro e trilha emotiva',
    description: 'Uma jornada calorosa sobre amizade com um cachorrinho em uma floresta mágica, totalmente animada à mão no motor Godot.',
    quote: '"O nó AnimationPlayer e a composição de nós permitiram uma narrativa fluida e artística."',
    color: '#ec4899',
    icon: 'Smile'
  },
  {
    id: 'coldridge',
    title: 'ColdRidge',
    developer: 'Coletivo de Sapos (Frog Collective)',
    genre: 'Estratégia e Exploração em Grade',
    year: '2024',
    highlight: 'Mecânicas elegantes de exploração e contratos',
    description: 'Guie exploradores pelas montanhas congeladas cumprindo contratos de corporações mineradoras.',
    quote: '"Construir grids lógicas com TileMaps do Godot economizou semanas de desenvolvimento."',
    color: '#6366f1',
    icon: 'Compass'
  },
  {
    id: 'walk-the-dog',
    title: 'PASSEIO COM CACHORRO',
    developer: 'Blender Studio',
    genre: 'Curta Interativo & Teste de Pipeline 3D',
    year: '2024',
    highlight: 'Integração direta e perfeita entre Blender e Godot',
    description: 'Projeto demonstrando o fluxo em tempo real de exportação glTF e assets direto da fundação Blender para o Godot 4.',
    quote: '"A compatibilidade nativa entre Blender e Godot redefine a iteração de artistas."',
    color: '#14b8a6',
    icon: 'Camera'
  }
];

export const GODOT_UPGRADES: Record<NodeType, NodeUpgrade> = {
  SIGNAL_EMITTER: {
    type: 'SIGNAL_EMITTER',
    name: 'Disparo de Sinal (Signal)',
    godotClass: 'Node2D',
    category: 'Arma',
    level: 1,
    maxLevel: 5,
    icon: 'Radio',
    description: 'Dispara pulsos de energia que se conectam aos glitches mais próximos.',
    lore: '"Em Godot, nós se comunicam sem acoplamento rígido usando o sistema de Sinais."',
    effectDescription: '+Cadência de tiro e +1 projétil simultâneo.'
  },
  COLLISION_ORBITER: {
    type: 'COLLISION_ORBITER',
    name: 'Escudo Orbital (Area2D)',
    godotClass: 'Area2D + CollisionShape2D',
    category: 'Defesa',
    level: 0,
    maxLevel: 5,
    icon: 'Shield',
    description: 'Invoca formas de colisão geométricas que orbitam o robô repelindo glitches.',
    lore: '"Detecte sobreposições de física sem calcular massa completa com Area2D."',
    effectDescription: '+1 Forma de colisão orbital e +raio de detecção.'
  },
  RAYCAST_SNIPER: {
    type: 'RAYCAST_SNIPER',
    name: 'Laser Contínuo (RayCast2D)',
    godotClass: 'RayCast2D',
    category: 'Arma',
    level: 0,
    maxLevel: 5,
    icon: 'Crosshair',
    description: 'Emite um feixe óptico perfurante na direção do movimento ou do cursor.',
    lore: '"Consulta rápida de linhas no espaço físico com resultados instantâneos."',
    effectDescription: '+Alcance, +dano por segundo e espessura do laser.'
  },
  GPU_PARTICLES: {
    type: 'GPU_PARTICLES',
    name: 'Nova Estelar (GPUParticles2D)',
    godotClass: 'GPUParticles2D',
    category: 'Arma',
    level: 0,
    maxLevel: 5,
    icon: 'Sparkles',
    description: 'Detona periodicamente uma onda expansiva de partículas aceleradas por GPU.',
    lore: '"Milhares de partículas processadas diretamente na GPU sem pesar a CPU."',
    effectDescription: 'Explosão radial a cada 4s que causa alto dano em área.'
  },
  YIELD_DILATION: {
    type: 'YIELD_DILATION',
    name: 'Dilatação Temporal (await / Timer)',
    godotClass: 'SceneTreeTimer',
    category: 'Utilidade',
    level: 0,
    maxLevel: 5,
    icon: 'Clock',
    description: 'Reduz a velocidade de todos os glitches em 35% através de time_scale.',
    lore: '"Controle o fluxo temporal do jogo pausando a árvore de cenas ou com timers assíncronos."',
    effectDescription: 'Desacelera inimigos e aumenta a janela de esquiva.'
  },
  EXPORT_BOOST: {
    type: 'EXPORT_BOOST',
    name: 'Otimização GDScript (@export)',
    godotClass: 'GDScript Compiler',
    category: 'Utilidade',
    level: 0,
    maxLevel: 5,
    icon: 'Code',
    description: 'Compila variáveis tipadas estaticamente, turbinando a velocidade e o dano.',
    lore: '"GDScript com tipagem estática opcional aumenta a performance em tempo de execução."',
    effectDescription: '+25% de Dano geral e +15% de Velocidade de movimento.'
  },
  VULKAN_BURST: {
    type: 'VULKAN_BURST',
    name: 'Renderizador Vulkan (Screen Clear)',
    godotClass: 'RenderingServer',
    category: 'Super',
    level: 0,
    maxLevel: 3,
    icon: 'Zap',
    description: 'Libera o poder total do pipeline gráfico, vaporizando glitches fracos.',
    lore: '"Com Vulkan e Direct3D 12 modernos, dê vida aos seus mundos gráficos."',
    effectDescription: 'Permite acionar o Super Ataque (Espaço/F) quando a barra carrega.'
  }
};

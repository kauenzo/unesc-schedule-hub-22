

# CC 2026/1 — Sistema de Horários UNESC

Aplicação web moderna, mobile-first, para visualização dos horários do curso de Ciência da Computação 2026/1.

## Design
- Visual jovem e moderno com cores vibrantes (gradientes azul/roxo)
- Mobile-first com cards empilhados no celular
- Dark mode por padrão (cara de app tech)
- Animações suaves nas transições e interações

## Estrutura

### Header
- Título "CC 2026/1 — Horários" com subtítulo "Ciência da Computação · UNESC"
- Navegação por abas: **Grade Completa**, **Por Turma**, **Busca**

### 1. Grade Completa
- Fases 1 a 8 em acordeões expansíveis
- Cada disciplina mostra: dia, nome, professor, sala/lab, modalidade
- Badge visual para aulas à distância
- Indicação de turma (T1/T2) quando aplicável

### 2. Grade por Turma
- Filtro rápido com chips: Todas · T1 · T2
- Fases sem turma (2, 4, 6, 8) aparecem sempre
- Cards de disciplina otimizados para scroll vertical

### 3. Busca
- Campo de busca em tempo real por disciplina, professor, sala/lab
- Filtros rápidos clicáveis:
  - **Dia da semana** (Segunda a Sábado) — múltipla seleção
  - **Modalidade** (Presencial / À Distância)
  - **Complemento** (NCC / NCA / NCI)
- Contador "X disciplinas encontradas"
- Highlight do texto buscado nos resultados
- Estado vazio amigável com ícone e mensagem
- Botão "Limpar filtros" visível quando filtros ativos

### 4. Detalhe da Disciplina
- Drawer/modal ao clicar em qualquer disciplina
- Mostra todos os dados: código, nome, professor, sala, laboratório, modalidade, dia, fase, turma e observações

## Dados
- JSON estático importado diretamente no código (arquivo enviado pelo usuário)
- Sem backend necessário

## Stack
- React + TypeScript + Tailwind CSS + shadcn/ui
- Dados 100% estáticos, sem banco de dados


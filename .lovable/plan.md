

# Melhorias no Sistema de Horarios

## 1. Trocar filtro "Por Turma" para "Por Fase"

A aba "Por Turma" sera substituida por "Por Fase". Em vez de filtrar por T1/T2/Todas, o usuario escolhe a fase (1 a 8) com chips clicaveis. Ao selecionar uma fase, exibe todas as disciplinas daquela fase (com suas turmas, se houver).

- Renomear componente `GradePorTurma` para `GradePorFase`
- Filtros: chips de 1 a 8 + "Todas"
- Ao selecionar uma fase, mostrar as disciplinas agrupadas por turma dentro daquela fase

## 2. "Sala nao informada" quando sala vazia

Onde `sala` e `laboratorio` forem ambos `null`, exibir "Sala nao informada" em vez de "---" no `DisciplinaCard` e no `DisciplinaDetail`.

- `DisciplinaCard`: alterar a logica de `local` para mostrar "Sala nao informada"
- `DisciplinaDetail`: no `DetailRow` de Sala, exibir "Sala nao informada" quando `sala` for null e `laboratorio` tambem for null

## 3. Funcionalidade "Minhas Aulas"

### 3.1 Logica de selecao e persistencia
- Criar hook `useMinhasAulas` que gerencia um array de disciplinas salvas no `localStorage`
- Cada disciplina sera identificada de forma unica por `codigo + fase + turma + dia_semana` (para cobrir duplicatas)
- Funcoes: `addAula`, `removeAula`, `isAulaSalva`, `minhasAulas`

### 3.2 Botao de adicionar/remover nos cards e no drawer de detalhe
- No `DisciplinaDetail` (drawer), adicionar botao "Adicionar as minhas aulas" / "Remover das minhas aulas"
- Ao adicionar pela primeira vez, mostrar um aviso (toast) informando que os dados sao salvos apenas no navegador local

### 3.3 Nova aba "Minhas Aulas"
- Quarta aba na navegacao principal (icone de estrela ou bookmark)
- Exibe as aulas salvas agrupadas por dia da semana (Segunda a Sabado)
- **Proxima aula em destaque**: calcula qual e a proxima aula com base no dia atual da semana e a exibe primeiro, com um card destacado visualmente (borda colorida, label "Proxima aula")
- Estado vazio amigavel quando nenhuma aula estiver salva
- Grid de tabs muda de 3 para 4 colunas

## 4. Aviso de dados possivelmente desatualizados

- Na home (abaixo do header), adicionar um banner/alert discreto com icone de alerta: "As informacoes exibidas podem estar desatualizadas. Consulte a secretaria para confirmar."
- Na aba "Minhas Aulas", incluir uma nota visual informando que os dados sao salvos apenas neste navegador

## Detalhes tecnicos

### Arquivos modificados
- `src/pages/Index.tsx` - adicionar 4a aba, banner de aviso, passar hook de minhas aulas
- `src/components/GradePorTurma.tsx` - renomear/reescrever para `GradePorFase.tsx` com filtro por fase
- `src/components/DisciplinaCard.tsx` - "Sala nao informada", prop opcional para botao de favoritar
- `src/components/DisciplinaDetail.tsx` - botao de adicionar/remover aula, receber callbacks do hook
- `src/components/MinhasAulas.tsx` (novo) - aba com aulas salvas, destaque da proxima aula
- `src/hooks/useMinhasAulas.ts` (novo) - hook com localStorage para persistencia

### Estrutura do localStorage
```text
Chave: "minhas-aulas"
Valor: JSON array de objetos DisciplinaComContexto
```

### Logica de "proxima aula"
```text
1. Obter dia da semana atual (0=Domingo ... 6=Sabado)
2. Mapear para os nomes: Segunda=1, Terca=2, ... Sabado=6
3. Encontrar a aula cujo dia e o mais proximo (hoje ou o proximo dia util)
4. Se hoje for Domingo, a proxima e Segunda
5. Se nao houver aula hoje, pegar o proximo dia com aula
```

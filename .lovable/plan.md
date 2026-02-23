

# Ajuste de Coordenadas Padrao do Minimapa

## O que muda

As coordenadas x,y percentuais padrao de cada sala no `calculateRoomPositions()` serao ajustadas para que o layout inicial do minimapa corresponda ao da imagem de referencia fornecida.

## Diferencas Identificadas (Imagem vs Layout Atual)

A imagem mostra um layout mais vertical, com as seguintes diferencas principais:

1. **MASP** - Posicionado abaixo da linha horizontal da Paulista, nao sobre ela. Existe um ponto de juncao na linha horizontal, e MASP fica abaixo como um no central proeminente.
2. **CÉU da Cidade** - Mais a esquerda (centro-esquerda, nao centro)
3. **Antena** - Mantida no canto superior direito
4. **TETO do MASP** - Levemente a esquerda do centro
5. **Colegio** - Parece estar mais abaixo que a linha da Paulista, alinhado com MASP
6. **Livraria** - Posicionada mais ao centro-inferior (nao canto direito)
7. **Tunel** - Mais a esquerda na base

## Novas Coordenadas Propostas

```text
ANTES (atual)                         DEPOIS (conforme imagem)
--------------------------            --------------------------
ceu_cidade:    50, 8                  32, 5
antena:        88, 8                  85, 5
teto_masp:     50, 22                 42, 17
shopping:      10, 38                 12, 32
p_oeste:       30, 38                 28, 32
masp:          50, 38                 45, 47
p_leste:       70, 38                 65, 32
colegio:       90, 38                 85, 47
rua_augusta:   22, 58                 18, 52
9j_norte:      50, 58                 45, 58
brigadeiro:    78, 58                 78, 52
cinema:        14, 78                 10, 68
santos:        30, 78                 32, 72
9j_sul:        50, 78                 42, 75
distrito_it:   78, 78                 72, 68
tunel:         50, 92                 25, 90
livraria:      88, 92                 50, 90
```

## Mudancas Visuais Principais

- A **Avenida Paulista** (horizontal) sobe para y:32% com SHP, P.O, P.L mantidos na linha
- **MASP** desce para y:47%, ficando como no central proeminente conectado diagonalmente a P.O e P.L
- **Colegio** desce para y:47% alinhado com MASP no lado direito
- **Tunel** e **Livraria** reposicionados na base inferior
- Layout geral mais compacto verticalmente no topo e mais espalhado na base

## Detalhes Tecnicos

### Arquivo modificado
- `public/avenida-paulista.html`

### Funcao modificada
- `Renderer.calculateRoomPositions()` (linhas ~5083-5110) - apenas os valores x,y no objeto `positions` serao alterados

### Impacto
- Nenhuma logica de jogo afetada
- Apenas a posicao visual padrao dos nos do minimapa muda
- Posicoes customizadas do jogador (drag-and-drop salvas no localStorage) continuam funcionando normalmente - so serao afetadas ao clicar "resetar posicoes"
- Conexoes (ruas) se redesenham automaticamente com base nas novas posicoes


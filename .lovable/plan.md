## Sistema de Golpes Aleatorios e Agressividade dos NPCs

### O que muda

Cada NPC ganha uma lista de **golpes** (ataques e defesas) com nomes tematicos e valores variados, alem de um parametro de **agressividade** que controla a frequencia com que atacam.

### Como funciona

**Golpes**: Cada NPC tera um array `moves` com golpes de ataque e defesa. Quando um NPC ataca ou defende, um golpe aleatorio e escolhido, e seu valor substitui o `attackPower`/`defensePower` fixo naquele combate. Os valores serao medianos (proximos do valor base atual), variando para cima e para baixo.

**Agressividade**: O parametro `aggression` (0.0 a 1.0) substitui os valores fixos de 40% (inimigos) e 50% (aliados) como chance de atacar por turno.

### Tabela de NPCs e Golpes

```text
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| NPC           | ATK  | DEF    | GOLPES DE ATAQUE                            | GOLPES DE DEFESA                            |
|               | base | base   | (nome / dano)                               | (nome / valor)                              |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Feiticeiro    |  12  |   8    | Raio Arcano (10), Chama Mistica (14),       | Barreira Magica (7), Escudo Runa (9),       |
|               |      |        | Explosao Eterea (16), Toque Sombrio (8)     | Manto Arcano (11)                           |
| Agressiv: 0.35|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Aguia         |  18  |   4    | Mergulho Rasante (16), Garras Afiadas (20), | Esquiva Aerea (3), Voo Evasivo (5),         |
|               |      |        | Bico de Aco (14), Ataque Celeste (22)       | Penas de Ferro (6)                          |
| Agressiv: 0.50|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Bombardeador  |  20  |   6    | Bomba de Gas (18), Granada Toxica (22),     | Colete Reforçado (5), Esquiva Tatica (7),   |
|               |      |        | Chuva Quimica (24), Estilhaco (16)          | Fumaca Protetora (8)                        |
| Agressiv: 0.45|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Bruxa         |  25  |  15    | Maldição Sombria (22), Raio do Portal (28), | Escudo das Trevas (13), Campo de Força (17),|
|               |      |        | Toque da Morte (30), Feitiço Obscuro (20)   | Aura Negra (15), Manto Dimensional (18)     |
| Agressiv: 0.55|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Demonio       |  35  |  20    | Chamas Infernais (32), Garra Demoníaca (38),| Pele de Lava (18), Escudo Infernal (22),    |
|               |      |        | Rugido Abissal (30), Fúria do Abismo (40)   | Sombra Protetora (20), Aura do Caos (24)    |
| Agressiv: 0.60|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Coruja (ally) |   8  |   3    | Bicada Rapida (6), Garras Noturnas (10),    | Voo Silencioso (2), Penas Magicas (4),      |
|               |      |        | Ataque Surpresa (9), Rasante Lunar (7)      | Esquiva Noturna (5)                         |
| Agressiv: 0.50|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
| Cachorro(ally)|   6  |   2    | Mordida Feroz (5), Investida (7),           | Esquiva Agil (1), Rosnar (3),               |
|               |      |        | Patada (4), Salto Selvagem (8)              | Recuar Esperto (4)                          |
| Agressiv: 0.60|      |        |                                             |                                             |
+---------------+------+--------+---------------------------------------------+---------------------------------------------+
```

Todos os valores sao ajustaveis. O jogador continua com ataque/defesa fixos (baseados em itens).

### Detalhes tecnicos

**1. Estrutura de dados** -- Adicionar a cada NPC em `GameState.characters`:

```javascript
feiticeiro: {
  // ... campos existentes ...
  aggression: 0.35,
  moves: {
    attack: [
      { name: 'Raio Arcano', power: 10 },
      { name: 'Chama Mistica', power: 14 },
      { name: 'Explosao Eterea', power: 16 },
      { name: 'Toque Sombrio', power: 8 }
    ],
    defense: [
      { name: 'Barreira Magica', power: 7 },
      { name: 'Escudo Runa', power: 9 },
      { name: 'Manto Arcano', power: 11 }
    ]
  }
}
```

**2. processNPCAttacks** -- Substituir `char.attackPower` por um golpe aleatorio escolhido de `char.moves.attack`, e `0.4` por `char.aggression`. Usar o `defensePower` do defensor tambem de forma aleatoria se ele tiver `moves.defense`. O nome do golpe aparece no modal e no log.

**3. processAllyAttacks** -- Mesma logica: escolher golpe aleatorio de `ally.moves.attack`, usar `ally.aggression` no lugar de `0.5`.

**4. Actions.attack (jogador atacando)** -- Quando o jogador ataca, o defensor usa um golpe de defesa aleatorio em vez do `defensePower` fixo.

**5. Modal de combate** -- Mostrar o nome do golpe usado no card do atacante/defensor (ex: "Ataque: Garras Afiadas (20)").

**6. Calculo de dano** -- Formula permanece `Math.max(1, attackMove.power - defenseMove.power)`.
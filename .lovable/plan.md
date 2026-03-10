

## Bug: Personagens fantasmas nunca aparecem (alucinações nível 2+)

### Causa raiz

Os thresholds para nível 2 são **praticamente impossíveis** de atingir em gameplay normal:

- **Nível 1**: HP < 30% **OU** Energy < 20 → fácil de atingir
- **Nível 2**: HP < 20% **E** Energy < 15 → precisa ter HP < 20 **e** Energy < 15 ao mesmo tempo
- **Nível 3**: HP < 10% **E** Energy < 10 → quase impossível

O problema é o operador **AND** (`&&`). Na prática, quando o HP está abaixo de 20%, o jogador já morreu em combate ou está prestes a morrer. E energia abaixo de 15 é raro porque comida/café são abundantes. A janela onde ambos coexistem é minúscula — o jogador morre ou come algo antes de experimentar o nível 2.

### Fix proposto

Relaxar os thresholds e trocar AND por OR nos níveis 2 e 3:

```js
// Antes (quase impossível):
if (hpPerc < 10 && energy < 10) return 3;
if (hpPerc < 20 && energy < 15) return 2;
if (hpPerc < 30 || energy < 20) return 1;

// Depois (alcançável):
if (hpPerc < 15 || energy < 8)  return 3;
if (hpPerc < 25 || energy < 15) return 2;
if (hpPerc < 40 || energy < 25) return 1;
```

Isso garante:
- **Nível 1** (texto surreal + blur): HP < 40 ou Energy < 25 — comum em mid-game
- **Nível 2** (NPCs/itens fantasmas): HP < 25 ou Energy < 15 — alcançável após combates difíceis
- **Nível 3** (saídas falsas + logs mentirosos): HP < 15 ou Energy < 8 — raro mas possível

Mudança de 3 linhas, sem alterar nenhuma outra lógica.


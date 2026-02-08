
## Plano: Atualizar Hipnodisco para Impedir Hipnotização de Aliados

### Status Atual
A função `hipnodisco` já inclui um filtro `!c.isAlly` na linha 2545 que previne hipnotizar aliados. No entanto, é importante garantir que:

1. Aliados criados por outras rotas (ex: animação de itens com Hipnodisco → criação de novo aliado) nunca possam ser hipnotizados novamente
2. O atributo `immuneToHypnosis` seja exclusivo para Bruxa e Demônio
3. A lógica seja clara e defensiva contra edge cases

### Mudanças Necessárias

**Arquivo**: `public/avenida-paulista.html`

#### 1. Adicionar `immuneToHypnosis: true` ao Demônio e Bruxa
- **Demônio** (linha ~1482-1495): Adicionar `immuneToHypnosis: true`
- **Bruxa** (linha ~1468-1481): Adicionar `immuneToHypnosis: true`

**Motivo**: Criar uma camada adicional de proteção explícita. Mesmo que a lógica de aliados proteja na prática, este atributo deixa a intenção clara no código: "estes bosses não podem NUNCA ser hipnotizados".

#### 2. Melhorar Filtro no `hipnodisco`
**Função** (linha ~2544-2546):

Atual:
```javascript
Object.values(GameState.characters).forEach(c => {
  if (c.id !== 'player' && c.id !== 'feiticeiro' && c.location === playerRoom && c.isAlive && !c.isAlly) {
    targets.push({ type: 'enemy', id: c.id, name: `⚔️ ${c.name} (hipnotizar)` });
  }
});
```

Novo (adicionar verificação de `immuneToHypnosis`):
```javascript
Object.values(GameState.characters).forEach(c => {
  if (c.id !== 'player' && c.id !== 'feiticeiro' && 
      c.location === playerRoom && c.isAlive && !c.isAlly &&
      !c.immuneToHypnosis) {  // Novo: bloquear imunes
    targets.push({ type: 'enemy', id: c.id, name: `⚔️ ${c.name} (hipnotizar)` });
  }
});
```

#### 3. Defesa Extra: Validação ao Executar (linha ~2590-2610)
Se o alvo for inimigo, verificar se é imune antes de executar:

```javascript
const enemy = GameState.characters[targetId];
if (enemy && enemy.location === playerRoom && enemy.isAlive && !enemy.isAlly) {
  // Defesa em profundidade
  if (enemy.immuneToHypnosis) {
    return {
      success: false,
      message: `O HIPNODISCO gira, mas ${enemy.name} resiste! Sua mente é forte demais para ser controlada!`,
      consumed: false
    };
  }
  // ... resto da lógica de hipnotizar
}
```

### Por Que Essas Mudanças Funcionam

| Cenário | Proteção |
|---------|----------|
| Bruxa/Demônio aparecem no início | `immuneToHypnosis: true` os protege |
| Alguém tentar hipnotizar um aliado | `!c.isAlly` filtra na coleta de alvos |
| Bruxa/Demônio se tornarem aliados (futuro) | `immuneToHypnosis` ainda previne hipnose |
| Bug raro: inimigo com `isAlly=true` mas não é aliado | A defesa dupla captura |

### Testes Pós-Implementação
1. ✅ Hipnodisco com Bruxa na mesma sala → não aparece opção de hipnotizá-la
2. ✅ Hipnodisco com Demônio (se summonado) → não aparece opção de hipnotizá-lo
3. ✅ Hipnodisco em aliado qualquer → não aparece opção
4. ✅ Se bug/hack tentar usar em Bruxa/Demônio → mensagem de resistência, item não consumido
5. ✅ Hipnodisco continua funcionando em Bombardeador, Cachorro, Águia, etc.

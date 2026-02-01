
# Plano: Corrigir Movimentacao de NPCs e Escudo da Bruxa

## Problemas Identificados

### 1. Cachorro no Ceu da Cidade
O Cachorro tem `canFly: false`, mas conseguiu chegar no "Ceu da Cidade" porque:

- A sala `ceu_cidade` tem `requiresFlight: false` (deveria ser `true`)
- A funcao `processNPCMovement` verifica `requiresFlight`, mas como a sala esta configurada como `false`, a verificacao nao bloqueia nada

### 2. Ataque com Escudo Ativo
O escudo de forca (`forceShieldDown`) so bloqueia o PLAYER de entrar no Teto do MASP. Os aliados:

- Podem entrar no Teto do MASP livremente (NPCs ignoram o escudo)
- Podem atacar a Bruxa mesmo com o escudo ativo (nenhuma verificacao em `processAllyAttacks`)

---

## Solucao

### Alteracao 1 - Adicionar `requiresFlight: true` apenas no Ceu da Cidade

**Arquivo:** `public/avenida-paulista.html`

**Linha ~908:** Alterar apenas a sala `ceu_cidade`:

```javascript
ceu_cidade: {
  id: 'ceu_cidade',
  name: 'Ceu da Cidade',
  ...
  requiresFlight: true  // Mudar de false para true
}
```

**Nota:** O Teto do MASP permanece com `requiresFlight: false` - nao precisa voar para chegar la.

### Alteracao 2 - Bloquear NPCs de entrar no Teto do MASP quando escudo ativo

**Arquivo:** `public/avenida-paulista.html`

**Funcao `processNPCMovement` (~linha 2001-2006):** Adicionar verificacao do escudo de forca:

```javascript
const validExits = exits.filter(exitId => {
  const targetRoom = GameState.rooms[exitId];
  // Personagem nao pode voar e sala requer voo
  if (targetRoom.requiresFlight && !char.canFly) return false;
  // Escudo de forca bloqueia acesso ao teto do MASP
  if (exitId === 'teto_masp' && !GameState.forceShieldDown) return false;
  return true;
});
```

### Alteracao 3 - Aliados nao atacam Bruxa enquanto escudo ativo

**Arquivo:** `public/avenida-paulista.html`

**Funcao `processAllyAttacks` (~linha 2092-2096):** Filtrar a Bruxa enquanto escudo ativo:

```javascript
const enemiesInRoom = Object.values(GameState.characters).filter(
  c => c.id !== 'player' && 
       c.location === ally.location && 
       c.isAlive && 
       !c.isAlly &&
       // Bruxa protegida pelo escudo de forca
       !(c.id === 'bruxa' && !GameState.forceShieldDown)
);
```

---

## Resumo das Alteracoes

| Local | Alteracao |
|-------|-----------|
| Linha ~908 | `ceu_cidade.requiresFlight = true` |
| Funcao `processNPCMovement` | Bloquear NPCs de entrar no `teto_masp` se escudo ativo |
| Funcao `processAllyAttacks` | Nao atacar Bruxa se escudo ativo |

## Resultado Esperado

1. Cachorro e outros NPCs sem voo nao podem mais ir para o Ceu da Cidade
2. O Teto do MASP continua acessivel a pe (nao precisa voar)
3. Nenhum NPC (inimigo ou aliado) pode entrar no Teto do MASP enquanto o escudo estiver ativo
4. Aliados nao atacam a Bruxa enquanto o escudo de forca estiver ativo
5. Apos o Feiticeiro remover o escudo, aliados poderao ir ao Teto e atacar a Bruxa

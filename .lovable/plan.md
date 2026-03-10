

## Implementar conceito de Sala Pai/Filha

### Conceito
Adicionar uma propriedade `parentRoom` nas salas filhas e uma propriedade `childRooms` nas salas pai. Quando a bomba explodir em uma sala pai, todas as filhas também são destruídas. Se explodir numa filha, apenas ela é afetada.

### Relações
- **MASP** (`masp`) → filhas: `teto_masp`, `subsolo_masp`
- **Colégio** (`colegio`) → filha: `antena`

### Mudanças em `public/avenida-paulista.html`

**1. Adicionar propriedades nas definições de ROOMS_DATA (~linhas 2907-2961)**

```js
// No objeto masp:
childRooms: ['teto_masp', 'subsolo_masp'],

// No objeto teto_masp:
parentRoom: 'masp',

// No objeto subsolo_masp:
parentRoom: 'masp',

// No objeto colegio:
childRooms: ['antena'],

// No objeto antena:
parentRoom: 'colegio',
```

**2. Expandir a lógica de explosão (~linhas 7750-7800)**

Após determinar `bombLocation`, calcular a lista de salas afetadas:

```js
// Determinar todas as salas afetadas
const affectedRooms = [bombLocation];
const bombRoom = GameState.rooms[bombLocation];

// Se é sala pai, incluir filhas
if (bombRoom.childRooms) {
  bombRoom.childRooms.forEach(childId => affectedRooms.push(childId));
}
// Se é sala filha E a bomba está no pai, já coberto acima
// Filha sozinha NÃO propaga para pai (apenas pai → filhas)
```

Depois, substituir todas as checagens `=== bombLocation` por `affectedRooms.includes(...)`:
- Coleta de itens na sala (linha 7756)
- Coleta de personagens (linha 7760)
- Check se player está na zona (linha 7764)
- Matar personagens (linha 7768)
- Destruir itens (linha 7786)
- Transformar salas em ruína (linha 7793) — iterar sobre cada sala afetada

**3. Atualizar o modal de resumo**

Listar todas as salas destruídas no modal (não só uma), ex: "A bomba explodiu no MASP! O Teto do MASP e o Subsolo do MASP também foram destruídos!"

### Resultado
Quando a bomba explodir no MASP, o Teto e o Subsolo também viram ruínas e tudo dentro deles é destruído. Quando explodir no Colégio, a Antena também é destruída. Explosão numa sala filha afeta apenas ela mesma.


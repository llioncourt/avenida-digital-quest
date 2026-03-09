

## Portraits de Combate — Sistema com Triplo Fallback

### Conceito
Cada combat card ganha um retrato do personagem no topo. A imagem é carregada dinamicamente com base no personagem + golpe usado. Sistema funciona offline sem quebrar nada.

### Convenção de nomes dos arquivos
```text
portraits/XX_charId_moveName.webp
Exemplo: 02_feiticeiro_feitico-obscuro.webp
         01_player_neutro.webp
```
O move name é normalizado: lowercase, espaços→hífens, acentos removidos.

### Triplo Fallback (via `<img>` com `onerror` encadeado)

1. **Imagem específica**: `portraits/XX_charId_moveName.webp` — personagem + golpe exato
2. **Versão neutra**: `portraits/XX_charId_neutro.webp` — personagem em pose padrão
3. **Placeholder misterioso**: Silhueta CSS pura (gradiente escuro + ícone `?`) — nunca quebra, sem dependência de arquivo

Se offline e nenhuma imagem cacheada, o `onerror` dispara e cai direto no placeholder CSS. Zero impacto.

### Mapeamento de IDs → prefixo numérico

```javascript
const PORTRAIT_MAP = {
  player: '01', feiticeiro: '02', aguia: '03',
  bombardeador: '04', bruxa: '05', demonio: '06',
  coruja: '07', cachorro: '08', vendedor: '09'
};
```

### Namespace `Portraits` (~40 linhas)

- `normalizeMoveName(name)` — remove acentos, lowercase, espaços→hífens
- `getCharIdFromName(displayName)` — extrai o char ID do `combatResult.attackerId` / `targetId`
- `buildUrl(charId, moveName)` — monta URL `portraits/XX_charId_moveName.webp`
- `createPortraitElement(charId, moveName)` — retorna um `<div>` com `<img>` e fallbacks encadeados via `onerror`, placeholder final é CSS puro

### Integração no `CombatModal.showStats()`

No render de cada card (attacker e defender), antes das linhas de stats, inserir o portrait no topo:
- Extrair `charId` do `combatResult.attackerId` / `combatResult.targetId`
- Extrair `moveName` do `attackerData.moveName` (ataque) ou `defenderData.moveName` (defesa)
- Player quando ataca não tem `moveName` → usa `neutro`
- Chamar `Portraits.createPortraitElement()` e inserir como primeiro filho do card

### CSS (~25 linhas)

```css
.combat-portrait {
  width: 100%; height: 160px;
  border-radius: 8px 8px 0 0;
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  width: calc(100% + 3rem);
  overflow: hidden; position: relative;
}
.combat-portrait img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: top center;
}
.combat-portrait-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; opacity: 0.5;
}
```

Portrait aparece com fade-in sutil quando carrega. Cards ganham visual moderno tipo "card de personagem de RPG".

### Animação de entrada
O portrait faz um leve `scale(1.05)→scale(1)` ao aparecer, dando sensação cinematográfica.

### Escopo
- ~70 linhas JS + ~25 linhas CSS
- Tudo autocontido no HTML
- Não quebra nada offline — fallback gracioso
- Apenas 2 imagens existem hoje na pasta, o resto cairá no placeholder misterioso até serem adicionadas


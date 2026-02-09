
## Plano: Melhorar Crawl da Intro (Velocidade, Justificação, Parágrafos, Música)

### Problemas Identificados

1. **Velocidade do crawl**: Atualmente 60s, precisa ser 40% mais lento (84s)
2. **Alinhamento**: `text-align: center` precisa mudar para `text-align: justify`
3. **Parágrafos**: Texto precisa ser reorganizado em 3 blocos com espaçamento
4. **Música lenta não funciona**: `MusicSystem.setSpeed(0.7)` define a propriedade, mas `scheduleNotes()` nunca a usa - bug!

---

### Mudanças Necessárias

**Arquivo**: `public/avenida-paulista.html`

#### 1. CSS: Justificar Texto (linha ~1000)
```css
#intro-crawl {
  ...
  text-align: justify;  /* era center */
  ...
}
```

#### 2. Animação: 40% Mais Lenta (linha ~4568)
```javascript
// Atual: 60s → Novo: 84s (60 * 1.4 = 84)
crawl.style.animation = 'star-wars-crawl 84s linear forwards';
```

#### 3. Safety Timeout Atualizado (linha ~4578)
```javascript
// Atualizar de 65000ms para 90000ms (84s + margem)
this.safetyTimeout = setTimeout(() => { ... }, 90000);
```

#### 4. Corrigir MusicSystem.scheduleNotes (linhas 2065-2083)
Aplicar `playbackSpeed` ao agendar notas:

```javascript
scheduleNotes: function() {
  if (!this.isLoaded || !SoundSystem.audioCtx) return;
  
  const ctx = SoundSystem.audioCtx;
  this.startTime = ctx.currentTime;
  const speed = this.playbackSpeed || 1.0;  // NOVO
  
  this.notes.forEach(note => {
    // Dividir o tempo pela velocidade (0.7 = mais lento)
    this.playNote(
      note.n, 
      this.startTime + (note.t / speed),  // NOVO
      note.d / speed,                      // NOVO
      note.v
    );
  });
  
  // Agendar loop com duração ajustada
  if (this.isPlaying) {
    this.loopTimeoutId = setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleNotes();
      }
    }, ((this.duration / speed) + 0.5) * 1000);  // NOVO
  }
}
```

#### 5. Inicializar playbackSpeed (linha ~1914)
Adicionar no objeto MusicSystem:
```javascript
playbackSpeed: 1.0,  // NOVO: velocidade padrão
```

#### 6. Reorganizar Texto em 3 Parágrafos (linhas 4511-4529)

**Texto atual**: 8 parágrafos curtos  
**Texto novo**: 3 parágrafos + título + finalização, com linhas vazias para cadência

```javascript
storyText: `
AVENIDA PAULISTA

Há muito tempo, nas ruas movimentadas de São Paulo, uma terrível BRUXA tomou posse do MASP, o icônico museu de arte da Avenida Paulista. Com seus poderes arcanos, ela pretende pronunciar QUATRO PALAVRAS MÁGICAS para abrir um portal dimensional e invocar forças das trevas sobre a cidade.


Criaturas sobrenaturais agora vagam pelas ruas. Um DEMÔNIO foi avistado nas sombras. O FEITICEIRO se esconde no Túnel aguardando o anoitecer. Mas nem tudo está perdido. Aliados improváveis podem ser encontrados - uma CORUJA sábia, um fiel CACHORRO CARAMELO, e outros heróis urbanos.


Artefatos místicos estão espalhados pela cidade. Uma ESPADA lendária. Um ESCUDO ancestral. E um LIVRO que contém o segredo para converter as forças do mal. Você é a última esperança. Explore a cidade, reúna aliados, encontre armas e derrote a Bruxa antes que ela complete seu ritual...


O destino de São Paulo está em suas mãos.
`
```

**Nota**: Os `\n\n\n` (linhas triplas vazias) entre parágrafos criam espaçamento visual extra durante o crawl.

---

### Resumo das Alterações

| Mudança | Local | De | Para |
|---------|-------|----|----|
| Alinhamento | CSS linha ~1000 | `center` | `justify` |
| Duração | JS linha ~4568 | 60s | 84s |
| Safety timeout | JS linha ~4578 | 65000ms | 90000ms |
| playbackSpeed init | JS linha ~1914 | (não existia) | `1.0` |
| scheduleNotes | JS linhas ~2065-2083 | ignora velocidade | aplica `/speed` |
| Texto | JS linhas ~4511-4529 | 8 parágrafos | 3 blocos + espaço |

---

### Testes Pós-Implementação

1. Abrir o jogo e observar a intro
2. Verificar se o texto está justificado (bordas alinhadas)
3. Confirmar que o crawl demora ~84 segundos
4. Verificar música tocando mais lenta durante a intro
5. Após pular/terminar intro, música deve voltar a velocidade normal
6. Confirmar 3 blocos de texto com espaçamento visual claro

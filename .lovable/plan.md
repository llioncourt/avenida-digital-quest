
# Plano: Correções de UI - Text Crawl e Log Panel

## Problemas Identificados

1. **Text Crawl "não vai pra dentro"**: A animação Star Wars não está criando o efeito de perspectiva 3D corretamente (o texto deveria parecer subir e afastar-se para o horizonte)
2. **Log "explodindo o card"**: O texto do log está ultrapassando os limites do card container
3. **Remover 1ª tela**: Verificado que a antiga tela de início já foi removida - o sistema agora inicia direto no IntroSystem

---

## Correções Técnicas

### 1. Corrigir Text Crawl (Efeito Star Wars)

**Problema**: A perspectiva atual não está criando o efeito 3D adequado de texto indo "para dentro" da tela.

**Solução**: Ajustar o CSS do `#intro-container` e `#intro-crawl` para criar o efeito clássico Star Wars:

```css
#intro-container {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 10000;
  overflow: hidden;
  /* Perspectiva mais agressiva para efeito 3D */
  perspective: 400px;
  perspective-origin: 50% 40%; /* Ponto de fuga mais alto */
}

#intro-crawl {
  position: absolute;
  width: 90%;
  left: 5%;
  bottom: 0;
  /* Transformação 3D para simular inclinação */
  transform-style: preserve-3d;
  transform: rotateX(45deg) translateZ(0); /* Mais inclinado */
  transform-origin: 50% 100%; /* Origem na base */
  animation: star-wars-crawl 60s linear forwards;
  text-align: center;
  color: var(--accent-gold);
  font-size: 1.8rem;
  line-height: 1.8;
}

@keyframes star-wars-crawl {
  0% { 
    transform: rotateX(45deg) translateY(0);
    opacity: 1;
  }
  100% { 
    transform: rotateX(45deg) translateY(-300vh);
    opacity: 1;
  }
}
```

### 2. Corrigir Log Panel (Overflow)

**Problema**: O `#log-panel` não está contendo corretamente o conteúdo interno.

**Solução**: Adicionar `overflow: hidden` ao panel e garantir que o container interno respeite os limites:

```css
#log-panel {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid var(--accent-blue);
  max-height: 150px;
  flex-shrink: 0;
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden; /* Impedir que conteúdo vaze */
  display: flex;
  flex-direction: column;
}

#log-container {
  flex: 1;
  min-height: 0; /* Importante para flex children */
  max-height: 100%; /* Respeitar o pai */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

.log-entry {
  padding: 0.2rem 0;
  border-bottom: 1px solid var(--border-color);
  overflow-wrap: break-word; /* Quebrar palavras longas */
}
```

---

## Arquivo a Modificar

| Arquivo | Alterações |
|---------|------------|
| `public/avenida-paulista.html` | CSS do text crawl e log panel |

---

## Ordem de Implementação

1. Corrigir CSS do `#intro-container` (perspective mais forte)
2. Corrigir CSS do `#intro-crawl` (transform 3D correto, animação ajustada)
3. Corrigir CSS do `#log-panel` (overflow hidden, display flex)
4. Corrigir CSS do `#log-container` (min-height: 0, word-wrap)
5. Corrigir CSS do `.log-entry` (overflow-wrap)

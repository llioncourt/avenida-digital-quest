

# Plano: Transformar Minimapa em Estilo de Mapa de Ruas

## Problema Atual

O minimapa atual usa "nodes" (caixinhas com texto) conectados por linhas finas, parecendo um grafo/diagrama. O usuário quer um visual que pareça um mapa de cidade real com ruas.

---

## Conceito Visual

```text
Atual (Nodes):                   Proposto (Ruas):
                                 
  [SHP]----[P.O]----[★]         ═══════════════════════
     \       |       |           ║     ║       ║     
    [AUG]  [9JN]  [BRG]         ═══════════════════════
       \    |    /                   ║   ║
      [CIN][9JS][TUN]           ═════════════════════
                                     
  Caixas + Linhas finas          Ruas grossas + Interseções
```

---

## Solucao Tecnica

### 1. Trocar "Connections" por "Streets" (Ruas Grossas)

**CSS - Linhas 483-494:** Transformar `.map-connection` em ruas:

```css
.map-connection {
  position: absolute;
  /* De linha fina para rua larga */
  background: linear-gradient(90deg,
    rgba(80, 80, 95, 0.6) 0%,
    rgba(100, 100, 120, 0.8) 15%,
    rgba(100, 100, 120, 0.8) 85%,
    rgba(80, 80, 95, 0.6) 100%
  );
  transform-origin: left center;
  height: 8px;  /* Era 2px */
  z-index: 1;
  border-radius: 2px;
  box-shadow: 
    inset 0 1px 0 rgba(255,255,255,0.1),
    inset 0 -1px 0 rgba(0,0,0,0.3),
    0 2px 4px rgba(0,0,0,0.3);
  /* Linha central da rua */
  border-top: 1px dashed rgba(255, 220, 100, 0.3);
  border-bottom: 1px dashed rgba(255, 220, 100, 0.3);
}
```

### 2. Transformar Salas em Intersecoes/Marcos

**CSS - Linhas 366-384:** Mudar `.map-room` de caixas para marcadores circulares:

```css
.map-room {
  position: absolute;
  /* De caixa retangular para circulo de intersecao */
  background: radial-gradient(circle,
    rgba(45, 45, 60, 0.95) 0%,
    rgba(30, 30, 42, 0.9) 100%
  );
  border: 2px solid rgba(80, 80, 100, 0.8);
  border-radius: 50%;  /* Circular */
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 0.45rem;
  font-family: var(--font-mono);
  font-weight: 600;
  color: rgba(180, 180, 200, 0.9);
  text-align: center;
  line-height: 24px;
  cursor: default;
  transition: all 0.3s ease;
  box-shadow:
    0 0 0 3px rgba(30, 30, 42, 0.8),
    0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 10;
}
```

### 3. Estilizar Sala Atual como "Voce Esta Aqui"

**CSS - Linhas 391-401:** Destacar sala atual:

```css
.map-room.current {
  background: radial-gradient(circle,
    rgba(212, 168, 70, 0.4) 0%,
    rgba(180, 140, 50, 0.6) 100%
  );
  border: 3px solid var(--accent-gold);
  color: var(--accent-gold);
  width: 36px;
  height: 36px;
  line-height: 30px;
  font-size: 0.5rem;
  box-shadow:
    0 0 0 4px rgba(30, 30, 42, 0.9),
    0 0 15px rgba(212, 168, 70, 0.5),
    0 0 30px rgba(212, 168, 70, 0.2);
  z-index: 15;
  animation: current-pulse 2s ease-in-out infinite;
}
```

### 4. Saidas Validas como Destinos Clicaveis

**CSS - Linhas 403-417:**

```css
.map-room.valid-exit {
  background: radial-gradient(circle,
    rgba(88, 166, 255, 0.2) 0%,
    rgba(56, 139, 219, 0.3) 100%
  );
  border: 2px solid rgba(88, 166, 255, 0.8);
  color: rgba(140, 190, 255, 1);
  cursor: pointer;
  box-shadow:
    0 0 0 3px rgba(30, 30, 42, 0.8),
    0 0 10px rgba(88, 166, 255, 0.4);
}

.map-room.valid-exit:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow:
    0 0 0 4px rgba(30, 30, 42, 0.9),
    0 0 20px rgba(88, 166, 255, 0.6);
}
```

### 5. Adicionar Textura de Fundo (Cidade)

**CSS - Linhas 327-347:** Background do minimapa:

```css
#minimap-container {
  flex: 1;
  min-height: 280px;
  background: 
    /* Grid sutil de quadras */
    linear-gradient(rgba(40, 40, 55, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(40, 40, 55, 0.3) 1px, transparent 1px),
    linear-gradient(180deg, #0a0a12 0%, #08080d 100%);
  background-size: 20px 20px, 20px 20px, 100% 100%;
  border-radius: var(--radius);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(42, 42, 53, 0.8);
}
```

### 6. Ajustar Renderizacao JS para Novo Layout

**JS - Linhas 2668-2671:** Ajustar posicionamento (transform ja existente):

O posicionamento com `transform: translate(-50%, -50%)` ja centraliza os elementos. Apenas garantir que as conexoes fiquem alinhadas corretamente com a largura maior.

### 7. Nomes das Ruas ao Lado das Conexoes (Opcional)

Adicionar nomes de ruas nas conexoes principais como labels.

---

## Resumo das Alteracoes

| Elemento | De | Para |
|----------|-----|------|
| `.map-connection` | Linha fina 2px | Rua larga 8px com textura |
| `.map-room` | Caixa retangular | Circulo de intersecao |
| `.map-room.current` | Caixa dourada | Marcador "Voce esta aqui" |
| `.map-room.valid-exit` | Caixa azul | Destino clicavel circular |
| `#minimap-container` | Fundo liso | Grid de quadras da cidade |
| Bolinhas NPC | No canto | Mantidas, ajustadas para circular |

---

## Arquivos Modificados

| Arquivo | Secao | Alteracao |
|---------|-------|-----------|
| `public/avenida-paulista.html` | CSS linhas 327-347 | Background com grid |
| `public/avenida-paulista.html` | CSS linhas 366-430 | Estilos de `.map-room` |
| `public/avenida-paulista.html` | CSS linhas 483-494 | Estilo de `.map-connection` |
| `public/avenida-paulista.html` | CSS linhas 435-481 | Ajustar bolinhas para layout circular |

---

## Resultado Esperado

1. Minimapa parece um mapa de cidade visto de cima
2. "Ruas" sao faixas largas e escuras conectando locais
3. Locais sao marcadores circulares nas intersecoes
4. Local atual aparece como "Voce esta aqui" destacado
5. Grid de fundo simula quadras urbanas
6. Mantido: bolinhas de inimigos/aliados, clique para mover


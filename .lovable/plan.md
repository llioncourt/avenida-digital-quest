

## Fix: Saídas Fantasmas no Minimapa (não no painel de localidade)

### Problema
As saídas fantasmas de alucinação nível 3 aparecem como botões no painel de personagens/itens. O correto é mostrá-las como **salas no minimapa**, conectadas à sala atual, com visual distorcido.

### Solução

**Arquivo: `public/avenida-paulista.html`**

**1. CSS — Estilo para sala fantasma no minimapa**
```css
.map-room.phantom-room {
  opacity: 0.6;
  animation: hallucinate-wobble 2s infinite;
  border: 1px dashed rgba(180, 80, 255, 0.6);
  box-shadow: 0 0 8px rgba(180, 80, 255, 0.4);
}
.map-connection.phantom-connection {
  opacity: 0.4;
  background: rgba(180, 80, 255, 0.3) !important;
}
```

**2. JS — `updateMinimap` (~linha 9461): Após desenhar as salas reais, inserir salas fantasmas**

- Chamar `Hallucinations.getPhantomExits()` para obter saídas fantasma
- Para cada phantom exit, calcular uma posição aleatória adjacente à sala atual (offset de ~40px numa direção livre)
- Criar um `map-room phantom-room` com o nome da saída fantasma
- Criar um `map-connection phantom-connection` ligando a sala atual à fantasma
- Ao clicar, chamar `Game.move(phantomId)` (que já trata a mensagem de "saída inexistente")

**3. JS — Remover os botões `phantom-exit-btn` do `updateLocation` (~linhas 8923-8942)**

Eliminar toda a lógica que cria botões de saída fantasma no painel de localidade, já que agora aparecem no minimapa.

### Resultado
Saídas fantasmas aparecem como nós pulsantes/wobble no minimapa com conexão tracejada roxa à sala atual. Ao clicar, o jogador "tenta ir" mas a saída não existe.


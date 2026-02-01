

# Plano: Corrigir Multiplas Instancias da Musica ao Reiniciar

## Problema Identificado

Quando o jogo reinicia (`Game.restart()` ou `Game.init()`), o `MusicSystem.init()` e executado novamente, que:

1. Chama `loadMIDI()` novamente
2. No final do `loadMIDI()`, chama `this.start()` automaticamente
3. **Nao para a musica anterior** - os osciladores agendados e o timeout de loop continuam ativos

Resultado: Cada reinicio adiciona uma nova "camada" de musica, criando cacofonia.

---

## Solucao

Adicionar `MusicSystem.stop()` no inicio do `Game.init()` para garantir que qualquer instancia anterior seja completamente parada antes de reinicializar.

### Codigo Atual

```javascript
init: function() {
  SoundSystem.init();
  MusicSystem.init();  // <- Nao para a musica anterior
  MinimapController.init();
  // ...
}
```

### Codigo Corrigido

```javascript
init: function() {
  SoundSystem.init();
  
  // Parar musica anterior antes de reinicializar
  MusicSystem.stop();
  MusicSystem.init();
  
  MinimapController.init();
  // ...
}
```

---

## Alteracao Necessaria

| Arquivo | Linha | Alteracao |
|---------|-------|-----------|
| `public/avenida-paulista.html` | ~3632 | Adicionar `MusicSystem.stop();` antes de `MusicSystem.init();` |

---

## Comportamento Apos Correcao

1. Usuario inicia o jogo - musica comeca automaticamente
2. Usuario clica "Jogar Novamente" ou reinicia
3. `Game.init()` e chamado
4. `MusicSystem.stop()` para imediatamente:
   - Cancela o timeout de loop
   - Para todos os osciladores agendados
   - Limpa o array de osciladores
5. `MusicSystem.init()` carrega e inicia a musica novamente
6. Apenas UMA instancia da musica toca

---

## Resultado Esperado

- Reiniciar o jogo **NAO** cria multiplas instancias da musica
- A musica para e reinicia limpa a cada novo jogo
- O toggle de musica continua funcionando normalmente


# Plano: Melhorias no Avenida Paulista

## ✅ Implementação Concluída

Todas as 5 alterações foram implementadas com sucesso:

1. ✅ **Atributo `mayHaveItems` nas salas** - Itens largados no Céu da Cidade são destruídos (caem)
2. ✅ **Efeito visual de piscada** - Flash roxo quando a Bruxa fala palavras mágicas  
3. ✅ **Novo layout** - Log em destaque no topo + Mapa na lateral direita (altura total)
4. ✅ **Livro desaparece após uso** - Opção "Converter" no modal do Demônio
5. ✅ **Animação estilo Star Wars** - Texto puro processado pela função `formatStory()`

---

## Mudanças Realizadas

### `public/avenida-paulista.html`

- **ROOMS_DATA.ceu_cidade**: Adicionado `mayHaveItems: false`
- **Actions.dropItem()**: Verifica `mayHaveItems` e destrói item se `false`
- **GameState**: Adicionado `hasReadMagicBook: false`
- **ItemUseHandlers.livro()**: Define `hasReadMagicBook = true` e `consumed: true`
- **Modals.showCharacter()**: Botão "✨ Converter" para o Demônio quando aplicável
- **ScreenEffects**: Novo objeto com função `flash()`
- **Events.processWitchWord()**: Chama `ScreenEffects.flash()` junto com som
- **MusicSystem.setSpeed()**: Nova função para controle de velocidade
- **IntroSystem**: Novo objeto com texto editável e animação Star Wars
- **HTML**: Novo layout com Log no topo do game-panel e Mapa à direita
- **CSS**: Estilos para intro Star Wars, flash da bruxa, layout reorganizado

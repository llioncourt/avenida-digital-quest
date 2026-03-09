

## Plano Atualizado

O plano atual está limpo — não contém referências ao Suno. Vou adicionar a **Fase 5** descrevendo o sistema híbrido MP3 + MIDI com Cache API, sem mencionar Suno.

### Alteração no `.lovable/plan.md`

Adicionar ao final:

```
### 🔧 Fase 5 — Sistema Híbrido MP3 + MIDI com Cache Offline

- Objeto `MP3_TRACKS` mapeando estados → URLs locais:
  - `exploration: 'AVP Theme.mp3'`
  - `gameover: 'AVP Game Over.mp3'`
  - `combat`, `defeat`, `victory`: placeholders vazios
- Cache API (`caches.open('avp-music-v1')`) para persistir MP3s offline após primeiro carregamento
- Wrapper `_addMp3Layer` em cada player MIDI — sobrescreve `start()`/`stop()`:
  - MP3 disponível (cache ou rede) → toca via `<audio>`
  - Sem MP3 → fallback automático para MIDI
- Integração de volume com `masterGain` existente (sliders continuam funcionando)
- Tudo autocontido no HTML
```

Nenhuma outra alteração necessária — o plano atual (Fases 1-4) já não menciona Suno.


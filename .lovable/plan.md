

# Ícones de clima na barra de status

## O que será feito

Adicionar ícones dinâmicos na barra de botões do log (ao lado de 💣, 📓, 🔊, 🎵) que aparecem quando eventos climáticos estão ativos: chuva (🌧️), vento (🌬️) e neblina (🌫️).

## Alterações em `public/avenida-paulista.html`

### HTML (~3 linhas)
Na barra de botões (linha ~2001), adicionar 3 spans ocultos por padrão:
```html
<span id="weather-rain" class="weather-indicator" title="Chovendo">🌧️</span>
<span id="weather-wind" class="weather-indicator" title="Vento forte">🌬️</span>
<span id="weather-fog" class="weather-indicator" title="Neblina">🌫️</span>
```

### CSS (~8 linhas)
```css
.weather-indicator {
  display: none;
  font-size: 1rem;
  padding: 0.3rem 0.2rem;
  animation: weather-pulse 2s ease-in-out infinite;
}
.weather-indicator.active { display: inline-block; }
@keyframes weather-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
```

### JS (~15 linhas)
Criar um objeto `WeatherIndicators.update()` que verifica `RandomEvents.isActive('rain')`, `wind_howl`, e `fog`, e adiciona/remove a classe `active` nos respectivos elementos. Chamar `WeatherIndicators.update()` dentro de `RandomEvents.startEvent()` e `RandomEvents.endEvent()` para manter os ícones sincronizados.


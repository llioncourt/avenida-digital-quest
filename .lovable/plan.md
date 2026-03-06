

# Fix: Scrollbar dentro da lista de salas, não no modal

## Problema
A scrollbar está no container geral `.mapa-antigo-scroll` que envolve todas as seções. O usuário quer a scrollbar **dentro de cada seção de salas** (`.mapa-section-rooms`), como mostrado na screenshot — a área com borda que lista as salas individuais.

## Correção

Mover o `max-height` e estilos de scrollbar do `.mapa-antigo-scroll` para `.mapa-section-rooms`:

- **`.mapa-antigo-scroll`**: remover `max-height` e `overflow-y: auto`
- **`.mapa-section-rooms`**: adicionar `max-height: 45vh`, `overflow-y: auto`, `scrollbar-width: thin`, e estilos webkit de scrollbar dourada

Assim cada seção (Eixo Paulista, Inferior, etc.) terá sua própria scrollbar interna quando houver muitas salas.


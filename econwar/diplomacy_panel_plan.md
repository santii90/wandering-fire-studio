# Plan de Implementación: Panel de Diplomacia

**Objetivo:** Implementar el panel de Diplomacia en la UI inferior para mostrar el estado de las relaciones entre el jugador actual y las demás facciones (IA o jugadores).

**Pasos Principales:**

1.  **Definir Estados Diplomáticos:**
    *   En `scripts/game_controller.gd`, definir un `enum` para los posibles estados diplomáticos. Ejemplo:
        ```gdscript
        enum DiplomaticStatus { WAR, PEACE, ALLIANCE, TRUCE } # Añadir más si es necesario
        ```

2.  **Almacenar Estado Diplomático:**
    *   En `scripts/game_controller.gd`, añadir una estructura de datos para almacenar el estado entre cada par de jugadores. Una matriz 2D o un diccionario anidado podría funcionar:
        ```gdscript
        # Opción 1: Matriz 2D (siempre num_players x num_players)
        var diplomacy_matrix: Array = [] 
        # Opción 2: Diccionario anidado
        var diplomacy_status: Dictionary = {} # { player_id: { other_player_id: status } }
        ```
    *   Inicializar esta estructura en `_init` o `new_game`. Por defecto, todos podrían empezar en `PEACE` o `WAR` con todos, excepto consigo mismos.

3.  **Funciones en `game_controller.gd`:**
    *   `get_diplomatic_status(player_a: int, player_b: int) -> int`: Devuelve el estado diplomático (`DiplomaticStatus`) entre dos jugadores.
    *   `set_diplomatic_status(player_a: int, player_b: int, new_status: int)`: Establece el estado diplomático (asegurándose de que sea simétrico, ej., si A está en guerra con B, B también lo está con A).
    *   *(Futuro)* Funciones para acciones diplomáticas (`declare_war`, `offer_peace`, `propose_alliance`, etc.) que modifiquen el estado y generen eventos.

4.  **Modificar UI (`scenes/Main.tscn`):**
    *   Dentro del nodo `DiplomacyPanel` (`UI/ExpandablePanelsContainer/DiplomacyPanel`):
        *   Añadir un `ItemList` (ej: `DiplomacyList`) para mostrar a los otros jugadores.
        *   *(Opcional)* Añadir botones para futuras acciones diplomáticas.

5.  **Modificar Script Principal (`scripts/main.gd`):**
    *   Añadir referencia `@onready var diplomacy_list = $UI/ExpandablePanelsContainer/DiplomacyPanel/DiplomacyList`.
    *   Actualizar `load_ui_references` y `verify_ui_nodes` para incluir `diplomacy_list`.
    *   Implementar `_update_diplomacy_panel()`:
        *   Obtener el `current_player`.
        *   Limpiar `diplomacy_list`.
        *   Iterar por todos los demás jugadores (`for p in range(num_players): if p != current_player:`).
        *   Llamar a `game_controller.get_diplomatic_status(current_player, p)` para obtener el estado.
        *   Añadir un item al `diplomacy_list` mostrando el nombre/ID del jugador `p` y su estado diplomático relativo al `current_player` (ej: "Jugador 2: GUERRA").
        *   *(Opcional)* Cambiar el color del item según el estado (rojo para guerra, verde para alianza, etc.).

**Consideraciones Adicionales:**

*   ¿Cómo se inicializa la diplomacia al empezar una nueva partida?
*   ¿Existen modificadores de juego basados en el estado diplomático (ej: bonus/penalizaciones comerciales, paso de tropas)?
*   ¿Cómo interactúa la IA con el sistema de diplomacia?
*   Generar eventos (`EventLogger`) para cambios diplomáticos importantes.
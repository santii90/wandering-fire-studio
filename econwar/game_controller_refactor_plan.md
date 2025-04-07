---
date: 2025-04-04T15:52:17
order: 992000
---
# Plan de Refactorización de `game_controller.gd`

## Objetivo

Refactorizar el archivo `scripts/game_controller.gd` para mejorar la modularidad, mantenibilidad y claridad del código, separando sus múltiples responsabilidades en módulos más pequeños y específicos.

## Estructura de Directorios Propuesta

```
scripts/
├── common/
│   ├── constants.gd
│   ├── terrain_data.gd       # Nuevo
│   ├── directions.gd         # Nuevo
│   ├── game_state.gd         # Nuevo (Singleton/Autoload)
│   └── utils.gd              # Nuevo
├── game_logic/               # Nuevo
│   ├── territory_manager.gd  # Nuevo
│   ├── population_manager.gd # Nuevo
│   ├── resource_manager.gd   # Nuevo
│   ├── expansion_manager.gd  # Nuevo
│   └── strategic_ai.gd       # Nuevo
├── systems/                  # Nuevo
│   ├── border_cache_system.gd # Nuevo
│   └── game_time_system.gd    # Nuevo
├── game_controller.gd        # Refactorizado (Orquestador)
└── ... (otros scripts existentes)
```

## Tareas Detalladas

### 1. Crear Estructura de Directorios y Archivos Base

-   [ ] Crear directorio `scripts/common/`
-   [ ] Crear directorio `scripts/game_logic/`
-   [ ] Crear directorio `scripts/systems/`
-   [ ] Crear archivo `scripts/common/terrain_data.gd`
-   [ ] Crear archivo `scripts/common/directions.gd`
-   [ ] Crear archivo `scripts/common/game_state.gd`
-   [ ] Crear archivo `scripts/common/utils.gd`
-   [ ] Crear archivo `scripts/game_logic/territory_manager.gd`
-   [ ] Crear archivo `scripts/game_logic/population_manager.gd`
-   [ ] Crear archivo `scripts/game_logic/resource_manager.gd`
-   [ ] Crear archivo `scripts/game_logic/expansion_manager.gd`
-   [ ] Crear archivo `scripts/game_logic/strategic_ai.gd`
-   [ ] Crear archivo `scripts/systems/border_cache_system.gd`
-   [ ] Crear archivo `scripts/systems/game_time_system.gd`

### 2. Módulo `common/game_state.gd` (Singleton/Autoload)

-   [ ] Definir la clase `GameState`.
-   [ ] Mover las variables de estado principales (`terrain_map`, `ownership_map`, `resource_map`, `num_players`, `map_width`, `map_height`, `current_player`) de `game_controller.gd` a `GameState`.
-   [ ] Proveer métodos getter (y setter si son necesarios y seguros) para acceder a estas variables.
-   [ ] Configurar `GameState` como un Autoload en la configuración del proyecto Godot.

### 3. Módulo `common/terrain_data.gd`

-   [ ] Mover las constantes `TERRAIN_DIFFICULTY`, `TERRAIN_DEFENSE_BONUS`, `TERRAIN_POPULATION_CAPACITY`, `TERRAIN_EXPANSION_COST` de `game_controller.gd` a `terrain_data.gd`.
-   [ ] Mover la constante `TERRAIN_TYPES` (alias de `TilesetManager.TerrainType`).
-   [ ] Mover la función `get_terrain_name`.
-   [ ] Mover las funciones auxiliares relacionadas con el terreno (`get_terrain_type`, `get_terrain_difficulty`, `get_terrain_defense_bonus`, `get_terrain_population_capacity`). Actualizar para usar `GameState` si es necesario.

### 4. Módulo `common/directions.gd`

-   [ ] Mover las constantes `DIRECTIONS`, `DIAGONALS`, `ALL_DIRECTIONS` de `game_controller.gd` a `directions.gd`.

### 5. Módulo `common/utils.gd`

-   [ ] Identificar y mover funciones auxiliares genéricas de `game_controller.gd` (ej. `is_within_map`, `get_region_key`, `get_affected_regions`).

### 6. Módulo `game_logic/territory_manager.gd`

-   [ ] Implementar la lógica para gestionar la propiedad de territorios (`ownership_map` ahora en `GameState`).
-   [ ] Mover la función `_set_territory_owner` y la señal `territory_changed`.
-   [ ] Mover la lógica de cálculo de `territory_counts` y las funciones `get_territory_count`, `update_territory_counts`, `calculate_player_territory_count`.
-   [ ] Mover la función `is_border_tile`.
-   [ ] Dependerá de `GameState` y `BorderCacheSystem`.

### 7. Módulo `game_logic/population_manager.gd`

-   [ ] Mover toda la lógica relacionada con la gestión de población:
    -   Variables: `population_workers`, `population_troops`, `population_logistics`, `unassigned`, etc. (ahora probablemente dentro de `GameState` o `PlayerData`).
    -   Funciones: `calculate_population_capacity`, `update_units`, `reduce_troops`, `sync_population_counters`, `get_worker_count`, `set_worker_count`, `get_troops_in_territory`, etc., `get_total_population`, `set_total_population`, `get_unassigned_population`, `set_unassigned_population`, `add_unassigned_population`, `validate_population_data`, `process_unassigned_population`, `register_population_loss`.
-   [ ] Mover constantes relacionadas como `WORKERS_ASSIGNMENT_SPEED`, etc.
-   [ ] Dependerá de `GameState`.

### 8. Módulo `game_logic/resource_manager.gd`

-   [ ] Mover la lógica de gestión de recursos (oro, comida, producción).
    -   Variables (`resource_map` en `GameState`).
    -   Funciones: `get_gold`, `set_gold`, `add_gold`, `get_food`, etc., `process_resources`.
-   [ ] Dependerá de `GameState` y `PopulationManager`.

### 9. Módulo `game_logic/expansion_manager.gd`

-   [ ] Mover la lógica de procesamiento de expansiones y ataques.
    -   Variables: `pending_expansions`, `expansion_info`, `expansion_percentage`.
    -   Funciones: `expand_territory`, `process_pending_expansions`, `process_expansion_step`, `process_empty_expansions_batch`, `return_troops_to_player`, `calculate_deployed_troops`, `get_available_troops`.
-   [ ] Mover la lógica de combate implícita en `process_expansion_step` (cálculo de bajas, etc.).
-   [ ] Dependerá de `GameState`, `TerritoryManager`, `PopulationManager`, `StrategicAI`, `BorderCacheSystem`.

### 10. Módulo `game_logic/strategic_ai.gd`

-   [ ] Mover la lógica de evaluación estratégica para expansiones y ataques.
    -   Funciones: `find_adjacent_empty_prioritized`, `find_adjacent_player_prioritized`, `calculate_territory_value`, `calculate_expansion_potential`, `evaluate_strategic_importance`, `would_isolate_enemy_territory`, `get_player_strength`, `evaluate_borders_strategic_value`, `select_strategic_border`, `calculate_border_strategic_value`, `is_border_spearhead`, `would_create_circular_territory_fast`, `could_divide_enemy_territory_simple`.
-   [ ] Dependerá de `GameState`, `TerritoryManager`.

### 11. Módulo `systems/border_cache_system.gd`

-   [ ] Mover toda la lógica de caché de fronteras.
    -   Variables: `border_tiles_cache`, `border_cache_valid`, `border_with_player_cache`, `border_with_player_cache_valid`, `region_size`, `border_region_cache`, `border_region_validity`, `region_border_flags`.
    -   Funciones: `invalidate_borders_at`, `invalidate_all_border_caches`, `get_border_tiles_with_empty`, `get_border_tiles_with_player`, `initialize_border_region_cache`, `are_all_borders_cached`.
-   [ ] Dependerá de `GameState`.

### 12. Módulo `systems/game_time_system.gd`

-   [ ] Mover la variable `game_time`.
-   [ ] Mover la función `update_game_time`.
-   [ ] Considerar si debe manejar el `GameTickManager` si existe o si esa lógica se integra aquí.

### 13. Refactorizar `scripts/game_controller.gd`

-   [ ] Eliminar todas las variables y funciones movidas a otros módulos.
-   [ ] Convertir `_init` y `new_game` (o `initialize_game`) para que inicialicen y configuren los nuevos managers y sistemas, obteniendo referencias a ellos o usando el `GameState` Singleton.
-   [ ] Mantener la lógica de orquestación mínima necesaria (ej., llamar a `process_resources`, `process_pending_expansions`, `update_game_time` en `_process` o según corresponda).
-   [ ] Actualizar las llamadas internas para usar los nuevos módulos (ej., `PopulationManager.reduce_troops(...)` en lugar de `reduce_troops(...)`).
-   [ ] Mantener las señales principales (`game_over`) si son apropiadas aquí, o moverlas al manager correspondiente.
-   [ ] Mover o eliminar las funciones getter específicas de UI (`get_active_movement_info_for_player`) - podrían ir a un módulo `ui/ui_getters.gd` o ser manejadas directamente por la UI consultando los managers.

### 14. Actualizar Referencias Externas

-   [ ] Revisar `scripts/main.gd` y actualizar cómo interactúa con `game_controller` o los nuevos módulos/GameState.
-   [ ] Revisar cualquier otro script (UI, etc.) que dependa de `game_controller` y actualizar las llamadas.

### 15. Limpieza y Pruebas

-   [ ] Eliminar código comentado o no utilizado.
-   [ ] Ejecutar el juego y probar exhaustivamente las funcionalidades afectadas (expansión, combate, gestión de población, UI) para asegurar que todo funcione como antes.
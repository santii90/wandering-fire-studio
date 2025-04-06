# Mecánicas Actuales de Desarrollo de Casillas (Tiles)

Este documento describe el sistema de desarrollo de casillas implementado actualmente en el juego, basado en estados discretos y transiciones según las condiciones de población. Este sistema reemplaza o precede al plan basado en niveles numéricos descrito en `sistema_desarrollo_v1_plan.md`.

## Estados de Desarrollo (`DevelopmentStates`)

La evolución de una casilla se rige por el enum `DevelopmentStates` definido en `scripts/common/simulation_constants.gd`:

```gdscript
enum DevelopmentStates {
    UNCULTIVATED,  # Estado inicial para terrenos como Plains, Hills
    FORESTED,      # Estado inicial para Forest
    ROCKY,         # Estado inicial para Mountains/Hills
    WATER,         # No desarrollable?
    CULTIVATED,    # Llanuras/Colinas desarrolladas para agricultura
    LOGGED,        # Bosque talado
    MINED,         # Montaña/Colina con mina
    # ... (otros estados posibles)
}
```

## Estado Inicial

Al inicio de la partida, cada casilla recibe un estado de desarrollo inicial basado en su tipo de terreno base, según la función `SimConst.get_initial_development_state`:
*   `PLAINS`, `HILLS`, `DESERT`, `SWAMP`, `TUNDRA`, `DRY_CLAY` empiezan como `UNCULTIVATED`.
*   `FOREST` empieza como `FORESTED`.
*   `MOUNTAINS`, `SNOW_MOUNTAINS` empiezan como `ROCKY`.
*   `WATER` empieza como `WATER`.
*   `CITY` e `INDUSTRY` actualmente no tienen un estado inicial explícito y probablemente usan el por defecto (`UNCULTIVATED`), aunque esto podría revisarse.

## Capacidad de Población y Modificadores

La capacidad máxima de población (`max_population_capacity`) de cada casilla se almacena en `GameState.detailed_tile_map`. Se calcula usando `SimConst.get_population_capacity`, que toma la capacidad base del terreno (`TerrainData.TERRAIN_POPULATION_CAPACITY`) y la multiplica por un modificador basado en el estado de desarrollo *actual* de la casilla:

```gdscript
# scripts/common/simulation_constants.gd
static func get_population_capacity(base_terrain_type: int, current_development: int) -> int:
    var base_capacity = TerrainData.TERRAIN_POPULATION_CAPACITY.get(base_terrain_type, 0)
    var dev_modifier = 1.0
    match current_development:
        DevelopmentStates.CULTIVATED: dev_modifier = 1.5 # +50%
        DevelopmentStates.LOGGED: dev_modifier = 0.8     # -20%
        DevelopmentStates.MINED: dev_modifier = 1.1      # +10%
        _: dev_modifier = 1.0 # UNCULTIVATED, FORESTED, ROCKY, etc. no modifican
    return int(base_capacity * dev_modifier)
```

**Importante:** El estado `CULTIVATED` aumenta la capacidad base de la casilla en un 50%.

La capacidad total del jugador (`total_population_capacity` mostrada en la UI y usada en logs) se calcula en cada tick sumando las `max_population_capacity` individuales de todas las casillas que posee (`TileSimulationManager.gd`).

## Transición de Desarrollo: `UNCULTIVATED` a `CULTIVATED`

La simulación comprueba periódicamente si una casilla puede cambiar su estado de desarrollo (`TileSimulationManager._simulate_development_change`). La única regla activa actualmente para pasar de `UNCULTIVATED` a `CULTIVATED` está definida en `SimConst.get_development_thresholds`:

*   **Condición:** La población de la casilla debe estar compuesta por un **60% o más de Campesinos (`PEASANT`)**.
    *   `thresholds.append({ "target_development": DevelopmentStates.CULTIVATED, "condition_type": "population_percentage", "class": SocialClasses.PEASANT, "threshold": 0.6 })`

## Desarrollo Rápido Inicial (Explicación)

Se observa que muchas casillas cambian a `CULTIVATED` muy rápidamente al inicio del juego. Esto ocurre porque:
1.  Las casillas iniciales con dueño reciben una población inicial del 80% de su capacidad base (`GameState.initialize_detailed_tile_map`).
2.  Esta población inicial se asigna con un 80% de Campesinos.
3.  Por lo tanto, estas casillas cumplen inmediatamente la condición de >=60% de Campesinos.
4.  La simulación aplica el cambio de estado de forma escalonada, resultando en un aumento rápido de la capacidad total del jugador a medida que las casillas individuales multiplican su capacidad por 1.5.

## Dinámica Poblacional y Desarrollo

*   **Crecimiento/Conquista:** La población que se añade por crecimiento natural (`_simulate_growth_decay`) o por conquista (`ExpansionManager`) se asigna actualmente como Campesinos. Esto tiende a mantener o aumentar el porcentaje de campesinos en casillas en crecimiento o recién conquistadas.
*   **Transición de Clases:** El único mecanismo que diversifica la población es la transición entre clases sociales (`_simulate_class_transition`), cuyas reglas están definidas en `SimConst.get_class_transition_conditions`. Si los campesinos se convierten rápidamente a otras clases, podría dificultarse alcanzar o mantener el 60% necesario para el desarrollo a `CULTIVATED`.

Este documento refleja el estado actual de la mecánica. Futuros ajustes podrían modificar las condiciones de transición de desarrollo o las reglas de transición de clases para lograr una progresión diferente.
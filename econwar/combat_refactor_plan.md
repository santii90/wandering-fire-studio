# Plan de Refactorización: Sistema Militar y Seguimiento de Ubicación (v2)

## 1. Contexto y Problema

La refactorización anterior intentó adaptar `PopulationManager` para usar tropas de combate, pero entró en conflicto con el nuevo sistema de simulación basado en tiles (`simulation_plan_population_tiles.md`), causando inconsistencias (ej. `combat_troops_in_territory > troops_in_territory`).

Este plan reemplaza al anterior y se alinea con la visión de simulación por tiles, separando los contadores militares globales de la gestión de ubicación de unidades.

## 2. Visión General del Nuevo Sistema

*   **Población Civil:** Gestionada por `TileSimulationManager` en tiles individuales.
*   **Ejército Global:** Contadores globales (`current_military_population`, `combat_troops`, `logistics_personnel`) gestionados por `GameTickManager` y almacenados en `GameState.player_resources`.
*   **Ubicación de Unidades:** Un nuevo sistema (`MilitaryState`) rastreará la ubicación específica (`Tile` o `Mission`) de unidades/grupos militares.
*   **Reclutamiento/Desmovilización:** Conecta la población civil de los tiles con los contadores globales del ejército y la creación/eliminación de unidades en `MilitaryState`.
*   **`PopulationManager`:** Su rol se reduce significativamente, eliminando la lógica de ubicación de tropas.

## 3. Plan de Implementación Detallado

1.  **Crear Autoload `MilitaryState`:**
    *   Crear `scripts/game_logic/military_state.gd`.
    *   Registrar como Autoload en `project.godot`.
    *   **Estructura Principal:**
        ```gdscript
        # military_state.gd
        extends Node
        # Diccionario: Clave=player_id (int), Valor=Array de diccionarios de unidad
        var military_units_by_player: Dictionary = {}
        ```
    *   **Estructura Diccionario de Unidad:**
        ```gdscript
        var unit_data_example = {
            "unit_id": "uuid_string",  # Identificador único
            "player": 0,
            "type": "combat",          # "combat" o "logistics"
            "count": 100,              # Tamaño actual
            "location_type": "tile",   # "tile", "mission"
            "location_data": Variant   # Vector2i para "tile", String (MissionID) para "mission"
            # "max_size": 100 (Opcional, si definimos tamaño máximo)
        }
        ```
    *   **Funciones Iniciales:** `initialize_player(player_id)`, `get_player_units(player_id)`, `add_new_unit(player_id, unit_data)`, `update_unit_location(unit_id, new_type, new_data)`, `register_casualties(unit_id, amount)`, `_generate_unit_id()`.

2.  **Integrar Reclutamiento (`GameTickManager` / `TileSimulationManager`):**
    *   `GameTickManager` calcula reclutas potenciales.
    *   Llama a `TileSimulationManager.remove_peasants_for_recruitment(player_id, amount_needed)` (nueva función a crear).
        *   Esta función implementa la lógica de selección de tiles (inicialmente proporcional, **TODO:** priorizar edificios militares) y devuelve la cantidad real de Peasants eliminados.
    *   `GameTickManager` usa la cantidad real para:
        *   Incrementar contadores globales (`current_military_population`, etc.) en `GameState.player_resources`.
        *   Llamar a `MilitaryState.add_or_reinforce_units(player_id, actual_recruits, location_tile)`.
            *   Esta función en `MilitaryState` implementará la lógica "Crear y Llenar Gradualmente": buscará unidades parciales del tipo correcto (Combat/Logistics según ratio `target_logistics_percentage`) en el `location_tile` (ej. capital/punto reunión) para añadir reclutas, o creará nuevas unidades si es necesario (considerar tamaño máx/mín).

3.  **Refactorizar Despliegue (`ExpansionManager`):**
    *   Obtener referencia a `MilitaryState`.
    *   Eliminar dependencias de `PopulationManager` para despliegue.
    *   Buscar unidades (`type=="combat"`, `location_type=="tile"`, `location_data` en tiles relevantes) consultando `MilitaryState.get_player_units()`.
    *   Llamar a `MilitaryState.update_unit_location()` para marcar unidades como desplegadas (`location_type="mission"`).

4.  **Refactorizar Retorno de Tropas (`ExpansionManager`):**
    *   Eliminar dependencias de `PopulationManager`.
    *   Llamar a `MilitaryState.update_unit_location()` para devolver unidades a un tile (`location_type="tile"`).

5.  **Implementar Manejo de Bajas (en `MilitaryState`):**
    *   Crear `MilitaryState.register_casualties(unit_id, amount)`.
    *   Función: Busca unidad, reduce `count`, elimina si `count <= 0`, reduce contadores globales en `GameState`, llama a `register_population_loss` (aún por definir dónde reside esta última, ¿quizás en `GameState` o un `PlayerManager`?).
    *   Actualizar `ExpansionManager` (y futura lógica de combate) para usar `MilitaryState.register_casualties`.

6.  **Refactorizar `StrategicAI`:**
    *   `get_player_strength` usará contadores globales de `GameState.player_resources`.
    *   Adaptar lógica si necesita consultar ubicaciones desde `MilitaryState`.

7.  **Limpiar `PopulationManager`:**
    *   **Eliminar:** Toda la lógica y variables relacionadas con `troops_in_territory`, `troops_deployed`, y sus variantes detalladas. Funciones `deploy_combat_troops`, `return_deployed_combat_troops`, `register_deployed_casualties`, `reduce_troops_due_to_casualties`, `get_available_troops`.
    *   **Revisar/Simplificar:** `sync_population_counters` (eliminar validaciones de tropas).
    *   **Revisar:** `get_logistics_count` y el contador `"logistics"` (probablemente obsoletos).
    *   **Mantener (Potencialmente):** Lógica relacionada con `workers`, `unassigned`, `population`, `population_capacity`, `update_units`, `process_unassigned_population` si aún son necesarios para la población civil *antes* de que se convierta en militar. (Evaluar si `TileSimulationManager` asume esto).

8.  **Actualizar `GameController`:**
    *   Eliminar inicialización de claves de tropas obsoletas en `player_resources`.
    *   Añadir llamada a `MilitaryState.initialize_player()`.

9.  **Actualizar UI:**
    *   Adaptar `MilitaryPanel` para mostrar contadores globales.
    *   Considerar visualización basada en `MilitaryState`.

## 4. Diagrama Conceptual

```mermaid
graph TD
    subgraph TileSimulationManager
        direction LR
        T1[Población Civil (Tiles)] --> T2{Reclutamiento};
        T2 --> T3[+ Unidad en Tile X (MilitaryState)];
        T4[Desmovilización] --> T1;
    end

    subgraph GameTickManager
        direction LR
        G1[Target % Militar] --> G2{Calcular Target Militar Pop};
        G2 --> G3{Comparar con Actual Militar Pop};
        G3 -- Déficit --> T2;
        G3 -- Exceso --> T4;
        G4[Actual Militar Pop] --> G5{Calcular Split Global Combat/Logistics};
        G5 --> G6[Actualizar Contadores Globales (GameState)];
    end
    
    subgraph MilitaryState [MilitaryState (Autoload)]
        MS1[military_units_by_player: Dict{PlayerID: [UnitDict]}]
        MS2[add_or_reinforce_units()]
        MS3[update_unit_location()]
        MS4[register_casualties()]
        MS5[get_player_units()]
    end

    subgraph GameState [GameState (Autoload)]
         GS1[player_resources: Dict{... global_combat_troops, global_logistics_personnel ...}]
         GS2[Mapas, etc.]
         GS3[register_population_loss()?]
    end

    subgraph ExpansionManager
        E1[Decisión Ataque/Exp.] --> E2{Buscar Unidad (MilitaryState)};
        E2 -- Encontrada --> E3[Actualizar Ubicación (MilitaryState)];
        E3 --> E4[Iniciar Misión];
        E4 -- Bajas --> E5[Registrar Bajas (MilitaryState)];
        E4 -- Finaliza --> E6{Retornar Tropas};
        E6 --> E7[Actualizar Ubicación (MilitaryState)];
    end
    
    subgraph PopulationManager [PopulationManager (Refactorizado/Reducido)]
        PM1[Gestiona Workers?, Unassigned?]
        PM2[register_population_loss()?]
    end

    T2 --> G3; 
    T3 --> MS1;
    G6 --> GS1;
    E2 --> MS5;
    E3 --> MS3;
    E5 --> MS4;
    E7 --> MS3;
    MS4 --> GS1;
    MS4 --> GS3; 
    MS4 --> PM2;
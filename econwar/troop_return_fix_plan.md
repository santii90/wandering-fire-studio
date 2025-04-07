---
date: 2025-04-07T17:27:21
order: 1000000
---
# Plan de Corrección para Retorno de Tropas

Este documento detalla el plan para corregir el problema donde las tropas que regresan de una misión no pueden encontrar un destino si el jugador ha perdido todos sus territorios, y para refinar la lógica de selección del tile de retorno ("capital").

## Problema Original

Si un jugador pierde todos sus territorios (sin capital implícita), las tropas que regresen de una misión (`expansion_manager.gd` -> `_return_units_to_player`) no encuentran un `return_tile` válido al llamar a `GameState.get_player_capital_coords`. Esto causa que la función termine prematuramente y las unidades queden en estado "mission" en `MilitaryState`. Además, la "capital" se determinaba como el primer tile encontrado del jugador, sin priorizar ciudades.

## Requisitos

1.  La "capital" (tile de retorno preferido) debe ser una "Ciudad" (definida como tile con tipo de terreno `TerrainData.TERRAIN_TYPES.CITY`) si el jugador posee alguna. Si no tiene ciudades pero sí otros tiles, se usará el primer tile encontrado (comportamiento de fallback).
2.  Si un jugador pierde **todo** su territorio, las tropas que regresen de una misión se perderán completamente (no hay penalización del 5% en este caso, simplemente se eliminan).

## Plan Detallado

### Fase 1: Refinar la Búsqueda de la "Capital" (Priorizar Ciudades)

1.  **Modificar `scripts/common/game_state.gd`:**
    *   **Crear `get_player_city_coords(player_id: int) -> Array[Vector2i]`:**
        *   Iterará sobre el mapa (`terrain_map` y `ownership_map`).
        *   Para cada tile `(x, y)`:
            *   Verificará si `get_territory_owner(x, y) == player_id`.
            *   Verificará si `get_terrain_at(x, y) == TerrainData.TERRAIN_TYPES.CITY`.
            *   Si ambas son verdaderas, añadirá `Vector2i(x, y)` al resultado.
        *   Devolverá el array de coordenadas de ciudades.
    *   **Actualizar `get_player_capital_coords(player_id: int) -> Vector2i`:**
        *   Llamará a `get_player_city_coords(player_id)`.
        *   Si el resultado (`city_coords`) no está vacío, devolverá `city_coords[0]`.
        *   Si `city_coords` está vacío:
            *   Realizará la búsqueda actual (primer tile del jugador en `ownership_map`).
            *   Si encuentra un tile, devolverá sus coordenadas.
            *   Si no encuentra ningún tile, devolverá `Vector2i(-1, -1)`.

### Fase 2: Implementar Pérdida Total de Tropas sin Territorio

1.  **Modificar `scripts/game_logic/expansion_manager.gd` (`_return_units_to_player`):**
    *   Obtener `player`, `unit_ids`, `troops_left` de la `expansion`.
    *   Llamar a `GameState.get_player_capital_coords(player)` para obtener `return_tile`.
    *   **Si `return_tile == Vector2i(-1, -1)` (Jugador sin territorio):**
        *   Loguear la situación.
        *   Iterar sobre `unit_ids`:
            *   Obtener `unit_data = MilitaryState.get_unit_data(unit_id)`.
            *   Si la unidad existe y tiene `count > 0`:
                *   Llamar a `MilitaryState.register_casualties(unit_id, unit_data.count)` para eliminarla.
        *   Terminar la función para esta misión.
    *   **Si `return_tile` es válido:**
        *   Continuar con la lógica existente:
            *   Calcular `total_reduction`.
            *   Distribuir la reducción con `MilitaryState.register_casualties`.
            *   Actualizar ubicación de supervivientes con `MilitaryState.update_unit_location(unit_id, "tile", return_tile)`.

## Diagrama de Flujo (Mermaid)

```mermaid
graph TD
    A[Misión Finalizada con Tropas Restantes] --> B{Llamar a _return_units_to_player};
    B --> C{Llamar a GameState.get_player_capital_coords (prioriza ciudades)};
    C --> D{¿Tile Válido Devuelto?};
    D -- Sí --> E[return_tile = Tile Válido (Ciudad o primer tile)];
    D -- No (Jugador sin tiles) --> F{Registrar Pérdida Total};
    F --> G[Para cada unit_id de la misión:];
    G --> H{Llamar a MilitaryState.register_casualties(unit_id, count_completo)};
    H --> I[Log: Tropas perdidas por falta de territorio];
    I --> Z[Fin del Retorno para esta Misión];
    E --> K[Calcular Reducción Total (Bajas/Costo de Misión)];
    K --> L{Distribuir Reducción con MilitaryState.register_casualties};
    L --> M{Actualizar Ubicación de Unidades Supervivientes a return_tile con MilitaryState.update_unit_location};
    M --> Z;
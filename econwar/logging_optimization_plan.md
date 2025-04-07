---
date: 2025-04-03T16:27:03
---
# Plan de Optimización del Logging de Eventos

## Objetivo

Optimizar el sistema de logging de eventos para reducir la carga en la base de datos y el uso de almacenamiento, identificando eventos de alta frecuencia cuyo valor informativo puede preservarse con estrategias menos granulares.

## Análisis y Candidatos para Optimización

Basado en la revisión del código (`scripts/event_logger.gd`) y las llamadas a `EventLogger.add_event`, se identificaron los siguientes tipos de eventos como candidatos para optimización:

1.  **`PLAYER`, "population_growth":** Potencialmente muy frecuente si se registra por unidad o tick.
2.  **`RESOURCE`, "resource_update":** El logging basado en umbrales porcentuales puede generar ruido si los valores fluctúan cerca del umbral.
3.  **`PLAYER`, "population_distribution_changed":** Acciones rápidas del jugador podrían generar múltiples logs seguidos.
4.  **`PLAYER`/`BATTLE`, "expansion_success"`/`"expansion_failed"`:** Posiblemente redundantes si ya existe un evento resumen `expansion_completed`.
5.  **Varios Eventos UI (`PLAYER`/`GAME`):** Logs de clics inválidos, informativos (`ui_expansion_invalid`, `ui_territory_info`, etc.) pueden ser excesivos y de bajo valor analítico a largo plazo.

## Estrategias de Optimización Propuestas

1.  **Crecimiento de Población (`PLAYER`, "population_growth"):**
    *   **Estrategia:** Logging por Intervalos.
    *   **Detalle:** Registrar la población total por jugador cada N segundos (ej. 60 segundos) en lugar de cada cambio. Mover la llamada a `add_event` a una función temporizada.
    *   **Datos Ejemplo:** `{ "player_id": X, "total_population": Y, "interval_seconds": 60 }`

2.  **Actualización de Recursos (`RESOURCE`, "resource_update"):**
    *   **Estrategia:** Umbral con Cooldown/Debounce o Logging por Intervalos.
    *   **Detalle:** Mantener el umbral porcentual pero añadir un cooldown (ej. 10-30 segundos) después de registrar un evento para ese recurso/jugador. Alternativamente, registrar todos los niveles de recursos para un jugador periódicamente (ej. 30-60 segundos).
    *   **Datos Ejemplo (Intervalo):** `{ "player_id": X, "resources": { "gold": G, "food": F, ... }, "interval_seconds": 30 }`

3.  **Distribución de Población (`PLAYER`, "population_distribution_changed"):**
    *   **Estrategia:** Cooldown/Debounce.
    *   **Detalle:** Añadir un cooldown corto (ej. 5-10 segundos) después de registrar un cambio para el mismo jugador para filtrar ajustes rápidos.
    *   **Datos:** (Mismos datos, menor frecuencia)

4.  **Éxito/Fallo de Expansión (Individual) (`PLAYER`/`BATTLE`, "expansion_success"`/`"expansion_failed"`):**
    *   **Estrategia:** Consolidar en Resumen.
    *   **Detalle:** Eliminar los logs individuales. Asegurar que el evento resumen `expansion_completed` contenga toda la información necesaria (resultado, participantes, territorio, bajas, duración, etc.).
    *   **Datos (Resumen - Asegurar):** `{ "action": "expansion_completed", "success": true/false, "attacker_id": A, "defender_id": D, "territory_id": T, "duration": S, "casualties": { ... }, ... }`

5.  **Eventos de UI Menores (`PLAYER`/`GAME`):**
    *   **Estrategia:** Logging Selectivo / Muestreo / Eliminación.
    *   **Detalle:**
        *   *Eliminar* logs puramente informativos (`ui_territory_info`).
        *   *Considerar eliminar o muestrear* logs de intentos inválidos/cooldowns (`ui_expansion_invalid`, `ui_expansion_cooldown`).
        *   *Mantener* logs de comandos explícitos del usuario (`ui_expansion_command`).
    *   **Datos:** (Eliminar o muestrear eventos existentes)

## Diagrama de Flujo (Propuesta)

```mermaid
graph TD
    subgraph Current Logging (High Frequency)
        A[Population Unit Change] --> L(Log: population_growth)
        B[Resource Fluctuation] --> L2(Log: resource_update)
        C[Worker Reallocation] --> L3(Log: population_distribution_changed)
        D[Expansion Step Success/Fail] --> L4(Log: expansion_success/failed)
        E[Invalid UI Click] --> L5(Log: ui_expansion_invalid)
        F[Info UI Click] --> L6(Log: ui_territory_info)
    end

    subgraph Proposed Logging (Optimized)
        G[Timer (e.g., 60s)] --> L_Opt1(Log Summary: population_total)
        H[Resource Change + Cooldown] --> L_Opt2(Log Summary: resource_levels OR Log: resource_update (debounced))
        I[Worker Reallocation + Cooldown] --> L_Opt3(Log: population_distribution_changed (debounced))
        J[Expansion End] --> L_Opt4(Log Summary: expansion_completed)
        K[Invalid UI Click] --> R1(REMOVE / SAMPLE Log)
        L[Info UI Click] --> R2(REMOVE Log)
    end

    style L fill:#f9f,stroke:#333,stroke-width:2px
    style L2 fill:#f9f,stroke:#333,stroke-width:2px
    style L3 fill:#f9f,stroke:#333,stroke-width:2px
    style L4 fill:#f9f,stroke:#333,stroke-width:2px
    style L5 fill:#f9f,stroke:#333,stroke-width:2px
    style L6 fill:#f9f,stroke:#333,stroke-width:2px

    style L_Opt1 fill:#9cf,stroke:#333,stroke-width:2px
    style L_Opt2 fill:#9cf,stroke:#333,stroke-width:2px
    style L_Opt3 fill:#9cf,stroke:#333,stroke-width:2px
    style L_Opt4 fill:#9cf,stroke:#333,stroke-width:2px
    style R1 fill:#ccc,stroke:#333,stroke-width:2px
    style R2 fill:#ccc,stroke:#333,stroke-width:2px

```

## Nota Importante

Al implementar estos cambios, se debe tener cuidado de modificar únicamente las llamadas a `EventLogger.add_event` y no afectar las llamadas existentes a `DebugConfig.log_game` u otros sistemas de logging/debug.
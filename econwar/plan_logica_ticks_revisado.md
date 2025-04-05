# Plan Revisado: Lógica de Ticks y Tiempo Real

Este documento describe la arquitectura propuesta para separar la lógica basada en ticks de la lógica en tiempo real, introduciendo un segundo tick para las acciones militares.

## Problema Identificado

El análisis inicial reveló que `ResourceManager.process_resources` y `PopulationManager.process_unassigned_population` eran llamadas tanto desde `GameTickManager` (cada 1s, con delta=1.0) como desde `GameController._process` (cada frame, con delta variable). Esto causaba un doble procesamiento y una progresión incorrecta del juego.

## Arquitectura Propuesta

Se implementarán dos sistemas de ticks distintos y se ajustará la lógica en tiempo real:

1.  **Tick Económico/Poblacional (1 segundo):**
    *   Gestionado por el timer existente (`tick_timer`) en `GameTickManager`.
    *   La señal `timeout` (`_on_global_tick`) llamará **únicamente** a:
        *   `ResourceManager.process_resources(1.0)`
        *   `PopulationManager.process_unassigned_population(player_idx, 1.0)`

2.  **Tick Militar (0.25 segundos):**
    *   Se añadirá un **nuevo Timer** (`expansion_timer`) en `GameTickManager` configurado a **0.25 segundos**.
    *   Su señal `timeout` se conectará a una nueva función (ej. `_on_expansion_tick`).
    *   La función `_on_expansion_tick` llamará a una función en `ExpansionManager` (ej. `ExpansionManager.process_expansions_tick()`) para procesar un paso de las expansiones/ataques activos.

3.  **Lógica en Tiempo Real (`_process`):**
    *   **`GameController._process(delta)`:**
        *   **Eliminará** las llamadas a `process_resources`, `process_unassigned_population` y `process_pending_expansions`.
        *   Su principal responsabilidad será actualizar el `GameTimeSystem` (`GameTimeSystem.update(delta)`).
    *   **`main.gd/_process(delta)`:**
        *   Continuará manejando la **UI, Input del usuario y Cámara**.
        *   El **renderizado del mapa** (`map_renderer.render_map()`) se ajustará para ejecutarse cada **0.25 segundos** (cambiando `render_interval = 0.25`).

## Diagrama Conceptual

```mermaid
graph TD
    subgraph Tick-Based (GameTickManager)
        TICK_1s[Tick Event (1s)] -->|delta=1.0| RM(ResourceManager.process_resources)
        TICK_1s -->|delta=1.0| PM(PopulationManager.process_unassigned_population)

        TICK_025s[Tick Event (0.25s)] --> EM_Tick(ExpansionManager.process_expansions_tick) ;
    end

    subgraph Real-Time (GameController._process)
         FRAME[Frame Event] -->|delta| GT(GameTimeSystem.update)
         NOTE_GC[GameController solo actualiza tiempo]
    end

    subgraph Real-Time (main.gd)
        FRAME -->|delta, render_interval=0.25s| UI(UI Update / Render Map) ;
        INPUT[User Input] -->|event| INP_H(Input Handling)
        INP_H --> EM_Start(ExpansionManager.expand_territory) ;
        INP_H --> CAM(Camera Control)
    end

    style RM fill:#cfc,stroke:#333,stroke-width:2px
    style PM fill:#cfc,stroke:#333,stroke-width:2px
    style EM_Tick fill:#ffc,stroke:#333,stroke-width:2px
    style UI fill:#ccf,stroke:#333,stroke-width:2px
```

## Pasos de Implementación

1.  Modificar `GameTickManager` para añadir el segundo timer (`expansion_timer`) y la nueva función conectada (`_on_expansion_tick`).
2.  Modificar `GameController._process` para eliminar las llamadas a los managers de recursos, población y expansión.
3.  Crear/Adaptar la función `process_expansions_tick` en `ExpansionManager` para ser llamada desde `_on_expansion_tick`.
4.  Modificar `main.gd` para cambiar `render_interval` a `0.25`.
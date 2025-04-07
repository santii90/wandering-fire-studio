---
date: 2025-04-05T13:14:18
order: 994000
---
# Plan de Refactorización Detallado para `main.gd`

## 1. Introducción

El script `scripts/main.gd` actualmente concentra una gran cantidad de responsabilidades, actuando como una "God Class". Esto dificulta el mantenimiento, la depuración y la adición de nuevas funcionalidades. El objetivo de esta refactorización es desacoplar estas responsabilidades en scripts más pequeños y enfocados, mejorando la organización y escalabilidad del proyecto.

## 2. Análisis de Responsabilidades Identificadas en `main.gd`

Se han identificado las siguientes áreas lógicas principales mezcladas en `main.gd`:

*   **A) Gestión de UI Principal:** Control general de la interfaz (paneles, leyenda, visor eventos, debug), actualización de etiquetas/sliders.
*   **B) Manejo de Input del Juego:** Procesamiento de clicks del ratón (expansión, ataque, info) y teclas (cambio vista, jugador, toggles UI).
*   **C) Orquestación de la Escena Principal:** Inicialización (`_ready`), bucle principal (`_process`), conexión inicial de señales.
*   **D) Control de Cámara (Parcial):** Inicialización y lógica de centrado.
*   **E) Renderizado del Mapa (Parcial):** Llamadas al renderizado y gestión de visibilidad de capas.
*   **F) Configuración y Constantes:** Variables de configuración inicial, constantes de colores, enums.
*   **G) Lógica de Depuración (Parcial):** Activación de validaciones, impresión de datos.
*   **H) Gestión de Hilos (Workers):** Inicialización y procesamiento.
*   **I) Caché de Territorios:** Lógica de caché para optimización.

## 3. Propuesta de Estructura de Carpetas Refinada

Se propone la siguiente estructura para organizar los scripts nuevos y existentes:

```
scripts/
|-- main.gd                 # Script raíz (MUY reducido tras refactorización)
|-- global.gd               # (Autoload, revisar necesidad)
|-- event_logger.gd         # (Autoload)
|-- game_tick_manager.gd    # (Autoload)
|-- game_controller.gd      # (Autoload)
|-- debug_config.gd         # (Autoload)
|-- tileset_manager.gd      # (Pendiente decisión ubicación)
|-- common/
|   |-- constants.gd        # <-- Mover constantes de main.gd aquí
|   |-- directions.gd
|   |-- game_state.gd       # (Autoload)
|   |-- terrain_data.gd
|   |-- utils.gd            # <-- Mover utilidades de main.gd aquí
|-- core/
|   |-- map/
|   |   |-- map_generator.gd # <-- MOVER aquí
|   |-- game_logic/
|   |   |-- expansion_manager.gd # (Autoload)
|   |   |-- population_manager.gd # (Autoload)
|   |   |-- resource_manager.gd # (Autoload)
|   |   |-- strategic_ai.gd # (Autoload)
|   |   |-- territory_manager.gd # (Autoload)
|   |   |-- ExpansionLogic.gd   # <-- NUEVO (Opcional)
|   |   |-- CombatLogic.gd      # <-- NUEVO (Opcional)
|-- systems/
|   |-- border_cache_system.gd # (Autoload)
|   |-- game_time_system.gd # (Autoload)
|   |-- worker_thread_system.gd # <-- MOVER aquí
|-- ui/
|   |-- MainUIManager.gd      # <-- NUEVO
|   |-- InputHandler.gd       # <-- NUEVO
|   |-- CameraController.gd   # <-- MOVER aquí
|   |-- MapRenderer.gd        # <-- MOVER aquí
|   |-- PerformanceOverlay.gd # <-- MOVER aquí
|   |-- legend/
|   |   |-- LegendPanel.gd      # <-- NUEVO
|   |-- bottom_panel/
|   |   |-- BottomPanelManager.gd # <-- NUEVO
|   |   |-- PopulationPanel.gd  # <-- NUEVO
|   |   |-- MilitaryPanel.gd    # <-- NUEVO
|   |   |-- InfrastructurePanel.gd # <-- NUEVO
|   |   |-- ResourcesPanel.gd   # <-- NUEVO
|   |   |-- DiplomacyPanel.gd   # <-- NUEVO
|   |   |-- EventPanel.gd       # <-- NUEVO
|   |-- right_sidebar/
|   |   |-- AttackInfoPanel.gd  # <-- NUEVO
|   |-- top_panel/
|   |   |-- TopPanel.gd         # <-- NUEVO (Opcional)
|   |-- event_viewer/
|   |   |-- EventViewer.gd      # <-- MOVER aquí
|   |   |-- EventItem.gd        # <-- MOVER aquí
|   |-- debug/
|   |   |-- DebugPanel.gd       # <-- MOVER aquí
|   |-- common/
|   |   |-- FormattedLabel.gd   # <-- NUEVO (Opcional)
```

## 4. Descripción de Nuevos Scripts Clave

*   **`MainUIManager.gd`:** Orquesta la UI principal, gestiona paneles de alto nivel y conecta señales globales a actualizaciones de UI.
*   **`InputHandler.gd`:** Gestiona input del juego (clicks mapa, teclas), verifica colisiones con UI y emite señales para acciones.
*   **Scripts de Paneles Específicos (ej: `PopulationPanel.gd`):** Controlan su propio panel, manejan sus controles internos y se conectan a Autoloads para auto-actualizarse.
*   **`BottomPanelManager.gd`:** Gestiona la barra de tabs inferior y los paneles expandibles asociados.

## 5. Resultado Esperado para `main.gd`

El script `main.gd` se reducirá significativamente, actuando solo como punto de entrada y orquestador inicial:

*   Mantendrá referencias mínimas a nodos con scripts principales (`MainUIManager`, `InputHandler`, etc.).
*   En `_ready()`: Llamará a `GameController.setup_new_game()` y a inicializadores de los scripts principales.
*   En `_process()`: Delegará a `GameController._process()` y otros si es necesario.
*   **Eliminará:** La mayoría de referencias `@onready` a UI, funciones de actualización UI, lógica de input, constantes, etc.

## 6. Diagrama Simplificado de la Arquitectura Propuesta

```mermaid
graph TD
    subgraph Autoloads [Autoloads (Singletons)]
        GameState
        GameController
        PopulationManager
        ResourceManager
        ExpansionManager
        EventLogger
        Constants
        DebugConfig
        %% ... otros ...
    end

    subgraph SceneTree [Nodos Principales en Main.tscn]
        MainNode(Root - main.gd) --> InputHandlerNode(InputHandler.gd)
        MainNode --> UIManagerNode(MainUIManager.gd)
        MainNode --> CameraControllerNode(CameraController.gd)
        MainNode --> MapRendererNode(MapRenderer.gd)
        MainNode --> TileMapNode(TileMap)
        MainNode --> CameraNode(Camera2D)
        MainNode --> UINode(UI Root)
    end

    subgraph UINodeChildren [Jerarquía UI (Gestionada por MainUIManager)]
        UIManagerNode -- Manages --> TopPanel
        UIManagerNode -- Manages --> BottomPanelManagerNode(BottomPanelManager.gd)
        UIManagerNode -- Manages --> LegendPanelNode(LegendPanel.gd)
        UIManagerNode -- Manages --> AttackInfoPanelNode(AttackInfoPanel.gd)
        UIManagerNode -- Manages --> EventViewerNode(EventViewer.gd)
        UIManagerNode -- Manages --> DebugPanelNode(DebugPanel.gd)

        BottomPanelManagerNode -- Manages --> PopulationPanelNode(PopulationPanel.gd)
        BottomPanelManagerNode -- Manages --> MilitaryPanelNode(MilitaryPanel.gd)
        %% ... otros paneles ...
    end

    %% Flujo de Datos e Interacciones (Ejemplos)
    InputHandlerNode -- Interacts --> GameState
    InputHandlerNode -- Calls --> ExpansionManager
    InputHandlerNode -- Emits Signals --> UIManagerNode

    UIManagerNode -- Listens --> GameState
    UIManagerNode -- Listens --> PopulationManager
    UIManagerNode -- Calls --> LegendPanelNode
    UIManagerNode -- Calls --> BottomPanelManagerNode

    PopulationPanelNode -- Listens/Calls --> PopulationManager
    AttackInfoPanelNode -- Listens --> ExpansionManager

    GameController -- Calls --> PopulationManager
    GameController -- Calls --> ResourceManager

    MapRendererNode -- Reads --> GameState
    MapRendererNode -- Reads --> TilesetManager
```

## 7. Estrategia de Refactorización Sugerida (Incremental)

1.  **Preparación y Movimientos Iniciales:**
    *   Crear rama Git.
    *   Mover utilidades y constantes de `main.gd` a `common/utils.gd` y `common/constants.gd`.
    *   Mover scripts existentes (`camera_controller`, `map_renderer`, `debug_panel`, etc.) a sus nuevas carpetas designadas (`ui/`, `core/`, `systems/`).
    *   Actualizar todas las referencias (`res://...`) en escenas y scripts.
    *   *Commit.*
2.  **Extraer Input Handler:**
    *   Crear `scripts/ui/InputHandler.gd`.
    *   Mover lógica de `_input`/`_unhandled_input` de `main.gd` a `InputHandler`.
    *   Reemplazar llamadas directas a UI por emisión de señales en `InputHandler`.
    *   Añadir nodo `InputHandler` a `Main.tscn`.
    *   *Commit.*
3.  **Extraer UI Manager:**
    *   Crear `scripts/ui/MainUIManager.gd`.
    *   Mover referencias `@onready` UI principales y lógica UI general de `main.gd` a `MainUIManager`.
    *   Conectar señales de `InputHandler` a `MainUIManager`.
    *   Añadir nodo `MainUIManager` a `Main.tscn`.
    *   *Commit.*
4.  **Refactorizar Paneles UI (Iterativo):**
    *   Para cada panel principal (Leyenda, Población, Militar, etc.):
        *   Crear su script específico (ej: `scripts/ui/legend/LegendPanel.gd`).
        *   Mover lógica y referencias específicas del panel al nuevo script.
        *   Asignar script al nodo del panel en la escena.
        *   Actualizar `MainUIManager` (o crear `BottomPanelManager`) para delegar al script del panel.
        *   Conectar señales de Autoloads directamente en el script del panel para auto-actualización.
        *   *Commit por panel/grupo.*
5.  **Limpieza Final:**
    *   Revisar y limpiar `main.gd` (debería quedar mínimo).
    *   Limpiar `MainUIManager` e `InputHandler`.
    *   Revisar/refactorizar Autoload `global.gd`.
    *   Decidir ubicación final de `tileset_manager.gd`.
    *   Pruebas exhaustivas.
    *   *Commit final.*
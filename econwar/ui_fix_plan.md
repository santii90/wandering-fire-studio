# Plan de Corrección para Problemas de UI Post-Refactorización

## 1. Diagnóstico

Tras analizar los scripts `MainUIManager.gd`, `InputHandler.gd`, `BottomPanelManager.gd`, `PopulationPanel.gd` y la estructura de la escena `Main.tscn` (basada en la imagen proporcionada), se identificaron las siguientes causas probables para los problemas de la UI (paneles no abren, datos no actualizan):

*   **Rutas de Nodos Internos Incorrectas (Sospecha Principal):** Aunque las rutas a los nodos principales parecen correctas, es muy probable que las rutas `@onready` a los nodos *dentro* de `TopPanel`, `BottomTabBar` y `ExpandablePanelsContainer` sean incorrectas en `MainUIManager.gd` y `BottomPanelManager.gd`. Esto impediría encontrar los botones, etiquetas y paneles, bloqueando su funcionalidad.
*   **Conexiones de Señales Faltantes o Incorrectas:** Es necesario verificar que todas las señales (desde `InputHandler`, Autoloads, botones de pestañas) estén correctamente conectadas a sus respectivos manejadores en los scripts de UI correspondientes.
*   **Falta de Método `update_panel_data()`:** Algunos paneles individuales podrían no tener implementado el método necesario para actualizar su contenido cuando se muestran.

## 2. Plan de Corrección Propuesto

El objetivo es restaurar la funcionalidad de la UI asegurando que los nodos se encuentren correctamente y que las señales estén bien conectadas.

```mermaid
graph TD
    subgraph Archivos a Modificar
        A[scripts/ui/MainUIManager.gd]
        B[scripts/ui/bottom_panel/BottomPanelManager.gd]
        C[scripts/ui/bottom_panel/*.gd (Paneles individuales)]
        D[scripts/ui/legend/LegendPanel.gd]
        E[scripts/ui/right_sidebar/AttackInfoPanel.gd]
        F[scripts/ui/event_viewer/EventViewer.gd]
        G[scripts/ui/debug/DebugPanel.gd]
    end

    subgraph Tareas Principales
        T1(Verificar/Corregir Rutas Internas) --> A & B
        T2(Verificar/Corregir Conexiones Señales InputHandler) --> A
        T3(Verificar/Corregir Conexiones Señales Autoloads) --> A & C & D & E & F & G
        T4(Verificar/Corregir Conexiones Botones Pestaña) --> B
        T5(Asegurar método 'update_panel_data' en Paneles) --> C & D & E & F & G
    end

    T1 -- Corrige referencias a botones/labels en TopPanel --> A
    T1 -- Corrige referencias a botones en BottomTabBar --> A & B
    T1 -- Corrige referencias a paneles en ExpandablePanelsContainer --> B

    T2 -- Conecta toggle_legend_pressed, etc. --> A

    T3 -- Conecta current_player_changed, resources_changed, etc. --> A
    T3 -- Conecta señales específicas (population_distribution_changed, etc.) --> C & D & E & F & G

    T4 -- Conecta pressed de PopulationTabButton, etc. --> B

    T5 -- Implementa/Verifica update_panel_data --> C & D & E & F & G

    %% Resultado Esperado
    Resultado(UI Funcional: Paneles abren, datos se actualizan)

    T1 & T2 & T3 & T4 & T5 --> Resultado
```

## 3. Pasos Detallados

1.  **Corregir Rutas de Nodos Internos:**
    *   **En `MainUIManager.gd`:** Revisar y corregir las rutas `@onready` para `player_info_label`, `resources_label`, `legend_button`, `events_button`, `debug_button`, `attack_info_tab_button`. **(Requiere inspección de los hijos de `TopPanel` y `BottomTabBar` en la escena)**.
    *   **En `BottomPanelManager.gd`:** Revisar y corregir las rutas `@onready` para todos los `...TabButton` (dentro de `BottomTabBar`) y todos los `...Panel` (dentro de `ExpandablePanelsContainer`). **(Requiere inspección de los hijos de `BottomTabBar` y `ExpandablePanelsContainer` en la escena)**.
2.  **Verificar/Corregir Conexiones de Señales:**
    *   **En `MainUIManager.gd` (`_ready` y `_setup_main_buttons`):**
        *   Asegurar que las señales de `InputHandler` (`toggle_player_layer_pressed`, `cycle_view_mode_pressed`, `next_player_pressed`, `toggle_legend_pressed`, `toggle_event_viewer_pressed`, `validate_population_pressed`, `toggle_debug_panel_pressed`) estén conectadas a los métodos correspondientes (`_on_...`, `toggle_legend_panel`, `show_events_viewer`, `toggle_debug_panel`).
        *   Asegurar que las señales de Autoloads (`PopulationManager.troop_counts_changed`, `ResourceManager.resources_changed`, `GameState.current_player_changed`) estén conectadas a `_update_ui_elements` y `_on_current_player_changed`.
        *   Asegurar que los botones principales (`legend_button`, `events_button`, `debug_button`, `attack_info_tab_button`) conecten su señal `pressed` a los métodos correctos (`toggle_legend_panel`, `show_events_viewer`, `toggle_debug_panel`, `toggle_right_sidebar`).
    *   **En `BottomPanelManager.gd` (`_connect_tab_buttons`):** Asegurar que la señal `pressed` de cada `...TabButton` esté conectada a `_on_tab_button_pressed.bind(panel_correspondiente)`.
    *   **En Scripts de Paneles Individuales (`_ready`):** Asegurar que cada panel se conecte a las señales de los Autoloads que necesita para actualizar sus datos (ej: `PopulationPanel` a `PopulationManager.population_distribution_changed`).
3.  **Asegurar `update_panel_data()`:**
    *   Verificar que todos los scripts de paneles que necesitan mostrar datos dinámicos (`MilitaryPanel.gd`, `InfrastructurePanel.gd`, `ResourcesPanel.gd`, `DiplomacyPanel.gd`, `EventPanel.gd`, `LegendPanel.gd`, `AttackInfoPanel.gd`) tengan implementado un método `update_panel_data()` (o similar) que obtenga y muestre la información más reciente de los Autoloads correspondientes.
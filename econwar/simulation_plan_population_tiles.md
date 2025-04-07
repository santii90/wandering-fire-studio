---
date: 2025-04-05T16:20:27
order: 996000
---
# Plan de Simulación: Población Estratificada y Desarrollo Emergente de Tiles

## 1. Visión General

Este plan describe un sistema de simulación mejorado para la población y los recursos, alejándose de los agregados globales y adoptando un enfoque **basado en tiles individuales del mapa**. Los objetivos clave son:

*   **Población Estratificada Emergente:** Las clases sociales (inicialmente Campesinos, Artesanos, Mercaderes) no son asignadas directamente, sino que emergen y cambian dinámicamente en cada tile según las condiciones económicas y sociales simuladas (riqueza, satisfacción de necesidades).
*   **Desarrollo de Tiles Impulsado por la Población:** El estado de desarrollo de un tile (ej. de "Llanura sin cultivar" a "Llanura cultivada") evoluciona basado en la actividad y composición de la población residente, afectando a su vez la productividad y atractivo del tile.
*   **Interacciones Locales:** La simulación se centra en las interacciones dentro de cada tile (producción, consumo, transición de clase, desarrollo del tile), con mecanismos futuros para la interacción inter-tile (migración, comercio regional).

## 2. Estructura de Datos por Tile

Cada tile del mapa gestionará su propio estado demográfico y de desarrollo. Se propone la siguiente estructura (a implementar probablemente en `GameState` o un nuevo `TileDataManager`):

```gdscript
# Ejemplo de estructura de datos para un tile en GameState o similar
var tile_data = {
    "owner": PLAYER_ID, # Jugador que controla el tile
    "base_terrain_type": TerrainData.TERRAIN_TYPES.PLAINS, # Tipo de terreno fundamental (no cambia)
    "current_development": DEVELOPMENT_STATES.UNCULTIVATED, # Estado actual (cambia dinámicamente)
    "max_population_capacity": 100, # Límite actual de habitantes (depende de base_terrain y current_development)
    "current_total_population": 50, # Habitantes actuales
    "population_distribution": { # Distribución actual por clase
        "PEASANT": 45,
        "ARTISAN": 4,
        "MERCHANT": 1
    },
    "class_metrics": { # Métricas promedio por clase en este tile
        "PEASANT": {"avg_wealth": 5.2, "avg_satisfaction": 75.0},
        "ARTISAN": {"avg_wealth": 20.5, "avg_satisfaction": 65.0},
        "MERCHANT": {"avg_wealth": 150.0, "avg_satisfaction": 80.0}
    },
    # Otros datos específicos del tile: recursos locales, edificios, etc.
}
```

## 3. Constantes Clave

El sistema dependerá de constantes bien definidas (probablemente en `TerrainData`, `Constants` o un nuevo `SimulationConfig`) para guiar la simulación:

*   **Estados de Desarrollo (`DEVELOPMENT_STATES`):** Definir los posibles estados para cada `base_terrain_type` (ej. `UNCULTIVATED`, `CULTIVATED`, `LOGGED`, `MINED`, `URBAN_SPRAWL`, etc.).
*   **Capacidad de Población:** `BASE_CAPACITY[base_terrain_type]` y `DEVELOPMENT_CAPACITY_MODIFIER[current_development]`.
*   **Distribución Objetivo de Clases:** `TARGET_DISTRIBUTION[base_terrain_type][current_development]` (ej. `{ "PEASANT": 0.8, "ARTISAN": 0.1, ... }`). Define la "atracción" económica del tile desarrollado.
*   **Eficiencias de Producción:** `PRODUCTION_EFFICIENCY[class_type][resource_type][current_development]`.
*   **Necesidades por Clase:** `CLASS_NEEDS[class_type]` (lista de recursos y cantidades).
*   **Umbrales de Desarrollo:** Condiciones (ej. `% PEASANT > 70%` por `N` ticks) para pasar de un `current_development` a otro.
*   **Umbrales/Probabilidades de Transición de Clase:** Condiciones (riqueza, satisfacción, diferencia con objetivo) para que un habitante intente cambiar de clase.

## 4. Ciclo de Simulación por Tile

La simulación principal iterará sobre cada tile controlado, ejecutando las siguientes fases en orden:

```mermaid
graph TD
    Start[Inicio Ciclo Tile] --> ProdCon{1. Producción y Consumo};
    ProdCon --> Metrics{2. Actualizar Métricas de Clase};
    Metrics --> PopChange{3. Crecimiento/Decrecimiento Poblacional};
    PopChange --> DevChange{4. Evaluar/Aplicar Cambio Desarrollo Tile};
    DevChange --> ClassTrans{5. Evaluar/Aplicar Transición de Clase Interna};
    ClassTrans --> Migration(6. Evaluar/Aplicar Migración (Futuro));
    Migration --> End[Fin Ciclo Tile];

    style Start fill:#lightgrey,stroke:#333,stroke-width:2px
    style End fill:#lightgrey,stroke:#333,stroke-width:2px
```

1.  **Producción y Consumo:** Las clases en el tile producen recursos según su rol y la eficiencia del `current_development`. Intentan consumir los recursos definidos en `CLASS_NEEDS`.
2.  **Actualizar Métricas:** Se actualizan `avg_wealth` y `avg_satisfaction` para cada clase en el tile basado en el éxito de producción/consumo.
3.  **Crecimiento/Decrecimiento:** Si hay capacidad y buena satisfacción/recursos, `current_total_population` aumenta (añadiendo a la clase más necesitada según el objetivo). Si hay déficit severo, disminuye.
4.  **Cambio Desarrollo Tile:** Se verifican los umbrales. Si la composición poblacional (`population_distribution`) cumple las condiciones para un nuevo estado de desarrollo durante suficiente tiempo, se actualiza `current_development`.
5.  **Transición de Clase Interna:** Se comparan las métricas de clase y la distribución actual con la `target_distribution` (del `current_development` actual). Si se cumplen las condiciones, una fracción de la población intenta cambiar de clase (ajustando `population_distribution`).
6.  **Migración (Futuro):** Evaluar si la población debe moverse a tiles adyacentes por superpoblación o baja calidad de vida.

## 5. Implementación por Fases

Se propone un desarrollo iterativo:

1.  **Fase 1: Estructura y Constantes:**
    *   Definir e implementar la estructura de datos del tile en `GameState` (o similar).
    *   Definir las constantes iniciales para capacidad, distribución objetivo (Peasant, Artisan, Merchant) y eficiencia para los tipos de terreno base y el primer nivel de desarrollo (ej. `UNCULTIVATED`, `CULTIVATED`).
2.  **Fase 2: Simulación Base:**
    *   Implementar el cálculo de capacidad por tile.
    *   Implementar lógica básica de producción/consumo y crecimiento/decrecimiento poblacional por tile.
3.  **Fase 3: Desarrollo Emergente:**
    *   Implementar la lógica para que `current_development` cambie (ej. `UNCULTIVATED` -> `CULTIVATED`) basado en la población.
    *   Ajustar capacidades y eficiencias según el nuevo desarrollo.
4.  **Fase 4: Transición de Clase:**
    *   Implementar la lógica para que `population_distribution` cambie dinámicamente dentro del tile, tendiendo hacia el objetivo y basado en métricas.
5.  **Fase 5: Refinamiento y Expansión:**
    *   Ajustar y balancear constantes y umbrales.
    *   Añadir más clases, tipos de desarrollo, recursos y cadenas productivas.
    *   Implementar la migración inter-tile.
    *   Integrar la representación visual de los cambios de desarrollo.
    *   Considerar optimizaciones de rendimiento.

## 6. Consideraciones Adicionales

*   **Rendimiento:** Simular cada tile individualmente puede ser costoso. Explorar optimizaciones como:
    *   Procesar tiles por regiones.
    *   Actualizar tiles menos frecuentemente si no hay cambios significativos.
    *   Usar threads si es apropiado.
*   **Visualización:** Planificar cómo mostrar los cambios en `current_development` (cambio de sprite/tile gráfico) y potencialmente la `population_distribution` (iconos, tooltips).
*   **Interacción con ResourceManager:** Definir si los recursos son puramente locales al tile o si existe un mercado/almacén regional/global gestionado por `ResourceManager` con el que los tiles interactúan.

## 7. Sistema de Población Militar (Rediseño)

Este sistema reemplaza la asignación directa de tropas y logística basada en porcentajes globales del antiguo `PopulationManager`.

*   **Asignación Estratégica:** El jugador define dos parámetros globales (probablemente mediante sliders en la UI):
   *   **% Asignación Militar:** Porcentaje de la *población total* del jugador que se desea dedicar al ejército. Esto determina una `target_military_population`.
   *   **% Ratio Logístico:** Porcentaje del *personal militar actual* que se asignará a tareas de logística (`logistics_personnel`), el resto serán tropas de combate (`combat_troops`).
*   **Contadores Globales:** Los valores `current_military_population`, `combat_troops` y `logistics_personnel` se almacenan globalmente por jugador (ej. en `GameState.resource_map` o un nuevo `MilitaryState`).
*   **Reclutamiento/Desmovilización:**
   *   Un proceso global (ej. en `GameTickManager` o un nuevo `MilitaryManager`) compara `current_military_population` con `target_military_population`.
   *   Si hay déficit, se intentará reclutar nuevos efectivos hasta alcanzar el objetivo, limitado por una tasa de reclutamiento y la disponibilidad de población civil (preferentemente `PEASANT`).
   *   El reclutamiento reduce la población civil (`PEASANT`) distribuida en los tiles del jugador. Se necesita un mecanismo para aplicar esta reducción (ej. proporcionalmente, o en tiles específicos con edificios militares).
   *   Si hay excedente, el personal militar se desmoviliza gradualmente, volviendo a la población civil (ej. como `PEASANT` en tiles con capacidad).
*   **Necesidades Militares:** El personal militar (`combat_troops` + `logistics_personnel`) consume recursos globales (ej. `FOOD`, `GOLD`) gestionados por `ResourceManager` (o un sistema dedicado).
*   **Efecto Logístico:** El ratio de `logistics_personnel` afectará la eficiencia del ejército (ej. menor consumo de suministros, bonus de combate, velocidad de movimiento).
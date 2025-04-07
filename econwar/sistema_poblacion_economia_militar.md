---
date: 2025-04-07T17:27:21
order: 996000
---
# Guía para Jugadores: Población, Economía y Ejército (Detallado)

Este juego simula una nación compleja donde la población, la economía, el desarrollo local y el poder militar están profundamente interconectados. Entender cómo funcionan estos sistemas en detalle es clave para tu éxito.

## La Vida en un Tile: El Corazón de la Simulación

Tu nación no es solo un conjunto de números globales; la verdadera acción ocurre en cada **tile** (casilla) individual que controlas. Cada tile tiene su propia población, desarrollo y economía local.

*   **Terreno Base y Desarrollo:** Cada tile tiene un `base_terrain_type` (Llanura, Bosque, Montaña, etc.) que no cambia. Sin embargo, su `current_development` (estado actual) sí evoluciona. Un tile puede empezar como `UNCULTIVATED` (Sin cultivar) y, con el tiempo y la población adecuada, convertirse en `CULTIVATED` (Cultivado), `MINED` (Minado), etc.
*   **Capacidad de Población Local:** La cantidad máxima de personas que pueden vivir en un tile (`max_population_capacity`) depende tanto del terreno base como de su desarrollo actual. Por ejemplo, un tile `CULTIVATED` puede albergar un 50% más de población que uno `UNCULTIVATED` del mismo tipo base. Las ciudades otorgan un bonus adicional significativo a la capacidad *total* de tu nación.
*   **Distribución de Clases:** La población dentro de un tile se divide en clases sociales:
    *   **Campesinos (Peasants):** La base de la población, cruciales para la producción de comida y el reclutamiento.
    *   **Artesanos (Artisans):** Producen bienes más complejos (mecánica futura).
    *   **Mercaderes (Merchants):** Facilitan el comercio (mecánica futura).
    La proporción de cada clase (`population_distribution`) cambia dinámicamente.
*   **El Ciclo de Simulación del Tile (Cada Segundo):** Dentro de cada tile ocurren varias fases:
    1.  **Producción y Consumo:** Los habitantes producen recursos según su clase y el desarrollo del tile. La eficiencia varía; por ejemplo, un Campesino en un tile `CULTIVATED` produce comida a una tasa de 0.15 unidades/segundo, mientras que en uno `UNCULTIVATED` solo produce 0.08. Toda la población del tile consume recursos, principalmente comida (aprox. 0.05 unidades/persona/segundo). El resultado es el `net_food_balance_local` del tile.
    2.  **Actualización de Métricas:** La satisfacción de la población en el tile se ajusta ligeramente basada en el balance de comida local (un excedente aumenta la satisfacción, un déficit la reduce). También se simula la riqueza (mecánica futura).
    3.  **Crecimiento/Decrecimiento Poblacional:** ¡Esta es la fase clave!
        *   **Condición 1: Capacidad Local:** Solo puede haber crecimiento si `Población Actual < Capacidad del Tile`.
        *   **Condición 2: ¡Balance Nacional de Comida!** El crecimiento **solo** ocurre si tu nación tiene un excedente neto de comida (`national_food_balance > 0`).
        *   **Tasas de Crecimiento:**
            *   **Óptima:** Si hay excedente nacional Y local, la población crece un **0.5%** por segundo (`BASE_GROWTH_RATE_PERCENT`).
            *   **Colonización:** Si hay excedente nacional PERO déficit local, el crecimiento es más lento, un **0.1%** por segundo (`BASE_GROWTH_RATE_COLONIZE_PERCENT`).
            *   **Sin Crecimiento:** Si el balance nacional es 0 o negativo, **no hay crecimiento**, incluso si hay espacio y excedente local.
        *   **Nuevos Habitantes:** La población que crece se añade como Campesinos.
        *   **Decrecimiento:** La población disminuye un **1.0%** por segundo (`BASE_DECAY_RATE_PERCENT`) si hay déficit nacional de comida, o si las condiciones locales son muy malas (déficit local severo o satisfacción muy baja, < 20%). La pérdida se reparte proporcionalmente entre las clases.
    4.  **Cambio de Desarrollo (Menos Frecuente):** Cada pocos segundos, el juego verifica si la composición de la población cumple las condiciones para cambiar el estado de desarrollo del tile. Por ejemplo, si más del 60% de la población son Campesinos durante un tiempo, un tile `UNCULTIVATED` puede pasar a `CULTIVATED`, aumentando su capacidad y eficiencia productiva.
    5.  **Transición de Clase (Menos Frecuente):** También cada pocos segundos, los habitantes pueden intentar cambiar de clase social. Un Campesino con suficiente riqueza y satisfacción podría intentar convertirse en Artesano si hay "demanda" (oportunidad económica) para esa clase en el tile según su desarrollo actual. Igualmente, un Artesano infeliz podría volver a ser Campesino.

## La Población Nacional: Agregado de los Tiles

Los números que ves a nivel nacional son la suma de lo que ocurre en todos tus tiles:

*   **Población Total (`total_population`):** La suma de `current_total_population` de todos tus tiles.
*   **Capacidad Total (`total_population_capacity`):** La suma de `max_population_capacity` de todos tus tiles, más los bonus por ciudades.
*   **Totales por Clase:** La suma de Campesinos, Artesanos, etc., de todos tus tiles.
*   **¡El Límite Real es la Comida!** Recuerda, aunque tu capacidad total sea alta, tu población dejará de crecer si tu `national_food_balance` no es positivo.

## La Economía: El Motor de Comida

*   **Balance Nacional:** La suma de los balances de comida locales de todos tus tiles. Es el indicador clave para el crecimiento poblacional.
*   **Producción vs. Consumo:** Necesitas que la producción total de tus Campesinos (influenciada por su número y el desarrollo de los tiles) supere el consumo total de toda tu población (civiles + militares) para mantener un balance positivo. (Consumo civil ~0.05/persona/seg, militar ~0.08/persona/seg).

## El Ejército: Estructura y Gestión

Tu ejército tiene una estructura más compleja que un simple número.

*   **Población Militar Global:** El número total de personas en servicio militar (`current_military_population`) se almacena globalmente. Este personal se resta de tu población civil total disponible.
*   **Objetivos Estratégicos (Sliders UI):**
    *   **% Asignación Militar:** Define qué porcentaje de tu *población total* deseas tener en el ejército (`target_military_population`).
    *   **% Ratio Logístico:** Define qué porcentaje de tu *población militar actual* se dedicará a logística (por defecto ~20%). El resto serán tropas de combate. Este ratio afecta la eficiencia del ejército.
*   **Reclutamiento (Automático):**
    1.  Cada segundo, el juego compara tu `current_military_population` con tu `target_military_population`.
    2.  Si faltan efectivos, calcula cuántos puede reclutar basado en tu población total y la tasa de reclutamiento (**0.1%** de la población total por segundo - `MILITARY_RECRUITMENT_RATE`).
    3.  Intenta extraer esa cantidad de Campesinos de tus tiles (`TileSimulationManager.recruit_civilians`).
    4.  Los reclutas reales se añaden a unidades militares existentes (o se crean nuevas unidades) en un tile específico (ej. tu capital) como Tropas de Combate o Personal de Logística, según tu ratio objetivo (`MilitaryState.add_or_reinforce_units`).
*   **Desmovilización (Automático):**
    1.  Si tienes más personal militar del objetivo, el juego calcula cuántos desmovilizar basado en la población militar actual y la tasa de desmovilización (**0.2%** de la población militar por segundo - `MILITARY_DEMOBILIZATION_RATE`).
    2.  Se eliminan unidades del registro militar (`MilitaryState.remove_or_reduce_units`), priorizando logística y unidades más pequeñas.
    3.  Esa cantidad de población vuelve al estado civil como Campesinos, distribuyéndose en tiles con capacidad disponible (`TileSimulationManager.demobilize_to_civilians`).
*   **Seguimiento de Unidades (`MilitaryState`):** Tu ejército no es una masa informe. Se compone de **unidades individuales** rastreadas por el sistema `MilitaryState`. Cada unidad tiene:
    *   Un ID único.
    *   Tipo: "combat" o "logistics".
    *   Cantidad (`count`): Número de soldados en la unidad (máximo 100 por unidad).
    *   Ubicación: Puede estar en un `tile` específico (Vector2i) o en una `mission` (ID de la misión).
*   **Despliegue y Misiones:** Cuando envías tropas a una misión (ataque, expansión), el sistema (`ExpansionManager`) busca unidades de combate disponibles en tus tiles consultando `MilitaryState`. Las unidades seleccionadas (pueden dividirse si es necesario) cambian su ubicación a "mission".
*   **Bajas en Combate:** Las bajas se aplican a unidades específicas (`MilitaryState.register_casualties`), reduciendo su `count`. Si una unidad llega a 0, desaparece. Las bajas también reducen tus contadores militares globales y, crucialmente, tu `total_population` base (son pérdidas permanentes).
*   **Mantenimiento:** El ejército consume recursos constantemente. Cada persona militar consume **0.08** unidades de comida por segundo y **0.01** unidades de oro por segundo (`MILITARY_FOOD_CONSUMPTION_RATE`, `MILITARY_GOLD_COST_RATE`).

## Consejos Avanzados

*   **Especialización de Tiles:** Observa cómo evoluciona el desarrollo de tus tiles. Fomenta la agricultura (`CULTIVATED`) en llanuras fértiles para maximizar la producción de comida.
*   **Transiciones de Clase:** Si necesitas más Artesanos o Mercaderes (para mecánicas futuras), asegúrate de que las condiciones de riqueza y satisfacción en algunos tiles sean lo suficientemente buenas para que los Campesinos asciendan.
*   **Impacto del Reclutamiento:** Reclutar muchos soldados reducirá tu número de Campesinos, lo que puede afectar negativamente tu producción de comida si no tienes cuidado.
*   **Logística Militar:** No ignores el ratio logístico. Un buen porcentaje de logística puede mejorar la eficiencia de tus tropas de combate.
*   **El Coste Real del Ejército:** Recuerda que el ejército no solo cuesta población para reclutar, sino también comida y oro para mantener cada segundo.

¡Con este conocimiento detallado, estás mejor preparado para gestionar las complejidades de tu nación y alcanzar la victoria!
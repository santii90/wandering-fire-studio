import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Plan de Simulación: Población Estratificada y Desarrollo Emergente de Tiles","description":"","frontmatter":{},"headers":[],"relativePath":"econwar/simulation_plan_population_tiles.md","filePath":"econwar/simulation_plan_population_tiles.md"}');
const _sfc_main = { name: "econwar/simulation_plan_population_tiles.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="plan-de-simulacion-poblacion-estratificada-y-desarrollo-emergente-de-tiles" tabindex="-1">Plan de Simulación: Población Estratificada y Desarrollo Emergente de Tiles <a class="header-anchor" href="#plan-de-simulacion-poblacion-estratificada-y-desarrollo-emergente-de-tiles" aria-label="Permalink to &quot;Plan de Simulación: Población Estratificada y Desarrollo Emergente de Tiles&quot;">​</a></h1><h2 id="_1-vision-general" tabindex="-1">1. Visión General <a class="header-anchor" href="#_1-vision-general" aria-label="Permalink to &quot;1. Visión General&quot;">​</a></h2><p>Este plan describe un sistema de simulación mejorado para la población y los recursos, alejándose de los agregados globales y adoptando un enfoque <strong>basado en tiles individuales del mapa</strong>. Los objetivos clave son:</p><ul><li><strong>Población Estratificada Emergente:</strong> Las clases sociales (inicialmente Campesinos, Artesanos, Mercaderes) no son asignadas directamente, sino que emergen y cambian dinámicamente en cada tile según las condiciones económicas y sociales simuladas (riqueza, satisfacción de necesidades).</li><li><strong>Desarrollo de Tiles Impulsado por la Población:</strong> El estado de desarrollo de un tile (ej. de &quot;Llanura sin cultivar&quot; a &quot;Llanura cultivada&quot;) evoluciona basado en la actividad y composición de la población residente, afectando a su vez la productividad y atractivo del tile.</li><li><strong>Interacciones Locales:</strong> La simulación se centra en las interacciones dentro de cada tile (producción, consumo, transición de clase, desarrollo del tile), con mecanismos futuros para la interacción inter-tile (migración, comercio regional).</li></ul><h2 id="_2-estructura-de-datos-por-tile" tabindex="-1">2. Estructura de Datos por Tile <a class="header-anchor" href="#_2-estructura-de-datos-por-tile" aria-label="Permalink to &quot;2. Estructura de Datos por Tile&quot;">​</a></h2><p>Cada tile del mapa gestionará su propio estado demográfico y de desarrollo. Se propone la siguiente estructura (a implementar probablemente en <code>GameState</code> o un nuevo <code>TileDataManager</code>):</p><div class="language-gdscript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">gdscript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Ejemplo de estructura de datos para un tile en GameState o similar</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">var</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> tile_data </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;owner&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">PLAYER_ID</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Jugador que controla el tile</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;base_terrain_type&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">TerrainData</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">.TERRAIN_TYPES.PLAINS</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Tipo de terreno fundamental (no cambia)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;current_development&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">DEVELOPMENT_STATES.UNCULTIVATED</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Estado actual (cambia dinámicamente)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;max_population_capacity&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">100</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Límite actual de habitantes (depende de base_terrain y current_development)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;current_total_population&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">50</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Habitantes actuales</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;population_distribution&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: { </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Distribución actual por clase</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;PEASANT&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">45</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;ARTISAN&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">4</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;MERCHANT&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">1</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    },</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;class_metrics&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: { </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># Métricas promedio por clase en este tile</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;PEASANT&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: {</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_wealth&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">5.2</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_satisfaction&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">75.0</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">},</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;ARTISAN&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: {</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_wealth&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">20.5</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_satisfaction&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">65.0</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">},</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;MERCHANT&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: {</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_wealth&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">150.0</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;avg_satisfaction&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">80.0</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    },</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">    # Otros datos específicos del tile: recursos locales, edificios, etc.</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span></code></pre></div><h2 id="_3-constantes-clave" tabindex="-1">3. Constantes Clave <a class="header-anchor" href="#_3-constantes-clave" aria-label="Permalink to &quot;3. Constantes Clave&quot;">​</a></h2><p>El sistema dependerá de constantes bien definidas (probablemente en <code>TerrainData</code>, <code>Constants</code> o un nuevo <code>SimulationConfig</code>) para guiar la simulación:</p><ul><li><strong>Estados de Desarrollo (<code>DEVELOPMENT_STATES</code>):</strong> Definir los posibles estados para cada <code>base_terrain_type</code> (ej. <code>UNCULTIVATED</code>, <code>CULTIVATED</code>, <code>LOGGED</code>, <code>MINED</code>, <code>URBAN_SPRAWL</code>, etc.).</li><li><strong>Capacidad de Población:</strong> <code>BASE_CAPACITY[base_terrain_type]</code> y <code>DEVELOPMENT_CAPACITY_MODIFIER[current_development]</code>.</li><li><strong>Distribución Objetivo de Clases:</strong> <code>TARGET_DISTRIBUTION[base_terrain_type][current_development]</code> (ej. <code>{ &quot;PEASANT&quot;: 0.8, &quot;ARTISAN&quot;: 0.1, ... }</code>). Define la &quot;atracción&quot; económica del tile desarrollado.</li><li><strong>Eficiencias de Producción:</strong> <code>PRODUCTION_EFFICIENCY[class_type][resource_type][current_development]</code>.</li><li><strong>Necesidades por Clase:</strong> <code>CLASS_NEEDS[class_type]</code> (lista de recursos y cantidades).</li><li><strong>Umbrales de Desarrollo:</strong> Condiciones (ej. <code>% PEASANT &gt; 70%</code> por <code>N</code> ticks) para pasar de un <code>current_development</code> a otro.</li><li><strong>Umbrales/Probabilidades de Transición de Clase:</strong> Condiciones (riqueza, satisfacción, diferencia con objetivo) para que un habitante intente cambiar de clase.</li></ul><h2 id="_4-ciclo-de-simulacion-por-tile" tabindex="-1">4. Ciclo de Simulación por Tile <a class="header-anchor" href="#_4-ciclo-de-simulacion-por-tile" aria-label="Permalink to &quot;4. Ciclo de Simulación por Tile&quot;">​</a></h2><p>La simulación principal iterará sobre cada tile controlado, ejecutando las siguientes fases en orden:</p><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">graph TD</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Start[Inicio Ciclo Tile] --&gt; ProdCon{1. Producción y Consumo};</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    ProdCon --&gt; Metrics{2. Actualizar Métricas de Clase};</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Metrics --&gt; PopChange{3. Crecimiento/Decrecimiento Poblacional};</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    PopChange --&gt; DevChange{4. Evaluar/Aplicar Cambio Desarrollo Tile};</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    DevChange --&gt; ClassTrans{5. Evaluar/Aplicar Transición de Clase Interna};</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    ClassTrans --&gt; Migration(6. Evaluar/Aplicar Migración (Futuro));</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    Migration --&gt; End[Fin Ciclo Tile];</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style Start fill:#lightgrey,stroke:#333,stroke-width:2px</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style End fill:#lightgrey,stroke:#333,stroke-width:2px</span></span></code></pre></div><ol><li><strong>Producción y Consumo:</strong> Las clases en el tile producen recursos según su rol y la eficiencia del <code>current_development</code>. Intentan consumir los recursos definidos en <code>CLASS_NEEDS</code>.</li><li><strong>Actualizar Métricas:</strong> Se actualizan <code>avg_wealth</code> y <code>avg_satisfaction</code> para cada clase en el tile basado en el éxito de producción/consumo.</li><li><strong>Crecimiento/Decrecimiento:</strong> Si hay capacidad y buena satisfacción/recursos, <code>current_total_population</code> aumenta (añadiendo a la clase más necesitada según el objetivo). Si hay déficit severo, disminuye.</li><li><strong>Cambio Desarrollo Tile:</strong> Se verifican los umbrales. Si la composición poblacional (<code>population_distribution</code>) cumple las condiciones para un nuevo estado de desarrollo durante suficiente tiempo, se actualiza <code>current_development</code>.</li><li><strong>Transición de Clase Interna:</strong> Se comparan las métricas de clase y la distribución actual con la <code>target_distribution</code> (del <code>current_development</code> actual). Si se cumplen las condiciones, una fracción de la población intenta cambiar de clase (ajustando <code>population_distribution</code>).</li><li><strong>Migración (Futuro):</strong> Evaluar si la población debe moverse a tiles adyacentes por superpoblación o baja calidad de vida.</li></ol><h2 id="_5-implementacion-por-fases" tabindex="-1">5. Implementación por Fases <a class="header-anchor" href="#_5-implementacion-por-fases" aria-label="Permalink to &quot;5. Implementación por Fases&quot;">​</a></h2><p>Se propone un desarrollo iterativo:</p><ol><li><strong>Fase 1: Estructura y Constantes:</strong><ul><li>Definir e implementar la estructura de datos del tile en <code>GameState</code> (o similar).</li><li>Definir las constantes iniciales para capacidad, distribución objetivo (Peasant, Artisan, Merchant) y eficiencia para los tipos de terreno base y el primer nivel de desarrollo (ej. <code>UNCULTIVATED</code>, <code>CULTIVATED</code>).</li></ul></li><li><strong>Fase 2: Simulación Base:</strong><ul><li>Implementar el cálculo de capacidad por tile.</li><li>Implementar lógica básica de producción/consumo y crecimiento/decrecimiento poblacional por tile.</li></ul></li><li><strong>Fase 3: Desarrollo Emergente:</strong><ul><li>Implementar la lógica para que <code>current_development</code> cambie (ej. <code>UNCULTIVATED</code> -&gt; <code>CULTIVATED</code>) basado en la población.</li><li>Ajustar capacidades y eficiencias según el nuevo desarrollo.</li></ul></li><li><strong>Fase 4: Transición de Clase:</strong><ul><li>Implementar la lógica para que <code>population_distribution</code> cambie dinámicamente dentro del tile, tendiendo hacia el objetivo y basado en métricas.</li></ul></li><li><strong>Fase 5: Refinamiento y Expansión:</strong><ul><li>Ajustar y balancear constantes y umbrales.</li><li>Añadir más clases, tipos de desarrollo, recursos y cadenas productivas.</li><li>Implementar la migración inter-tile.</li><li>Integrar la representación visual de los cambios de desarrollo.</li><li>Considerar optimizaciones de rendimiento.</li></ul></li></ol><h2 id="_6-consideraciones-adicionales" tabindex="-1">6. Consideraciones Adicionales <a class="header-anchor" href="#_6-consideraciones-adicionales" aria-label="Permalink to &quot;6. Consideraciones Adicionales&quot;">​</a></h2><ul><li><strong>Rendimiento:</strong> Simular cada tile individualmente puede ser costoso. Explorar optimizaciones como: <ul><li>Procesar tiles por regiones.</li><li>Actualizar tiles menos frecuentemente si no hay cambios significativos.</li><li>Usar threads si es apropiado.</li></ul></li><li><strong>Visualización:</strong> Planificar cómo mostrar los cambios en <code>current_development</code> (cambio de sprite/tile gráfico) y potencialmente la <code>population_distribution</code> (iconos, tooltips).</li><li><strong>Interacción con ResourceManager:</strong> Definir si los recursos son puramente locales al tile o si existe un mercado/almacén regional/global gestionado por <code>ResourceManager</code> con el que los tiles interactúan.</li></ul><h2 id="_7-sistema-de-poblacion-militar-rediseno" tabindex="-1">7. Sistema de Población Militar (Rediseño) <a class="header-anchor" href="#_7-sistema-de-poblacion-militar-rediseno" aria-label="Permalink to &quot;7. Sistema de Población Militar (Rediseño)&quot;">​</a></h2><p>Este sistema reemplaza la asignación directa de tropas y logística basada en porcentajes globales del antiguo <code>PopulationManager</code>.</p><ul><li><strong>Asignación Estratégica:</strong> El jugador define dos parámetros globales (probablemente mediante sliders en la UI):</li><li><strong>% Asignación Militar:</strong> Porcentaje de la <em>población total</em> del jugador que se desea dedicar al ejército. Esto determina una <code>target_military_population</code>.</li><li><strong>% Ratio Logístico:</strong> Porcentaje del <em>personal militar actual</em> que se asignará a tareas de logística (<code>logistics_personnel</code>), el resto serán tropas de combate (<code>combat_troops</code>).</li><li><strong>Contadores Globales:</strong> Los valores <code>current_military_population</code>, <code>combat_troops</code> y <code>logistics_personnel</code> se almacenan globalmente por jugador (ej. en <code>GameState.resource_map</code> o un nuevo <code>MilitaryState</code>).</li><li><strong>Reclutamiento/Desmovilización:</strong></li><li>Un proceso global (ej. en <code>GameTickManager</code> o un nuevo <code>MilitaryManager</code>) compara <code>current_military_population</code> con <code>target_military_population</code>.</li><li>Si hay déficit, se intentará reclutar nuevos efectivos hasta alcanzar el objetivo, limitado por una tasa de reclutamiento y la disponibilidad de población civil (preferentemente <code>PEASANT</code>).</li><li>El reclutamiento reduce la población civil (<code>PEASANT</code>) distribuida en los tiles del jugador. Se necesita un mecanismo para aplicar esta reducción (ej. proporcionalmente, o en tiles específicos con edificios militares).</li><li>Si hay excedente, el personal militar se desmoviliza gradualmente, volviendo a la población civil (ej. como <code>PEASANT</code> en tiles con capacidad).</li><li><strong>Necesidades Militares:</strong> El personal militar (<code>combat_troops</code> + <code>logistics_personnel</code>) consume recursos globales (ej. <code>FOOD</code>, <code>GOLD</code>) gestionados por <code>ResourceManager</code> (o un sistema dedicado).</li><li><strong>Efecto Logístico:</strong> El ratio de <code>logistics_personnel</code> afectará la eficiencia del ejército (ej. menor consumo de suministros, bonus de combate, velocidad de movimiento).</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("econwar/simulation_plan_population_tiles.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const simulation_plan_population_tiles = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  simulation_plan_population_tiles as default
};

import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Plan de Refactorización Detallado para main.gd","description":"","frontmatter":{},"headers":[],"relativePath":"econwar/main_gd_refactor_plan.md","filePath":"econwar/main_gd_refactor_plan.md"}');
const _sfc_main = { name: "econwar/main_gd_refactor_plan.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="plan-de-refactorizacion-detallado-para-main-gd" tabindex="-1">Plan de Refactorización Detallado para <code>main.gd</code> <a class="header-anchor" href="#plan-de-refactorizacion-detallado-para-main-gd" aria-label="Permalink to &quot;Plan de Refactorización Detallado para \`main.gd\`&quot;">​</a></h1><h2 id="_1-introduccion" tabindex="-1">1. Introducción <a class="header-anchor" href="#_1-introduccion" aria-label="Permalink to &quot;1. Introducción&quot;">​</a></h2><p>El script <code>scripts/main.gd</code> actualmente concentra una gran cantidad de responsabilidades, actuando como una &quot;God Class&quot;. Esto dificulta el mantenimiento, la depuración y la adición de nuevas funcionalidades. El objetivo de esta refactorización es desacoplar estas responsabilidades en scripts más pequeños y enfocados, mejorando la organización y escalabilidad del proyecto.</p><h2 id="_2-analisis-de-responsabilidades-identificadas-en-main-gd" tabindex="-1">2. Análisis de Responsabilidades Identificadas en <code>main.gd</code> <a class="header-anchor" href="#_2-analisis-de-responsabilidades-identificadas-en-main-gd" aria-label="Permalink to &quot;2. Análisis de Responsabilidades Identificadas en \`main.gd\`&quot;">​</a></h2><p>Se han identificado las siguientes áreas lógicas principales mezcladas en <code>main.gd</code>:</p><ul><li><strong>A) Gestión de UI Principal:</strong> Control general de la interfaz (paneles, leyenda, visor eventos, debug), actualización de etiquetas/sliders.</li><li><strong>B) Manejo de Input del Juego:</strong> Procesamiento de clicks del ratón (expansión, ataque, info) y teclas (cambio vista, jugador, toggles UI).</li><li><strong>C) Orquestación de la Escena Principal:</strong> Inicialización (<code>_ready</code>), bucle principal (<code>_process</code>), conexión inicial de señales.</li><li><strong>D) Control de Cámara (Parcial):</strong> Inicialización y lógica de centrado.</li><li><strong>E) Renderizado del Mapa (Parcial):</strong> Llamadas al renderizado y gestión de visibilidad de capas.</li><li><strong>F) Configuración y Constantes:</strong> Variables de configuración inicial, constantes de colores, enums.</li><li><strong>G) Lógica de Depuración (Parcial):</strong> Activación de validaciones, impresión de datos.</li><li><strong>H) Gestión de Hilos (Workers):</strong> Inicialización y procesamiento.</li><li><strong>I) Caché de Territorios:</strong> Lógica de caché para optimización.</li></ul><h2 id="_3-propuesta-de-estructura-de-carpetas-refinada" tabindex="-1">3. Propuesta de Estructura de Carpetas Refinada <a class="header-anchor" href="#_3-propuesta-de-estructura-de-carpetas-refinada" aria-label="Permalink to &quot;3. Propuesta de Estructura de Carpetas Refinada&quot;">​</a></h2><p>Se propone la siguiente estructura para organizar los scripts nuevos y existentes:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>scripts/</span></span>
<span class="line"><span>|-- main.gd                 # Script raíz (MUY reducido tras refactorización)</span></span>
<span class="line"><span>|-- global.gd               # (Autoload, revisar necesidad)</span></span>
<span class="line"><span>|-- event_logger.gd         # (Autoload)</span></span>
<span class="line"><span>|-- game_tick_manager.gd    # (Autoload)</span></span>
<span class="line"><span>|-- game_controller.gd      # (Autoload)</span></span>
<span class="line"><span>|-- debug_config.gd         # (Autoload)</span></span>
<span class="line"><span>|-- tileset_manager.gd      # (Pendiente decisión ubicación)</span></span>
<span class="line"><span>|-- common/</span></span>
<span class="line"><span>|   |-- constants.gd        # &lt;-- Mover constantes de main.gd aquí</span></span>
<span class="line"><span>|   |-- directions.gd</span></span>
<span class="line"><span>|   |-- game_state.gd       # (Autoload)</span></span>
<span class="line"><span>|   |-- terrain_data.gd</span></span>
<span class="line"><span>|   |-- utils.gd            # &lt;-- Mover utilidades de main.gd aquí</span></span>
<span class="line"><span>|-- core/</span></span>
<span class="line"><span>|   |-- map/</span></span>
<span class="line"><span>|   |   |-- map_generator.gd # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- game_logic/</span></span>
<span class="line"><span>|   |   |-- expansion_manager.gd # (Autoload)</span></span>
<span class="line"><span>|   |   |-- population_manager.gd # (Autoload)</span></span>
<span class="line"><span>|   |   |-- resource_manager.gd # (Autoload)</span></span>
<span class="line"><span>|   |   |-- strategic_ai.gd # (Autoload)</span></span>
<span class="line"><span>|   |   |-- territory_manager.gd # (Autoload)</span></span>
<span class="line"><span>|   |   |-- ExpansionLogic.gd   # &lt;-- NUEVO (Opcional)</span></span>
<span class="line"><span>|   |   |-- CombatLogic.gd      # &lt;-- NUEVO (Opcional)</span></span>
<span class="line"><span>|-- systems/</span></span>
<span class="line"><span>|   |-- border_cache_system.gd # (Autoload)</span></span>
<span class="line"><span>|   |-- game_time_system.gd # (Autoload)</span></span>
<span class="line"><span>|   |-- worker_thread_system.gd # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|-- ui/</span></span>
<span class="line"><span>|   |-- MainUIManager.gd      # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |-- InputHandler.gd       # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |-- CameraController.gd   # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- MapRenderer.gd        # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- PerformanceOverlay.gd # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- legend/</span></span>
<span class="line"><span>|   |   |-- LegendPanel.gd      # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |-- bottom_panel/</span></span>
<span class="line"><span>|   |   |-- BottomPanelManager.gd # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- PopulationPanel.gd  # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- MilitaryPanel.gd    # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- InfrastructurePanel.gd # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- ResourcesPanel.gd   # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- DiplomacyPanel.gd   # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |   |-- EventPanel.gd       # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |-- right_sidebar/</span></span>
<span class="line"><span>|   |   |-- AttackInfoPanel.gd  # &lt;-- NUEVO</span></span>
<span class="line"><span>|   |-- top_panel/</span></span>
<span class="line"><span>|   |   |-- TopPanel.gd         # &lt;-- NUEVO (Opcional)</span></span>
<span class="line"><span>|   |-- event_viewer/</span></span>
<span class="line"><span>|   |   |-- EventViewer.gd      # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |   |-- EventItem.gd        # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- debug/</span></span>
<span class="line"><span>|   |   |-- DebugPanel.gd       # &lt;-- MOVER aquí</span></span>
<span class="line"><span>|   |-- common/</span></span>
<span class="line"><span>|   |   |-- FormattedLabel.gd   # &lt;-- NUEVO (Opcional)</span></span></code></pre></div><h2 id="_4-descripcion-de-nuevos-scripts-clave" tabindex="-1">4. Descripción de Nuevos Scripts Clave <a class="header-anchor" href="#_4-descripcion-de-nuevos-scripts-clave" aria-label="Permalink to &quot;4. Descripción de Nuevos Scripts Clave&quot;">​</a></h2><ul><li><strong><code>MainUIManager.gd</code>:</strong> Orquesta la UI principal, gestiona paneles de alto nivel y conecta señales globales a actualizaciones de UI.</li><li><strong><code>InputHandler.gd</code>:</strong> Gestiona input del juego (clicks mapa, teclas), verifica colisiones con UI y emite señales para acciones.</li><li><strong>Scripts de Paneles Específicos (ej: <code>PopulationPanel.gd</code>):</strong> Controlan su propio panel, manejan sus controles internos y se conectan a Autoloads para auto-actualizarse.</li><li><strong><code>BottomPanelManager.gd</code>:</strong> Gestiona la barra de tabs inferior y los paneles expandibles asociados.</li></ul><h2 id="_5-resultado-esperado-para-main-gd" tabindex="-1">5. Resultado Esperado para <code>main.gd</code> <a class="header-anchor" href="#_5-resultado-esperado-para-main-gd" aria-label="Permalink to &quot;5. Resultado Esperado para \`main.gd\`&quot;">​</a></h2><p>El script <code>main.gd</code> se reducirá significativamente, actuando solo como punto de entrada y orquestador inicial:</p><ul><li>Mantendrá referencias mínimas a nodos con scripts principales (<code>MainUIManager</code>, <code>InputHandler</code>, etc.).</li><li>En <code>_ready()</code>: Llamará a <code>GameController.setup_new_game()</code> y a inicializadores de los scripts principales.</li><li>En <code>_process()</code>: Delegará a <code>GameController._process()</code> y otros si es necesario.</li><li><strong>Eliminará:</strong> La mayoría de referencias <code>@onready</code> a UI, funciones de actualización UI, lógica de input, constantes, etc.</li></ul><h2 id="_6-diagrama-simplificado-de-la-arquitectura-propuesta" tabindex="-1">6. Diagrama Simplificado de la Arquitectura Propuesta <a class="header-anchor" href="#_6-diagrama-simplificado-de-la-arquitectura-propuesta" aria-label="Permalink to &quot;6. Diagrama Simplificado de la Arquitectura Propuesta&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">graph TD</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph Autoloads [Autoloads (Singletons)]</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        GameState</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        GameController</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        PopulationManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        ResourceManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        ExpansionManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        EventLogger</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        Constants</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        DebugConfig</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        %% ... otros ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph SceneTree [Nodos Principales en Main.tscn]</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode(Root - main.gd) --&gt; InputHandlerNode(InputHandler.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; UIManagerNode(MainUIManager.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; CameraControllerNode(CameraController.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; MapRendererNode(MapRenderer.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; TileMapNode(TileMap)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; CameraNode(Camera2D)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        MainNode --&gt; UINode(UI Root)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph UINodeChildren [Jerarquía UI (Gestionada por MainUIManager)]</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; TopPanel</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; BottomPanelManagerNode(BottomPanelManager.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; LegendPanelNode(LegendPanel.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; AttackInfoPanelNode(AttackInfoPanel.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; EventViewerNode(EventViewer.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        UIManagerNode -- Manages --&gt; DebugPanelNode(DebugPanel.gd)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        BottomPanelManagerNode -- Manages --&gt; PopulationPanelNode(PopulationPanel.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        BottomPanelManagerNode -- Manages --&gt; MilitaryPanelNode(MilitaryPanel.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        %% ... otros paneles ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    %% Flujo de Datos e Interacciones (Ejemplos)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    InputHandlerNode -- Interacts --&gt; GameState</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    InputHandlerNode -- Calls --&gt; ExpansionManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    InputHandlerNode -- Emits Signals --&gt; UIManagerNode</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    UIManagerNode -- Listens --&gt; GameState</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    UIManagerNode -- Listens --&gt; PopulationManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    UIManagerNode -- Calls --&gt; LegendPanelNode</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    UIManagerNode -- Calls --&gt; BottomPanelManagerNode</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    PopulationPanelNode -- Listens/Calls --&gt; PopulationManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    AttackInfoPanelNode -- Listens --&gt; ExpansionManager</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    GameController -- Calls --&gt; PopulationManager</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    GameController -- Calls --&gt; ResourceManager</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    MapRendererNode -- Reads --&gt; GameState</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    MapRendererNode -- Reads --&gt; TilesetManager</span></span></code></pre></div><h2 id="_7-estrategia-de-refactorizacion-sugerida-incremental" tabindex="-1">7. Estrategia de Refactorización Sugerida (Incremental) <a class="header-anchor" href="#_7-estrategia-de-refactorizacion-sugerida-incremental" aria-label="Permalink to &quot;7. Estrategia de Refactorización Sugerida (Incremental)&quot;">​</a></h2><ol><li><strong>Preparación y Movimientos Iniciales:</strong><ul><li>Crear rama Git.</li><li>Mover utilidades y constantes de <code>main.gd</code> a <code>common/utils.gd</code> y <code>common/constants.gd</code>.</li><li>Mover scripts existentes (<code>camera_controller</code>, <code>map_renderer</code>, <code>debug_panel</code>, etc.) a sus nuevas carpetas designadas (<code>ui/</code>, <code>core/</code>, <code>systems/</code>).</li><li>Actualizar todas las referencias (<code>res://...</code>) en escenas y scripts.</li><li><em>Commit.</em></li></ul></li><li><strong>Extraer Input Handler:</strong><ul><li>Crear <code>scripts/ui/InputHandler.gd</code>.</li><li>Mover lógica de <code>_input</code>/<code>_unhandled_input</code> de <code>main.gd</code> a <code>InputHandler</code>.</li><li>Reemplazar llamadas directas a UI por emisión de señales en <code>InputHandler</code>.</li><li>Añadir nodo <code>InputHandler</code> a <code>Main.tscn</code>.</li><li><em>Commit.</em></li></ul></li><li><strong>Extraer UI Manager:</strong><ul><li>Crear <code>scripts/ui/MainUIManager.gd</code>.</li><li>Mover referencias <code>@onready</code> UI principales y lógica UI general de <code>main.gd</code> a <code>MainUIManager</code>.</li><li>Conectar señales de <code>InputHandler</code> a <code>MainUIManager</code>.</li><li>Añadir nodo <code>MainUIManager</code> a <code>Main.tscn</code>.</li><li><em>Commit.</em></li></ul></li><li><strong>Refactorizar Paneles UI (Iterativo):</strong><ul><li>Para cada panel principal (Leyenda, Población, Militar, etc.): <ul><li>Crear su script específico (ej: <code>scripts/ui/legend/LegendPanel.gd</code>).</li><li>Mover lógica y referencias específicas del panel al nuevo script.</li><li>Asignar script al nodo del panel en la escena.</li><li>Actualizar <code>MainUIManager</code> (o crear <code>BottomPanelManager</code>) para delegar al script del panel.</li><li>Conectar señales de Autoloads directamente en el script del panel para auto-actualización.</li><li><em>Commit por panel/grupo.</em></li></ul></li></ul></li><li><strong>Limpieza Final:</strong><ul><li>Revisar y limpiar <code>main.gd</code> (debería quedar mínimo).</li><li>Limpiar <code>MainUIManager</code> e <code>InputHandler</code>.</li><li>Revisar/refactorizar Autoload <code>global.gd</code>.</li><li>Decidir ubicación final de <code>tileset_manager.gd</code>.</li><li>Pruebas exhaustivas.</li><li><em>Commit final.</em></li></ul></li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("econwar/main_gd_refactor_plan.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const main_gd_refactor_plan = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  main_gd_refactor_plan as default
};

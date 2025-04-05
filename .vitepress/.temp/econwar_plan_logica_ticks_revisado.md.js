import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Plan Revisado: Lógica de Ticks y Tiempo Real","description":"","frontmatter":{},"headers":[],"relativePath":"econwar/plan_logica_ticks_revisado.md","filePath":"econwar/plan_logica_ticks_revisado.md"}');
const _sfc_main = { name: "econwar/plan_logica_ticks_revisado.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="plan-revisado-logica-de-ticks-y-tiempo-real" tabindex="-1">Plan Revisado: Lógica de Ticks y Tiempo Real <a class="header-anchor" href="#plan-revisado-logica-de-ticks-y-tiempo-real" aria-label="Permalink to &quot;Plan Revisado: Lógica de Ticks y Tiempo Real&quot;">​</a></h1><p>Este documento describe la arquitectura propuesta para separar la lógica basada en ticks de la lógica en tiempo real, introduciendo un segundo tick para las acciones militares.</p><h2 id="problema-identificado" tabindex="-1">Problema Identificado <a class="header-anchor" href="#problema-identificado" aria-label="Permalink to &quot;Problema Identificado&quot;">​</a></h2><p>El análisis inicial reveló que <code>ResourceManager.process_resources</code> y <code>PopulationManager.process_unassigned_population</code> eran llamadas tanto desde <code>GameTickManager</code> (cada 1s, con delta=1.0) como desde <code>GameController._process</code> (cada frame, con delta variable). Esto causaba un doble procesamiento y una progresión incorrecta del juego.</p><h2 id="arquitectura-propuesta" tabindex="-1">Arquitectura Propuesta <a class="header-anchor" href="#arquitectura-propuesta" aria-label="Permalink to &quot;Arquitectura Propuesta&quot;">​</a></h2><p>Se implementarán dos sistemas de ticks distintos y se ajustará la lógica en tiempo real:</p><ol><li><p><strong>Tick Económico/Poblacional (1 segundo):</strong></p><ul><li>Gestionado por el timer existente (<code>tick_timer</code>) en <code>GameTickManager</code>.</li><li>La señal <code>timeout</code> (<code>_on_global_tick</code>) llamará <strong>únicamente</strong> a: <ul><li><code>ResourceManager.process_resources(1.0)</code></li><li><code>PopulationManager.process_unassigned_population(player_idx, 1.0)</code></li></ul></li></ul></li><li><p><strong>Tick Militar (0.25 segundos):</strong></p><ul><li>Se añadirá un <strong>nuevo Timer</strong> (<code>expansion_timer</code>) en <code>GameTickManager</code> configurado a <strong>0.25 segundos</strong>.</li><li>Su señal <code>timeout</code> se conectará a una nueva función (ej. <code>_on_expansion_tick</code>).</li><li>La función <code>_on_expansion_tick</code> llamará a una función en <code>ExpansionManager</code> (ej. <code>ExpansionManager.process_expansions_tick()</code>) para procesar un paso de las expansiones/ataques activos.</li></ul></li><li><p><strong>Lógica en Tiempo Real (<code>_process</code>):</strong></p><ul><li><strong><code>GameController._process(delta)</code>:</strong><ul><li><strong>Eliminará</strong> las llamadas a <code>process_resources</code>, <code>process_unassigned_population</code> y <code>process_pending_expansions</code>.</li><li>Su principal responsabilidad será actualizar el <code>GameTimeSystem</code> (<code>GameTimeSystem.update(delta)</code>).</li></ul></li><li><strong><code>main.gd/_process(delta)</code>:</strong><ul><li>Continuará manejando la <strong>UI, Input del usuario y Cámara</strong>.</li><li>El <strong>renderizado del mapa</strong> (<code>map_renderer.render_map()</code>) se ajustará para ejecutarse cada <strong>0.25 segundos</strong> (cambiando <code>render_interval = 0.25</code>).</li></ul></li></ul></li></ol><h2 id="diagrama-conceptual" tabindex="-1">Diagrama Conceptual <a class="header-anchor" href="#diagrama-conceptual" aria-label="Permalink to &quot;Diagrama Conceptual&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">graph TD</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph Tick-Based (GameTickManager)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        TICK_1s[Tick Event (1s)] --&gt;|delta=1.0| RM(ResourceManager.process_resources)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        TICK_1s --&gt;|delta=1.0| PM(PopulationManager.process_unassigned_population)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        TICK_025s[Tick Event (0.25s)] --&gt; EM_Tick(ExpansionManager.process_expansions_tick) ;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph Real-Time (GameController._process)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">         FRAME[Frame Event] --&gt;|delta| GT(GameTimeSystem.update)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">         NOTE_GC[GameController solo actualiza tiempo]</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    subgraph Real-Time (main.gd)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        FRAME --&gt;|delta, render_interval=0.25s| UI(UI Update / Render Map) ;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        INPUT[User Input] --&gt;|event| INP_H(Input Handling)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        INP_H --&gt; EM_Start(ExpansionManager.expand_territory) ;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        INP_H --&gt; CAM(Camera Control)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    end</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style RM fill:#cfc,stroke:#333,stroke-width:2px</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style PM fill:#cfc,stroke:#333,stroke-width:2px</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style EM_Tick fill:#ffc,stroke:#333,stroke-width:2px</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    style UI fill:#ccf,stroke:#333,stroke-width:2px</span></span></code></pre></div><h2 id="pasos-de-implementacion" tabindex="-1">Pasos de Implementación <a class="header-anchor" href="#pasos-de-implementacion" aria-label="Permalink to &quot;Pasos de Implementación&quot;">​</a></h2><ol><li>Modificar <code>GameTickManager</code> para añadir el segundo timer (<code>expansion_timer</code>) y la nueva función conectada (<code>_on_expansion_tick</code>).</li><li>Modificar <code>GameController._process</code> para eliminar las llamadas a los managers de recursos, población y expansión.</li><li>Crear/Adaptar la función <code>process_expansions_tick</code> en <code>ExpansionManager</code> para ser llamada desde <code>_on_expansion_tick</code>.</li><li>Modificar <code>main.gd</code> para cambiar <code>render_interval</code> a <code>0.25</code>.</li></ol></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("econwar/plan_logica_ticks_revisado.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const plan_logica_ticks_revisado = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  plan_logica_ticks_revisado as default
};

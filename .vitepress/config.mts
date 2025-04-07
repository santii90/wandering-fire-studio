import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Wandering Fire Studio",
  description: "Trying to make games.",
  base: '/wandering-fire-studio/', // Base URL for GitHub Pages

  // Configuración para mostrar última actualización
  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: generateSidebar({
      useTitleFromFileHeading: true,
      sortMenusByFrontmatterDate: true,
      sortMenusOrderByDescending: true,
      debugPrint: true,
      useTitleFromFrontmatter: true,  // Por si hay títulos en frontmatter
      frontmatterTitleFieldName: 'title',
      rootGroupText: 'Documentación', // Texto para el grupo raíz
      documentRootPath: '/'
    }),

    mermaid: {
      // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
    },
    // optionally set additional config for plugin itself with MermaidPluginConfig
    mermaidPlugin: {
      class: "mermaid my-class", // set additional css classes for parent container 
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // Configuración para personalizar el texto de última actualización
    lastUpdatedText: "Última actualización"
  }
})
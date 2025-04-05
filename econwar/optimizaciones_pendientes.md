# Optimizaciones Pendientes para EconWar

## Lista de Tareas Pendientes

### 1. Mapa de Influencia
- [ ] Desarrollar un sistema de "mapa de calor" para precomputar áreas de expansión
- [x] Implementar cálculo de valores estratégicos de territorios de manera anticipada
- [ ] Crear visualización opcional del mapa de influencia para debugging
- [x] Integrar el mapa de influencia con el sistema de decisiones de IA

### 2. Multihilos para Cálculos Pesados
- [ ] Mover el cálculo de expansión territorial a un hilo separado
- [ ] Separar la lógica de actualización de recursos del renderizado
- [x] Implementar sistema básico de hilos trabajadores (WorkerThreadSystem)
- [ ] Implementar sistema de colas de tareas para procesar en hilos secundarios
- [ ] Añadir sincronización segura entre hilo principal y secundarios
- [x] Unificar sistema de logs de hilos con sistema principal de depuración
- [ ] Migrar operaciones costosas como validación de población a hilos separados

### 3. Refactorización de main.gd
- [x] Implementar GameTickManager para centralizar las actualizaciones periódicas
- [ ] Crear sistema modular de controladores:
  - [x] Implementar CameraController para manejo de cámara y zoom
  - [ ] Implementar input_controller.gd para manejo de entrada
  - [ ] Crear expansion_controller.gd para lógica de expansión
- [ ] Desarrollar sistema modular de UI:
  - [ ] Implementar main_ui.gd como coordinador
  - [ ] Crear player_panel.gd para información de jugador
  - [ ] Desarrollar resource_display.gd para visualización de recursos
  - [ ] Implementar troops_panel.gd para gestión de tropas
- [ ] Migrar funcionalidades de main.gd a los nuevos módulos
- [ ] Convertir main.gd en un coordinador liviano

### 4. Estructura de Datos Eficiente
- [ ] Reemplazar arrays anidados por estructuras más eficientes
- [ ] Implementar sistema de cuadrículas espaciales (quadtree/spatial hash)
- [x] Optimizar estructuras para mejorar localidad de referencia
- [ ] Desarrollar índices espaciales para consultas rápidas de vecinos
- [x] Implementar acceso O(1) a coordenadas territoriales específicas
- [x] Eliminar código duplicado en cálculos de población y recursos

### 5. Procesamiento por Lotes de Expansiones
- [x] Implementar sistema de procesamiento por lotes para expansiones
- [x] Procesar expansiones agrupadas por jugador y tipo
- [x] Agrupar operaciones similares para mejora de eficiencia
- [x] Implementar eliminación eficiente de expansiones completadas
- [x] Prevenir errores de acceso a índices inválidos

### 6. Optimización Completa del Sistema de Bordes
- [x] Implementar precomputación parcial de bordes
- [x] Desarrollar almacenamiento en caché a nivel de región
- [ ] Optimizar cálculos de fronteras entre jugadores específicos
- [x] Implementar actualización selectiva de bordes solo en áreas modificadas
- [ ] Desarrollar estructura de datos jerárquica para bordes

### 7. Sistema de Población y Recursos
- [x] Corregir lógica de crecimiento de población para respetar límites de capacidad
- [x] Ajustar velocidades de asignación de población para equilibrar la jugabilidad
- [x] Optimizar validaciones de integridad de población para prevenir desbordamientos
- [x] Implementar ResourceSystem como clase separada para gestionar recursos
- [ ] Implementar sistema de caché para cálculos frecuentes de capacidad de población
- [ ] Refactorizar sistema de distribución de población para unificar lógicas duplicadas

### 8. Optimización de Renderizado
- [x] Implementar sistema de renderizado selectivo para actualizar solo áreas modificadas
- [x] Crear sistema de marcado de celdas y regiones "sucias" que necesitan actualización
- [x] Implementar caché de renderizado para optimizar actualizaciones visuales
- [ ] Implementar nivel de detalle dinámico basado en zoom
- [ ] Optimizar renderizado de elementos UI para grandes cantidades de territorios

### 9. Gestión de Tilesets y Terrenos
- [x] Implementar TilesetManager para centralizar gestión de tilesets 2D
- [x] Mejorar generación de mapas con múltiples capas de ruido
- [x] Optimizar conversión entre tipos de terreno antiguos y nuevos
- [ ] Implementar carga progresiva de texturas basada en visibilidad
- [ ] Desarrollar sistema de LOD (Level of Detail) para terrenos distantes

## Análisis de Prioridades

### Top 3 en Potencial de Mejora de Rendimiento

1. **Multihilos para Cálculos Pesados**: Mantiene su posición como la optimización con mayor potencial, especialmente tras la implementación inicial del WorkerThreadSystem.

2. **Optimización de Renderizado**: Nueva entrada de alta prioridad tras identificar el gran impacto de las mejoras ya implementadas.

3. **Sistema de Población y Recursos**: Alta prioridad tras identificar problemas críticos en esta área.

### Top 3 en Simplicidad de Integración

1. **Sistema de Población y Recursos**: Las mejoras en este sistema han demostrado ser relativamente sencillas de implementar y tienen un impacto significativo.

2. **Optimización de Renderizado**: Las optimizaciones iniciales ya implementadas han mostrado buenos resultados y hay camino claro para seguir mejorando.

3. **Gestión de Tilesets y Terrenos**: Con el TilesetManager ya implementado, hay una base sólida para seguir mejorando este sistema.

### Recomendación Final

Basado en los avances recientes y el estado actual del proyecto, se recomienda priorizar:

1. **Sistema de Población y Recursos**: Continuar las mejoras en este sistema crítico para la jugabilidad y estabilidad.

2. **Multihilos para Cálculos Pesados**: Expandir el WorkerThreadSystem para incluir más operaciones costosas, aprovechando el sistema unificado de logs.

3. **Optimización de Renderizado**: Implementar nivel de detalle dinámico y optimizaciones de UI para mejorar la experiencia en mapas grandes. 
# EconWar - Estrategia de Expansión Territorial y Gestión de Recursos

EconWar es un juego de estrategia desarrollado en Godot 4 que combina gestión de recursos, crecimiento de población y expansión territorial en un mundo generado proceduralmente. Los jugadores compiten por el control del mapa, administran sus recursos y desarrollan sus fuerzas militares.

## Características Principales

### Sistema de Mapa y Territorios
- **Generación Procedural**: Mapa con diversos tipos de terreno (llanuras, montañas, bosques, ciudades, etc.)
- **Territorios Estratégicos**: Cada tipo de terreno ofrece diferentes ventajas para recursos y defensa
- **Expansión Territorial**: Conquista de nuevos territorios mediante decisiones estratégicas
- **Análisis Estratégico**: El sistema evalúa automáticamente el valor estratégico de cada territorio para optimizar decisiones de expansión

### Sistema de Población
- **Crecimiento Dinámico**: La población crece basada en múltiples factores:
  - Disponibilidad de alimentos (factor de comida)
  - Capacidad disponible en territorios y ciudades 
  - Recuperación acelerada después de conflictos militares
  - Bonificaciones especiales para poblaciones pequeñas en territorios con alta capacidad
- **Distribución Configurable**: La población se divide en tres categorías principales:
  - **Trabajadores (Workers)**: Generan recursos y aceleran el crecimiento económico
  - **Tropas (Troops)**: Unidades militares para expansión y defensa
  - **Logística (Logistics)**: Proporcionan bonificaciones a la eficiencia de expansión y producción
- **Redistribución Automática**: El sistema asigna automáticamente la población sin asignar según los porcentajes definidos

### Sistema de Recursos
- **Economía Multifactorial**: Diferentes recursos con roles específicos:
  - **Oro**: Recurso general para economía
  - **Comida**: Afecta directamente el crecimiento poblacional
  - **Producción**: Recursos para construcción y desarrollo
- **Producción Basada en Terreno**: Cada tipo de terreno produce diferentes cantidades de recursos
- **Bonificaciones de Logística**: Mayor porcentaje de logística mejora la producción de recursos hasta un 150%

### Sistema Militar y Expansión
- **Expansión Territorial**: Conquista de territorios vacíos o enemigos
- **Evaluación Estratégica**: Análisis automático para determinar los mejores objetivos de expansión
- **Sistema de Combate**: 
  - Cálculo de fuerza ofensiva y defensiva basado en tropas y terreno
  - Bonificaciones de defensa según tipo de terreno (hasta +300% en ciudades)
  - Sistema de bajas en combate con tasas variables según el tipo de confrontación
- **Logística Militar**: Bonificaciones por unidades de logística que reducen costos de expansión

### Sistema de Registro de Eventos
- **Base de Datos SQLite**: Registro completo de todas las acciones importantes del juego
- **Procesamiento en Hilos**: Los eventos se guardan en segundo plano sin afectar el rendimiento
- **Visualización de Historia**: Interfaz para revisar eventos pasados con filtros y búsqueda
- **Categorización de Eventos**: Eventos separados por tipo (combate, recursos, diplomacia, etc.)

### Interfaz y Control
- **Cámara Dinámica**: Sistema de navegación fluido con zoom y desplazamiento
- **Controles Intuitivos**: Expansión mediante clicks, gestión mediante sliders
- **Vista en Tiempo Real**: Actualización automática de recursos y población
- **Paneles Informativos**: Visualización de tropas, territorios y estadísticas

### Optimización y Rendimiento
- **Procesamiento Multi-hilo**: Las operaciones intensivas se ejecutan en hilos separados
- **Sistema de Caché**: Optimización mediante cachés territoriales y fronteras
- **Actualización por Lotes**: Los eventos y cálculos se procesan en lotes para mejorar rendimiento
- **Modo de Bajo Uso de CPU**: Optimización para dispositivos con recursos limitados

## Sistemas Técnicos

### Sistema de Población
Cada jugador gestiona su población dividida en:
- **Trabajadores**: Generan recursos según el tipo de terreno controlado
- **Tropas**: Divididas entre tropas en territorio y tropas desplegadas
- **Logística**: Proporcionan bonificaciones a producción y expansión
- **Sin asignar**: Población disponible para redistribución automática

La capacidad de población se determina por:
- Tipos de territorios controlados (cada terreno tiene distinta capacidad)
- Cantidad de ciudades (proporcionan alta capacidad)
- Bonificaciones territoriales especiales

### Mecánica de Crecimiento Poblacional
La población crece según varios factores:
- **Factor de Comida**: Impacto directo de la disponibilidad de alimentos
- **Factor de Capacidad**: Crecimiento exponencial cuando hay capacidad disponible (hasta 5x más rápido con <10% de uso)
- **Factor de Recuperación**: Aceleración del crecimiento después de pérdidas militares
- **Factores Mínimos**: Garantía de crecimiento para poblaciones pequeñas y medianas

### Sistema de Expansión Territorial
El proceso de expansión incluye:
1. **Selección de Objetivo**: Evaluación estratégica de territorios adyacentes
2. **Cálculo de Costos**: Basado en tipo de terreno y dificultad
3. **Aplicación de Bonificaciones**: Modificadores por logística y otros factores
4. **Resolución**: Éxito o fracaso según tropas disponibles
5. **Gestión de Bajas**: Cálculo de pérdidas de población según el resultado

### Sistema de Registro de Eventos
Arquitectura en tres capas:
1. **Registro**: Interfaz no bloqueante para añadir eventos desde el juego
2. **Procesamiento**: Hilo separado para gestionar escritura a base de datos
3. **Consulta**: Interfaz para recuperar y visualizar eventos históricos

Tipos de eventos:
- **BATTLE**: Combates y expansiones territoriales
- **RESOURCE**: Producción y consumo de recursos
- **PLAYER**: Acciones específicas de jugadores
- **UNIT**: Creación y modificación de unidades
- **GAME**: Eventos generales del juego
- **DIPLOMACY**: Acciones diplomáticas
- **RESEARCH**: Eventos de investigación
- **BUILDING**: Construcción o destrucción de edificios

## Controles
- **Click Izquierdo**: Expandir territorio/atacar casilla seleccionada
- **Rueda del Ratón**: Zoom in/out
- **Click Central**: Arrastrar el mapa
- **WASD/Flechas**: Mover la cámara
- **T**: Cambiar modo de visualización
- **L**: Mostrar/ocultar leyenda
- **I**: Mostrar/ocultar información de tropas
- **E**: Mostrar visor de eventos
- **V**: Validar datos de población (depuración)
- **N**: Cambiar al siguiente jugador (testing)

## Requisitos Técnicos
- Godot Engine 4.x
- Addon SQLite para almacenamiento de eventos

## Instalación
1. Clona este repositorio
2. Abre el proyecto en Godot 4
3. Ejecuta la escena principal (Main.tscn)

## Estado del Desarrollo
EconWar está activamente en desarrollo. Las características descritas representan la funcionalidad actual, pero están sujetas a cambios y mejoras.
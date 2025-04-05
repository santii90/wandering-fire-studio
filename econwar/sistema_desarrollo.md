# Sistema de Desarrollo de Territorios

Este documento describe el sistema de desarrollo planificado para el juego, que permitirá una evolución más realista de los territorios a lo largo del tiempo.

## Niveles de Desarrollo

Cada territorio tendrá un nivel de desarrollo del 1 al 4, que afectará a varios aspectos:

```gdscript
# Multiplicadores por nivel de desarrollo
const DEVELOPMENT_MULTIPLIER = {
    1: 1.0,    # Base
    2: 1.75,   # +75% sobre base
    3: 2.75,   # +175% sobre base
    4: 4.0     # +300% sobre base (máximo)
}

# Bonus de infraestructura por nivel de desarrollo
const INFRASTRUCTURE_BONUS = {
    1: 0.05,   # 5% bonus base
    2: 0.08,   # 8% bonus
    3: 0.12,   # 12% bonus
    4: 0.15    # 15% bonus máximo
}
```

## Capacidad de Población por Tipo de Terreno

### Nivel 1 (Implementado actualmente)

```gdscript
const TERRAIN_POPULATION_CAPACITY = {
    WATER: 0,
    PLAINS: 1250,         # Zona rural básica
    MOUNTAINS: 125,       # Asentamientos montañosos básicos
    SNOW_MOUNTAINS: 50,   # Asentamientos de montaña primitivos
    FOREST: 250,          # Aldeas forestales
    HILLS: 500,          # Asentamientos en colinas
    DESERT: 75,          # Oasis y pequeños asentamientos
    SWAMP: 125,          # Aldeas pantanosas
    TUNDRA: 50,          # Asentamientos árticos básicos
    DRY_CLAY: 250,       # Zonas semiáridas poco desarrolladas
    CITY: 25000,         # Ciudad básica
    INDUSTRY: 12500      # Zona industrial básica
}
```

### Nivel 4 (Máximo desarrollo)

```gdscript
const TERRAIN_POPULATION_CAPACITY_MAX = {
    WATER: 0,
    PLAINS: 5000,         # Zona rural agrícola productiva
    MOUNTAINS: 500,       # Zona montañosa habitable
    SNOW_MOUNTAINS: 200,  # Zona montañosa difícil
    FOREST: 1000,         # Zona boscosa habitable
    HILLS: 2000,         # Zona de colinas cultivables
    DESERT: 300,         # Zona desértica habitable
    SWAMP: 500,          # Zona pantanosa
    TUNDRA: 200,         # Zona fría
    DRY_CLAY: 1000,      # Zona semiárida cultivable
    CITY: 100000,        # Ciudad desarrollada
    INDUSTRY: 50000      # Zona industrial desarrollada
}
```

## Ejemplo de Cálculos

Para un territorio con:
- 1 ciudad: 25,000 (nivel 1)
- 25 planicies: 31,250 (nivel 1)
- 2 bosques: 500 (nivel 1)

### Progresión de Población por Nivel

```
Nivel | Multiplicador | Población Base | Bonus Infra | Total
1     | 1.0          | 56,750         | 5%          | 59,587
2     | 1.75         | 99,312         | 8%          | 107,257
3     | 2.75         | 156,062        | 12%         | 174,789
4     | 4.0          | 227,000        | 15%         | 261,050
```

## Expansión de Ciudades

Las ciudades podrán expandirse a territorios adyacentes a medida que crecen:

1. **Radio de Expansión**:
   - Nivel 1: Solo la tile central
   - Nivel 2: Puede expandir a 1 tile adyacente
   - Nivel 3: Puede expandir a 2 tiles adyacentes
   - Nivel 4: Puede expandir a 3 tiles adyacentes

2. **Factores que Influyen**:
   - Población total de la región
   - Recursos disponibles
   - Conexiones comerciales
   - Tiempo de juego
   - Estabilidad (ausencia de conflictos)

3. **Límites**:
   - Máximo de tiles de ciudad por región
   - Distancia mínima entre ciudades
   - Requisitos de terreno para expansión
   - Costos de recursos para expansión

## Bonificaciones por Nivel de Desarrollo

Además de la capacidad de población, el nivel de desarrollo afectará:

1. **Economía**:
   - Producción de oro
   - Eficiencia de trabajadores
   - Capacidad comercial

2. **Militar**:
   - Eficiencia de tropas
   - Capacidad logística
   - Velocidad de recuperación

3. **Infraestructura**:
   - Redes de transporte
   - Capacidad de almacenamiento
   - Velocidad de construcción

## Implementación Técnica

Para implementar este sistema, se requerirán los siguientes cambios:

1. Añadir un mapa de niveles de desarrollo:
```gdscript
var development_level_map = []  # Array 2D con nivel de desarrollo por tile
```

2. Funciones para calcular capacidad ajustada por nivel:
```gdscript
func get_adjusted_capacity(base_capacity, dev_level):
    return base_capacity * DEVELOPMENT_MULTIPLIER[dev_level]
```

3. Sistema de requisitos para subir de nivel:
```gdscript
func can_upgrade_development(x, y, current_level):
    # Verificar requisitos de recursos, población, tiempo, etc.
    return true/false
```

4. Sistema de expansión urbana:
```gdscript
func try_expand_city(city_x, city_y):
    # Lógica para determinar si una ciudad puede expandirse
    # y a qué casilla adyacente
```

## Beneficios del Sistema

1. **Progresión a Largo Plazo**: Da objetivos más allá de la simple expansión territorial
2. **Realismo**: Representa mejor el desarrollo histórico de asentamientos
3. **Profundidad Estratégica**: Decisiones sobre dónde y cuándo desarrollar
4. **Balance**: Control más granular sobre la economía y demografía

## Timeline de Implementación

1. **Fase 1**: Sistema básico de niveles de desarrollo
2. **Fase 2**: Expansión de ciudades
3. **Fase 3**: Bonificaciones por nivel
4. **Fase 4**: Requisitos para aumentar nivel
5. **Fase 5**: UI y efectos visuales 
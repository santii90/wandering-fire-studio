---
date: 2025-04-01T19:48:50
---
# Sistema de Simulación de Combate y Conquista

## Descripción General

Este sistema implementa la simulación de combate, avance y conquista territorial para todos los jugadores (tanto humanos como no humanos). Utiliza un enfoque basado en valoración ponderada que considera múltiples factores para determinar las condiciones y resultados de la expansión territorial, ataques y distribución estratégica de tropas.

## Lógica de Dificultad de Terrenos

El sistema utiliza un conjunto de valores de dificultad para cada tipo de terreno, que afectan directamente a la simulación de combate y conquista:

### Valores de Dificultad

| Tipo de Terreno | Valor de Dificultad | Descripción |
|-----------------|---------------------|-------------|
| WATER (0)       | 999.0               | Impasable, no se puede conquistar |
| PLAINS (1)      | 1.0                 | Terreno base, facilidad de conquista estándar |
| HILLS (2)       | 2.5                 | Moderadamente difícil de conquistar |
| MOUNTAINS (3)   | 4.0                 | Muy difícil de conquistar |
| FOREST (4)      | 1.8                 | Ligeramente más difícil que las planicies |
| CITY (5)        | 3.0                 | Bastante difícil, requiere más tropas |

### Capacidad de Población por Terreno

El sistema también considera la capacidad de población que aporta cada tipo de terreno:

| Tipo de Terreno | Capacidad de Población | Nota |
|-----------------|------------------------|------|
| WATER (0)       | 0                      | No habitable |
| PLAINS (1)      | 150                    | Capacidad estándar |
| HILLS (2)       | 120                    | Menor que planicies |
| MOUNTAINS (3)   | 60                     | Capacidad reducida |
| FOREST (4)      | 100                    | Recursos pero difícil colonización |
| CITY (5)        | 360                    | Gran capacidad poblacional |

### Impacto en el Combate y Conquista

- **Mayor Dificultad = Mayor Costo de Conquista**: Territorios con valores de dificultad más altos requieren más tropas para ser conquistados, haciendo que terrenos como montañas y ciudades sean más costosos pero estratégicamente valiosos.

- **Modificadores Defensivos (solo en combate entre jugadores)**: El tipo de terreno proporciona bonificaciones a la defensa únicamente cuando un jugador ataca a otro:
  - Montañas: +220% bonificación defensiva
  - Colinas: +150% bonificación defensiva
  - Bosques: +100% bonificación defensiva
  - Ciudades: +300% bonificación defensiva
  - Planicies: +35% bonificación defensiva

- **Expansión a Territorios Vacíos**: Para territorios sin dueño, solo se considera la dificultad base del terreno sin aplicar bonificaciones defensivas.

- **Equilibrio Población-Dificultad**: Los terrenos que ofrecen mayor capacidad de población suelen ser también más difíciles de conquistar, creando un equilibrio entre el valor estratégico y el costo táctico.

## Requisitos de Expansión Territorial

Para que un territorio sea considerado válido para expansión o ataque, debe cumplir con los siguientes requisitos:

- Debe tener al menos **3 territorios propios adyacentes** (anteriormente eran 2)
- No puede ser agua
- Para ataques, debe pertenecer a un jugador enemigo

## Algoritmo de Evaluación Territorial

### 1. Análisis de Territorios Candidatos

El sistema analiza todos los territorios adyacentes a las fronteras y evalúa:

- Tipo de terreno (planicie, montaña, ciudad, etc.)
- Dificultad de conquista según el terreno
- Valor estratégico calculado

### 2. Diversificación por Tipo de Terreno

Para garantizar una expansión equilibrada entre diferentes tipos de terreno:

- Los territorios candidatos se agrupan por tipo de terreno
- Se selecciona al menos un candidato de cada tipo disponible
- Se completa la selección hasta 5 candidatos con los mejores restantes
- Se aplica un sistema de pesos menos sesgado para la selección final

### 3. Cálculo de Valor Estratégico

Cada territorio recibe una puntuación basada en:

- **Valor base por tipo de terreno**:
  - Planicies: 1.8x (alto valor por facilidad de conquista)
  - Ciudades: 1.5x (valor por recursos)
  - Montañas: 1.3x (valor defensivo)

- **Bonificaciones tácticas**:
  - Puntas de lanza: +50% (territorios que proyectan el avance en territorio enemigo)
  - Ataques divisorios: +50% (ataques que pueden dividir territorio enemigo)
  
- **Penalizaciones**:
  - Expansión circular: -30% (para evitar territorios que solo hacen el dominio más redondeado)

## Optimizaciones de Rendimiento

Para mejorar el rendimiento y reducir la carga de CPU durante la simulación:

1. **Evaluación limitada de territorios fronterizos**:
   - Se evalúan como máximo 20 territorios seleccionados aleatoriamente
   - Reduce drásticamente los cálculos en mapas grandes

2. **Funciones simplificadas**:
   - `would_create_circular_territory_fast`: Usa muestreo cada 2 casillas en lugar de revisar todo el mapa
   - `could_divide_enemy_territory_simple`: Verifica solo 2 casillas en cada dirección
   - Cálculos de valor estratégico más ligeros y directos

3. **Selección más eficiente**:
   - Reducción del número de candidatos a evaluar (de 7 a 5)
   - Eliminación de cálculos exponenciales en favor de fórmulas lineales
   - Evita recorridos completos del mapa cuando es posible

## Simulación de Distribución de Tropas

La distribución de tropas durante la simulación se realiza priorizando:

1. **Fronteras bajo amenaza** - Reciben mayor cantidad de tropas
2. **Puntos de avance estratégico** - Territorios desde donde se planea atacar
3. **Defensa de retaguardia** - Territorios interiores reciben menor cantidad de tropas

## Cambios Principales Realizados

1. **Mayor requisito de adyacencia**: Cambio de 2 a 3 territorios propios adyacentes
2. **Sistema de diversificación de terrenos**: Previene enfoque exclusivo en un tipo de terreno
3. **Optimizaciones de rendimiento**: Reducción significativa de cálculos y complejidad
4. **Balance de factores estratégicos**: Ajuste de multiplicadores para decisiones más naturales

Estos cambios buscan una simulación más balanceada que considere diversos factores estratégicos y que funcione eficientemente incluso en mapas grandes. 
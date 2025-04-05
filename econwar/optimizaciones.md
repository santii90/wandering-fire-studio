# Optimizaciones de Rendimiento en EconWar

## Problema Original

El juego experimentaba una sobrecarga significativa de CPU cuando tres o más jugadores comenzaban a expandirse simultáneamente. Esto ocurría por varias razones:

1. **Renderizado ineficiente**: Todo el mapa se redibujaba completamente en cada actualización, incluso cuando solo unas pocas celdas habían cambiado.
2. **Cálculos de bordes costosos**: El sistema verificaba cada celda adyacente (en 4 direcciones) para todas las celdas del mapa.
3. **Validación frecuente de población**: Se ejecutaban cálculos costosos para validar datos de población en cada frame.
4. **Recorrido excesivo del mapa**: Cada actualización de recursos recorría todo el mapa para calcular la producción.

## Soluciones Implementadas

### 1. Renderizado Selectivo (map_renderer.gd)

#### Problema
El método `render_map()` recalculaba y redibujaba TODAS las celdas del mapa en cada actualización, incluso las que no cambiaron.

#### Solución
Implementamos un sistema de "dirty regions" que solo redibuja las celdas que realmente cambiaron.

```gdscript
# Variables para optimización de renderizado
var last_rendered_ownership = [] # Cache del último mapa de propiedad renderizado
var dirty_cells = [] # Lista de celdas que necesitan actualización

# Marca una celda como "sucia" que necesita ser redibujada
func mark_cell_dirty(x: int, y: int):
    dirty_cells.append(Vector2i(x, y))
```

#### Funcionamiento
1. Mantenemos un caché del último estado renderizado del mapa.
2. Comparamos el estado actual con el caché para identificar solo las celdas que cambiaron.
3. Solo renderizamos las celdas "sucias" (dirty) en lugar de todo el mapa.
4. Las celdas adyacentes a cambios también se marcan como sucias para mantener la coherencia visual.

```gdscript
# OPTIMIZACIÓN: Detecta celdas que han cambiado de propietario
if dirty_cells.size() == 0 and last_rendered_ownership.size() > 0:
    for y in range(ownership_data.size()):
        for x in range(ownership_data[y].size()):
            if ownership_data[y][x] != last_rendered_ownership[y][x]:
                mark_cell_dirty(x, y)
                
                # También marcar las celdas adyacentes como dirty
                var directions = [Vector2i(0, -1), Vector2i(1, 0), Vector2i(0, 1), Vector2i(-1, 0)]
                for dir in directions:
                    var nx = x + dir.x
                    var ny = y + dir.y
                    if nx >= 0 and ny >= 0 and nx < ownership_data[0].size() and ny < ownership_data.size():
                        mark_cell_dirty(nx, ny)
```

#### Beneficios
- Reducción dramática de operaciones de renderizado.
- Mejor rendimiento cuando solo pequeñas partes del mapa cambian.
- Eliminación temporal de la capa de bordes que era especialmente costosa.

### 2. Optimización de Validación de Población (game_controller.gd)

#### Problema
El método `validate_population_data()` se ejecutaba frecuentemente y recorría todas las casillas para verificar inconsistencias en los datos de población.

#### Solución
Implementamos un sistema de intervalos para realizar la validación solo periódicamente.

```gdscript
# Variables para optimización de validación
var last_population_validation_time = 0.0
var population_validation_interval = 3.0 # Segundos entre validaciones de población

# Verifica y corrige todos los datos de población para todos los jugadores
func validate_population_data(force: bool = false) -> Dictionary:
    # OPTIMIZACIÓN: Si no se fuerza, chequeamos si ha pasado suficiente tiempo desde la última validación
    var current_time = Time.get_ticks_msec() / 1000.0
    if not force and (current_time - last_population_validation_time) < population_validation_interval:
        return {} # Devolver un diccionario vacío si no es tiempo de validar
```

#### Funcionamiento
1. Introducimos un parámetro `force` para permitir validaciones obligatorias en momentos críticos.
2. Mantenemos un registro del tiempo de la última validación.
3. Solo realizamos la validación si ha transcurrido un intervalo mínimo (3 segundos).
4. Aprovechamos la función `process_resources()` para validar periódicamente la población.

#### Beneficios
- Reducción de validaciones redundantes.
- Mejor distribución de carga computacional en el tiempo.
- Mantenimiento de la integridad de datos sin penalizar el rendimiento.

### 3. Caché de Territorios (main.gd)

#### Problema
En cada actualización de recursos, se recorría todo el mapa para calcular la producción de cada jugador.

#### Solución
Creamos un sistema de caché que almacena las posiciones de todos los territorios de cada jugador.

```gdscript
# Caché para optimización de recursos
var player_territories_cache = []
var territories_cache_valid = false

# OPTIMIZACIÓN: Actualiza el caché de territorios por jugador
func update_player_territories_cache():
    player_territories_cache = []
    
    # Inicializamos el array para cada jugador
    for p in range(game_controller.num_players):
        player_territories_cache.append([])
    
    # Recorremos el mapa una sola vez y cacheamos las posiciones
    for y in range(game_controller.ownership_map.size()):
        for x in range(game_controller.ownership_map[y].size()):
            var owner_id = game_controller.ownership_map[y][x]
            if owner_id >= 0 and owner_id < game_controller.num_players:
                player_territories_cache[owner_id].append(Vector2i(x, y))
```

#### Funcionamiento
1. Creamos un array bidimensional que almacena las coordenadas de cada territorio por jugador.
2. Actualizamos este caché solo cuando hay cambios en el mapa (mediante señales).
3. Al calcular recursos, iteramos sobre el caché del jugador en lugar de todo el mapa.

```gdscript
# OPTIMIZACIÓN: Usar el caché de territorios en lugar de recorrer todo el mapa
if player < player_territories_cache.size():
    for territory in player_territories_cache[player]:
        var x = territory.x
        var y = territory.y
        var terrain_type = game_controller.terrain_map[y][x]
        
        # Cada tipo de terreno proporciona diferentes recursos...
```

#### Beneficios
- Reducción drástica de iteraciones durante el cálculo de recursos.
- Complejidad O(n) donde n = territorios del jugador, en lugar de O(w*h) donde w,h = dimensiones del mapa.
- Mejora especialmente notable en mapas grandes con pocos territorios por jugador.

### 4. Reducción de Frecuencia de Actualización (main.gd)

#### Problema
Muchas operaciones intensivas se realizaban en cada frame, como renderizado y actualización de interfaz.

#### Solución
Implementamos temporizadores para diferentes operaciones y las ejecutamos solo cuando es necesario.

```gdscript
# Variables para juego en tiempo real
var render_timer = 0.0
var render_interval = 0.5 # segundos entre renderizaciones completas

# OPTIMIZACIÓN: Renderización periódica en lugar de cada frame
render_timer += delta
if render_timer >= render_interval:
    render_timer = 0
    map_renderer.render_map()
    
    # Solo actualizar información de tropas si se procesaron expansiones
    if expansions_processed:
        update_troops_info()
```

#### Funcionamiento
1. Introducimos temporizadores separados para diferentes tipos de actualizaciones.
2. Renderizamos el mapa cada 0.5 segundos en lugar de cada frame.
3. Limitamos las actualizaciones de interfaz que no son críticas.
4. Procesamos expansiones solo cuando hay cambios pendientes.

#### Beneficios
- Distribución más equilibrada de la carga computacional.
- Reducción significativa de operaciones redundantes.
- Mejor respuesta de la interfaz de usuario.

## Integración con el Sistema de Señales

Para mantener la coherencia entre estas optimizaciones, utilizamos el sistema de señales de Godot:

```gdscript
# Función para notificar cambios en los territorios
signal territories_changed

# Si se procesaron expansiones, emitimos la señal de cambio de territorios
if expansions_processed > 0:
    emit_signal("territories_changed")
```

Y conectamos esta señal a la invalidación del caché de territorios:

```gdscript
# Conecta la señal de cambio de territorios
game_controller.connect("territories_changed", invalidate_territories_cache)
```

## Resultados Esperados

- **Reducción de CPU**: Menor uso de CPU durante la expansión de jugadores.
- **Mayor fluidez**: Framerate más estable, especialmente en mapas grandes.
- **Escalabilidad**: Mejor rendimiento con 3+ jugadores activos.
- **Sin impacto en la jugabilidad**: Todas las funciones del juego se mantienen intactas.

## Optimizaciones Adicionales Implementadas (Actualización)

### 5. Correcciones al Sistema de Crecimiento de Población (resource_system.gd)

#### Problema
El crecimiento de población no funcionaba correctamente debido a inconsistencias entre la población sin asignar y la población total. Específicamente:
1. Al añadir población sin asignar, no se actualizaba automáticamente la población total.
2. Los factores de crecimiento (comida y capacidad) podían resultar en crecimiento cero bajo ciertas condiciones.
3. Durante la redistribución de población, podían ocurrir cambios inesperados en la población total.

#### Solución
Implementamos correcciones para asegurar la coherencia entre la población sin asignar y la población total:

```gdscript
# Actualización explícita de población total al crecer población
if growth_int > 0:
    # Si hay crecimiento, añadimos población sin asignar Y aumentamos la población total
    game_controller.add_unassigned_population(player, growth_int)
    
    # Importante: también aumentamos la población total
    game_controller.set_total_population(player, population + growth_int)
```

#### Mejoras en los Factores de Crecimiento
Se mejoraron los factores que controlan el crecimiento de población para garantizar un crecimiento mínimo cuando hay recursos disponibles:

```gdscript
# Forzar un valor mínimo para capacity_factor para evitar crecimiento cero
capacity_factor = max(0.1, capacity_factor)

# El crecimiento base es un 1% de la población actual por actualización
var growth_base = max(1, population * 0.01) # Al menos 1 de crecimiento base

# Asegurar un crecimiento mínimo si hay comida y capacidad
if growth_int < 1 and food > 10 and population < capacity * 0.9:
    growth_int = 1
```

#### Verificación de Coherencia en Redistribución
Se implementó verificación y corrección durante la redistribución de población para mantener los contadores consistentes:

```gdscript
# Verificar población total después de redistribuir
if population_changed:
    var total_after = game_controller.get_total_population(player)
    var distributed_after = game_controller.get_worker_count(player) + game_controller.get_troops_in_territory(player) + game_controller.get_troops_deployed(player) + game_controller.get_logistics_count(player) + game_controller.get_unassigned_population(player)
    
    # Verificar que la población total no ha cambiado
    if total_before != total_after:
        # Corregir la población total
        game_controller.set_total_population(player, distributed_after)
```

#### Beneficios
- **Crecimiento de población coherente**: La población ahora crece correctamente en función de los factores definidos.
- **Mayor estabilidad**: Se eliminan las inconsistencias que podían causar problemas con la redistribución.
- **Feedback mejorado**: Se añadieron logs detallados para facilitar la depuración de problemas de población.
- **Garantía de crecimiento mínimo**: Asegura que haya algún crecimiento cuando las condiciones son favorables.

### 6. Procesamiento por Lotes de Expansiones (game_controller.gd)

#### Problema
El sistema original procesaba las expansiones una por una, iterando sobre cada expansión de manera secuencial, independientemente del jugador o tipo. Esto causaba:
1. Cálculos redundantes para expansiones del mismo jugador
2. Evaluación repetida de bordes y territorios para cada expansión
3. Múltiples llamadas a emit_signal y actualización de interfaces
4. Alta carga de CPU cuando varios jugadores expandían simultáneamente

#### Solución
Implementamos un sistema de procesamiento por lotes que agrupa las expansiones por jugador y tipo, procesándolas de manera más eficiente:

```gdscript
# Procesar expansiones por jugador y por tipo para mejorar eficiencia
var expansions_by_player = {}

# Agrupar expansiones por jugador y tipo
for i in range(pending_expansions.size()):
    var expansion = pending_expansions[i]
    var player = expansion.player
    
    if not expansions_by_player.has(player):
        expansions_by_player[player] = {"empty": [], "attack": []}
    
    var exp_type = expansion.type
    expansions_by_player[player][exp_type].append(i)
```

#### Optimización de Cálculos de Bordes
Para cada jugador, calculamos los bordes una sola vez para todas sus expansiones a territorio vacío:

```gdscript
# Obtenemos los bordes con territorios vacíos (una sola vez para eficiencia)
var border_tiles = get_border_tiles_with_empty(player)

# Evaluar todos los bordes una sola vez y almacenar los resultados
var evaluated_borders = evaluate_borders_strategic_value(border_tiles, player)
```

#### Actualización Inteligente de Fronteras
Después de cada expansión exitosa, actualizamos los bordes para evitar intentar expandir al mismo lugar más de una vez:

```gdscript
# Después de una expansión exitosa, actualizar el conjunto de bordes
# Esto es crítico para evitar intentar expandir al mismo lugar más de una vez
border_tiles = get_border_tiles_with_empty(player)
if border_tiles.is_empty():
    break
    
# Re-evaluar los bordes después de cada cambio significativo
evaluated_borders = evaluate_borders_strategic_value(border_tiles, player)
```

#### Optimización de Eliminación de Expansiones
En lugar de eliminar expansiones durante la iteración (lo que requiere reordenar constantemente el array), marcamos expansiones para eliminación y las eliminamos todas juntas al final:

```gdscript
# Eliminar expansiones completadas o fallidas (ordenar para eliminar desde el final)
indices_to_remove.sort()
indices_to_remove.reverse()

# Eliminar todas las expansiones marcadas
for idx in indices_to_remove:
    # Verificar que el índice sea válido
    if idx < 0 or idx >= pending_expansions.size():
        continue
        
    var expansion = pending_expansions[idx]
    var player = expansion.player
    var expansion_id = expansion.id
    
    # Eliminar la expansión
    pending_expansions.remove_at(idx)
```

#### Prevención de Errores de Índice
Implementamos verificaciones robustas para evitar errores de acceso a índices inválidos:

```gdscript
# Verificar que el índice sea válido
if expansion_idx < 0 or expansion_idx >= pending_expansions.size():
    continue
```

#### Beneficios
- Reducción significativa de cálculos redundantes
- Disminución de la carga de CPU durante expansiones múltiples
- Eliminación más eficiente de expansiones completadas
- Prevención de errores de acceso a índices inválidos
- Emisión más eficiente de señales de actualización
- Mejor comportamiento con múltiples jugadores expandiendo simultáneamente

### 6. Optimización del Sistema de Expansión (game_controller.gd)

#### Problema
El sistema de expansión presentaba varios problemas de rendimiento y lógica:
1. Las expansiones se procesaban individualmente, causando sobrecarga.
2. No se consideraba el valor estratégico de los territorios.
3. Las tropas no se gestionaban eficientemente durante expansiones fallidas.
4. La animación de expansión se perdía debido a procesamiento incorrecto.

#### Solución
Implementamos un sistema de procesamiento por lotes con mejoras significativas:

```gdscript
func process_empty_expansions_batch(player: int, expansion_indices: Array) -> Dictionary:
    var result = {
        "processed": 0,
        "territories_changed": false,
        "to_remove": []
    }
    
    # Evaluación única de bordes para todo el lote
    var border_tiles = get_border_tiles_with_empty(player)
    var evaluated_borders = evaluate_borders_strategic_value(border_tiles, player)
```

#### Funcionamiento
1. Procesamiento por lotes de expansiones del mismo tipo y jugador.
2. Evaluación estratégica de bordes realizada una sola vez por lote.
3. Sistema de intentos múltiples para encontrar expansiones válidas.
4. Gestión mejorada de tropas y bajas durante expansiones.
5. Actualización dinámica de bordes después de cada expansión exitosa.

#### Beneficios
- Reducción significativa de cálculos redundantes.
- Mejor distribución de tropas durante expansiones.
- Recuperación de tropas en expansiones fallidas.
- Restauración de la animación de expansión.
- Mejor selección estratégica de territorios.

### 5. Sistema de Multithreading (worker_thread_system.gd)

#### Problema
Las operaciones costosas como cálculo de recursos, validación de población y cálculo de fronteras bloqueaban el hilo principal, causando parones en la experiencia de juego cuando múltiples jugadores realizaban expansiones simultáneas.

#### Solución
Implementamos un sistema de hilos trabajadores que permite ejecutar estas operaciones en hilos secundarios.

```gdscript
# Sistema de hilos trabajadores
var worker_system = WorkerThreadSystem.new()
worker_system.max_threads = 2  # Usar como máximo 2 hilos adicionales
worker_system.debug_mode = DebugConfig.DEBUG_PERFORMANCE

# Procesar recursos en un hilo secundario
if use_threads and worker_system and not worker_system.is_busy():
    process_resources_in_thread(delta)
else:
    # Procesamiento tradicional
    resource_system.process_resources(delta)
```

#### Funcionamiento
1. Se creó una nueva clase `WorkerThreadSystem` que gestiona hilos trabajadores.
2. El sistema usa un pool de hilos (máximo 2 por defecto) y una cola de tareas priorizada.
3. Las operaciones costosas se envían como tareas a los hilos secundarios.
4. Cuando una tarea termina, su resultado se procesa en el hilo principal.
5. Se implementaron cuatro tipos de tareas principales:
   - Cálculo de recursos para un jugador
   - Validación de contadores de población
   - Cálculo de fronteras con casillas vacías
   - Cálculo de fronteras entre jugadores

#### Ejemplo de implementación para cálculo de recursos:
```gdscript
# Preparar datos para el hilo
var task_data = {
    "player": player,
    "territories": player_territories_cache[player],
    "game_controller": game_controller
}

# Agregar la tarea al sistema de hilos
worker_system.add_task(
    WorkerThreadSystem.TaskType.RESOURCE_CALCULATION,
    task_data,
    _on_resource_calculation_completed.bind(player),
    5 # Prioridad media-alta
)
```

#### Beneficios
1. **Mejora de responsividad**: El hilo principal permanece libre para procesar la entrada del usuario.
2. **Mejor uso de CPU**: Aprovechamiento de múltiples núcleos en sistemas modernos.
3. **Escalabilidad**: Permite distribuir el trabajo según la capacidad del sistema.
4. **Flexibilidad**: El sistema puede habilitarse/deshabilitarse según el rendimiento y capacidades del hardware.

#### Limitaciones actuales
1. Implementación limitada a operaciones específicas.
2. Acceso a los datos del game_controller debe sincronizarse cuidadosamente.
3. Los beneficios pueden variar según el hardware del usuario.

## Conclusión Actualizada

Con estas optimizaciones adicionales, el sistema de población y recursos ahora funciona correctamente y de manera eficiente. La población crece de manera predecible basándose en la comida disponible y la capacidad, mientras que la distribución de esta población se mantiene consistente. Estas mejoras, junto con las optimizaciones anteriores de renderizado y caché, hacen que el juego sea más estable y escalable, especialmente con múltiples jugadores y mapas grandes. 
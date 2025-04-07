#!/bin/bash

# Actualizar frontmatter usando el campo 'order' con valores escalonados

# Crear un array con los nombres de archivo ordenados por fecha de modificación
archivos_ordenados=($(ls -t ./econwar/*.md))

# Valor base para el order (empezar con un valor grande y decrementar)
order_value=1000000

for archivo in "${archivos_ordenados[@]}"; do
    nombre_archivo=$(basename "$archivo")
    
    echo "Procesando $nombre_archivo..."
    
    # Crear archivo temporal
    TEMP_FILE=$(mktemp)
    
    # Extraer el contenido omitiendo el frontmatter existente
    awk '
    BEGIN { in_frontmatter = 0; skip = 0; }
    /^---/ && !in_frontmatter { in_frontmatter = 1; skip = 1; next; }
    /^---/ && in_frontmatter { in_frontmatter = 0; skip = 0; next; }
    !skip { print; }
    ' "$archivo" > "$TEMP_FILE.content"
    
    # Obtener fecha real de modificación para el campo date
    fecha_modificacion=$(date -r "$archivo" +"%Y-%m-%d")
    
    # Crear nuevo archivo con frontmatter actualizado
    echo "---" > "$TEMP_FILE"
    echo "date: $fecha_modificacion" >> "$TEMP_FILE"
    echo "order: $order_value" >> "$TEMP_FILE"
    echo "---" >> "$TEMP_FILE"
    cat "$TEMP_FILE.content" >> "$TEMP_FILE"
    
    # Reemplazar el archivo original
    mv "$TEMP_FILE" "$archivo"
    rm -f "$TEMP_FILE.content"
    
    echo "Actualizado $nombre_archivo con order: $order_value"
    
    # Decrementar el valor de order para el siguiente archivo
    order_value=$((order_value - 1000))
done

echo "Actualización de frontmatter completada."
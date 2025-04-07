#!/bin/bash

# Añadir frontmatter con fecha y hora a los archivos .md existentes en econwar

for archivo in ./econwar/*.md; do
    nombre_archivo=$(basename "$archivo")
    # Usar formato ISO para la fecha que incluye hora
    fecha_modificacion=$(date -r "$archivo" +"%Y-%m-%dT%H:%M:%S")
    
    echo "Procesando $nombre_archivo..."
    
    # Crear archivo temporal
    TEMP_FILE=$(mktemp)
    
    # Verificar si el archivo ya tiene frontmatter
    if head -n 3 "$archivo" | grep -q "^---"; then
        # Ya tiene frontmatter, actualiza o añade el campo date
        awk -v fecha="$fecha_modificacion" '
        BEGIN { in_frontmatter = 0; date_updated = 0; }
        /^---/ && !in_frontmatter { in_frontmatter = 1; print; next; }
        /^---/ && in_frontmatter { in_frontmatter = 0; if (!date_updated) { print "date: " fecha; }; print; next; }
        /^date:/ && in_frontmatter { print "date: " fecha; date_updated = 1; next; }
        in_frontmatter && !date_updated && /^[a-zA-Z]/ { print $0; if (!date_updated) { print "date: " fecha; date_updated = 1; } next; }
        { print; }
        ' "$archivo" > "$TEMP_FILE"
    else
        # No tiene frontmatter, crea uno nuevo
        echo "---" > "$TEMP_FILE"
        echo "date: $fecha_modificacion" >> "$TEMP_FILE"
        echo "---" >> "$TEMP_FILE"
        cat "$archivo" >> "$TEMP_FILE"
    fi
    
    # Reemplazar el archivo original
    mv "$TEMP_FILE" "$archivo"
    
    echo "Actualizado $nombre_archivo con fecha: $fecha_modificacion"
done

echo "Actualización de frontmatter completada."
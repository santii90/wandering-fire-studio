#!/bin/bash

# Rutas de origen y destino
ORIGEN="../econwar/docs"
DESTINO="./econwar"

# Verificar que la carpeta de destino existe
if [ ! -d "$DESTINO" ]; then
    mkdir -p "$DESTINO"
    echo "Carpeta $DESTINO creada."
fi

# Crear lista temporal de archivos de destino
find "$DESTINO" -type f -name "*.md" > /tmp/archivos_destino.txt

# Copiar archivos .md desde el origen, reemplazando si son más nuevos y añadiendo frontmatter
find "$ORIGEN" -type f -name "*.md" | while read archivo; do
    nombre_archivo=$(basename "$archivo")
    # Usar formato ISO para la fecha que incluye hora
    fecha_modificacion=$(date -r "$archivo" +"%Y-%m-%dT%H:%M:%S")
    
    echo "Procesando $nombre_archivo..."
    
    # Verificar si el archivo ya tiene frontmatter
    if head -n 3 "$archivo" | grep -q "^---"; then
        # Ya tiene frontmatter, verifica si tiene date
        if head -n 10 "$archivo" | grep -q "^date:"; then
            # Ya tiene date, crea un temp con la fecha actualizada
            TEMP_FILE=$(mktemp)
            awk -v fecha="$fecha_modificacion" '
            BEGIN { in_frontmatter = 0; date_set = 0; }
            /^---/ && !in_frontmatter { in_frontmatter = 1; print; next; }
            /^---/ && in_frontmatter { in_frontmatter = 0; print; next; }
            /^date:/ && in_frontmatter { print "date: " fecha; date_set = 1; next; }
            in_frontmatter && !date_set && /^[a-zA-Z]/ { print "date: " fecha; print; date_set = 1; next; }
            { print; }
            ' "$archivo" > "$TEMP_FILE"
            cp "$TEMP_FILE" "$DESTINO/$nombre_archivo"
            rm "$TEMP_FILE"
        else
            # Tiene frontmatter pero no date, añade date
            TEMP_FILE=$(mktemp)
            awk -v fecha="$fecha_modificacion" '
            BEGIN { printed = 0; }
            /^---/ && !printed { print; print "date: " fecha; printed = 1; next; }
            { print; }
            ' "$archivo" > "$TEMP_FILE"
            cp "$TEMP_FILE" "$DESTINO/$nombre_archivo"
            rm "$TEMP_FILE"
        fi
    else
        # No tiene frontmatter, crea uno nuevo con date
        TEMP_FILE=$(mktemp)
        echo "---" > "$TEMP_FILE"
        echo "date: $fecha_modificacion" >> "$TEMP_FILE"
        echo "---" >> "$TEMP_FILE"
        cat "$archivo" >> "$TEMP_FILE"
        cp "$TEMP_FILE" "$DESTINO/$nombre_archivo"
        rm "$TEMP_FILE"
    fi
    
    # Eliminar de la lista temporal los archivos que existen en origen
    sed -i "\|$nombre_archivo|d" /tmp/archivos_destino.txt
done

# Eliminar archivos que ya no existen en el origen
while read archivo_eliminar; do
    if [ -f "$archivo_eliminar" ]; then
        echo "Eliminando $archivo_eliminar..."
        rm "$archivo_eliminar"
    fi
done < /tmp/archivos_destino.txt

# Limpiar
rm /tmp/archivos_destino.txt

echo "Sincronización completada."
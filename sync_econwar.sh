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

# Obtener lista de archivos ordenados por fecha de modificación
ARCHIVOS_ORDENADOS=($(find "$ORIGEN" -type f -name "*.md" -printf "%T@ %p\n" | sort -nr | cut -d' ' -f2-))

# Valor base para el order (empezar con un valor grande y decrementar)
ORDER_VALUE=1000000

# Procesar archivos en orden de más reciente a más antiguo
for archivo in "${ARCHIVOS_ORDENADOS[@]}"; do
    nombre_archivo=$(basename "$archivo")
    # Guardar los timestamps originales
    ATIME=$(stat -c %X "$archivo")
    MTIME=$(stat -c %Y "$archivo")
    
    # Usar formato ISO para la fecha que incluye hora para el frontmatter
    fecha_modificacion=$(date -d @$MTIME +"%Y-%m-%dT%H:%M:%S")
    
    echo "Procesando $nombre_archivo..."
    archivo_destino="$DESTINO/$nombre_archivo"
    
    # Verificar si el archivo ya tiene frontmatter
    if head -n 3 "$archivo" | grep -q "^---"; then
        # Ya tiene frontmatter, verifica si tiene date y order
        TEMP_FILE=$(mktemp)
        
        awk -v fecha="$fecha_modificacion" -v orden="$ORDER_VALUE" '
        BEGIN { in_frontmatter = 0; date_set = 0; order_set = 0; }
        /^---/ && !in_frontmatter { in_frontmatter = 1; print; next; }
        /^---/ && in_frontmatter { 
            if (!date_set) { print "date: " fecha; }
            if (!order_set) { print "order: " orden; }
            in_frontmatter = 0; 
            print; 
            next; 
        }
        /^date:/ && in_frontmatter { print "date: " fecha; date_set = 1; next; }
        /^order:/ && in_frontmatter { print "order: " orden; order_set = 1; next; }
        { print; }
        ' "$archivo" > "$TEMP_FILE"
        
        cp "$TEMP_FILE" "$archivo_destino"
        rm "$TEMP_FILE"
    else
        # No tiene frontmatter, crea uno nuevo con date y order
        TEMP_FILE=$(mktemp)
        echo "---" > "$TEMP_FILE"
        echo "date: $fecha_modificacion" >> "$TEMP_FILE"
        echo "order: $ORDER_VALUE" >> "$TEMP_FILE"
        echo "---" >> "$TEMP_FILE"
        cat "$archivo" >> "$TEMP_FILE"
        cp "$TEMP_FILE" "$archivo_destino"
        rm "$TEMP_FILE"
    fi
    
    # Restaurar los timestamps originales al archivo de destino
    touch -a -d @$ATIME "$archivo_destino"
    touch -m -d @$MTIME "$archivo_destino"
    
    # Eliminar de la lista temporal los archivos que existen en origen
    sed -i "\|$nombre_archivo|d" /tmp/archivos_destino.txt
    
    # Decrementar el valor de order para el siguiente archivo
    ORDER_VALUE=$((ORDER_VALUE - 1000))
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
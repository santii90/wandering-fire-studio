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

# Copiar archivos .md desde el origen, reemplazando si son más nuevos
find "$ORIGEN" -type f -name "*.md" | while read archivo; do
    nombre_archivo=$(basename "$archivo")
    echo "Copiando $nombre_archivo..."
    cp -u "$archivo" "$DESTINO/"
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
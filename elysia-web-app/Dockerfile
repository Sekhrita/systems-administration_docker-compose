# Usar la imagen oficial de Bun
FROM oven/bun:1 AS base

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias
RUN bun install

# Exponer el puerto que utiliza la aplicación web
EXPOSE 3000/tcp

# Ejecutar la aplicación
ENTRYPOINT ["bun", "run", "src/app.ts"]

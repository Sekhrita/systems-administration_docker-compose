# Usar la imagen oficial de Bun
FROM oven/bun:1 AS base

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos del microservicio
COPY . .

# Instalar dependencias
RUN bun install

# Exponer el puerto que utiliza el microservicio
EXPOSE 4000/tcp

# Ejecutar el microservicio
ENTRYPOINT ["bun", "run", "src/app.ts"]

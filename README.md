# Contador Cagadas

Este proyecto es una página web llamada **Contador Cagadas** que consiste en un ranking sobre quién caga más veces. Incluye un sistema de calificación y un sistema de recompensas para los usuarios.

## Características

- **Ranking**: Visualiza quién lidera la tabla de "cagadas".
- **Sistema de Calificación**: Califica tus experiencias.
- **Sistema de Recompensas**: Gana recompensas por tus logros.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente utilizando Git y Node.js.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión recomendada: 20.x o superior)
- [Git](https://git-scm.com/)

### Pasos

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/lucas-sanchez-cabrera/Proyecto-Cagadas.git
    cd Proyecto-Cagadas
    ```

2.  **Configurar y ejecutar el Backend**

    Navega a la carpeta del backend, instala las dependencias e inicia el servidor.

    ```bash
    cd Cagadas-BackEnd
    npm install
    # Crear un archivo .env basado en la configuración necesaria (si aplica)
    npm run dev
    ```

    El backend correrá usualmente en `http://localhost:3000` (o el puerto configurado).

3.  **Configurar y ejecutar el Frontend**

    Abre una nueva terminal, navega a la carpeta del frontend, instala las dependencias e inicia la aplicación.

    ```bash
    cd ../Cagadas-FrontEnd
    npm install
    npm run dev
    ```

    El frontend estará disponible en la URL que indique la terminal (por ejemplo, `http://localhost:5173`).

## Ejecucion con Docker

Tambien puedes levantar Frontend + Backend + MongoDB con Docker Compose.

### Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Pasos

1. Desde la raiz del proyecto, construir y levantar contenedores:

   ```bash
   docker compose up --build
   ```

2. Acceder a las aplicaciones:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3000`
   - MongoDB: `mongodb://localhost:27017/cagadas`

3. Para detener todo:

   ```bash
   docker compose down
   ```

## Tecnologías

- **Frontend**: Vue.js, Vite
- **Backend**: Node.js, Express, MongoDB (Mongoose)

# servicio-social-back

Este es el backend para la plataforma web de servicio social de la Universidad Modelo. Esta aplicación permite gestionar información relacionada con viviendas o propiedades.

Nuestro servicio social fue crear una plataforma de renta de casas que nuestra institucion pudiera utilizar. Este es el repositorio del sitio web. Todo el back-end esta dentro de otro repositorio, servicio-social-back

Si se hacen cambios, estos se actualizan automaticamente en las instancias de la nube.

[Hice una wiki si necesitan ayuda ](https://github.com/JosephByronLane/servicio-social-back/wiki)

## Features

*   Esta API da endpoints para:
    *   Dueños
    *   Servicios (Luz, mascotas, amueblado...)
    *   Listados
    *   Casas
    *   Imagenes (Servidas estaticamente)
*   Autentificacion de tokens en base a JWT
*   Permite la subida de archivos
*   Manda notificaciones Email para cuando se crea y si una vivienda se deja mucho tiempo en el sistema.

## Prerequisitos

*   Docker
*   Node.js (Si no se va a usar Docker)
*   Un archivo `.env` con las variables necesarias.

## Getting Started

### Con Docker (Recomendado)

1.  **Clone el repositorio:**
    ```bash
    git clone https://github.com/JosephByronLane/servicio-social-back.git
    cd servicio-social-back
    ```
2.  **Cree un archivo `.env`** basado en las variables de `docker-compose.yaml`. Complete los valores requeridos.
    ```
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_ROOT_PASSWORD=your_db_root_password
    # Add other variables like JWT_SECRET, EMAIL_HOST, etc.
    ```
3.  **Build and run the services:**
    ```bash
    docker-compose up --build
    ```
    La API despues estara disponible en `http://localhost:3000`.

### Local Development (Sin Docker)

1.  **Clone el repositorio:**
    ```bash
    git clone <repository-url>
    cd servicio-social-back
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** with the necessary environment variables. Ensure your MariaDB instance is running and accessible.
4.  **Run the application:**
    *   For development with auto-reloading:
        ```bash
        npm run nodemon
        ```
    *   To start with PM2 (for a more production-like local setup):
        ```bash
        npm run pm2
        ```
    La API despues estara disponible en `http://localhost:3000`.

## API Endpoints

La lógica principal de la aplicación está en `app.js`, que define las siguientes rutas base:

*   `/owner`: Rutas relacionadas con los dueños.
*   `/service`: Rutas relacionadas con los servicios.
*   `/listing`: Rutas relacionadas con los listados.
*   `/house`: Rutas relacionadas con las casas.
*   `/image`: Rutas relacionadas con las imágenes.

Consulte los archivos en el directorio `routes/` para obtener definiciones detalladas de los endpoints.


## Funcionalidad de Email

El servicio de email corre bajo 2 reglas:
* Si se acaba de crear un listado, manda un email con el token usando el template `new.template.html` 
* Si un listado esta en el sistema 

# Ionic + Express + Sequelize + MySQL App

Este proyecto es una aplicación desarrollada utilizando **Ionic** para el frontend y **Express** con **Sequelize** y **MySQL** para el backend. La aplicación permite gestionar frases ilustres con funcionalidades CRUD (Create, Read, Update, Delete) conectándose a una base de datos MySQL.

## Características principales

- **Frontend**: Ionic con React, permite visualizar, crear, editar y eliminar frases ilustres.
- **Backend**: Express con Sequelize como ORM para gestionar la base de datos MySQL.
- **CRUD** completo: Permite realizar operaciones de **crear**, **leer**, **actualizar** y **eliminar** frases, gestionando las operaciones a través de la API.
- **Filtros por etiquetas**: El usuario puede buscar frases basadas en las etiquetas asociadas.
- **API REST**: Conexión entre el frontend y backend utilizando una API REST, implementada con Express y Sequelize.

## Funcionalidades

### Frontend (Ionic + React)

- **Visualización de frases**: Se pueden ver las frases guardadas en la base de datos en una lista o cuadrícula.
- **Buscar por etiquetas**: Se puede buscar frases en función de sus etiquetas.
- **Añadir frases**: Los usuarios pueden agregar nuevas frases con un autor y etiquetas.
- **Editar frases**: Las frases se pueden editar en la misma vista sin necesidad de redirigir a otra página.
- **Eliminar frases**: Se pueden eliminar frases directamente desde la vista.
- **Interfaz responsive**: Adaptado para diferentes resoluciones de pantalla, con efectos visuales como degradados y transparencia en los IonCard.

### Backend (Express + Sequelize + MySQL)

- **Gestión de frases**: El backend maneja todas las operaciones CRUD para frases.
- **Conexión con MySQL**: Sequelize se utiliza como ORM para interactuar con la base de datos MySQL.
- **Validación de datos**: El backend valida los datos antes de guardarlos en la base de datos.
- **Sincronización automática**: Sequelize sincroniza los modelos con las tablas de la base de datos.

### RECOMIENDO ENCARECIDAMENTE EL USO DE LA EXTENSION DE VSCODE IONIC PREVIEW para arrancar la parte del BACKEND y FRONTEND

## Requisitos del sistema

Para ejecutar este proyecto, necesitas tener instalados los siguientes programas:

- **Node.js** (>= 14.x)
- **Ionic CLI** (>= 6.x)
- **MySQL** (>= 5.x)

## Instalación

Sigue estos pasos para configurar el entorno de desarrollo:

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### Instalar dependencias

Instala las dependencias tanto del backend como del frontend.

#### Backend (Express + Sequelize)

```bash
cd backend
npm install
```

#### Frontend (Ionic + React)

```bash
cd frontend
npm install
```

### Configurar base de datos MySQL

Crea una base de datos MySQL y actualiza las credenciales en el archivo `.env` en la carpeta del backend:

```
DB_NAME=beleten_db
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_DIALECT=mysql
```

### Sincronizar la base de datos

Para sincronizar la base de datos con los modelos definidos en Sequelize:

```bash
cd backend
npm run db:sync
```

### Ejecutar el backend

Inicia el servidor Express:

```bash
cd backend
npm run dev
```

El servidor estará corriendo en `http://localhost:8080`.

### Ejecutar el frontend

Inicia el servidor de desarrollo de Ionic:

```bash
cd frontend
ionic serve
```

El frontend estará corriendo en `http://localhost:8100`.

## Endpoints API (Express)

A continuación se listan los principales endpoints de la API disponibles en el backend:

| Método | Endpoint            | Descripción                        |
|--------|---------------------|------------------------------------|
| GET    | `/api/frases`        | Obtiene todas las frases           |
| POST   | `/api/frases`        | Crea una nueva frase               |
| PUT    | `/api/frases/:id`    | Actualiza una frase existente      |
| DELETE | `/api/frases/:id`    | Elimina una frase                  |

### Documentación de Postman

Puedes importar la colección de Postman desde el siguiente enlace para probar los endpoints:

[Importar colección de Postman](https://www.getpostman.com/collections/tu-enlace-a-la-coleccion)

## Ejemplos de peticiones (Postman)

Aquí tienes ejemplos de cómo realizar peticiones a la API desde Postman o cualquier cliente HTTP:

### Obtener todas las frases

```bash
GET /api/frases
```

### Crear una nueva frase

```bash
POST /api/frases
Content-Type: application/json
{
  "text": "La vida es bella.",
  "author": "Desconocido",
  "tags": ["Vida", "Belleza"]
}
```

### Actualizar una frase

```bash
PUT /api/frases/1
Content-Type: application/json
{
  "text": "El conocimiento es poder actualizado.",
  "author": "Francis Bacon",
  "tags": ["Conocimiento", "Poder", "Sabiduría"]
}
```

### Eliminar una frase

```bash
DELETE /api/frases/1
```

## Diseño UI/UX

La aplicación ha sido diseñada teniendo en cuenta los principios de UX/UI para ofrecer una experiencia de usuario fluida y atractiva. Se utilizan componentes de Ionic como **IonCard**, **IonGrid**, y **IonFab** para crear una interfaz interactiva, con funcionalidades como edición en la misma vista y efectos de hover.

### Principales características de diseño:

- **Colores suaves con transparencia**: Los colores de fondo en los IonCard utilizan degradados con transparencia para mejorar la estética.
- **Botones flotantes (IonFab)**: Los botones de edición y eliminación se encuentran de manera accesible y están bien integrados en la UI.
- **Modo cuadrícula y lista**: La vista de las frases se puede alternar entre cuadrícula y lista según las preferencias del usuario.

## Créditos

- **Frontend**: Ionic + React
- **Backend**: Express + Sequelize
- **Base de datos**: MySQL

## Enlaces

- [Repositorio en GitHub](https://github.com/IdafeCabrera/Beleten.git)
- [Enlace a Postman](https://www.postman.com/idafe/frases-api-beleten/collection/20683089-0624c61b-d08a-4ca7-b7da-1d9f5b6fe61a/?action=share&creator=20683089)

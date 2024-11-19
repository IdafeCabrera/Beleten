# Frases Célebres - Aplicación Full Stack con Ionic, Express, Sequelize y MySQL

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Características Implementadas por UT](#características-implementadas-por-ut)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Componentes Ionic](#componentes-ionic)
6. [API REST Documentación](#api-rest-documentación)
7. [Funcionalidades CRUD](#funcionalidades-crud)
8. [Guía de Instalación](#guía-de-instalación)
9. [Características por Implementar](#características-por-implementar)

## 🎯 Descripción General

Aplicación full stack para la gestión de frases célebres que permite operaciones CRUD completas, incluyendo manejo de imágenes y sistema de etiquetas. La aplicación está desarrollada con Ionic/React en el frontend y Express/Sequelize/MySQL en el backend.

### Enlaces Importantes
- **Repositorio GitHub**: [https://github.com/IdafeCabrera/Beleten.git](https://github.com/IdafeCabrera/Beleten.git)
- **Documentación API Postman**: [Colección Postman](https://www.postman.com/idafe/frases-api-beleten/collection/20683089-0624c61b-d08a-4ca7-b7da-1d9f5b6fe61a/?action=share&creator=20683089)

## ✨ Características Implementadas por UT

### UT1 - Funcionalidades CRUD Básicas (20%)
- [x] API REST completa implementada
- [x] Documentación Postman disponible
- [x] Operaciones CRUD funcionales tanto en backend como frontend
- [x] Integración completa entre frontend y backend

### UT2 - Componentes Ionic y CRUDs Adicionales (20%)
#### Componentes Ionic Implementados:
1. **IonCard** - Visualización de frases
2. **IonButton** - Acciones principales
3. **IonFab** - Botones flotantes para acciones rápidas
4. **IonModal** - Formularios de edición/creación
5. **IonAlert** - Confirmaciones de eliminación
6. **IonIcon** - Iconografía en toda la app
7. **IonGrid** - Layout responsive
8. **IonInfiniteScroll** - Carga paginada de frases
9. **IonSearchbar** - Búsqueda de frases
10. **IonSegment** - Navegación entre secciones

#### CRUDs Implementados:
- [x] CRUD Principal de Frases
- [ ] CRUD de Categorías (pendiente)
- [ ] CRUD de Autores (pendiente)

### UT3 - Funcionalidades de Cámara (10%)
- [x] Captura de fotos implementada
- [x] Integración con el CRUD de frases
- [x] Almacenamiento de imágenes en backend
- [x] Previsualización de imágenes
- [x] Selección de imágenes de la galería

### UT5 - Autenticación y Seguridad (10%)
- [ ] Autenticación básica (pendiente)
- [ ] Token Bearer (pendiente)
- [ ] Encriptación de claves (pendiente)

## 🛠 Tecnologías Utilizadas

### Frontend
- Ionic 6.x
- React 18.x
- Capacitor para funcionalidades nativas
- TypeScript

### Backend
- Node.js
- Express
- Sequelize ORM
- MySQL

## 📁 Estructura del Proyecto

```
proyecto/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── config/
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    └── config/
```

## 🎨 Componentes Ionic

Detalle de los componentes Ionic implementados y su uso:

### IonCard
```typescript
<IonCard className={`custom-card ${design.toLowerCase()}`}>
  <IonCardHeader>
    <IonCardTitle>{phrase.text}</IonCardTitle>
  </IonCardHeader>
  // ... más contenido
</IonCard>
```

### IonModal (para edición/creación)
```typescript
<IonModal isOpen={isOpen} onDidDismiss={onClose}>
  <IonToolbar>
    <IonTitle>{phrase ? "Editar Frase" : "Nueva Frase"}</IonTitle>
  </IonToolbar>
  // ... formulario
</IonModal>
```

### IonInfiniteScroll (para paginación)
```typescript
<IonInfiniteScroll
  onIonInfinite={handleInfiniteScroll}
  threshold="100px"
  disabled={!hasMore}
>
  <IonInfiniteScrollContent />
</IonInfiniteScroll>
```

## 📡 API REST Documentación

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/phrases` | Obtiene todas las frases |
| POST | `/api/phrases` | Crea una nueva frase |
| PUT | `/api/phrases/:id` | Actualiza una frase |
| DELETE | `/api/phrases/:id` | Elimina una frase |
| POST | `/api/phrases/:id/image` | Sube una imagen |

### Ejemplos de Uso

#### GET /api/phrases
```bash
GET http://localhost:8080/api/phrases
```
Respuesta:
```json
{
  "phrases": [
    {
      "id": 1,
      "text": "La vida es bella",
      "author": "Roberto Benigni",
      "tags": {
        "es": ["vida", "optimismo"]
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```

#### POST /api/phrases
```bash
POST http://localhost:8080/api/phrases
Content-Type: application/json

{
  "text": "La vida es bella",
  "author": "Roberto Benigni",
  "tags": {
    "es": ["vida", "optimismo"]
  }
}
```

## 📱 Funcionalidades CRUD en la App

### Visualización (GET)
- Lista/Grid de frases con infinite scroll
- Filtros por autor, categoría y tags
- Vista detallada de cada frase

### Creación (POST)
- Formulario modal para nueva frase
- Soporte para imágenes (cámara/galería)
- Validación de campos

### Actualización (PUT)
- Edición inline de frases
- Actualización de imágenes
- Gestión de tags

### Eliminación (DELETE)
- Confirmación doble de eliminación
- Eliminación en cascada de recursos asociados

## 🚀 Guía de Instalación

### Prerequisitos
- Node.js >= 14.x
- MySQL >= 5.7
- Ionic CLI >= 6.x

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/IdafeCabrera/Beleten.git
cd Beleten
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

4. Configurar variables de entorno:
```env
DB_NAME=beleten_db
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
```

5. Iniciar servicios:
```bash
# Backend
npm run dev

# Frontend
ionic serve
```

## 🎯 Características por Implementar

### Próximas Funcionalidades
1. **Autenticación y Autorización**
   - Sistema de login/registro
   - JWT para autenticación
   - Roles de usuario

2. **CRUDs Adicionales**
   - Gestión de categorías
   - Gestión de autores
   - Sistema de favoritos

3. **Mejoras de UX**
   - Modo offline
   - Sincronización en segundo plano
   - Notificaciones push

### Mejoras Técnicas Pendientes
1. **Seguridad**
   - Implementación de autenticación básica
   - Token Bearer
   - Encriptación de datos sensibles

2. **Optimización**
   - Caché de imágenes
   - Lazy loading de componentes
   - Compresión de imágenes

3. **Testing**
   - Pruebas unitarias
   - Pruebas de integración
   - E2E testing

## 📞 Contacto y Soporte

Para más información o soporte:
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [IdafeCabrera](https://github.com/IdafeCabrera)

## Enlaces

- [Repositorio en GitHub](https://github.com/IdafeCabrera/Beleten.git)
- [Enlace a Postman](https://www.postman.com/idafe/frases-api-beleten/collection/20683089-0624c61b-d08a-4ca7-b7da-1d9f5b6fe61a/?action=share&creator=20683089)

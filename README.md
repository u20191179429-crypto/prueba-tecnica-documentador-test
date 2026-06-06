# Sistema de Gestión de Solicitudes - CITCD
### Universidad Surcolombiana

MVP funcional para la gestión de solicitudes del Centro de Investigación y Transferencia de Conocimiento y Desarrollo (CITCD).

---

## 📋 Requisitos Previos

| Herramienta | Versión Mínima |
|---|---|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| Angular CLI | 18 (se instala con el proyecto) |

---

## 🚀 Instrucciones de Ejecución

### 1. Backend (Spring Boot)

```bash
# Navegar al directorio del backend
cd backend

# Compilar y ejecutar
mvn spring-boot:run
```

> El servidor se iniciará en **http://localhost:8080**

### 2. Frontend (Angular)

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar servidor de desarrollo
npx ng serve
```

> La aplicación estará disponible en **http://localhost:4200**

---

## 🔐 Credenciales de Prueba

| Usuario | Contraseña | Rol | Permisos |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | Crear, listar todas, filtrar por estado |
| `docente` | `docente123` | DOCENTE | Crear, filtrar por estado |
| `estudiante` | `estudiante123` | ESTUDIANTE | Crear solicitudes |

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción | Roles |
|---|---|---|---|
| `POST` | `/api/auth/login` | Autenticación de usuario | Público |
| `POST` | `/api/solicitudes` | Crear nueva solicitud | Todos (autenticados) |
| `GET` | `/api/solicitudes` | Listar todas las solicitudes | ADMIN |
| `GET` | `/api/solicitudes/estado/{estado}` | Filtrar por estado | ADMIN, DOCENTE |

### Ejemplo de petición - Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{"username":"admin","password":"admin123"}'
```

### Ejemplo de petición - Crear Solicitud
```bash
curl -X POST http://localhost:8080/api/solicitudes \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{"tipo":"Certificado","asunto":"Certificado de notas","descripcion":"Solicito certificado de notas","prioridad":"Alta"}'
```

---

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/usco/citcd/
│       ├── SolicitudesCitcdApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── SolicitudController.java
│       ├── model/
│       │   ├── LoginRequest.java
│       │   ├── Solicitud.java
│       │   └── Usuario.java
│       └── service/
│           └── SolicitudService.java
│
├── frontend/
│   ├── angular.json
│   ├── package.json
│   └── src/app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── guards/
│       │   └── auth.guard.ts
│       ├── models/
│       │   ├── solicitud.model.ts
│       │   └── usuario.model.ts
│       ├── services/
│       │   ├── auth.service.ts
│       │   └── solicitud.service.ts
│       └── components/
│           ├── login/
│           ├── navbar/
│           ├── formulario-solicitud/
│           ├── lista-solicitudes/
│           └── filtrar-solicitudes/
│
└── README.md
```

---

## 🛠 Stack Tecnológico

- **Backend**: Java 17, Spring Boot 3.2.5, Spring Security (Basic Auth)
- **Frontend**: Angular 18, Bootstrap 5, Bootstrap Icons
- **Persistencia**: In-memory (sin base de datos)

---

## 📝 Notas

- Los datos se almacenan en memoria. Al reiniciar el backend, se restauran los datos de ejemplo predefinidos.
- Se incluyen 4 solicitudes de ejemplo pre-cargadas para facilitar las pruebas.
- CORS está configurado para permitir peticiones desde `http://localhost:4200`.
- La autenticación utiliza HTTP Basic Auth.

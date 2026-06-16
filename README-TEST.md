# 🧪 Pruebas Automatizadas
## Backend
Como parte de la validación técnica del sistema, se ha implementado una suite de pruebas automatizadas para el Backend.

### ⚙️ Stack Tecnológico de Pruebas
* **Framework Core:** JUnit 5 (Jupiter)
* **Mocking:** Mockito
* **Pruebas de Integración Web:** Spring MockMvc (Standalone Setup)
* **Validaciones:** Jakarta Bean Validation (`LocalValidatorFactoryBean`)
* **Serialización:** Jackson `JavaTimeModule` (Soporte para manejo de fechas en Java 8)


### 🏃‍♂️ Ejecución de Pruebas
Para correr la suite de pruebas unitarias y de integración, abra su terminal, navegue al directorio raíz del `backend` y ejecute:

```bash
# Navegar al directorio del backend
cd backend

# Compilar y ejecutar
mvn test
```

### 📊 Cobertura Alcanzada por Módulo

* **Módulo de Login (`AuthControllerTest`)**
  * Validación del flujo de inicio de sesión exitoso mapeando roles (`ADMIN`, `DOCENTE`, `ESTUDIANTE`).
  * Comprobación de rechazo por credenciales inválidas (`BadCredentialsException`).
  * Validación de restricciones ante peticiones con campos de usuario o contraseña vacíos.
  * Verificación de denegación de acceso para usuarios inexistentes en el sistema.

* **Módulo de Registro de Solicitudes (`SolicitudControllerTest`)**
  * **Casos Exitosos Parametrizados:** Evaluación exhaustiva de 15 combinaciones válidas utilizando `@ParameterizedTest` (5 Tipos de Solicitud cruzados con 3 Prioridades).
  * **Validación de Formularios:** Comprobación de retornos `400 Bad Request` forzados por el entorno JSR-380 (`@Valid`) ante la omisión de datos requeridos (Asunto vacío, Descripción vacía, Tipo no seleccionado o Cuerpo HTTP nulo).

* **Módulo de Consulta de Solicitudes (`SolicitudServiceTest`)**
  * Confirmación del estado inicial asegurando la carga de las 4 solicitudes base en memoria.
  * Validación de la mutabilidad (inserción de nuevos registros, autoincremento de IDs y asignación automática del estado `Pendiente`).
  * Verificación de robustez del motor de filtrado por estados (garantizando tolerancia a variaciones de mayúsculas/minúsculas y el correcto retorno de colecciones vacías ante estados no contemplados).

### Resultados del Test
---
  ```bash
  [INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.usco.citcd.controller.AuthControllerTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.usco.citcd.controller.SolicitudControllerTest
...
[main] WARN org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver -- Resolved [org.springframework.web.bind.MethodArgumentNotValidException: Validation failed...
...
[INFO] Tests run: 20, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.usco.citcd.service.SolicitudServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] Results:
[INFO]
[INFO] Tests run: 34, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```
---

## Frontend

### ⚙️ Stack Tecnológico de Pruebas
* **Framework Core:** Jasmine
* **Test Runner:** Karma
* **Entorno Angular:** `TestBed` para simulación de componentes y dependencias.
* **Manejo de Red:** `HttpClientTestingModule` y `HttpTestingController` para aislar peticiones HTTP reales.

### 🏃‍♂️ Ejecución de Pruebas
Para ejecutar la suite de pruebas unitarias del frontend, navegue al directorio `frontend` y ejecute:
```bash
# Navegar al directorio del frontend
cd frontend

# Compilar y ejecutar
npx ng test
```

### 📊 Cobertura Alcanzada por Módulo

### 📊 Cobertura Alcanzada por Módulo

* **Componente de Autenticación (`LoginComponent`)**
  * Verificación de inicialización de formularios reactivos y validaciones nativas.
  * Simulación de ciclo de vida asíncrono para evaluar el enrutamiento dinámico según el rol (`ADMIN` vs. `DOCENTE`/`ESTUDIANTE`).
  * Validación de manipulación del DOM (aparición de alertas rojas en retornos HTTP 401).

* **Servicio de Consumo API (`SolicitudService`)**
  * Aislamiento de red para asegurar pruebas predecibles sin depender del backend.
  * Verificación de la correcta inyección del Token de Autorización (HTTP Basic Auth) en las cabeceras de cada petición.
  * Comprobación del correcto mapeo de verbos HTTP (`GET`, `POST`) a los endpoints correspondientes.

* **Registro de Solicitudes (`FormularioSolicitudComponent`)**
  * Evaluación estricta de validaciones síncronas (`required`, `minLength` de 5 y 10 caracteres).
  * Comprobación del comportamiento interactivo del UI (bloqueo/desbloqueo dinámico del botón Submit).
  * Simulación de flujos de éxito y error con validación de reseteo del formulario y renderizado de alertas.

### Resultados del Test
---
```bash
22 specs, 0 failures, randomized with seed 28454
FormularioSolicitudComponent
debe llamar a SolicitudService y mostrar mensaje de éxito si la creación es correcta(78ms)
debe habilitar el botón submit si el formulario es válido(13ms)
debe marcar todos los campos como tocados (touched) si se intenta enviar un formulario inválido(8ms)
debe crear el componente(5ms)
debe marcar el formulario como inválido al inicio(4ms)
debe limpiar el formulario al presionar el botón Reset(6ms)
debe validar la longitud mínima del asunto (5 caracteres)(7ms)
debe mostrar mensaje de error si falla la creación en el servidor(6ms)
debe validar la longitud mínima de la descripción (10 caracteres)(4ms)
SolicitudService
debe filtrar las solicitudes por estado mediante GET(15ms)
debe crearse correctamente(3ms)
debe crear una nueva solicitud mediante POST e incluir cabeceras de auth(2ms)
debe obtener todas las solicitudes mediante GET(2ms)
LoginComponent
debe mostrar mensaje de validación si se toca el input vacío(26ms)
debe llamar al AuthService y redirigir a /solicitudes/nueva si NO es ADMIN (ej. DOCENTE)(34ms)
no debe llamar al AuthService si el formulario es inválido(4ms)
debe llamar al AuthService y redirigir a /solicitudes si es ADMIN(5ms)
debe inicializar el formulario inválido si está vacío(3ms)
debe habilitar el botón submit y ser válido cuando los campos estén llenos(4ms)
debe rellenar el formulario al usar el método fillCredentials()(4ms)
debe mostrar mensaje de error 401 si las credenciales son inválidas(8ms)
debe crear el componente(2ms)
```
---

---

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/usco/citcd/
│       │   ├── SolicitudesCitcdApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   └── SolicitudController.java
│       │   ├── model/
│       │   │   ├── LoginRequest.java
│       │   │   ├── Solicitud.java
│       │   │   └── Usuario.java
│       │   └── service/
│       │       └── SolicitudService.java
│       └── test/java/com/usco/citcd/
│           ├── controller/
│           │   ├── AuthControllerTest.java
│           │   └── SolicitudControllerTest.java
│           └── service/
│               └── SolicitudServiceTest.java
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
│       │   ├── solicitud.service.ts
│       │   └── solicitud.service.spec.ts
│       └── components/
│           ├── login/
│           │   ├── login.component.ts
│           │   └── login.component.spec.ts
│           ├── navbar/
│           │   └── navbar.component.ts
│           ├── formulario-solicitud/
│           │   ├── formulario-solicitud.component.ts
│           │   └── formulario-solicitud.component.spec.ts
│           ├── lista-solicitudes/
│           │   └── lista-solicitudes.component.ts
│           └── filtrar-solicitudes/
│               └── filtrar-solicitudes.component.ts
│
└── README.md
```

---
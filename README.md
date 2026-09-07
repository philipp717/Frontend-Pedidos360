# Pedidos360 Frontend

Frontend de la aplicación Pedidos360 desarrollado con Angular 22 y Microsoft Authentication Library (MSAL) para autenticación con Microsoft Entra ID.

## Descripción general

Este proyecto es la capa de presentación de un sistema de gestión de pedidos y usuarios. La aplicación:

- autentica usuarios con Microsoft Entra ID,
- protege rutas privadas mediante `MsalGuard`,
- consume endpoints del backend para listar pedidos y usuarios,
- muestra el perfil del usuario autenticado,
- gestiona sesiones y redirecciones tras el inicio/cierre de sesión.

## Stack tecnológico

- Angular 22
- TypeScript
- RxJS
- MSAL Angular / MSAL Browser
- Angular Router
- Angular HttpClient

## Funcionalidades principales

- Inicio de sesión con Microsoft Entra ID
- Cierre de sesión con redirección
- Ruta raíz para autenticación
- Ruta protegida `/pedidos` para consultar pedidos
- Ruta protegida `/usuarios` para consultar usuarios
- Ruta protegida `/mi-perfil` para ver datos del usuario autenticado
- Manejo de errores de carga y estados de carga

## Estructura del proyecto

```text
Frontend-Pedidos360/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── public/
├── src/
│   ├── app/
│   │   ├── app.config.ts
│   │   ├── app.css
│   │   ├── app.html
│   │   ├── app.routes.ts
│   │   ├── app.spec.ts
│   │   ├── app.ts
│   │   ├── auth-config.ts
│   │   ├── auth-page.css
│   │   ├── auth-page.html
│   │   ├── auth-page.ts
│   │   ├── mi-perfil-page.ts
│   │   ├── pedido.model.ts
│   │   ├── pedido.service.ts
│   │   ├── usuario-autenticado.model.ts
│   │   ├── usuario.model.ts
│   │   ├── usuario.service.ts
│   │   ├── usuarios-page.ts
│   │   └── pedidos-page.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
└── README.md
```

## Requisitos previos

Antes de iniciar el proyecto, asegúrate de tener instalado:

- Node.js 18+ o compatible con Angular 22
- npm
- acceso a un backend con los endpoints esperados
- una aplicación registrada en Microsoft Entra ID con permisos adecuados para la API

## Instalación

1. Clona el repositorio.
2. Entra a la carpeta del proyecto.
3. Instala las dependencias:

```bash
npm install
```

## Configuración de autenticación

La configuración de MSAL se encuentra en `src/app/auth-config.ts`.

Los valores actuales apuntan a:

- tenant Microsoft: `3441157d-ea5c-483f-a66d-e45c3ed7f9da`
- clientId: `9e93805a-ed61-4fe8-8981-a839f016afc5`
- scope de API: `api://5582b6c4-7ecd-4bed-9337-ba3f1f8e58e5/access_as_user`
- redirectUri: `http://localhost:4200`

Si cambias la API o el registro de la aplicación en Azure, deberás actualizar estos valores.

## Endpoints del backend esperados

El frontend consume dos servicios externos:

- `http://localhost:8080/api/pedidos`
- `http://localhost:8081/api/usuarios`

Además, el servicio de usuarios expone:

- `http://localhost:8081/api/usuarios/me`

Estos endpoints deben estar disponibles antes de acceder a las rutas protegidas.

## Ejecución en desarrollo

Inicia el servidor de Angular:

```bash
npm start
```

O también:

```bash
ng serve
```

Luego abre en el navegador:

```text
http://localhost:4200
```

## Rutas de la aplicación

| Ruta | Descripción | Protegida |
| --- | --- | --- |
| `/` | Pantalla de autenticación | No |
| `/pedidos` | Lista de pedidos del sistema | Sí |
| `/usuarios` | Listado de usuarios | Sí |
| `/mi-perfil` | Información del usuario autenticado | Sí |

## Servicios principales

### `PedidoService`

Se encarga de consultar los pedidos desde el backend:

```ts
listarTodos(): Observable<Pedido[]>
```

### `UsuarioService`

Se encarga de consultar usuarios y el perfil del usuario autenticado:

```ts
listarUsuarios(): Observable<Usuario[]>
obtenerMiPerfil(): Observable<UsuarioAutenticado>
```

## Compilación de producción

Para generar una build de producción:

```bash
npm run build
```

La salida se genera en la carpeta `dist/`.

## Pruebas

Se usa Angular con configuración de pruebas. Para ejecutar las pruebas:

```bash
npm test
```

## Notas finales

Este frontend está pensado como una SPA moderna para consumo de servicios de negocio protegidos. Su flujo principal es:

1. iniciar sesión con Microsoft Entra ID,
2. obtener el token para la API,
3. acceder a rutas protegidas,
4. consultar datos reales del backend.



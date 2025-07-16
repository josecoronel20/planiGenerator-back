
## �� API Endpoints

### Autenticación (`/auth`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Registrar nuevo usuario | ❌ |
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/logout` | Cerrar sesión | ✅ |

### Usuarios (`/user`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Obtener datos del usuario actual | ✅ |
| PUT | `/update` | Actualizar planificación del usuario | ✅ |

### Planificaciones (`/planiGenerator`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Generar nueva planificación | ✅ |

## 🗄️ Modelos de Datos

### Usuario
```typescript
type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  planning?: planning;
};
```

### Ejercicio
```typescript
type Exercise = {
  id: string;
  exercise: string;
  sets: number[];
  weight: number;
};
```

### Planificación
```typescript
type planning = {
  [day: string]: Exercise[];
};
```

## �� Instalación Rápida

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

## 🔐 Variables de Entorno

```env
PORT=3001
JWT_SECRET=tu_jwt_secret_super_seguro
NODE_ENV=development
```

## 🛠️ Scripts Disponibles

```json
{
  "dev": "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## 🔐 Autenticación

- **JWT tokens** almacenados en cookies HTTP-only
- **Verificación automática** en rutas protegidas
- **Validación de credenciales** con bcrypt
- **Expiración automática** de tokens (1 día)

## �� Funcionalidades Clave

### Validación de Datos
```typescript
// Esquemas Zod para validación
const credentialsLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(20)
});
```

### Manejo de Errores
```typescript
try {
  const user = await readCredentials();
  res.status(200).json(user);
} catch (error) {
  res.status(500).json({ message: "Error interno" });
}
```

### Seguridad
- **CORS configurado** para frontend específico
- **Cookies seguras** con httpOnly
- **Passwords hasheados** con bcrypt
- **Validación de tokens** en cada request

## 📊 Métricas del Proyecto

- **Líneas de código**: ~400
- **Endpoints**: 6
- **Tipos TypeScript**: 4
- **Esquemas de validación**: 2
- **Archivos de utilidades**: 4

## �� Logros Técnicos

- ✅ **Type Safety** completo con TypeScript
- ✅ **Validación robusta** con Zod
- ✅ **Seguridad implementada** con JWT y cookies
- ✅ **Arquitectura escalable** con separación de responsabilidades
- ✅ **Manejo de errores** consistente
- ✅ **Almacenamiento persistente** con JSON

## 🚀 Próximos Pasos

- [ ] Migración a base de datos PostgreSQL
- [ ] Tests unitarios con Jest
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Docker deployment

## 🔧 Desarrollo

### Estructura de Archivos
- **`src/index.ts`**: Configuración del servidor Express
- **`src/routes/`**: Endpoints de la API
- **`src/utils/`**: Utilidades y tipos
- **`src/data/`**: Almacenamiento JSON

### Flujo de Datos
1. **Request** → Middleware (CORS, cookies, body parsing)
2. **Validation** → Zod schemas
3. **Authentication** → JWT verification
4. **Business Logic** → User/planning operations
5. **Response** → JSON response with status

---
# 🏆 Chapel Backend API

Backend REST API para gestión de jugadores del Club Chapel. Desarrollado con **Node.js**, **Express**, **TypeScript** y **Prisma**.

## 🚀 Tecnologías Principales

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma + PostgreSQL
- **Autenticación**: JWT + bcrypt
- **Validación**: Zod
- **Seguridad**: CORS, HTTP-only cookies

## 📊 Características Destacadas

- ✅ **CRUD completo** para jugadores con validación
- 🔐 **Autenticación JWT** con middleware de seguridad
- 📈 **Base de datos relacional** con Prisma ORM
- 🛡️ **Validación de datos** con esquemas Zod
- 🍪 **Cookies seguras** para manejo de tokens
- 📝 **Logging** para debugging y monitoreo

## 🏗️ Arquitectura

```
backend/
├── src/
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helpers & types
│   └── index.ts         # Server entry
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/players` | Listar jugadores | ❌ |
| GET | `/players/:id` | Obtener jugador | ❌ |
| POST | `/players` | Crear jugador | ✅ |
| PUT | `/players/:id` | Actualizar jugador | ✅ |
| DELETE | `/players/:id` | Eliminar jugador | ✅ |
| POST | `/admin/login` | Autenticación | ❌ |

## 🗄️ Modelos de Base de Datos

```prisma
model Player {
  id                Int      @id @default(autoincrement())
  fullName          String
  birthDate         DateTime
  nationality       String
  mainPosition      String
  secondaryPositions String[]
  profileSummary    String
  objective         String
  statsId           Int      @unique
  stats             Stats    @relation(fields: [statsId], references: [id])
  skillsId          Int      @unique
  skills            Skills   @relation(fields: [skillsId], references: [id])
}
```

## 🚀 Instalación Rápida

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Configurar base de datos
npx prisma generate
npx prisma migrate dev

# Ejecutar en desarrollo
npm run dev
```

## 🔐 Autenticación

- **JWT tokens** almacenados en cookies HTTP-only
- **Middleware de protección** para rutas sensibles
- **Validación de credenciales** con bcrypt
- **Expiración automática** de tokens (1 hora)

## 📈 Funcionalidades Clave

### Validación de Duplicados
```typescript
// Verifica jugadores existentes por nombre y fecha
const playerExists = await prisma.player.findFirst({
  where: {
    AND: [
      { fullName: { contains: fullName, mode: "insensitive" } },
      { birthDate: new Date(birthDate) }
    ]
  }
});
```

### Manejo de Errores
```typescript
try {
  const player = await prisma.player.create({ data });
  res.status(201).json({ message: "Jugador creado correctamente" });
} catch (error) {
  res.status(500).json({ message: "Error al crear el jugador" });
}
```

## 🛠️ Scripts Disponibles

```json
{
  "dev": "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## 🔧 Variables de Entorno

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu_jwt_secret"
CORS_ORIGIN="http://localhost:3000"
```

## 📊 Métricas del Proyecto

- **Líneas de código**: ~500
- **Endpoints**: 7
- **Modelos de BD**: 3
- **Middleware**: 1
- **Validaciones**: 2 esquemas Zod

## 🎯 Logros Técnicos

- ✅ **Type Safety** completo con TypeScript
- ✅ **Validación robusta** con Zod
- ✅ **Seguridad implementada** con JWT y cookies
- ✅ **Arquitectura escalable** con separación de responsabilidades
- ✅ **Documentación** completa de API
- ✅ **Manejo de errores** consistente

## 🚀 Próximos Pasos

- [ ] Tests unitarios con Jest
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Docker deployment

---

**Desarrollado con ❤️ para Chapel Club** # chapel-back
# planiGenerator-back
# planiGenerator-back

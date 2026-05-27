# Quiniela Mundial 2026

Aplicación full-stack de quiniela para el Mundial 2026.
Stack: **Next.js 16 + Supabase + Vercel + Resend + football-data.org**

---

## Setup paso a paso

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd quiniela-mundial
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. En el SQL Editor, ejecuta en orden:
   - `supabase/schema.sql` — crea tablas, RLS y realtime
   - `supabase/seed.sql` — carga los 72 partidos de fase de grupos

3. Copia las credenciales desde **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Asigna el rol admin a tu usuario: ejecuta en SQL Editor:
   ```sql
   update public.users set role = 'admin' where email = 'tu@email.com';
   ```
   *(Primero crea el usuario via el panel admin de la app para que exista en la tabla `users`.)*

### 3. Obtener API key de football-data.org

1. Regístrate en [football-data.org](https://www.football-data.org/client/register)
2. El plan gratuito incluye el Mundial 2026.
3. Copia tu API key → `FOOTBALL_DATA_API_KEY`
4. Cuando el torneo esté disponible en su API, actualiza `WORLD_CUP_2026_ID` en `src/app/api/cron/results/route.ts` con el ID correcto.

### 4. Configurar Resend

1. Crea una cuenta en [resend.com](https://resend.com)
2. Añade y verifica tu dominio de envío.
3. Crea una API key → `RESEND_API_KEY`
4. Pon tu email de envío en `RESEND_FROM_EMAIL` (ej: `quiniela@tudominio.com`)

### 5. Variables de entorno locales

```bash
cp .env.local.example .env.local
# Rellena los valores reales
```

### 6. Desarrollo local

```bash
npm run dev
```

### 7. Deploy en Vercel

1. Conecta el repo en [vercel.com](https://vercel.com)
2. Añade las variables de entorno en **Project → Settings → Environment Variables**:

| Variable                        | Entorno         |
|---------------------------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL`      | All             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All             |
| `SUPABASE_SERVICE_ROLE_KEY`     | All             |
| `RESEND_API_KEY`                | All             |
| `RESEND_FROM_EMAIL`             | All             |
| `FOOTBALL_DATA_API_KEY`         | All             |
| `NEXT_PUBLIC_APP_URL`           | Production      |
| `CRON_SECRET`                   | All             |

3. El `vercel.json` ya incluye el cron job (`*/5 * * * *` = cada 5 minutos).
4. Vercel inyecta automáticamente `Authorization: Bearer <CRON_SECRET>` en cada llamada al cron.

---

## API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login con alias + contraseña |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/auth/me` | Usuario actual |

### Pronósticos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/predictions` | Pronósticos del usuario |
| PUT | `/api/predictions` | Guardar pronóstico(s) — single o batch |
| GET | `/api/matches` | Todos los partidos con resultados |

### Bonus
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/bonus` | Bonus del usuario + estado de cierre |
| PUT | `/api/bonus` | Guardar bonus (cierra 11 jun 20:00 España) |

### Clasificación
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/leaderboard` | Tabla de clasificación completa |

### Admin (requiere rol admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/users` | Lista de usuarios |
| POST | `/api/admin/users` | Crear usuario + enviar email |
| DELETE | `/api/admin/users/[id]` | Eliminar usuario |
| GET | `/api/admin/bonus-results` | Ver resultados de bonus |
| PUT | `/api/admin/bonus-results` | Actualizar resultados de bonus |
| GET | `/api/admin/stats` | Estadísticas generales |

### Cron (solo Vercel)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cron/results` | Actualiza resultados desde football-data.org |

---

## Sistema de puntos

| Resultado | Puntos |
|-----------|--------|
| Marcador exacto | 3 pts |
| Signo correcto + diferencia exacta | 2 pts |
| Solo signo correcto | 1 pt |
| Fallo | 0 pts |

Bonus: **5 pts** por cada acierto (campeón, subcampeón, goleador, MVP, portero).

---

## Realtime (Supabase)

El frontend puede suscribirse a cambios en `results` y `bonus_results` para actualizar la clasificación sin recargar:

```typescript
supabase
  .channel('results-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, () => {
    // Refetch leaderboard
  })
  .subscribe()
```

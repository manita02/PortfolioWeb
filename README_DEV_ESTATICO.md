# Portfolio Web — Dev estático y deploy en Cloudflare

Guía para generar el build estático del frontend y publicarlo en **Cloudflare Pages**.

**Sitio en producción:** [https://portfolioweb-analuciajuarez.pages.dev/](https://portfolioweb-analuciajuarez.pages.dev/)

> Para correr el proyecto en local (backend + MySQL + frontend), ver [README.md](README.md).

---

## 1. Exportar contenido desde el ABM (local)

Antes de compilar, el sitio estático necesita los datos generados desde el entorno local:

1. Editá el contenido con el ABM habitual (**backend + MySQL** en local).
2. Iniciá sesión como **admin** → footer → **Exportar sitio estático**.
   - Genera `front_local/src/assets/data/portfolio.json`
   - Extrae imágenes/PDF a `front_local/src/assets/media/`
3. Revisá los archivos generados y hacé **commit + push** al repo.

**Endpoint alternativo (API):** `POST /api/static-export/generate` *(requiere JWT admin)*

**Configuración opcional** en `back_local/src/main/resources/application.properties`:

```properties
static.export.output-dir=../front_local/src/assets
```

---

## 2. Build estático local

### Instalar dependencias y compilar

```bash
cd front_local
npm ci
npm run build:static
```

Salida en `front_local/dist/ana-juarez/`.

### Comprobar el build

Verificá que existan en `dist/ana-juarez/`:

- `index.html`
- `_redirects` (SPA)
- `_headers` (cache y seguridad)
- `assets/data/portfolio.json`
- `assets/media/`

---

## 3. Deploy en Cloudflare Pages

**Requisitos:** cuenta Cloudflare (gratis, **sin tarjeta**) y repo en GitHub con `portfolio.json` y `assets/media/` commiteados.

### Crear proyecto

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Elegí el repo `PortfolioWeb`.
3. Configuración de build:

| Campo | Valor |
|-------|--------|
| **Production branch** | `main` (o tu rama de deploy) |
| **Root directory** | `front_local` |
| **Build command** | `npm ci && npm run build:static` |
| **Build output directory** | `dist/ana-juarez` |

4. **Environment variables** (Settings → Environment variables → Production):

| Variable | Valor |
|----------|--------|
| `NODE_VERSION` | `18` |

5. **Save and Deploy**.

### Rutas SPA (`_redirects`)

El archivo `front_local/src/_redirects` se copia al build:

```txt
/*    /index.html   200
```

Así rutas como `/login` no dan 404 al recargar. Los archivos estáticos (`*.js`, `/assets/...`) se sirven antes que la regla.

### Actualizar el sitio publicado

```
Editar en local (ABM) → Exportar sitio estático → git commit + push → Cloudflare redeploya
```

No hace falta backend ni MySQL en producción.

### Dominio custom (opcional)

En el proyecto Pages → **Custom domains** → agregar tu dominio o subdominio (ej. `portfolio.tudominio.com`).

# AMILAB Frontend (Vite + React + TypeScript)

Esqueleto inicial para el e-commerce / catálogo B2B de insumos médicos AMILAB. Incluye estructura base, rutas, componentes mínimos y datos mock para preparar la futura integración con un backend REST.

## Requisitos
- Node.js 18+
- npm

## Scripts
- `npm install` — instala dependencias.
- `npm run dev` — arranca el servidor de desarrollo de Vite.
- `npm run build` — genera build de producción.
- `npm run preview` — sirve el build generado.
- `npm run lint` — ejecuta ESLint sobre `src`.
- `npm run test` — ejecuta pruebas con Vitest.

## Estructura destacada
- `src/router` — configuración de rutas con React Router.
- `src/pages` — páginas principales (`/`, `/productos`, `/soporte`, etc.).
- `src/components` — layout, UI base y componentes específicos (productos, soporte, contacto).
- `src/features` — módulos de dominio (catálogo, búsqueda, soporte, contacto) con datos mock y TODOs de backend.
- `src/hooks` — hooks reutilizables (productos, scroll).
- `src/styles` — `globals.css` y estilos base.
- `src/assets` — imágenes e íconos placeholder con README.

## Notas
- Todo el manejo de datos es local (mock). Reemplaza los TODO marcados cuando el backend esté disponible.
- Formularios incluyen manejadores simples y comentarios donde se conectarán validaciones y envíos reales.

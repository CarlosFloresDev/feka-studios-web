import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from './i18n';

document.documentElement.classList.add('js');

// Cada juego conserva sus rutas y carga su código y estilos por separado.
// Cada página carga su código y sus estilos por separado.
const isVacas = /^\/vacas(?:\/|$)/i.test(window.location.pathname);
const Page = isVacas ? lazy(() => import('./vacas/VacasPage')) : lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </LangProvider>
  </StrictMode>,
);

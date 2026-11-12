import { useCallback, useEffect, useRef, useState } from 'react';

/** Menú desplegable de las cabeceras de juego en móvil.
 *  - `aria-expanded` / `aria-controls` en el botón (lo pone el componente con `buttonProps`).
 *  - Foco atrapado entre el botón y el panel mientras está abierto.
 *  - Esc cierra y devuelve el foco al botón.
 *  - Se cierra solo al pasar a escritorio. */
export function useMobileMenu(panelId: string, desktopQuery = '(min-width: 721px)') {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) button.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(desktopQuery);
    const onDesktop = () => { if (mq.matches) setOpen(false); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      if (event.key !== 'Tab' || !panel.current || !button.current) return;
      const items = [button.current, ...panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
      else if (!items.includes(active as HTMLElement)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onDesktop);
    // el primer enlace recibe el foco al abrir
    panel.current?.querySelector<HTMLElement>('a[href], button')?.focus({ preventScroll: true });
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onDesktop); };
  }, [open, close, desktopQuery]);

  const buttonProps = {
    ref: button,
    type: 'button' as const,
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: () => setOpen((o) => !o),
  };

  return { open, close, button, panel, buttonProps };
}

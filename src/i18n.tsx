import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { L, Lang } from './content';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (l: L) => string };
const LangCtx = createContext<Ctx | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('feka-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch { /* almacenamiento bloqueado */ }
  return 'es';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('feka-lang', l); } catch { /* nada */ }
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const t = useCallback((l: L) => l[lang], [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error('useLang fuera de LangProvider');
  return c;
}

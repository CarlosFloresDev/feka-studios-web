import { useState } from 'react';
import { Play } from '@phosphor-icons/react';
import type { Trailer as T } from '../content';
import { ui } from '../content';
import { useLang } from '../i18n';

function youtubeId(v: string) {
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : v;
}

/** Hueco de tráiler: muestra el póster y, si hay vídeo configurado en content.ts,
    lo carga solo cuando el usuario pulsa (no descarga nada antes). */
export function Trailer({ trailer, title }: { trailer: T; title: string }) {
  const { t } = useLang();
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(trailer.youtube || trailer.mp4);
  const label = `${t(ui.trailer.play)}: ${title}`;

  if (playing && trailer.youtube) {
    return (
      <div className="trailer">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId(trailer.youtube)}?autoplay=1&rel=0`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  if (playing && trailer.mp4) {
    return (
      <div className="trailer">
        <video src={trailer.mp4} poster={trailer.poster} controls autoPlay playsInline preload="metadata">
          {trailer.captions && <track kind="captions" src={trailer.captions} srcLang="es" label="Español" default />}
        </video>
      </div>
    );
  }
  return (
    <div className="trailer">
      {trailer.poster && <img src={trailer.poster} alt="" loading="lazy" decoding="async" />}
      {hasVideo ? (
        <button type="button" className="trailer__play" onClick={() => setPlaying(true)} aria-label={label}>
          <span className="trailer__btn"><Play weight="fill" size={18} aria-hidden /> {t(ui.trailer.play)}</span>
        </button>
      ) : (
        <span className="trailer__pending">{t(ui.trailer.pending)}</span>
      )}
    </div>
  );
}

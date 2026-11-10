import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import './scroll-atmosphere.css';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export function useScrollAtmosphere(root: RefObject<HTMLDivElement | null>, route: string, reduced: boolean, theme: 'vacas' | 'ceniza') {
  useGSAP((context, contextSafe) => {
    const host = root.current;
    if (!host) return;
    let alive = true;
    const splits: { split: SplitText; heading: HTMLElement }[] = [];
    const hero = host.querySelector('.vhero, .cn-hero');
    const visual = host.querySelector('.vhero__visual, .cn-hero-art');
    if (!reduced && hero && visual) gsap.to(visual, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .7 } });
    const sections = host.querySelectorAll<HTMLElement>('.zone__head, .vstory, .varchive, .feat, .note, .vlog > li, .cn-content > section');
    sections.forEach(section => {
      section.classList.add('scroll-light');
      gsap.fromTo(section, { '--light-position': '-120%' }, { '--light-position': '150%', ease: 'none', scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 25%', scrub: reduced ? true : .5 } });
    });
    host.querySelectorAll('.pic__frame, .cn-picture').forEach(frame => {
      const image = frame.querySelector('img');
      if (!image) return;
      if (!reduced) {
        gsap.fromTo(frame, { clipPath: 'inset(9% 0 9% 0)' }, { clipPath: 'inset(0% 0 0% 0)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 45%', scrub: .45 } });
        gsap.fromTo(image, { scale: 1.065, filter: 'blur(3px)' }, { scale: 1, filter: 'blur(0px)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 40%', scrub: .5 } });
      } else gsap.fromTo(image, { opacity: .82 }, { opacity: 1, scrollTrigger: { trigger: frame, start: 'top 90%', end: 'top 55%', scrub: true } });
    });
    gsap.fromTo(host.querySelectorAll('.scroll-blood .drip'), { scaleY: .04 }, { scaleY: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: host.querySelector('main'), start: 'top top', end: 'bottom bottom', scrub: reduced ? true : .65 } });
    const zones = host.querySelectorAll<HTMLElement>('[data-scroll-zone]');
    const originalZone = host.dataset.zoneNow;
    zones.forEach(zone => ScrollTrigger.create({ trigger: zone, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) host.dataset.zoneNow = zone.dataset.scrollZone; } }));
    // Split actual rendered lines after local fonts settle; all content remains readable.
    const revealText = contextSafe!(() => {
      if (!alive) return;
      host.querySelectorAll<HTMLElement>('.zone__head h2, .vlog h2, .cn-content > section h2').forEach(heading => {
        let split!: SplitText;
        // React may replace this heading's text before effect cleanup on a language
        // change. Own the split cleanup so reverting cannot restore the old language.
        context.ignore(() => { split = SplitText.create(heading, { type: 'lines', linesClass: 'scroll-line', aria: 'auto' }); });
        splits.push({ split, heading });
        gsap.fromTo(split.lines, { opacity: .5, yPercent: reduced ? 0 : 35, clipPath: reduced ? 'none' : 'inset(0 0 80% 0)' }, { opacity: 1, yPercent: 0, clipPath: reduced ? 'none' : 'inset(0 0 0% 0)', stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 94%', end: 'top 65%', scrub: reduced ? true : .35 } });
      });
      ScrollTrigger.refresh();
    });
    document.fonts.ready.then(revealText);
    const refresh = () => ScrollTrigger.refresh();
    host.addEventListener('load', refresh, true);
    return () => {
      alive = false;
      splits.forEach(({split, heading}) => {
        const updated = heading.isConnected && !heading.querySelector('.scroll-line') ? heading.innerHTML : null;
        split.revert();
        if (updated !== null) heading.innerHTML = updated;
      });
      sections.forEach(section => section.classList.remove('scroll-light'));
      host.removeEventListener('load', refresh, true);
      if (theme === 'vacas' && originalZone) host.dataset.zoneNow = originalZone;
    };
  }, { scope: root, dependencies: [route, reduced, theme], revertOnUpdate: true });
}

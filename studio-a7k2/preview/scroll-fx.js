// Homepage scroll animations: headings rise word by word, photos open like a curtain. Progressive: no JS, no effect.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.setAttribute('data-fx', '1');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.setAttribute('data-in', '1'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0 });
  const scan = () => document.querySelectorAll('#root h2.d2, #root h2.d3, #root .sw-img, #root img.cover, #root .cmp').forEach((el) => {
    if (!el.__fx) { el.__fx = 1; io.observe(el); }
  });
  // slide story: scrub the panels with scroll
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let ticking = false;
  const slide = () => {
    ticking = false;
    const sec = document.querySelector('#root .ss'); if (!sec) return;
    const ps = [...sec.querySelectorAll('.ss-p')], r = sec.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 1) * (ps.length - 1);
    ps.forEach((el, i) => { if (i) el.style.setProperty('--k', clamp(p - (i - 1), 0, 1).toFixed(3)); });
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(slide); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
  addEventListener('DOMContentLoaded', () => { scan(); setInterval(() => { scan(); slide(); }, 800); });
})();

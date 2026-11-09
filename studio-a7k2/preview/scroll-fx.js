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
  addEventListener('DOMContentLoaded', () => { scan(); setInterval(scan, 800); });
})();

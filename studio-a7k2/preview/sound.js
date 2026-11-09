// Sound demo for the homepage: workshop sounds made in the browser (no audio files). Off by default.
(function () {
  let ctx = null, on = false, open = false;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  const noise = (c, d) => { const b = c.createBuffer(1, Math.ceil(c.sampleRate * d), c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; };
  const env = (g, t, peak, atk, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + atk + dec); };
  const tone = (c, type, f0, f1, t, dur, peak) => { const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); env(g, t, peak, 0.004, dur); o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05); };
  const burst = (c, t, dur, type, freq, peak, q) => { const n = noise(c, dur + 0.05), f = c.createBiquadFilter(), g = c.createGain(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q; env(g, t, peak, 0.003, dur); n.connect(f).connect(g).connect(c.destination); n.start(t); };
  const S = {
    knock(c, t) { tone(c, 'sine', 210, 70, t, 0.25, 0.5); burst(c, t, 0.04, 'highpass', 1800, 0.12); },
    hammer(c, t) { [0, 0.22, 0.42].forEach((d, i) => { tone(c, 'sine', 320 - i * 20, 120, t + d, 0.12, 0.35); burst(c, t + d, 0.03, 'bandpass', 3200, 0.3, 3); }); },
    saw(c, t) { const n = noise(c, 1), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 1.2; g.gain.value = 0; lfo.frequency.value = 9; lg.gain.value = 0.09; lfo.connect(lg).connect(g.gain); g.gain.setValueAtTime(0.09, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.95); n.connect(f).connect(g).connect(c.destination); n.start(t); lfo.start(t); lfo.stop(t + 1); },
    sander(c, t) { const n = noise(c, 1), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.frequency.value = 4200; f.Q.value = 0.6; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.11, t + 0.35); g.gain.linearRampToValueAtTime(0.0001, t + 0.9); n.connect(f).connect(g).connect(c.destination); n.start(t); },
    drill(c, t) { const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(330, t + 0.25); o.frequency.setValueAtTime(330, t + 0.6); o.frequency.exponentialRampToValueAtTime(110, t + 0.85); f.type = 'lowpass'; f.frequency.value = 1400; lfo.frequency.value = 38; lg.gain.value = 0.03; lfo.connect(lg).connect(g.gain); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.1); g.gain.linearRampToValueAtTime(0.0001, t + 0.9); o.connect(f).connect(g).connect(c.destination); o.start(t); lfo.start(t); o.stop(t + 1); lfo.stop(t + 1); },
    pour(c, t) { const n = noise(c, 1.4), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'lowpass'; f.frequency.value = 700; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.08, t + 0.3); g.gain.linearRampToValueAtTime(0.0001, t + 1.4); n.connect(f).connect(g).connect(c.destination); n.start(t); for (let i = 0; i < 7; i++) { const bt = t + 0.15 + Math.random() * 1; const f0 = 380 + Math.random() * 400; tone(c, 'sine', f0, f0 * 1.9, bt, 0.09, 0.08); } },
    cabinet(c, t) { tone(c, 'sine', 140, 55, t, 0.3, 0.5); burst(c, t + 0.03, 0.05, 'bandpass', 2400, 0.15, 2); tone(c, 'triangle', 1100, 0, t + 0.07, 0.04, 0.08); },
    plank(c, t) { const n = noise(c, 0.6), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.4); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.14, t + 0.12); g.gain.linearRampToValueAtTime(0.0001, t + 0.45); n.connect(f).connect(g).connect(c.destination); n.start(t); tone(c, 'sine', 190, 70, t + 0.42, 0.22, 0.45); },
    tape(c, t) { let d = 0; for (let i = 0; i < 9; i++) { tone(c, 'square', 1800, 0, t + d, 0.018, 0.035); d += 0.075 - i * 0.004; } tone(c, 'sine', 160, 70, t + d + 0.02, 0.16, 0.4); burst(c, t + d + 0.02, 0.03, 'highpass', 2500, 0.15); },
    stapler(c, t) { burst(c, t, 0.025, 'highpass', 3000, 0.35); tone(c, 'sine', 260, 90, t + 0.01, 0.1, 0.35); },
    level(c, t) { tone(c, 'sine', 1320, 0, t, 0.5, 0.18); tone(c, 'sine', 1980, 0, t + 0.01, 0.35, 0.07); },
    chime(c, t) { [[784, 0.16], [1175, 0.1], [1568, 0.06]].forEach(([f, v], i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t + i * 0.07); g.gain.linearRampToValueAtTime(v, t + i * 0.07 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); o.connect(g).connect(c.destination); o.start(t + i * 0.07); o.stop(t + 1.5); }); },
    tick(c, t) { tone(c, 'triangle', 1500, 0, t, 0.05, 0.1); },
    glass(c, t) { tone(c, 'sine', 2400, 0, t, 0.35, 0.12); tone(c, 'sine', 3600, 0, t, 0.2, 0.05); tone(c, 'sine', 1200, 0, t, 0.5, 0.05); }
  };
  const LIST = [['glass', 'Glass tick']]; const _OLD = [['knock', 'Wood knock'], ['hammer', 'Hammer taps'], ['saw', 'Hand saw'], ['sander', 'Sanding'], ['drill', 'Drill whirr'], ['pour', 'Resin pour'], ['cabinet', 'Cabinet door'], ['plank', 'Plank slide'], ['tape', 'Tape measure'], ['stapler', 'Staple gun'], ['level', 'Level ping'], ['chime', 'Finish chime']];
  const play = (n, force) => { if (!on && !force) return; try { const c = ac(); S[n](c, c.currentTime); } catch (e) {} };

  // which sound belongs to which homepage section (by order on the page)
  const TICK = 'glass'; // one soft glass tick as each section arrives

  function ui() {
    const css = document.createElement('style');
    css.textContent = '.snd-w{position:fixed;right:12px;bottom:12px;z-index:60;font:500 13px Inter,system-ui,sans-serif;display:flex;flex-direction:column;align-items:flex-end;gap:8px}.snd-b{border:0;border-radius:40px;min-height:44px;padding:0 16px;background:#25262B;color:#fff;font:600 12px Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25)}.snd-b.on{background:#0B6E72}.snd-p{width:min(300px,calc(100vw - 24px));background:#fff;color:#25262B;border:1px solid #E4E1DB;border-radius:12px;padding:14px;box-shadow:0 16px 40px rgba(0,0,0,.2)}.snd-p h4{margin:0 0 4px;font:700 16px Georgia,serif}.snd-p p{margin:0 0 10px;color:#5F5E5B;font-size:12px;line-height:1.5}.snd-g{display:grid;grid-template-columns:1fr 1fr;gap:6px}.snd-g button{font:500 13px Inter,system-ui,sans-serif;border:1px solid #E4E1DB;background:#F5F3EF;border-radius:8px;min-height:44px;padding:0 10px;text-align:left;cursor:pointer}.snd-g button:active{background:#0B6E72;color:#fff}.snd-t{display:flex;gap:6px;margin-bottom:10px}.snd-t button{flex:1;min-height:44px;border-radius:8px;border:1px solid #25262B;background:none;font:600 12px Inter,system-ui,sans-serif;cursor:pointer}.snd-t button.on{background:#25262B;color:#fff}@media (max-width:768px){.snd-w{bottom:76px}}';
    document.head.appendChild(css);
    const w = document.createElement('div'); w.className = 'snd-w'; w.setAttribute('data-keep', '');
    w.innerHTML = '<div class="snd-p" hidden><h4>Sound (demo)</h4><p>A soft glass tick as each section arrives. Off by default.</p><div class="snd-t"><button type="button" id="snd-on">Scroll sounds: off</button></div><div class="snd-g">' + LIST.map(([k, l]) => '<button type="button" data-k="' + k + '">' + l + '</button>').join('') + '</div></div><button class="snd-b" type="button" aria-expanded="false">Sounds</button>';
    document.body.appendChild(w);
    const p = w.querySelector('.snd-p'), b = w.querySelector('.snd-b'), t = w.querySelector('#snd-on');
    b.onclick = () => { open = !open; p.hidden = !open; b.setAttribute('aria-expanded', open); };
    t.onclick = () => { on = !on; t.textContent = 'Scroll sounds: ' + (on ? 'on' : 'off'); t.classList.toggle('on', on); b.classList.toggle('on', on); if (on) play('glass', true); };
    w.querySelectorAll('[data-k]').forEach((x) => { x.onclick = () => play(x.dataset.k, true); });
  }

  function triggers() {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !e.target.__snd) { e.target.__snd = 1; play(TICK); } }), { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    const scan = () => document.querySelectorAll('#root section').forEach((s, i) => { if (i > 0 && s.__i == null) { s.__i = i; io.observe(s); } });
    scan(); setInterval(scan, 1000);
    document.addEventListener('pointerdown', (e) => {  }, { passive: true });
    document.addEventListener('pointerover', (e) => { const l = e.target.closest && e.target.closest('.btn, .svc-card, .sw-item'); if (l && e.pointerType === 'mouse' && l !== document.__sl) { document.__sl = l;  } }, { passive: true });
  }
  addEventListener('DOMContentLoaded', () => setTimeout(() => { ui(); triggers(); }, 400));
})();

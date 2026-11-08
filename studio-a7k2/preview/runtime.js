// Minimal local stand-in for the canvas runtime, for visual checks only.
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(p) { Object.assign(this.state, typeof p === 'function' ? p(this.state) : p); scheduleRender(); }
  forceUpdate() { scheduleRender(); }
}
let comp, tpl, root, pending = false;
function scheduleRender() { if (pending) return; pending = true; setTimeout(() => { pending = false; render(); }, 0); }
function lookup(path, scope) {
  path = path.trim();
  if (path === 'true') return true; if (path === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
}
const HOLE = /\{\{([^}]+)\}\}/g;
function interp(str, scope) {
  const whole = str.match(/^\s*\{\{([^}]+)\}\}\s*$/);
  if (whole) return lookup(whole[1], scope);
  return str.replace(HOLE, (_, p) => { const v = lookup(p, scope); return v == null ? '' : v; });
}
function build(node, scope, out) {
  if (node.nodeType === 3) { out.appendChild(document.createTextNode(String(interp(node.nodeValue, scope) ?? ''))); return; }
  if (node.nodeType !== 1) return;
  const tag = node.localName.toLowerCase();
  if (tag === 'sc-for') {
    const list = interp(node.getAttribute('list'), scope) || [];
    const as = node.getAttribute('as') || 'item';
    list.forEach((it, i) => node.childNodes.forEach((c) => build(c, { ...scope, [as]: it, $index: i }, out)));
    return;
  }
  if (tag === 'sc-if') { if (interp(node.getAttribute('value'), scope)) node.childNodes.forEach((c) => build(c, scope, out)); return; }
  const el = node.namespaceURI === 'http://www.w3.org/1999/xhtml' ? document.createElement(node.localName) : document.createElementNS(node.namespaceURI, node.localName);
  for (const a of node.attributes) {
    const n = a.name;
    if (n.startsWith('on')) { const fn = interp(a.value, scope); if (typeof fn === 'function') (el.__on = el.__on || {})[n.slice(2)] = fn; continue; }
    if (n === 'ref') { const fn = interp(a.value, scope); if (typeof fn === 'function') el.__ref = fn; continue; }
    if (n.startsWith('hint-')) continue;
    const v = interp(a.value, scope);
    if (v === false || v == null) continue;
    el.setAttribute(n, v === true ? '' : String(v));
  }
  const kids = tag === 'template' ? node.content.childNodes : node.childNodes;
  kids.forEach((c) => build(c, scope, el));
  if (tag === 'video' && node.hasAttribute('muted')) el.muted = true;
  out.appendChild(el);
}
// Patch the live DOM instead of replacing it, so the video keeps playing and nothing re-runs its entrance animation.
const KEEP = { VIDEO: ['src', 'poster', 'loop'], DETAILS: ['open'] };
function bindHandlers(el, handlers) {
  el.__on = handlers || {};
  for (const t of Object.keys(el.__on)) {
    el.__bound = el.__bound || {};
    if (!el.__bound[t]) { el.__bound[t] = true; el.addEventListener(t, (e) => { const f = el.__on && el.__on[t]; if (f) return f.call(el, e); }); }
  }
}
function patchEl(oldEl, newEl) {
  const keep = KEEP[oldEl.tagName] || [];
  for (const a of [...oldEl.attributes]) if (!newEl.hasAttribute(a.name) && !keep.includes(a.name) && !a.name.startsWith('data-')) oldEl.removeAttribute(a.name);
  for (const a of newEl.attributes) {
    if (keep.includes(a.name) && oldEl.hasAttribute(a.name)) continue;
    if (oldEl.getAttribute(a.name) !== a.value) oldEl.setAttribute(a.name, a.value);
  }
  const tag = oldEl.tagName;
  if ((tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') && oldEl !== document.activeElement && oldEl.type !== 'file') {
    const v = tag === 'TEXTAREA' ? newEl.textContent : newEl.getAttribute('value');
    if (v != null && oldEl.value !== v) oldEl.value = v;
  }
  bindHandlers(oldEl, newEl.__on);
  oldEl.__ref = newEl.__ref;
  if (tag === 'TEXTAREA') return;
  morph(oldEl, newEl);
}
function morph(oldP, newP) {
  const olds = [...oldP.childNodes], news = [...newP.childNodes];
  news.forEach((n, i) => {
    const o = olds[i];
    if (!o) { bindAll(n); oldP.appendChild(n); return; }
    if (o.nodeType === n.nodeType && (o.nodeType === 3 ? true : o.localName === n.localName && o.namespaceURI === n.namespaceURI)) {
      if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; } else patchEl(o, n);
    } else { bindAll(n); oldP.replaceChild(n, o); }
  });
  for (let i = olds.length - 1; i >= news.length; i--) oldP.removeChild(olds[i]);
}
function bindAll(node) { if (node.nodeType !== 1) return; if (node.__on) bindHandlers(node, node.__on); node.childNodes.forEach(bindAll); }
function runRefs(node) { if (node.nodeType !== 1) return; if (node.__ref) node.__ref(node); node.childNodes.forEach(runRefs); }
function render() {
  const vals = comp.renderVals();
  const next = document.createElement('div');
  tpl.content.childNodes.forEach((c) => build(c, vals, next));
  if (!root.firstChild) { next.childNodes.forEach(bindAll); root.append(...next.childNodes); } else morph(root, next);
  root.childNodes.forEach(runRefs);
}
window.addEventListener('DOMContentLoaded', () => {
  tpl = document.getElementById('tpl'); root = document.getElementById('root');
  comp = new Component({});
  render();
  if (comp.componentDidMount) setTimeout(() => comp.componentDidMount(), 50);
});

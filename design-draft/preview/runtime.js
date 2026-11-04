// Minimal local stand-in for the canvas runtime, for visual checks only.
class DCLogic {
  constructor(props) { this.props = props || {}; this.state = {}; }
  setState(p) { Object.assign(this.state, typeof p === 'function' ? p(this.state) : p); scheduleRender(); }
  forceUpdate() { scheduleRender(); }
}
let comp, tpl, root, pending = false;
function scheduleRender() { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; render(); }); }
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
    if (n.startsWith('on')) { const fn = interp(a.value, scope); if (typeof fn === 'function') el.addEventListener(n.slice(2), fn); continue; }
    if (n === 'ref') { const fn = interp(a.value, scope); if (typeof fn === 'function') queueMicrotask(() => fn(el)); continue; }
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
function render() {
  const vals = comp.renderVals();
  const frag = document.createDocumentFragment();
  tpl.content.childNodes.forEach((c) => build(c, vals, frag));
  root.replaceChildren(frag);
}
window.addEventListener('DOMContentLoaded', () => {
  tpl = document.getElementById('tpl'); root = document.getElementById('root');
  comp = new Component({});
  render();
  if (comp.componentDidMount) setTimeout(() => comp.componentDidMount(), 50);
});

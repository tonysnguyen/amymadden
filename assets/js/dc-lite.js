/*!
 * dc-lite.js — the tiny runtime behind every page of Madden's Adventures.
 *
 * Each page keeps its markup in <template id="dc-template"> and its behaviour in a
 * `class Component extends DCLogic { renderVals() { ... } }` script. This file renders
 * the template into #dc-root and re-renders it (patching only what changed) whenever
 * the component calls setState().
 *
 * Template syntax:
 *   {{ path.to.value }}                  text or attribute value (dotted lookup)
 *   <sc-if value="{{flag}}">…</sc-if>      render children when flag is truthy
 *   <sc-for list="{{items}}" as="item">  repeat children for each item ($index available)
 *   onClick / onChange / onKeyDown / onSubmit / onTouchStart / onTouchEnd = "{{handler}}"
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var BOOL = { disabled: 1, hidden: 1, checked: 1, readonly: 1, required: 1, selected: 1, autofocus: 1, multiple: 1, open: 1, inert: 1 };
  var EVENTS = { onclick: 'click', onchange: 'input', oninput: 'input', onkeydown: 'keydown', onkeyup: 'keyup',
                 onsubmit: 'submit', ontouchstart: 'touchstart', ontouchend: 'touchend', onfocus: 'focus', onblur: 'blur' };
  var PASSIVE = { touchstart: 1, touchend: 1 };

  function lookup(path, scope) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.');
    var cur;
    for (var i = scope.length - 1; i >= 0; i--) {
      if (scope[i] && Object.prototype.hasOwnProperty.call(scope[i], parts[0])) { cur = scope[i][parts[0]]; break; }
    }
    for (var j = 1; j < parts.length && cur != null; j++) cur = cur[parts[j]];
    return cur;
  }

  function str(v) { return v == null || v === false ? '' : String(v); }

  function evalAttr(raw, scope) {
    var m = WHOLE.exec(raw);
    if (m) return lookup(m[1], scope);
    return raw.indexOf('{{') > -1 ? raw.replace(HOLE, function (_, p) { return str(lookup(p, scope)); }) : raw;
  }

  // ---------------------------------------------------------------- render template -> fresh nodes
  function renderChildren(parent, out, scope) {
    for (var c = parent.firstChild; c; c = c.nextSibling) renderNode(c, out, scope);
  }

  function renderNode(n, out, scope) {
    if (n.nodeType === 3) {
      var t = n.nodeValue;
      out.push(document.createTextNode(t.indexOf('{{') > -1 ? t.replace(HOLE, function (_, p) { return str(lookup(p, scope)); }) : t));
      return;
    }
    if (n.nodeType !== 1) return;
    var tag = n.localName;
    if (tag === 'sc-if') {
      if (evalAttr(n.getAttribute('value') || '', scope)) renderChildren(n, out, scope);
      return;
    }
    if (tag === 'sc-for') {
      var list = evalAttr(n.getAttribute('list') || '', scope) || [];
      var as = n.getAttribute('as') || 'item';
      for (var i = 0; i < list.length; i++) {
        var frame = { $index: i };
        frame[as] = list[i];
        renderChildren(n, out, scope.concat([frame]));
      }
      return;
    }
    var el = n.namespaceURI === SVG_NS ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    var attrs = n.attributes;
    for (var a = 0; a < attrs.length; a++) {
      var name = attrs[a].name, lname = name.toLowerCase(), raw = attrs[a].value;
      if (lname.indexOf('hint-') === 0) continue;
      if (EVENTS[lname]) {
        var fn = evalAttr(raw, scope);
        if (typeof fn === 'function') (el.__on || (el.__on = {}))[EVENTS[lname]] = fn;
        continue;
      }
      var val = evalAttr(raw, scope);
      if (lname === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) { el.__value = str(val); continue; }
      if (BOOL[lname]) { if (val && val !== 'false') el.setAttribute(name, ''); continue; }
      if (val == null) continue;
      el.setAttribute(name, String(val));
    }
    if (el.__value !== undefined) el.value = el.__value;
    var kids = [];
    renderChildren(n.namespaceURI === SVG_NS || tag !== 'template' ? n : n.content, kids, scope);
    for (var k = 0; k < kids.length; k++) el.appendChild(kids[k]);
    out.push(el);
  }

  // ---------------------------------------------------------------- patch live DOM to match fresh nodes
  function dispatch(e) {
    var fn = this.__on && this.__on[e.type];
    if (fn) fn(e);
  }

  function bind(el) {
    if (!el.__on) return;
    el.__bound = el.__bound || {};
    for (var type in el.__on) {
      if (!el.__bound[type]) {
        el.addEventListener(type, dispatch, PASSIVE[type] ? { passive: true } : false);
        el.__bound[type] = 1;
      }
    }
  }

  function bindTree(node) {
    if (node.nodeType !== 1) return;
    bind(node);
    for (var c = node.firstChild; c; c = c.nextSibling) bindTree(c);
  }

  function keyOf(n) {
    if (n.nodeType !== 1) return '';
    return n.getAttribute('data-card') ? 'card:' + n.getAttribute('data-card')
      : n.id ? 'id:' + n.id
      : n.hasAttribute('data-viewer') ? 'viewer' : '';
  }

  function same(a, b) {
    return a.nodeType === b.nodeType && a.nodeName === b.nodeName && (a.nodeType !== 1 || a.namespaceURI === b.namespaceURI);
  }

  function patch(live, next) {
    if (live.nodeType === 3) { if (live.nodeValue !== next.nodeValue) live.nodeValue = next.nodeValue; return; }
    var la = live.attributes, na = next.attributes, i;
    for (i = la.length - 1; i >= 0; i--) if (!next.hasAttribute(la[i].name)) live.removeAttribute(la[i].name);
    for (i = 0; i < na.length; i++) if (live.getAttribute(na[i].name) !== na[i].value) live.setAttribute(na[i].name, na[i].value);
    if (next.__value !== undefined && live.value !== next.__value) live.value = next.__value;
    live.__on = next.__on;
    bind(live);
    var kids = [];
    for (var c = next.firstChild; c; c = c.nextSibling) kids.push(c);
    morphChildren(live, kids);
  }

  function morphChildren(parent, nodes) {
    var live = Array.prototype.slice.call(parent.childNodes);
    var keyed = {}, unkeyed = [], u = 0, used = [], result = [], i;
    for (i = 0; i < live.length; i++) { var k = keyOf(live[i]); if (k) keyed[k] = live[i]; else unkeyed.push(live[i]); }
    for (i = 0; i < nodes.length; i++) {
      var nn = nodes[i], key = keyOf(nn), ln = null;
      if (key) ln = keyed[key] || null;
      else if (u < unkeyed.length) ln = unkeyed[u++];
      if (ln && same(ln, nn) && used.indexOf(ln) < 0) { patch(ln, nn); used.push(ln); result.push(ln); }
      else { bindTree(nn); result.push(nn); }
    }
    for (i = 0; i < result.length; i++) if (parent.childNodes[i] !== result[i]) parent.insertBefore(result[i], parent.childNodes[i] || null);
    while (parent.childNodes.length > result.length) parent.removeChild(parent.lastChild);
  }

  // ---------------------------------------------------------------- component base + mount
  function DCLogic() { this.props = {}; this.state = {}; }
  DCLogic.prototype.setState = function (patchObj) {
    var p = typeof patchObj === 'function' ? patchObj(this.state, this.props) : patchObj;
    this.state = Object.assign({}, this.state, p);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__schedule) this.__schedule(); };

  function mount(Component) {
    var tpl = document.getElementById('dc-template');
    var root = document.getElementById('dc-root');
    var c = new Component();
    c.props = c.props || {};
    c.state = c.state || {};
    var mounted = false, queued = false;
    function render() {
      queued = false;
      var out = [];
      renderChildren(tpl.content, out, [c.renderVals()]);
      morphChildren(root, out);
      if (mounted && c.componentDidUpdate) c.componentDidUpdate();
    }
    c.__schedule = function () {
      if (queued) return;
      queued = true;
      Promise.resolve().then(render);
    };
    render();
    mounted = true;
    if (c.componentDidMount) c.componentDidMount();
    return c;
  }

  window.DCLogic = DCLogic;
  window.DC = { mount: mount };
})();

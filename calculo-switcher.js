/* Calculo — cross-product "labs" switcher.
   A small floating pill (bottom-right) that links the four Knovay labs:
   Knovay home, GeoProof, Physica, and Calculo (current). Self-contained;
   injects its own styles. Loaded on every Calculo page. */
(function(){
  "use strict";
  if (document.getElementById('cxsw')) return;

  var LINKS = [
    { href:"https://knovay.com/",          name:"Knovay home", ic:"⌂", col:"#8ea2ff", tint:"rgba(142,162,255,.16)" },
    { href:"https://geoproof.knovay.com/", name:"GeoProof",    ic:"△", col:"#7fb2ec", tint:"rgba(127,178,236,.16)" },
    { href:"https://physica.knovay.com/",  name:"Physica",     ic:"⚛", col:"#c3a3ff", tint:"rgba(195,163,255,.16)" },
    { href:"https://calculo.knovay.com/",  name:"Calculo",     ic:"∫", col:"#5cd6b0", tint:"rgba(92,214,176,.16)" }
  ];
  var CURRENT = "Calculo";

  function css(){
    var s = document.createElement('style');
    s.id = 'cxsw-style';
    s.textContent =
      "#cxsw{position:fixed;right:18px;bottom:18px;z-index:2147483000;font-family:'Inter',system-ui,sans-serif}"
    + "#cxsw *{box-sizing:border-box}"
    + "#cxsw .cxsw-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(18,22,40,.9);color:#eef1fb;"
      + "border:1px solid rgba(140,160,220,.28);border-radius:999px;padding:9px 14px;font:600 13px 'Inter',system-ui,sans-serif;"
      + "cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 26px -10px rgba(0,0,0,.6)}"
    + "#cxsw .cxsw-btn:hover{border-color:rgba(92,214,176,.6)}"
    + "#cxsw .cxsw-btn svg{display:block}"
    + "#cxsw .cxsw-chev{font-size:10px;color:#9aa6cc;transition:transform .15s}"
    + "#cxsw.open .cxsw-chev{transform:rotate(180deg)}"
    + "#cxsw .cxsw-menu{position:absolute;right:0;bottom:calc(100% + 10px);min-width:196px;background:#141a2e;"
      + "border:1px solid rgba(140,160,220,.2);border-radius:13px;box-shadow:0 20px 50px -14px rgba(0,0,0,.7);"
      + "padding:6px;display:none}"
    + "#cxsw.open .cxsw-menu{display:block}"
    + "#cxsw .cxsw-lab{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;"
      + "color:#69739b;padding:7px 10px 4px}"
    + "#cxsw .cxsw-menu a{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;text-decoration:none;"
      + "color:#eef1fb;font-size:14px;font-weight:500}"
    + "#cxsw .cxsw-menu a:hover{background:rgba(140,160,220,.12)}"
    + "#cxsw .cxsw-ic{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:13px;flex:none;line-height:1}"
    + "#cxsw .cxsw-cur{font-weight:700}"
    + "#cxsw .cxsw-tick{margin-left:auto;color:#5cd6b0;font-size:13px}"
    + "@media(max-width:520px){#cxsw .cxsw-btn span.cxsw-txt{display:none}}";
    document.head.appendChild(s);
  }

  function build(){
    css();
    var wrap = document.createElement('div');
    wrap.id = 'cxsw';
    var rows = LINKS.map(function(l){
      var cur = (l.name === CURRENT);
      return '<a role="menuitem" href="' + l.href + '"' + (cur ? ' class="cxsw-cur" aria-current="page"' : '') + '>'
        + '<span class="cxsw-ic" style="background:' + l.tint + ';color:' + l.col + '">' + l.ic + '</span>'
        + l.name + (cur ? '<span class="cxsw-tick">✓</span>' : '') + '</a>';
    }).join('');
    wrap.innerHTML =
      '<button type="button" class="cxsw-btn" aria-haspopup="true" aria-expanded="false" aria-label="Switch labs">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
      + '<rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M5 15 C 9 15, 10 8, 13 8 S 18 14, 19 10" stroke="#5cd6b0" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
      + '<span class="cxsw-txt">Labs</span><span class="cxsw-chev">▴</span></button>'
      + '<div class="cxsw-menu" role="menu"><div class="cxsw-lab">Knovay labs</div>' + rows + '</div>';
    document.body.appendChild(wrap);

    var btn = wrap.querySelector('.cxsw-btn');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var open = wrap.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if (wrap.classList.contains('open') && !wrap.contains(e.target)){
        wrap.classList.remove('open'); btn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && wrap.classList.contains('open')){
        wrap.classList.remove('open'); btn.setAttribute('aria-expanded','false');
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();

/* Calculo — cross-product "labs" switcher.
   A small floating pill (bottom-right) that links the four Knovay labs:
   Knovay home, GeoProof, Physica, and Calculo (current). Self-contained;
   injects its own styles. Loaded on every Calculo page. */
(function(){
  "use strict";
  if (document.getElementById('cxsw')) return;

  /* Embed mode: ?embed hides all site chrome so a single lab drops cleanly
     into an iframe. Detect + hide as early as possible to avoid a flash. */
  var EMBED = /[?&]embed(?:=[^&]*)?(?:&|$)/.test(location.search);
  if (EMBED){
    document.documentElement.classList.add('cx-embed');
    var es = document.createElement('style');
    es.textContent =
      "html.cx-embed .head{display:none!important}"
    + "html.cx-embed .stage{margin-top:0!important;padding-top:14px!important}"
    + "html.cx-embed #cxsw,html.cx-embed #cxnav{display:none!important}";
    (document.head || document.documentElement).appendChild(es);
  }

  var LINKS = [
    { href:"https://knovay.com/",          name:"Knovay home", ic:"⌂", col:"#8ea2ff", tint:"rgba(142,162,255,.16)" },
    { href:"https://geoproof.knovay.com/", name:"GeoProof",    ic:"△", col:"#7fb2ec", tint:"rgba(127,178,236,.16)" },
    { href:"https://physica.knovay.com/",  name:"Physica",     ic:"⚛", col:"#c3a3ff", tint:"rgba(195,163,255,.16)" },
    { href:"https://calculo.knovay.com/",  name:"Calculo",     ic:"∫", col:"#5cd6b0", tint:"rgba(92,214,176,.16)" }
  ];
  var CURRENT = "Calculo";

  /* Pedagogical order of the 23 labs, used for prev/next navigation. */
  var SEQ = [
    { f:"limits_continuity.html",        t:"Limits & Continuity" },
    { f:"epsilon_delta.html",            t:"Epsilon–Delta" },
    { f:"derivative_tangent.html",       t:"Derivative & Tangent" },
    { f:"chain_rule.html",               t:"Chain Rule" },
    { f:"implicit_differentiation.html", t:"Implicit Differentiation" },
    { f:"mean_value_theorem.html",       t:"Mean Value Theorem" },
    { f:"optimization.html",             t:"Optimization" },
    { f:"related_rates.html",            t:"Related Rates" },
    { f:"newtons_method.html",           t:"Newton’s Method" },
    { f:"lhopital.html",                 t:"L’Hôpital’s Rule" },
    { f:"taylor_series.html",            t:"Taylor Series" },
    { f:"area_riemann.html",             t:"Riemann Sums" },
    { f:"accumulation_ftc.html",         t:"Accumulation & FTC" },
    { f:"area_between.html",             t:"Area Between Curves" },
    { f:"average_value.html",            t:"Average Value" },
    { f:"volume_revolution.html",        t:"Volumes of Revolution" },
    { f:"shell_method.html",             t:"Shell Method" },
    { f:"arc_length.html",               t:"Arc Length" },
    { f:"parametric_polar.html",         t:"Parametric Curves" },
    { f:"polar_area.html",               t:"Polar Area" },
    { f:"slope_fields.html",             t:"Slope Fields" },
    { f:"infinite_series.html",          t:"Infinite Series" },
    { f:"improper_integrals.html",       t:"Improper Integrals" }
  ];

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
    + "#cxsw .cxsw-div{height:1px;background:rgba(140,160,220,.14);margin:5px 6px}"
    + "#cxsw .cxsw-embed{display:flex;align-items:center;gap:10px;width:100%;padding:9px 11px;border-radius:9px;"
      + "background:none;border:0;cursor:pointer;color:#eef1fb;font:500 14px 'Inter',system-ui,sans-serif;text-align:left}"
    + "#cxsw .cxsw-embed:hover{background:rgba(140,160,220,.12)}"
    + "#cxfav{position:fixed;right:18px;bottom:66px;z-index:2147482500;width:44px;height:44px;border-radius:50%;"
      + "background:rgba(18,22,40,.9);border:1px solid rgba(140,160,220,.28);color:#69739b;cursor:pointer;display:grid;"
      + "place-items:center;font-size:21px;line-height:1;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);"
      + "box-shadow:0 8px 26px -10px rgba(0,0,0,.6);transition:.14s}"
    + "#cxfav:hover{border-color:rgba(255,210,122,.6);color:#ffd27a}"
    + "#cxfav.on{color:#ffd27a}"
    + "#cxfav .cxfav-tip{position:absolute;right:52px;white-space:nowrap;background:#141a2e;border:1px solid rgba(140,160,220,.2);"
      + "border-radius:8px;padding:5px 9px;font:500 12px 'Inter',system-ui,sans-serif;color:#eef1fb;opacity:0;"
      + "transform:translateX(6px);transition:.15s;pointer-events:none}"
    + "#cxfav.show-tip .cxfav-tip{opacity:1;transform:translateX(0)}"
    + "@media(max-width:520px){#cxsw .cxsw-btn span.cxsw-txt{display:none}}"
    + "#cxnav{position:fixed;left:18px;bottom:18px;z-index:2147482000;display:flex;gap:8px;font-family:'Inter',system-ui,sans-serif}"
    + "#cxnav a{display:inline-flex;align-items:center;gap:8px;max-width:230px;background:rgba(18,22,40,.9);color:#eef1fb;"
      + "border:1px solid rgba(140,160,220,.28);border-radius:999px;padding:9px 13px;text-decoration:none;"
      + "backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 26px -10px rgba(0,0,0,.6)}"
    + "#cxnav a:hover{border-color:rgba(92,214,176,.6)}"
    + "#cxnav .cxnav-ar{color:#5cd6b0;font-size:15px;flex:none;line-height:1}"
    + "#cxnav .cxnav-tx{display:flex;flex-direction:column;line-height:1.15;min-width:0}"
    + "#cxnav .cxnav-k{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:#69739b}"
    + "#cxnav .cxnav-t{font:600 12.5px 'Inter',system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
    + "#cxnav a.nx{text-align:right}"
    + "@media(max-width:640px){#cxnav .cxnav-tx{display:none}#cxnav a{padding:10px 12px}}"
    /* accessibility: focusable diagram + reduced-motion guard */
    + ".graphwrap canvas.cx-focusable{outline:none}"
    + ".graphwrap canvas.cx-focusable:focus-visible{outline:3px solid rgba(92,214,176,.75);outline-offset:3px;border-radius:8px}"
    + ".cx-a11yhint{position:absolute;left:12px;bottom:12px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.04em;"
      + "color:#69739b;background:rgba(10,14,26,.7);border:1px solid rgba(140,160,220,.2);border-radius:7px;padding:4px 8px;"
      + "opacity:0;transition:opacity .15s;pointer-events:none}"
    + ".graphwrap canvas.cx-focusable:focus-visible ~ .cx-a11yhint{opacity:1}"
    + "@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.001ms!important;animation-duration:.001ms!important;"
      + "animation-iteration-count:1!important;scroll-behavior:auto!important}}";
    document.head.appendChild(s);
  }

  /* Make each interactive diagram keyboard-operable: focusable, labelled,
     and arrow keys nudge the primary slider (reusing the lab's own logic). */
  function buildA11y(){
    var canvases = document.querySelectorAll('.graphwrap canvas');
    if (!canvases.length) return;
    var h1 = document.querySelector('h1');
    var base = h1 ? h1.textContent.trim() : 'Interactive diagram';
    var sliders = document.querySelectorAll('.panel input[type=range]');
    var primary = sliders[0] || document.querySelector('input[type=range]');
    if (!primary) return;                          // no parameter to nudge
    function nudge(dir, big){
      var n = big ? 10 : 1;
      for (var i = 0; i < n; i++){ dir > 0 ? primary.stepUp() : primary.stepDown(); }
      primary.dispatchEvent(new Event('input', { bubbles:true }));
    }
    Array.prototype.forEach.call(canvases, function(c){
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'application');
      c.setAttribute('aria-label', base + ' — interactive diagram. Use the arrow keys to adjust.');
      c.classList.add('cx-focusable');
      var hint = document.createElement('div');
      hint.className = 'cx-a11yhint';
      hint.textContent = '← → to adjust';
      if (c.parentNode) c.parentNode.appendChild(hint);
      c.addEventListener('keydown', function(e){
        switch (e.key){
          case 'ArrowRight': case 'ArrowUp':   e.preventDefault(); nudge(1, false); break;
          case 'ArrowLeft':  case 'ArrowDown': e.preventDefault(); nudge(-1, false); break;
          case 'PageUp':   e.preventDefault(); nudge(1, true); break;
          case 'PageDown': e.preventDefault(); nudge(-1, true); break;
        }
      });
    });
  }

  /* Favorites — saved to localStorage as [{f,t},...] under 'calculo:favs'.
     Works instantly on one device; the hub reads the same key. */
  function favStore(){ try{ return JSON.parse(localStorage.getItem('calculo:favs') || '[]'); }catch(e){ return []; } }
  function favSave(a){ try{ localStorage.setItem('calculo:favs', JSON.stringify(a)); }catch(e){} }
  function favIndex(list, f){ for(var i=0;i<list.length;i++){ if(list[i].f===f) return i; } return -1; }

  function buildFav(entry){
    var isFav = favIndex(favStore(), entry.f) >= 0;
    var b = document.createElement('button');
    b.id = 'cxfav'; b.type = 'button';
    b.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    b.setAttribute('aria-label', isFav ? 'Remove this lab from your saved labs' : 'Save this lab');
    b.innerHTML = '<span class="cxfav-star">' + (isFav ? '★' : '☆') + '</span><span class="cxfav-tip"></span>';
    if (isFav) b.classList.add('on');
    document.body.appendChild(b);
    var tip = b.querySelector('.cxfav-tip'), star = b.querySelector('.cxfav-star'), tid;
    b.addEventListener('click', function(){
      var cur = favStore(), i = favIndex(cur, entry.f), nowFav;
      if (i >= 0){ cur.splice(i, 1); nowFav = false; }
      else { cur.push({ f:entry.f, t:entry.t }); nowFav = true; }
      favSave(cur);
      b.classList.toggle('on', nowFav);
      star.textContent = nowFav ? '★' : '☆';
      b.setAttribute('aria-pressed', nowFav ? 'true' : 'false');
      b.setAttribute('aria-label', nowFav ? 'Remove this lab from your saved labs' : 'Save this lab');
      tip.textContent = nowFav ? 'Saved to your labs' : 'Removed';
      b.classList.add('show-tip'); clearTimeout(tid); tid = setTimeout(function(){ b.classList.remove('show-tip'); }, 1400);
    });
  }

  function buildNav(){
    var path = location.pathname.replace(/\/+$/,'');
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var i = -1;
    for (var k = 0; k < SEQ.length; k++){ if (SEQ[k].f === file){ i = k; break; } }
    if (i === -1) return;                          // hub or unknown page: no prev/next
    var prev = SEQ[(i - 1 + SEQ.length) % SEQ.length];
    var next = SEQ[(i + 1) % SEQ.length];
    var nav = document.createElement('nav');
    nav.id = 'cxnav';
    nav.setAttribute('aria-label', 'Lab navigation');
    nav.innerHTML =
      '<a class="pv" href="' + prev.f + '" rel="prev" aria-label="Previous lab: ' + prev.t + '">'
        + '<span class="cxnav-ar">‹</span>'
        + '<span class="cxnav-tx"><span class="cxnav-k">Prev</span><span class="cxnav-t">' + prev.t + '</span></span></a>'
      + '<a class="nx" href="' + next.f + '" rel="next" aria-label="Next lab: ' + next.t + '">'
        + '<span class="cxnav-tx"><span class="cxnav-k">Next</span><span class="cxnav-t">' + next.t + '</span></span>'
        + '<span class="cxnav-ar">›</span></a>';
    document.body.appendChild(nav);

    document.addEventListener('keydown', function(e){
      if (e.altKey && !e.ctrlKey && !e.metaKey){
        if (e.key === 'ArrowLeft'){ e.preventDefault(); location.href = prev.f; }
        else if (e.key === 'ArrowRight'){ e.preventDefault(); location.href = next.f; }
      }
    });
  }

  function build(){
    css();
    if (EMBED){ buildA11y(); return; }             // embed: keyboard support only, no chrome
    var wrap = document.createElement('div');
    wrap.id = 'cxsw';
    var rows = LINKS.map(function(l){
      var cur = (l.name === CURRENT);
      return '<a role="menuitem" href="' + l.href + '"' + (cur ? ' class="cxsw-cur" aria-current="page"' : '') + '>'
        + '<span class="cxsw-ic" style="background:' + l.tint + ';color:' + l.col + '">' + l.ic + '</span>'
        + l.name + (cur ? '<span class="cxsw-tick">✓</span>' : '') + '</a>';
    }).join('');

    // "Copy embed code" — only on lab pages (pages present in SEQ)
    var file = (location.pathname.replace(/\/+$/,'').split('/').pop()) || 'index.html';
    var labEntry = null;
    for (var q = 0; q < SEQ.length; q++){ if (SEQ[q].f === file){ labEntry = SEQ[q]; break; } }
    var embedRow = labEntry
      ? '<div class="cxsw-div"></div><button type="button" class="cxsw-embed" role="menuitem">'
        + '<span class="cxsw-ic" style="background:rgba(92,214,176,.16);color:#5cd6b0">⧉</span>'
        + '<span class="cxsw-embed-t">Copy embed code</span></button>'
      : '';

    wrap.innerHTML =
      '<button type="button" class="cxsw-btn" aria-haspopup="true" aria-expanded="false" aria-label="Switch labs">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
      + '<rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M5 15 C 9 15, 10 8, 13 8 S 18 14, 19 10" stroke="#5cd6b0" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
      + '<span class="cxsw-txt">Labs</span><span class="cxsw-chev">▴</span></button>'
      + '<div class="cxsw-menu" role="menu"><div class="cxsw-lab">Knovay labs</div>' + rows + embedRow + '</div>';
    document.body.appendChild(wrap);

    if (labEntry){
      var embedBtn = wrap.querySelector('.cxsw-embed');
      var embedLabel = embedBtn.querySelector('.cxsw-embed-t');
      embedBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var url = 'https://calculo.knovay.com/' + file + '?embed';
        var code = '<iframe src="' + url + '" width="820" height="640" loading="lazy" '
          + 'style="border:1px solid #d8dde8;border-radius:12px;max-width:100%" '
          + 'title="' + labEntry.t + ' — Calculo"></iframe>';
        var done = function(ok){
          embedLabel.textContent = ok ? 'Copied to clipboard!' : 'Press Ctrl+C to copy';
          setTimeout(function(){ embedLabel.textContent = 'Copy embed code'; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(code).then(function(){ done(true); }, function(){ done(false); });
        } else {
          var ta = document.createElement('textarea'); ta.value = code;
          ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta);
          ta.select(); try{ document.execCommand('copy'); done(true); }catch(err){ done(false); }
          document.body.removeChild(ta);
        }
      });
    }

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

    buildNav();
    buildA11y();
    if (labEntry) buildFav(labEntry);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();

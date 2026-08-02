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
    { href:"https://knovay.com/",          name:"Knovay home", ic:"⌂", col:"#3b5bd9", tint:"rgba(142,162,255,.16)" },
    { href:"https://geoproof.knovay.com/", name:"GeoProof",    ic:"△", col:"#1f74b5", tint:"rgba(127,178,236,.16)" },
    { href:"https://physica.knovay.com/",  name:"Physica",     ic:"⚛", col:"#6c46d6", tint:"rgba(195,163,255,.16)" },
    { href:"https://calculo.knovay.com/",  name:"Calculo",     ic:"∫", col:"#0e9c74", tint:"rgba(14,156,116,.16)" }
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

  /* Short concept note per lab — injected as a collapsible "About this lab" panel. */
  var NOTES = {
    "derivative_tangent.html":{c:"The derivative f&prime;(x) is the slope of the tangent line — the function&rsquo;s instantaneous rate of change at a point.",f:"f&prime;(x) = lim<sub>h→0</sub> [ f(x+h) − f(x) ] / h",t:"Drag the point to a peak and watch the slope pass through 0."},
    "area_riemann.html":{c:"A definite integral is the signed area under a curve, approximated by rectangles (Riemann sums) that become exact as their width → 0.",f:"∫<sub>a</sub><sup>b</sup> f(x) dx = lim Σ f(x<sub>i</sub>) Δx",t:"Add more rectangles and watch the estimate close in on the exact area."},
    "limits_continuity.html":{c:"A limit is the value a function heads toward as x nears a point — it can exist even where the function itself is undefined.",f:"lim<sub>x→a</sub> f(x) = L",t:"Approach the gap from the left and the right and compare."},
    "taylor_series.html":{c:"A Taylor polynomial approximates a function near a point using its derivatives; each extra term improves the fit.",f:"f(x) ≈ Σ f<sup>(n)</sup>(a)/n! · (x−a)<sup>n</sup>",t:"Add terms and watch the polynomial hug the curve farther out."},
    "accumulation_ftc.html":{c:"The accumulation function A(x)=∫ f keeps a running total of area. The Fundamental Theorem says its slope is f itself.",f:"d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x)",t:"Sweep x and compare A&rsquo;s slope to the height of f."},
    "optimization.html":{c:"Maxima and minima sit where the slope is zero; the second derivative tells you which is which.",f:"f&prime;(x)=0 · f&Prime;&gt;0 → min · f&Prime;&lt;0 → max",t:"Hunt down every peak and valley."},
    "slope_fields.html":{c:"A slope field draws the tangent direction of a differential equation at each point; a solution curve follows the arrows.",f:"dy/dx = f(x, y)",t:"Drop a point and thread a solution through the field."},
    "newtons_method.html":{c:"Newton&rsquo;s method chases a root down the tangent lines, roughly doubling its accuracy at every step.",f:"x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>) / f&prime;(x<sub>n</sub>)",t:"Start far from the root and watch it converge."},
    "volume_revolution.html":{c:"Spin a curve around an axis to make a solid; stacking thin disks totals its volume.",f:"V = π ∫<sub>a</sub><sup>b</sup> [ f(x) ]² dx",t:"Add disks and watch the sum approach the exact volume."},
    "mean_value_theorem.html":{c:"On any interval, some interior point has a tangent parallel to the chord joining the endpoints.",f:"f&prime;(c) = [ f(b) − f(a) ] / (b − a)",t:"Move the endpoints and find the guaranteed point c."},
    "related_rates.html":{c:"When quantities are tied by an equation, their rates are tied too — differentiate with respect to time.",f:"e.g.  dA/dt = 2πr · dr/dt",t:"Slide the ladder at steady speed and watch the top race away."},
    "infinite_series.html":{c:"An infinite series adds endlessly many terms; the partial sums either settle on a number (converge) or grow without bound (diverge).",f:"Σ a r<sup>n</sup> = a / (1 − r),  |r| &lt; 1",t:"Compare a convergent series with a divergent one."},
    "parametric_polar.html":{c:"Parametric curves drive x and y by a parameter t, tracing loops and spirals a plain function can&rsquo;t.",f:"dy/dx = (dy/dt) / (dx/dt)",t:"Advance t and watch the point trace the path."},
    "epsilon_delta.html":{c:"The rigorous limit game: for every tolerance ε there is a window δ that keeps f within ε of L.",f:"0 &lt; |x−a| &lt; δ  ⟹  |f(x)−L| &lt; ε",t:"Shrink ε and find a δ that still works."},
    "area_between.html":{c:"The area between two curves sums the vertical gap — top minus bottom — across the interval.",f:"∫<sub>a</sub><sup>b</sup> [ top − bottom ] dx",t:"Move the bounds and watch the trapped area change."},
    "arc_length.html":{c:"Arc length adds up a chain of tiny straight segments hugging the curve.",f:"L = ∫<sub>a</sub><sup>b</sup> √( 1 + [ f&prime;(x) ]² ) dx",t:"Add segments until the polyline becomes the curve."},
    "chain_rule.html":{c:"The chain rule differentiates a composition by multiplying the rate at each stage.",f:"d/dx f(g(x)) = f&prime;(g(x)) · g&prime;(x)",t:"Follow x through both stages of the pipeline."},
    "lhopital.html":{c:"For a 0/0 or ∞/∞ limit, the ratio of the functions equals the ratio of their derivatives.",f:"lim f/g = lim f&prime;/g&prime;",t:"Watch the tangent-slope ratio at the trouble point."},
    "shell_method.html":{c:"Rotating about the y-axis, nested cylindrical shells build up the solid.",f:"V = 2π ∫<sub>a</sub><sup>b</sup> x · f(x) dx",t:"Add shells and watch them fill the solid."},
    "polar_area.html":{c:"In polar coordinates, area sweeps out as thin triangular wedges from the origin.",f:"A = ½ ∫ r² dθ",t:"Fan the wedges around the curve."},
    "average_value.html":{c:"The average value of f is the height of the rectangle holding the same area as the curve.",f:"f̄ = 1/(b−a) · ∫<sub>a</sub><sup>b</sup> f(x) dx",t:"Match the gold rectangle to the shaded area."},
    "implicit_differentiation.html":{c:"When a curve isn&rsquo;t y=f(x), differentiate the whole relation to get the slope at any point.",f:"dy/dx = − F<sub>x</sub> / F<sub>y</sub>",t:"Slide the point around a loop and read the slope."},
    "improper_integrals.html":{c:"An improper integral pushes a boundary to infinity (or a singularity); the endless region may hold a finite area or diverge.",f:"∫<sub>a</sub><sup>∞</sup> f = lim<sub>b→∞</sub> ∫<sub>a</sub><sup>b</sup> f",t:"Push the boundary out and watch the running total."}
  };

  function buildNote(entry){
    var n = NOTES[entry.f]; if (!n) return;
    var stage = document.querySelector('.stage');
    var d = document.createElement('details');
    d.className = 'cxnote';
    d.innerHTML = '<summary>About this lab — the idea &amp; the formula</summary>'
      + '<div class="cxnote-body"><p>' + n.c + '</p>'
      + '<div class="cxnote-f">' + n.f + '</div>'
      + '<p class="cxnote-try"><b>Try:</b> ' + n.t + '</p></div>';
    if (stage && stage.parentNode) stage.parentNode.insertBefore(d, stage.nextSibling);
    else document.body.appendChild(d);
  }

  /* Which shared-bank topic powers each lab's "Quick check" (labs without a
     matching question topic are omitted). */
  var LABQUIZ = {
    "derivative_tangent.html":"derivatives","mean_value_theorem.html":"derivatives",
    "chain_rule.html":"chain","implicit_differentiation.html":"implicit",
    "limits_continuity.html":"limits","epsilon_delta.html":"limits","lhopital.html":"lhopital",
    "optimization.html":"optimization","related_rates.html":"related_rates","newtons_method.html":"newton",
    "area_riemann.html":"integrals","area_between.html":"integrals","arc_length.html":"integrals",
    "accumulation_ftc.html":"ftc","average_value.html":"average",
    "volume_revolution.html":"volume","shell_method.html":"volume",
    "parametric_polar.html":"parametric","polar_area.html":"parametric",
    "infinite_series.html":"series","improper_integrals.html":"improper"
  };

  function buildQuickCheck(entry){
    var topic = LABQUIZ[entry.f]; if (!topic) return;
    if (!document.getElementById('calculo-quiz-js')){
      var qs = document.createElement('script'); qs.src = 'calculo-quiz.js'; qs.id = 'calculo-quiz-js';
      document.head.appendChild(qs);
    }
    var host = document.querySelector('.cxnote') || document.querySelector('.stage');
    var wrap = document.createElement('details'); wrap.className = 'cxqc';
    wrap.innerHTML = '<summary>Quick check — test yourself</summary><div class="cxqc-body" id="cxqcBody"></div>';
    if (host && host.parentNode) host.parentNode.insertBefore(wrap, host.nextSibling); else document.body.appendChild(wrap);
    var body = wrap.querySelector('#cxqcBody');

    function startState(){
      body.innerHTML = '<button type="button" class="cxqc-btn" id="cxqcStart">Start · 3 questions</button>';
      body.querySelector('#cxqcStart').addEventListener('click', run);
    }
    function run(){
      if (!window.CalculoQuiz){ body.innerHTML = '<p class="cxqc-msg">Loading…</p>'; setTimeout(run, 200); return; }
      var qs = window.CalculoQuiz.makeQuiz(3, topic);
      if (!qs.length){ body.innerHTML = '<p class="cxqc-msg">No questions available.</p>'; return; }
      var idx = 0, score = 0;
      function renderQ(){
        var q = qs[idx], h = '<div class="cxqc-q">' + q.prompt + '</div><div class="cxqc-choices">';
        q.choices.forEach(function(c, i){ h += '<button type="button" class="cxqc-choice" data-i="' + i + '">' + c.html + '</button>'; });
        h += '</div><div class="cxqc-fb" id="cxqcFb"></div><div class="cxqc-row"><span class="cxqc-prog">' + (idx+1) + ' / 3</span>'
          + '<button type="button" class="cxqc-btn" id="cxqcNext" hidden>' + (idx===2 ? 'See result' : 'Next') + '</button></div>';
        body.innerHTML = h;
        var answered = false, ci = -1; q.choices.forEach(function(c, i){ if (c.correct) ci = i; });
        Array.prototype.forEach.call(body.querySelectorAll('.cxqc-choice'), function(b){
          b.addEventListener('click', function(){
            if (answered) return; answered = true; var i = parseInt(b.getAttribute('data-i'), 10);
            Array.prototype.forEach.call(body.querySelectorAll('.cxqc-choice'), function(x, k){ x.disabled = true; if (k===ci) x.classList.add('ok'); else if (k===i) x.classList.add('no'); });
            var fb = body.querySelector('#cxqcFb');
            if (i===ci){ score++; fb.innerHTML = '<b>Correct.</b>'; } else fb.innerHTML = '<b>Not quite.</b> Answer: <b>' + q.choices[ci].html + '</b>.';
            body.querySelector('#cxqcNext').hidden = false;
          });
        });
        body.querySelector('#cxqcNext').addEventListener('click', function(){ idx++; if (idx>=3) result(); else renderQ(); });
      }
      function result(){
        body.innerHTML = '<div class="cxqc-result">You got <b>' + score + ' / 3</b>.</div><button type="button" class="cxqc-btn" id="cxqcAgain">Try 3 more</button>';
        body.querySelector('#cxqcAgain').addEventListener('click', run);
      }
      renderQ();
    }
    startState();
  }

  function markVisited(file){
    try {
      var p = JSON.parse(localStorage.getItem('calculo:progress') || '[]');
      if (p.indexOf(file) < 0){ p.push(file); localStorage.setItem('calculo:progress', JSON.stringify(p)); }
    } catch (e) {}
  }

  function css(){
    var s = document.createElement('style');
    s.id = 'cxsw-style';
    s.textContent =
      "#cxsw{position:fixed;right:18px;bottom:18px;z-index:2147483000;font-family:'Inter',system-ui,sans-serif}"
    + "#cxsw *{box-sizing:border-box}"
    + "#cxsw .cxsw-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.9);color:#1b2430;"
      + "border:1px solid rgba(40,58,84,.28);border-radius:999px;padding:9px 14px;font:600 13px 'Inter',system-ui,sans-serif;"
      + "cursor:pointer;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 26px -10px rgba(0,0,0,.6)}"
    + "#cxsw .cxsw-btn:hover{border-color:rgba(14,156,116,.6)}"
    + "#cxsw .cxsw-btn svg{display:block}"
    + "#cxsw .cxsw-chev{font-size:10px;color:#59626f;transition:transform .15s}"
    + "#cxsw.open .cxsw-chev{transform:rotate(180deg)}"
    + "#cxsw .cxsw-menu{position:absolute;right:0;bottom:calc(100% + 10px);min-width:196px;background:#ffffff;"
      + "border:1px solid rgba(40,58,84,.2);border-radius:13px;box-shadow:0 20px 50px -14px rgba(0,0,0,.7);"
      + "padding:6px;display:none}"
    + "#cxsw.open .cxsw-menu{display:block}"
    + "#cxsw .cxsw-lab{font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;"
      + "color:#8a92a0;padding:7px 10px 4px}"
    + "#cxsw .cxsw-menu a{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;text-decoration:none;"
      + "color:#1b2430;font-size:14px;font-weight:500}"
    + "#cxsw .cxsw-menu a:hover{background:rgba(40,58,84,.12)}"
    + "#cxsw .cxsw-ic{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:13px;flex:none;line-height:1}"
    + "#cxsw .cxsw-cur{font-weight:700}"
    + "#cxsw .cxsw-tick{margin-left:auto;color:#0e9c74;font-size:13px}"
    + "#cxsw .cxsw-div{height:1px;background:rgba(40,58,84,.14);margin:5px 6px}"
    + "#cxsw .cxsw-embed{display:flex;align-items:center;gap:10px;width:100%;padding:9px 11px;border-radius:9px;"
      + "background:none;border:0;cursor:pointer;color:#1b2430;font:500 14px 'Inter',system-ui,sans-serif;text-align:left}"
    + "#cxsw .cxsw-embed:hover{background:rgba(40,58,84,.12)}"
    + "#cxfav{position:fixed;right:18px;bottom:66px;z-index:2147482500;width:44px;height:44px;border-radius:50%;"
      + "background:rgba(255,255,255,.9);border:1px solid rgba(40,58,84,.28);color:#8a92a0;cursor:pointer;display:grid;"
      + "place-items:center;font-size:21px;line-height:1;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);"
      + "box-shadow:0 8px 26px -10px rgba(0,0,0,.6);transition:.14s}"
    + "#cxfav:hover{border-color:rgba(191,124,15,.6);color:#bf7c0f}"
    + "#cxfav.on{color:#bf7c0f}"
    + "#cxfav .cxfav-tip{position:absolute;right:52px;white-space:nowrap;background:#ffffff;border:1px solid rgba(40,58,84,.2);"
      + "border-radius:8px;padding:5px 9px;font:500 12px 'Inter',system-ui,sans-serif;color:#1b2430;opacity:0;"
      + "transform:translateX(6px);transition:.15s;pointer-events:none}"
    + "#cxfav.show-tip .cxfav-tip{opacity:1;transform:translateX(0)}"
    + "#cxsw .cxsw-acct{padding:2px}"
    + "#cxsw .cxsw-signin{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;color:#1b2430;font-size:14px;font-weight:500}"
    + "#cxsw .cxsw-signin:hover{background:rgba(40,58,84,.12)}"
    + "#cxsw .cxsw-acct-row{display:flex;align-items:center;gap:10px;padding:8px 11px 4px}"
    + "#cxsw .cxsw-acct-e{font-size:12.5px;color:var(--muted,#59626f);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px}"
    + "#cxsw .cxsw-signout{margin-left:auto;background:none;border:1px solid rgba(40,58,84,.24);color:#59626f;"
      + "border-radius:8px;padding:5px 10px;font:500 12px 'Inter',system-ui,sans-serif;cursor:pointer}"
    + "#cxsw .cxsw-signout:hover{color:#1b2430;border-color:rgba(214,84,38,.5)}"
    + "@media(max-width:520px){#cxsw .cxsw-btn span.cxsw-txt{display:none}}"
    + "#cxnav{position:fixed;left:18px;bottom:18px;z-index:2147482000;display:flex;gap:8px;font-family:'Inter',system-ui,sans-serif}"
    + "#cxnav a{display:inline-flex;align-items:center;gap:8px;max-width:230px;background:rgba(255,255,255,.9);color:#1b2430;"
      + "border:1px solid rgba(40,58,84,.28);border-radius:999px;padding:9px 13px;text-decoration:none;"
      + "backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 26px -10px rgba(0,0,0,.6)}"
    + "#cxnav a:hover{border-color:rgba(14,156,116,.6)}"
    + "#cxnav .cxnav-ar{color:#0e9c74;font-size:15px;flex:none;line-height:1}"
    + "#cxnav .cxnav-tx{display:flex;flex-direction:column;line-height:1.15;min-width:0}"
    + "#cxnav .cxnav-k{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:#8a92a0}"
    + "#cxnav .cxnav-t{font:600 12.5px 'Inter',system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"
    + "#cxnav a.nx{text-align:right}"
    + "@media(max-width:640px){#cxnav .cxnav-tx{display:none}#cxnav a{padding:10px 12px}}"
    /* accessibility: focusable diagram + reduced-motion guard */
    + ".graphwrap canvas.cx-focusable{outline:none}"
    + ".graphwrap canvas.cx-focusable:focus-visible{outline:3px solid rgba(14,156,116,.75);outline-offset:3px;border-radius:8px}"
    + ".cx-a11yhint{position:absolute;left:12px;bottom:12px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.04em;"
      + "color:#8a92a0;background:rgba(255,255,255,.7);border:1px solid rgba(40,58,84,.2);border-radius:7px;padding:4px 8px;"
      + "opacity:0;transition:opacity .15s;pointer-events:none}"
    + ".graphwrap canvas.cx-focusable:focus-visible ~ .cx-a11yhint{opacity:1}"
    + "@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.001ms!important;animation-duration:.001ms!important;"
      + "animation-iteration-count:1!important;scroll-behavior:auto!important}}"
    /* per-lab explainer panel */
    + ".cxnote{max-width:1220px;margin:6px auto 44px;padding:0 26px;font-family:'Inter',system-ui,sans-serif}"
    + ".cxnote summary{cursor:pointer;color:#59626f;font-size:14px;padding:13px 0;list-style:none;display:flex;align-items:center;gap:9px;border-top:1px solid rgba(40,58,84,.14)}"
    + ".cxnote summary::-webkit-details-marker{display:none}"
    + ".cxnote summary::before{content:'▸';color:#0e9c74;transition:transform .15s;font-size:12px}"
    + ".cxnote[open] summary::before{transform:rotate(90deg)}"
    + ".cxnote summary:hover{color:#1b2430}"
    + ".cxnote-body{padding:4px 0 10px;max-width:780px}"
    + ".cxnote-body p{color:#59626f;font-size:14px;line-height:1.65;margin:0 0 13px}"
    + ".cxnote-f{background:rgba(255,255,255,.5);border:1px solid rgba(40,58,84,.18);border-radius:10px;padding:12px 15px;"
      + "font-family:'JetBrains Mono',monospace;font-size:14px;color:#0e9c74;margin:0 0 13px;overflow-x:auto}"
    + ".cxnote-try{font-size:13.5px}.cxnote-try b{color:#1b2430}"
    /* per-lab quick-check mini quiz */
    + ".cxqc{max-width:1220px;margin:0 auto 48px;padding:0 26px;font-family:'Inter',system-ui,sans-serif}"
    + ".cxqc summary{cursor:pointer;color:#59626f;font-size:14px;padding:13px 0;list-style:none;display:flex;align-items:center;gap:9px;border-top:1px solid rgba(40,58,84,.14)}"
    + ".cxqc summary::-webkit-details-marker{display:none}"
    + ".cxqc summary::before{content:'▸';color:#bf7c0f;transition:transform .15s;font-size:12px}"
    + ".cxqc[open] summary::before{transform:rotate(90deg)}"
    + ".cxqc summary:hover{color:#1b2430}"
    + ".cxqc-body{padding:6px 0 8px;max-width:560px}"
    + ".cxqc-btn{background:#0e9c74;color:#062018;border:0;border-radius:10px;padding:10px 18px;font:600 14px 'Inter',system-ui,sans-serif;cursor:pointer}"
    + ".cxqc-btn:hover{filter:brightness(1.06)}.cxqc-btn[hidden]{display:none}"
    + ".cxqc-q{font-family:'Fraunces',Georgia,serif;font-size:20px;color:#1b2430;margin:4px 0 14px;line-height:1.3}"
    + ".cxqc-choices{display:grid;gap:9px}"
    + ".cxqc-choice{text-align:left;background:rgba(255,255,255,.5);border:1px solid rgba(40,58,84,.16);color:#1b2430;border-radius:10px;"
      + "padding:12px 14px;font-family:'JetBrains Mono',monospace;font-size:15px;cursor:pointer;transition:.12s}"
    + ".cxqc-choice:hover:not(:disabled){border-color:rgba(14,156,116,.5)}"
    + ".cxqc-choice.ok{border-color:#0e9c74;background:rgba(14,156,116,.14)}"
    + ".cxqc-choice.no{border-color:#d65426;background:rgba(214,84,38,.12)}"
    + ".cxqc-fb{margin-top:12px;font-size:13.5px;color:#59626f;min-height:18px}.cxqc-fb b{color:#1b2430}"
    + ".cxqc-row{margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}"
    + ".cxqc-prog{font-family:'JetBrains Mono',monospace;font-size:11px;color:#8a92a0}"
    + ".cxqc-result{font-family:'Fraunces',Georgia,serif;font-size:22px;color:#1b2430;margin:4px 0 14px}.cxqc-result b{color:#0e9c74}"
    + ".cxqc-msg{color:#59626f;font-size:14px}";
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
      try { window.dispatchEvent(new CustomEvent('calculo:favschanged')); } catch(e) {}
    });
    // reflect changes that arrive from another device (cloud sync)
    window.addEventListener('calculo:favssynced', function(){
      var on = favIndex(favStore(), entry.f) >= 0;
      b.classList.toggle('on', on);
      star.textContent = on ? '★' : '☆';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
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
    // load the account + favorites-sync module once (works quietly; no-op until signed in)
    if (!document.getElementById('calculo-auth-js')){
      var am = document.createElement('script'); am.type = 'module'; am.src = 'calculo-auth.js'; am.id = 'calculo-auth-js';
      document.head.appendChild(am);
    }
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
        + '<span class="cxsw-ic" style="background:rgba(14,156,116,.16);color:#0e9c74">⧉</span>'
        + '<span class="cxsw-embed-t">Copy embed code</span></button>'
      : '';
    var saveRow = labEntry
      ? '<button type="button" class="cxsw-embed cxsw-save" role="menuitem">'
        + '<span class="cxsw-ic" style="background:rgba(191,124,15,.16);color:#bf7c0f">⤓</span>'
        + '<span class="cxsw-save-t">Save diagram as image</span></button>'
      : '';

    wrap.innerHTML =
      '<button type="button" class="cxsw-btn" aria-haspopup="true" aria-expanded="false" aria-label="Switch labs">'
      + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
      + '<rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M5 15 C 9 15, 10 8, 13 8 S 18 14, 19 10" stroke="#0e9c74" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
      + '<span class="cxsw-txt">Labs</span><span class="cxsw-chev">▴</span></button>'
      + '<div class="cxsw-menu" role="menu"><div class="cxsw-lab">Knovay labs</div>' + rows + embedRow + saveRow
      + '<div class="cxsw-div"></div><div class="cxsw-acct" id="cxswAcct"></div></div>';
    document.body.appendChild(wrap);

    // account row — reflects auth state (updated when calculo-auth.js reports in)
    var acct = wrap.querySelector('#cxswAcct');
    function renderAcct(user){
      if (user){
        acct.innerHTML = '<div class="cxsw-acct-row"><span class="cxsw-ic" style="background:rgba(14,156,116,.16);color:#0e9c74">✓</span>'
          + '<span class="cxsw-acct-e" title="' + (user.email || '') + '">' + (user.email || 'Signed in') + '</span>'
          + '<button type="button" class="cxsw-signout">Sign out</button></div>';
        acct.querySelector('.cxsw-signout').addEventListener('click', function(e){ e.stopPropagation(); if (window.calculoSignOut) window.calculoSignOut(); });
      } else {
        acct.innerHTML = '<a class="cxsw-signin" href="login.html"><span class="cxsw-ic" style="background:rgba(142,162,255,.16);color:#3b5bd9">⇲</span>Sign in to sync</a>';
      }
    }
    renderAcct(window.calculoUser || null);
    window.addEventListener('calculo:auth', function(e){ renderAcct(e.detail && e.detail.user); });

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

      // "Save diagram as image" — download the main canvas as a PNG
      var saveBtn = wrap.querySelector('.cxsw-save');
      if (saveBtn){
        var saveLabel = saveBtn.querySelector('.cxsw-save-t');
        saveBtn.addEventListener('click', function(e){
          e.stopPropagation();
          var cv = document.querySelector('.graphwrap canvas') || document.querySelector('canvas');
          if (!cv){ saveLabel.textContent = 'No diagram found'; setTimeout(function(){ saveLabel.textContent = 'Save diagram as image'; }, 1600); return; }
          try{
            var a = document.createElement('a');
            a.href = cv.toDataURL('image/png');
            a.download = 'calculo-' + file.replace(/\.html$/, '') + '.png';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            saveLabel.textContent = 'Saved ✓';
          }catch(err){ saveLabel.textContent = "Couldn't save"; }
          setTimeout(function(){ saveLabel.textContent = 'Save diagram as image'; }, 1600);
        });
      }
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
    if (labEntry){ buildFav(labEntry); buildNote(labEntry); buildQuickCheck(labEntry); markVisited(file); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();

/* Calculo — shared question bank.
   One source of truth for the full practice quiz (quiz.html) and the per-lab
   "Quick check" widgets (injected by calculo-switcher.js).
   Exposes: window.CalculoQuiz.makeQuiz(n, topic?)  and  .topics()
   Every generated question has exactly one correct answer and four distinct choices. */
(function(){
  "use strict";
  function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function term(c,p){if(c===0)return '0';var cs=(c===1&&p!==0)?'':(c===-1&&p!==0)?'−':(c<0?'−'+Math.abs(c):''+c);if(p===0)return (c<0?'−'+Math.abs(c):''+c);return cs+(p===1?'x':'x<sup>'+p+'</sup>');}
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t;}return a;}
  function frac(a,b){var g=gcd(a,b)||1;return (a<0?'−':'')+(Math.abs(a)/g)+'/'+(Math.abs(b)/g);}
  function mc(prompt,correct,distractors,fmt){
    fmt=fmt||function(v){return ''+v;};
    var seen={},chosen=[];seen[fmt(correct)]=1;
    for(var i=0;i<distractors.length&&chosen.length<3;i++){var k=fmt(distractors[i]);if(!seen[k]){seen[k]=1;chosen.push(distractors[i]);}}
    if(chosen.length<3)return null;
    var opts=shuffle([{v:correct,c:true}].concat(chosen.map(function(d){return {v:d,c:false};})));
    return {prompt:prompt,choices:opts.map(function(o){return {html:fmt(o.v),correct:o.c};})};
  }
  var I=function(v){return v;};

  var GEN=[
    {topic:'derivatives',gen:function(){var n=rnd(2,7);return mc('d/dx ( x<sup>'+n+'</sup> ) = ?',term(n,n-1),[term(1,n-1),term(n,n),term(1,n+1)],I);}},
    {topic:'derivatives',gen:function(){var n=rnd(2,4),a=rnd(2,5);var c=n*Math.pow(a,n-1);return mc('If f(x)=x<sup>'+n+'</sup>, then f&prime;('+a+') = ?',c,shuffle([Math.pow(a,n),n*Math.pow(a,n),Math.pow(a,n-1),(n-1)*Math.pow(a,n-2),c+a]));}},
    {topic:'derivatives',gen:function(){var P=[['sin x','cos x'],['cos x','−sin x'],['e<sup>x</sup>','e<sup>x</sup>'],['ln x','1/x'],['tan x','sec<sup>2</sup> x'],['√x','1/(2√x)']];var q=pick(P);return mc('d/dx ( '+q[0]+' ) = ?',q[1],shuffle(P.filter(function(p){return p[1]!==q[1];}).map(function(p){return p[1];})),I);}},
    {topic:'derivatives',gen:function(){var items=[['(x+1)(x+2)',1,5],['(x+4)(x−1)',2,7],['(2x)(x+3)',1,10],['(x−2)(x+5)',1,9]];var it=pick(items);return mc('d/dx [ '+it[0]+' ] at x='+it[1]+' = ?',it[2],shuffle([it[2]+1,it[2]-2,it[2]+3,it[2]-1]));}},
    {topic:'derivatives',gen:function(){var b=rnd(1,4),c=rnd(1,5);var k0=4*b+2*c,slope=4*b+c,cst=k0-2*slope;function ln(s,k){return 'y = '+s+'x '+(k>=0?'+ '+k:'− '+Math.abs(k));}return mc('Tangent line to f(x)='+term(b,2)+' + '+term(c,1)+' at x=2:',ln(slope,cst),shuffle(['y = '+slope+'x',ln(slope-2,cst),ln(slope,-cst)]),I);}},
    {topic:'chain',gen:function(){var items=[['sin(3x)',0,3,[1,0,-3]],['(2x+1)<sup>3</sup>',0,6,[3,2,1]],['e<sup>2x</sup>',0,2,[1,0,4]],['(x<sup>2</sup>+1)<sup>2</sup>',1,8,[4,2,16]],['cos(2x)',0,0,[2,-2,1]],['(3x−1)<sup>2</sup>',1,12,[6,4,9]]];var it=pick(items);return mc('d/dx '+it[0]+' at x='+it[1]+' = ?',it[2],shuffle(it[3].slice()));}},
    {topic:'chain',gen:function(){var P=[['sin(x<sup>2</sup>)','2x cos(x<sup>2</sup>)',['cos(x<sup>2</sup>)','2x sin(x<sup>2</sup>)','2 cos(x<sup>2</sup>)']],['(3x+1)<sup>4</sup>','12(3x+1)<sup>3</sup>',['4(3x+1)<sup>3</sup>','3(3x+1)<sup>4</sup>','12(3x+1)<sup>4</sup>']],['e<sup>x²</sup>','2x e<sup>x²</sup>',['e<sup>x²</sup>','2x e<sup>x</sup>','x² e<sup>x²</sup>']]];var q=pick(P);return mc('d/dx '+q[0]+' = ?',q[1],shuffle(q[2].slice()),I);}},
    {topic:'implicit',gen:function(){var pts=[[3,4],[4,3],[5,12],[12,5],[8,6],[6,8]];var p=pick(pts);var r2=p[0]*p[0]+p[1]*p[1];return mc('On x<sup>2</sup>+y<sup>2</sup>='+r2+', dy/dx at ('+p[0]+', '+p[1]+') = ?',frac(-p[0],p[1]),shuffle([frac(p[0],p[1]),frac(-p[1],p[0]),frac(p[1],p[0])]),I);}},
    {topic:'limits',gen:function(){var a=rnd(2,5),c2=rnd(1,3),c1=rnd(-3,3),c0=rnd(-4,4);var val=c2*a*a+c1*a+c0;var pp=[term(c2,2)];if(c1!==0)pp.push((c1<0?' − ':' + ')+term(Math.abs(c1),1));if(c0!==0)pp.push((c0<0?' − ':' + ')+Math.abs(c0));return mc('lim<sub>x&rarr;'+a+'</sub> ( '+pp.join('')+' ) = ?',val,shuffle([val+1,val-1,val+a,val-a,2*c2*a+c1]));}},
    {topic:'limits',gen:function(){var items=[['(3x<sup>2</sup>+1)/(6x<sup>2</sup>+x)','1/2',['2','1/6','0']],['(2x+1)/(x<sup>2</sup>+3)','0',['2','1','∞']],['(x<sup>2</sup>)/(2x<sup>2</sup>−1)','1/2',['2','1','0']],['(5x<sup>3</sup>)/(x<sup>3</sup>+1)','5',['0','∞','1/5']],['(4x+7)/(2x−3)','2',['0','∞','1/2']]];var it=pick(items);return mc('lim<sub>x&rarr;∞</sub> '+it[0]+' = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'lhopital',gen:function(){var items=[['sin x / x','1',['0','∞','−1'],0],['(1−cos x)/x<sup>2</sup>','1/2',['1','0','2'],0],['(e<sup>x</sup>−1)/x','1',['0','e','∞'],0],['tan x / x','1',['0','∞','−1'],0],['(ln x)/x','0',['1','∞','e'],1]];var it=pick(items);var lim=it[3]?'<sub>x&rarr;∞</sub>':'<sub>x&rarr;0</sub>';return mc('lim'+lim+' '+it[0]+' = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'integrals',gen:function(){var combos=[[1,4],[1,6],[1,2],[2,3],[2,6],[3,2],[2,9]];var c=pick(combos),n=c[0],b=c[1];var correct=Math.pow(b,n+1)/(n+1);var cands=[Math.pow(b,n+1),Math.pow(b,n),(n+1)*Math.pow(b,n),correct+b,correct*2].filter(function(v){return Number.isInteger(v);});return mc('&int;<sub>0</sub><sup>'+b+'</sup> x'+(n===1?'':'<sup>'+n+'</sup>')+' dx = ?',correct,shuffle(cands));}},
    {topic:'integrals',gen:function(){var n=rnd(2,6);return mc('&int; x<sup>'+n+'</sup> dx = ?','x<sup>'+(n+1)+'</sup>/'+(n+1)+' + C',shuffle([term(n,n-1)+' + C','x<sup>'+(n+1)+'</sup> + C',(n+1)+'x<sup>'+n+'</sup> + C']),I);}},
    {topic:'integrals',gen:function(){var items=[['&int;<sub>0</sub><sup>π</sup> sin x dx','2',['0','1','π']],['&int;<sub>0</sub><sup>π/2</sup> cos x dx','1',['0','π/2','2']],['&int;<sub>0</sub><sup>1</sup> e<sup>x</sup> dx','e − 1',['e','1','e + 1']],['&int;<sub>1</sub><sup>e</sup> (1/x) dx','1',['e','0','e − 1']]];var it=pick(items);return mc(it[0]+' = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'ftc',gen:function(){var P=[['t<sup>2</sup>+1','x<sup>2</sup>+1',['2x','x<sup>3</sup>/3 + x','x<sup>2</sup>']],['sin t','sin x',['cos x','−cos x','−sin x']],['e<sup>t</sup>','e<sup>x</sup>',['e<sup>x</sup>+1','x e<sup>x</sup>','e<sup>x</sup>/x']],['3t<sup>2</sup>','3x<sup>2</sup>',['6x','x<sup>3</sup>','9x<sup>2</sup>']]];var q=pick(P);return mc('If F(x)=&int;<sub>0</sub><sup>x</sup> '+q[0]+' dt, then F&prime;(x) = ?',q[1],shuffle(q[2].slice()),I);}},
    {topic:'optimization',gen:function(){var b=pick([-8,-6,-4,-2,2,4,6]),c=rnd(-3,5),correct=-b/2;var bt=(b<0?' − '+Math.abs(b)+'x':' + '+b+'x'),ct=(c<0?' − '+Math.abs(c):' + '+c);return mc('The critical point of f(x)=x<sup>2</sup>'+bt+ct+' is at x = ?',correct,shuffle([b/2,-b,b,correct+1,correct-1]));}},
    {topic:'related_rates',gen:function(){var r=rnd(2,5),dr=rnd(1,3);var v=2*r*dr;return mc('A circle has area A=πr². If r='+r+' and dr/dt='+dr+', then dA/dt = ?',v+'π',shuffle([(r*r)+'π',(r*dr)+'π',(4*r*dr)+'π']),I);}},
    {topic:'newton',gen:function(){var items=[['x<sup>2</sup>−2',2,'1.5'],['x<sup>2</sup>−3',2,'1.75'],['x<sup>2</sup>−5',2,'2.25'],['x<sup>2</sup>−6',5,'3.1']];var it=pick(items);return mc('Newton on f(x)='+it[0]+' from x₀='+it[1]+': x₁ = ?',it[2],shuffle([it[1]+'', (it[1]-1)+'', (it[1]+1)+'', '2.0']),I);}},
    {topic:'series',gen:function(){var items=[['Σ (1/2)<sup>n</sup>','2',['1','1/2','∞']],['Σ (1/3)<sup>n</sup>','3/2',['3','1/3','2']],['Σ 3·(1/2)<sup>n</sup>','6',['3','2','∞']],['Σ (2/3)<sup>n</sup>','3',['2/3','2','∞']],['Σ (1/4)<sup>n</sup>','4/3',['4','1/4','2']]];var it=pick(items);return mc(it[0]+' &nbsp;(n from 0 to ∞) = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'series',gen:function(){var conv=['Σ 1/n<sup>2</sup>','Σ 1/n<sup>3</sup>','Σ (1/2)<sup>n</sup>','Σ (2/3)<sup>n</sup>'];var div=['Σ 1/n','Σ 1/√n','Σ 2<sup>n</sup>','Σ n','Σ (5/4)<sup>n</sup>'];return mc('Which series <b>converges</b>?',pick(conv),shuffle(div).slice(0,3),I);}},
    {topic:'improper',gen:function(){var items=[['&int;<sub>1</sub><sup>∞</sup> x<sup>−2</sup> dx','1',['∞','1/2','2']],['&int;<sub>1</sub><sup>∞</sup> x<sup>−3</sup> dx','1/2',['1','∞','1/3']],['&int;<sub>0</sub><sup>1</sup> x<sup>−1/2</sup> dx','2',['1','∞','1/2']]];var it=pick(items);return mc(it[0]+' = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'volume',gen:function(){var items=[['y=√x on [0,4]','8π',['4π','16π','2π']],['y=x on [0,3]','9π',['3π','27π','6π']],['y=x on [0,2]','8π/3',['4π','2π','8π']]];var it=pick(items);return mc('Disk volume, '+it[0]+' about the x-axis = ?',it[1],shuffle(it[2].slice()),I);}},
    {topic:'average',gen:function(){var items=[['x<sup>2</sup>','[0,3]','3',['9','1','6']],['x','[0,4]','2',['4','8','1']],['x<sup>2</sup>','[0,6]','12',['6','36','18']]];var it=pick(items);return mc('Average value of '+it[0]+' on '+it[1]+' = ?',it[2],shuffle(it[3].slice()),I);}},
    {topic:'parametric',gen:function(){var items=[['x=t<sup>2</sup>, y=t<sup>3</sup>',2,3],['x=t<sup>2</sup>, y=t<sup>3</sup>',4,6],['x=t, y=t<sup>2</sup>',3,6],['x=2t, y=t<sup>2</sup>',2,2]];var it=pick(items);return mc('For '+it[0]+', dy/dx at t='+it[1]+' = ?',it[2],shuffle([it[1],it[2]+1,it[2]-2,1]));}}
  ];

  function makeQuestion(pool){for(var t=0;t<20;t++){var g=pick(pool);var q=g.gen();if(q){q.topic=g.topic;return q;}}return null;}
  function makeQuiz(n,topic){
    var pool = topic ? GEN.filter(function(g){return g.topic===topic;}) : GEN;
    if(!pool.length) pool=GEN;
    var out=[],seen={},guard=0;
    while(out.length<n && guard++<800){var q=makeQuestion(pool);if(!q||seen[q.prompt])continue;seen[q.prompt]=1;out.push(q);}
    return out;
  }
  function topics(){var s={};GEN.forEach(function(g){s[g.topic]=1;});return Object.keys(s);}

  window.CalculoQuiz = { makeQuiz:makeQuiz, topics:topics };
})();

/* LoomWellOps polish layer. Additive only: remove the two tags in index.html to undo. */
(()=>{'use strict';
const R=document.documentElement,$=s=>document.querySelector(s),LS=k=>{try{return localStorage.getItem(k)}catch(e){return null}},SS=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1. Circular theme wipe from the toggle button */
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('#themeToggle');
  if(!b||b._lw||!document.startViewTransition||calm())return;
  e.stopImmediatePropagation();e.preventDefault();
  const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,
    end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  const vt=document.startViewTransition(()=>{b._lw=1;b.click();b._lw=0;});
  vt.ready.then(()=>R.animate({clipPath:[`circle(0 at ${x}px ${y}px)`,`circle(${end}px at ${x}px ${y}px)`]},
    {duration:620,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
},true);

/* 2. Touch/pen drag with a floating ghost; replays the app's own drag handlers so drops still save */
(()=>{let s=null,lastEl=null,dt=null,swallow=false;
  const SEL='[draggable="true"][data-post-id],.chip[draggable="true"],.loomwellops-bcard[draggable="true"]';
  const fire=(el,t,e)=>el&&el.dispatchEvent(new DragEvent(t,{bubbles:true,cancelable:true,dataTransfer:dt,clientX:e.clientX,clientY:e.clientY}));
  const under=(e)=>{s.g.style.display='none';const el=document.elementFromPoint(e.clientX,e.clientY);s.g.style.display='';return el;};
  const end=(e,drop)=>{if(!s)return;clearTimeout(s.t);
    if(s.on){const el=under(e);if(drop&&el)fire(el,'drop',e);fire(s.src,'dragend',e);
      s.g.remove();s.src.classList.remove('lw-src');document.body.classList.remove('lw-dragging');swallow=true;setTimeout(()=>swallow=false,350);}
    s=null;lastEl=null;dt=null;};
  document.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'||e.button>0)return;const src=e.target.closest&&e.target.closest(SEL);if(!src)return;
    s={src,x:e.clientX,y:e.clientY,on:false,t:setTimeout(()=>{
      try{dt=new DataTransfer();}catch(_){s=null;return;}
      const r=src.getBoundingClientRect(),g=src.cloneNode(true);g.removeAttribute('draggable');g.classList.add('lw-ghost');
      g.style.width=r.width+'px';document.body.appendChild(g);s.g=g;s.dx=s.x-r.left;s.dy=s.y-r.top;s.on=true;
      src.classList.add('lw-src');document.body.classList.add('lw-dragging');navigator.vibrate&&navigator.vibrate(12);
      g.style.transform=`translate(${r.left}px,${r.top}px) rotate(-2deg) scale(1.04)`;fire(src,'dragstart',{clientX:s.x,clientY:s.y});},320)};
  },true);
  document.addEventListener('pointermove',e=>{if(!s)return;
    if(!s.on){if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>8){clearTimeout(s.t);s=null;}return;}
    s.g.style.transform=`translate(${e.clientX-s.dx}px,${e.clientY-s.dy}px) rotate(-2deg) scale(1.04)`;
    const el=under(e);if(el!==lastEl){fire(lastEl,'dragleave',e);fire(el,'dragenter',e);lastEl=el;}fire(el,'dragover',e);
  },true);
  document.addEventListener('pointerup',e=>end(e,true),true);
  document.addEventListener('pointercancel',e=>end(e,false),true);
  document.addEventListener('touchmove',e=>{if(s&&s.on)e.preventDefault();},{passive:false});
  document.addEventListener('contextmenu',e=>{if(s)e.preventDefault();},true);
  document.addEventListener('click',e=>{if(swallow){e.stopImmediatePropagation();e.preventDefault();}},true);
})();

/* 6 + 11. Accent: client brand colour wins, then the user's own pick; plus a Reduce transparency switch */
let applied=null;
const accent=()=>{const b=getComputedStyle(R).getPropertyValue('--brand').trim();return b||LS('lw_accent')||'';};
const ink=h=>{const n=parseInt(h.slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255>0.6?'#14151f':'#ffffff';};
const sync=()=>{const a=accent();if(a===applied)return;applied=a;
  if(/^#[0-9a-f]{6}$/i.test(a)){R.style.setProperty('--accent-primary',a);R.style.setProperty('--accent-primary-text',ink(a));}
  else{R.style.removeProperty('--accent-primary');R.style.removeProperty('--accent-primary-text');}};
new MutationObserver(sync).observe(R,{attributes:true,attributeFilter:['style']});
R.classList.toggle('lw-solid',LS('lw_solid')==='1');

/* 9. Approval progress as a ring, driven by the existing bar */
const ring=()=>{const bar=$('#ovApprovalBar'),host=$('#ovApprovalRate');if(!bar||!host||host._lw)return;host._lw=1;
  const w=document.createElement('div');w.className='lw-ring-wrap';w.innerHTML='<div class="lw-ring"></div><b>0%</b>';
  host.parentNode.insertBefore(w,host);const rg=w.firstChild,t=w.lastChild;
  const upd=()=>{const p=Math.max(0,Math.min(100,parseFloat(bar.style.width)||0));rg.style.setProperty('--p',p);t.textContent=Math.round(p)+'%';};
  new MutationObserver(upd).observe(bar,{attributes:true,attributeFilter:['style']});upd();};

/* 11. Appearance panel */
const panel=()=>{const bar=$('.topbar-actions'),tg=$('#themeToggle');if(!bar||!tg||$('#lwAppBtn'))return;
  const btn=document.createElement('button');btn.className='icon-btn';btn.id='lwAppBtn';btn.title='Appearance';btn.setAttribute('aria-label','Appearance');
  btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="15.5" cy="10" r="1.2"/></svg>';
  bar.insertBefore(btn,tg);
  const cols=['#a78bfa','#f43f5e','#10b981','#0ea5e9','#f59e0b'],p=document.createElement('div');p.id='lwPanel';
  p.innerHTML='<h4>Appearance</h4><div class="sw" id="lwSw">'+cols.map(c=>`<button type="button" data-c="${c}" style="background:${c}" aria-label="Accent ${c}"></button>`).join('')+'</div><label><input type="checkbox" id="lwSolid"> Reduce transparency</label>';
  document.body.appendChild(p);
  const mark=()=>p.querySelectorAll('.sw button').forEach(b=>b.classList.toggle('on',b.dataset.c===(LS('lw_accent')||'#a78bfa')));
  p.querySelector('#lwSolid').checked=R.classList.contains('lw-solid');
  p.querySelector('#lwSolid').onchange=e=>{R.classList.toggle('lw-solid',e.target.checked);SS('lw_solid',e.target.checked?'1':'0');};
  p.querySelector('#lwSw').onclick=e=>{const c=e.target.dataset&&e.target.dataset.c;if(!c)return;SS('lw_accent',c);sync();mark();};
  btn.onclick=e=>{e.stopPropagation();const r=btn.getBoundingClientRect();p.style.top=r.bottom+8+'px';p.style.right=Math.max(8,innerWidth-r.right)+'px';
    p.querySelector('#lwSw').style.display=getComputedStyle(R).getPropertyValue('--brand').trim()?'none':'flex';mark();p.classList.toggle('open');};
  document.addEventListener('click',e=>{if(!p.contains(e.target))p.classList.remove('open');});};

const boot=()=>{sync();ring();panel();};
new MutationObserver(()=>{ring();panel();}).observe(document.body,{childList:true,subtree:true});
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();
})();

/* ===== round 2: Today checklist, board glide, live pops, timeline, heatmap, sparklines, login blade ===== */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches,G=()=>window.gsap&&!calm();
const P=()=>typeof posts!=='undefined'&&Array.isArray(posts)?posts:[];
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const ORDER=['Draft','Internal review','Client review','Approved','Scheduled','Posted'];
const watch=(sel,fn,opt)=>{const go=()=>{const el=$(sel);if(el&&!el._lwo){el._lwo=1;new MutationObserver(()=>fn(el)).observe(el,opt||{childList:true});fn(el);}};
  go();new MutationObserver(go).observe(document.body,{childList:true,subtree:true});};
const defer=(()=>{const q={};return(k,f)=>{cancelAnimationFrame(q[k]);q[k]=requestAnimationFrame(f);};})();

/* 3a. Posts glide to their new column on the Board */
let flip=null;
document.addEventListener('dragstart',e=>{const c=e.target.closest&&e.target.closest('.loomwellops-bcard[data-post-id]');
  if(c){flip={id:c.dataset.postId,r:c.getBoundingClientRect()};setTimeout(()=>flip=null,6000);}},true);
new MutationObserver(()=>{if(!flip||!G())return;
  const el=$(`.loomwellops-bcard[data-post-id="${CSS.escape(flip.id)}"]`);if(!el)return;const n=el.getBoundingClientRect();
  const dx=flip.r.left-n.left,dy=flip.r.top-n.top;flip=null;
  if(Math.abs(dx)+Math.abs(dy)>4)gsap.fromTo(el,{x:dx,y:dy,scale:1.05},{x:0,y:0,scale:1,duration:.55,ease:'power3.out',clearProps:'transform'});
}).observe(document.body,{childList:true,subtree:true});

/* 3b. Today checklist on Overview (admin can tick posts as Posted) */
const today=()=>{const g=$('#view-overview .overview-grid');if(!g)return;
  let card=$('#lwToday');if(!card){card=document.createElement('div');card.id='lwToday';card.className='glass-card';card.style.marginTop='16px';g.after(card);}
  const t=ymd(new Date()),list=P().filter(p=>p.post_date===t).sort((a,b)=>(a.post_time||'').localeCompare(b.post_time||''));
  const adm=typeof me!=='undefined'&&me&&me.role==='admin',done=list.filter(p=>p.status==='Posted').length;
  card.innerHTML='<div class="card-top-row"><h3 style="flex:1">Today</h3><span class="muted-text">'+done+' of '+list.length+' posted</span></div>';
  if(!list.length){const m=document.createElement('p');m.className='muted-text';m.textContent='Nothing scheduled today.';card.appendChild(m);return;}
  const nxt=list.find(p=>p.status!=='Posted');
  list.forEach(p=>{const r=document.createElement('label');r.className='lw-row'+(p.status==='Posted'?' done':'')+(p===nxt?' next':'');
    const c=document.createElement('input');c.type='checkbox';c.checked=p.status==='Posted';c.disabled=!adm||c.checked;
    const tx=document.createElement('span');tx.className='t';tx.textContent=(p.platform||'Post')+' · '+(p.caption||p.pillar||'Untitled').slice(0,70);
    const tm=document.createElement('small');tm.textContent=(p.post_time||'').slice(0,5);r.append(c,tx,tm);
    if(p===nxt){const u=document.createElement('em');u.textContent='Up next';r.append(u);}
    c.onchange=async()=>{c.disabled=true;r.classList.add('done');
      const {error}=await sb.from('posts').update({status:'Posted'}).eq('id',p.id);
      if(error){r.classList.remove('done');c.checked=false;c.disabled=false;return window.toast&&toast('Could not update: '+error.message);}
      p.status='Posted';typeof liveRefresh==='function'&&liveRefresh();today();};
    card.appendChild(r);});
  if(G())gsap.from(card.querySelectorAll('.lw-row'),{opacity:0,y:10,duration:.4,stagger:.05,clearProps:'opacity,transform'});};
watch('#ovUpNext',()=>defer('today',today));

/* 4. Live pops: badges tick, new "Needs you" cards slide in */
const prev={};
['#navApprovalBadge','#navInboxBadge','#navIdeasBadge','#attentionCount'].forEach(s=>watch(s,el=>{
  const n=parseInt(el.textContent)||0,o=prev[s];prev[s]=n;
  if(o!==undefined&&n>o&&G())gsap.fromTo(el,{scale:1.6},{scale:1,duration:.55,ease:'back.out(3)'});},{childList:true,characterData:true,subtree:true}));
const seen=new Set();
watch('#overviewAttentionList',el=>{const fresh=[...el.children].filter(c=>{const k=c.textContent.trim();if(seen.has(k))return false;seen.add(k);return true;});
  if(fresh.length&&seen.size>fresh.length&&G())gsap.from(fresh,{opacity:0,x:-16,duration:.45,stagger:.06,ease:'power3.out',clearProps:'opacity,transform'});});

/* 7. Timeline: today marker, staggered rows, status progress bar */
new MutationObserver(()=>{const tl=$('.timeline-list:not([data-lw])');if(!tl)return;tl.dataset.lw=1;
  const rows=$$('.timeline-row',tl),t=ymd(new Date());
  let at=null;rows.forEach(r=>{const p=P().find(x=>x.id===r.dataset.postId);if(!p)return;
    r.style.setProperty('--st',Math.round((Math.max(0,ORDER.indexOf(p.status))+1)/ORDER.length*100)+'%');
    if(!at&&p.post_date>=t)at=r;});
  const m=document.createElement('div');m.className='lw-today';m.innerHTML='<span>Today</span><i></i>';at?tl.insertBefore(m,at):tl.appendChild(m);
  if(G()){gsap.from(rows,{opacity:0,y:12,duration:.4,stagger:.03,clearProps:'opacity,transform'});
    gsap.from(m.querySelector('i'),{scaleX:0,duration:.8,delay:.25,ease:'power3.out'});}
}).observe(document.body,{childList:true,subtree:true});

/* 5 + 8. Analytics: posting heatmap and KPI sparklines */
const spark=(host,vals)=>{if(!host||vals.length<2||host.querySelector('.lw-spark'))return;
  const v=vals.slice(-14),mx=Math.max(...v),mn=Math.min(...v),sp=mx-mn||1;
  const d=v.map((y,i)=>(i?'L':'M')+(i/(v.length-1)*64).toFixed(1)+' '+(16-(y-mn)/sp*14).toFixed(1)).join(' ');
  host.insertAdjacentHTML('beforeend','<svg class="lw-spark" viewBox="0 0 64 18" aria-hidden="true"><path d="'+d+'"/></svg>');
  const pa=host.querySelector('.lw-spark path');if(G()){const L=pa.getTotalLength();gsap.fromTo(pa,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:1,ease:'power2.out'});}};
const analytics=()=>{const k=$('#liveAnalyticsKpis'),grid=$('#liveAnalyticsGrid');if(!k||!grid)return;const ps=P();
  const tr=ps.filter(p=>p.reach!=null).sort((a,b)=>(a.post_date||'').localeCompare(b.post_date||''));
  const host=id=>{const b=document.getElementById(id);return b&&b.closest('.si')&&b.closest('.si').lastElementChild;};
  spark(host('anKReach'),tr.map(p=>+p.reach||0));spark(host('anKEng'),tr.map(p=>+p.engagements||0));
  spark(host('anKRate'),tr.map(p=>p.reach?(+p.engagements||0)/p.reach*100:0));spark(host('anKPosts'),tr.map((_,i)=>i+1));
  let h=$('#lwHeat');if(!h){h=document.createElement('div');h.id='lwHeat';h.className='glass-card';grid.after(h);}
  const m=Array.from({length:7},()=>Array(17).fill(0));let mx=0;
  ps.forEach(p=>{if(!p.post_date||!p.post_time)return;const d=new Date(p.post_date+'T00:00:00'),hr=+p.post_time.slice(0,2)-6;
    if(isNaN(d)||hr<0||hr>16)return;mx=Math.max(mx,++m[(d.getDay()+6)%7][hr]);});
  const D=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];let html='<h3>When you post</h3><p>Posts by weekday and hour (6am to 10pm). Brighter means more posts.</p><div class="hm"><span></span>';
  for(let i=0;i<17;i++)html+='<span>'+((i+6)%3===0?(i+6):'')+'</span>';
  m.forEach((row,r)=>{html+='<span>'+D[r]+'</span>';row.forEach((n,c)=>{html+='<b title="'+D[r]+' '+(c+6)+':00 · '+n+' post'+(n===1?'':'s')+'" style="background:'+(n?'color-mix(in srgb,var(--accent-primary) '+Math.round(25+75*n/mx)+'%,var(--surface-subtle))':'var(--surface-subtle)')+'"></b>';});});
  h.innerHTML=html+'</div>';
  if(G())gsap.from(h.querySelectorAll('b'),{opacity:0,scale:.4,duration:.35,stagger:{each:.004,from:'start'},clearProps:'opacity,transform'});};
watch('#liveAnalyticsKpis',()=>defer('an',analytics));

/* 10. Login: diagonal blade between Sign in and Reset password */
new MutationObserver(()=>{const f=$('#app form.login#lf:not([data-lw])');if(!f)return;f.dataset.lw=1;f.classList.add('lw-login');f.dataset.mode='in';
  const bl=document.createElement('div');bl.className='lw-blade';f.prepend(bl);
  const fp=$('#fp'),btn=f.querySelector('button.p'),pw=$('#pw'),h=f.querySelector('h1'),orig=fp&&fp.onclick;if(!fp||!btn||!pw||!orig)return;
  const set=reset=>{f.dataset.mode=reset?'reset':'in';pw.required=!reset;btn.textContent=reset?'Send reset link':'Log in';fp.textContent=reset?'Back to sign in':'Forgot password?';h.textContent=reset?'Reset password':'Content Calendar';const e=$('#le');if(e)e.textContent='';};
  const swap=reset=>{if(!G()){set(reset);return;}
    gsap.fromTo(bl,{xPercent:-130,opacity:1},{xPercent:130,duration:.85,ease:'power3.inOut',onComplete:()=>gsap.set(bl,{opacity:0})});
    gsap.to(f.querySelectorAll('h1,label,input,button:not(.lw-blade)'),{opacity:0,duration:.18,delay:.28,onComplete:()=>{set(reset);gsap.to(f.querySelectorAll('h1,label,input,button'),{opacity:1,duration:.3});}});};
  fp.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();swap(f.dataset.mode==='in');},true);
  f.addEventListener('submit',e=>{if(f.dataset.mode!=='reset')return;e.stopImmediatePropagation();e.preventDefault();orig();},true);
}).observe(document.body,{childList:true,subtree:true});
})();

/* ===== login: split card, diagonal blade between "Welcome back" and "Reset password" ===== */
(()=>{'use strict';
const $=s=>document.querySelector(s),calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const T={in:{h:'Welcome back',s:'Sign in to access your Social Media Publishing Calendar.',b:'Log in',f:'Forgot password?',ph:'Welcome <em>back.</em>',pp:'Your posts, approvals and clients are exactly where you left them.'},
  reset:{h:'Reset password',s:'Enter your email and we will send you a reset link.',b:'Send reset link',f:'Back to sign in',ph:'Forgot it? <em>No problem.</em>',pp:'A secure link will land in your inbox in a minute.'}};
const init=()=>{const f=$('#loomwellopsLoginForm');if(!f||f.dataset.lw)return;
  const fp=$('#mForgotBtn'),pw=$('#mPass'),btn=$('#mLoginBtn'),err=$('#mLoginErr');if(!fp||!pw||!btn||!err)return;f.dataset.lw=1;
  f.classList.add('lw-split');
  const panel=document.createElement('aside');panel.className='lw-panel';panel.innerHTML='<small>LOOMWELLOPS</small><h2></h2><p></p>';
  const bl=document.createElement('div');bl.className='lw-lblade';f.append(panel,bl);
  const set=m=>{const t=T[m];f.dataset.mode=m;f.querySelector('h1').textContent=t.h;f.querySelector('p.sub').textContent=t.s;btn.textContent=t.b;fp.textContent=t.f;
    panel.querySelector('h2').innerHTML=t.ph;panel.querySelector('p').textContent=t.pp;pw.required=m==='in';err.textContent='';};
  set('in');
  const go=m=>{if(!window.gsap||calm()||matchMedia('(max-width:640px)').matches){set(m);return;}
    gsap.timeline().set(bl,{opacity:1,xPercent:-110,skewX:-14}).to(bl,{xPercent:0,duration:.5,ease:'power3.inOut'})
      .add(()=>set(m)).to(bl,{xPercent:110,duration:.5,ease:'power3.inOut'}).set(bl,{opacity:0});};
  fp.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();go(f.dataset.mode==='in'?'reset':'in');},true);
  f.addEventListener('submit',e=>{if(f.dataset.mode!=='reset')return;e.stopImmediatePropagation();e.preventDefault();fp.onclick&&fp.onclick();},true);
  new MutationObserver(()=>err.classList.toggle('lw-ok',/link sent/i.test(err.textContent))).observe(err,{childList:true,characterData:true,subtree:true});};
init();new MutationObserver(init).observe(document.body,{childList:true,subtree:true});
})();

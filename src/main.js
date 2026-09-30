import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const desktop = matchMedia('(min-width: 768px)');
const lowPower = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
const stage = document.querySelector('.scene-stage');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(){ nav.classList.remove('open');menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeMenu();menu.focus();}});
document.querySelector('#year').textContent=new Date().getFullYear();
let lenis;
const motion = gsap.matchMedia();
motion.add('(prefers-reduced-motion: no-preference)',()=>{
 let tick;
 if(fine.matches && !lowPower){lenis=new Lenis({duration:1.05,anchors:true});lenis.on('scroll',ScrollTrigger.update);tick=t=>lenis?.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);}
 gsap.from('.reveal',{y:24,opacity:0,duration:.85,stagger:.09,delay:.55,ease:'power3.out'});
 document.querySelectorAll('.project-art').forEach(el=>gsap.from(el.querySelector('.mini-phone'),{y:45,rotation:19,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'center center',scrub:true}}));
 gsap.from('.timeline-track i',{scaleY:0,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 75%',end:'bottom 75%',scrub:true}});
 document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count);const state={value:0};gsap.to(state,{value:target,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 90%',once:true},onUpdate:()=>el.textContent=Math.round(state.value)});});
 return ()=>{if(tick)gsap.ticker.remove(tick);lenis?.destroy();lenis=undefined;};
});
gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
const descriptions={Flutter:'Flutter — cross-platform interfaces, one considered experience.',Dart:'Dart — the foundation of Flutter applications.',Kotlin:'Kotlin — native Android, built with clarity.',Android:'Android — from architecture to Play Store release.',iOS:'iOS — polished experiences across the Apple ecosystem.',Firebase:'Firebase — connected data and dependable mobile backends.','Node.js':'Node.js — services that connect the whole experience.',MongoDB:'MongoDB — flexible data for evolving products.',Web3:'Web3 — mobile experiences connected to smart contracts.','Gemini API':'Gemini API — generative AI in the mobile toolkit.'};
const description=document.querySelector('#skill-description');
document.querySelectorAll('.orbit-skill').forEach(button=>{const highlight=()=>{description.textContent=descriptions[button.dataset.skill];};button.addEventListener('mouseenter',highlight);button.addEventListener('focus',highlight);button.addEventListener('click',highlight);});
// CSS transforms only: no layout reads inside an animation frame.
if(fine.matches){
 const cursor=document.querySelector('.cursor');
 document.addEventListener('pointermove',e=>{if(reduced.matches)return;cursor.style.opacity='1';cursor.style.transform=`translate(${e.clientX-11}px,${e.clientY-11}px)`;},{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>cursor.style.opacity='0');
 document.querySelectorAll('.magnetic,.project-card').forEach(el=>{
 let rect;
 el.addEventListener('pointerenter',()=>rect=el.getBoundingClientRect());
 el.addEventListener('pointermove',e=>{if(reduced.matches||!rect)return;const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;el.style.transform=el.classList.contains('project-card')?`perspective(1200px) rotateX(${-y*3}deg) rotateY(${x*3}deg)`:`translate(${x*9}px,${y*9}px)`;});
 el.addEventListener('pointerleave',()=>el.style.transform='');
 });
}
let phone;
let phoneLoading=false;
async function loadPhone(){
 if(phone || phoneLoading || reduced.matches || !desktop.matches || lowPower)return;
 phoneLoading=true;
 try{const {createPhone}=await import('./phone.js');phone=await createPhone(document.querySelector('#phone-scene'),stage);if(reduced.matches||!desktop.matches){phone.dispose();phone=undefined;}else phone.setProgress(storyProgress);}catch(error){console.info('Using lightweight phone presentation.',error.message);}finally{phoneLoading=false;}
}
let storyProgress=0;
const storyMotion=gsap.matchMedia();
storyMotion.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)',()=>{
 ScrollTrigger.create({trigger:'.story',start:'top top',end:'bottom bottom',pin:stage,pinSpacing:false,onUpdate:self=>{storyProgress=self.progress;phone?.setProgress(storyProgress);const fallback=stage.querySelector('.fallback-phone');fallback.style.rotate=`${self.progress*14}deg`;const i=self.progress<.3?0:self.progress<.7?1:2;fallback.querySelector('img').src=`${import.meta.env.BASE_URL}screens/project-${i}.svg`;}});
});
const sceneObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){loadPhone();sceneObserver.disconnect();}},{rootMargin:'150px'});sceneObserver.observe(stage);
function preferenceChange(){if(reduced.matches || !desktop.matches){phone?.dispose();phone=undefined;stage.classList.remove('has-webgl');}else loadPhone();}
reduced.addEventListener('change',preferenceChange);desktop.addEventListener('change',preferenceChange);
const form=document.querySelector('.contact-form');
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const status=form.querySelector('.form-status'),button=form.querySelector('button');button.disabled=true;button.textContent='Sending…';status.classList.remove('success');status.textContent='';
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw new Error('Submission failed');form.reset();status.textContent='Message sent. Thanks for reaching out — I’ll be in touch.';status.classList.add('success');}
 catch{status.textContent='Your message could not be sent. Please try again or email yaseenpv01@gmail.com.';}
 finally{clearTimeout(timeout);button.disabled=false;button.innerHTML='Send message <span aria-hidden="true">↗</span>';}
});
const orbit=document.querySelector('.orbit');
new IntersectionObserver(entries=>orbit.classList.toggle('in-view',entries[0].isIntersecting)).observe(orbit);
document.addEventListener('visibilitychange',()=>{if(document.hidden)orbit.classList.remove('in-view');else{const r=orbit.getBoundingClientRect();orbit.classList.toggle('in-view',r.bottom>0&&r.top<innerHeight);}});

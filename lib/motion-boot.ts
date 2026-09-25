/**
 * Le script d'amorçage du mouvement, injecté tel quel dans le <head>
 * par `app/layout.tsx`. Il s'exécute avant le premier rendu, sans
 * attendre React.
 *
 * 1. Il pose `data-motion="on"` sur <html> seulement si JavaScript tourne
 *    ET si le système ne demande pas moins d'animations. Tout état
 *    initial d'animation (un filet pas encore tracé, un bloc pas encore
 *    apparu) est écrit en CSS SOUS cet attribut : sans JS, ou avec
 *    « réduire les animations », le HTML s'affiche directement dans son
 *    état final. Rien n'est jamais masqué dans le HTML serveur.
 *
 * 2. Il crée le SEUL IntersectionObserver du site. Chaque élément
 *    `[data-reveal]` reçoit `data-in-view` à sa première entrée dans le
 *    viewport ; les transitions sont en CSS. Les primitives qui ont
 *    besoin de savoir quand elles entrent et sortent (pour s'arrêter hors
 *    champ) s'y abonnent via `window.__inView.observe` — voir
 *    `lib/in-view.ts`.
 *
 * Un MutationObserver prend le relais des navigations côté client : les
 * éléments ajoutés après coup sont observés à leur arrivée.
 *
 * Écrit en ES5 et sans dépendance : il part tel quel dans la page.
 */
export const motionBootScript = `(function(){
var d=document.documentElement,w=window;
var q=w.matchMedia?w.matchMedia('(prefers-reduced-motion: reduce)'):null;
var io=w.IntersectionObserver;
function sync(){if(!io||(q&&q.matches))d.removeAttribute('data-motion');else d.setAttribute('data-motion','on');}
sync();
if(q&&q.addEventListener)q.addEventListener('change',sync);
if(!io)return;
var subs=new Map();
var obs=new io(function(es){for(var i=0;i<es.length;i++){var e=es[i],t=e.target,s=subs.get(t);
if(e.isIntersecting&&t.hasAttribute('data-reveal'))t.setAttribute('data-in-view','');
if(s)s.forEach(function(f){f(e.isIntersecting);});else if(e.isIntersecting)obs.unobserve(t);}},{rootMargin:'0px 0px -10% 0px'});
w.__inView={observe:function(el,f){var s=subs.get(el);if(!s){s=new Set();subs.set(el,s);}s.add(f);obs.observe(el);
return function(){s.delete(f);if(!s.size){subs.delete(el);obs.unobserve(el);}};}};
var sel='[data-reveal]:not([data-in-view])';
function scan(n){if(n.nodeType!==1)return;if(n.matches(sel))obs.observe(n);var l=n.querySelectorAll(sel);for(var i=0;i<l.length;i++)obs.observe(l[i]);}
function start(){scan(document.body);new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)scan(a[j]);}}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();`;

/* Tiny helpers and the shared state object */
(function(RB){
'use strict';
RB.state={P:null,G:null,LAST:null,pending:null,lbTab:'daily',soundOn:true};
var S=RB.state;
var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rng(seed){var a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function fmt(n){return Number(n).toLocaleString('en-US')}
Object.assign(RB,{$,$$,esc,rng,fmt});
})(window.RB=window.RB||{});

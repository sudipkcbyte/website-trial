/* Player profile saved in localStorage */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf}=RB;
/* storage */
var MEM=null;
function load(){try{var s=localStorage.getItem('rarebyte');if(s)return JSON.parse(s)}catch(e){}return MEM}
function save(p){MEM=p;try{localStorage.setItem('rarebyte',JSON.stringify(p))}catch(e){}}
S.P=load()||{name:'NEPAL_NINJA',demo:1,total:5310,games:12,streak:3,longest:9,best:720,rare:6,legend:0,today:null};
if(!S.P.lastDay&&S.P.lastDay!==0)S.P.lastDay=TODAY-1;
Object.assign(RB,{load,save});
})(window.RB=window.RB||{});

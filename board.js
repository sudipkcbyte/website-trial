/* Daily, weekly and all-time leaderboards */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,load,save,beep,jingle,avatar,hash,trophy,TCOL}=RB;
/* leaderboards */
var NAMES='NEO_BYTE,PIXEL_PAL,LASERCAT,KRYPTON,GLITCHY,TURBO_T,ZERO_COOL,SYNTHWAVE,ARCADIA,BYTE_ME,NIGHT_OWL,COSMO,RETRO_RAY,MAXWELL,QUARK,DISCO_DOT,VOLT,STARDUST,CRT_KID,LUNA_8,BOSS_FIGHT,ROMAN_8,TETRA,HYPERLOOP,NOVA_9'.split(',');
function board(kind){var seed=TODAY*131+(kind==='daily'?1:kind==='weekly'?2:3),r=rng(seed),top=kind==='daily'?1380:kind==='weekly'?7100:61000,k=kind==='all'?.985:.992,out=[],i;
for(i=0;i<200;i++){out.push({name:NAMES[(i*7+seed)%NAMES.length]+(i>=NAMES.length?String(10+Math.floor(r()*89)):''),score:Math.round(top*Math.pow(k,i)*(.97+r()*.06)),me:0})}
var mine=kind==='daily'?(S.P.today&&S.P.today.day===TODAY?S.P.today.score:null):kind==='weekly'?(S.P.today&&S.P.today.day===TODAY?S.P.today.score+Math.round(S.P.total%1900):Math.round(S.P.total%1900)):S.P.total;
if(mine!==null&&mine>0)out.push({name:S.P.name,score:mine,me:1});
out.sort(function(a,b){return b.score-a.score});out.forEach(function(e,i){e.rank=i+1});return out}
function lbRows(list,n){var h='<tr><th>#</th><th>PLAYER</th><th>SCORE</th></tr>',me=null;
list.forEach(function(e){if(e.me)me=e});
list.slice(0,n).forEach(function(e,i){h+=row(e,i)});
if(me&&me.rank>n)h+='<tr><td class="n" colspan="3" style="text-align:center">...</td></tr>'+row(me,n);
return h}
function row(e,i){var t=e.rank<=3?trophy(TCOL[e.rank-1]):'';return '<tr class="'+(e.me?'me':'')+'"><td class="n">'+(t||('#'+e.rank))+'</td><td><span class="who"><img class="av" alt="" src="'+avatar(hash(e.name))+'">'+esc(e.name)+'</span></td><td>'+fmt(e.score)+'</td></tr>'}
Object.assign(RB,{board,lbRows});
})(window.RB=window.RB||{});

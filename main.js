/* Router, events and the countdown clock */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,load,save,beep,jingle,avatar,hash,trophy,TCOL,board,lbRows,startGame,showQ,submit,rankOf,titleOf,finish,renderResults,shareText,copyShare,renderHome,renderLB,renderArchives,renderProfile}=RB;
var VIEWS=['home','play','results','leaderboard','archives','profile','how','login'];
function route(){
var h=(location.hash||'#home').slice(1);if(VIEWS.indexOf(h)<0)h='home';
if(h!=='play'&&S.G){clearInterval(S.G.tm);S.G=null}
if(h!=='results')S.LAST=null;
if(h==='play'&&!S.G){
if(S.pending!==null){startGame(S.pending,true);S.pending=null}
else if(S.P.today&&S.P.today.day===TODAY){location.hash='#results';return}
else startGame(TODAY,false)}
$$('.view').forEach(function(v){v.hidden=v.id!=='v-'+h});
$$('nav a').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-v')===h)});
if(h==='home')renderHome();
if(h==='results')renderResults();
if(h==='leaderboard')renderLB();
if(h==='archives')renderArchives();
if(h==='profile')renderProfile();
window.scrollTo(0,0);
if(h==='play')$('#pIn').focus()}
$('#pForm').addEventListener('submit',function(e){e.preventDefault();submit(false)});
$('#pNext').addEventListener('click',function(){if(!S.G)return;S.G.i++;if(S.G.i>=7)finish();else showQ()});
$('#shareBtn').addEventListener('click',copyShare);
$('#arcList').addEventListener('click',function(e){var d=e.target.getAttribute&&e.target.getAttribute('data-d');if(d){S.pending=parseInt(d,10);if(location.hash==='#play')route();else location.hash='#play'}});
$$('.tab').forEach(function(t){t.addEventListener('click',function(){S.lbTab=t.getAttribute('data-b');renderLB();beep(520,.06)})});
$('#snd').addEventListener('click',function(){S.soundOn=!S.soundOn;this.textContent=S.soundOn?'SOUND ON':'SOUND OFF';this.setAttribute('aria-pressed',String(S.soundOn));beep(660,.08)});
$('#lgForm').addEventListener('submit',function(e){e.preventDefault();var n=$('#lgName').value.trim().toUpperCase().replace(/[^A-Z0-9_]/g,'_').slice(0,16);if(!n)return;
S.P={name:n,demo:0,total:0,games:0,streak:0,longest:0,best:0,rare:0,legend:0,today:null,lastDay:0};save(S.P);setLogin();location.hash='#profile'});
function setLogin(){var b=$('#loginBtn');b.textContent=S.P.demo?'LOGIN':S.P.name;}
function clock(){var n=new Date(),m=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1),s=Math.floor((m-n)/1000),p=function(x){return String(x).padStart(2,'0')};$('#cd').textContent=p(Math.floor(s/3600))+':'+p(Math.floor(s%3600/60))+':'+p(s%60)}
setLogin();clock();setInterval(clock,1000);
window.addEventListener('hashchange',route);route();
})(window.RB=window.RB||{});

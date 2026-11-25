/* Rendering of each screen */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,load,save,beep,jingle,avatar,hash,trophy,TCOL,board,lbRows,startGame,showQ,submit,rankOf,titleOf,finish}=RB;
function renderResults(){
var r=S.LAST;
if(!r&&S.P.today&&S.P.today.day===TODAY)r={day:TODAY,score:S.P.today.score,correct:S.P.today.correct,rarest:S.P.today.rarest,res:S.P.today.res,rank:S.P.today.rank,practice:false,newBest:false};
if(!r){location.hash='#home';return}
S.LAST=r;
$('#sTot').textContent=fmt(r.score)+' PTS';
$('#sBest').textContent=r.practice?'PRACTICE RUN. NOT RANKED.':(r.newBest?'NEW PERSONAL BEST':'');
$('#sCor').textContent=r.correct+'/7';
$('#sRank').textContent=r.rank>200?'#200+':'#'+r.rank;
$('#sRare').textContent=r.rarest+' PTS';
$('#sPB').textContent=fmt(Math.max(S.P.best,r.practice?0:r.score))+' PTS';
$('#sStr').textContent=S.P.streak+' DAYS';
$('#sTitle').textContent=titleOf(r.score);
var h='<tr><th>Q</th><th>YOUR ANSWER</th><th>TIER</th><th>PTS</th></tr>';
r.res.forEach(function(x,i){h+='<tr><td class="n">'+(i+1)+'</td><td>'+esc(x.ans)+'</td><td>'+x.label+'</td><td class="y">'+x.pts+'</td></tr>'});
$('#sTable').innerHTML=h;$('#shareMsg').textContent=''}
var SQ={0:'⬛',10:'⬜',25:'🟦',50:'🟪',100:'🟨',200:'🟥'};
function shareText(){var r=S.LAST;return 'RAREBYTE #'+r.day+'\n'+fmt(r.score)+' pts · '+r.correct+'/7 correct · rarest '+r.rarest+'\n'+r.res.map(function(x){return SQ[x.pts]}).join('')+'\nThink different. Score higher.'}
function copyShare(){var t=shareText(),m=$('#shareMsg');
function fallback(){var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='width:100%;height:120px;background:#05030f;color:#27e8ff;font:20px VT323,monospace';m.textContent='Select and copy:';m.appendChild(document.createElement('br'));m.appendChild(ta);ta.select()}
try{navigator.clipboard.writeText(t).then(function(){m.textContent='Copied to clipboard.'},fallback)}catch(e){fallback()}}
function renderHome(){
var done=S.P.today&&S.P.today.day===TODAY,b=$('#playBtn');
b.textContent=done?"VIEW TODAY'S RESULTS":"PLAY TODAY'S CHALLENGE";b.setAttribute('href',done?'#results':'#play');
$('#hNum').textContent='#'+TODAY;
var pips='';for(var i=0;i<7;i++)pips+='<div class="pip'+(i<Math.min(S.P.streak,7)?' f':'')+'"></div>';
$('#hPips').innerHTML=pips;
$('#hStreak').innerHTML='<span class="y" style="font:12px var(--px)">'+S.P.streak+' DAY'+(S.P.streak===1?'':'S')+'</span> '+(done?'<span class="dim">played today</span>':'<span class="dim">play today to extend it</span>');
$('#hLb').innerHTML=lbRows(board('daily'),5)}
function renderLB(){$('#lbT').innerHTML=lbRows(board(S.lbTab),10);$$('.tab').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-b')===S.lbTab)})}
function renderArchives(){var h='';
for(var d=TODAY-1;d>=TODAY-8;d--){var top=Math.round(1150+rng(d*17)()*220);
h+='<div class="panel"><h3>#'+d+' · '+dateOf(d)+'</h3><p class="dim">7 questions. Top score that day: <span class="y">'+fmt(top)+'</span></p><button class="btn alt" data-d="'+d+'" type="button">REPLAY</button></div>'}
$('#arcList').innerHTML=h}
function renderProfile(){
$('#prAv').src=avatar(hash(S.P.name));$('#prName').textContent=S.P.name;
$('#prNote').textContent=S.P.demo?'Sample profile for this demo. Register to start your own.':'Saved in this browser.';
var avg=S.P.games?Math.round(S.P.total/S.P.games):0;
var ach=[['FIRST BYTE','Complete your first game',S.P.games>=1],['RARE HUNTER','Submit 10 rare answers ('+Math.min(S.P.rare,10)+'/10)',S.P.rare>=10],['CONSISTENT','Play 7 days in a row',S.P.longest>=7],['BRAIN MASTER','Score 1,000 points in one game',S.P.best>=1000],['LEGENDARY','Reach the top 10',!!S.P.legend]];
var st=[['TOTAL POINTS',fmt(S.P.total)],['GAMES PLAYED',S.P.games],['CURRENT STREAK',S.P.streak+' DAYS'],['LONGEST STREAK',S.P.longest+' DAYS'],['AVERAGE SCORE',avg],['RARE ANSWERS',S.P.rare],['ACHIEVEMENTS',ach.filter(function(a){return a[2]}).length+'/5']];
$('#prStats').innerHTML=st.map(function(s){return '<div class="stat"><span>'+s[0]+'</span><b>'+esc(s[1])+'</b></div>'}).join('');
$('#prAch').innerHTML=ach.map(function(a){return '<div class="ach'+(a[2]?'':' off')+'"><i></i><div><h3 style="margin:0 0 4px">'+a[0]+'</h3><span class="dim">'+a[1]+'</span></div></div>'}).join('')}
Object.assign(RB,{renderResults,shareText,copyShare,renderHome,renderLB,renderArchives,renderProfile});
})(window.RB=window.RB||{});

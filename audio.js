/* 8-bit sound effects */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,load,save}=RB;
/* sound */
var AC=null;
function beep(f,d,type,delay){if(!S.soundOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+(delay||0);o.type=type||'square';o.frequency.value=f;g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
function jingle(pts){var n={200:[660,880,1320],100:[587,784,988],50:[523,659],25:[440,523],10:[330],0:[160,120]}[pts]||[330];n.forEach(function(f,i){beep(f,.14,pts?'square':'sawtooth',i*.1)})}
Object.assign(RB,{beep,jingle});
})(window.RB=window.RB||{});

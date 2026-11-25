/* Pixel avatars and trophies */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt,PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,load,save,beep,jingle}=RB;
/* pixel art */
function avatar(seed){var c=document.createElement('canvas');c.width=c.height=8;var x=c.getContext('2d'),r=rng(seed),h=Math.floor(r()*360),i,j;x.fillStyle='hsl('+h+',70%,55%)';for(j=0;j<8;j++)for(i=0;i<4;i++){if(r()>.45){x.fillRect(i,j,1,1);x.fillRect(7-i,j,1,1)}}x.fillStyle='#fff';x.fillRect(2,3,1,1);x.fillRect(5,3,1,1);return c.toDataURL()}
function hash(s){var h=7;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
var TRO=['.XXXXXXXX.','XXXXXXXXXX','X.XhXXXX.X','X.XhXXXX.X','XXXXXXXXXX','..XXXXXX..','...XXXX...','....XX....','....XX....','...XXXX...','..XXXXXX..'];
function trophy(col){var s='',y,x,ch;for(y=0;y<TRO.length;y++)for(x=0;x<10;x++){ch=TRO[y].charAt(x);if(ch==='X')s+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+col+'"/>';else if(ch==='h')s+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="#fff" opacity=".7"/>'}return '<svg class="tro" viewBox="0 0 10 11" shape-rendering="crispEdges" role="img" aria-label="trophy">'+s+'</svg>'}
var TCOL=['#ffd93d','#c9d3e6','#d18a4a'];
Object.assign(RB,{avatar,hash,trophy,TCOL});
})(window.RB=window.RB||{});

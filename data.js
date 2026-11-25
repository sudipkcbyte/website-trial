/* Question banks, answer matching, rarity tiers, daily challenge number */
(function(RB){
'use strict';
var S=RB.state;
var {$,$$,esc,rng,fmt}=RB;
var PLAYERS=18420;
var BANKS=[
{q:'Name a country in the world.',a:'United States 13,India 10,China 9,Canada 8,France 8,Germany 7,Japan 7,Brazil 6,Australia 6,Italy 5,Spain 5,United Kingdom 5,Mexico 4,Russia 4,Egypt 3,South Africa 3,Argentina 2.5,Nigeria 2,Turkey 2,Thailand 1.8,Norway 1.5,Peru 1.2,Nepal 0.9,Kenya 0.8,Vietnam 0.8,Bhutan 0.3,Mongolia 0.3,Laos 0.2,Eritrea 0.1,Tuvalu 0.05'},
{q:'Name a programming language.',a:'Python 16,JavaScript 15,Java 12,C++ 9,C 8,C# 7,PHP 5,Ruby 4,Go 4,Swift 3.5,Rust 3,Kotlin 3,TypeScript 3,SQL 2.5,R 1.5,Perl 1,Haskell 0.6,Lua 0.6,Scala 0.5,Elixir 0.3,COBOL 0.3,Fortran 0.2,Prolog 0.1,Brainfuck 0.05'},
{q:'Name a fruit.',a:'Apple 18,Banana 15,Orange 12,Mango 9,Grape 7,Strawberry 7,Watermelon 5,Pineapple 5,Pear 3,Peach 3,Cherry 3,Lemon 2.5,Kiwi 2,Papaya 1.5,Plum 1.2,Pomegranate 1,Lychee 0.8,Guava 0.8,Fig 0.6,Dragon Fruit 0.5,Jackfruit 0.4,Persimmon 0.2,Quince 0.1,Rambutan 0.1'},
{q:'Name a planet or a moon in our solar system.',a:'Mars 14,Jupiter 12,Saturn 11,Earth 10,Venus 9,Mercury 8,Neptune 6,Uranus 6,Moon 5,Pluto 4,Titan 2,Europa 2,Io 1,Ganymede 0.8,Callisto 0.5,Enceladus 0.5,Triton 0.4,Phobos 0.2,Charon 0.2,Ceres 0.15,Eris 0.1,Miranda 0.05'},
{q:'Name a musical instrument.',a:'Guitar 16,Piano 15,Drums 12,Violin 9,Flute 7,Trumpet 5,Saxophone 4,Cello 3,Harp 2.5,Clarinet 2.5,Bass 2,Ukulele 2,Harmonica 1.5,Trombone 1.2,Accordion 1,Banjo 1,Tabla 0.5,Sitar 0.4,Oboe 0.4,Didgeridoo 0.3,Sarangi 0.1,Madal 0.1,Theremin 0.1'},
{q:'Name a famous scientist.',person:1,a:'Albert Einstein 25,Isaac Newton 14,Marie Curie 9,Charles Darwin 8,Stephen Hawking 8,Nikola Tesla 6,Galileo Galilei 5,Thomas Edison 3,Louis Pasteur 2,Richard Feynman 1.5,Carl Sagan 1.5,Ada Lovelace 1,Alan Turing 1,Rosalind Franklin 0.5,Srinivasa Ramanujan 0.4,Katherine Johnson 0.3,Jagadish Bose 0.1,Emmy Noether 0.1,Barbara McClintock 0.05'},
{q:'Name a famous mountain.',a:'Mount Everest 30,Kilimanjaro 8,K2 6,Fuji 6,Mont Blanc 5,Matterhorn 4,Denali 3,Annapurna 1.5,Aconcagua 1.2,Olympus 1,Rushmore 1,Kangchenjunga 0.8,Elbrus 0.8,Makalu 0.3,Lhotse 0.3,Cho Oyu 0.2,Dhaulagiri 0.2,Cotopaxi 0.2,Manaslu 0.15,Ama Dablam 0.1,Vinson 0.1'}
];
BANKS.forEach(function(b){b.list=b.a.split(',').map(function(x){var i=x.lastIndexOf(' ');return{name:x.slice(0,i),w:parseFloat(x.slice(i+1))}});b.total=b.list.reduce(function(s,e){return s+e.w},0)});
var ALIAS={usa:'United States',us:'United States','united states of america':'United States',america:'United States',uk:'United Kingdom',england:'United Kingdom',britain:'United Kingdom',js:'JavaScript',cpp:'C++',csharp:'C#','c sharp':'C#',golang:'Go',ts:'TypeScript',pluto:'Pluto','the moon':'Moon'};
function norm(s){return String(s).toLowerCase().replace(/[^a-z0-9+# ]/g,' ').replace(/\s+/g,' ').trim().replace(/^(mount|mt|the) /,'')}
function match(b,input){var n=norm(input);if(!n)return null;var t=ALIAS[n]?norm(ALIAS[n]):n,i,e;
for(i=0;i<b.list.length;i++){e=b.list[i];if(norm(e.name)===t)return e}
if(b.person){for(i=0;i<b.list.length;i++){e=b.list[i];var p=norm(e.name).split(' ');if(p[p.length-1]===t)return e}}
return null}
function tier(share){var p=share*100;
if(p>=10)return{pts:10,label:'VERY COMMON'};
if(p>=4)return{pts:25,label:'COMMON'};
if(p>=1.5)return{pts:50,label:'UNCOMMON'};
if(p>=0.5)return{pts:100,label:'RARE'};
return{pts:200,label:'EXTREMELY RARE'}}
/* date and challenge number */
var NOW=new Date();
function dayIndex(d){return Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(2026,0,1))/864e5)+1}
var TODAY=dayIndex(NOW);
function order(day){var o=[0,1,2,3,4,5,6],r=rng(day*7919),i,j,t;for(i=6;i>0;i--){j=Math.floor(r()*(i+1));t=o[i];o[i]=o[j];o[j]=t}return o}
function dateOf(day){var d=new Date(2026,0,day);return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function lev(a,b){var m=[],i,j;for(i=0;i<=a.length;i++)m[i]=[i];for(j=1;j<=b.length;j++)m[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]}
function suggest(b,input){var n=norm(input),best=null,bd=99,max=n.length>=7?2:n.length>=4?1:0;if(!max)return null;
b.list.forEach(function(e){var d=lev(n,norm(e.name));if(d<bd){bd=d;best=e}});
return bd<=max&&bd>0?best:null}
Object.assign(RB,{PLAYERS,BANKS,norm,match,tier,TODAY,order,dateOf,suggest});
})(window.RB=window.RB||{});

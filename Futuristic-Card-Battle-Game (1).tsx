// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
const swiperModules = [Pagination, Autoplay];
interface Card {
id: number;
name: string;
attack: number;
defense: number;
element: string;
rarity: string;
description: string;
imageUrl: string;
}
interface Player {
name: string;
avatar: string;
health: number;
maxHealth: number;
energy: number;
maxEnergy: number;
cards: Card[];
}
const App: React.FC = () => {
const [gameState, setGameState] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
const [currentTurn, setCurrentTurn] = useState<'player' | 'opponent'>('player');
const [turnCount, setTurnCount] = useState(1);
const [selectedCard, setSelectedCard] = useState<Card | null>(null);
const [opponentSelectedCard, setOpponentSelectedCard] = useState<Card | null>(null);
const [battleLog, setBattleLog] = useState<string[]>([
"Battle begins! Your turn to attack.",
"Choose a card from your hand to play."
]);
const [showRules, setShowRules] = useState(false);
const [reducedMotion, setReducedMotion] = useState(false);
const [player, setPlayer] = useState<Player>({
name: "Cyber Knight",
avatar: "https://readdy.ai/api/search-image?query=futuristic%20cyber%20warrior%20with%20helmet%20and%20glowing%20eyes%2C%20highly%20detailed%2C%20sci-fi%20concept%20art%2C%20dark%20background%20with%20neon%20accents%2C%20digital%20illustration%2C%20high%20resolution%2C%20professional%20lighting&width=100&height=100&seq=1&orientation=squarish",
health: 100,
maxHealth: 100,
energy: 5,
maxEnergy: 5,
cards: []
});
const [opponent, setOpponent] = useState<Player>({
name: "Neon Assassin",
avatar: "https://readdy.ai/api/search-image?query=mysterious%20futuristic%20assassin%20with%20neon%20mask%2C%20cyberpunk%20style%2C%20dark%20atmosphere%20with%20purple%20and%20blue%20lighting%2C%20digital%20art%2C%20high%20detail%2C%20professional%20concept%20art%2C%20sci-fi%20character%20design&width=100&height=100&seq=2&orientation=squarish",
health: 100,
maxHealth: 100,
energy: 5,
maxEnergy: 5,
cards: []
});
const battleLogRef = useRef<HTMLDivElement>(null);
const statsChartRef = useRef<HTMLDivElement>(null);
const cardData: Card[] = [
{
id: 1,
name: "Plasma Blade",
attack: 25,
defense: 5,
element: "Energy",
rarity: "Rare",
description: "A high-frequency blade that cuts through most defenses.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20energy%20sword%20with%20glowing%20blue%20plasma%20blade%2C%20cyberpunk%20style%2C%20dark%20background%20with%20neon%20blue%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20weapon%20concept%20art&width=300&height=400&seq=3&orientation=portrait"
},
{
id: 2,
name: "Neural Hack",
attack: 15,
defense: 10,
element: "Tech",
rarity: "Epic",
description: "Temporarily disables opponent's neural interface.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20hacking%20device%20with%20holographic%20interface%2C%20cyberpunk%20style%2C%20glowing%20circuits%2C%20dark%20background%20with%20neon%20green%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20gadget%20concept%20art&width=300&height=400&seq=4&orientation=portrait"
},
{
id: 3,
name: "Quantum Shield",
attack: 5,
defense: 30,
element: "Defense",
rarity: "Legendary",
description: "Projects a quantum field that absorbs incoming damage.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20energy%20shield%20with%20hexagonal%20patterns%2C%20glowing%20blue%20forcefield%2C%20cyberpunk%20style%2C%20dark%20background%20with%20neon%20blue%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20technology%20concept%20art&width=300&height=400&seq=5&orientation=portrait"
},
{
id: 4,
name: "Nano Swarm",
attack: 20,
defense: 15,
element: "Bio",
rarity: "Rare",
description: "Releases microscopic robots that attack and defend.",
imageUrl: "https://readdy.ai/api/search-image?query=swarm%20of%20tiny%20glowing%20nanobots%20forming%20attack%20pattern%2C%20cyberpunk%20style%2C%20dark%20background%20with%20red%20and%20blue%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20technology%20concept%20art&width=300&height=400&seq=6&orientation=portrait"
},
{
id: 5,
name: "EMP Blast",
attack: 35,
defense: 0,
element: "Energy",
rarity: "Epic",
description: "Unleashes an electromagnetic pulse that deals massive damage.",
imageUrl: "https://readdy.ai/api/search-image?query=massive%20electromagnetic%20pulse%20explosion%20with%20blue%20electric%20arcs%2C%20cyberpunk%20style%2C%20dark%20background%20with%20electric%20blue%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20weapon%20effect%20concept%20art&width=300&height=400&seq=7&orientation=portrait"
}
];
const opponentCards: Card[] = [
{
id: 6,
name: "Void Cannon",
attack: 30,
defense: 5,
element: "Dark",
rarity: "Epic",
description: "Harnesses dark energy to blast opponents.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20dark%20energy%20cannon%20with%20purple%20glowing%20core%2C%20cyberpunk%20style%2C%20dark%20background%20with%20purple%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20weapon%20concept%20art&width=300&height=400&seq=8&orientation=portrait"
},
{
id: 7,
name: "Chrono Freeze",
attack: 10,
defense: 25,
element: "Time",
rarity: "Legendary",
description: "Slows down time around the user, increasing defense.",
imageUrl: "https://readdy.ai/api/search-image?query=time%20manipulation%20device%20with%20clock-like%20mechanisms%20and%20blue%20temporal%20energy%2C%20cyberpunk%20style%2C%20dark%20background%20with%20cyan%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20gadget%20concept%20art&width=300&height=400&seq=9&orientation=portrait"
},
{
id: 8,
name: "Stealth Matrix",
attack: 15,
defense: 20,
element: "Tech",
rarity: "Rare",
description: "Cloaking technology that makes attacks harder to predict.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20stealth%20suit%20with%20glitching%20cloaking%20effect%2C%20cyberpunk%20style%2C%20dark%20background%20with%20subtle%20green%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20technology%20concept%20art&width=300&height=400&seq=10&orientation=portrait"
},
{
id: 9,
name: "Plasma Grenade",
attack: 25,
defense: 0,
element: "Energy",
rarity: "Rare",
description: "Explosive device that releases superheated plasma on impact.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20plasma%20grenade%20with%20glowing%20purple%20energy%20core%2C%20cyberpunk%20style%2C%20dark%20background%20with%20purple%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20weapon%20concept%20art&width=300&height=400&seq=15&orientation=portrait"
},
{
id: 10,
name: "Neural Disruptor",
attack: 20,
defense: 15,
element: "Psionic",
rarity: "Epic",
description: "Emits waves that interfere with neural pathways, causing confusion.",
imageUrl: "https://readdy.ai/api/search-image?query=futuristic%20neural%20disruptor%20device%20with%20pulsing%20red%20energy%20waves%2C%20cyberpunk%20style%2C%20dark%20background%20with%20red%20neon%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20weapon%20concept%20art&width=300&height=400&seq=16&orientation=portrait"
}
];
useEffect(() => {
// Initialize player cards
setPlayer(prev => ({
...prev,
cards: [...cardData]
}));
setOpponent(prev => ({
...prev,
cards: [...opponentCards]
}));
// Initialize stats chart
if (statsChartRef.current && gameState === 'battle') {
const chart = echarts.init(statsChartRef.current);
const option = {
animation: false,
radar: {
indicator: [
{ name: 'Attack', max: 40 },
{ name: 'Defense', max: 40 },
{ name: 'Energy', max: 5 },
{ name: 'Cards', max: 5 },
{ name: 'Health', max: 100 }
],
splitArea: {
areaStyle: {
color: ['rgba(0, 245, 255, 0.05)', 'rgba(0, 245, 255, 0.1)']
}
},
axisLine: {
lineStyle: {
color: 'rgba(0, 245, 255, 0.3)'
}
},
splitLine: {
lineStyle: {
color: 'rgba(0, 245, 255, 0.3)'
}
}
},
series: [{
type: 'radar',
data: [
{
value: [
selectedCard?.attack || 0,
selectedCard?.defense || 0,
player.energy,
player.cards.length,
player.health
],
name: 'Player',
areaStyle: {
color: 'rgba(0, 245, 255, 0.2)'
},
lineStyle: {
color: '#00F5FF'
}
},
{
value: [25, 15, opponent.energy, opponent.cards.length, opponent.health],
name: 'Opponent',
areaStyle: {
color: 'rgba(255, 0, 212, 0.2)'
},
lineStyle: {
color: '#FF00D4'
}
}
]
}]
};
chart.setOption(option);
window.addEventListener('resize', () => {
chart.resize();
});
return () => {
chart.dispose();
window.removeEventListener('resize', () => {
chart.resize();
});
};
}
}, [gameState, selectedCard]);
useEffect(() => {
// Scroll battle log to bottom when new messages are added
if (battleLogRef.current) {
battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
}
}, [battleLog]);
const startBattle = () => {
setGameState('battle');
setBattleLog([...battleLog, "Battle started! Your turn to attack."]);
};
const playCard = (card: Card) => {
if (currentTurn !== 'player') return;
setSelectedCard(card);
// Update battle log
setBattleLog([...battleLog, `You played ${card.name}! Dealing ${card.attack} damage.`]);
// Update opponent health
const newOpponentHealth = Math.max(0, opponent.health - card.attack);
setOpponent(prev => ({
...prev,
health: newOpponentHealth
}));
// Remove card from player's hand
setPlayer(prev => ({
...prev,
cards: prev.cards.filter(c => c.id !== card.id),
energy: prev.energy - 1
}));
// Check for victory
if (newOpponentHealth <= 0) {
setTimeout(() => {
setGameState('victory');
setBattleLog([...battleLog, "Victory! You defeated your opponent!"]);
}, 1000);
return;
}
// Switch turn to opponent
setTimeout(() => {
setCurrentTurn('opponent');
setBattleLog(prev => [...prev, "Opponent's turn!"]);
// Opponent AI logic
setTimeout(() => {
opponentTurn();
}, 1500);
}, 1000);
};
const opponentTurn = () => {
if (opponent.cards.length === 0) {
setGameState('victory');
setBattleLog(prev => [...prev, "Victory! Opponent has no cards left!"]);
return;
}
// Pick a random card from opponent's hand
const randomIndex = Math.floor(Math.random() * opponent.cards.length);
const selectedOpponentCard = opponent.cards[randomIndex];
// Set the opponent's selected card
setOpponentSelectedCard(selectedOpponentCard);
// Update battle log
setBattleLog(prev => [...prev, `Opponent played ${selectedOpponentCard.name}! Dealing ${selectedOpponentCard.attack} damage.`]);
// Update player health
const newPlayerHealth = Math.max(0, player.health - selectedOpponentCard.attack);
setPlayer(prev => ({
...prev,
health: newPlayerHealth
}));
// Remove card from opponent's hand
setOpponent(prev => ({
...prev,
cards: prev.cards.filter(c => c.id !== selectedOpponentCard.id),
energy: prev.energy - 1
}));
// Check for defeat
if (newPlayerHealth <= 0) {
setTimeout(() => {
setGameState('defeat');
setBattleLog(prev => [...prev, "Defeat! Your health reached zero!"]);
}, 1000);
return;
}
// Switch turn back to player
setTimeout(() => {
setCurrentTurn('player');
setTurnCount(prev => prev + 1);
setBattleLog(prev => [...prev, `Turn ${turnCount + 1}. Your turn to attack!`]);
// Clear opponent's selected card after a delay
setTimeout(() => {
setOpponentSelectedCard(null);
}, 1000);
// Restore some energy each turn
setPlayer(prev => ({
...prev,
energy: Math.min(prev.maxEnergy, prev.energy + 1)
}));
setOpponent(prev => ({
...prev,
energy: Math.min(prev.maxEnergy, prev.energy + 1)
}));
}, 1000);
};
const restartGame = () => {
setGameState('intro');
setCurrentTurn('player');
setTurnCount(1);
setSelectedCard(null);
setOpponentSelectedCard(null);
setBattleLog([
"Battle begins! Your turn to attack.",
"Choose a card from your hand to play."
]);
setPlayer({
name: "Cyber Knight",
avatar: "https://readdy.ai/api/search-image?query=futuristic%20cyber%20warrior%20with%20helmet%20and%20glowing%20eyes%2C%20highly%20detailed%2C%20sci-fi%20concept%20art%2C%20dark%20background%20with%20neon%20accents%2C%20digital%20illustration%2C%20high%20resolution%2C%20professional%20lighting&width=100&height=100&seq=1&orientation=squarish",
health: 100,
maxHealth: 100,
energy: 5,
maxEnergy: 5,
cards: [...cardData]
});
setOpponent({
name: "Neon Assassin",
avatar: "https://readdy.ai/api/search-image?query=mysterious%20futuristic%20assassin%20with%20neon%20mask%2C%20cyberpunk%20style%2C%20dark%20atmosphere%20with%20purple%20and%20blue%20lighting%2C%20digital%20art%2C%20high%20detail%2C%20professional%20concept%20art%2C%20sci-fi%20character%20design&width=100&height=100&seq=2&orientation=squarish",
health: 100,
maxHealth: 100,
energy: 5,
maxEnergy: 5,
cards: [...opponentCards]
});
};
const renderIntro = () => (
<div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0C0C1D] to-[#23234A] overflow-hidden">
<div className="absolute inset-0 overflow-hidden">
<div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=futuristic%20digital%20grid%20with%20glowing%20neon%20lines%2C%20cyberpunk%20style%2C%20dark%20background%20with%20blue%20and%20purple%20energy%20waves%2C%20abstract%20technology%20concept%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting&width=1440&height=900&seq=11&orientation=landscape')] bg-cover bg-center opacity-30"></div>
<div className="absolute inset-0 bg-gradient-to-t from-[#0C0C1D] via-transparent to-transparent"></div>
{/* Animated particles */}
<div className="particles absolute inset-0">
{[...Array(20)].map((_, i) => (
<div
key={i}
className="absolute rounded-full"
style={{
width: `${Math.random() * 10 + 2}px`,
height: `${Math.random() * 10 + 2}px`,
backgroundColor: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF00D4' : '#FFC857',
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
opacity: Math.random() * 0.7 + 0.3,
boxShadow: `0 0 ${Math.random() * 10 + 5}px ${i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF00D4' : '#FFC857'}`,
animation: `float ${Math.random() * 10 + 10}s linear infinite`
}}
/>
))}
</div>
</div>
{/* Floating navbar */}
<div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<div className="flex items-center">
<span className="text-[#00F5FF] text-2xl font-bold font-['Orbitron']">CYBER<span className="text-[#FF00D4]">DUEL</span></span>
</div>
<div className="flex items-center space-x-6">
<Dialog open={showRules} onOpenChange={setShowRules}>
<DialogTrigger asChild>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] font-medium text-lg !rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-book-open mr-2"></i> Rules
</Button>
</DialogTrigger>
<DialogContent className="bg-[#1E1E2F] border border-[#00F5FF]/30 text-[#E0E0E0]">
<DialogHeader>
<DialogTitle className="text-[#00F5FF] font-['Orbitron']">Game Rules</DialogTitle>
</DialogHeader>
<div className="space-y-4 font-['Poppins']">
<p>1. Each player starts with 100 health and 5 energy points.</p>
<p>2. Players take turns playing cards from their hand.</p>
<p>3. Each card costs 1 energy to play.</p>
<p>4. Cards deal damage based on their attack value.</p>
<p>5. Players gain 1 energy at the start of their turn.</p>
<p>6. The first player to reduce their opponent's health to 0 wins.</p>
</div>
</DialogContent>
</Dialog>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] font-medium text-lg !rounded-button cursor-pointer whitespace-nowrap" onClick={restartGame}>
<i className="fas fa-redo-alt mr-2"></i> Restart
</Button>
<Dialog>
<DialogTrigger asChild>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] font-medium text-lg !rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-cog mr-2"></i> Settings
</Button>
</DialogTrigger>
<DialogContent className="bg-[#1E1E2F] border border-[#00F5FF]/30 text-[#E0E0E0]">
<DialogHeader>
<DialogTitle className="text-[#00F5FF] font-['Orbitron']">Game Settings</DialogTitle>
</DialogHeader>
<div className="space-y-6 font-['Poppins']">
<div className="flex items-center justify-between">
<Label htmlFor="reduced-motion" className="text-[#E0E0E0]">Reduced Motion</Label>
<Switch
id="reduced-motion"
checked={reducedMotion}
onCheckedChange={setReducedMotion}
/>
</div>
<div className="flex items-center justify-between">
<Label htmlFor="sound" className="text-[#E0E0E0]">Sound Effects</Label>
<Switch id="sound" />
</div>
<div className="flex items-center justify-between">
<Label htmlFor="music" className="text-[#E0E0E0]">Background Music</Label>
<Switch id="music" />
</div>
</div>
</DialogContent>
</Dialog>
</div>
</div>
</div>
<div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center z-10 text-center">
<h1 className="text-6xl md:text-7xl font-bold text-[#E0E0E0] font-['Orbitron'] mb-6 tracking-wider">
<span className="text-[#00F5FF]">CYBER</span>
<span className="text-[#FF00D4]">DUEL</span>
</h1>
<p className="text-xl md:text-2xl text-[#E0E0E0] font-['Rajdhani'] max-w-2xl mb-12">
The ultimate futuristic card battle where strategy meets technology. Engage in tactical combat, deploy powerful cards, and defeat your opponents in this immersive digital arena.
</p>
<Button
onClick={startBattle}
className="bg-gradient-to-r from-[#00F5FF] to-[#0080FF] hover:from-[#00F5FF] hover:to-[#0060FF] text-[#0C0C1D] font-['Orbitron'] text-xl px-10 py-6 rounded-full shadow-lg shadow-[#00F5FF]/20 animate-pulse transition-all duration-300 hover:scale-105 !rounded-button cursor-pointer whitespace-nowrap"
>
START BATTLE
</Button>
<div className="mt-20 w-full max-w-5xl relative z-20">
<div className="relative group">
<div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,245,255,0.1)] to-[rgba(255,0,212,0.1)] backdrop-blur-md rounded-xl border border-[#00F5FF]/10"></div>
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#00F5FF]/5 to-[#FF00D4]/5 rounded-xl"></div>

<h2 className="text-4xl font-['Orbitron'] bg-gradient-to-r from-[#00F5FF] to-[#FF00D4] bg-clip-text text-transparent mb-10 relative z-10 pt-6 text-center">
  <span className="relative">
    FEATURED CARDS
    <span className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF]/20 to-[#FF00D4]/20 blur-lg -z-10"></span>
  </span>
</h2>

<Swiper
modules={swiperModules}
spaceBetween={40}
slidesPerView={3}
pagination={{ clickable: true }}
autoplay={{ delay: 3000, disableOnInteraction: false }}
className="w-full relative z-10 pb-12"
breakpoints={{
320: {
slidesPerView: 1,
spaceBetween: 20
},
640: {
slidesPerView: 2,
spaceBetween: 20
},
1024: {
slidesPerView: 3,
spaceBetween: 30
}
}}
>
{cardData.map((card) => (
<SwiperSlide key={card.id}>
<div className="card-container perspective-800 p-2 group/card">
<div className={`card-inner transition-all duration-700 transform-style-3d ${reducedMotion ? 'hover:scale-105' : 'group-hover/card:rotate-y-180'} cursor-pointer`}>
<div className="card-front absolute w-full h-full backface-hidden">
<div className="relative bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#00F5FF]/60 group-hover/card:border-[#00F5FF] h-[400px] shadow-[0_0_20px_rgba(0,245,255,0.2)] group-hover/card:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-500">
<div className="absolute inset-0 bg-gradient-to-b from-[#00F5FF]/5 to-[#FF00D4]/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
<div className="h-[60%] overflow-hidden">
<img
src={card.imageUrl}
alt={card.name}
className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
/>
</div>
<div className="p-6 h-[40%] relative">
<div className="absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#1E1E2F]"></div>
<div className="flex justify-between items-center mb-3">
<h3 className="text-[#00F5FF] font-['Orbitron'] text-lg font-bold bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/70 bg-clip-text text-transparent">{card.name}</h3>
<span className="px-3 py-1 rounded-full bg-[#1E1E2F]/60 border border-[#FFC857]/30 text-[#FFC857] font-['Quantico'] text-sm font-bold">{card.rarity}</span>
</div>
<div className="flex justify-between mb-3 space-x-4">
<div className="flex-1 bg-[#1E1E2F]/40 rounded-lg p-2 border border-[#FF00D4]/20">
<span className="text-[#FF00D4] font-['Quantico'] text-sm block">Attack</span>
<span className="text-[#FF00D4] font-['Orbitron']">{card.attack}</span>
</div>
<div className="flex-1 bg-[#1E1E2F]/40 rounded-lg p-2 border border-[#00F5FF]/20">
<span className="text-[#00F5FF] font-['Quantico'] text-sm block">Defense</span>
<span className="text-[#00F5FF] font-['Orbitron']">{card.defense}</span>
</div>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-sm leading-relaxed line-clamp-2">{card.description}</p>
</div>
</div>
</div>
<div className="card-back absolute w-full h-full backface-hidden rotate-y-180">
<div className="bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#FF00D4]/60 hover:border-[#FF00D4] h-[400px] shadow-lg shadow-[#FF00D4]/30 p-6 flex flex-col justify-center">
<h3 className="text-[#FF00D4] font-['Orbitron'] text-xl mb-4 text-center font-bold text-shadow-sm">{card.name}</h3>
<div className="mb-4">
<p className="text-[#E0E0E0] font-['Poppins'] mb-4 brightness-125">{card.description}</p>
<p className="text-[#E0E0E0] font-['Quantico']">Element: <span className="text-[#FFC857] font-bold">{card.element}</span></p>
<p className="text-[#E0E0E0] font-['Quantico']">Rarity: <span className="text-[#FFC857] font-bold">{card.rarity}</span></p>
</div>
<div className="mt-auto">
<div className="flex justify-between">
<div>
<p className="text-[#E0E0E0] font-['Quantico'] text-sm">Attack</p>
<p className="text-[#FF00D4] font-['Orbitron'] font-bold">{card.attack}</p>
</div>
<div>
<p className="text-[#E0E0E0] font-['Quantico'] text-sm">Defense</p>
<p className="text-[#00F5FF] font-['Orbitron'] font-bold">{card.defense}</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</SwiperSlide>
))}
</Swiper>
</div>
</div>
<div className="mt-20 w-full max-w-5xl">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg p-6 border border-[#00F5FF]/20 hover:border-[#00F5FF]/50 transition-all duration-300">
<div className="text-[#00F5FF] text-4xl mb-4">
<i className="fas fa-bolt"></i>
</div>
<h3 className="text-[#E0E0E0] font-['Orbitron'] text-xl mb-2">Strategic Combat</h3>
<p className="text-[#E0E0E0]/80 font-['Poppins']">Plan your moves carefully and outthink your opponent with tactical card plays.</p>
</div>
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg p-6 border border-[#FF00D4]/20 hover:border-[#FF00D4]/50 transition-all duration-300">
<div className="text-[#FF00D4] text-4xl mb-4">
<i className="fas fa-layer-group"></i>
</div>
<h3 className="text-[#E0E0E0] font-['Orbitron'] text-xl mb-2">Unique Cards</h3>
<p className="text-[#E0E0E0]/80 font-['Poppins']">Collect and battle with dozens of unique cards, each with special abilities.</p>
</div>
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg p-6 border border-[#FFC857]/20 hover:border-[#FFC857]/50 transition-all duration-300">
<div className="text-[#FFC857] text-4xl mb-4">
<i className="fas fa-trophy"></i>
</div>
<h3 className="text-[#E0E0E0] font-['Orbitron'] text-xl mb-2">Climb the Ranks</h3>
<p className="text-[#E0E0E0]/80 font-['Poppins']">Win battles to earn rewards and climb the global leaderboard.</p>
</div>
</div>
</div>
</div>
<footer className="w-full py-8 mt-20 border-t border-[#00F5FF]/10 text-[#E0E0E0]/60 font-['Poppins']">
<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
<div className="mb-4 md:mb-0">
<p>© 2025 CyberDuel. All rights reserved.</p>
</div>
<div className="flex space-x-6">
<a href="#" className="hover:text-[#00F5FF] transition-colors duration-300">
<i className="fab fa-discord"></i>
</a>
<a href="#" className="hover:text-[#00F5FF] transition-colors duration-300">
<i className="fab fa-twitter"></i>
</a>
<a href="#" className="hover:text-[#00F5FF] transition-colors duration-300">
<i className="fab fa-instagram"></i>
</a>
<a href="#" className="hover:text-[#00F5FF] transition-colors duration-300">
<i className="fab fa-youtube"></i>
</a>
</div>
</div>
</footer>
<style jsx>{`
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(0) rotate(-1deg); }
  75% { transform: translateY(10px) rotate(1deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.3); }
  50% { box-shadow: 0 0 30px rgba(0,245,255,0.5); }
}

.card-container {
  animation: float 6s ease-in-out infinite;
}

.card-front {
  animation: glow 3s ease-in-out infinite;
}
.perspective-800 {
perspective: 800px;
}
.transform-style-3d {
transform-style: preserve-3d;
}
.backface-hidden {
backface-visibility: hidden;
}
.rotate-y-180 {
transform: rotateY(180deg);
}
.hover\:rotate-y-180:hover {
transform: rotateY(180deg);
}
.text-shadow-neon {
text-shadow: 0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 30px #00F5FF;
}
.text-shadow-sm {
text-shadow: 0 0 5px currentColor;
}
`}</style>
</div>
);
const renderBattle = () => (
<div className="relative min-h-screen flex flex-col bg-[#0C0C1D] text-[#E0E0E0] overflow-hidden">
{/* Background */}
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=futuristic%20digital%20arena%20with%20holographic%20displays%2C%20cyberpunk%20style%2C%20dark%20background%20with%20blue%20and%20purple%20neon%20grid%20lines%2C%20sci-fi%20battle%20environment%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting&width=1440&height=900&seq=12&orientation=landscape')] bg-cover bg-center opacity-20"></div>
<div className="absolute inset-0 bg-gradient-to-b from-[#0C0C1D] via-[#0C0C1D]/70 to-[#0C0C1D]"></div>
</div>
{/* Floating navbar */}
<div className="sticky top-0 left-0 right-0 z-50 px-6 py-4 bg-[#0C0C1D]/80 backdrop-blur-md border-b border-[#00F5FF]/10">
<div className="max-w-7xl mx-auto flex items-center justify-between">
<div className="flex items-center">
<span className="text-[#00F5FF] text-xl font-bold font-['Orbitron']">CYBER<span className="text-[#FF00D4]">DUEL</span></span>
</div>
<div className="flex items-center space-x-6">
<Dialog open={showRules} onOpenChange={setShowRules}>
<DialogTrigger asChild>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] !rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-book-open mr-2"></i> Rules
</Button>
</DialogTrigger>
<DialogContent className="bg-[#1E1E2F] border border-[#00F5FF]/30 text-[#E0E0E0]">
<DialogHeader>
<DialogTitle className="text-[#00F5FF] font-['Orbitron']">Game Rules</DialogTitle>
</DialogHeader>
<div className="space-y-4 font-['Poppins']">
<p>1. Each player starts with 100 health and 5 energy points.</p>
<p>2. Players take turns playing cards from their hand.</p>
<p>3. Each card costs 1 energy to play.</p>
<p>4. Cards deal damage based on their attack value.</p>
<p>5. Players gain 1 energy at the start of their turn.</p>
<p>6. The first player to reduce their opponent's health to 0 wins.</p>
</div>
</DialogContent>
</Dialog>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] !rounded-button cursor-pointer whitespace-nowrap" onClick={restartGame}>
<i className="fas fa-redo-alt mr-2"></i> Restart
</Button>
<Dialog>
<DialogTrigger asChild>
<Button variant="ghost" className="text-[#E0E0E0] hover:text-[#00F5FF] font-['Rajdhani'] !rounded-button cursor-pointer whitespace-nowrap">
<i className="fas fa-cog mr-2"></i> Settings
</Button>
</DialogTrigger>
<DialogContent className="bg-[#1E1E2F] border border-[#00F5FF]/30 text-[#E0E0E0]">
<DialogHeader>
<DialogTitle className="text-[#00F5FF] font-['Orbitron']">Game Settings</DialogTitle>
</DialogHeader>
<div className="space-y-6 font-['Poppins']">
<div className="flex items-center justify-between">
<Label htmlFor="reduced-motion-battle" className="text-[#E0E0E0]">Reduced Motion</Label>
<Switch
id="reduced-motion-battle"
checked={reducedMotion}
onCheckedChange={setReducedMotion}
/>
</div>
<div className="flex items-center justify-between">
<Label htmlFor="sound-battle" className="text-[#E0E0E0]">Sound Effects</Label>
<Switch id="sound-battle" />
</div>
<div className="flex items-center justify-between">
<Label htmlFor="music-battle" className="text-[#E0E0E0]">Background Music</Label>
<Switch id="music-battle" />
</div>
</div>
</DialogContent>
</Dialog>
</div>
</div>
</div>
<div className="container mx-auto px-4 py-6 flex-grow flex flex-col z-10">
<div className="flex-grow flex flex-col md:flex-row gap-6">
{/* Main battle area */}
<div className="w-full md:w-3/4 flex flex-col">
{/* Opponent section */}
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg p-4 border border-[#FF00D4]/20 mb-6">
<div className="flex items-center">
<div className="relative">
<Avatar className="w-16 h-16 border-2 border-[#FF00D4] shadow-lg shadow-[#FF00D4]/20">
<AvatarImage src={opponent.avatar} alt={opponent.name} />
<AvatarFallback className="bg-[#23234A] text-[#FF00D4]">NA</AvatarFallback>
</Avatar>
{currentTurn === 'opponent' && (
<div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF00D4] rounded-full flex items-center justify-center animate-pulse">
<i className="fas fa-play text-xs text-[#0C0C1D]"></i>
</div>
)}
</div>
<div className="ml-4 flex-grow">
<div className="flex justify-between items-center mb-1">
<h3 className="text-[#FF00D4] font-['Rajdhani'] font-bold text-lg">{opponent.name}</h3>
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">
{opponent.health}/{opponent.maxHealth}
</span>
<i className="fas fa-heart text-[#FF00D4]"></i>
</div>
</div>
<div className="w-full">
<Progress
value={(opponent.health / opponent.maxHealth) * 100}
className="h-2 bg-[#23234A]"
indicatorClassName={`bg-gradient-to-r from-[#FF00D4] to-[#FF5EDB] ${opponent.health < 30 ? 'animate-pulse' : ''}`}
/>
</div>
<div className="flex justify-between items-center mt-2">
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">Energy:</span>
<div className="flex">
{[...Array(opponent.maxEnergy)].map((_, i) => (
<div
key={i}
className={`w-4 h-4 rounded-full mx-0.5 ${i < opponent.energy ? 'bg-[#FF00D4]' : 'bg-[#23234A] border border-[#FF00D4]/30'}`}
/>
))}
</div>
</div>
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">Cards:</span>
<span className="text-[#FF00D4] font-['Quantico']">{opponent.cards.length}</span>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
{/* Opponent cards */}
<div className="mb-6">
<h3 className="text-[#FF00D4] font-['Orbitron'] mb-4">Opponent's Cards</h3>
<div className="flex justify-center overflow-x-auto py-4">
<div className="flex space-x-4">
{opponent.cards.map((card, index) => (
<TooltipProvider key={card.id}>
<Tooltip>
<TooltipTrigger asChild>
<div
className="card-container perspective-800 cursor-pointer"
style={{
transform: `translateY(${Math.sin(index * 0.5) * 10}px) rotate(${(index - (opponent.cards.length - 1) / 2) * 5}deg)`,
transformOrigin: 'top center',
transition: 'transform 0.3s ease'
}}
>
<div className={`card-inner transform-style-3d transition-transform duration-300 ${opponentSelectedCard?.id === card.id ? 'scale-110' : 'hover:scale-105'}`}>
<div className="card-front">
<div className={`bg-[#1E1E2F] rounded-lg overflow-hidden border-2 ${opponentSelectedCard?.id === card.id ? 'border-[#FF00D4]' : 'border-[#FF00D4]/30'} h-[200px] w-[150px] shadow-lg ${opponentSelectedCard?.id === card.id ? 'shadow-[#FF00D4]/30' : 'shadow-[#FF00D4]/10'}`}>
<div className="h-[60%] overflow-hidden">
<img
src={card.imageUrl}
alt={card.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-2 h-[40%]">
<div className="flex justify-between items-center mb-1">
<h3 className="text-[#FF00D4] font-['Orbitron'] text-xs">{card.name}</h3>
<span className="text-[#FFC857] font-['Quantico'] text-xs">{card.rarity}</span>
</div>
<div className="flex justify-between mb-1">
<span className="text-[#FF00D4] font-['Quantico'] text-xs">ATK: {card.attack}</span>
<span className="text-[#00F5FF] font-['Quantico'] text-xs">DEF: {card.defense}</span>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-xs line-clamp-1">{card.description}</p>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
</TooltipTrigger>
<TooltipContent className="bg-[#1E1E2F] border border-[#FF00D4]/30 p-4 max-w-xs">
<h4 className="text-[#FF00D4] font-['Orbitron'] mb-2">{card.name}</h4>
<p className="text-[#E0E0E0] font-['Poppins'] text-sm mb-2">{card.description}</p>
<div className="flex justify-between text-sm">
<span className="text-[#FF00D4] font-['Quantico']">ATK: {card.attack}</span>
<span className="text-[#00F5FF] font-['Quantico']">DEF: {card.defense}</span>
<span className="text-[#FFC857] font-['Quantico']">{card.element}</span>
</div>
</TooltipContent>
</Tooltip>
</TooltipProvider>
))}
</div>
</div>
</div>
{/* Battle arena */}
<div className="flex-grow bg-[#1E1E2F]/30 backdrop-blur-sm rounded-lg border border-[#00F5FF]/10 p-6 mb-6 relative min-h-[300px] flex flex-col items-center justify-center">
{/* Turn indicator */}
<div className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full font-['Orbitron'] text-sm ${currentTurn === 'player' ? 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30' : 'bg-[#FF00D4]/20 text-[#FF00D4] border border-[#FF00D4]/30'}`}>
{currentTurn === 'player' ? 'YOUR TURN' : 'OPPONENT\'S TURN'} • TURN {turnCount}
</div>
{/* Selected card display */}
<div className="flex items-center justify-center space-x-16 w-full">
{/* Opponent's selected card */}
{opponentSelectedCard ? (
<div className="card-container perspective-800 mt-6">
<div className="card-inner transform-style-3d">
<div className="card-front">
<div className="bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#FF00D4] h-[250px] w-[180px] shadow-lg shadow-[#FF00D4]/20 transform hover:scale-105 transition-transform duration-300">
<div className="h-[60%] overflow-hidden">
<img
src={opponentSelectedCard.imageUrl}
alt={opponentSelectedCard.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-3 h-[40%]">
<div className="flex justify-between items-center mb-2">
<h3 className="text-[#FF00D4] font-['Orbitron'] text-sm">{opponentSelectedCard.name}</h3>
<span className="text-[#FFC857] font-['Quantico'] text-xs">{opponentSelectedCard.rarity}</span>
</div>
<div className="flex justify-between mb-2">
<span className="text-[#FF00D4] font-['Quantico']">ATK: {opponentSelectedCard.attack}</span>
<span className="text-[#00F5FF] font-['Quantico']">DEF: {opponentSelectedCard.defense}</span>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-xs line-clamp-2">{opponentSelectedCard.description}</p>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
) : (
currentTurn === 'opponent' && (
<div className="text-center">
<p className="text-[#FF00D4] font-['Rajdhani'] text-lg mb-2">
Opponent is choosing a card...
</p>
<div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#FF00D4] animate-spin mx-auto"></div>
</div>
)
)}
{/* VS indicator */}
{(selectedCard || opponentSelectedCard) && (
<div className="text-[#FFC857] font-['Orbitron'] text-4xl font-bold animate-pulse">
VS
</div>
)}
{/* Player's selected card */}
{selectedCard ? (
<div className="card-container perspective-800 mt-6">
<div className="card-inner transform-style-3d">
<div className="card-front">
<div className="bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#00F5FF] h-[250px] w-[180px] shadow-lg shadow-[#00F5FF]/20 transform hover:scale-105 transition-transform duration-300">
<div className="h-[60%] overflow-hidden">
<img
src={selectedCard.imageUrl}
alt={selectedCard.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-3 h-[40%]">
<div className="flex justify-between items-center mb-2">
<h3 className="text-[#00F5FF] font-['Orbitron'] text-sm">{selectedCard.name}</h3>
<span className="text-[#FFC857] font-['Quantico'] text-xs">{selectedCard.rarity}</span>
</div>
<div className="flex justify-between mb-2">
<span className="text-[#FF00D4] font-['Quantico']">ATK: {selectedCard.attack}</span>
<span className="text-[#00F5FF] font-['Quantico']">DEF: {selectedCard.defense}</span>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-xs line-clamp-2">{selectedCard.description}</p>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
) : (
currentTurn === 'player' && (
<div className="text-center">
<p className="text-[#00F5FF] font-['Rajdhani'] text-lg mb-2">
Select a card from your hand
</p>
<div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#00F5FF] animate-spin mx-auto"></div>
</div>
)
)}
</div>
{/* Battle effects */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
{currentTurn === 'player' && (
[...Array(10)].map((_, i) => (
<div
key={i}
className="absolute rounded-full bg-[#00F5FF]/30"
style={{
width: `${Math.random() * 20 + 5}px`,
height: `${Math.random() * 20 + 5}px`,
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
boxShadow: '0 0 10px #00F5FF',
animation: `float ${Math.random() * 5 + 3}s linear infinite`
}}
/>
))
)}
{currentTurn === 'opponent' && (
[...Array(10)].map((_, i) => (
<div
key={i}
className="absolute rounded-full bg-[#FF00D4]/30"
style={{
width: `${Math.random() * 20 + 5}px`,
height: `${Math.random() * 20 + 5}px`,
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
boxShadow: '0 0 10px #FF00D4',
animation: `float ${Math.random() * 5 + 3}s linear infinite`
}}
/>
))
)}
</div>
</div>
{/* Player section */}
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg p-4 border border-[#00F5FF]/20">
<div className="flex items-center">
<div className="relative">
<Avatar className="w-16 h-16 border-2 border-[#00F5FF] shadow-lg shadow-[#00F5FF]/20">
<AvatarImage src={player.avatar} alt={player.name} />
<AvatarFallback className="bg-[#23234A] text-[#00F5FF]">CK</AvatarFallback>
</Avatar>
{currentTurn === 'player' && (
<div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00F5FF] rounded-full flex items-center justify-center animate-pulse">
<i className="fas fa-play text-xs text-[#0C0C1D]"></i>
</div>
)}
</div>
<div className="ml-4 flex-grow">
<div className="flex justify-between items-center mb-1">
<h3 className="text-[#00F5FF] font-['Rajdhani'] font-bold text-lg">{player.name}</h3>
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">
{player.health}/{player.maxHealth}
</span>
<i className="fas fa-heart text-[#00F5FF]"></i>
</div>
</div>
<div className="w-full">
<Progress
value={(player.health / player.maxHealth) * 100}
className="h-2 bg-[#23234A]"
indicatorClassName={`bg-gradient-to-r from-[#00F5FF] to-[#00BFFF] ${player.health < 30 ? 'animate-pulse' : ''}`}
/>
</div>
<div className="flex justify-between items-center mt-2">
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">Energy:</span>
<div className="flex">
{[...Array(player.maxEnergy)].map((_, i) => (
<div
key={i}
className={`w-4 h-4 rounded-full mx-0.5 ${i < player.energy ? 'bg-[#00F5FF]' : 'bg-[#23234A] border border-[#00F5FF]/30'}`}
/>
))}
</div>
</div>
<div className="flex items-center">
<span className="text-[#E0E0E0] font-['Quantico'] mr-2">Cards:</span>
<span className="text-[#00F5FF] font-['Quantico']">{player.cards.length}</span>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
{/* Player cards */}
<div className="mt-6">
<h3 className="text-[#00F5FF] font-['Orbitron'] mb-4">Your Cards</h3>
<div className="flex justify-center overflow-x-auto py-4">
<div className="flex space-x-4">
{player.cards.map((card, index) => (
<TooltipProvider key={card.id}>
<Tooltip>
<TooltipTrigger asChild>
<div
className={`card-container perspective-800 ${currentTurn === 'player' && player.energy > 0 ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
onClick={() => currentTurn === 'player' && player.energy > 0 && playCard(card)}
style={{
transform: `translateY(${Math.sin(index * 0.5) * 10}px) rotate(${(index - (player.cards.length - 1) / 2) * 5}deg)`,
transformOrigin: 'bottom center',
transition: 'transform 0.3s ease'
}}
>
<div className="card-inner transform-style-3d hover:scale-105 transition-transform duration-300">
<div className="card-front">
<div className={`bg-[#1E1E2F] rounded-lg overflow-hidden border-2 ${currentTurn === 'player' && player.energy > 0 ? 'border-[#00F5FF]/50 hover:border-[#00F5FF]' : 'border-[#E0E0E0]/30'} h-[240px] w-[180px] shadow-lg ${currentTurn === 'player' && player.energy > 0 ? 'shadow-[#00F5FF]/10 hover:shadow-[#00F5FF]/30' : 'shadow-[#E0E0E0]/10'}`}>
<div className="h-[60%] overflow-hidden">
<img
src={card.imageUrl}
alt={card.name}
className="w-full h-full object-cover object-top"
/>
</div>
<div className="p-3 h-[40%]">
<div className="flex justify-between items-center mb-1">
<h3 className="text-[#00F5FF] font-['Orbitron'] text-sm">{card.name}</h3>
<span className="text-[#FFC857] font-['Quantico'] text-xs">{card.rarity}</span>
</div>
<div className="flex justify-between mb-1">
<span className="text-[#FF00D4] font-['Quantico'] text-sm">ATK: {card.attack}</span>
<span className="text-[#00F5FF] font-['Quantico'] text-sm">DEF: {card.defense}</span>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-xs line-clamp-2">{card.description}</p>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
</TooltipTrigger>
<TooltipContent className="bg-[#1E1E2F] border border-[#00F5FF]/30 p-4 max-w-xs">
<h4 className="text-[#00F5FF] font-['Orbitron'] mb-2">{card.name}</h4>
<p className="text-[#E0E0E0] font-['Poppins'] text-sm mb-2">{card.description}</p>
<div className="flex justify-between text-sm">
<span className="text-[#FF00D4] font-['Quantico']">ATK: {card.attack}</span>
<span className="text-[#00F5FF] font-['Quantico']">DEF: {card.defense}</span>
<span className="text-[#FFC857] font-['Quantico']">{card.element}</span>
</div>
</TooltipContent>
</Tooltip>
</TooltipProvider>
))}
</div>
</div>
</div>
</div>
{/* Side panel */}
<div className="w-full md:w-1/4 space-y-6">
{/* Battle log */}
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg border border-[#00F5FF]/20 h-[300px] flex flex-col">
<div className="p-3 border-b border-[#00F5FF]/20">
<h3 className="text-[#00F5FF] font-['Orbitron']">Battle Log</h3>
</div>
<ScrollArea className="flex-grow p-3" ref={battleLogRef}>
<div className="space-y-2 font-['Poppins']">
{battleLog.map((log, index) => (
<div key={index} className="text-sm text-[#E0E0E0]/90 pb-2 border-b border-[#00F5FF]/10 last:border-b-0">
{log}
</div>
))}
</div>
</ScrollArea>
</div>
{/* Stats chart */}
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg border border-[#00F5FF]/20 p-4">
<h3 className="text-[#00F5FF] font-['Orbitron'] mb-4">Battle Stats</h3>
<div ref={statsChartRef} style={{ width: '100%', height: '300px' }}></div>
</div>
{/* Card details */}
{selectedCard && (
<div className="bg-[#1E1E2F]/50 backdrop-blur-md rounded-lg border border-[#00F5FF]/20 p-4">
<h3 className="text-[#00F5FF] font-['Orbitron'] mb-4">Selected Card</h3>
<div className="space-y-2 font-['Poppins']">
<p className="text-[#E0E0E0]"><span className="text-[#00F5FF]">Name:</span> {selectedCard.name}</p>
<p className="text-[#E0E0E0]"><span className="text-[#00F5FF]">Element:</span> {selectedCard.element}</p>
<p className="text-[#E0E0E0]"><span className="text-[#00F5FF]">Rarity:</span> {selectedCard.rarity}</p>
<p className="text-[#E0E0E0]"><span className="text-[#00F5FF]">Description:</span> {selectedCard.description}</p>
<div className="pt-2 flex justify-between">
<div>
<p className="text-[#FF00D4] font-['Quantico'] text-sm">Attack</p>
<p className="text-[#E0E0E0] font-['Orbitron']">{selectedCard.attack}</p>
</div>
<div>
<p className="text-[#00F5FF] font-['Quantico'] text-sm">Defense</p>
<p className="text-[#E0E0E0] font-['Orbitron']">{selectedCard.defense}</p>
</div>
</div>
</div>
</div>
)}
</div>
</div>
</div>
<style jsx>{`
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(0) rotate(-1deg); }
  75% { transform: translateY(10px) rotate(1deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.3); }
  50% { box-shadow: 0 0 30px rgba(0,245,255,0.5); }
}

.card-container {
  animation: float 6s ease-in-out infinite;
}

.card-front {
  animation: glow 3s ease-in-out infinite;
}
.perspective-800 {
perspective: 800px;
}
.transform-style-3d {
transform-style: preserve-3d;
}
.backface-hidden {
backface-visibility: hidden;
}
`}</style>
</div>
);
const renderVictory = () => (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0C0C1D] to-[#23234A]">
<div className="absolute inset-0 overflow-hidden">
{/* Victory particles */}
{[...Array(50)].map((_, i) => (
<div
key={i}
className="absolute rounded-full"
style={{
width: `${Math.random() * 20 + 5}px`,
height: `${Math.random() * 20 + 5}px`,
backgroundColor: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF00D4' : '#FFC857',
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
opacity: Math.random() * 0.7 + 0.3,
boxShadow: `0 0 ${Math.random() * 10 + 5}px ${i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#FF00D4' : '#FFC857'}`,
animation: `float ${Math.random() * 10 + 5}s linear infinite`
}}
/>
))}
</div>
<div className="relative z-10 text-center p-8 bg-[#1E1E2F]/70 backdrop-blur-xl rounded-lg border border-[#00F5FF]/30 max-w-2xl">
<h2 className="text-6xl font-['Exo'] font-bold text-[#00F5FF] mb-6 animate-pulse">VICTORY</h2>
<p className="text-2xl text-[#E0E0E0] font-['Rajdhani'] mb-8">You have defeated your opponent!</p>
<div className="flex justify-center mb-10">
<div className="card-container perspective-1200 p-2 relative group">
{/* Animated card glow effect */}
<div className="absolute -inset-4 bg-gradient-to-r from-[#FFC857] via-[#FFD700] to-[#FFA500] opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
{/* Floating particles around card */}
<div className="absolute -inset-10 z-0">
{[...Array(15)].map((_, i) => (
<div
key={i}
className="absolute w-2 h-2 rounded-full"
style={{
backgroundColor: i % 2 === 0 ? '#FFC857' : '#FFD700',
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
animation: `floatParticle ${Math.random() * 3 + 2}s ease-in-out infinite`,
opacity: 0.6,
}}
></div>
))}
</div>
<div className={`card-inner transition-all duration-700 transform-style-3d relative z-10 ${reducedMotion ? 'hover:scale-105' : 'group-hover:rotate-y-180'}`}>
<div className="card-front absolute w-full h-full backface-hidden">
<div className="bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#FFC857] h-[400px] w-[300px] shadow-[0_0_30px_rgba(255,200,87,0.3)] transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(255,200,87,0.5)]">
<div className="relative h-[60%] overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2F] to-transparent z-10"></div>
<img
src="https://readdy.ai/api/search-image?query=legendary%20futuristic%20trophy%20with%20glowing%20golden%20and%20blue%20energy%2C%20cyberpunk%20style%2C%20dark%20background%20with%20golden%20accents%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20reward%20concept%20art&width=300&height=400&seq=13&orientation=portrait"
alt="Victory Reward"
className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-110"
/>
<div className="absolute top-4 right-4 flex items-center space-x-2 bg-[#1E1E2F]/80 px-3 py-1 rounded-full border border-[#FFC857]/30">
<i className="fas fa-crown text-[#FFC857]"></i>
<span className="text-[#FFC857] font-['Quantico'] text-sm">Legendary</span>
</div>
</div>
<div className="p-6 h-[40%] relative">
<div className="absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[#1E1E2F]"></div>
<h3 className="text-[#FFC857] font-['Orbitron'] text-2xl mb-3 bg-gradient-to-r from-[#FFC857] to-[#FFD700] bg-clip-text text-transparent">Victory Trophy</h3>
<div className="flex space-x-4 mb-4">
<div className="flex-1 bg-[#1E1E2F]/50 rounded-lg p-2 border border-[#FF00D4]/30">
<span className="text-[#FF00D4] font-['Quantico'] text-sm block">Experience</span>
<span className="text-[#FF00D4] font-['Orbitron'] text-lg">+500 XP</span>
</div>
<div className="flex-1 bg-[#1E1E2F]/50 rounded-lg p-2 border border-[#00F5FF]/30">
<span className="text-[#00F5FF] font-['Quantico'] text-sm block">Rank Points</span>
<span className="text-[#00F5FF] font-['Orbitron'] text-lg">+50 RP</span>
</div>
</div>
<p className="text-[#E0E0E0] font-['Poppins'] text-sm leading-relaxed">A symbol of your victory in the cyber arena.</p>
</div>
</div>
</div>
<div className="card-back absolute w-full h-full backface-hidden rotate-y-180">
<div className="bg-[#1E1E2F] rounded-lg overflow-hidden border-2 border-[#FFC857] h-[400px] w-[300px] shadow-[0_0_30px_rgba(255,200,87,0.3)] p-8 flex flex-col justify-between">
<div>
<div className="flex items-center space-x-3 mb-6">
<i className="fas fa-trophy text-3xl text-[#FFC857]"></i>
<h3 className="text-[#FFC857] font-['Orbitron'] text-2xl bg-gradient-to-r from-[#FFC857] to-[#FFD700] bg-clip-text text-transparent">Victory Trophy</h3>
</div>
<div className="space-y-6">
<div className="bg-[#1E1E2F]/50 rounded-lg p-4 border border-[#FFC857]/30">
<p className="text-[#E0E0E0] font-['Poppins'] leading-relaxed">This legendary trophy is awarded to champions of the cyber arena who demonstrate exceptional skill and strategic mastery.</p>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="bg-[#1E1E2F]/50 rounded-lg p-3 border border-[#FF00D4]/30">
<i className="fas fa-star-half-alt text-[#FF00D4] mb-2"></i>
<p className="text-[#E0E0E0] font-['Quantico'] text-sm">Rarity Level</p>
<p className="text-[#FF00D4] font-['Orbitron']">Legendary</p>
</div>
<div className="bg-[#1E1E2F]/50 rounded-lg p-3 border border-[#00F5FF]/30">
<i className="fas fa-chart-line text-[#00F5FF] mb-2"></i>
<p className="text-[#E0E0E0] font-['Quantico'] text-sm">Victory Count</p>
<p className="text-[#00F5FF] font-['Orbitron']">#1</p>
</div>
</div>
</div>
</div>
<div className="border-t border-[#FFC857]/20 pt-4">
<div className="flex justify-between items-center">
<div>
<p className="text-[#E0E0E0] font-['Quantico'] text-sm">Collection ID</p>
<p className="text-[#FFC857] font-['Share Tech Mono'] text-xs">#V-2025-001</p>
</div>
<div className="flex space-x-2">
<i className="fas fa-share-alt text-[#FFC857] hover:text-[#FFD700] cursor-pointer transition-colors"></i>
<i className="fas fa-heart text-[#FF00D4] hover:text-[#FF33D4] cursor-pointer transition-colors"></i>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<style jsx>{`
@keyframes floatParticle {
0%, 100% {
transform: translateY(0) translateX(0);
}
50% {
transform: translateY(-20px) translateX(10px);
}
}
`}</style>
</div>
<Button
onClick={restartGame}
className="bg-gradient-to-r from-[#FFC857] to-[#FF8A00] hover:from-[#FFC857] hover:to-[#FF6D00] text-[#0C0C1D] font-['Orbitron'] text-xl px-10 py-6 rounded-full shadow-lg shadow-[#FFC857]/20 transition-all duration-300 hover:scale-105 !rounded-button cursor-pointer whitespace-nowrap"
>
PLAY AGAIN
</Button>
</div>
<style jsx>{`
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(0) rotate(-1deg); }
  75% { transform: translateY(10px) rotate(1deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.3); }
  50% { box-shadow: 0 0 30px rgba(0,245,255,0.5); }
}

.card-container {
  animation: float 6s ease-in-out infinite;
}

.card-front {
  animation: glow 3s ease-in-out infinite;
}
@keyframes rotate-y {
0% {
transform: rotateY(0deg);
}
100% {
transform: rotateY(360deg);
}
}
.animate-rotate-y {
animation: rotate-y 10s linear infinite;
}
.perspective-800 {
perspective: 800px;
}
.transform-style-3d {
transform-style: preserve-3d;
}
.backface-hidden {
backface-visibility: hidden;
}
.rotate-y-180 {
transform: rotateY(180deg);
}
`}</style>
</div>
);
const renderDefeat = () => (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0C0C1D] to-[#23234A]">
<div className="absolute inset-0 overflow-hidden">
<div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=futuristic%20digital%20grid%20with%20broken%20circuits%20and%20glitching%20red%20error%20messages%2C%20cyberpunk%20style%2C%20dark%20background%20with%20red%20warning%20lights%2C%20digital%20art%2C%20highly%20detailed%2C%20professional%20lighting%2C%20sci-fi%20defeat%20concept&width=1440&height=900&seq=14&orientation=landscape')] bg-cover bg-center opacity-20"></div>
</div>
<div className="relative z-10 text-center p-8 bg-[#1E1E2F]/70 backdrop-blur-xl rounded-lg border border-[#FF00D4]/30 max-w-2xl">
<h2 className="text-6xl font-['Exo'] font-bold text-[#FF00D4] mb-6 animate-pulse">DEFEAT</h2>
<p className="text-2xl text-[#E0E0E0] font-['Rajdhani'] mb-8">Your health has reached zero!</p>
<div className="mb-10">
<p className="text-[#E0E0E0] font-['Poppins'] mb-6">Don't give up! Analyze your strategy and try again.</p>
<div className="flex justify-center space-x-6">
<div className="text-center">
<div className="w-20 h-20 rounded-full bg-[#1E1E2F] border-2 border-[#FF00D4]/50 flex items-center justify-center mb-2">
<i className="fas fa-heartbeat text-3xl text-[#FF00D4]"></i>
</div>
<p className="text-[#E0E0E0] font-['Quantico']">Health</p>
<p className="text-[#FF00D4] font-['Orbitron']">0</p>
</div>
<div className="text-center">
<div className="w-20 h-20 rounded-full bg-[#1E1E2F] border-2 border-[#00F5FF]/50 flex items-center justify-center mb-2">
<i className="fas fa-bolt text-3xl text-[#00F5FF]"></i>
</div>
<p className="text-[#E0E0E0] font-['Quantico']">Energy</p>
<p className="text-[#00F5FF] font-['Orbitron']">{player.energy}</p>
</div>
<div className="text-center">
<div className="w-20 h-20 rounded-full bg-[#1E1E2F] border-2 border-[#FFC857]/50 flex items-center justify-center mb-2">
<i className="fas fa-layer-group text-3xl text-[#FFC857]"></i>
</div>
<p className="text-[#E0E0E0] font-['Quantico']">Cards</p>
<p className="text-[#FFC857] font-['Orbitron']">{player.cards.length}</p>
</div>
</div>
</div>
<Button
onClick={restartGame}
className="bg-gradient-to-r from-[#FF00D4] to-[#8A00FF] hover:from-[#FF00D4] hover:to-[#6D00FF] text-[#E0E0E0] font-['Orbitron'] text-xl px-10 py-6 rounded-full shadow-lg shadow-[#FF00D4]/20 transition-all duration-300 hover:scale-105 !rounded-button cursor-pointer whitespace-nowrap"
>
TRY AGAIN
</Button>
</div>
</div>
);
return (
<div className="min-h-screen bg-[#0C0C1D] overflow-x-hidden">
{gameState === 'intro' && renderIntro()}
{gameState === 'battle' && renderBattle()}
{gameState === 'victory' && renderVictory()}
{gameState === 'defeat' && renderDefeat()}
</div>
);
};
export default App

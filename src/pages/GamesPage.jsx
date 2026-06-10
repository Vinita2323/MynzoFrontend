import React, { useState } from 'react';
import { Compass, HelpCircle, Layers, MapPin, Trophy, X, Coins, Gift, Sparkles, CheckCircle2, AlertCircle, ChevronLeft, Bell, Heart, ShoppingCart, Home, Grid, Camera, User, Gamepad2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Import Games Overlays
import SnakeGame from '../components/games/SnakeGame';
import SpeedTapGame from '../components/games/SpeedTap/SpeedTapGame';
import TicTacToeGame from '../components/games/TicTacToe/TicTacToeGame';
import QuizGame from '../components/games/QuizGame/QuizGame';

// Import Icons
import giftBoxImg from '../assets/GamesIcons/gift_box.png';
import speedTapImg from '../assets/GamesIcons/speed_tap.png';
import snakeImg from '../assets/GamesIcons/snake.png';
import ticTacToeImg from '../assets/GamesIcons/tic_tac_toe.png';
import quizImg from '../assets/GamesIcons/quiz.png';
import spinImg from '../assets/GamesIcons/spin.png';
import bubblePopImg from '../assets/GamesIcons/bubble_pop.png';
import categoryForUImg from '../assets/CategorySection/categoryForU-removebg-preview.png';
import category7Img from '../assets/CategorySection/Category7-removebg-preview.png';

export default function GamesPage() {
  const navigate = useNavigate();
  const { coins, addCoins } = useApp();
  
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'all'
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Game Overlay State
  const [activeGame, setActiveGame] = useState(null); // 'spin' | 'quiz' | 'scratch' | 'treasure' | 'speedTap' | 'ticTacToe' | 'snake' | null
  const [gameFeedback, setGameFeedback] = useState(null);

  // Spin Game State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);

  // Scratch State
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);

  // Treasure State
  const [openedChest, setOpenedChest] = useState(null);
  const chests = [
    { id: 1, reward: 75, label: "Golden Chest" },
    { id: 2, reward: 200, label: "Ruby Chest" },
    { id: 3, reward: 20, label: "Bronze Chest" }
  ];

  const handleOpenGame = (gameId) => {
    setGameFeedback(null);
    setScratchedPercent(0);
    setOpenedChest(null);
    setActiveGame(gameId);
  };

  const handleInvite = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Mynzo',
          text: 'Come play games and win rewards on Mynzo!',
          url: window.location.origin
        });
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  // Spin & Win logic
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setGameFeedback(null);

    const randomRotations = 5 + Math.floor(Math.random() * 5); // 5 to 10 full turns
    const sectorAngle = 72; // 5 sectors of 72 degs (Total 360)
    const prizes = [
      { name: "50 Coins", value: 50 },
      { name: "100 Coins", value: 100 },
      { name: "Try Again", value: 0 },
      { name: "20 Coins", value: 20 },
      { name: "150 Coins", value: 150 }
    ];

    const chosenSector = Math.floor(Math.random() * prizes.length);
    const targetAngle = spinAngle + (randomRotations * 360) + (chosenSector * sectorAngle);

    setSpinAngle(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = prizes[chosenSector];
      if (wonPrize.value > 0) {
        addCoins(wonPrize.value);
        setGameFeedback({
          success: true,
          msg: `Congratulations! You won ${wonPrize.name}! 🎉`,
          amount: wonPrize.value
        });
      } else {
        setGameFeedback({
          success: false,
          msg: "Ah! Better luck next time. Don't worry, try again tomorrow!",
          amount: 0
        });
      }
    }, 4000);
  };

  // Scratch logic
  const handleScratch = () => {
    if (scratchedPercent >= 100) return;
    setIsScratching(true);
    setTimeout(() => {
      setScratchedPercent(100);
      setIsScratching(false);
      addCoins(75);
      setGameFeedback({
        success: true,
        msg: "Fantastic! You revealed and earned 75 Coins! 🌟",
        amount: 75
      });
    }, 1500);
  };

  // Treasure Hunt logic
  const handleChestClick = (chest) => {
    if (openedChest !== null) return;
    setOpenedChest(chest.id);
    addCoins(chest.reward);
    setGameFeedback({
      success: true,
      msg: `Excellent choice! The ${chest.label} revealed +${chest.reward} Coins! 🗝️`,
      amount: chest.reward
    });
  };

  const ALL_GAMES = [
    { id: 'speedTap', title: 'Speed Tap', desc: 'Tap as fast as you can in 10 seconds', tags: 'Win • Coins • Coupons', icon: speedTapImg, badge: '🔥' },
    { id: 'snake', title: 'Snake & Chase', desc: 'Eat more, grow longer, beat your high score!', tags: 'Win • Coins', icon: snakeImg },
    { id: 'ticTacToe', title: 'Tic Tac Toe', desc: 'Challenge your brain. Win exciting rewards!', tags: 'Win • Coins • Coupons', icon: ticTacToeImg },
    { id: 'quiz', title: 'Quiz Game', desc: 'Answer smart, win more every day!', tags: 'Win • Coins • Coupons', icon: quizImg }
  ];

  const renderHomeView = () => (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#FFF6F2]">
      {/* Playground Header */}
      <div className="flex items-center justify-between px-5 py-2.5 sticky top-0 bg-orange-100 border-b-2 border-[#EE4923]/20 backdrop-blur-md z-20 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
          <ChevronLeft className="w-6 h-6 text-[#071226]" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black text-[#071226] uppercase tracking-tighter leading-none">PLAYGROUND <span className="text-amber-400">✦</span></h1>
          <p className="text-[10px] font-medium text-slate-600 mt-0.5">Play Games, Win Rewards!</p>
        </div>
        <div className="w-6 h-6"></div>
      </div>

      <div className="px-5 mt-2 space-y-6">

        {/* Wallet Card */}
        <div className="relative w-full h-44 rounded-2xl p-5 text-white overflow-hidden shadow-lg"
             style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #EE4923 100%)' }}>
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between w-1/2">
            <div>
              <p className="text-sm font-bold opacity-90">My Coins</p>
              <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1">Balance</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white/30 shadow-inner">
                  <span className="text-[10px] font-black text-amber-900">M</span>
                </div>
                <span className="text-3xl font-black">{coins}</span>
              </div>
            </div>
            <button className="bg-white text-[#EE4923] text-[10px] font-black px-4 py-1.5 rounded-full w-max shadow-md flex items-center gap-1 active:scale-95 transition-transform">
              My Wallet <ChevronLeft className="w-3 h-3 rotate-180" />
            </button>
          </div>

          <div className="absolute bottom-[-10px] right-[-20px] w-48 h-48 z-10 pointer-events-none">
            <img src={categoryForUImg} alt="Gift Box" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
        </div>

        {/* Fun Zone Section */}
        {/* Top Games Section */}
        <div>
          <h2 className="text-xl font-black text-[#071226] mb-4">Top Games</h2>

          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'speedTap', icon: speedTapImg, title: 'Speed Tap' },
              { id: 'snake', icon: snakeImg, title: 'Snake & Chase' },
              { id: 'ticTacToe', icon: ticTacToeImg, title: 'Tic Tac Toe' },
              { id: 'quiz', icon: quizImg, title: 'Quiz Game' }
            ].map(game => (
              <div key={game.id} onClick={() => handleOpenGame(game.id)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 p-1 overflow-hidden">
                  <img src={game.icon} alt={game.title} className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">{game.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-[#071226] text-sm flex items-center gap-1">🔥 Daily Streak</h3>
            <span className="text-[#EE4923] font-bold text-xs">2 Days</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mb-4">Play daily & win more coins</p>
          
          <div className="flex justify-between relative">
            <div className="absolute top-3 left-0 w-full h-[2px] bg-slate-100 z-0"></div>
            <div className="absolute top-3 left-0 w-[30%] h-[2px] bg-[#EE4923] z-0"></div>
            
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day <= 3;
              const isGift = day === 4 || day === 7;
              return (
                <div key={day} className="flex flex-col items-center gap-1.5 relative z-10 bg-white">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    isPast 
                      ? 'bg-[#EE4923] text-white' 
                      : isGift 
                        ? 'bg-amber-100 text-amber-500' 
                        : 'bg-slate-100 text-transparent'
                  }`}>
                    {isPast ? '✓' : isGift ? <Gift className="w-3 h-3" /> : ''}
                  </div>
                  <span className="text-[8px] font-medium text-slate-500">Day {day}</span>
                </div>
              );
            })}
          </div>
        </div>



        {/* Invite Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl py-6 px-4 flex items-center justify-between border border-orange-200 shadow-sm mb-6 relative overflow-hidden">
          <div className="absolute left-[-10px] top-[-10px] w-28 h-28 opacity-30 pointer-events-none">
             <img src={categoryForUImg} alt="Gift" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-3 relative z-10 ml-6">
            <div>
              <h4 className="font-black text-[#071226] text-[15px]">Invite Friends</h4>
              <p className="text-xs text-[#EE4923] font-bold mt-0.5">& Earn 100 Coins</p>
            </div>
          </div>
          <button onClick={handleInvite} className="bg-[#EE4923] text-white text-xs font-black px-5 py-2.5 rounded-full shadow-md active:scale-95 transition-transform z-10 relative">
            Invite Now
          </button>

        </div>
      </div>
    </div>
  );

  const renderAllGamesView = () => (
    <div className="flex-1 flex flex-col bg-[#FFF6F2]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-4 sticky top-0 bg-[#FFF6F2]/90 backdrop-blur-md z-20">
        <button onClick={() => setCurrentView('home')} className="p-2 -ml-2 rounded-full hover:bg-black/5">
          <ChevronLeft className="w-6 h-6 text-[#071226]" />
        </button>
        <h1 className="text-xl font-black text-[#071226]">All Games</h1>
        <div className="grid grid-cols-4 gap-1 opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-slate-800 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {['All', 'Trending', 'Puzzle', 'Arcade', 'Action'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${
                activeCategory === cat 
                  ? 'bg-[#EE4923] text-white' 
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {ALL_GAMES.map(game => (
          <div key={game.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
            <div className="w-[84px] h-[84px] rounded-[1.5rem] p-1 flex-shrink-0 relative overflow-hidden bg-slate-50 border border-slate-100">
              <img src={game.icon} alt={game.title} className="w-full h-full object-cover rounded-xl" />
              {game.badge && (
                <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md">
                  <span className="text-[10px]">{game.badge}</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-black text-[#071226] text-[15px] mb-1">{game.title}</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight pr-4 mb-2">{game.desc}</p>
              <p className="text-[9px] font-bold text-[#EE4923]">{game.tags}</p>
            </div>
            
            <button 
              onClick={() => handleOpenGame(game.id)}
              className="bg-[#EE4923] text-white text-[11px] font-black px-5 py-2.5 rounded-full shadow-[0_5px_15px_rgba(238,73,35,0.2)] active:scale-95 transition-transform flex-shrink-0"
            >
              Play
            </button>
          </div>
        ))}

        {/* Promo Footer */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-[2rem] p-5 border border-orange-100 shadow-sm mt-8 relative overflow-hidden flex justify-between items-center">
          <div className="relative z-10 w-2/3">
            <h4 className="font-black text-[#071226] text-base mb-1">Play Daily & Win Big!</h4>
            <p className="text-[10px] text-slate-600 font-medium mb-3">Complete games and collect bonuses every day.</p>
            <button className="bg-[#EE4923] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-md active:scale-95 transition-transform w-max">
              Explore Rewards
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 pointer-events-none z-0">
             <img src={giftBoxImg} alt="Gift" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#FFF6F2] relative font-sans">
      
      {currentView === 'home' ? renderHomeView() : renderAllGamesView()}



      {/* Game Overlays */}
      {/* Spinner Wheel Game Overlay */}
      {activeGame === 'spin' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-scale-up space-y-6">
            <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center justify-center gap-1.5">
                🎡 Spin & Win
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Spin and win exciting gift coins!</p>
            </div>

            {/* Spinner Component */}
            <div className="flex items-center justify-center py-4 relative">
              {/* Spinner Pointer arrow */}
              <div className="absolute top-0 z-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-red-600 drop-shadow-sm"></div>
              
              <div 
                className="w-48 h-48 rounded-full border-4 border-slate-100 shadow-xl relative overflow-hidden transition-transform ease-out"
                style={{
                  transform: `rotate(${spinAngle}deg)`,
                  transitionDuration: isSpinning ? '4s' : '0.5s',
                  background: 'conic-gradient(#FDA4AF 0% 20%, #FECDD3 20% 40%, #FFE4E6 40% 60%, #FDA4AF 60% 80%, #FECDD3 80% 100%)'
                }}
              >
                {/* Sector Text Items */}
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#0F172A]">
                  <span className="absolute translate-y-[-70px]">50 Coins</span>
                  <span className="absolute translate-x-[64px] rotate-[72deg]">100 Coins</span>
                  <span className="absolute translate-x-[40px] translate-y-[52px] rotate-[144deg]">Try Again</span>
                  <span className="absolute translate-x-[-40px] translate-y-[52px] rotate-[216deg]">20 Coins</span>
                  <span className="absolute translate-x-[-64px] rotate-[288deg]">150 Coins</span>
                </div>
                <div className="absolute inset-12 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-inner">
                  <Coins className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-3 rounded-2xl font-black text-xs transition-all duration-300 ${
                isSpinning
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#ee4923] hover:bg-orange-600 text-white active:scale-95 shadow-md shadow-orange-500/20'
              }`}
            >
              {isSpinning ? "SPINNING..." : "TAP TO SPIN"}
            </button>

            {gameFeedback && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 border animate-fade-in ${
                gameFeedback.success ? 'bg-emerald-50 border-emerald-100 text-emerald-950' : 'bg-rose-50 border-rose-100 text-rose-950'
              }`}>
                {gameFeedback.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                <p className="text-[11px] font-bold leading-normal">{gameFeedback.msg}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scratch Card Overlay */}
      {activeGame === 'scratch' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-scale-up space-y-6">
            <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center justify-center gap-1.5">
                ✨ Scratch Card
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Scratch the silver film to see what's inside!</p>
            </div>

            {/* Interactive Scratch Area */}
            <div className="flex justify-center py-2">
              <div 
                onClick={handleScratch}
                className="w-48 h-48 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner cursor-pointer"
              >
                {scratchedPercent < 100 ? (
                  <div className={`absolute inset-0 bg-slate-300 flex flex-col items-center justify-center transition-opacity duration-500 ${isScratching ? 'opacity-40' : 'opacity-100'}`}>
                    <Layers className="w-10 h-10 text-slate-400 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-widest">TAP TO SCRATCH</span>
                  </div>
                ) : null}

                <Sparkles className="w-12 h-12 text-[#ee4923] animate-bounce" />
                <h4 className="text-sm font-black text-[#0F172A] mt-2">75 COINS</h4>
                <p className="text-[9px] text-[#ee4923] font-bold">Credited to wallet!</p>
              </div>
            </div>

            {gameFeedback && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-4 rounded-2xl flex items-start gap-3 border animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-[11px] font-bold leading-normal">{gameFeedback.msg}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Treasure Hunt Overlay */}
      {activeGame === 'treasure' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-scale-up space-y-6">
            <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center justify-center gap-1.5">
                🏴‍☠️ Treasure Hunt
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Pick a chest to reveal your reward!</p>
            </div>

            <div className="grid grid-cols-3 gap-3 py-4">
              {chests.map(chest => (
                <div 
                  key={chest.id}
                  onClick={() => handleChestClick(chest)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    openedChest === chest.id 
                      ? 'bg-amber-100 border-2 border-amber-400 scale-105 shadow-md' 
                      : openedChest !== null 
                        ? 'bg-slate-50 opacity-50 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-95 shadow-inner'
                  }`}
                >
                  <Gift className={`w-8 h-8 mb-1 ${openedChest === chest.id ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
                  {openedChest === chest.id && <span className="text-[10px] font-black text-amber-600">+{chest.reward}</span>}
                </div>
              ))}
            </div>

            {gameFeedback && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-4 rounded-2xl flex items-start gap-3 border animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-[11px] font-bold leading-normal">{gameFeedback.msg}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bubble Pop Overlay (Coming Soon Placeholder) */}
      {activeGame === 'bubblePop' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative shadow-2xl animate-scale-up text-center">
             <button onClick={() => setActiveGame(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <img src={bubblePopImg} alt="Bubble Pop" className="w-16 h-16 object-contain" />
            </div>
            <h3 className="text-xl font-black text-[#071226] mb-2">Bubble Pop!</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">This game is currently in development. Check back soon!</p>
            <button onClick={() => setActiveGame(null)} className="bg-[#EE4923] text-white font-black px-6 py-3 rounded-full w-full">Got It</button>
          </div>
        </div>
      )}

      {/* Dedicated Full Screen Game Overlays */}
      {activeGame === 'snake' && <SnakeGame onClose={() => setActiveGame(null)} addCoins={addCoins} />}
      {activeGame === 'speedTap' && <SpeedTapGame onClose={() => setActiveGame(null)} addCoins={addCoins} />}
      {activeGame === 'ticTacToe' && <TicTacToeGame onClose={() => setActiveGame(null)} addCoins={addCoins} />}
      {activeGame === 'quiz' && <QuizGame onClose={() => setActiveGame(null)} addCoins={addCoins} />}

    </div>
  );
}

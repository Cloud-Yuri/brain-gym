"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, ArrowLeft, Coins, Sparkles, RotateCcw } from "lucide-react";
import Link from "next/link";

const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "🎰", "💰"];
const weights = [30, 25, 20, 15, 5, 3, 1.5, 0.5]; // Probabilidades

const getRandomSymbol = () => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < symbols.length; i++) {
    random -= weights[i];
    if (random <= 0) return symbols[i];
  }
  return symbols[0];
};

const checkWin = (reels: string[]) => {
  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    // Jackpot! 3 iguais
    const multipliers: Record<string, number> = {
      "💰": 50, "🎰": 30, "7️⃣": 20, "💎": 15,
      "🍇": 10, "🍊": 8, "🍋": 5, "🍒": 3
    };
    return { win: true, type: "jackpot", multiplier: multipliers[reels[0]] || 2 };
  }
  if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
    // 2 iguais
    return { win: true, type: "pair", multiplier: 2 };
  }
  return { win: false, type: "none", multiplier: 0 };
};

export default function SlotPage() {
  const [reels, setReels] = useState(["🎰", "🎰", "🎰"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [showWin, setShowWin] = useState(false);

  const spin = useCallback(() => {
    if (isSpinning || credits < bet) return;

    setIsSpinning(true);
    setCredits(prev => prev - bet);
    setShowWin(false);

    // Animação de rotação
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setReels([
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
      ]);
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        finalizeSpin();
      }
    }, 100);
  }, [isSpinning, credits, bet]);

  const finalizeSpin = () => {
    const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    setReels(finalReels);
    
    const result = checkWin(finalReels);
    if (result.win) {
      const winAmount = bet * result.multiplier;
      setCredits(prev => prev + winAmount);
      setLastWin(winAmount);
      setShowWin(true);
      setHistory(prev => [`Ganhou ${winAmount} 🎉`, ...prev].slice(0, 5));
    } else {
      setHistory(prev => [`Perdeu ${bet} 😢`, ...prev].slice(0, 5));
    }
    
    setIsSpinning(false);
  };

  const addCredits = () => {
    setCredits(prev => prev + 50);
    setHistory(prev => ["+50 créditos 💰", ...prev].slice(0, 5));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Dices className="w-8 h-8" />
            Slot Machine
          </h1>
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-yellow-400">{credits}</span>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="glass-card p-8 mb-6">
          {/* Reels */}
          <div className="flex justify-center gap-4 mb-8">
            {reels.map((symbol, idx) => (
              <motion.div
                key={idx}
                animate={isSpinning ? {
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
                className={`
                  w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-5xl md:text-6xl
                  ${isSpinning ? "bg-slate-700" : "bg-gradient-to-br from-slate-800 to-slate-700"}
                  border-4 ${showWin && !isSpinning ? "border-yellow-400 shadow-lg shadow-yellow-400/50" : "border-slate-600"}
                  shadow-inner
                `}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          {/* Win Message */}
          <AnimatePresence>
            {showWin && !isSpinning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-center mb-6"
              >
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  🎉 JACKPOT! 🎉
                </div>
                <div className="text-2xl text-white">
                  +{lastWin} créditos!
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="space-y-4">
            {/* Bet Selector */}
            <div className="flex justify-center gap-2">
              {[5, 10, 25, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  disabled={isSpinning}
                  className={`
                    px-4 py-2 rounded-xl font-bold transition-all
                    ${bet === amount 
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" 
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"}
                    ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Spin Button */}
            <button
              onClick={spin}
              disabled={isSpinning || credits < bet}
              className={`
                w-full py-4 rounded-xl font-bold text-xl transition-all
                ${isSpinning || credits < bet
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/50 active:scale-95"}
              `}
            >
              {isSpinning ? "GIRANDO..." : credits < bet ? "SEM CRÉDITOS" : "PUXAR ALAVANCA! 🎰"}
            </button>

            {/* Add Credits */}
            {credits < bet && (
              <button
                onClick={addCredits}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Recarregar +50 créditos
              </button>
            )}
          </div>
        </div>

        {/* History */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Histórico
          </h3>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Nenhuma jogada ainda</p>
            ) : (
              history.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`
                    p-3 rounded-xl text-sm font-medium
                    ${item.includes("Ganhou") ? "bg-green-500/20 text-green-400" : 
                      item.includes("créditos") ? "bg-blue-500/20 text-blue-400" : 
                      "bg-red-500/20 text-red-400"}
                  `}
                >
                  {item}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-slate-500 text-sm">
          <p>💰 Jackpot (3 iguais) = Multiplicador de prêmio</p>
          <p>🎲 2 iguais = 2x aposta</p>
        </div>
      </motion.div>
    </div>
  );
}
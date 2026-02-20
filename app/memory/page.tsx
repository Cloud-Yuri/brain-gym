"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import Link from "next/link";

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const emojis = ["🚀", "💻", "🎮", "🤖", "⚡", "🔥", "💡", "🎯"];

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id: number) => {
    if (isLocked || flippedCards.includes(id) || cards[id].isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true } 
              : card
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

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
            <Brain className="w-8 h-8" />
            Jogo da Memória
          </h1>
          <div className="text-right">
            <div className="text-slate-400 text-sm">Movimentos</div>
            <div className="text-2xl font-bold text-indigo-400">{moves}</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl text-4xl flex items-center justify-center
                transition-all duration-300
                ${card.isFlipped || card.isMatched 
                  ? "bg-slate-700 rotate-0" 
                  : "bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"}
              `}
            >
              {(card.isFlipped || card.isMatched) ? (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <span className="text-2xl">?</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={initializeGame}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Novo Jogo
          </button>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="glass-card p-8 text-center max-w-sm mx-4">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Parabéns!</h2>
              <p className="text-slate-400 mb-6">
                Você completou em <span className="text-indigo-400 font-bold">{moves}</span> movimentos!
              </p>
              <button
                onClick={initializeGame}
                className="btn-primary w-full"
              >
                Jogar Novamente
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
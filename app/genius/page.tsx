"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, Trophy, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";

type Color = "green" | "red" | "yellow" | "blue";

const colors: Color[] = ["green", "red", "yellow", "blue"];

const colorClasses = {
  green: "from-emerald-500 to-emerald-600 shadow-emerald-500/50",
  red: "from-rose-500 to-rose-600 shadow-rose-500/50",
  yellow: "from-amber-400 to-amber-500 shadow-amber-400/50",
  blue: "from-blue-500 to-blue-600 shadow-blue-500/50",
};

const colorActiveClasses = {
  green: "from-emerald-300 to-emerald-400 scale-110 brightness-150",
  red: "from-rose-300 to-rose-400 scale-110 brightness-150",
  yellow: "from-amber-200 to-amber-300 scale-110 brightness-150",
  blue: "from-blue-300 to-blue-400 scale-110 brightness-150",
};

export default function GeniusPage() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = (color: Color) => {
    if (!soundEnabled) return;
    const frequencies = { green: 329.63, red: 261.63, yellow: 392.00, blue: 493.88 };
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequencies[color];
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 150;
    oscillator.type = "sawtooth";
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const activateColor = async (color: Color) => {
    setActiveColor(color);
    playSound(color);
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveColor(null);
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const playSequence = async (seq: Color[]) => {
    setIsPlayerTurn(false);
    await new Promise(resolve => setTimeout(resolve, 800));
    for (const color of seq) {
      await activateColor(color);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsPlayerTurn(true);
  };

  const startGame = () => {
    const firstColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [firstColor];
    setSequence(newSequence);
    setPlayerSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    playSequence(newSequence);
  };

  const handleColorClick = async (color: Color) => {
    if (!isPlayerTurn || gameOver) return;

    await activateColor(color);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      playErrorSound();
      setGameOver(true);
      setIsPlaying(false);
      if (score > bestScore) setBestScore(score);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setPlayerSequence([]);
      const nextColor = colors[Math.floor(Math.random() * colors.length)];
      const newSequence = [...sequence, nextColor];
      setSequence(newSequence);
      playSequence(newSequence);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Zap className="w-8 h-8" />
            Sequência Lógica
          </h1>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        <div className="glass-card p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-slate-400 text-sm">Pontuação</div>
              <div className="text-3xl font-bold text-indigo-400">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm">Recorde</div>
              <div className="text-3xl font-bold text-violet-400">{bestScore}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            {colors.map((color) => (
              <motion.button
                key={color}
                whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
                onClick={() => handleColorClick(color)}
                disabled={!isPlayerTurn}
                className={`
                  aspect-square rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-150
                  ${activeColor === color 
                    ? colorActiveClasses[color] 
                    : colorClasses[color]}
                  ${!isPlayerTurn ? "opacity-80 cursor-not-allowed" : "hover:brightness-110 cursor-pointer"}
                `}
              />
            ))}
          </div>

          <div className="text-center">
            {!isPlaying ? (
              <button
                onClick={startGame}
                className="btn-primary text-lg px-8 py-4"
              >
                {gameOver ? "Tentar Novamente" : "Iniciar Jogo"}
              </button>
            ) : (
              <div className="text-slate-400">
                {isPlayerTurn ? "Sua vez!" : "Observe a sequência..."}
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="glass-card p-6 text-center"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="text-slate-400 mb-4">
                Você fez <span className="text-indigo-400 font-bold">{score}</span> pontos!
              </p>
              <button
                onClick={startGame}
                className="btn-secondary flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Jogar Novamente
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
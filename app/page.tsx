"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calculator, Brain, Zap, Scale, Dices } from "lucide-react";

const apps = [
  {
    id: "calculator",
    title: "Calculadora Científica",
    description: "Calculadora avançada com histórico de operações e funções matemáticas complexas.",
    icon: Calculator,
    color: "from-indigo-500 to-violet-500",
    delay: 0,
  },
  {
    id: "memory",
    title: "Jogo da Memória",
    description: "Desafie sua memória com diferentes níveis de dificuldade e modo versus IA.",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    delay: 0.1,
  },
  {
    id: "genius",
    title: "Sequência Lógica",
    description: "O clássico jogo de memória sequencial com cores e sons. Quanto consegue memorizar?",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    delay: 0.2,
  },
  {
    id: "converter",
    title: "Conversor Universal",
    description: "Converta qualquer coisa em qualquer coisa. De unidades sérias a comparações absurdas!",
    icon: Scale,
    color: "from-emerald-500 to-teal-500",
    delay: 0.3,
  },
  {
    id: "slot",
    title: "Slot Machine",
    description: "Puxe a alavanca e tente a sorte! Combine 3 símbolos para ganhar o jackpot.",
    icon: Dices,
    color: "from-amber-500 to-orange-500",
    delay: 0.4,
  },
];


export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Brain Gym</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Exercite seu cérebro com desafios interativos de lógica, matemática e diversão. 
          Quatro mini-apps para manter sua mente afiada.
        </p>
      </motion.div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: app.delay }}
          >
            <Link href={`/${app.id}`}>
              <div className="glass-card p-6 hover-lift cursor-pointer h-full group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-indigo-400 transition-colors">
                  {app.title}
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  {app.description}
                </p>
                <div className="mt-4 flex items-center text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Abrir app</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-16 text-slate-500"
      >
        <p>Feito com 💜 por um dev de 17 anos</p>
      </motion.div>
    </div>
  );
}
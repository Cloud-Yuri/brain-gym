"use client";

import { motion } from "framer-motion";
import { Zap, ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

export default function GeniusPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 inline-flex">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>

        <div className="glass-card p-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center gap-3">
            <Zap className="w-8 h-8" />
            Sequência Lógica
          </h1>
          
          <p className="text-xl text-slate-400 mb-8">
            Em construção! 🔨
          </p>
          
          <p className="text-slate-500">
            O clássico jogo Genius/Simon está sendo desenvolvido. 
            Volte em breve para testar sua memória sequencial!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
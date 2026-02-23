"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ArrowLeft, ArrowRightLeft, Sparkles } from "lucide-react";
import Link from "next/link";

type Category = "length" | "weight" | "temperature" | "time" | "data" | "fun";

interface Conversion {
  name: string;
  from: string;
  to: string;
  formula: (val: number) => number;
  description: string;
}

const conversions: Record<Category, Conversion[]> = {
  length: [
    { name: "Metros → Pés", from: "m", to: "ft", formula: (v) => v * 3.28084, description: "Conversão padrão de comprimento" },
    { name: "Quilômetros → Milhas", from: "km", to: "mi", formula: (v) => v * 0.621371, description: "Para viagens internacionais" },
    { name: "Polegadas → Centímetros", from: "in", to: "cm", formula: (v) => v * 2.54, description: "Medidas de telas e monitores" },
  ],
  weight: [
    { name: "Quilogramas → Libras", from: "kg", to: "lb", formula: (v) => v * 2.20462, description: "Peso nos EUA" },
    { name: "Gramas → Onças", from: "g", to: "oz", formula: (v) => v * 0.035274, description: "Cozinha e receitas" },
    { name: "Toneladas → Elefantes 🐘", from: "t", to: "elefantes", formula: (v) => v * 0.14, description: "1 elefante = ~7 toneladas" },
  ],
  temperature: [
    { name: "Celsius → Fahrenheit", from: "°C", to: "°F", formula: (v) => (v * 9/5) + 32, description: "Temperatura nos EUA" },
    { name: "Celsius → Kelvin", from: "°C", to: "K", formula: (v) => v + 273.15, description: "Escala científica" },
  ],
  time: [
    { name: "Horas → Minutos", from: "h", to: "min", formula: (v) => v * 60, description: "Conversão básica" },
    { name: "Dias → Segundos", from: "d", to: "s", formula: (v) => v * 86400, description: "Quanto tempo você tem?" },
    { name: "Anos → Batimentos 💓", from: "anos", to: "batimentos", formula: (v) => v * 365 * 24 * 60 * 75, description: "Média de 75 bpm" },
  ],
  data: [
    { name: "GB → MB", from: "GB", to: "MB", formula: (v) => v * 1024, description: "Tamanho de arquivos" },
    { name: "TB → Discos 💾", from: "TB", to: "disquetes", formula: (v) => v * 1024 * 1024 / 1.44, description: "Disquetes de 1.44MB" },
  ],
  fun: [
    { name: "Anos-luz → Km", from: "ly", to: "km", formula: (v) => v * 9.461e12, description: "Distâncias astronômicas" },
    { name: "Bitcoin → Pizzas 🍕", from: "BTC", to: "pizzas", formula: (v) => v * 95000 / 50, description: "Preço médio da pizza" },
    { name: "Altura → Bananas 🍌", from: "m", to: "bananas", formula: (v) => v * 100 / 18, description: "Banana = ~18cm" },
    { name: "Peso → Gatos 🐱", from: "kg", to: "gatos", formula: (v) => v / 4.5, description: "Gato médio = 4.5kg" },
  ],
};

const categoryNames: Record<Category, string> = {
  length: "Comprimento",
  weight: "Peso",
  temperature: "Temperatura",
  time: "Tempo",
  data: "Dados",
  fun: "Maluquices",
};

const categoryColors: Record<Category, string> = {
  length: "from-blue-500 to-cyan-500",
  weight: "from-orange-500 to-red-500",
  temperature: "from-red-500 to-rose-500",
  time: "from-purple-500 to-violet-500",
  data: "from-green-500 to-emerald-500",
  fun: "from-pink-500 to-rose-500",
};

export default function ConverterPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("length");
  const [selectedConversion, setSelectedConversion] = useState<Conversion>(conversions.length[0]);
  const [inputValue, setInputValue] = useState<string>("1");
  const [showResult, setShowResult] = useState(false);

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedConversion(conversions[cat][0]);
    setShowResult(false);
  };

  const handleConvert = () => {
    setShowResult(true);
  };

  const result = selectedConversion.formula(parseFloat(inputValue) || 0);

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Scale className="w-8 h-8" />
            Conversor Universal
          </h1>
          <div className="w-20" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {(Object.keys(conversions) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`
                p-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${selectedCategory === cat 
                  ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow-lg` 
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"}
              `}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Escolha a conversão
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Conversão</label>
                <select
                  value={selectedConversion.name}
                  onChange={(e) => {
                    const conv = conversions[selectedCategory].find(c => c.name === e.target.value);
                    if (conv) {
                      setSelectedConversion(conv);
                      setShowResult(false);
                    }
                  }}
                  className="input-field"
                >
                  {conversions[selectedCategory].map((conv) => (
                    <option key={conv.name} value={conv.name}>
                      {conv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Valor ({selectedConversion.from})</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowResult(false);
                  }}
                  className="input-field text-2xl font-bold"
                  placeholder="Digite o valor..."
                />
              </div>

              <button
                onClick={handleConvert}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-5 h-5" />
                Converter
              </button>
            </div>

            <p className="text-slate-500 text-sm mt-4 italic">
              {selectedConversion.description}
            </p>
          </div>

          {/* Result Section */}
          <div className="glass-card p-6 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-slate-400 mb-2">Resultado</div>
                  <div className="text-5xl font-bold gradient-text mb-2">
                    {result.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                  </div>
                  <div className="text-xl text-slate-400">
                    {selectedConversion.to}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-slate-800/50 rounded-xl"
                  >
                    <div className="text-sm text-slate-400 mb-1">Cálculo</div>
                    <div className="text-lg font-mono text-indigo-400">
                      {inputValue} {selectedConversion.from} = {result.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} {selectedConversion.to}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-slate-500"
                >
                  <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Digite um valor e clique em converter</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
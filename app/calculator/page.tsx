"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator, History, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("calc-history", []);
  const [showHistory, setShowHistory] = useState(false);
  const [lastWasOperator, setLastWasOperator] = useState(false);

  const buttons = [
    { label: "C", type: "clear", className: "bg-red-500/20 text-red-400 hover:bg-red-500/30" },
    { label: "(", type: "operator", className: "text-indigo-400" },
    { label: ")", type: "operator", className: "text-indigo-400" },
    { label: "÷", type: "operator", className: "text-indigo-400" },
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "×", type: "operator", className: "text-indigo-400" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "-", type: "operator", className: "text-indigo-400" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "+", type: "operator", className: "text-indigo-400" },
    { label: "0", type: "number", className: "col-span-2" },
    { label: ".", type: "number" },
    { label: "=", type: "equals", className: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" },
  ];

  const scientificButtons = [
    { label: "sin", func: "Math.sin" },
    { label: "cos", func: "Math.cos" },
    { label: "tan", func: "Math.tan" },
    { label: "log", func: "Math.log10" },
    { label: "ln", func: "Math.log" },
    { label: "√", func: "Math.sqrt" },
    { label: "x²", func: "**2" },
    { label: "xʸ", func: "**" },
    { label: "π", value: "Math.PI" },
    { label: "e", value: "Math.E" },
  ];

  const handleClick = useCallback((label: string, type: string) => {
    if (type === "clear") {
      setDisplay("0");
      setLastWasOperator(false);
    } else if (type === "equals") {
      try {
        const expression = display
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/log/g, "Math.log10")
          .replace(/ln/g, "Math.log")
          .replace(/√/g, "Math.sqrt");
        
        const result = eval(expression);
        const resultStr = Number(result.toFixed(8)).toString();
        
        const newItem: HistoryItem = {
          expression: display,
          result: resultStr,
          timestamp: Date.now(),
        };
        
        setHistory(prev => [newItem, ...prev].slice(0, 50));
        setDisplay(resultStr);
        setLastWasOperator(false);
      } catch {
        setDisplay("Erro");
        setLastWasOperator(false);
      }
    } else if (type === "operator") {
      if (!lastWasOperator || label === "(" || label === ")") {
        setDisplay(prev => prev === "0" && label !== "(" ? label : prev + label);
        setLastWasOperator(label !== "(" && label !== ")");
      }
    } else {
      setDisplay(prev => prev === "0" || prev === "Erro" ? label : prev + label);
      setLastWasOperator(false);
    }
  }, [display, lastWasOperator, setHistory]);

  const clearHistory = () => {
    setHistory([]);
  };

  const useHistoryItem = (item: HistoryItem) => {
    setDisplay(item.result);
    setShowHistory(false);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            Calculadora Científica
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">Histórico</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator */}
          <div className="lg:col-span-2 space-y-4">
            {/* Display */}
            <div className="glass-card p-6 text-right">
              <div className="text-slate-400 text-sm mb-2">Expressão</div>
              <div className="text-4xl font-mono text-white break-all">{display}</div>
            </div>

            {/* Scientific Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {scientificButtons.map((btn) => (
                <motion.button
                  key={btn.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (btn.value) {
                      setDisplay(prev => prev === "0" ? btn.value : prev + btn.value);
                    } else if (btn.func) {
                      setDisplay(prev => prev === "0" ? btn.func + "(" : prev + btn.func + "(");
                    } else {
                      handleClick(btn.label, "operator");
                    }
                  }}
                  className="p-3 rounded-xl bg-slate-800 text-indigo-400 font-semibold hover:bg-slate-700 transition-colors text-sm"
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>

            {/* Main Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn) => (
                <motion.button
                  key={btn.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(btn.label, btn.type)}
                  className={`
                    p-4 rounded-xl text-xl font-semibold transition-all duration-200
                    ${btn.type === "number" ? "bg-slate-800 text-white hover:bg-slate-700" : ""}
                    ${btn.className || ""}
                  `}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* History Sidebar */}
          <motion.div
            initial={false}
            animate={{ 
              width: showHistory ? "100%" : "0",
              opacity: showHistory ? 1 : 0 
            }}
            className={`overflow-hidden ${showHistory ? "block" : "hidden lg:block"}`}
          >
            <div className="glass-card h-full max-h-[600px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h3 className="font-bold text-lg">Histórico</h3>
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhum cálculo ainda</p>
                ) : (
                  history.map((item, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => useHistoryItem(item)}
                      className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                    >
                      <div className="text-slate-400 text-sm">{item.expression}</div>
                      <div className="text-indigo-400 font-bold text-lg group-hover:text-indigo-300">= {item.result}</div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
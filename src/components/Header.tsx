import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import Pokeball from "./Pokeball";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export default function Header({ search, onSearchChange, resultCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a12]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="drop-shadow-[0_0_12px_rgba(217,70,239,0.5)]">
              <Pokeball size={32} />
            </div>
            <div>
              <h1 className="font-display text-3xl leading-none font-bold tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent text-glow">
                  Pokédex
                </span>
              </h1>
              <p className="mt-1 hidden text-xs text-white/35 sm:block">
                Explore l'univers Pokémon, un Pokémon à la fois
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 sm:inline-block">
            {resultCount.toLocaleString("fr-FR")} Pokémon
          </span>
        </motion.div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Cherche un Pokémon par nom ou numéro..."
            className="glass w-full rounded-2xl py-3.5 pr-11 pl-12 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-fuchsia-400/50 focus:ring-2 focus:ring-fuchsia-400/20 sm:text-base"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

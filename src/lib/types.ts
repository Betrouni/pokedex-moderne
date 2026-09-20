export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

interface TypeStyle {
  gradient: string;
  glow: string;
  solid: string;
}

export const TYPE_STYLES: Record<PokemonType, TypeStyle> = {
  normal: { gradient: "from-zinc-400 to-zinc-300", glow: "#a1a1aa", solid: "#a1a1aa" },
  fire: { gradient: "from-orange-500 to-red-500", glow: "#f97316", solid: "#f97316" },
  water: { gradient: "from-blue-500 to-cyan-400", glow: "#3b82f6", solid: "#3b82f6" },
  electric: { gradient: "from-yellow-300 to-amber-400", glow: "#facc15", solid: "#facc15" },
  grass: { gradient: "from-green-500 to-emerald-400", glow: "#22c55e", solid: "#22c55e" },
  ice: { gradient: "from-cyan-300 to-sky-200", glow: "#67e8f9", solid: "#67e8f9" },
  fighting: { gradient: "from-red-700 to-orange-700", glow: "#b91c1c", solid: "#b91c1c" },
  poison: { gradient: "from-purple-500 to-fuchsia-500", glow: "#a855f7", solid: "#a855f7" },
  ground: { gradient: "from-amber-600 to-yellow-500", glow: "#d97706", solid: "#d97706" },
  flying: { gradient: "from-indigo-300 to-sky-400", glow: "#818cf8", solid: "#818cf8" },
  psychic: { gradient: "from-pink-500 to-rose-400", glow: "#ec4899", solid: "#ec4899" },
  bug: { gradient: "from-lime-500 to-green-400", glow: "#84cc16", solid: "#84cc16" },
  rock: { gradient: "from-yellow-800 to-stone-500", glow: "#a8a29e", solid: "#a8a29e" },
  ghost: { gradient: "from-indigo-700 to-purple-700", glow: "#6366f1", solid: "#6366f1" },
  dragon: { gradient: "from-indigo-600 to-violet-500", glow: "#818cf8", solid: "#818cf8" },
  dark: { gradient: "from-zinc-800 to-zinc-600", glow: "#52525b", solid: "#71717a" },
  steel: { gradient: "from-slate-400 to-slate-300", glow: "#94a3b8", solid: "#94a3b8" },
  fairy: { gradient: "from-pink-300 to-rose-300", glow: "#f9a8d4", solid: "#f9a8d4" },
};

export function typeStyle(type: string): TypeStyle {
  return TYPE_STYLES[type as PokemonType] ?? TYPE_STYLES.normal;
}

export const STAT_LABELS: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Att. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};

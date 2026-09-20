import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PokemonDetail } from "../lib/pokeapi";
import { thumbnailFor } from "../lib/pokeapi";
import { typeLabel, typeStyle } from "../lib/types";

interface PokemonCardProps {
  pokemon: PokemonDetail;
  displayName: string;
  onSelect: (id: number) => void;
}

export default function PokemonCard({ pokemon, displayName, onSelect }: PokemonCardProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 220,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 220,
    damping: 20,
  });

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const style = typeStyle(primaryType);
  const sprite = thumbnailFor(pokemon);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(pokemon.id)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="glass group relative w-full overflow-hidden rounded-3xl p-5 text-left transition-shadow hover:shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ backgroundColor: style.glow }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-white/30">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <div className="flex gap-1">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white/90 ${typeStyle(t.type.name).gradient}`}
            >
              {typeLabel(t.type.name)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative mx-auto -mt-2 flex h-32 items-center justify-center"
        style={{ transform: "translateZ(40px)" }}
      >
        {sprite ? (
          <img
            src={sprite}
            alt={displayName}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            className="h-32 w-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 [image-rendering:crisp-edges] group-hover:scale-110"
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-white/5" />
        )}
      </div>

      <p className="relative mt-1 text-center font-display text-lg font-semibold capitalize text-white">
        {displayName}
      </p>
    </motion.button>
  );
}

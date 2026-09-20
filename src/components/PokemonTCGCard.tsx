import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { PokemonDetail } from "../lib/pokeapi";
import { spriteFor } from "../lib/pokeapi";
import { typeLabel, typeStyle } from "../lib/types";
import Pokeball from "./Pokeball";

interface PokemonTCGCardProps {
  pokemon: PokemonDetail;
  displayName: string;
}

export default function PokemonTCGCard({ pokemon, displayName }: PokemonTCGCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [16, -16]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-16, 16]), {
    stiffness: 200,
    damping: 22,
  });

  const glareBackground = useTransform([px, py], (latest) => {
    const [lx, ly] = latest as number[];
    return `radial-gradient(circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.65), transparent 42%)`;
  });
  const holoPosition = useTransform([px, py], (latest) => {
    const [lx, ly] = latest as number[];
    return `${lx * 100}% ${ly * 100}%`;
  });
  const holoMask = useTransform([px, py], (latest) => {
    const [lx, ly] = latest as number[];
    return `radial-gradient(circle at ${lx * 100}% ${ly * 100}%, black, transparent 65%)`;
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const style = typeStyle(primaryType);
  const artwork = spriteFor(pokemon);
  const hp = pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat ?? "--";

  return (
    <div className="mx-auto w-full max-w-[280px] select-none">
      <div style={{ perspective: 1600 }}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <motion.div
            onClick={() => setFlipped((f) => !f)}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 17 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative aspect-[5/7] w-full cursor-pointer"
          >
            {/* FRONT FACE */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className={`absolute inset-0 overflow-hidden rounded-[20px] bg-gradient-to-br p-[3px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] ${style.gradient}`}
            >
              <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[17px] bg-[#100f1a]">
                <div className="flex items-center justify-between px-3.5 pt-3">
                  <span className="truncate font-display text-sm font-bold text-white capitalize">
                    {displayName}
                  </span>
                  <span className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-white/70">PV</span>
                    <span className="text-lg font-bold" style={{ color: style.glow }}>
                      {hp}
                    </span>
                  </span>
                </div>

                <div
                  className="relative mx-3 mt-2 flex flex-1 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 35%, ${style.glow}4d, transparent 70%), linear-gradient(160deg, #ffffff12, #ffffff02)`,
                  }}
                >
                  <div
                    className="absolute h-24 w-24 rounded-full opacity-60 blur-2xl"
                    style={{ backgroundColor: style.glow }}
                  />
                  {artwork && (
                    <img
                      src={artwork}
                      alt={displayName}
                      width={200}
                      height={200}
                      decoding="async"
                      style={{ transform: "translateZ(35px)" }}
                      className="relative h-[85%] w-[85%] object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.6)]"
                    />
                  )}
                </div>

                <div className="flex items-center justify-center gap-1.5 py-2.5">
                  {pokemon.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[10px] font-semibold text-white ${typeStyle(t.type.name).gradient}`}
                    >
                      {typeLabel(t.type.name)}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between px-3.5 pb-2.5 font-mono text-[9px] text-white/35">
                  <span>N°{String(pokemon.id).padStart(3, "0")}</span>
                  <span>POKÉDEX</span>
                </div>
              </div>

              {/* holographic sheen */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[17px] mix-blend-color-dodge"
                style={{
                  opacity: 0.8,
                  backgroundImage:
                    "repeating-linear-gradient(115deg, #ff2ea6 0%, #ff9a2e 12%, #f8ff2e 24%, #35ff7a 36%, #2ee3ff 48%, #7a3bff 60%, #ff2ea6 72%)",
                  backgroundSize: "250% 250%",
                  backgroundPosition: holoPosition,
                  WebkitMaskImage: holoMask,
                  maskImage: holoMask,
                }}
              />
              {/* pointer glare */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[17px]"
                style={{ background: glareBackground }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[17px] ring-1 ring-white/15" />
            </div>

            {/* BACK FACE */}
            <div
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[20px] border-[3px] border-white/10 bg-gradient-to-br from-[#1b1b2e] to-[#0b0b13] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #ffffff22 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              <div className="absolute inset-3 rounded-2xl border-2 border-white/15" />
              <Pokeball size={92} />
            </div>
          </motion.div>
        </motion.div>
      </div>
      <p className="mt-3 text-center text-xs text-white/35">
        Clique sur la carte pour la retourner
      </p>
    </div>
  );
}

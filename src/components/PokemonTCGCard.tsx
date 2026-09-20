import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { PokemonDetail } from "../lib/pokeapi";
import { spriteFor } from "../lib/pokeapi";
import { STAT_LABELS, typeLabel, typeStyle } from "../lib/types";
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

  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), {
    stiffness: 200,
    damping: 22,
  });

  const holoPosition = useTransform([px, py], (latest) => {
    const [lx, ly] = latest as number[];
    return `${lx * 100}% ${ly * 100}%`;
  });
  const glareBackground = useTransform([px, py], (latest) => {
    const [lx, ly] = latest as number[];
    return `radial-gradient(circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.5), transparent 50%)`;
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
  const moves = pokemon.stats
    .filter((s) => s.stat.name !== "hp")
    .sort((a, b) => b.base_stat - a.base_stat)
    .slice(0, 2);

  const panelBg = `color-mix(in srgb, ${style.glow} 16%, white)`;
  const stripBg = `color-mix(in srgb, ${style.glow} 28%, white)`;

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
            {/* FRONT FACE — styled like a real Pokémon TCG card */}
            <div
              style={{
                backfaceVisibility: "hidden",
                background: "linear-gradient(150deg, #f2f2f2, #c7c7cc 35%, #eeeeee 55%, #b9b9c0 80%, #f2f2f2)",
              }}
              className="absolute inset-0 overflow-hidden rounded-[16px] p-[7px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
            >
              <div
                className="relative flex h-full w-full flex-col overflow-hidden rounded-[11px] p-2"
                style={{ background: panelBg }}
              >
                {/* header */}
                <div className="flex items-center justify-between px-1">
                  <span className="truncate font-display text-sm font-extrabold text-zinc-800 capitalize">
                    {displayName}
                  </span>
                  <span className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-zinc-500">PV</span>
                    <span className="text-lg font-extrabold text-zinc-800">{hp}</span>
                    <span
                      className="ml-0.5 h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: style.solid }}
                    />
                  </span>
                </div>

                {/* artwork frame */}
                <div
                  className="relative mt-1.5 overflow-hidden rounded-md border-2"
                  style={{ borderColor: style.solid }}
                >
                  <div
                    className="relative flex h-36 items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 50% 35%, color-mix(in srgb, ${style.glow} 55%, white), color-mix(in srgb, ${style.glow} 20%, white) 75%)`,
                    }}
                  >
                    {artwork && (
                      <img
                        src={artwork}
                        alt={displayName}
                        width={200}
                        height={200}
                        decoding="async"
                        className="relative h-[92%] w-[92%] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
                      />
                    )}
                    {/* subtle holo sheen — confined to the art window only */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(115deg, #ff2ea6 0%, #ff9a2e 12%, #f8ff2e 24%, #35ff7a 36%, #2ee3ff 48%, #7a3bff 60%, #ff2ea6 72%)",
                        backgroundSize: "220% 220%",
                        backgroundPosition: holoPosition,
                      }}
                    />
                    <motion.div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: glareBackground }}
                    />
                  </div>
                </div>

                {/* info strip */}
                <div
                  className="mt-1.5 flex items-center justify-between rounded-sm px-2 py-1 text-[9px] font-semibold text-zinc-700"
                  style={{ background: stripBg }}
                >
                  <span>N° {String(pokemon.id).padStart(3, "0")}</span>
                  <span className="truncate">{typeLabel(primaryType)}</span>
                  <span>
                    {pokemon.height / 10} m · {pokemon.weight / 10} kg
                  </span>
                </div>

                {/* moves — flavored from the Pokémon's strongest stats */}
                <div className="mt-2.5 flex flex-col gap-2 px-1">
                  {moves.map((m) => (
                    <div key={m.stat.name} className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: style.solid }}
                      />
                      <span className="flex-1 truncate text-[11px] font-semibold text-zinc-700">
                        {STAT_LABELS[m.stat.name] ?? m.stat.name}
                      </span>
                      <span className="text-sm font-extrabold text-zinc-800">{m.base_stat}</span>
                    </div>
                  ))}
                </div>

                {/* footer */}
                <div className="mt-auto flex items-center justify-between px-1 pt-1 text-[7px] font-medium text-zinc-500/80">
                  <span>Illus. PokéAPI</span>
                  <span>POKÉDEX · {String(pokemon.id).padStart(3, "0")}/1302</span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[16px] border-[3px] border-white/10 bg-gradient-to-br from-[#1b1b2e] to-[#0b0b13] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff22 1px, transparent 1px)",
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

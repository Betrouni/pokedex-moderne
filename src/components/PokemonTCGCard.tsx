import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useTCGCard, useTypeDamageRelations } from "../hooks/usePokemon";
import type { PokemonDetail } from "../lib/pokeapi";
import { spriteFor } from "../lib/pokeapi";
import { STAT_LABELS, typeLabel, typeStyle } from "../lib/types";
import Pokeball from "./Pokeball";

interface PokemonTCGCardProps {
  pokemon: PokemonDetail;
  displayName: string;
}

export default function PokemonTCGCard({
  pokemon,
  displayName,
}: PokemonTCGCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [customBackAvailable, setCustomBackAvailable] = useState(true);

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

  const { data: relations } = useTypeDamageRelations(primaryType);
  const weakness = relations?.double_damage_from[0];
  const resistance = relations?.half_damage_from[0];

  const { data: tcgCard } = useTCGCard(pokemon.id);

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
            {/* FRONT FACE — real scanned card when available, styled recreation otherwise */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
            >
              {tcgCard ? (
                <>
                  <img
                    src={tcgCard.images.large}
                    alt={displayName}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
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
                </>
              ) : (
                <div
                  style={{
                    background:
                      "linear-gradient(150deg, #f2f2f2, #c7c7cc 35%, #eeeeee 55%, #b9b9c0 80%, #f2f2f2)",
                  }}
                  className="h-full w-full p-[7px]"
                >
                  <div
                    className="relative flex h-full w-full flex-col overflow-hidden rounded-[11px] p-2"
                    style={{ background: panelBg }}
                  >
                    {/* header */}
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="shrink-0 rounded-sm bg-zinc-800/10 px-1 py-0.5 text-[7px] font-bold tracking-wide text-zinc-600 uppercase">
                        Base
                      </span>
                      <span className="flex-1 truncate font-display text-sm font-extrabold text-zinc-800 capitalize">
                        {displayName}
                      </span>
                      <span className="flex items-baseline gap-1 whitespace-nowrap">
                        <span className="text-[10px] font-bold text-zinc-500">
                          PV
                        </span>
                        <span className="text-lg font-extrabold text-zinc-800">
                          {hp}
                        </span>
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
                    <div className="mt-2 flex flex-col gap-1.5 px-1">
                      {moves.map((m) => (
                        <div
                          key={m.stat.name}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                            style={{ backgroundColor: style.solid }}
                          />
                          <span className="flex-1 truncate text-[11px] font-semibold text-zinc-700">
                            {STAT_LABELS[m.stat.name] ?? m.stat.name}
                          </span>
                          <span className="text-sm font-extrabold text-zinc-800">
                            {m.base_stat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* weakness / resistance — derived from real type damage relations */}
                    <div className="mt-auto grid grid-cols-2 gap-2 border-t border-black/10 px-1 pt-1.5 text-[8px] font-semibold text-zinc-600">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-400">Faiblesse</span>
                        {weakness ? (
                          <span className="flex items-center gap-1">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-black/10"
                              style={{
                                backgroundColor: typeStyle(weakness.name).solid,
                              }}
                            />
                            ×2
                          </span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-zinc-400">Résistance</span>
                        {resistance ? (
                          <span className="flex items-center gap-1">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-black/10"
                              style={{
                                backgroundColor: typeStyle(resistance.name)
                                  .solid,
                              }}
                            />
                            ×0.5
                          </span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between px-1 text-[7px] font-medium text-zinc-500/70">
                      <span>Illus. PokéAPI</span>
                      <span>
                        POKÉDEX · {String(pokemon.id).padStart(3, "0")}/1302
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BACK FACE — local custom asset if provided (see public/card-back.webp), homage design otherwise */}
            <div
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              className="absolute inset-0 overflow-hidden rounded-[16px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]"
            >
              {customBackAvailable && (
                <img
                  src={`${import.meta.env.BASE_URL}card-back.webp`}
                  alt=""
                  loading="eager"
                  decoding="async"
                  onError={() => setCustomBackAvailable(false)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              {!customBackAvailable && (
                <div
                  style={{
                    background:
                      "linear-gradient(155deg, #14226e, #1d3fa8 50%, #14226e)",
                  }}
                  className="h-full w-full p-[9px]"
                >
                  <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[9px] border-2 border-white/25 bg-[#1a30a0] py-4">
                    {/* swirling backdrop */}
                    <motion.div
                      className="pointer-events-none absolute -inset-1/3 opacity-70"
                      style={{
                        background:
                          "conic-gradient(from 0deg at 50% 50%, transparent 0deg, #ffffff2e 20deg, transparent 55deg, transparent 160deg, #ffffff22 190deg, transparent 230deg, transparent 340deg, #ffffff26 360deg)",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 50,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, transparent 28%, rgba(10,18,70,0.55) 100%)",
                      }}
                    />

                    <p
                      className="relative text-2xl font-black tracking-wide text-[#ffde2e] italic"
                      style={{
                        WebkitTextStroke: "1.5px #14226e",
                        textShadow: "0 2px 0 #0d1a55",
                      }}
                    >
                      POKÉDEX
                    </p>

                    <div className="relative flex h-24 w-24 items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-white/10 blur-md" />
                      <Pokeball size={96} />
                      <div
                        className="pointer-events-none absolute top-2 left-4 h-6 w-8 rounded-full bg-white/60 opacity-70 blur-[3px]"
                        style={{ transform: "rotate(-20deg)" }}
                      />
                    </div>

                    <p
                      className="relative rotate-180 text-2xl font-black tracking-wide text-[#ffde2e] italic"
                      style={{
                        WebkitTextStroke: "1.5px #14226e",
                        textShadow: "0 2px 0 #0d1a55",
                      }}
                    >
                      POKÉDEX
                    </p>
                  </div>
                </div>
              )}
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

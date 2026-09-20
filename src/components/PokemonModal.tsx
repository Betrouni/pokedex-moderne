import { AnimatePresence, motion } from "framer-motion";
import { Play, Ruler, Weight, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAbilityNames, usePokemonDetail, usePokemonSpeciesByUrl } from "../hooks/usePokemon";
import { cryUrlFor, frenchNameFrom } from "../lib/pokeapi";
import { STAT_LABELS, typeStyle } from "../lib/types";
import Pokeball from "./Pokeball";
import PokemonTCGCard from "./PokemonTCGCard";

interface PokemonModalProps {
  id: number | null;
  onClose: () => void;
}

export default function PokemonModal({ id, onClose }: PokemonModalProps) {
  const { data: pokemon, isLoading } = usePokemonDetail(id);
  const { data: species } = usePokemonSpeciesByUrl(pokemon?.species.url);
  const abilityQueries = useAbilityNames(pokemon?.abilities.map((a) => a.ability.name) ?? []);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const primaryType = pokemon?.types[0]?.type.name ?? "normal";
  const style = typeStyle(primaryType);
  const displayName = pokemon ? frenchNameFrom(species, pokemon.name) : "";

  function playCry() {
    if (!pokemon) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(cryUrlFor(pokemon.id));
    }
    audioRef.current.currentTime = 0;
    setPlaying(true);
    audioRef.current.play().catch(() => setPlaying(false));
    audioRef.current.onended = () => setPlaying(false);
  }

  return (
    <AnimatePresence>
      {id !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-40 blur-3xl"
              style={{ backgroundColor: style.glow }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {isLoading || !pokemon ? (
              <div className="flex h-96 items-center justify-center">
                <Pokeball size={56} />
              </div>
            ) : (
              <div className="relative flex flex-col items-center p-6 sm:p-8">
                <PokemonTCGCard pokemon={pokemon} displayName={displayName} />

                <button
                  onClick={playCry}
                  className={`mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20 ${playing ? "animate-pulse" : ""}`}
                >
                  <Play className="h-3.5 w-3.5" />
                  Écouter le cri
                </button>

                <div className="glass mt-6 w-full rounded-2xl p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={<Ruler className="h-4 w-4" />} label="Taille" value={`${pokemon.height / 10} m`} />
                    <InfoCard icon={<Weight className="h-4 w-4" />} label="Poids" value={`${pokemon.weight / 10} kg`} />
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-white/60">Statistiques</h3>
                    <div className="space-y-3">
                      {pokemon.stats.map((s) => (
                        <StatBar
                          key={s.stat.name}
                          label={STAT_LABELS[s.stat.name] ?? s.stat.name}
                          value={s.base_stat}
                          color={style.solid}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 text-sm font-semibold text-white/60">Capacités</h3>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.abilities.map((a, i) => (
                        <span
                          key={a.ability.name}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 capitalize"
                        >
                          {frenchNameFrom(abilityQueries[i]?.data, a.ability.name.replace(/-/g, " "))}
                          {a.is_hidden && <span className="ml-1 text-white/40">(cachée)</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="rounded-full bg-white/10 p-2 text-white/70">{icon}</div>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, (value / 180) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-white/50">{label}</span>
        <span className="font-mono text-white/70">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

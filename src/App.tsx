import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import Background from "./components/Background";
import CardSkeleton from "./components/CardSkeleton";
import Header from "./components/Header";
import Pokeball from "./components/Pokeball";
import PokemonCard from "./components/PokemonCard";
import TypeFilter from "./components/TypeFilter";

const PokemonModal = lazy(() => import("./components/PokemonModal"));
import {
  usePokemonDetails,
  usePokemonNames,
  usePokemonSpeciesByUrls,
  useTypeMembers,
} from "./hooks/usePokemon";
import { frenchNameFrom, idFromUrl } from "./lib/pokeapi";

const PAGE_SIZE = 30;

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: allNames, isLoading: namesLoading } = usePokemonNames();
  const { data: typeMembers, isLoading: typeLoading } = useTypeMembers(selectedType);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedType]);

  const filtered = useMemo(() => {
    if (!allNames) return [];
    const term = search.trim().toLowerCase();
    return allNames.filter((entry) => {
      const id = idFromUrl(entry.url);
      const matchesSearch =
        !term || entry.name.includes(term) || String(id) === term;
      const matchesType = !selectedType || typeMembers?.has(entry.name);
      return matchesSearch && matchesType;
    });
  }, [allNames, search, selectedType, typeMembers]);

  const visible = filtered.slice(0, visibleCount);
  const detailQueries = usePokemonDetails(visible.map((v) => v.name));
  const speciesQueries = usePokemonSpeciesByUrls(
    detailQueries.map((q) => q.data?.species.url),
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length]);

  const isInitialLoading = namesLoading || (selectedType !== null && typeLoading);

  return (
    <div className="min-h-screen">
      <Background />
      <Header search={search} onSearchChange={setSearch} resultCount={filtered.length} />
      <TypeFilter selected={selectedType} onSelect={setSelectedType} />

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Pokeball size={64} />
            <p className="text-sm text-white/40">Chargement du Pokédex...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-32 text-center"
          >
            <p className="text-lg font-medium text-white/70">Aucun Pokémon trouvé</p>
            <p className="text-sm text-white/40">Essaie un autre nom, numéro ou type.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {detailQueries.map((q, i) =>
                  q.data ? (
                    <PokemonCard
                      key={q.data.id}
                      pokemon={q.data}
                      displayName={frenchNameFrom(speciesQueries[i]?.data, q.data.name)}
                      onSelect={setSelectedId}
                    />
                  ) : (
                    <CardSkeleton key={visible[i]?.name ?? i} />
                  ),
                )}
              </AnimatePresence>
            </div>
            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="flex justify-center py-10">
                <Pokeball size={40} />
              </div>
            )}
          </>
        )}
      </main>

      <Suspense fallback={selectedId !== null ? <ModalFallback /> : null}>
        <PokemonModal id={selectedId} onClose={() => setSelectedId(null)} />
      </Suspense>
    </div>
  );
}

function ModalFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <Pokeball size={56} />
    </div>
  );
}

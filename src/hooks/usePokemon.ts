import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonNamesByType,
} from "../lib/pokeapi";

export function usePokemonNames() {
  return useQuery({
    queryKey: ["pokemon-names"],
    queryFn: fetchAllPokemonNames,
    staleTime: Infinity,
  });
}

export function useTypeMembers(type: string | null) {
  return useQuery({
    queryKey: ["pokemon-type", type],
    queryFn: () => fetchPokemonNamesByType(type as string),
    enabled: !!type,
    staleTime: Infinity,
  });
}

export function usePokemonDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["pokemon-detail", name],
      queryFn: () => fetchPokemonDetail(name),
      staleTime: Infinity,
    })),
  });
}

export function usePokemonDetail(idOrName: string | number | null) {
  return useQuery({
    queryKey: ["pokemon-detail", idOrName],
    queryFn: () => fetchPokemonDetail(idOrName as string | number),
    enabled: idOrName !== null,
    staleTime: Infinity,
  });
}

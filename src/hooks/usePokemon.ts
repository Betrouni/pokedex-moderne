import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchAbility,
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonNamesByType,
  fetchSpeciesByUrl,
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

export function usePokemonSpeciesByUrls(urls: (string | undefined)[]) {
  return useQueries({
    queries: urls.map((url, i) => ({
      queryKey: ["species-url", url ?? `pending-${i}`],
      queryFn: () => fetchSpeciesByUrl(url as string),
      enabled: !!url,
      staleTime: Infinity,
    })),
  });
}

export function usePokemonSpeciesByUrl(url: string | undefined) {
  return useQuery({
    queryKey: ["species-url", url],
    queryFn: () => fetchSpeciesByUrl(url as string),
    enabled: !!url,
    staleTime: Infinity,
  });
}

export function useAbilityNames(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["ability", name],
      queryFn: () => fetchAbility(name),
      staleTime: Infinity,
    })),
  });
}

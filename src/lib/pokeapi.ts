const BASE = "https://pokeapi.co/api/v2";

export interface PokemonListEntry {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": { front_default: string | null };
      home?: { front_default: string | null };
    };
  };
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
}

export function idFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export async function fetchAllPokemonNames(): Promise<PokemonListEntry[]> {
  const res = await fetch(`${BASE}/pokemon?limit=1302&offset=0`);
  if (!res.ok) throw new Error("Impossible de charger la liste des Pokémon");
  const data = await res.json();
  return data.results;
}

export async function fetchPokemonDetail(
  idOrName: string | number,
): Promise<PokemonDetail> {
  const res = await fetch(`${BASE}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error(`Impossible de charger ${idOrName}`);
  return res.json();
}

export async function fetchPokemonNamesByType(type: string): Promise<Set<string>> {
  const res = await fetch(`${BASE}/type/${type}`);
  if (!res.ok) throw new Error("Impossible de charger ce type");
  const data = await res.json();
  return new Set<string>(data.pokemon.map((p: { pokemon: { name: string } }) => p.pokemon.name));
}

export function spriteFor(detail: PokemonDetail): string | null {
  return (
    detail.sprites.other["official-artwork"].front_default ??
    detail.sprites.other.home?.front_default ??
    detail.sprites.front_default
  );
}

export function cryUrlFor(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

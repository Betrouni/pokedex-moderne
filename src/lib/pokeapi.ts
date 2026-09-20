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
  species: { name: string; url: string };
}

export interface LocalizedNames {
  names: { name: string; language: { name: string } }[];
}

export function frenchNameFrom(resource: LocalizedNames | undefined, fallback: string): string {
  const fr = resource?.names.find((n) => n.language.name === "fr");
  return fr?.name ?? fallback;
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

export async function fetchSpeciesByUrl(url: string): Promise<LocalizedNames> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de charger les infos du Pokémon");
  return res.json();
}

export async function fetchAbility(name: string): Promise<LocalizedNames> {
  const res = await fetch(`${BASE}/ability/${name}`);
  if (!res.ok) throw new Error(`Impossible de charger la capacité ${name}`);
  return res.json();
}

export interface TypeDamageRelations {
  double_damage_from: { name: string; url: string }[];
  half_damage_from: { name: string; url: string }[];
}

export async function fetchTypeDamageRelations(type: string): Promise<TypeDamageRelations> {
  const res = await fetch(`${BASE}/type/${type}`);
  if (!res.ok) throw new Error("Impossible de charger ce type");
  const data = await res.json();
  return data.damage_relations;
}

export function spriteFor(detail: PokemonDetail): string | null {
  return (
    detail.sprites.other["official-artwork"].front_default ??
    detail.sprites.other.home?.front_default ??
    detail.sprites.front_default
  );
}

/** Small sprite for grid thumbnails — a fraction of the size of the official artwork, used to keep the grid light. */
export function thumbnailFor(detail: PokemonDetail): string | null {
  return detail.sprites.front_default ?? spriteFor(detail);
}

export function cryUrlFor(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

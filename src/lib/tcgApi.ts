const TCG_BASE = "https://api.pokemontcg.io/v2";

export interface TCGCard {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  set?: {
    name: string;
    series: string;
  };
}

/** Real scanned card for a given Pokédex number, or null if none exists / the API is unavailable. */
export async function fetchTCGCardByPokedexNumber(id: number): Promise<TCGCard | null> {
  const params = new URLSearchParams({
    q: `nationalPokedexNumbers:${id}`,
    orderBy: "-set.releaseDate",
    pageSize: "1",
  });
  const res = await fetch(`${TCG_BASE}/cards?${params.toString()}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.[0] ?? null;
}

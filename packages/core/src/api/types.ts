export type NamedAPIResource = {
  name: string;
  url: string;
};

export type NamedAPIResourceList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  species: NamedAPIResource;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  abilities: {
    is_hidden: boolean;
    slot: number;
    ability: NamedAPIResource;
  }[];
  stats: {
    base_stat: number;
    stat: NamedAPIResource;
  }[];
  types: {
    slot: number;
    type: NamedAPIResource;
  }[];
  /** Every move it can learn, with the games (version groups) it learns it in. */
  moves: {
    move: NamedAPIResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: NamedAPIResource;
      version_group: NamedAPIResource;
    }[];
  }[];
};

export type PokemonSpecies = {
  id: number;
  name: string;
  evolution_chain: { url: string } | null;
  varieties: {
    is_default: boolean;
    pokemon: NamedAPIResource;
  }[];
  genera: {
    genus: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: NamedAPIResource;
    version: NamedAPIResource;
  }[];
};

export type Generation = {
  id: number;
  name: string;
  main_region: NamedAPIResource;
  pokemon_species: NamedAPIResource[];
};

export type EvolutionChain = {
  id: number;
  chain: ChainLink;
};

export type ChainLink = {
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
};

export type EvolutionDetail = {
  trigger: NamedAPIResource;
  min_level: number | null;
  min_happiness: number | null;
  item: NamedAPIResource | null;
  time_of_day: string;
};

export type TypeInfo = {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: NamedAPIResource[];
    half_damage_from: NamedAPIResource[];
    no_damage_from: NamedAPIResource[];
  };
  pokemon: {
    slot: number;
    pokemon: NamedAPIResource;
  }[];
};

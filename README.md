# Pokédex

Un Pokédex moderne construit avec React, TypeScript et Tailwind CSS. Recherche, filtrage par type, et fiche détaillée animée pour chaque Pokémon (plus de 1300, toutes générations confondues), données fournies par la [PokéAPI](https://pokeapi.co/).

## Fonctionnalités

- Recherche par nom ou numéro, filtrage par type
- Défilement infini
- Cartes avec effet de bascule 3D au survol (tilt) et halo coloré selon le type
- Fiche détaillée : statistiques animées, taille, poids, capacités, et cri du Pokémon
- Design glassmorphism, fond animé, interface entièrement responsive

## Stack technique

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) pour les animations
- [TanStack Query](https://tanstack.com/query) pour la gestion des données et du cache
- [Lucide](https://lucide.dev/) pour les icônes

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions à chaque push sur `main`.

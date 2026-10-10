# Site professionnel de développeuse web

## Objectif
Site pour vendre mes services de développement (site vitrine, e-commerce,
application web, maintenance) à des clients locaux (Sénégal) et internationaux.
Le but principal : convertir les visiteurs en demandes de devis.

## Stack
- Nuxt 3 (Vue 3, Composition API, <script setup>), TypeScript
- Tailwind CSS
- @nuxtjs/i18n (français par défaut, anglais ensuite)
- Nuxt Content pour les réalisations (fichiers Markdown)
- Envoi d'emails via Resend (route serveur /server/api)
- Déploiement : Vercel

## Conventions
- Composants dans /components, un composant = un fichier, noms en PascalCase
- Pas de CSS personnalisé sauf nécessité : utiliser Tailwind
- Mobile first, accessible (balises sémantiques, alt sur les images)
- SEO : useSeoMeta sur chaque page (title, description, og:image)
- Aucun secret dans le code : variables dans .env, jamais commitées
- Textes dans les fichiers i18n, pas écrits en dur dans les composants

## Pages
Accueil, Services, Réalisations (+ page détail), Process, Tarifs et devis,
À propos, Contact, Mentions légales, Politique de confidentialité

## Commandes
- npm run dev : serveur de développement
- npm run build : build de production


Lis CLAUDE.md. Avant d'écrire du code, propose-moi un plan en étapes pour
construire ce site. Pour chaque étape, indique les fichiers créés ou modifiés.

Ensuite, quand je valide, fais seulement l'étape 1 :
- installe et configure Tailwind CSS et @nuxtjs/i18n (fr par défaut)
- crée un layout par défaut avec header (logo, navigation, bouton
  "Demander un devis") et footer (liens, mentions légales, contact)
- crée les pages vides avec leur titre et leur SEO de base
- le design doit être sobre et professionnel, avec une couleur principale
  facile à changer dans tailwind.config

Ne fais rien d'autre. Lance npm run build à la fin pour vérifier qu'il n'y a pas d'erreur.
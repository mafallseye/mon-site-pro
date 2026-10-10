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




## Identité
- Marque : DIGISERVICE
- Accroche : « Des sites web qui travaillent pour votre entreprise. »
- Sous-titre : « Sites vitrines, e-commerce et applications web sur mesure. »
- Couleurs (à déclarer dans tailwind.config) :
  primary #0B1F3A, primary-light #16345C, accent #F59E0B,
  surface #F4F7FB, ink #1F2937
- Style : sobre, professionnel, beaucoup d'espace, boutons d'action en accent

## Logo
- Fichiers dans /public : logo.svg (fond clair), logo-light.svg (fond sombre), favicon.svg
- Header : logo.svg ; footer sombre : logo-light.svg
- Déclarer favicon.svg dans nuxt.config (app.head.link)


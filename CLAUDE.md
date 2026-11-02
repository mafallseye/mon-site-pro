# Site professionnel de développeuse web

## Objectif
Site pour vendre mes services de développement (site vitrine, e-commerce,
application web, maintenance) à des clients locaux (Sénégal) et internationaux.
Le but principal : convertir les visiteurs en demandes de devis.

## Stack
- Nuxt 4 (Vue 3, Composition API, <script setup>), TypeScript — code applicatif dans `app/`
- Tailwind CSS v4 via `@tailwindcss/vite` (pas de tailwind.config, voir Identité)
- @nuxtjs/i18n (français par défaut, anglais ensuite)
- Nuxt Content v3 pour les réalisations (fichiers Markdown, connecteur SQLite natif)
- Validation des formulaires avec Zod (schémas partagés client/serveur)
- Envoi d'emails via Resend (routes serveur dans `server/api`)
- Tests : Vitest
- Déploiement : Vercel

## Conventions
- Composants dans `app/components`, un composant = un fichier, noms en PascalCase
- Pas de CSS personnalisé sauf nécessité : utiliser Tailwind
- Mobile first, accessible (balises sémantiques, alt sur les images)
- SEO : appeler `usePageSeo(title, description)` sur chaque page (voir Architecture),
  pas `useSeoMeta` directement
- Aucun secret dans le code : variables dans .env, jamais commitées
- Textes dans les fichiers i18n, pas écrits en dur dans les composants
  (exception : les emails envoyés à la propriétaire du site et les messages d'erreur
  serveur sont en français dans le code)
- Liens internes avec `localePath(...)` pour conserver la langue

## Pages
Accueil, Services, Réalisations (+ page détail), Process, Tarifs et devis,
À propos, Contact, Mentions légales, Politique de confidentialité

Routes (fichiers dans `app/pages`) : `/`, `/services`, `/realisations`,
`/realisations/[slug]`, `/process`, `/tarifs-devis`, `/a-propos`, `/contact`,
`/mentions-legales`, `/politique-de-confidentialite`. Version anglaise sous `/en/...`
(mêmes slugs français). Si une page est ajoutée, l'ajouter aussi à `staticPaths`
dans `server/routes/sitemap.xml.get.ts`.

## Commandes
- npm run dev : serveur de développement
- npm run build : build de production
- npm test : tests Vitest (`npx vitest run shared/utils/form-schemas.test.ts` pour un seul fichier,
  `-t "nom du test"` pour un seul test)
- npm run preview : prévisualiser le build

## Architecture

### i18n
- Locales dans `i18n/locales/fr.json` et `en.json` (mêmes clés dans les deux).
  Clés de haut niveau : `brand`, `navigation`, `pages.<page>`, `forms`, `servicesList`,
  `processSteps`, `quoteStartingPrices`, `structuredData`, `footer`…
- Stratégie `prefix_except_default` : FR sans préfixe, EN sous `/en`. Pas de détection
  automatique de la langue du navigateur.
- `LanguageSwitcher.vue` utilise `useSwitchLocalePath`.

### SEO
- `app/composables/usePageSeo.ts` centralise title/description/og/twitter, l'URL
  canonique, les `hreflang` fr/en/x-default et `<html lang>`. og:image = `/logo.svg`.
- L'URL de base vient de `NUXT_PUBLIC_SITE_URL` (sinon l'origine de la requête).
- La page d'accueil ajoute en plus des données structurées JSON-LD via `useHead`.
- `server/routes/sitemap.xml.get.ts` génère le sitemap (pages statiques + réalisations FR,
  avec alternatives EN).

### Réalisations (Nuxt Content)
- Schéma dans `content.config.ts` (collection `realisations`) : `slug`, `language` (fr|en),
  `client`, `sector`, `technologies`, `link`, `summary`, `featured`, plus `title`.
- Une réalisation = deux fichiers : `content/realisations/<slug>.md` (FR) et
  `content/realisations/en/<slug>.md` (EN), avec le **même `slug`** et `language` différent.
- Les pages filtrent par `language = locale` et `slug`.

### Formulaires (devis et contact)
Flux : `QuoteRequestForm.vue` → `POST /api/devis`, `ContactMessageForm.vue` → `POST /api/contact`.
- Schémas Zod dans `shared/utils/form-schemas.ts`, utilisés **côté client et côté serveur**.
  Les champs texte sont normalisés (NFC, suppression des caractères invisibles, espaces
  compactés). Ne pas restreindre les caractères : apostrophes, accents, guillemets doivent passer.
- Options des selects (type de projet, budget en FCFA) dans `shared/utils/form-options.ts` ;
  `value` doit rester synchronisée avec les `z.enum` du schéma, `messageKey` pointe vers
  `forms.projectTypes` / `forms.budgets` dans i18n.
- `server/utils/form-submission.ts` : limitation de débit en mémoire (5 requêtes / 10 min / IP),
  envoi Resend (`replyTo` = email du visiteur), erreurs typées `FormSubmissionError`.
- Anti-spam : champ honeypot `contact_pref_hp` et `fillDurationMs` (< 3 s = bot). Dans ces cas
  le serveur répond `{ success: true }` **sans envoyer** l'email.
- Réponses d'erreur : `{ success: false, code, message, fieldErrors? }` avec les codes
  `VALIDATION_ERROR`, `RATE_LIMITED`, `MAIL_NOT_CONFIGURED`, `MAIL_DELIVERY_FAILED`,
  `INTERNAL_ERROR`. Les composants traduisent ces codes via `forms.errors.*`.
- Tests dans `shared/utils/form-schemas.test.ts`.

### Variables d'environnement (voir `.env.example`)
- Serveur (secrets) : `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- Publiques (`runtimeConfig.public`) : `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_CONTACT_EMAIL`,
  `NUXT_PUBLIC_CONTACT_PHONE`, `NUXT_PUBLIC_CONTACT_LOCATION` (utilisées par Contact,
  Mentions légales, Politique de confidentialité)

### Layout et erreurs
- `app/layouts/default.vue` : `AppHeader` + `<main id="main-content">` + `AppFooter`.
- `app/error.vue` gère 404 et autres erreurs (il réinclut header/footer car il n'utilise pas le layout).

## Identité
- Marque : DIGISERVICE
- Accroche : « Des sites web qui travaillent pour votre entreprise. »
- Sous-titre : « Sites vitrines, e-commerce et applications web sur mesure. »
- Couleurs (déclarées dans le bloc `@theme` de `app/assets/css/main.css`, Tailwind v4) :
  primary #0B1F3A, primary-light #16345C, accent #F59E0B,
  surface #F4F7FB, ink #1F2937
- Style : sobre, professionnel, beaucoup d'espace, boutons d'action en accent

## Logo
- Fichiers dans /public : logo.svg (fond clair), logo-light.svg (fond sombre), favicon.svg
- Header : logo.svg ; footer sombre : logo-light.svg
- favicon.svg déclaré dans nuxt.config (app.head.link)

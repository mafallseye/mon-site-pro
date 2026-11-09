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
- Enregistrement des formulaires dans Supabase (API REST, clé service_role côté serveur)
- Tests : Vitest
- Déploiement : Vercel (preset Nitro `vercel`, Node 22 LTS via `engines`)

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
- Design : aucune couleur, police, taille de texte, rayon ou ombre en dur dans les composants
  (ni hex, ni valeur arbitraire `[...]`) : utiliser les jetons (voir Identité). Réutiliser les
  composants communs plutôt que recopier des classes (voir Composants)

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
  `client`, `sector`, `technologies`, `link`, `summary`, `featured`, plus `title`, et les captures
  facultatives `image` (ordinateur, 1440×900) / `imageMobile` (780 px de large), en WebP dans
  `public/realisations/<slug>-desktop.webp` et `-mobile.webp`. Sans `image` : `ImagePlaceholder`.
  Affichage : `ProjectCard` (capture ordinateur) et `ProjectGallery` (page détail, les deux).
- Une réalisation = deux fichiers : `content/realisations/<slug>.md` (FR) et
  `content/realisations/en/<slug>.md` (EN), avec le **même `slug`** et `language` différent.
- Les pages filtrent par `language = locale` et `slug`.

### Formulaires (devis et contact)
Flux : `QuoteRequestForm.vue` → `POST /api/devis`, `ContactMessageForm.vue` → `POST /api/contact`.
- Schémas Zod dans `shared/utils/form-schemas.ts`, utilisés **côté client et côté serveur**.
  Dans `app/`, les importer via l'alias `#shared/utils/...` (un import relatif `../../shared/...`
  casse `npm run build` : Nuxt externalise `shared/` du build serveur Vite). `server/` garde ses
  imports relatifs.
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
- Cas particulier : demande enregistrée dans Supabase mais email Resend en échec → HTTP 202
  `{ success: true, code: 'STORED_NOTIFICATION_FAILED' }` ; le formulaire passe en état
  `received`, se vide et affiche `pages.quote.received` / `pages.contact.received`
  (« bien reçue, inutile de renvoyer »).
- Enregistrement : dans le callback de `deliverFormSubmission` (donc APRÈS l'anti-spam),
  `storeThenNotify` (`server/utils/form-submission.ts`) insère d'abord dans Supabase
  (`server/utils/supabase.ts`, tables `quote_requests` / `contact_messages`) puis envoie l'email.
  Échec Supabase → journalisé (clé masquée), l'email part quand même. Échec Resend avec ligne
  enregistrée → `status = 'notification_echouee'` et réponse 202 `STORED_NOTIFICATION_FAILED`.
  Échec Resend sans ligne enregistrée → l'erreur Resend est renvoyée (le visiteur doit réessayer).
- Supabase : migrations SQL dans `supabase/migrations` ; RLS activée sans aucune politique
  (aucun accès anon/authenticated). Les listes `project_type` / `budget` / `language` du SQL
  doivent rester synchronisées avec `z.enum` et `form-options.ts`.
- Tests : `shared/utils/form-schemas.test.ts`, `server/utils/*.test.ts`,
  `server/api/form-routes.test.ts` (routes de bout en bout, globals Nitro, Resend et fetch simulés).

### Variables d'environnement (voir `.env.example`)
- Serveur (secrets) : `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- Serveur, runtimeConfig PRIVÉ : `NUXT_SUPABASE_URL`, `NUXT_SUPABASE_SERVICE_ROLE_KEY`
  (`supabaseUrl` / `supabaseServiceRoleKey`, lus avec `useRuntimeConfig(event)` ; jamais dans `public`)
- Publiques (`runtimeConfig.public`) : `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_CONTACT_EMAIL`,
  `NUXT_PUBLIC_CONTACT_PHONE`, `NUXT_PUBLIC_CONTACT_LOCATION` (utilisées par Contact,
  Mentions légales, Politique de confidentialité), `NUXT_PUBLIC_CONTACT_WHATSAPP`
  (lien wa.me via `useWhatsAppLink()`, page Contact et footer)

### Composants communs (`app/components`)
- Page À propos : textes dans `pages.about.*` (présentation, `experience[]`, `skills[]`), repris du
  portfolio `mafallseye/my-portfolio` ; ne pas inventer de parcours ni de compétences.
- Mise en page : `PageHeader` (seul h1 de la page + filet or + intro), `SectionHeading` (h2 + intro),
  `BrandMark` (composition décorative du monogramme), `LegalPage` (gabarit des pages légales).
- Actions : `AppButton` (`variant` primary = or / secondary = contour émeraude ; `to` = lien),
  `TextLink` (lien texte souligné, `href` = externe), `AppIcon` (icônes décoratives).
- Contenu : `ProjectCard`, `ImagePlaceholder`, `TechBadges`, `StepBadge`.
- Formulaires : `FormField` (input/select/textarea + libellé + erreur reliée), `FormFieldError`,
  `FormAlert` (succès/erreur), `FormHoneypot` ; logique commune dans
  `app/composables/useFormSubmission.ts` (validation, anti-spam, codes d'erreur).
- Navigation : `useMainNavigation()` partagé par `AppHeader` (menu burger sous 1280 px : Échap,
  clic extérieur et sortie du focus le ferment) et `AppFooter`.
- Zones sombres (footer, bandes émeraude) : ajouter la classe `zone-dark` pour un focus or visible.

### Layout et erreurs
- `app/layouts/default.vue` : `AppHeader` + `<main id="main-content">` + `AppFooter`.
- `app/error.vue` gère 404 et autres erreurs (il réinclut header/footer car il n'utilise pas le layout).

## Identité
- Marque : DIGISERVICES
- Accroche : « Des sites web qui travaillent pour votre entreprise. »
- Sous-titre : « Sites vitrines, e-commerce et applications web sur mesure. »
- Palette « Émeraude & or » (pas de bleu ni de violet). Spécification complète, contrastes
  calculés et états des composants : `docs/design.md`.
- Jetons déclarés UNIQUEMENT dans le bloc `@theme` de `app/assets/css/main.css` (Tailwind v4,
  pas de tailwind.config). Les couleurs, polices, tailles de texte, rayons et ombres natifs de
  Tailwind y sont désactivés (`--color-*: initial`…) : `text-slate-600`, `text-sm`, `rounded-lg`
  ne produisent plus rien. Toute nouvelle valeur s'ajoute dans ce bloc.
  - Fond `bg` #F7F4EC, cartes `surface` #FFFDF8, bandes `surface-muted` #EFE9DA
  - Texte `ink` #10231C, texte secondaire `ink-muted` #4B5D55
  - `primary` (émeraude) #0B5D46 : titres, liens, focus ; `primary-strong` #084A38 (survol, encarts),
    `primary-soft` #E2EEE8 (badges, survols)
  - `accent` (or) #E8A317 : boutons principaux (texte `ink` dessus), filets, pastilles ;
    `accent-strong` #D4920F au survol. **Jamais de texte or sur fond clair** (1,97:1).
  - Bordures : `line` #E3DCCB (décoratif), `line-strong` #6F7C75 (champs, ≥ 3:1)
  - États : `success-ink/bg/line` #1F6435/#E7F3EA/#2E7D4B, `error-ink/bg/line` #A3201A/#FCEBE8/#B42318
  - Zone sombre (footer) : `dark-bg` #0D2A21, `dark-ink` #F7F4EC, `dark-ink-muted` #B8C7BF,
    `dark-line` #2C4A3F ; l'or y est autorisé en texte (7,07:1)
  - Focus : `focus` #0B5D46 (zone claire), `focus-dark` #E8A317 (classe `zone-dark`)
  - Texte sur émeraude : `on-primary` #FFFFFF, `on-primary-muted` #CFE0D8
- Polices (auto-hébergées via @fontsource, licence OFL) : Fraunces 600 pour h1/h2
  (`font-display`), Inter 400/600 pour le reste (`font-sans`). Échelle : `text-display`, `text-h1`,
  `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small`, `text-eyebrow`, `text-stat`, `text-code`.
- Autres jetons : `rounded-control|card|badge`, `shadow-card|raised`, `py-section(-sm)`,
  `max-w-content|prose-content|steps|form`, `size-tap`/`min-h-tap` (44 px), `min-h-control` (48 px),
  `aspect-card|wide`, `grid-cols-main-aside`.
- Style : sobre, chaleureux, beaucoup d'espace, une seule action or par zone, filets et pastilles
  or en ponctuation. Header clair (filet or), footer sombre. Navigation desktop à partir de 1280 px.

## Logo
- Fichiers dans /public (wordmark vectorisé, viewBox 277×64) :
  - logo.svg (fond clair : header, og:image) : carré émeraude #0B5D46, « D » blanc, point or,
    DIGI #10231C / SERVICES #0B5D46
  - logo-light.svg (fond sombre : footer) : carré crème #F7F4EC, « D » émeraude, point or cerclé
    d'émeraude, DIGI #F7F4EC / SERVICES #E8A317
  - favicon.svg (carré + « D » + point or agrandi, lisible à 32 px) et favicon.ico (16/32/48)
- Header : logo.svg ; footer sombre : logo-light.svg ; `<img width="277" height="64">`
- favicon.svg et favicon.ico déclarés dans nuxt.config (app.head.link)
- Garder la même construction (carré arrondi, « D » évidé, point d'accent) pour toute variante.

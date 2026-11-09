# DIGISERVICE — Spécification de design (refonte « Émeraude & or »)

> Périmètre : refonte **visuelle uniquement**. Contenu, routes, formulaires, SEO et i18n inchangés.
> Aucun texte, chiffre, témoignage, logo client ni photo n'est ajouté. Les textes cités sont des clés de `i18n/locales/fr.json` (mêmes clés dans `en.json`) ou des champs des réalisations (`content/realisations/*.md`).
> Tous les rapports de contraste ci-dessous ont été calculés (formule WCAG 2.x, rapport « premier sur second »).

---

## 1. Direction artistique

- **Ton** : sobre, chaleureux, digne de confiance. Une développeuse indépendante qui parle à des PME du Sénégal et d'ailleurs : sérieux sans froideur corporate.
- **Inspirations** : papier crème des éditions soignées, verts profonds et or des tissus et de l'artisanat d'Afrique de l'Ouest, interfaces éditoriales (titres à empattement, beaucoup de blanc, filets fins).
- **Principes** : un grand titre par écran, du vide, une seule action dorée visible à la fois par zone, des filets et pastilles or comme ponctuation.
- **On évite** : bleu et violet (y compris les `slate-*` bleutés actuels), dégradés criards, ombres lourdes, glassmorphism, icônes décoratives en surnombre, photos de banque d'images, faux logos clients, animations gratuites.
- **Or** : jamais en texte sur fond clair. Il sert aux boutons principaux (texte encre dessus), aux filets, puces, pastilles et soulignements décoratifs.
- **Émeraude** : titres, liens, états actifs, focus sur fond clair.

---

## 2. Jetons de couleur

À déclarer **uniquement** dans le bloc `@theme` de `app/assets/css/main.css` (Tailwind v4 n'a pas de `tailwind.config`). Les noms ne reprennent aucune couleur native (`emerald`, `amber`, `green`, `red`… restent intacts). Chaque jeton `--color-x` génère `bg-x`, `text-x`, `border-x`, `ring-x`, `outline-x`, `decoration-x`.

### 2.1 Zone claire (corps de page, header)

| Jeton | Hex | Usage | Contrastes calculés |
|---|---|---|---|
| `--color-bg` | `#F7F4EC` | Fond de page (`body`), fond du header | ink 14.94 · primary 7.16 · ink-muted 6.38 |
| `--color-surface` | `#FFFDF8` | Cartes, formulaires, menu mobile | ink 16.15 · primary 7.74 · ink-muted 6.89 · vs bg 1.08 (une bordure `line` délimite la carte) |
| `--color-surface-muted` | `#EFE9DA` | Bandes alternées, emplacement d'image, encarts de prix | ink 13.55 · primary 6.50 · ink-muted 5.79 · primary-strong 8.47 |
| `--color-ink` | `#10231C` | Texte courant, libellés de champs, texte sur or | sur bg 14.94 · sur surface 16.15 · sur accent 7.57 |
| `--color-ink-muted` | `#4B5D55` | Texte secondaire, intros, placeholders, mentions « facultatif » | sur bg 6.38 · surface 6.89 · surface-muted 5.79 · primary-soft 5.88 |
| `--color-primary` | `#0B5D46` | Titres h1–h3, liens, nav active, fond des bandes émeraude | sur bg 7.16 · surface 7.74 · white sur primary 7.87 · bg (crème) sur primary 7.16 |
| `--color-primary-strong` | `#084A38` | Survol des liens, encart Maintenance, encart coordonnées | sur bg 9.33 · surface 10.09 · white dessus 10.26 · bg dessus 9.33 |
| `--color-primary-soft` | `#E2EEE8` | Fond des badges techno, survol bouton secondaire / items du menu mobile | primary-strong dessus 8.61 · primary dessus 6.61 · ink dessus 13.78 |
| `--color-accent` | `#E8A317` | Fond des boutons principaux, filets, puces, pastilles, lien d'évitement | ink dessus 7.57 · **sur bg 1.97 → interdit en texte et en bordure porteuse d'info** · sur primary 3.63 · sur dark-bg 7.07 |
| `--color-accent-strong` | `#D4920F` | Survol / actif des boutons principaux | ink dessus 6.19 |
| `--color-line` | `#E3DCCB` | Bordures **décoratives** de cartes, séparateurs | vs bg 1.24 (décoratif seulement, jamais seul porteur d'info) |
| `--color-line-strong` | `#6F7C75` | Bordure des champs, select, textarea, case à cocher | sur surface 4.29 · sur bg 3.97 · sur surface-muted 3.60 (≥ 3:1) |
| `--color-focus` | `#0B5D46` | Anneau de focus en zone claire | sur bg 7.16 · surface 7.74 · surface-muted 6.50 · vs accent (bouton adjacent) 3.63 |
| `--color-on-primary` | `#FFFFFF` | Texte sur bandes émeraude / primary-strong | 7.87 sur primary · 10.26 sur primary-strong |
| `--color-on-primary-muted` | `#CFE0D8` | Texte secondaire sur bandes émeraude | 5.74 sur primary · 7.48 sur primary-strong |

**Or « texte »** : on n'en utilise **pas** en zone claire. (Pour mémoire, si un jour c'était indispensable, `#8A5A00` donne 5.39 sur bg ; non retenu, non déclaré.)

### 2.2 États succès / erreur

| Jeton | Hex | Usage | Contrastes calculés |
|---|---|---|---|
| `--color-success-ink` | `#1F6435` | Texte de la bannière succès | 6.28 sur success-bg · 7.04 sur surface |
| `--color-success-bg` | `#E7F3EA` | Fond léger bannière succès | — |
| `--color-success-line` | `#2E7D4B` | Bordure gauche 4 px + icône | 4.43 sur success-bg · 4.98 sur surface · 4.60 sur bg |
| `--color-error-ink` | `#A3201A` | Message d'erreur de champ, texte bannière erreur | 6.55 sur error-bg · 7.43 sur surface · 6.88 sur bg |
| `--color-error-bg` | `#FCEBE8` | Fond léger bannière erreur | — |
| `--color-error-line` | `#B42318` | Bordure des champs invalides, bordure gauche bannière, icône | 6.47 sur surface · 5.98 sur bg · 5.69 sur error-bg |

L'erreur n'est jamais signalée par la couleur seule : bordure rouge **+** icône `!` **+** message texte (déjà relié via `aria-describedby`/`aria-invalid`).

### 2.3 Zone sombre (footer ; variante possible du header)

| Jeton | Hex | Usage | Contrastes calculés |
|---|---|---|---|
| `--color-dark-bg` | `#0D2A21` | Fond du footer (émeraude très sombre) | dark-ink 13.94 · white 15.33 |
| `--color-dark-ink` | `#F7F4EC` | Texte, titres et liens du footer | 13.94 sur dark-bg · 8.85 sur dark-line (survol) |
| `--color-dark-ink-muted` | `#B8C7BF` | Accroche, copyright | 8.73 sur dark-bg · 5.54 sur dark-line |
| `--color-dark-line` | `#2C4A3F` | Séparateurs, fond de survol des liens/boutons de langue | décoratif (1.58 vs dark-bg) |
| `--color-focus-dark` | `#E8A317` | Anneau de focus en zone sombre **et** sur bandes émeraude | 7.07 sur dark-bg · 3.63 sur primary · 4.73 sur primary-strong |

Sur fond sombre, l'or peut servir de **texte** (survol de lien) : 7.07 sur dark-bg, 4.73 sur primary-strong.
Aucune couleur unique n'atteint 3:1 à la fois sur `bg` et sur `primary` : on utilise donc **deux** jetons de focus selon la zone (`focus` en clair, `focus-dark` en sombre/émeraude).

### 2.4 Correspondance avec les classes actuelles (aide à la migration)

| Actuel | Nouveau |
|---|---|
| `bg-white` (sections, cartes, header) | `bg-bg` (sections/header) · `bg-surface` (cartes) |
| `--color-surface` #F4F7FB (fond de page via `body`) | **le sens change** : le fond de page devient `--color-bg` ; `surface` = cartes |
| `text-primary-light`, `--color-primary-light` | `text-primary` (texte) · `hover:text-primary-strong` ; jeton supprimé |
| `text-slate-600` / `text-slate-700` | `text-ink-muted` / `text-ink` |
| `border-slate-200`, `ring-slate-200` | `border-line` (décoratif) |
| `border-slate-300` (champs) | `border-line-strong` |
| `bg-slate-100` (emplacement image) | `bg-surface-muted` |
| `hover:bg-amber-400` | `hover:bg-accent-strong` |
| `text-red-700`, `bg-red-50 text-red-800` | `text-error-ink`, `bg-error-bg text-error-ink border-error-line` |
| `bg-emerald-50 text-emerald-900` | `bg-success-bg text-success-ink border-success-line` |
| Footer `bg-primary`, `text-slate-300` | `bg-dark-bg`, `text-dark-ink` / `text-dark-ink-muted` |
| `text-slate-200` sur fond primary | `text-on-primary-muted` |

---

## 3. Typographie

Deux familles, licence **SIL OFL**, disponibles sur Google Fonts, sous-ensembles `latin` + `latin-ext` (accents français, ç, œ, « », apostrophe typographique ’ présents dans les textes).

| Rôle | Police | Graisses | Repli |
|---|---|---|---|
| Titres h1–h2, grands chiffres (404, prix) | **Fraunces** (empattements doux, chaleureux) | 600 uniquement | `"Fraunces", Georgia, "Times New Roman", serif` |
| Texte, interface, h3, boutons, libellés | **Inter** | 400 et 600 | `"Inter", ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif` |

Total : 3 fichiers de police. Chargement `font-display: swap`, préchargement d'Inter 400 seulement. Auto-hébergement des woff2 recommandé (pas de requête tierce, cohérent avec la politique de confidentialité) ; à défaut Google Fonts avec `display=swap`.

Jetons (`@theme`) : `--font-display` (Fraunces) et `--font-sans` (Inter — remplace volontairement la pile sans-serif par défaut, ce qui permet de retirer le `font-family` codé en dur dans `body`).

Échelle (`--text-*` + `--text-*--line-height`, noms non natifs) :

| Jeton | Taille | Interligne | Police / graisse | Usage |
|---|---|---|---|---|
| `--text-display` | `clamp(2.25rem, 1.6rem + 3.2vw, 3.75rem)` (36→60 px) | 1.08 | Fraunces 600, `letter-spacing: -0.01em` | h1 de l'accueil |
| `--text-h1` | `clamp(2rem, 1.6rem + 2vw, 3rem)` (32→48 px) | 1.12 | Fraunces 600 | h1 des autres pages, 404 |
| `--text-h2` | `clamp(1.625rem, 1.4rem + 1.1vw, 2.25rem)` (26→36 px) | 1.2 | Fraunces 600 | Titres de section |
| `--text-h3` | `1.25rem` (20 px) | 1.35 | Inter 600 | Titres de cartes, étapes |
| `--text-lead` | `1.125rem` (18 px) | 1.65 | Inter 400 | Intros sous h1 |
| `--text-body` | `1rem` (16 px) | 1.65 | Inter 400 | Texte courant, champs (≥ 16 px : pas de zoom iOS) |
| `--text-small` | `0.875rem` (14 px) | 1.55 | Inter 400/600 | Libellés, badges, footer, messages d'erreur |
| `--text-eyebrow` | `0.8125rem` (13 px) | 1.4 | Inter 600, MAJUSCULES, `letter-spacing: 0.14em` | Surtitres (marque, secteur, code d'erreur) |

Longueur de ligne : 65 caractères max pour le texte courant (`max-w-prose-content`, voir §4).

---

## 4. Autres jetons

| Jeton | Valeur | Usage |
|---|---|---|
| `--radius-control` | `0.625rem` (10 px) | Boutons, champs, items de menu |
| `--radius-card` | `1.25rem` (20 px) | Cartes, encarts, emplacements d'image |
| `--radius-badge` | `9999px` | Badges techno, pastilles numérotées |
| `--shadow-card` | `0 1px 2px rgb(16 35 28 / 0.06), 0 8px 24px -12px rgb(16 35 28 / 0.18)` | Cartes au repos |
| `--shadow-raised` | `0 2px 4px rgb(16 35 28 / 0.08), 0 16px 32px -16px rgb(16 35 28 / 0.28)` | Survol des cartes cliquables, menu mobile |
| `--spacing-section-sm` | `4rem` (64 px) | Padding vertical des sections < 768 px (`py-section-sm`) |
| `--spacing-section` | `6rem` (96 px) | Padding vertical des sections ≥ 768 px (`md:py-section`) |
| `--container-content` | `75rem` (1200 px) | Largeur max du contenu (`max-w-content`), gouttière 16 px / 24 px (md) / 32 px (xl) |
| `--container-prose-content` | `42rem` (672 px) | Colonnes de lecture : pages légales, corps des réalisations, intros |

Ombres teintées encre (pas de noir pur). Pas de nouveau jeton de point de rupture : les natifs `md` (768) et `xl` (1280) correspondent à la grille demandée.

---

## 5. Composants et états

Règles communes : transitions `150ms ease-out` sur `color`, `background-color`, `border-color`, `box-shadow` uniquement ; aucune transition sous `prefers-reduced-motion: reduce`. Focus clavier : `outline: 3px solid var(--color-focus); outline-offset: 2px` (zones claires) ; `outline-color: var(--color-focus-dark)` dans le header sombre éventuel, le footer et les bandes émeraude. Le `box-shadow` blanc/bleu actuel du `:focus-visible` global est remplacé.

### Header — **clair** (choix retenu)
- Fond `bg`, filet bas 2 px `accent` (décoratif), hauteur 64 px (mobile) / 80 px (xl). Logo **`logo.svg`** (version fond clair), hauteur 36–40 px. Comportement non collant (inchangé).
- Pourquoi clair : le bouton doré « Demander un devis » (`navigation.quote`) garde le meilleur impact sur crème, le logo principal est la version claire, et le footer sombre ferme la page sans doublon visuel.
- Ordre : lien d'évitement (`navigation.skipToContent`, fond accent, texte ink 7.57, visible au focus) → logo → nav (`navigation.mainLabel`) → sélecteur de langue → bouton principal `navigation.quote`.
- Nav desktop à partir de **xl (1280)** (aujourd'hui `lg`) : 6 libellés FR + FR/EN + bouton ne tiennent pas confortablement à 1024 px.
- **Menu burger (< 1280)** : bouton 44×44, bordure `line-strong`, icône `primary` ; `aria-expanded`, `aria-controls="mobile-navigation"`, `aria-label` = `navigation.openMenu` / `navigation.closeMenu` (déjà en place). À ajouter : **Échap ferme** le menu et rend le focus au bouton ; clic hors du panneau ferme ; à l'ouverture le focus reste sur le bouton (motif « disclosure »), Tab entre dans la liste. Panneau : fond `surface`, `shadow-raised`, items 48 px de haut, survol `bg-primary-soft`, item actif = texte `primary` + barre gauche 3 px `accent` + graisse 600. Bouton devis pleine largeur, puis sélecteur de langue séparé par `line`.
- Variante sombre (si choisie plus tard) : fond `dark-bg`, `logo-light.svg`, liens `dark-ink`, survol texte `accent` (7.07), focus `focus-dark`, burger bordure `dark-line`.

### Lien de navigation
| État | Rendu |
|---|---|
| Normal | Inter 600 14–15 px, `ink` (14.94) |
| Survol | `primary-strong` (9.33) + soulignement 2 px `accent` décalé 6 px |
| Actif (`aria-current="page"`, `active-class`) | `primary` (7.16) + barre 3 px `accent` sous le libellé ; la barre n'est pas seule porteuse : la couleur de texte change aussi et `aria-current` est exposé |
| Focus | anneau `focus` 3 px |

### Sélecteur de langue (`LanguageSwitcher`, `languageSwitcher.*`)
- Clair : cibles 44×44, `radius-control`. Inactif : texte `primary` (7.16), survol `bg-primary-soft` (6.61). Actif : `bg-primary` texte blanc (7.87).
- Sombre (`variant="dark"`) : inactif `dark-ink` (13.94), survol `bg-dark-line` (8.85). Actif : `bg-accent` texte `dark-bg` (7.07). Focus `focus-dark`.

### Footer — sombre
- Fond `dark-bg`, filet haut 3 px `accent`. Logo **`logo-light.svg`**. Accroche `brand.tagline` en `dark-ink-muted` (8.73).
- Titres `footer.navigation`, `footer.contact` : eyebrow `dark-ink`. Liens `dark-ink` (13.94), survol texte `accent` (7.07) + soulignement ; focus `focus-dark`. Liens légaux `footer.legal`, `footer.privacy`. Séparateur `dark-line`, copyright `footer.rights` en `dark-ink-muted`.
- Grille : 1 colonne (< 768), 3 colonnes (≥ 768). Liens 44 px de haut minimum en mobile (padding vertical).

### Bouton principal (or)
| État | Rendu |
|---|---|
| Normal | `bg-accent`, texte `ink` Inter 600 (7.57), `radius-control`, min-h 48 px, padding 24 px horizontal |
| Survol | `bg-accent-strong` (texte 6.19) + `shadow-card` |
| Actif | `bg-accent-strong`, translation 1 px vers le bas (désactivée si mouvement réduit) |
| Focus | anneau `focus` décalé de 2 px (7.16 sur bg ; 3.63 contre le bouton) ; sur bande émeraude/sombre : `focus-dark` |
| Désactivé / envoi (`status === 'loading'`) | opacité 60 %, `cursor: wait`, libellé `pages.quote.sending` / `pages.contact.sending` (texte désactivé exempté de contraste, l'état est aussi annoncé par `aria-busy` sur le formulaire) |

### Bouton secondaire
Bordure 1.5 px `primary` (7.16 sur bg), texte `primary`, fond transparent. Survol `bg-primary-soft` (texte 6.61). Focus `focus`. Sur fond sombre (non utilisé actuellement) : bordure et texte `dark-ink`.

### Lien texte
Texte `primary`, soulignement 1.5 px **`primary`** (le lien diffère de l'encre seulement de 2.09 par la couleur : le soulignement doit donc être bien visible, donc pas en or seul). Survol : `primary-strong` + soulignement passe à 3 px `accent` (décoratif, en plus). Liens « En savoir plus » / « Voir le projet » : flèche `→` décorative (`aria-hidden`) qui glisse de 2 px au survol (sans mouvement réduit). Lien externe `pages.portfolio.visitWebsite` : garde `↗`.

### Carte service (accueil `homeServices.*`, page Services `servicesList.*`)
Fond `surface`, bordure `line`, `radius-card`, `shadow-card`, padding 24 / 32 px. Pastille numérotée « 01 » : disque 40 px `bg-accent`, chiffre `ink` 600 (7.57). Titre `primary`. Texte `ink-muted`. Puces « Ce qui est inclus » : petit disque `accent` 18 px avec coche `ink` (décoratif, `aria-hidden`). Survol (si la carte contient un lien) : `shadow-raised` + bordure `primary-soft`. Pas de carte entièrement cliquable.

### Carte réalisation
Fond `surface`, bordure `line`, `radius-card`. Visuel 16:10 : panneau `surface-muted` avec motif décoratif (grand « D » du monogramme en filet `line`, pastille `accent`) et le texte existant `pages.portfolio.imagePlaceholder` centré en `ink-muted` (5.79). Corps : surtitre `sector` (eyebrow `primary`), titre `title` (Fraunces, `primary`), `summary` `ink-muted`, badges `technologies`, lien `pages.portfolio.viewProject`. Survol : `shadow-raised`, le visuel ne zoome pas.
Quand de vraies captures seront fournies : `<img>` 16:10, `alt` = titre du projet, `loading="lazy"`.

### Badge technologie
`bg-primary-soft`, texte `primary-strong` 14 px 600 (8.61), `radius-badge`, padding 4 × 12 px. Non interactif : aucun état.

### Champ texte / select / textarea
| État | Rendu |
|---|---|
| Normal | Fond `surface`, bordure 1.5 px `line-strong` (4.29), `radius-control`, min-h 48 px, texte `ink` 16 px, placeholder `ink-muted` (6.89) |
| Survol | bordure `ink-muted` |
| Focus | bordure `primary` + anneau `focus` 3 px (le `outline-none` actuel est remplacé par cet anneau visible) |
| Erreur (`aria-invalid="true"`) | bordure 2 px `error-line` (6.47) + icône `!` dans le champ + message sous le champ |
| Désactivé | fond `surface-muted`, texte `ink-muted` |
Libellé au-dessus, Inter 600 14 px `ink` ; astérisque décoratif conservé (`aria-hidden`), mention `pages.quote.companyOptional` en `ink-muted`. Select : chevron SVG `ink` à droite, `appearance: none`. Textarea : redimensionnement vertical seul.

### Case à cocher + label (consentement)
Case 20×20, bordure 1.5 px `line-strong` (3.97 sur bg / 4.29 sur surface), cochée = fond `primary` coche blanche (7.87) — `accent-color: var(--color-primary)` suffit. Le label entier est cliquable avec un padding vertical pour une cible ≥ 44 px. Lien `pages.quote.consentLink` = lien texte. Focus : anneau `focus` sur la case. Erreur : bordure `error-line` + message.

### Message d'erreur de champ
`text-small`, `error-ink` (7.43 sur surface), icône `!` 16 px `error-line` à gauche, `id` relié par `aria-describedby` (existant). Messages : `forms.errors.*`.

### Bannière d'envoi
- Succès (`role="status"`, `pages.quote.success` / `pages.contact.success`) : `bg-success-bg`, bordure gauche 4 px `success-line`, icône coche, texte `success-ink` (6.28).
- Erreur (`role="alert"`, `forms.errors.rateLimited|unavailable|sendFailed|invalid`) : `bg-error-bg`, bordure gauche 4 px `error-line`, icône `!`, texte `error-ink` (6.55).
- `radius-control`, padding 12 × 16 px, placée juste au-dessus du bouton d'envoi (position actuelle).

### Fil des étapes (process)
- Pastille 44 px : disque `accent`, numéro « 01 » `ink` 600 (7.57). Fil reliant les pastilles : 2 px `accent` (décoratif).
- Accueil (`homeProcess.0–3`) : vertical en mobile, 2 colonnes en md, horizontal sur une ligne en xl (fil horizontal derrière les pastilles).
- Page Process (`processSteps.0–4`) : toujours vertical, fil à gauche, contenu dans une carte `surface` bordure `line`. Liste `<ol>` conservée.

---

## 6. Maquettes textuelles

Gouttières 16 px (base) / 24 px (md) / 32 px (xl), conteneur `max-w-content`. « Bande » = section pleine largeur.

### Accueil (`/`) — ordre actuel conservé
1. **Hero** (fond `bg`, `py-section`). Colonne texte : eyebrow `brand.name` précédé d'un filet or 24 px ; **h1** `pages.home.heroTitle` (`text-display`, `primary`) ; lead `pages.home.heroSubtitle` (`ink-muted`) ; boutons : principal `common.requestQuote` → `/tarifs-devis`, secondaire `pages.home.seeProjects` → `/realisations` (empilés pleine largeur < 768, côte à côte au-delà). Colonne visuelle (xl : 2 colonnes 1.1fr / 0.9fr ; avant : sous le texte, hauteur réduite à 200 px) : **composition décorative** `aria-hidden` qui remplace le logo agrandi actuel : grand carré arrondi `primary` portant le « D » crème du monogramme, recadré, pastille `accent`, 2 arcs fins `accent` concentriques. Pas de texte dans le visuel.
2. **Bande preuve** (`bg-primary`, `py-8`) : `pages.home.proof` centré, `on-primary` (7.87), Inter 600 18 px, encadré par deux filets or courts.
3. **Services** (fond `bg`) : h2 `pages.home.servicesTitle`, intro `pages.home.servicesIntro` ; 3 cartes service (`homeServices.0–2`) avec pastille 01–03 et lien `common.learnMore` → `/services`. 1 / 3 colonnes (md).
4. **Réalisations mises en avant** (bande `surface-muted`) : h2 `pages.home.featuredTitle`, intro `pages.home.featuredIntro`, lien `pages.home.seeProjects` aligné à droite (sous le titre en mobile) ; 2 cartes réalisation (`featured: true`, 1 / 2 colonnes).
5. **Process** (fond `bg`) : h2 `pages.home.processTitle`, intro `pages.home.processIntro`, fil des étapes `homeProcess.0–3`.
6. **CTA final** (bande `primary`, centré) : h2 `pages.home.ctaTitle` (`on-primary`), texte `pages.home.ctaText` (`on-primary-muted` 5.74), bouton or `pages.home.ctaButton` (bouton vs fond 3.63 ; focus `focus-dark`). Bande émeraude et non `dark-bg` pour bien la distinguer du footer qui suit.

### Services (`/services`)
1. **En-tête** (fond `bg`) : h1 `pages.services.title`, lead `pages.services.intro`, filet or 48 px sous le h1.
2. **Offres** : 3 cartes service (`servicesList.0–2`) : pastille 01–03, h2 `title`, `summary`, h3 eyebrow `pages.services.forLabel` + `audience`, h3 eyebrow `pages.services.includesLabel` + liste à puces or `includes.0–1`, bouton or pleine largeur en bas `pages.services.quoteCta`. 1 colonne / 3 colonnes (xl) ; en md, 1 colonne de largeur `prose` pour ne pas écraser le texte.
3. **Maintenance** (encart `bg-primary-strong`, `radius-card`) : h2 `pages.services.maintenanceTitle`, `maintenanceIntro`, h3 `forLabel` + `maintenanceAudience`, h3 `includesLabel` + `maintenanceIncludes`, `maintenanceExperience` ; textes `on-primary` (10.26) / `on-primary-muted` (7.48), eyebrows avec puce or ; bouton or `quoteCta` (4.73 vs fond). 2 colonnes (texte / bouton) en md.

### Réalisations — liste (`/realisations`)
1. **En-tête** : h1 `pages.portfolio.title`, lead `pages.portfolio.intro`.
2. **Grille** de cartes réalisation (toutes les réalisations de la langue) : 1 / 2 colonnes (md). Titre de carte en **h2** (structure actuelle). Avec seulement 2 projets, la grille reste équilibrée ; pas de filtre ajouté.

### Réalisation — détail (`/realisations/[slug]`)
1. **En-tête** : lien retour `common.backToProjects` (flèche ←), eyebrow `sector`, **h1** `title`, lead `summary` (max `prose`).
2. **Visuel** 16:7 (16:10 en mobile) : même panneau décoratif que la carte, avec `pages.portfolio.imagePlaceholder`.
3. **Deux colonnes** (xl : contenu + aside 18 rem ; avant : aside sous le contenu) : corps Markdown (`ContentRenderer`) en `ink`, 17 px, interligne 1.7, largeur `prose` ; **fiche projet** en carte `surface` avec filet or en haut : `dl` `pages.portfolio.clientLabel` / `client`, `sectorLabel` / `sector`, `technologyLabel` / badges, puis bouton secondaire `pages.portfolio.visitWebsite ↗` (lien externe, `target="_blank"` conservé).

### À propos (`/a-propos`)
Contenu actuel : uniquement le h1 `pages.about.title`. **Solution graphique, sans nouveau texte** : en-tête de page centré verticalement dans un bloc d'au moins 50 vh, h1 en `text-h1` `primary` avec filet or, accompagné à droite (xl) ou en dessous (mobile) de la même composition monogramme que le hero d'accueil (`aria-hidden`), sur fond `bg` avec un grand quart de cercle `surface-muted` en arrière-plan. La page ne paraît ainsi ni cassée ni vide. Ajouter du texte (par exemple réutiliser `brand.tagline` ou rédiger une présentation) est une décision de contenu, **hors périmètre** : à faire valider par la propriétaire.

### Contact (`/contact`)
1. **En-tête** : h1 `pages.contact.title`, lead `pages.contact.intro`.
2. **Deux colonnes** (xl : formulaire + aside 20 rem ; avant : aside **sous** le formulaire) :
   - Formulaire (`ContactMessageForm`) en carte `surface` : h2 `pages.contact.formTitle`, champs `pages.contact.name`, `.email`, `.message` (placeholders `placeholder*`), bannières, bouton or `pages.contact.submit`.
   - Aside `bg-primary-strong`, `radius-card` : h2 `pages.contact.detailsTitle` (`on-primary`), liens e-mail / téléphone en `on-primary` soulignés, survol texte `accent` (4.73), focus `focus-dark` ; localisation en `on-primary-muted` ; sinon `pages.contact.missingDetails`. Adresse e-mail : `overflow-wrap: anywhere` (pas de défilement horizontal à 360 px).

### Process (`/process`)
En-tête h1 `pages.process.title` + lead `pages.process.intro`, puis fil des étapes vertical `processSteps.0–4` (h2 par étape, conteneur `prose` élargi à 48 rem).

### Tarifs et devis (`/tarifs-devis`)
En-tête h1 `pages.quote.title` + lead `pages.quote.intro`. Carte formulaire (`QuoteRequestForm`, max 56 rem) : h2 `pages.quote.formTitle`, `pages.quote.formIntro` ; grille des repères `quoteStartingPrices.0–3` en encarts `surface-muted` (h3 `service`, `pages.quote.startingAt` en `ink-muted` 14 px, `amount` en Inter 600 22 px `ink`, chiffres tabulaires) ; `pages.quote.disclaimer` en `ink-muted` 14 px avec puce or ; filet `line` ; champs en 2 colonnes (md) puis description, consentement, bannières, bouton or `pages.quote.submit` (pleine largeur < 768).
Remarques (rien à changer dans cette refonte) : `pages.quote.priceTitle` / `priceIntro` existent mais ne sont pas affichés (et `priceIntro` dit « valeurs d'exemple à remplacer ») ; `pages.quote.description` (méta SEO) vaut « Description du projet ». À signaler à la propriétaire.

### Pages légales (`/mentions-legales`, `/politique-de-confidentialite`)
Colonne `prose` centrée : h1 (`text-h1`), intro `ink-muted`, sections `pages.legal.sections` / `pages.privacy.sections` : h2 en Inter 600 20 px `primary` précédé d'un filet or 24 px ; texte `ink` (et non `ink-muted`, pour la lecture longue), `white-space: pre-line` conservé. Pas d'encadré ni d'ombre.

### 404 et erreur (`app/error.vue`)
Centré sur fond `bg`, min 60 vh : code (`error.statusCode`) en Fraunces 600, 96 px, `primary`, avec la pastille or du monogramme posée en exposant (décorative) ; h1 `pages.notFound.title` / `pages.error.title` ; texte `description` `ink-muted` ; bouton or `backHome`. Header et footer inclus comme aujourd'hui.

---

## 7. Mobile et accessibilité

**Points de rupture** : base = 360 px (mise en page conçue pour 360, fonctionnelle dès 320 : `body { min-width: 320px }` existant) ; `md` = 768 ; `xl` = 1280 (nav desktop, grilles à 3–4 colonnes, hero en 2 colonnes). Le `lg` actuel peut rester pour quelques grilles intermédiaires mais n'est pas un palier de maquette.

**Mobile** :
- Cibles tactiles ≥ 44×44 px : burger, liens du menu (48 px), FR/EN, boutons (48 px), liens du footer, case + label de consentement.
- Aucun défilement horizontal à 320/360 px : pas de largeur fixe > 100 %, `overflow-wrap: anywhere` sur e-mails et URLs, badges en `flex-wrap`, visuels décoratifs en `overflow: hidden`.
- Boutons d'action pleine largeur < 768 px ; champs en 1 colonne < 768 px.
- Taille de police des champs ≥ 16 px.

**Accessibilité** :
- **Un seul h1 par page** (vérifié dans la structure actuelle) ; ordre h1 → h2 → h3 sans saut (cartes accueil en h3 sous h2 ; cartes réalisations en h2 sur la liste ; titres du footer en h2).
- Lien d'évitement `navigation.skipToContent` vers `#main-content` : conservé, restylé (or, texte ink 7.57).
- Focus toujours visible (3 px, ≥ 3:1 : `focus` en clair, `focus-dark` en sombre/émeraude) ; jamais `outline-none` sans remplacement.
- `prefers-reduced-motion: reduce` : supprimer transitions, translations et le `scroll-behavior: smooth` actuel (le placer sous `@media (prefers-reduced-motion: no-preference)`).
- Couleur jamais seule porteuse d'information : erreurs (icône + texte), nav active (couleur + barre + `aria-current`), liens (soulignement).
- `alt` : logos = `brand.name` (existant) ; visuels décoratifs `alt=""` + `aria-hidden` ; futures captures de projet = titre du projet.
- Menu mobile : Échap, retour du focus, `aria-expanded` à jour (cf. §5).
- Formulaires : libellés visibles, `aria-invalid`, `aria-describedby`, `role="alert"` / `role="status"` et focus sur le premier champ invalide (déjà en place, à conserver).
- `lang` sur les liens FR/EN (existant) ; contenus anglais avec accents testés avec les mêmes polices.

---

## 8. Logo (`public/logo.svg`, `public/logo-light.svg`, `public/favicon.svg`)

Même construction qu'aujourd'hui : carré 64×64 `rx=14` + « D » évidé (même tracé) + point d'accent (cercle `cx=47 cy=47`) + wordmark **DIGI** (graisse forte) / **SERVICE** (graisse normale), viewBox 300×64.

| Élément | `logo.svg` (fond clair : header, og:image) | `logo-light.svg` (fond sombre : footer) | `favicon.svg` |
|---|---|---|---|
| Carré | `#0B5D46` | `#F7F4EC` | `#0B5D46` |
| « D » | `#FFFFFF` (7.87 sur carré) | `#0B5D46` (7.16 sur carré) | `#FFFFFF` |
| Point | `#E8A317` (3.63 sur carré) | `#E8A317` + contour 1.5 px `#0B5D46` (l'or seul ne fait que 1.97 sur crème) | `#E8A317`, rayon porté à 5.5 |
| DIGI | `#10231C` (14.94 sur bg) | `#F7F4EC` (13.94 sur dark-bg) | — |
| SERVICE | `#0B5D46` (7.16 sur bg, 7.74 sur surface) | `#E8A317` (7.07 sur dark-bg) | — |

Remarques :
- Le wordmark est aujourd'hui un `<text>` en Inter : dans un `<img>`, un SVG ne charge pas les polices web, donc le rendu dépend des polices installées. **Vectoriser le wordmark** (Inter 700 pour DIGI, 400 pour SERVICE, interlettrage 1.5) pour un rendu identique partout.
- **32 px** (favicon, onglets) : le « D » reste lisible (contre-forme ≈ 4.5 px de large). Le point (≈ 4.5 px de diamètre) reste visible mais fragile, d'où le rayon 5.5 dans le favicon uniquement. À 16 px, le point devient un pixel : acceptable, le « D » blanc sur émeraude porte l'identité. Le wordmark n'est jamais utilisé sous 120 px de large.
- Barre d'onglets sombre : carré émeraude sur gris foncé peu contrasté, mais le « D » blanc reste net ; pas de variante nécessaire.
- `public/favicon.ico` (ancienne couleur marine) est à régénérer depuis le nouveau `favicon.svg`.
- Les logos sont exemptés des exigences de contraste WCAG ; les valeurs ci-dessus visent tout de même ≥ 3:1 pour chaque élément.
- Mettre à jour la section « Identité » de `CLAUDE.md` avec les nouveaux jetons une fois la refonte validée (hors de ce document).

---

## 9. Récapitulatif des contrastes calculés

| Premier plan | Fond | Rapport | Usage | Seuil visé |
|---|---|---|---|---|
| ink #10231C | bg #F7F4EC | 14.94 | texte courant | AA 4.5 ✔ |
| ink #10231C | surface #FFFDF8 | 16.15 | texte dans cartes | 4.5 ✔ |
| ink #10231C | surface-muted #EFE9DA | 13.55 | texte en bande alternée | 4.5 ✔ |
| ink #10231C | primary-soft #E2EEE8 | 13.78 | menu mobile survolé | 4.5 ✔ |
| ink #10231C | accent #E8A317 | 7.57 | texte bouton principal, lien d'évitement, pastilles | 4.5 ✔ |
| ink #10231C | accent-strong #D4920F | 6.19 | bouton principal survol | 4.5 ✔ |
| ink-muted #4B5D55 | bg | 6.38 | texte secondaire | 4.5 ✔ |
| ink-muted #4B5D55 | surface | 6.89 | texte secondaire, placeholders | 4.5 ✔ |
| ink-muted #4B5D55 | surface-muted | 5.79 | texte d'emplacement d'image | 4.5 ✔ |
| ink-muted #4B5D55 | primary-soft | 5.88 | (réserve) | 4.5 ✔ |
| primary #0B5D46 | bg | 7.16 | titres, liens, focus, bordure bouton secondaire | 4.5 ✔ |
| primary #0B5D46 | surface | 7.74 | titres en carte, focus | 4.5 ✔ |
| primary #0B5D46 | surface-muted | 6.50 | titres en bande, focus | 4.5 ✔ |
| primary #0B5D46 | primary-soft | 6.61 | bouton secondaire / langue au survol | 4.5 ✔ |
| primary #0B5D46 | accent | 3.63 | anneau de focus contre bouton or | 3 ✔ |
| primary #0B5D46 | ink | 2.09 | lien vs texte voisin → soulignement obligatoire | (info) |
| primary-strong #084A38 | bg | 9.33 | liens au survol | 4.5 ✔ |
| primary-strong #084A38 | surface | 10.09 | liens au survol | 4.5 ✔ |
| primary-strong #084A38 | primary-soft | 8.61 | badges techno | 4.5 ✔ |
| primary-strong #084A38 | surface-muted | 8.47 | liens en bande alternée | 4.5 ✔ |
| white #FFFFFF | primary | 7.87 | texte bandes émeraude, langue active | 4.5 ✔ |
| white #FFFFFF | primary-strong | 10.26 | encarts Maintenance / coordonnées | 4.5 ✔ |
| bg #F7F4EC | primary | 7.16 | « D » du logo-light / texte crème sur émeraude | 4.5 ✔ |
| bg #F7F4EC | primary-strong | 9.33 | idem | 4.5 ✔ |
| on-primary-muted #CFE0D8 | primary | 5.74 | texte secondaire CTA | 4.5 ✔ |
| on-primary-muted #CFE0D8 | primary-strong | 7.48 | texte secondaire encarts | 4.5 ✔ |
| accent #E8A317 | primary | 3.63 | focus-dark sur émeraude, bouton or vs bande | 3 ✔ |
| accent #E8A317 | primary-strong | 4.73 | survol liens en encart, focus | 4.5 ✔ |
| accent #E8A317 | bg | 1.97 | **interdit** texte / bordure porteuse | ✘ (décor uniquement) |
| accent #E8A317 | surface | 2.13 | décor uniquement | ✘ (décor) |
| line-strong #6F7C75 | surface | 4.29 | bordure de champ | 3 ✔ |
| line-strong #6F7C75 | bg | 3.97 | case à cocher sur fond de page | 3 ✔ |
| line-strong #6F7C75 | surface-muted | 3.60 | bordure sur bande | 3 ✔ |
| line #E3DCCB | bg | 1.24 | bordure décorative | (décor) |
| success-ink #1F6435 | success-bg #E7F3EA | 6.28 | bannière succès | 4.5 ✔ |
| success-ink #1F6435 | surface | 7.04 | — | 4.5 ✔ |
| success-line #2E7D4B | success-bg | 4.43 | bordure / icône | 3 ✔ |
| success-line #2E7D4B | surface | 4.98 | bordure / icône | 3 ✔ |
| success-line #2E7D4B | bg | 4.60 | bordure / icône | 3 ✔ |
| error-ink #A3201A | error-bg #FCEBE8 | 6.55 | bannière erreur | 4.5 ✔ |
| error-ink #A3201A | surface | 7.43 | message d'erreur de champ | 4.5 ✔ |
| error-ink #A3201A | bg | 6.88 | message d'erreur hors carte | 4.5 ✔ |
| error-line #B42318 | surface | 6.47 | bordure champ invalide | 3 ✔ |
| error-line #B42318 | bg | 5.98 | bordure champ invalide | 3 ✔ |
| error-line #B42318 | error-bg | 5.69 | bordure bannière | 3 ✔ |
| dark-ink #F7F4EC | dark-bg #0D2A21 | 13.94 | texte et liens footer | 4.5 ✔ |
| white #FFFFFF | dark-bg | 15.33 | (réserve) | 4.5 ✔ |
| dark-ink-muted #B8C7BF | dark-bg | 8.73 | accroche, copyright | 4.5 ✔ |
| dark-ink #F7F4EC | dark-line #2C4A3F | 8.85 | langue survolée (footer) | 4.5 ✔ |
| dark-ink-muted #B8C7BF | dark-line | 5.54 | (réserve) | 4.5 ✔ |
| accent #E8A317 | dark-bg | 7.07 | liens survol, SERVICE (logo-light), focus-dark | 4.5 ✔ |
| dark-bg #0D2A21 | accent | 7.07 | langue active (footer) | 4.5 ✔ |
| accent #E8A317 | dark-line | 4.49 | lien survolé sur fond survol | 4.5 ✘ → non utilisé ensemble |
| primary #0B5D46 | dark-bg | 1.95 | **ne pas** utiliser l'émeraude comme focus en zone sombre | ✘ |
| ink #10231C / DIGI | bg | 14.94 | logo.svg | ✔ |

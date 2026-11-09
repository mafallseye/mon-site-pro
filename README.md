# DIGISERVICE — site professionnel

Site vitrine bilingue (FR/EN) de développeuse web : Nuxt 4, Tailwind CSS v4, @nuxtjs/i18n,
Nuxt Content v3. Les formulaires de devis et de contact sont enregistrés dans **Supabase** puis
notifiés par email via **Resend**. Déploiement sur **Vercel**.

Conventions de code, design et architecture : voir [`CLAUDE.md`](CLAUDE.md) et [`docs/design.md`](docs/design.md).

## Prérequis

- Node.js 22 LTS (voir `.nvmrc` et `engines` dans `package.json`)
- Un projet Supabase et un compte Resend (domaine d'envoi vérifié)

## Installation locale

```bash
npm install
cp .env.example .env   # puis renseigner les valeurs
npm run dev            # http://localhost:3000
```

## Variables d'environnement

À renseigner dans `.env` en local et dans Vercel (**Project Settings > Environment Variables**,
environnements *Production* et *Preview*). Ne jamais les commiter.

| Variable | Côté | Rôle |
|---|---|---|
| `RESEND_API_KEY` | serveur (secret) | Clé API Resend |
| `CONTACT_TO_EMAIL` | serveur | Adresse qui reçoit les demandes |
| `CONTACT_FROM_EMAIL` | serveur | Expéditeur vérifié dans Resend (ex. `DIGISERVICE <contact@votre-domaine>`) |
| `NUXT_SUPABASE_URL` | serveur | URL du projet Supabase (`https://<ref>.supabase.co`) |
| `NUXT_SUPABASE_SERVICE_ROLE_KEY` | serveur (**secret**) | Clé `service_role` (ou clé secrète) Supabase |
| `NUXT_PUBLIC_SITE_URL` | public | URL canonique du site (ex. `https://www.votre-domaine.com`) |
| `NUXT_PUBLIC_CONTACT_EMAIL` | public | Email affiché (Contact, Mentions légales, Confidentialité) |
| `NUXT_PUBLIC_CONTACT_PHONE` | public | Téléphone affiché (facultatif) |
| `NUXT_PUBLIC_CONTACT_LOCATION` | public | Localisation affichée (facultatif) |
| `NUXT_PUBLIC_CONTACT_WHATSAPP` | public | Numéro WhatsApp international (ex. `221XXXXXXXXX`), lien « Écrire sur WhatsApp » sur Contact et dans le footer (facultatif) |

La clé Supabase est lue uniquement par les routes serveur via le `runtimeConfig` **privé**
(`supabaseServiceRoleKey` dans `nuxt.config.ts`). Elle n'est jamais envoyée au navigateur :
ne jamais la préfixer par `NUXT_PUBLIC_`.

## Supabase

La migration [`supabase/migrations/20261109120000_create_form_tables.sql`](supabase/migrations/20261109120000_create_form_tables.sql)
crée deux tables :

- `quote_requests` : id, created_at, name, email, company, project_type, budget, deadline,
  description, language, status
- `contact_messages` : id, created_at, name, email, message, language, status

RLS est activée **sans aucune politique** et les droits des rôles `anon` / `authenticated` sont
retirés : aucune lecture ni écriture publique. Seul le serveur (clé `service_role`) écrit.
Consultez les demandes dans le *Table Editor* de Supabase.

Appliquer la migration, au choix :

- **Tableau de bord** : *SQL Editor* > coller le contenu du fichier > *Run* ;
- **CLI Supabase** (après `supabase login` et `supabase link --project-ref <ref>`) :

  ```bash
  supabase db push
  ```

Statuts (`status`) : `nouveau` (par défaut), `notification_echouee` (enregistrée mais email non
envoyé, à traiter manuellement), puis `en_cours`, `traite`, `archive` à gérer à la main.

Les listes autorisées de `project_type`, `budget` et `language` doivent rester synchronisées
avec `shared/utils/form-schemas.ts` et `shared/utils/form-options.ts`.

## Fonctionnement des formulaires

`POST /api/devis` et `POST /api/contact` :

1. limitation de débit (5 requêtes / 10 min / IP) puis validation Zod ;
2. anti-spam : honeypot `contact_pref_hp` ou remplissage en moins de 3 s → réponse
   `{ success: true }` **sans enregistrer ni envoyer** ;
3. enregistrement dans Supabase ;
   - en cas d'échec (Supabase indisponible ou non configuré), l'erreur est journalisée
     (sans la clé) et **l'email part quand même** ;
4. envoi de l'email Resend ;
   - en cas d'échec alors que la demande est enregistrée : statut `notification_echouee`,
     réponse HTTP 202 `STORED_NOTIFICATION_FAILED`, et le visiteur voit « Votre demande a bien
     été reçue. Inutile de la renvoyer… » (le formulaire se vide, pas de doublon) ;
   - en cas d'échec alors que rien n'a pu être enregistré : message d'erreur
     (`MAIL_DELIVERY_FAILED` ou `MAIL_NOT_CONFIGURED`) invitant à réessayer.

Pensez à consulter régulièrement les lignes `notification_echouee` dans Supabase : aucune
notification email n'a été envoyée pour elles.

Limite connue : la limitation de débit est en mémoire, donc propre à chaque instance serverless
sur Vercel (protection partielle).

## Déploiement Vercel

Le preset Nitro `vercel` est défini dans `nuxt.config.ts` ; Node 22 est imposé par `engines`.

1. Se connecter : `npx vercel login`, puis lier le projet depuis la racine : `npx vercel link`
   (ou importer le dépôt GitHub depuis le tableau de bord Vercel, framework détecté : Nuxt).
2. Renseigner les variables d'environnement ci-dessus (Production et Preview).
3. Appliquer la migration Supabase (voir plus haut).
4. Déployer : push sur la branche de production, ou `npx vercel --prod`.
5. Vérifier : envoyer un devis et un message de test, puis contrôler l'email reçu et les lignes
   dans Supabase.

## Commandes

```bash
npm run dev       # serveur de développement
npm test          # tests Vitest (schémas, Supabase, routes de formulaires)
npm run build     # build de production (preset Vercel → .vercel/output)
```

Prévisualiser un build en local (preset Node au lieu de Vercel) :

```bash
NITRO_PRESET=node-server npm run build && npm run preview
```

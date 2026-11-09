-- Demandes de devis et messages de contact du site DIGISERVICE.
-- Écriture uniquement côté serveur (routes Nuxt server/api) avec la clé service_role,
-- qui contourne la RLS. RLS activée et AUCUNE politique : les rôles anon et authenticated
-- (clé publique) ne peuvent ni lire ni écrire.
-- Les listes de valeurs (type de projet, budget, langue) doivent rester synchronisées avec
-- shared/utils/form-schemas.ts (z.enum) et shared/utils/form-options.ts.

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  company text check (company is null or char_length(company) <= 160),
  project_type text not null check (project_type in ('site-vitrine', 'e-commerce', 'application-web', 'maintenance', 'autre')),
  budget text not null check (budget in ('moins-250k', '250k-500k', '500k-1m', '1m-2m', 'plus-2m', 'a-definir')),
  deadline text not null check (char_length(deadline) between 1 and 120),
  description text not null check (char_length(description) between 1 and 5000),
  language text not null default 'fr' check (language in ('fr', 'en')),
  status text not null default 'nouveau'
    check (status in ('nouveau', 'notification_echouee', 'en_cours', 'traite', 'archive'))
);

comment on table public.quote_requests is 'Demandes de devis du formulaire /tarifs-devis (écriture serveur uniquement).';
comment on column public.quote_requests.status is 'nouveau | notification_echouee (email Resend non envoyé) | en_cours | traite | archive';

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  language text not null default 'fr' check (language in ('fr', 'en')),
  status text not null default 'nouveau'
    check (status in ('nouveau', 'notification_echouee', 'en_cours', 'traite', 'archive'))
);

comment on table public.contact_messages is 'Messages du formulaire /contact (écriture serveur uniquement).';

create index quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- RLS activée, aucune politique => aucun accès pour anon / authenticated.
alter table public.quote_requests enable row level security;
alter table public.contact_messages enable row level security;

-- Ceinture et bretelles : retirer aussi les privilèges de table aux rôles exposés par l'API.
revoke all on table public.quote_requests from anon, authenticated;
revoke all on table public.contact_messages from anon, authenticated;

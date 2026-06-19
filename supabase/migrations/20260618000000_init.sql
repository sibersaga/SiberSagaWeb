create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists programs (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists achievements (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agendas (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists news (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stats (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists faqs (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists downloads (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admins (
  id text primary key,
  email text not null unique,
  payload jsonb not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists registrations (
  id text primary key,
  payload jsonb not null,
  submitted_at text,
  timestamp bigint,
  created_at timestamptz not null default now()
);

create trigger settings_updated_at
before update on settings
for each row execute function set_updated_at();

create trigger programs_updated_at
before update on programs
for each row execute function set_updated_at();

create trigger achievements_updated_at
before update on achievements
for each row execute function set_updated_at();

create trigger agendas_updated_at
before update on agendas
for each row execute function set_updated_at();

create trigger news_updated_at
before update on news
for each row execute function set_updated_at();

create trigger stats_updated_at
before update on stats
for each row execute function set_updated_at();

create trigger gallery_updated_at
before update on gallery
for each row execute function set_updated_at();

create trigger faqs_updated_at
before update on faqs
for each row execute function set_updated_at();

create trigger downloads_updated_at
before update on downloads
for each row execute function set_updated_at();

create trigger admins_updated_at
before update on admins
for each row execute function set_updated_at();

create index if not exists registrations_timestamp_idx on registrations (timestamp desc);
create index if not exists admins_enabled_idx on admins (enabled);

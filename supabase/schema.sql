-- ============================================================
--  Care Bridge Kenya — Full Database Schema
--  Run in: Supabase Dashboard → SQL Editor → New Query
--  This script is idempotent (safe to re-run).
-- ============================================================

-- ─── EXTENSIONS ────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES ───────────────────────────────────────────
-- Extends the built-in auth.users table
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  bio             text,
  phone_number    text,
  county          text,
  id_number       text,           -- National ID / Passport
  is_verified     boolean not null default false,
  role            text not null default 'user' check (role in ('user','admin')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can view profiles
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles for select using (true);

-- Users can update their own profile
drop policy if exists "profiles_own_write" on public.profiles;
create policy "profiles_own_write"
  on public.profiles for update using (auth.uid() = id);

-- Automatically create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 2. CAMPAIGNS ──────────────────────────────────────────
create table if not exists public.campaigns (
  id                  uuid primary key default uuid_generate_v4(),
  creator_id          uuid not null references public.profiles(id) on delete cascade,
  title               text not null,
  slug                text not null unique,
  category            text not null check (category in ('school_fees','medical','emergency','community','other')),
  target_amount       numeric(14,2) not null check (target_amount > 0),
  current_amount      numeric(14,2) not null default 0,
  currency            text not null default 'KES' check (currency in ('KES','USD')),
  story               text not null default '',
  beneficiary_name    text,
  beneficiary_relationship text,
  county              text,
  town                text,
  deadline            timestamptz,
  no_deadline         boolean not null default false,
  status              text not null default 'draft'
                        check (status in ('draft','pending_review','active','completed','rejected','closed')),
  is_featured         boolean not null default false,
  is_urgent           boolean not null default false,
  is_verified         boolean not null default false,
  view_count          integer not null default 0,
  rejection_reason    text,
  -- Payment withdrawal info
  withdrawal_mpesa_number   text,
  withdrawal_mpesa_name     text,
  withdrawal_mpesa_type     text check (withdrawal_mpesa_type in ('personal','paybill','till')),
  withdrawal_paybill_number text,
  withdrawal_paybill_account text,
  withdrawal_till_number    text,
  withdrawal_bank_name      text,
  withdrawal_bank_account   text,
  withdrawal_bank_branch    text,
  withdrawal_bank_account_name text,
  withdrawal_paypal_email   text,
  -- Identity verification
  id_number           text,
  id_document_front   text,   -- storage URL
  id_document_back    text,   -- storage URL
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.campaigns enable row level security;

-- Anyone can see active campaigns
drop policy if exists "campaigns_public_read" on public.campaigns;
create policy "campaigns_public_read"
  on public.campaigns for select using (status = 'active' or auth.uid() = creator_id);

-- Authenticated users can create
drop policy if exists "campaigns_auth_insert" on public.campaigns;
create policy "campaigns_auth_insert"
  on public.campaigns for insert with check (auth.uid() = creator_id);

-- Creators can update draft/pending campaigns
drop policy if exists "campaigns_creator_update" on public.campaigns;
create policy "campaigns_creator_update"
  on public.campaigns for update using (auth.uid() = creator_id);

-- Admins can do everything (handled via service-role key in edge functions)

-- ─── 3. CAMPAIGN IMAGES ────────────────────────────────────
create table if not exists public.campaign_images (
  id           uuid primary key default uuid_generate_v4(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  storage_url  text not null,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.campaign_images enable row level security;

drop policy if exists "campaign_images_public_read" on public.campaign_images;
create policy "campaign_images_public_read"
  on public.campaign_images for select using (true);

drop policy if exists "campaign_images_creator_write" on public.campaign_images;
create policy "campaign_images_creator_write"
  on public.campaign_images for insert with check (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
  );

drop policy if exists "campaign_images_creator_delete" on public.campaign_images;
create policy "campaign_images_creator_delete"
  on public.campaign_images for delete using (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
  );

-- ─── 4. CAMPAIGN DOCUMENTS ─────────────────────────────────
create table if not exists public.campaign_documents (
  id           uuid primary key default uuid_generate_v4(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  storage_url  text not null,
  file_name    text not null,
  file_size    bigint,
  doc_type     text check (doc_type in ('proof_of_need','bank_letter','id_document','other')),
  created_at   timestamptz not null default now()
);

alter table public.campaign_documents enable row level security;

-- Admins and campaign creator can see docs; public cannot (sensitive)
drop policy if exists "campaign_docs_creator_read" on public.campaign_documents;
create policy "campaign_docs_creator_read"
  on public.campaign_documents for select using (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
  );

drop policy if exists "campaign_docs_creator_write" on public.campaign_documents;
create policy "campaign_docs_creator_write"
  on public.campaign_documents for insert with check (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
  );

-- ─── 5. DONATIONS ──────────────────────────────────────────
create table if not exists public.donations (
  id              uuid primary key default uuid_generate_v4(),
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  donor_id        uuid references public.profiles(id) on delete set null,
  donor_name      text,
  donor_email     text,
  amount          numeric(14,2) not null check (amount > 0),
  currency        text not null default 'KES',
  payment_method  text not null check (payment_method in ('mpesa','card','paypal','bank')),
  payment_ref     text,         -- Transaction ID from payment provider
  mpesa_checkout_id text,       -- Safaricom STK push checkout request ID
  is_anonymous    boolean not null default false,
  message         text,
  status          text not null default 'pending'
                    check (status in ('pending','confirmed','failed','refunded')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.donations enable row level security;

-- Campaign creators can see donations to their campaigns
drop policy if exists "donations_creator_read" on public.donations;
create policy "donations_creator_read"
  on public.donations for select using (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
    or (not is_anonymous and auth.uid() = donor_id)
  );

-- Anyone can insert a donation (anonymous donors too)
drop policy if exists "donations_public_insert" on public.donations;
create policy "donations_public_insert"
  on public.donations for insert with check (true);

-- ─── 6. CAMPAIGN UPDATES ───────────────────────────────────
create table if not exists public.campaign_updates (
  id           uuid primary key default uuid_generate_v4(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  content      text not null,
  created_at   timestamptz not null default now()
);

alter table public.campaign_updates enable row level security;

drop policy if exists "updates_public_read" on public.campaign_updates;
create policy "updates_public_read"
  on public.campaign_updates for select using (true);

drop policy if exists "updates_creator_write" on public.campaign_updates;
create policy "updates_creator_write"
  on public.campaign_updates for insert with check (
    auth.uid() = (select creator_id from public.campaigns where id = campaign_id)
  );

-- ─── 7. CAMPAIGN COMMENTS / ENCOURAGEMENTS ─────────────────
create table if not exists public.campaign_comments (
  id           uuid primary key default uuid_generate_v4(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  user_id      uuid references public.profiles(id) on delete set null,
  author_name  text,   -- for anonymous
  content      text not null,
  is_donor     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.campaign_comments enable row level security;

drop policy if exists "comments_public_read" on public.campaign_comments;
create policy "comments_public_read"
  on public.campaign_comments for select using (true);

drop policy if exists "comments_auth_insert" on public.campaign_comments;
create policy "comments_auth_insert"
  on public.campaign_comments for insert with check (true);

-- ─── 8. FAVORITES / SAVED CAMPAIGNS ────────────────────────
create table if not exists public.favorites (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique(user_id, campaign_id)
);

alter table public.favorites enable row level security;

drop policy if exists "favorites_own" on public.favorites;
create policy "favorites_own"
  on public.favorites for all using (auth.uid() = user_id);

-- ─── 9. WITHDRAWALS ────────────────────────────────────────
create table if not exists public.withdrawals (
  id              uuid primary key default uuid_generate_v4(),
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  amount          numeric(14,2) not null check (amount > 0),
  method          text not null check (method in ('mpesa','bank','paypal')),
  account_details jsonb not null default '{}',
  status          text not null default 'pending'
                    check (status in ('pending','processing','completed','rejected')),
  admin_note      text,
  processed_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.withdrawals enable row level security;

drop policy if exists "withdrawals_own" on public.withdrawals;
create policy "withdrawals_own"
  on public.withdrawals for select using (auth.uid() = user_id);

drop policy if exists "withdrawals_creator_insert" on public.withdrawals;
create policy "withdrawals_creator_insert"
  on public.withdrawals for insert with check (auth.uid() = user_id);

-- ─── 10. REPORTS ───────────────────────────────────────────
create table if not exists public.reports (
  id           uuid primary key default uuid_generate_v4(),
  campaign_id  uuid not null references public.campaigns(id) on delete cascade,
  reporter_id  uuid references public.profiles(id) on delete set null,
  reason       text not null,
  description  text,
  status       text not null default 'pending'
                 check (status in ('pending','reviewed','resolved')),
  created_at   timestamptz not null default now()
);

alter table public.reports enable row level security;

drop policy if exists "reports_auth_insert" on public.reports;
create policy "reports_auth_insert"
  on public.reports for insert with check (true);

-- ─── 11. NOTIFICATIONS ─────────────────────────────────────
create table if not exists public.notifications (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  type         text not null check (type in ('donation','campaign_update','withdrawal','milestone','approval')),
  title        text not null,
  message      text not null,
  data         jsonb default '{}',
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own"
  on public.notifications for all using (auth.uid() = user_id);

-- ─── 12. TRIGGER: Auto-update current_amount ───────────────
-- When a donation is confirmed, increment campaigns.current_amount
create or replace function public.handle_confirmed_donation()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'confirmed' and (old.status is null or old.status != 'confirmed') then
    update public.campaigns
    set current_amount = current_amount + new.amount,
        updated_at     = now()
    where id = new.campaign_id;

    -- Fire notification to campaign creator
    insert into public.notifications (user_id, type, title, message, data)
    select creator_id,
           'donation',
           'New donation received!',
           coalesce(new.donor_name, 'Someone') || ' donated KES ' || new.amount::text,
           jsonb_build_object('campaign_id', new.campaign_id, 'donation_id', new.id, 'amount', new.amount)
    from public.campaigns
    where id = new.campaign_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_donation_confirmed on public.donations;
create trigger on_donation_confirmed
  after insert or update on public.donations
  for each row execute procedure public.handle_confirmed_donation();

-- ─── 13. TRIGGER: updated_at timestamps ───────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists campaigns_updated_at on public.campaigns;
create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists donations_updated_at on public.donations;
create trigger donations_updated_at
  before update on public.donations
  for each row execute procedure public.set_updated_at();

-- ─── 14. FUNCTIONS: Useful queries ────────────────────────
-- Get platform stats
create or replace function public.get_platform_stats()
returns jsonb language sql security definer as $$
  select jsonb_build_object(
    'total_raised',       coalesce(sum(current_amount), 0),
    'active_campaigns',   count(*) filter (where status = 'active'),
    'total_campaigns',    count(*),
    'lives_impacted',     coalesce((select sum(1) from public.donations where status = 'confirmed'), 0)
  )
  from public.campaigns;
$$;

-- Increment view count
create or replace function public.increment_view_count(campaign_slug text)
returns void language sql security definer as $$
  update public.campaigns
  set view_count = view_count + 1
  where slug = campaign_slug and status = 'active';
$$;

-- ─── 15. STORAGE BUCKETS (run separately or via Supabase dashboard) ──
-- These cannot be created via SQL but are listed here for reference:
--   bucket: "campaign-images"  → Public
--   bucket: "campaign-documents" → Private
--   bucket: "avatars"          → Public

-- ─── 16. SEED DATA (sample campaigns for development) ─────
-- Only insert if the campaigns table is empty
do $$
declare
  test_user_id uuid;
begin
  -- Check if there's already a user to seed with
  -- In production, comment out or remove this entire block
  if not exists (select 1 from public.campaigns limit 1) then
    -- We'll skip seeding since we don't have a real user id yet.
    -- To seed: create a user via the app, then run:
    --   insert into public.campaigns (...) values (...)
    raise notice 'No campaigns exist yet. Create campaigns through the app UI.';
  end if;
end;
$$;

-- ─── DONE ─────────────────────────────────────────────────
-- After running this schema:
-- 1. Go to Storage → Create buckets: campaign-images (public), campaign-documents (private), avatars (public)
-- 2. In Storage → Policies, allow public reads on campaign-images and avatars
-- 3. Copy your Supabase project URL and anon key into .env.local

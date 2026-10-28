-- Service-only inventory; no customer names, contacts, IP addresses or analytics IDs
create table public.coupon_campaigns (
  campaign text primary key,
  capacity integer not null check (capacity = 20),
  issued integer not null default 0 check (issued between 0 and capacity),
  expires_at timestamptz not null default '2027-01-01 00:00:00+09',
  active boolean not null default true
);
create table public.coupon_browser_claims (
  campaign text not null references public.coupon_campaigns(campaign),
  browser_hash text not null check (browser_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  last_issued_at timestamptz,
  primary key (campaign, browser_hash)
);
alter table public.coupon_campaigns enable row level security;
alter table public.coupon_browser_claims enable row level security;
revoke all on public.coupon_campaigns, public.coupon_browser_claims from public, anon, authenticated;
grant select, insert, update on public.coupon_campaigns, public.coupon_browser_claims to service_role;

create or replace function public.coupon_inventory(p_campaign text, p_browser_hash text, p_issue boolean default false)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare c public.coupon_campaigns%rowtype; issued_at timestamptz; expiry timestamptz; next_issue timestamptz; owned boolean; fresh boolean := false; cooldown boolean; available boolean;
begin
  if p_browser_hash is null or p_browser_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid browser'; end if;
  -- Serialize stock and repeat claims so concurrent requests cannot issue twice
  select * into c from public.coupon_campaigns where campaign = p_campaign for update;
  if not found then raise exception 'unknown campaign'; end if;
  select coalesce(last_issued_at,created_at) into issued_at from public.coupon_browser_claims where campaign = p_campaign and browser_hash = p_browser_hash;
  owned := found;
  cooldown := owned and now() < issued_at + interval '7 days';
  available := c.active and now() < c.expires_at and c.issued < c.capacity;
  if p_issue and not cooldown and available then
    if owned then
      update public.coupon_browser_claims set last_issued_at=now() where campaign=p_campaign and browser_hash=p_browser_hash returning last_issued_at into issued_at;
    else
      insert into public.coupon_browser_claims(campaign,browser_hash) values(p_campaign,p_browser_hash) returning created_at into issued_at;
    end if;
    update public.coupon_campaigns set issued=issued+1 where campaign=p_campaign returning * into c;
    owned := true; fresh := true; cooldown := true;
  end if;
  expiry := issued_at + interval '24 hours';
  next_issue := issued_at + interval '7 days';
  return jsonb_build_object('remaining',c.capacity-c.issued,'claimed',owned,
    'issuedAt',issued_at,'expiresAt',expiry,'serverNow',now(),
    'expired',owned and now()>=expiry,'newlyClaimed',fresh,
    'nextClaimAt',next_issue,'inCooldown',cooldown,
    'canClaim',not cooldown and c.active and now()<c.expires_at and c.issued<c.capacity,
    'closed',not c.active or now()>=c.expires_at or c.issued>=c.capacity);
end;
$$;
revoke all on function public.coupon_inventory(text,text,boolean) from public,anon,authenticated;
grant execute on function public.coupon_inventory(text,text,boolean) to service_role;
insert into public.coupon_campaigns(campaign, capacity) values ('limited-20261028',20), ('limited-20261028-qa',20);

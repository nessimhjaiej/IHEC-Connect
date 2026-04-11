create extension if not exists pgcrypto;

do $$
begin
    create type public.user_role as enum ('student', 'tutor', 'alumni', 'admin', 'professor');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.session_type as enum ('tutoring', 'entrepreneurship');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.delivery_mode as enum ('online', 'in_person');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.pricing_type as enum ('free', 'paid');
exception
    when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name varchar(120) not null,
    email varchar(255) not null unique,
    bio varchar(500),
    major varchar(120),
    academic_year varchar(50),
    avatar_url varchar(500),
    role public.user_role not null default 'student',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_role on public.users(role);

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    incoming_role text;
    resolved_role public.user_role := 'student';
begin
    incoming_role := coalesce(new.raw_user_meta_data ->> 'role', 'student');

    if incoming_role in ('student', 'tutor', 'alumni', 'admin', 'professor') then
        resolved_role := incoming_role::public.user_role;
    end if;

    insert into public.users (
        id,
        full_name,
        email,
        bio,
        major,
        academic_year,
        avatar_url,
        role
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1), 'New User'),
        new.email,
        new.raw_user_meta_data ->> 'bio',
        new.raw_user_meta_data ->> 'major',
        new.raw_user_meta_data ->> 'academic_year',
        new.raw_user_meta_data ->> 'avatar_url',
        resolved_role
    )
    on conflict (id) do update
    set
        full_name = excluded.full_name,
        email = excluded.email,
        bio = excluded.bio,
        major = excluded.major,
        academic_year = excluded.academic_year,
        avatar_url = excluded.avatar_url,
        role = excluded.role,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

insert into public.users (
    id,
    full_name,
    email,
    bio,
    major,
    academic_year,
    avatar_url,
    role
)
select
    au.id,
    coalesce(au.raw_user_meta_data ->> 'full_name', split_part(coalesce(au.email, ''), '@', 1), 'New User'),
    au.email,
    au.raw_user_meta_data ->> 'bio',
    au.raw_user_meta_data ->> 'major',
    au.raw_user_meta_data ->> 'academic_year',
    au.raw_user_meta_data ->> 'avatar_url',
    case
        when coalesce(au.raw_user_meta_data ->> 'role', 'student') in ('student', 'tutor', 'alumni', 'admin', 'professor')
            then (au.raw_user_meta_data ->> 'role')::public.user_role
        else 'student'::public.user_role
    end
from auth.users au
on conflict (id) do update
set
    full_name = excluded.full_name,
    email = excluded.email,
    bio = excluded.bio,
    major = excluded.major,
    academic_year = excluded.academic_year,
    avatar_url = excluded.avatar_url,
    role = excluded.role,
    updated_at = now();

create table if not exists public.subjects (
    id bigserial primary key,
    name varchar(120) not null unique,
    description varchar(500),
    created_at timestamptz not null default now()
);

create table if not exists public.sessions (
    id bigserial primary key,
    title varchar(200) not null,
    description text,
    session_type public.session_type not null default 'tutoring',
    delivery_mode public.delivery_mode not null default 'online',
    pricing_type public.pricing_type not null default 'free',
    price_dt numeric(6, 2),
    location_text varchar(255),
    meeting_url varchar(500),
    major varchar(120),
    academic_year varchar(50),
    scheduled_at timestamptz not null,
    duration_minutes integer not null default 60,
    capacity integer not null default 20,
    tutor_id uuid not null references public.users(id) on delete cascade,
    subject_id bigint references public.subjects(id) on delete set null,
    created_at timestamptz not null default now(),
    constraint ck_sessions_duration_positive check (duration_minutes between 30 and 240),
    constraint ck_sessions_capacity_positive check (capacity between 1 and 500),
    constraint ck_sessions_subject_required check (
        (session_type = 'tutoring' and subject_id is not null)
        or (session_type = 'entrepreneurship')
    ),
    constraint ck_sessions_paid_price check (
        (pricing_type = 'free' and price_dt is null)
        or (pricing_type = 'paid' and price_dt between 5 and 10)
    ),
    constraint ck_sessions_online_location check (
        (delivery_mode = 'online' and meeting_url is not null)
        or (delivery_mode = 'in_person' and location_text is not null)
    )
);

create index if not exists idx_sessions_scheduled_at on public.sessions(scheduled_at);
create index if not exists idx_sessions_tutor_id on public.sessions(tutor_id);
create index if not exists idx_sessions_subject_id on public.sessions(subject_id);
create index if not exists idx_sessions_type on public.sessions(session_type);

create table if not exists public.session_participants (
    id bigserial primary key,
    session_id bigint not null references public.sessions(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    joined_at timestamptz not null default now(),
    constraint uq_session_user unique (session_id, user_id)
);

create index if not exists idx_session_participants_session_id on public.session_participants(session_id);
create index if not exists idx_session_participants_user_id on public.session_participants(user_id);

create table if not exists public.reviews (
    id bigserial primary key,
    session_id bigint not null references public.sessions(id) on delete cascade,
    reviewer_id uuid not null references public.users(id) on delete cascade,
    reviewee_id uuid not null references public.users(id) on delete cascade,
    rating integer not null,
    comment text,
    created_at timestamptz not null default now(),
    constraint ck_reviews_rating_range check (rating between 1 and 5),
    constraint ck_reviews_distinct_users check (reviewer_id <> reviewee_id),
    constraint uq_reviews_per_session unique (session_id, reviewer_id, reviewee_id)
);

create index if not exists idx_reviews_session_id on public.reviews(session_id);
create index if not exists idx_reviews_reviewer_id on public.reviews(reviewer_id);
create index if not exists idx_reviews_reviewee_id on public.reviews(reviewee_id);

insert into public.subjects (name, description)
values
    ('Accounting', 'Core accounting support sessions'),
    ('Finance', 'Finance tutoring and revision sessions'),
    ('Marketing', 'Marketing concepts and case-based sessions'),
    ('Business Informatics', 'BI tutoring and practical support'),
    ('Entrepreneurship', 'Reference subject for innovation-oriented content')
on conflict (name) do nothing;

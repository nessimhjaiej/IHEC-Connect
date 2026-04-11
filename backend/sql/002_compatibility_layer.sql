create or replace function public.resolve_major_id(input_value text)
returns bigint
language plpgsql
stable
as $$
declare
    resolved_id bigint;
begin
    if input_value is null or btrim(input_value) = '' then
        return null;
    end if;

    select m.id
    into resolved_id
    from public.majors m
    where lower(m.code) = lower(input_value)
       or lower(m.name) = lower(input_value)
    order by case when lower(m.code) = lower(input_value) then 0 else 1 end
    limit 1;

    return resolved_id;
end;
$$;

create or replace function public.resolve_academic_year_id(input_value text)
returns bigint
language plpgsql
stable
as $$
declare
    resolved_id bigint;
begin
    if input_value is null or btrim(input_value) = '' then
        return null;
    end if;

    select ay.id
    into resolved_id
    from public.academic_years ay
    where lower(ay.label) = lower(input_value)
    limit 1;

    return resolved_id;
end;
$$;

create or replace function public.handle_new_user()
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

    insert into public.profiles (
        id,
        full_name,
        email,
        role,
        major_id,
        academic_year_id,
        bio,
        avatar_url
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1), 'New User'),
        new.email,
        resolved_role,
        public.resolve_major_id(new.raw_user_meta_data ->> 'major'),
        public.resolve_academic_year_id(new.raw_user_meta_data ->> 'academic_year'),
        new.raw_user_meta_data ->> 'bio',
        new.raw_user_meta_data ->> 'avatar_url'
    )
    on conflict (id) do update
    set
        full_name = excluded.full_name,
        email = excluded.email,
        role = excluded.role,
        major_id = excluded.major_id,
        academic_year_id = excluded.academic_year_id,
        bio = excluded.bio,
        avatar_url = excluded.avatar_url,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (
    id,
    full_name,
    email,
    role,
    major_id,
    academic_year_id,
    bio,
    avatar_url
)
select
    au.id,
    coalesce(au.raw_user_meta_data ->> 'full_name', split_part(coalesce(au.email, ''), '@', 1), 'New User'),
    au.email,
    case
        when coalesce(au.raw_user_meta_data ->> 'role', 'student') in ('student', 'tutor', 'alumni', 'admin', 'professor')
            then (au.raw_user_meta_data ->> 'role')::public.user_role
        else 'student'::public.user_role
    end,
    public.resolve_major_id(au.raw_user_meta_data ->> 'major'),
    public.resolve_academic_year_id(au.raw_user_meta_data ->> 'academic_year'),
    au.raw_user_meta_data ->> 'bio',
    au.raw_user_meta_data ->> 'avatar_url'
from auth.users au
on conflict (id) do update
set
    full_name = excluded.full_name,
    email = excluded.email,
    role = excluded.role,
    major_id = excluded.major_id,
    academic_year_id = excluded.academic_year_id,
    bio = excluded.bio,
    avatar_url = excluded.avatar_url,
    updated_at = now();

drop view if exists public.users cascade;
create view public.users as
select
    p.id,
    p.full_name,
    p.email,
    p.bio,
    m.code as major,
    ay.label as academic_year,
    p.avatar_url,
    p.role,
    p.created_at,
    p.updated_at
from public.profiles p
left join public.majors m on m.id = p.major_id
left join public.academic_years ay on ay.id = p.academic_year_id;

create or replace function public.users_view_update()
returns trigger
language plpgsql
as $$
begin
    update public.profiles
    set
        full_name = new.full_name,
        email = new.email,
        bio = new.bio,
        major_id = public.resolve_major_id(new.major),
        academic_year_id = public.resolve_academic_year_id(new.academic_year),
        avatar_url = new.avatar_url,
        role = new.role,
        updated_at = now()
    where id = old.id;

    return new;
end;
$$;

drop trigger if exists trg_users_view_update on public.users;
create trigger trg_users_view_update
instead of update on public.users
for each row
execute function public.users_view_update();

drop view if exists public.sessions cascade;
create view public.sessions as
select
    e.id,
    e.title,
    e.description,
    e.type as session_type,
    e.delivery_mode,
    e.pricing_type,
    e.price_dt,
    e.location_text,
    e.meeting_url,
    m.code as major,
    ay.label as academic_year,
    e.starts_at as scheduled_at,
    greatest(30, (extract(epoch from (e.ends_at - e.starts_at)) / 60)::integer) as duration_minutes,
    e.capacity,
    e.host_user_id as tutor_id,
    e.subject_id,
    e.created_at
from public.events e
left join public.majors m on m.id = e.major_id
left join public.academic_years ay on ay.id = e.academic_year_id;

create or replace function public.sessions_view_insert()
returns trigger
language plpgsql
as $$
declare
    inserted_event public.events%rowtype;
begin
    insert into public.events (
        type,
        title,
        description,
        host_user_id,
        subject_id,
        major_id,
        academic_year_id,
        delivery_mode,
        location_text,
        meeting_url,
        starts_at,
        ends_at,
        capacity,
        pricing_type,
        price_dt,
        status,
        is_recorded
    )
    values (
        new.session_type::public.event_type,
        new.title,
        new.description,
        new.tutor_id,
        new.subject_id,
        public.resolve_major_id(new.major),
        public.resolve_academic_year_id(new.academic_year),
        new.delivery_mode::public.delivery_mode,
        new.location_text,
        new.meeting_url,
        new.scheduled_at,
        new.scheduled_at + make_interval(mins => coalesce(new.duration_minutes, 60)),
        coalesce(new.capacity, 20),
        new.pricing_type::public.pricing_type,
        case
            when new.pricing_type = 'free' then 0
            else new.price_dt
        end,
        'draft',
        false
    )
    returning * into inserted_event;

    new.id := inserted_event.id;
    new.subject_id := inserted_event.subject_id;
    new.scheduled_at := inserted_event.starts_at;
    new.capacity := inserted_event.capacity;
    new.tutor_id := inserted_event.host_user_id;
    new.created_at := inserted_event.created_at;
    return new;
end;
$$;

drop trigger if exists trg_sessions_view_insert on public.sessions;
create trigger trg_sessions_view_insert
instead of insert on public.sessions
for each row
execute function public.sessions_view_insert();

drop view if exists public.session_participants cascade;
create view public.session_participants as
select
    ep.id,
    ep.event_id as session_id,
    ep.user_id,
    ep.joined_at
from public.event_participants ep;

create or replace function public.session_participants_view_insert()
returns trigger
language plpgsql
as $$
declare
    inserted_participant public.event_participants%rowtype;
begin
    insert into public.event_participants (
        event_id,
        user_id,
        status
    )
    values (
        new.session_id,
        new.user_id,
        'joined'
    )
    returning * into inserted_participant;

    new.id := inserted_participant.id;
    new.joined_at := inserted_participant.joined_at;
    return new;
end;
$$;

drop trigger if exists trg_session_participants_view_insert on public.session_participants;
create trigger trg_session_participants_view_insert
instead of insert on public.session_participants
for each row
execute function public.session_participants_view_insert();

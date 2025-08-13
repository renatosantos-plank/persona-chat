create table if not exists public.threads (
  thread_id  text primary key,
  title      text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- for fast "most recent first" lists
create index if not exists threads_updated_at_idx
  on public.threads (updated_at desc);

-- Grant permissions
grant delete on table "public"."threads" to "anon";
grant insert on table "public"."threads" to "anon";
grant references on table "public"."threads" to "anon";
grant select on table "public"."threads" to "anon";
grant trigger on table "public"."threads" to "anon";
grant truncate on table "public"."threads" to "anon";
grant update on table "public"."threads" to "anon";

grant delete on table "public"."threads" to "authenticated";
grant insert on table "public"."threads" to "authenticated";
grant references on table "public"."threads" to "authenticated";
grant select on table "public"."threads" to "authenticated";
grant trigger on table "public"."threads" to "authenticated";
grant truncate on table "public"."threads" to "authenticated";
grant update on table "public"."threads" to "authenticated";

grant delete on table "public"."threads" to "service_role";
grant insert on table "public"."threads" to "service_role";
grant references on table "public"."threads" to "service_role";
grant select on table "public"."threads" to "service_role";
grant trigger on table "public"."threads" to "service_role";
grant truncate on table "public"."threads" to "service_role";
grant update on table "public"."threads" to "service_role";

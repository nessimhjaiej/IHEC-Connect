function isPlaceholder(value: string | undefined, placeholders: string[]) {
  if (!value) {
    return true;
  }

  return placeholders.some((placeholder) => value.includes(placeholder));
}

export function isSupabaseConfigured() {
  return (
    !isPlaceholder(import.meta.env.VITE_SUPABASE_URL, ["YOUR_PROJECT_REF", "your-project", "replace-me"]) &&
    !isPlaceholder(import.meta.env.VITE_SUPABASE_ANON_KEY, ["YOUR_SUPABASE_PUBLISHABLE_KEY", "replace-me"])
  );
}
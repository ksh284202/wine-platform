export const ROLE_ROUTES = {
  consumer: "/consumer",
  business: "/business",
  admin: "/admin",
};

export function sanitizeSignupRole(role) {
  return role === "business" ? "business" : "consumer";
}

export function getRoleRoute(role) {
  return ROLE_ROUTES[role] || "/";
}

export async function fetchProfile(supabase, userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error };
  }

  return { profile: data || null, error: null };
}

export async function upsertProfileFromUser(
  supabase,
  user,
  role,
  businessName = ""
) {
  const safeRole = sanitizeSignupRole(role);

  const payload = {
    id: user.id,
    email: user.email,
    role: safeRole,
    business_name: safeRole === "business" ? businessName.trim() : null,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  return { profile: data || null, error };
}

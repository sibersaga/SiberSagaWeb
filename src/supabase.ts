import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const collectionTables = [
  "programs",
  "achievements",
  "agendas",
  "news",
  "stats",
  "gallery",
  "faqs",
  "downloads",
  "admins",
] as const;

const tables = [...collectionTables, "settings", "registrations"] as const;

export type CollectionTable = (typeof collectionTables)[number];
export type SupabaseTable = (typeof tables)[number];

type Payload = Record<string, unknown> | string | number | boolean | null;
type SupabaseResult<T> = { data: T[] | null; error: unknown | null };

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL.trim() !== "" &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY.trim() !== "" &&
    !String(import.meta.env.VITE_SUPABASE_ANON_KEY).startsWith("salin_")
);

export function getSupabase() {
  if (!client) {
    if (!isSupabaseConfigured) {
      console.warn("Supabase env vars missing. CMS will use localStorage fallback.");
      const mockResult = { data: null, error: new Error("Supabase is not configured.") };
      const mockChain = {
        select: () => mockChain,
        order: () => mockChain,
        eq: () => mockChain,
        neq: () => mockChain,
        maybeSingle: () => mockChain,
        insert: () => mockChain,
        upsert: () => mockChain,
        update: () => mockChain,
        delete: () => mockChain,
        then: (resolve: any) => resolve(mockResult),
      };
      client = {
        from: () => mockChain,
        auth: {
          signInWithOtp: async () => mockResult,
          verifyOtp: async () => mockResult,
          signOut: async () => mockResult,
        }
      } as unknown as SupabaseClient;
      return client;
    }
    client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return client;
}

function assertTable(table: SupabaseTable) {
  if (!tables.includes(table)) {
    throw new Error(`Unsupported Supabase table: ${table}`);
  }
}

function normalizePayload(payload: Payload): Record<string, unknown> {
  if (payload && typeof payload === "object") {
    return payload as Record<string, unknown>;
  }
  return { value: payload };
}

function parsePayload<T>(payload: unknown): T {
  if (payload && typeof payload === "object") {
    return payload as T;
  }
  return { value: payload } as T;
}

export async function getCollection<T>(table: CollectionTable): Promise<SupabaseResult<T>> {
  assertTable(table);

  const result = await getSupabase()
    .from(table)
    .select("id,payload,updated_at")
    .order("updated_at", { ascending: false, nullsFirst: false });

  if (result.error) {
    return { data: null, error: result.error };
  }

  return {
    data: (result.data ?? []).map((row: any) => ({
      id: row.id,
      ...parsePayload<T>(row.payload),
    })),
    error: null,
  };
}

export async function upsertCollection(table: CollectionTable, data: Array<Record<string, unknown>>) {
  assertTable(table);

  const rows = data.map((item) => ({
    id: String(item.id),
    payload: item,
  }));

  const deleteResult = await getSupabase().from(table).delete().neq("id", "__never_delete__");
  if (deleteResult.error) {
    return { error: deleteResult.error };
  }

  const upsertResult = await getSupabase().from(table).upsert(rows, { onConflict: "id" });
  return { error: upsertResult.error };
}

export async function upsertItem(table: CollectionTable, id: string, payload: Payload) {
  assertTable(table);

  const result = await getSupabase()
    .from(table)
    .upsert({ id, payload: normalizePayload(payload) }, { onConflict: "id" });

  return { error: result.error };
}

export async function updateItem(table: CollectionTable, id: string, payload: Partial<Payload>) {
  assertTable(table);

  const result = await getSupabase()
    .from(table)
    .update({ payload: normalizePayload(payload as Payload) })
    .eq("id", id);

  return { error: result.error };
}

export async function deleteItem(table: CollectionTable, id: string) {
  assertTable(table);

  const result = await getSupabase().from(table).delete().eq("id", id);
  return { error: result.error };
}

export async function getSetting<T>(key: string): Promise<{ data: T | null; error: unknown | null }> {
  const result = await getSupabase().from("settings").select("value").eq("key", key).maybeSingle();

  if (result.error) {
    return { data: null, error: result.error };
  }

  return { data: result.data?.value as T ?? null, error: null };
}

export async function upsertSetting<T>(key: string, value: T) {
  const result = await getSupabase()
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });

  return { error: result.error };
}

export async function listAdmins(): Promise<SupabaseResult<string>> {
  const result = await getSupabase()
    .from("admins")
    .select("id,payload,enabled")
    .eq("enabled", true)
    .order("id", { ascending: true });

  if (result.error) {
    return { data: null, error: result.error };
  }

  return {
    data: (result.data ?? []).map((row: any) => {
      const payload = row.payload as { email?: string } | null;
      return payload?.email || row.id;
    }),
    error: null,
  };
}

export async function sendAdminOtp(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const adminsResult = await listAdmins();

  if (adminsResult.error) {
    return { data: false, error: adminsResult.error };
  }

  if (!adminsResult.data?.includes(normalizedEmail)) {
    return { data: false, error: new Error("Email belum terdaftar sebagai Admin.") };
  }

  const authResult = await getSupabase().auth.signInWithOtp({ email: normalizedEmail });
  return { data: !authResult.error, error: authResult.error };
}

export async function verifyAdminOtp(email: string, token: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await getSupabase().auth.verifyOtp({
    email: normalizedEmail,
    token,
    type: "email",
  });

  if (result.error) {
    return { data: null, error: result.error };
  }

  return { data: result.data.user?.email ?? normalizedEmail, error: null };
}

export async function signOutAdmin() {
  const result = await getSupabase().auth.signOut();
  return { error: result.error };
}

export async function upsertAdmin(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await getSupabase()
    .from("admins")
    .upsert({ id: normalizedEmail, email: normalizedEmail, payload: { email: normalizedEmail }, enabled: true }, { onConflict: "id" });

  return { error: result.error };
}

export async function deleteAdmin(email: string) {
  const result = await getSupabase().from("admins").delete().eq("id", email.trim().toLowerCase());
  return { error: result.error };
}

export async function insertRegistration(regNo: string, data: Record<string, unknown>) {
  const result = await getSupabase().from("registrations").insert({
    id: regNo,
    payload: data,
    submitted_at: data.submittedAt,
    timestamp: data.timestamp,
  });

  return { error: result.error };
}

export async function listRegistrations() {
  const result = await getSupabase()
    .from("registrations")
    .select("id,payload,submitted_at,timestamp")
    .order("timestamp", { ascending: false, nullsFirst: true });

  if (result.error) {
    return { data: [], error: result.error };
  }

  return {
    data: (result.data ?? []).map((row: any) => ({
      id: row.id,
      ...parsePayload<Record<string, unknown>>(row.payload),
      submittedAt: row.submitted_at,
      timestamp: row.timestamp,
    })),
    error: null,
  };
}

export async function deleteRegistration(regNo: string) {
  const result = await getSupabase().from("registrations").delete().eq("id", regNo);
  return { error: result.error };
}

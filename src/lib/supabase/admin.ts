import { createClient } from "@supabase/supabase-js";

let clienteAdmin: ReturnType<typeof createClient> | null = null;

export function crearClienteAdmin() {
  if (!clienteAdmin) {
    clienteAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return clienteAdmin;
}

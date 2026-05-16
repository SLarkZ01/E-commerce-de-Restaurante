import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let clienteUnico: ReturnType<typeof createClient> | null = null;

export function crearCliente() {
  if (!clienteUnico) {
    clienteUnico = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key: string) => {
            const cookie = document.cookie
              .split("; ")
              .find((row) => row.startsWith(`${key}=`));
            return cookie ? cookie.split("=")[1] : null;
          },
          setItem: (key: string, value: string) => {
            document.cookie = `${key}=${value}; path=/; max-age=31536000; samesite=lax`;
          },
          removeItem: (key: string) => {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          },
        },
      },
    });
  }
  return clienteUnico;
}

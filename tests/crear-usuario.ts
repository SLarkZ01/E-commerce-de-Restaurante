import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://aqwtjtectrrlfamwqken.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxd3RqdGVjdHJybGZhbXdxa2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzEyNjYsImV4cCI6MjA5NDIwNzI2Nn0.4n5YMfPfSagZmVHFabcqeGLV0Ek2xKpTM18z7FCd1pE"
);

async function main() {
  console.log("Intentando crear usuario vía signUp...");
  const { data, error } = await supabase.auth.signUp({
    email: "chef@ekitchen.com",
    password: "admin123",
    options: {
      data: { nombre: "Chef Principal" },
    },
  });

  if (error) {
    console.log("Error signUp:", error.message);
  } else {
    console.log("Usuario creado:", data.user?.id, data.user?.email);
    console.log("Sesión:", data.session ? "Sí" : "No (requiere confirmación email)");
  }

  // Intentar login
  console.log("\nIntentando login...");
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: "chef@ekitchen.com",
    password: "admin123",
  });

  if (loginError) {
    console.log("Error login:", loginError.message);
  } else {
    console.log("Login exitoso:", loginData.user?.email);
    console.log("Access token:", loginData.session?.access_token.slice(0, 20) + "...");
  }
}

main();

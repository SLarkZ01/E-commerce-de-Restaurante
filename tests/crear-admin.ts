import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://aqwtjtectrrlfamwqken.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxd3RqdGVjdHJybGZhbXdxa2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzEyNjYsImV4cCI6MjA5NDIwNzI2Nn0.4n5YMfPfSagZmVHFabcqeGLV0Ek2xKpTM18z7FCd1pE"
);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: "admin@ekitchen.com",
    password: "admin123",
    options: { data: { nombre: "Admin Principal" } },
  });

  if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("Admin creado — ID:", data.user?.id);
  }
}

main();

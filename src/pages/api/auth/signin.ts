export const prerender = false
import type { APIRoute } from "astro";
import { supabase } from "../../../db/supabase";
import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const provider = formData.get("provider")?.toString();

  const validProviders = ["google", "email"];

  if (provider && validProviders.includes(provider)) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: "http://localhost:4321/api/auth/callback"
      },
    });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect(data.url);
  }

  if (!email || !password) {
    const errorMessage = encodeURIComponent('Email y contraseña son requeridos');
    return redirect(`/signin?error=${errorMessage}`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('Error de autenticación:', error.message);
    const errorMessage = encodeURIComponent(error.message);
    return redirect(`/signin?error=${errorMessage}`);
  }

  if (!data.session) {
    const errorMessage = encodeURIComponent('Error al iniciar sesión');
    return redirect(`/signin?error=${errorMessage}`);
  }

  const { access_token, refresh_token } = data.session;
  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });
  return redirect("/dashboard");
};
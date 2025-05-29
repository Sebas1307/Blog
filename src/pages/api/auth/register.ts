export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../db/supabase";

export const POST: APIRoute = async ({ request }) => {
   const formData = await request.formData();
   const email = formData.get("email")?.toString();
   const password = formData.get("password")?.toString();
   const confirmPassword = formData.get("confirmPassword")?.toString();

   if (!email || !password || !confirmPassword) {
      return new Response("Todos los campos son requeridos", { status: 400 });
   }

   if (password !== confirmPassword) {
      return new Response("Las contraseñas no coinciden", { status: 400 });
   }

   const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
         emailRedirectTo: "http://localhost:4321/api/auth/callback"
      }
   });

   if (error) {
      return new Response(error.message, { status: 500 });
   }

   return new Response(null, {
      status: 302,
      headers: {
         Location: '/signin?message=' + encodeURIComponent('Por favor verifica tu correo electrónico para completar el registro')
      }
   });
};
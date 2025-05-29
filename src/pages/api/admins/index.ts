import type { APIRoute } from 'astro'
import { supabase } from '../../../db/supabase'

export const prerender = false

// GET: Listar todos los administradores y superadmins con email
export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('users_roles')
    .select('user_id, rol, users: user_id (email)')
    .in('rol', ['admin', 'superadmin'])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
  return new Response(JSON.stringify(data), { status: 200 })
}

// POST: Agregar admin por user_id o email
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const { user_id, email } = body

  let finalUserId = user_id

  // Si se pasa email, buscar el user_id correspondiente
  if (email && !user_id) {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado por email' }), { status: 404 })
    }
    finalUserId = user.id
  }

  if (!finalUserId) {
    return new Response(JSON.stringify({ error: 'Debes proporcionar user_id o email válido' }), { status: 400 })
  }

  // Insertar el rol admin
  const { error: insertError } = await supabase
    .from('users_roles')
    .insert([{ user_id: finalUserId, rol: 'admin' }])

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 201 })
} 
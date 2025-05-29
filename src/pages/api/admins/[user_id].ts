import type { APIRoute } from 'astro'
import { supabase } from '../../../db/supabase'

export const prerender = false

// DELETE: Eliminar el rol de admin de un usuario
export const DELETE: APIRoute = async ({ params }) => {
  const { user_id } = params
  if (!user_id) {
    return new Response(JSON.stringify({ error: 'user_id requerido' }), { status: 400 })
  }

  const { error } = await supabase
    .from('users_roles')
    .delete()
    .eq('user_id', user_id)
    .eq('rol', 'admin')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
} 
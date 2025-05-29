import type { APIRoute } from 'astro'
import { supabase } from '../../../db/supabase'

// Indicar que esta ruta debe ser renderizada en el servidor
export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase
      .from('Articulos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message || 'Error al obtener los artículos'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const articleData = await request.json()

    const { error } = await supabase
      .from('Articulos')
      .insert([articleData])

    if (error) throw error

    // Obtener la lista actualizada de artículos
    const { data, error: fetchError } = await supabase
      .from('Articulos')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: error.message || 'Error al crear el artículo'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 
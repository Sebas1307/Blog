import { useState, useEffect } from 'react'
import { supabase } from '../../db/supabase'
import ArticleForm from './ArticleForm'
import ArticleList from './ArticleList'
import type { Article } from '../../types/article'

export default function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Iniciando carga de artículos...')
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setIsLoading(true)
      console.log('Conectando a Supabase...')
      console.log('URL de Supabase:', import.meta.env.PUBLIC_SUPABASE_URL)
      console.log('Clave de Supabase configurada:', !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY)

      const { data, error } = await supabase.from('Articulos').select('*')

      console.log("Respuesta completa de Supabase:", { data, error })
      if (error) {
        console.error('Error detallado de Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setMessage({
          text: `Error al cargar los artículos: ${error.message}`,
          type: 'error'
        })
        return
      }

      console.log('Artículos cargados:', data)
      setArticles(data || [])
    } catch (error) {
      console.error('Error inesperado:', error)
      setMessage({
        text: 'Error de conexión con la base de datos',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrUpdate = async (articleData: Partial<Article>) => {
    try {
      if (selectedArticle) {
        // Actualizar artículo existente
        const { error } = await supabase
          .from('Articulos')
          .update(articleData)
          .eq('id', selectedArticle.id)

        if (error) throw error
        setMessage({
          text: 'Artículo actualizado correctamente',
          type: 'success'
        })
      } else {
        // Crear nuevo artículo
        const { error } = await supabase.from('Articulos').insert([articleData])
        if (error) throw error
        setMessage({ text: 'Artículo creado correctamente', type: 'success' })
      }
      await fetchArticles()
      setSelectedArticle(null)
    } catch (error: any) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return

    try {
      const { error } = await supabase.from('Articulos').delete().eq('id', id)
      if (error) throw error
      setMessage({ text: 'Artículo eliminado correctamente', type: 'success' })
      await fetchArticles()
    } catch (error: any) {
      setMessage({ text: `Error al eliminar: ${error.message}`, type: 'error' })
    }
  }

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
  }

  return (
    <div className='max-w-4xl mx-auto mt-8 px-4'>
      <h1 className='text-4xl font-bold mb-8 text-gray-800'>
        Panel de Control
      </h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className='text-center py-4'>
          <p className='text-gray-600'>Cargando artículos...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <ArticleList
            articles={articles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <ArticleForm
            onSubmit={handleCreateOrUpdate}
            selectedArticle={selectedArticle}
            onCancel={() => setSelectedArticle(null)}
          />
        </div>
      )}
    </div>
  )
}

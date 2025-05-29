import { useState } from 'react'
import { supabase } from '../../db/supabase'
import ArticleForm from './ArticleForm'
import ArticleList from './ArticleList'
import type { Article } from '../../types/article'

export default function Dashboard({ articulos }: { articulos: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(articulos || [])
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleCreateOrUpdate = async (articleData: Partial<Article>) => {
    try {
      setIsLoading(true)
      if (selectedArticle) {
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
        const { error } = await supabase.from('Articulos').insert([articleData])
        if (error) throw error
        setMessage({ text: 'Artículo creado correctamente', type: 'success' })
      }
      
      const { data, error } = await supabase.from('Articulos').select('*')
      if (error) throw error
      setArticles(data || [])
      setSelectedArticle(null)
      setIsPreviewMode(false)
    } catch (error: any) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return

    try {
      setIsLoading(true)
      const { error } = await supabase.from('Articulos').delete().eq('id', id)
      if (error) throw error
      setMessage({ text: 'Artículo eliminado correctamente', type: 'success' })
      
      const { data, error: fetchError } = await supabase.from('Articulos').select('*')
      if (fetchError) throw fetchError
      setArticles(data || [])
      setSelectedArticle(null)
      setIsPreviewMode(false)
    } catch (error: any) {
      setMessage({ text: `Error al eliminar: ${error.message}`, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setIsPreviewMode(true)
  }

  const handleCancel = () => {
    setSelectedArticle(null)
    setIsPreviewMode(false)
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
          <p className='text-gray-600'>Cargando...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <ArticleList
              articles={articles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {!isPreviewMode && (
              <ArticleForm
                onSubmit={handleCreateOrUpdate}
                selectedArticle={selectedArticle}
                onCancel={handleCancel}
              />
            )}
          </div>
          
          {isPreviewMode && selectedArticle && (
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-gray-800'>Vista Previa</h2>
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className='text-blue-600 hover:text-blue-800'
                >
                  Editar
                </button>
              </div>
              <div className='prose max-w-none'>
                <h1 className='text-3xl font-bold mb-4'>{selectedArticle.title}</h1>
                <div className='mb-4'>
                  <span className='text-sm text-gray-500'>
                    {selectedArticle.pub_date && new Date(selectedArticle.pub_date).toLocaleDateString()}
                  </span>
                </div>
                <div className='mb-4'>
                  <img
                    src={selectedArticle.hero_image}
                    alt={selectedArticle.title}
                    className='w-full h-48 object-cover rounded-lg'
                  />
                </div>
                <div className='text-gray-700 whitespace-pre-wrap'>
                  {selectedArticle.content}
                </div>
                {selectedArticle.SEO && (
                  <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-2'>SEO</h3>
                    <p className='text-sm text-gray-600'>
                      <strong>Título SEO:</strong> {selectedArticle.SEO.title}
                    </p>
                    <p className='text-sm text-gray-600'>
                      <strong>Descripción SEO:</strong> {selectedArticle.SEO.description}
                    </p>
                  </div>
                )}
                <div className='mt-4 flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.published && (
                    <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
                      Publicado
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

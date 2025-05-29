import { useState } from 'react'
import ArticleForm from './ArticleForm'
import ArticleList from './ArticleList'
import type { Article } from '../../types/article'

type PreviewMode = false | 'preview' | 'edit'

export default function Dashboard({ articulos }: { articulos: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(articulos || [])
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState<PreviewMode>(false)

  const handleCreateOrUpdate = async (articleData: Partial<Article>) => {
    try {
      setIsLoading(true)
      setMessage(null)

      const url = selectedArticle 
        ? `/api/articles/${selectedArticle.id}`
        : '/api/articles'
      
      const method = selectedArticle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al procesar la operación')
      }

      const data = await response.json()
      setArticles(data)
      setMessage({
        text: selectedArticle 
          ? 'Artículo actualizado correctamente'
          : 'Artículo creado correctamente',
        type: 'success'
      })
      setSelectedArticle(null)
      setIsPreviewMode(false)
    } catch (error: any) {
      console.error('Error en la operación:', error)
      setMessage({
        text: `Error: ${error.message || 'Error al procesar la operación'}`,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return

    try {
      setIsLoading(true)
      setMessage(null)

      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al eliminar el artículo')
      }

      const data = await response.json()
      setArticles(data)
      setMessage({
        text: 'Artículo eliminado correctamente',
        type: 'success'
      })
      setSelectedArticle(null)
      setIsPreviewMode(false)
    } catch (error: any) {
      console.error('Error al eliminar:', error)
      setMessage({
        text: `Error al eliminar: ${error.message || 'Error al eliminar el artículo'}`,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (article: Article) => {
    setSelectedArticle(article)
    setIsPreviewMode('preview')
  }

  const handleCancel = () => {
    setSelectedArticle(null)
  }

  return (
    <div className='max-w-7xl mx-auto mt-8 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>
          Panel de Control
        </h1>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Columna 1: Formulario de creación/edición */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              {selectedArticle ? 'Editar artículo' : 'Crear nuevo artículo'}
            </h2>
            <ArticleForm
              onSubmit={handleCreateOrUpdate}
              article={selectedArticle || undefined}
              onCancel={handleCancel}
            />
          </div>
          {/* Columna 2: Lista de artículos */}
          <div className='space-y-8'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  Lista de Artículos
                </h2>
              </div>
              <ArticleList
                articles={articles}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

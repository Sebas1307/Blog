import { useState, useEffect } from 'react'
import type { Article } from '../../types/article'

interface ArticleFormProps {
  onSubmit: (articleData: Partial<Article>) => void
  selectedArticle: Article | null
  onCancel: () => void
}

export default function ArticleForm({ onSubmit, selectedArticle, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    content: '',
    SEO: { title: '', description: '' },
    slug: '',
    category: '',
    hero_image: '',
    author: '',
    published: false,
    pub_date: null
  })

  useEffect(() => {
    if (selectedArticle) {
      setFormData(selectedArticle)
    } else {
      setFormData({
        title: '',
        content: '',
        SEO: { title: '', description: '' },
        slug: '',
        category: '',
        hero_image: '',
        author: '',
        published: false,
        pub_date: null
      })
    }
  }, [selectedArticle])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'SEO') {
      try {
        const seoData = JSON.parse(value)
        setFormData(prev => ({ ...prev, SEO: seoData }))
      } catch {
        // Si no es un JSON válido, lo guardamos como string
        setFormData(prev => ({ ...prev, SEO: { title: value, description: '' } }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {selectedArticle ? 'Editar artículo' : 'Crear nuevo artículo'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título del artículo"
            className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Contenido del artículo"
            className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO (JSON)
          </label>
          <textarea
            name="SEO"
            value={JSON.stringify(formData.SEO, null, 2)}
            onChange={handleChange}
            placeholder='{"title": "", "description": ""}'
            className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="url-amigable"
              className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Categoría"
              className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de imagen principal
          </label>
          <input
            name="hero_image"
            value={formData.hero_image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Nombre del autor"
            className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Publicado</label>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de publicación
            </label>
            <input
              name="pub_date"
              type="date"
              value={formData.pub_date || ''}
              onChange={handleChange}
              className="block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {selectedArticle ? 'Actualizar' : 'Crear'}
          </button>
          {selectedArticle && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 
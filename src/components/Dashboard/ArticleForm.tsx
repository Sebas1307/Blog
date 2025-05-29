import { useState, useEffect } from 'react'
import type { Article } from '../../types/article'

interface ArticleFormProps {
  article?: Article
  onSubmit: (article: Partial<Article>) => void
  onCancel: () => void
}

export default function ArticleForm({ article, onSubmit, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    content: '',
    category: '',
    hero_image: '',
    published: false,
    SEO: {
      title: '',
      description: ''
    }
  })

  useEffect(() => {
    if (article) {
      setFormData(article)
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        hero_image: '',
        published: false,
        SEO: {
          title: '',
          description: ''
        }
      })
    }
  }, [article])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name.startsWith('SEO.')) {
      const seoField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        SEO: { ...prev.SEO, [seoField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Diseño">Diseño</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label htmlFor="hero_image" className="block text-sm font-medium text-gray-700">
            URL de la imagen principal
          </label>
          <input
            type="url"
            id="hero_image"
            name="hero_image"
            value={formData.hero_image}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Publicar artículo
          </label>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información SEO</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="SEO.title" className="block text-sm font-medium text-gray-700">
                Título SEO
              </label>
              <input
                type="text"
                id="SEO.title"
                name="SEO.title"
                value={formData.SEO?.title || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="SEO.description" className="block text-sm font-medium text-gray-700">
                Descripción SEO
              </label>
              <textarea
                id="SEO.description"
                name="SEO.description"
                value={formData.SEO?.description || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {article ? 'Actualizar' : 'Crear'} Artículo
        </button>
      </div>
    </form>
  )
} 
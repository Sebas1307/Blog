import type { Article } from '../../types/article'

interface ArticleListProps {
  articles: Article[]
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
}

export default function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Lista de Artículos
      </h2>
      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    {article.published && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Publicado
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(article)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(article.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No hay artículos disponibles.</p>
      )}
    </div>
  )
} 
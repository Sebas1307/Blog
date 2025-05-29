export interface Article {
  id: number
  title: string
  content: string
  SEO?: {
    title?: string
    description?: string
  }
  slug: string
  category: string
  hero_image: string
  author: string
  published: boolean
  pub_date: string | null
  created_at?: string
  updated_at?: string
} 
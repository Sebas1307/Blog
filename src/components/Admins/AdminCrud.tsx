import { useState } from 'react'

interface Admin {
  user_id: string
  rol: string
  users?: { email?: string }
}

export default function AdminCrud({ users_roles }: { users_roles: Admin[] }) {
  const [admins, setAdmins] = useState<Admin[]>(users_roles)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({ user_id: '', email: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Administrador agregado correctamente')
      setForm({ user_id: '', email: '' })
      setAdmins((prev) => [
        ...prev,
        data.admin || { user_id: form.user_id, rol: 'admin' }
      ])
    } else {
      setError(data.error || 'Error al agregar admin')
    }
    setLoading(false)
  }

  const handleDelete = async (user_id: string) => {
    if (!confirm('¿Seguro que deseas quitar el rol de admin a este usuario?'))
      return
    setLoading(true)
    setError(null)
    setSuccess(null)
    const res = await fetch(`/api/admins/${user_id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Administrador eliminado correctamente')
      setAdmins((prev) => prev.filter((a) => a.user_id !== user_id))
    } else {
      setError(data.error || 'Error al eliminar admin')
    }
    setLoading(false)
  }

  return (
    <div className='max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow border border-gray-100'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Administradores</h2>
      {error && (
        <div className='mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200'>
          {error}
        </div>
      )}
      {success && (
        <div className='mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200'>
          {success}
        </div>
      )}
      <form
        onSubmit={handleAdd}
        className='flex flex-col md:flex-row gap-4 mb-8'
      >
        <input
          type='text'
          name='user_id'
          value={form.user_id}
          onChange={handleChange}
          placeholder='User ID'
          className='flex-1 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2'
        />
        <span className='self-center text-gray-400'>o</span>
        <input
          type='email'
          name='email'
          value={form.email}
          onChange={handleChange}
          placeholder='Email'
          className='flex-1 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2'
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50'
        >
          Agregar admin
        </button>
      </form>
      <div>
        <h3 className='text-lg font-semibold mb-3 text-gray-700'>
          Lista de administradores
        </h3>
        {loading ? (
          <div className='py-8 text-center text-gray-500'>Cargando...</div>
        ) : (
          <ul className='divide-y divide-gray-100'>
            {admins.length === 0 && (
              <li className='py-4 text-gray-500 text-center'>
                No hay administradores.
              </li>
            )}
            {admins.map((admin) => (
              <li
                key={admin.user_id}
                className='flex justify-between items-center py-3'
              >
                <div>
                  <span className='font-mono text-sm text-gray-800'>
                    {admin.user_id}
                  </span>
                  {admin.users?.email && (
                    <span className='ml-2 text-gray-500 text-sm'>
                      ({admin.users.email})
                    </span>
                  )}
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${admin.rol === 'superadmin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                    {admin.rol}
                  </span>
                </div>
                {admin.rol === 'superadmin' ? (
                  <span className='text-gray-400 text-xs italic ml-2'>No revocable</span>
                ) : (
                  <button
                    onClick={() => handleDelete(admin.user_id)}
                    className='text-red-600 hover:text-red-800 px-3 py-1 rounded transition-colors'
                    disabled={loading}
                  >
                    Quitar admin
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

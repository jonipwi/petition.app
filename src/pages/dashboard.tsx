import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_id: '',
  })
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
          <p className="text-gray-600 text-center mb-6">
            You need to sign in with GitHub to access the dashboard.
          </p>
          <button
            onClick={() => signIn('github')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE}/api/petitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': prompt('Enter Admin Token:') || '',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setMessage(`Petition created successfully! ID: ${result.id}`)
        setFormData({ title: '', description: '', link_id: '' })
      } else {
        const text = await response.text()
        setMessage(text || 'Error creating petition')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Petition</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Petition</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Petition Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter petition title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter petition description"
                />
              </div>

              <div>
                <label htmlFor="link_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Unique Link ID *
                </label>
                <input
                  type="text"
                  id="link_id"
                  name="link_id"
                  value={formData.link_id}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9_]+"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., save-the-park"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only letters, numbers, and underscores allowed.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-md transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Petition'}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-md ${
                message.includes('successfully')
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
import { useState, FormEvent } from 'react'

interface PetitionFormProps {
  apiBase: string
  petitionId: string
  onSuccess: () => void
}

interface FormData {
  name: string
  email: string
  country: string
  message: string
  hp: string // honeypot
}

export default function PetitionForm({ apiBase, petitionId, onSuccess }: PetitionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: '',
    message: '',
    hp: '',
  })
  const [status, setStatus] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setStatus('Please enter your name.')
      return
    }

    setIsSubmitting(true)
    setStatus('Sending...')

    try {
      const res = await fetch(`${apiBase}/api/${petitionId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('✓ Thank you — your signature has been recorded.')
        setSubmitted(true)
        onSuccess()
      } else {
        const text = await res.text()
        setStatus(`Error: ${text || res.status}`)
      }
    } catch (error) {
      setStatus('Network error — please try again later.')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-700 text-xl font-semibold mb-2">
          ✓ Signature Recorded
        </div>
        <p className="text-green-600">
          Thank you for your support. Please share this petition with others.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={200}
          required
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          maxLength={100}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Your country"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          maxLength={800}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          placeholder="A short message of support"
        />
      </div>

      {/* Honeypot field - hidden from users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp">Leave this empty</label>
        <input
          type="text"
          id="hp"
          name="hp"
          value={formData.hp}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || submitted}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Signing...' : 'Sign Petition'}
      </button>

      {status && (
        <div
          className={`text-sm p-3 rounded-lg ${
            status.includes('✓')
              ? 'bg-green-50 text-green-700'
              : status.includes('Error')
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
      )}
    </form>
  )
}

import { useState, useEffect } from 'react'
import Head from 'next/head'
import PetitionForm from '@/components/PetitionForm'
import SignatureCounter from '@/components/SignatureCounter'
import ShareButtons from '@/components/ShareButtons'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090'
const PETITION_ID = process.env.NEXT_PUBLIC_PETITION_ID || 'default'

interface PetitionData {
  title: string
  description: string
}

export default function Home() {
  const [signatureCount, setSignatureCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [petitionData, setPetitionData] = useState<PetitionData | null>(null)
  const [petitionLoading, setPetitionLoading] = useState(true)

  useEffect(() => {
    fetchPetitionData()
    fetchCount()
    // Refresh count every 20 seconds
    const interval = setInterval(fetchCount, 20000)
    return () => clearInterval(interval)
  }, [])

  const fetchPetitionData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/${PETITION_ID}/info`)
      if (res.ok) {
        const data = await res.json()
        setPetitionData(data)
      }
    } catch (error) {
      console.error('Failed to fetch petition data:', error)
    } finally {
      setPetitionLoading(false)
    }
  }

  const fetchCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/${PETITION_ID}/count`)
      if (res.ok) {
        const data = await res.json()
        setSignatureCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch count:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignatureSuccess = () => {
    fetchCount()
  }

  if (petitionLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading petition...</p>
        </div>
      </main>
    )
  }

  if (!petitionData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Petition Not Found</h1>
          <p>The requested petition could not be found.</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <Head>
        <title>{petitionData.title}</title>
        <meta name="description" content={petitionData.description} />
        <meta property="og:title" content={petitionData.title} />
        <meta property="og:description" content={petitionData.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {petitionData.title}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed">
              {petitionData.description}
            </p>
          </header>

          <SignatureCounter count={signatureCount} loading={loading} />

          <PetitionForm 
            apiBase={API_BASE} 
            petitionId={PETITION_ID}
            onSuccess={handleSignatureSuccess}
          />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <ShareButtons />
          </div>

          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>
              Hosted by JacobYellowBridge. Please sign peacefully — do not include 
              sensitive personal information.
            </p>
            <p className="mt-2">
              This petition respects privacy. Email addresses are optional and never shared.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}

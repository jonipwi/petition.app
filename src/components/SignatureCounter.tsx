interface SignatureCounterProps {
  count: number
  loading: boolean
}

export default function SignatureCounter({ count, loading }: SignatureCounterProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Signatures Collected
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            count.toLocaleString()
          )}
        </div>
      </div>
    </div>
  )
}

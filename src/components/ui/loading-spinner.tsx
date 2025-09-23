export function LoadingSpinner() {
  return (
    <div className="text-center animate-fade-in-scale">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
      </div>
      <p className="mt-6 text-gray-700 font-semibold text-lg">Loading...</p>
      <p className="mt-2 text-gray-500 text-sm">Please wait while we prepare your dashboard</p>
    </div>
  )
}

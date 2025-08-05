export default function Custom404() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-medium text-white">404</h1>
        <div className="h-6 w-px bg-gray-400" />
        <p className="text-white">This page could not be found.</p>
      </div>
    </div>
  )
}

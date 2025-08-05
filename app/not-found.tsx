export default function Custom404() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">404</h1>
        <div className="h-6 w-px bg-gray-600" />
        <p className="text-gray-400">This page could not be found.</p>
      </div>
    </div>
  )
}
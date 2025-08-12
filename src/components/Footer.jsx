export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Your Name. All rights reserved.</div>
        <div className="opacity-70">Built with React • Vite • Tailwind</div>
      </div>
    </footer>
  )
}
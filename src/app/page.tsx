import Link from "next/link"
import { Button } from "../../src/components/button"
import { User, Music, Volume2, Play, Settings, Menu } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-orange-500" />
            <span className="font-semibold text-white">Sound Maker</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/apresetation">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/how-to-use" className="text-gray-300 hover:text-white text-sm flex items-center">
              <Volume2 className="h-4 w-4 mr-1" />
              how to use
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">
              log in
            </Link>
            <Link href="/signup" className="text-gray-300 hover:text-white text-sm">
              sign up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-800">
            <Menu className="h-5 w-5" />
          </Button>

          {/* User Icon */}
          <div className="hidden md:flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-800">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - keeping the rest of the code the same */}
      <main
        className="flex-1"
        style={{
          background: "linear-gradient(to bottom, #CF1020, #E63946, #F77F8E)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Added a simple hero section with icons */}
          <div className="text-center text-white">
            <Music className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Create audios in your way</h1>
            <p className="text-xl mb-8">Your best sound creation platform</p>
            <Button size="lg" className="bg-black hover:bg-gray-800">
            <Link href="/mainPage">starthere</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - keeping the same as before */}
      <footer className="bg-gray-900 border-t border-gray-700 px-4 py-6">
        {/* Footer content remains the same */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <Music className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-white">Sound maker</span>
            </div>

            {/* Company Section */}
            <div className="text-right">
              <h3 className="font-semibold text-white mb-2">company</h3>
              <p className="text-sm text-gray-300">About Us</p>
              <p className="text-sm text-gray-300">Terms & Privacy</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3 mt-4">
            <Link href="#" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

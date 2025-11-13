"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { services } from "@/data/services"

// Interactive spider web component
function SpiderWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Web nodes
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = []
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Mouse attraction
        const dx = mousePos.current.x - node.x
        const dy = mousePos.current.y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          node.vx += dx * 0.00005
          node.vy += dy * 0.00005
        }
      })

      // Draw connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.2
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "radial-gradient(circle at center, #0f0f23 0%, #000000 100%)" }}
    />
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)
  const [showResults, setShowResults] = useState(false)

  // Smart search function
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredServices(services)
      setShowResults(false)
      return
    }

    const filtered = services.filter(
      (service) =>
        service.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())) ||
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredServices(filtered)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <SpiderWeb />

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ANACOD
            </h1>
            <p className="text-gray-400 mt-2">Solutions digitales innovantes</p>
          </div>
        </header>

        {/* Hero section with search */}
        <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Trouvez le service
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                qu'il vous faut
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Recherchez parmi nos services digitaux pour donner vie à vos projets
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Ex: modifier site web, application mobile..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-gray-900/50 border-gray-700 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Search results or all services */}
          <div className="w-full max-w-6xl">
            {showResults && filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Aucun service trouvé pour "{searchQuery}"</p>
                <Button
                  variant="ghost"
                  onClick={() => handleSearch("")}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Voir tous les services
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <Card
                      key={service.id}
                      className="bg-gray-900/30 border-gray-700 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm group hover:scale-105"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <IconComponent className="w-6 h-6 text-blue-400" />
                          </div>
                          <CardTitle className="text-white group-hover:text-blue-300 transition-colors text-sm md:text-base">
                            {service.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-400 mb-4 text-sm">{service.description}</CardDescription>
                        {(service.price || service.duration) && (
                          <div className="mb-4 space-y-1">
                            {service.price && <p className="text-xs text-blue-400 font-medium">{service.price}</p>}
                            {service.duration && <p className="text-xs text-gray-500">Durée: {service.duration}</p>}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          En savoir plus
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 p-6 md:p-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">© 2024 ANACOD. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

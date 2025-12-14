import { useState } from 'react'
import { compareAlgorithms } from '@/lib/ai/pathfinding'
import { convertToPathfindingMaze } from '@/lib/phaser/maze'

interface AlgorithmComparisonScreenProps {
  onBackToMenu: () => void
}

export function AlgorithmComparisonScreen({ onBackToMenu }: AlgorithmComparisonScreenProps) {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = () => {
    setLoading(true)
    const maze = convertToPathfindingMaze()
    const start = { x: 1, y: 1 }
    const goal = { x: 26, y: 29 }
    
    setTimeout(() => {
      const comparison = compareAlgorithms(maze, start, goal)
      setResults(comparison)
      setLoading(false)
    }, 500)
  }

  const handleExport = () => {
    if (!results) return
    
    const data = {
      timestamp: new Date().toISOString(),
      algorithms: ['A*', 'Dijkstra', 'BFS'],
      results: {
        astar: results.astar.metrics,
        dijkstra: results.dijkstra.metrics,
        bfs: results.bfs.metrics,
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pacman-comparison-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-card/50 p-4 rounded-lg backdrop-blur">
          <div>
            <h2 className="text-3xl font-bold text-gradient">Comparación de Algoritmos</h2>
            <p className="text-sm text-muted-foreground mt-1">UC009 - Comparar y Exportar Algoritmos</p>
          </div>
          <button onClick={onBackToMenu} className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:scale-105 transition-transform font-semibold">
            ← Volver al Menú
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controles */}
          <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold mb-4">Ejecutar Comparación</h3>
            <p className="text-muted-foreground mb-6">
              Compara el desempeño de A*, Dijkstra y BFS en el mismo maze.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:scale-105 transition-transform font-semibold disabled:opacity-50"
              >
                {loading ? 'Ejecutando...' : '▶ Ejecutar Comparación'}
              </button>
              
              {results && (
                <button
                  onClick={handleExport}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:scale-105 transition-transform font-semibold"
                >
                  💾 Exportar Resultados (JSON)
                </button>
              )}
            </div>
          </div>

          {/* Algoritmos */}
          <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold mb-4">Algoritmos</h3>
            <div className="space-y-3">
              {[
                { name: 'A* (A-Star)', desc: 'Búsqueda informada con heurística Manhattan', color: 'border-red-500' },
                { name: 'Dijkstra', desc: 'Búsqueda sin heurística, garantiza camino más corto', color: 'border-blue-500' },
                { name: 'BFS', desc: 'Búsqueda en anchura, explora por niveles', color: 'border-green-500' },
              ].map((algo) => (
                <div key={algo.name} className={`border-l-4 ${algo.color} pl-4 py-2`}>
                  <div className="font-semibold">{algo.name}</div>
                  <div className="text-sm text-muted-foreground">{algo.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        {results && (
          <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
            <h3 className="text-xl font-bold mb-4">Resultados de Comparación</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'astar', name: 'A*', color: 'bg-red-500' },
                { key: 'dijkstra', name: 'Dijkstra', color: 'bg-blue-500' },
                { key: 'bfs', name: 'BFS', color: 'bg-green-500' },
              ].map((algo) => {
                const data = results[algo.key].metrics
                return (
                  <div key={algo.key} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${algo.color}`}></div>
                      <span className="font-bold text-lg">{algo.name}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tiempo:</span>
                        <span className="font-semibold">{data.executionTimeMs.toFixed(2)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nodos:</span>
                        <span className="font-semibold">{data.nodesExpanded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Path:</span>
                        <span className="font-semibold">{data.pathLength}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm font-semibold mb-2">📊 Análisis:</div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>A* es el más rápido gracias a su heurística</li>
                <li>Dijkstra explora más nodos pero garantiza optimalidad</li>
                <li>BFS explora todos los niveles por igual</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

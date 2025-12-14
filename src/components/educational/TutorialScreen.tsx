import { useState } from 'react'

interface TutorialScreenProps {
  onBackToMenu: () => void
}

const tutorials = [
  {
    id: 'intro',
    title: '¿Qué es PacMan Intelligence Lab?',
    content: `Esta plataforma combina el clásico juego Pacman con visualizaciones en tiempo real de algoritmos de inteligencia artificial. 

Podrás ver cómo los fantasmas usan diferentes algoritmos de pathfinding (A*, Dijkstra, BFS) para perseguir a Pacman, y cómo cambian su comportamiento según una máquina de estados finitos (FSM).`
  },
  {
    id: 'astar',
    title: 'Algoritmo A* (A-Star)',
    content: `A* es un algoritmo de búsqueda informada que usa una función heurística para estimar el costo del camino más corto.

**Cómo funciona:**
- Usa f(n) = g(n) + h(n)
- g(n) = costo desde inicio hasta n
- h(n) = heurística (distancia Manhattan)

**Ventajas:**
✓ Muy eficiente
✓ Encuentra camino óptimo
✓ Usa menos memoria que Dijkstra

**Desventajas:**
✗ Requiere buena heurística
✗ Puede ser lento en mazes grandes

**Complejidad:** O(b^d) donde b es el factor de ramificación y d es la profundidad.`
  },
  {
    id: 'dijkstra',
    title: 'Algoritmo de Dijkstra',
    content: `Dijkstra es un algoritmo de búsqueda sin heurística que garantiza encontrar el camino más corto.

**Cómo funciona:**
- Explora todos los nodos vecinos
- Siempre elige el nodo con menor costo acumulado
- No usa estimación de distancia

**Ventajas:**
✓ Garantiza camino óptimo
✓ No necesita heurística
✓ Funciona con pesos variables

**Desventajas:**
✗ Más lento que A*
✗ Explora más nodos innecesarios

**Complejidad:** O(V²) con lista de adyacencia, O(E log V) con heap.`
  },
  {
    id: 'bfs',
    title: 'Búsqueda en Anchura (BFS)',
    content: `BFS explora el grafo nivel por nivel, visitando todos los vecinos antes de pasar al siguiente nivel.

**Cómo funciona:**
- Usa una cola (FIFO)
- Explora por niveles de distancia
- Garantiza camino más corto en grafos sin pesos

**Ventajas:**
✓ Simple de implementar
✓ Encuentra camino más corto (sin pesos)
✓ Completo (siempre encuentra solución)

**Desventajas:**
✗ No funciona con pesos
✗ Usa mucha memoria
✗ Lento en grafos grandes

**Complejidad:** O(V + E) donde V son vértices y E aristas.`
  },
  {
    id: 'fsm',
    title: 'Máquina de Estados Finitos (FSM)',
    content: `La FSM controla el comportamiento de los fantasmas con 4 estados:

**Estados:**

🔴 **CHASE (Persecución)**
- Fantasmas persiguen activamente a Pacman
- Cada fantasma usa su estrategia única
- Duración: 20 segundos

🟢 **SCATTER (Dispersión)**
- Fantasmas van a sus esquinas asignadas
- Permite a Pacman descansar
- Duración: 7 segundos

🔵 **FRIGHTENED (Asustado)**
- Pacman comió power pellet
- Fantasmas se vuelven azules
- Pacman puede comerlos
- Duración: 6 segundos

⚪ **DEAD (Muerto)**
- Fantasma fue comido
- Regresa a la casa
- Se revive al llegar

**Transiciones:**
Las transiciones ocurren por eventos (power pellet) o timeouts (tiempo límite).`
  },
  {
    id: 'glossary',
    title: 'Glosario de Términos',
    content: `**Pathfinding:** Proceso de encontrar un camino entre dos puntos.

**Heurística:** Función que estima el costo de llegar al objetivo.

**Nodos Expandidos:** Cantidad de nodos explorados durante la búsqueda.

**Distancia Manhattan:** |x1-x2| + |y1-y2| - distancia en cuadrícula.

**FSM:** Finite State Machine - modelo de estados y transiciones.

**Algoritmo Informado:** Usa información adicional (heurística).

**Algoritmo No Informado:** No usa estimaciones, explora sistemáticamente.

**Complejidad Temporal:** Tiempo de ejecución en función del tamaño.

**Complejidad Espacial:** Memoria usada en función del tamaño.`
  }
]

export function TutorialScreen({ onBackToMenu }: TutorialScreenProps) {
  const [selectedTutorial, setSelectedTutorial] = useState(tutorials[0])

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-pink-900 to-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-card/50 p-4 rounded-lg backdrop-blur">
          <div>
            <h2 className="text-3xl font-bold text-gradient">Tutorial Interactivo</h2>
            <p className="text-sm text-muted-foreground mt-1">UC016 - Acceder Recursos Educativos</p>
          </div>
          <button onClick={onBackToMenu} className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg hover:scale-105 transition-transform font-semibold">
            ← Volver al Menú
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menú de Tutoriales */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 p-4 rounded-lg backdrop-blur">
              <h3 className="font-bold mb-4">Temas</h3>
              <div className="space-y-2">
                {tutorials.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => setSelectedTutorial(tutorial)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedTutorial.id === tutorial.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="font-semibold text-sm">{tutorial.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido del Tutorial */}
          <div className="lg:col-span-3">
            <div className="bg-card/50 p-8 rounded-lg backdrop-blur">
              <h3 className="text-2xl font-bold mb-6">{selectedTutorial.title}</h3>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {selectedTutorial.content}
                </div>
              </div>
            </div>

            {/* Recursos Adicionales */}
            <div className="mt-6 bg-card/50 p-6 rounded-lg backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Recursos Adicionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="text-xl mb-2">📚</div>
                  <div className="font-semibold mb-1">Documentación</div>
                  <div className="text-sm text-muted-foreground">
                    Consulta el SAD y SRS del proyecto
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <div className="text-xl mb-2">🎮</div>
                  <div className="font-semibold mb-1">Práctica</div>
                  <div className="text-sm text-muted-foreground">
                    Prueba los algoritmos en el modo juego
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <div className="text-xl mb-2">📊</div>
                  <div className="font-semibold mb-1">Comparación</div>
                  <div className="text-sm text-muted-foreground">
                    Compara rendimiento de algoritmos
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <div className="text-xl mb-2">🔍</div>
                  <div className="font-semibold mb-1">Análisis</div>
                  <div className="text-sm text-muted-foreground">
                    Modo paso a paso para análisis detallado
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

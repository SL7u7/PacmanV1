interface MenuScreenProps {
  onStartGame: (level: number, difficulty: string) => void
  onAlgorithmComparison?: () => void
  onStepByStep?: () => void
  onTutorial?: () => void
}

export function MenuScreen({
  onStartGame,
  onAlgorithmComparison,
  onStepByStep,
  onTutorial,
}: MenuScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gradient">
            PacMan Intelligence Lab
          </h1>
          <p className="text-xl text-muted-foreground">
            Plataforma Educativa de IA con Juego Interactivo
          </p>
          <p className="text-sm text-muted-foreground">
            Universidad Nacional de Ingeniería - Grupo 2
          </p>
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onStartGame(1, 'medium')}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Jugar Pacman</h3>
              <p className="text-sm opacity-90">
                Comienza el juego con visualización de IA
              </p>
            </div>
          </button>

          <button
            onClick={onAlgorithmComparison}
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 p-8 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Comparar Algoritmos</h3>
              <p className="text-sm opacity-90">
                Analiza A*, Dijkstra y BFS
              </p>
            </div>
          </button>

          <button
            onClick={onStepByStep}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Modo Paso a Paso</h3>
              <p className="text-sm opacity-90">
                Analiza frame por frame
              </p>
            </div>
          </button>

          <button
            onClick={onTutorial}
            className="group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 p-8 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Tutorial</h3>
              <p className="text-sm opacity-90">
                Aprende sobre algoritmos de IA
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Proyecto de Ingeniería de Software I</p>
          <p>Docente: Gipsy Miguel Arrunátegui Angulo</p>
        </div>
      </div>
    </div>
  )
}

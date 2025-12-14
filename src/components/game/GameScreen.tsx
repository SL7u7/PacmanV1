import { PhaserGame } from './PhaserGame'
import { FSMPanel } from './FSMPanel'
import { PathfindingPanel } from './PathfindingPanel'

interface GameScreenProps {
  onBackToMenu: () => void
}

export function GameScreen({ onBackToMenu }: GameScreenProps) {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-card/50 p-4 rounded-lg backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-gradient">PacMan Intelligence Lab</h2>
            <p className="text-sm text-muted-foreground">UC001 - Jugar Pacman con IA</p>
          </div>
          <button
            onClick={onBackToMenu}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform font-semibold"
          >
            ← Volver al Menú
          </button>
        </div>

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Phaser Game - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              <PhaserGame />
            </div>
            <div className="mt-2 bg-card/50 p-3 rounded-lg backdrop-blur">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-semibold text-primary">Controles:</span> WASD o Flechas para mover | 
                <span className="font-semibold text-primary ml-2">ESPACIO:</span> Pausar
              </p>
            </div>
          </div>

          {/* Side Panels - 1/3 width */}
          <div className="space-y-4">
            {/* FSM Panel */}
            <FSMPanel />
            
            {/* Pathfinding Panel */}
            <PathfindingPanel />
            
            {/* Quick Info */}
            <div className="bg-card/50 p-4 rounded-lg backdrop-blur">
              <h3 className="font-bold mb-3 text-lg">Visualización IA</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>CHASE - Persecución</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>SCATTER - Dispersión</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>FRIGHTENED - Asustado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>DEAD - Muerto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

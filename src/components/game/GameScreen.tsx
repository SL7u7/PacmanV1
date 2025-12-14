interface GameScreenProps {
  onBackToMenu: () => void
}

export function GameScreen({ onBackToMenu }: GameScreenProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">PacMan Intelligence Lab</h2>
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
          >
            Volver al Menú
          </button>
        </div>

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Phaser Game */}
          <div className="lg:col-span-2">
            <div id="phaser-game" className="bg-black rounded-lg"></div>
          </div>

          {/* Side Panels */}
          <div className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-bold mb-2">Estados FSM</h3>
              <p className="text-sm text-muted-foreground">
                Visualización de estados de fantasmas
              </p>
            </div>
            
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-bold mb-2">Pathfinding</h3>
              <p className="text-sm text-muted-foreground">
                Métricas de algoritmos en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

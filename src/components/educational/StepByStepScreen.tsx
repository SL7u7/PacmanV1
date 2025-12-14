import { useState } from 'react'

interface StepByStepScreenProps {
  onBackToMenu: () => void
}

export function StepByStepScreen({ onBackToMenu }: StepByStepScreenProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const totalFrames = 100

  const speeds = [
    { label: '0.25x', value: 0.25 },
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '4x', value: 4 },
  ]

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-card/50 p-4 rounded-lg backdrop-blur">
          <div>
            <h2 className="text-3xl font-bold text-gradient">Modo Paso a Paso</h2>
            <p className="text-sm text-muted-foreground mt-1">UC012 - Analizar Juego en Detalle</p>
          </div>
          <button onClick={onBackToMenu} className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:scale-105 transition-transform font-semibold">
            ← Volver al Menú
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualización Principal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card/50 p-6 rounded-lg backdrop-blur aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <div className="text-2xl font-bold">Frame {currentFrame}/{totalFrames}</div>
                <div className="text-muted-foreground mt-2">Visualización de replay aquí</div>
              </div>
            </div>

            {/* Controles de Reproducción */}
            <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Controles de Reproducción</h3>
              
              {/* Barra de progreso */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={totalFrames}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{totalFrames}</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                  className="px-4 py-2 bg-secondary rounded hover:bg-secondary/80"
                >
                  ⏮ Anterior
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 px-4 py-2 bg-primary rounded hover:bg-primary/80"
                >
                  {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
                </button>
                <button
                  onClick={() => setCurrentFrame(Math.min(totalFrames, currentFrame + 1))}
                  className="px-4 py-2 bg-secondary rounded hover:bg-secondary/80"
                >
                  Siguiente ⏭
                </button>
              </div>

              {/* Control de velocidad */}
              <div>
                <div className="text-sm font-semibold mb-2">Velocidad de Reproducción:</div>
                <div className="flex gap-2">
                  {speeds.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSpeed(s.value)}
                      className={`px-3 py-1 rounded text-sm ${
                        speed === s.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Información */}
          <div className="space-y-4">
            <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Estado del Frame</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Score:</div>
                  <div className="text-2xl font-bold">1,250</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Lives:</div>
                  <div className="text-2xl font-bold">3</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Pellets Remaining:</div>
                  <div className="text-2xl font-bold">156</div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Eventos del Frame</h3>
              <div className="space-y-2 text-sm">
                <div className="border-l-4 border-green-500 pl-3 py-1">
                  <div className="font-semibold">Pellet comido</div>
                  <div className="text-muted-foreground">+10 puntos</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3 py-1">
                  <div className="font-semibold">Blinky: CHASE → SCATTER</div>
                  <div className="text-muted-foreground">Transición FSM</div>
                </div>
              </div>
            </div>

            <div className="bg-card/50 p-6 rounded-lg backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Funcionalidades</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Reproducción frame-by-frame</li>
                <li>Control de velocidad (0.25x - 4x)</li>
                <li>Visualización de eventos</li>
                <li>Estados de IA en cada frame</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StepByStepScreenProps {
  onBackToMenu: () => void
}

export function StepByStepScreen({ onBackToMenu }: StepByStepScreenProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Modo Paso a Paso</h2>
          <button onClick={onBackToMenu} className="px-4 py-2 bg-secondary rounded-lg">
            Volver al Menú
          </button>
        </div>
        <div className="bg-card p-8 rounded-lg">
          <p className="text-muted-foreground">UC012 - Analizar Juego en Detalle</p>
        </div>
      </div>
    </div>
  )
}

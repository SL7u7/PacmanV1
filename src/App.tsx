import { useState } from 'react'
import { MenuScreen } from './components/ui/MenuScreen'
import { GameScreen } from './components/game/GameScreen'
import { AlgorithmComparisonScreen } from './components/educational/AlgorithmComparisonScreen'
import { StepByStepScreen } from './components/educational/StepByStepScreen'
import { TutorialScreen } from './components/educational/TutorialScreen'
import { useGameStore } from './lib/store/gameStore'

type AppView = 'menu' | 'game' | 'algorithms' | 'stepbystep' | 'tutorial'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('menu')
  const resetGame = useGameStore((state) => state.resetGame)

  const handleStartGame = (level: number, difficulty: string) => {
    resetGame()
    setCurrentView('game')
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  const renderView = () => {
    switch (currentView) {
      case 'menu':
        return (
          <MenuScreen
            onStartGame={handleStartGame}
            onAlgorithmComparison={() => setCurrentView('algorithms')}
            onStepByStep={() => setCurrentView('stepbystep')}
            onTutorial={() => setCurrentView('tutorial')}
          />
        )
      case 'game':
        return <GameScreen onBackToMenu={handleBackToMenu} />
      case 'algorithms':
        return <AlgorithmComparisonScreen onBackToMenu={handleBackToMenu} />
      case 'stepbystep':
        return <StepByStepScreen onBackToMenu={handleBackToMenu} />
      case 'tutorial':
        return <TutorialScreen onBackToMenu={handleBackToMenu} />
      default:
        return <MenuScreen onStartGame={handleStartGame} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {renderView()}
    </div>
  )
}

export default App

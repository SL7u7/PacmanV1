// ===== TIPOS BASE =====
export interface Vector2D {
  x: number
  y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'

export type GhostState = 'CHASE' | 'SCATTER' | 'FRIGHTENED' | 'DEAD'

export type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde'

export type AlgorithmType = 'astar' | 'dijkstra' | 'bfs'

export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'custom'

export type TargetingStrategy = 'direct' | 'ambush' | 'proximity' | 'random'

// ===== ALGORITMOS =====
export interface PathNode {
  position: Vector2D
  g: number
  h: number
  f: number
  parent: PathNode | null
}

export interface PathfindingResult {
  path: Vector2D[]
  metrics: AlgorithmMetrics
  expandedNodes: Vector2D[]
}

export interface AlgorithmMetrics {
  algorithm: AlgorithmType
  nodesExpanded: number
  executionTimeMs: number
  pathLength: number
  timestamp: number
}

export interface ComparisonResult {
  algorithms: AlgorithmType[]
  results: PathfindingResult[]
  origin: Vector2D
  destination: Vector2D
}

// ===== FSM =====
export interface FSMTransition {
  from: GhostState
  to: GhostState
  condition: string
  event: string
  timestamp: number
}

export interface FSMVisualization {
  ghostName: GhostName
  currentState: GhostState
  stateHistory: { state: GhostState; timestamp: number }[]
  transitions: FSMTransition[]
  transitionCounts: Record<GhostState, number>
  timeInState: number
}

// ===== REPLAY SYSTEM =====
export interface GameFrame {
  frameNumber: number
  timestamp: number
  pacmanPosition: Vector2D
  pacmanDirection: Direction
  ghostStates: {
    name: GhostName
    position: Vector2D
    state: GhostState
    target: Vector2D
    path: Vector2D[]
  }[]
  score: number
  lives: number
  pelletsRemaining: number
  events: GameEvent[]
}

export interface GameEvent {
  timestamp: number
  type:
    | 'fsm_change'
    | 'pellet_eaten'
    | 'power_pellet'
    | 'ghost_eaten'
    | 'pacman_death'
    | 'level_complete'
  description: string
  ghostName?: GhostName
  details?: any
}

export interface ReplayData {
  frames: GameFrame[]
  metadata: {
    level: number
    difficulty: string
    startTime: number
    endTime: number
    finalScore: number
    algorithmsUsed: Record<GhostName, AlgorithmType>
  }
}

// ===== EDUCATIONAL =====
export interface Tutorial {
  id: string
  title: string
  description: string
  steps: TutorialStep[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface TutorialStep {
  id: string
  title: string
  content: string
  interactiveDemo?: () => void
  nextStep?: string
}

export interface GlossaryTerm {
  term: string
  definition: string
  category: 'algorithm' | 'fsm' | 'game' | 'general'
  relatedTerms: string[]
}

export interface AlgorithmDocumentation {
  name: string
  description: string
  pseudocode: string
  timeComplexity: string
  spaceComplexity: string
  advantages: string[]
  disadvantages: string[]
  useCases: string[]
  visualization?: string
}

// ===== EXPORT =====
export interface ExportData {
  version: string
  exportDate: string
  gameSession: {
    level: number
    difficulty: string
    score: number
    time: number
  }
  algorithmMetrics: AlgorithmMetrics[]
  fsmData: FSMVisualization[]
  comparisonResults?: ComparisonResult[]
}

export type ExportFormat = 'json' | 'csv' | 'pdf'

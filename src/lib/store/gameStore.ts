import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Vector2D {
  x: number
  y: number
}

export type GhostState = 'CHASE' | 'SCATTER' | 'FRIGHTENED' | 'DEAD'
export type AlgorithmType = 'astar' | 'dijkstra' | 'bfs'
export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'custom'

export interface GhostConfig {
  name: string
  color: string
  algorithm: AlgorithmType
  aggressiveness: number
  speed: number
  strategy: 'direct' | 'ambush' | 'proximity' | 'random'
}

export interface GameConfig {
  difficulty: DifficultyPreset
  level: number
  soundEnabled: boolean
  showPathVisualization: boolean
  showFSMVisualization: boolean
  gameSpeed: number
  ghostConfigs: GhostConfig[]
}

export interface GameSession {
  score: number
  lives: number
  pelletsRemaining: number
  startTime: number
  elapsedTime: number
}

export interface HighScore {
  score: number
  level: number
  date: string
  time: number
}

interface GameState {
  // Configuration
  config: GameConfig
  setConfig: (config: Partial<GameConfig>) => void
  
  // Session
  session: GameSession
  updateSession: (session: Partial<GameSession>) => void
  resetSession: () => void
  
  // High Scores
  highScores: HighScore[]
  addHighScore: (score: HighScore) => void
  
  // Game State
  isPaused: boolean
  isPlaying: boolean
  togglePause: () => void
  startGame: () => void
  endGame: () => void
  resetGame: () => void
  
  // Statistics
  gamesPlayed: number
  totalScore: number
  algorithmStats: Record<AlgorithmType, {
    timesUsed: number
    avgExecutionTime: number
    avgNodesExpanded: number
  }>
  updateAlgorithmStats: (algorithm: AlgorithmType, execTime: number, nodes: number) => void
}

const DEFAULT_CONFIG: GameConfig = {
  difficulty: 'medium',
  level: 1,
  soundEnabled: true,
  showPathVisualization: true,
  showFSMVisualization: true,
  gameSpeed: 1.0,
  ghostConfigs: [
    {
      name: 'blinky',
      color: '#FF0000',
      algorithm: 'astar',
      aggressiveness: 8,
      speed: 1.0,
      strategy: 'direct',
    },
    {
      name: 'pinky',
      color: '#FFB8FF',
      algorithm: 'astar',
      aggressiveness: 6,
      speed: 0.95,
      strategy: 'ambush',
    },
    {
      name: 'inky',
      color: '#00FFFF',
      algorithm: 'bfs',
      aggressiveness: 5,
      speed: 0.9,
      strategy: 'proximity',
    },
    {
      name: 'clyde',
      color: '#FFB852',
      algorithm: 'dijkstra',
      aggressiveness: 4,
      speed: 0.85,
      strategy: 'random',
    },
  ],
}

const DEFAULT_SESSION: GameSession = {
  score: 0,
  lives: 3,
  pelletsRemaining: 0,
  startTime: Date.now(),
  elapsedTime: 0,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      config: DEFAULT_CONFIG,
      session: DEFAULT_SESSION,
      highScores: [],
      isPaused: false,
      isPlaying: false,
      gamesPlayed: 0,
      totalScore: 0,
      algorithmStats: {
        astar: { timesUsed: 0, avgExecutionTime: 0, avgNodesExpanded: 0 },
        dijkstra: { timesUsed: 0, avgExecutionTime: 0, avgNodesExpanded: 0 },
        bfs: { timesUsed: 0, avgExecutionTime: 0, avgNodesExpanded: 0 },
      },

      // Actions
      setConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      updateSession: (newSession) =>
        set((state) => ({
          session: { ...state.session, ...newSession },
        })),

      resetSession: () => set({ session: DEFAULT_SESSION }),

      addHighScore: (score) =>
        set((state) => ({
          highScores: [...state.highScores, score]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10), // Keep top 10
        })),

      togglePause: () =>
        set((state) => ({
          isPaused: !state.isPaused,
        })),

      startGame: () =>
        set({
          isPlaying: true,
          isPaused: false,
          session: { ...DEFAULT_SESSION, startTime: Date.now() },
        }),

      endGame: () =>
        set((state) => {
          const finalScore = state.session.score
          const finalTime = Date.now() - state.session.startTime
          
          return {
            isPlaying: false,
            gamesPlayed: state.gamesPlayed + 1,
            totalScore: state.totalScore + finalScore,
          }
        }),

      resetGame: () =>
        set({
          session: DEFAULT_SESSION,
          isPlaying: false,
          isPaused: false,
        }),

      updateAlgorithmStats: (algorithm, execTime, nodes) =>
        set((state) => {
          const current = state.algorithmStats[algorithm]
          const newTimesUsed = current.timesUsed + 1
          
          return {
            algorithmStats: {
              ...state.algorithmStats,
              [algorithm]: {
                timesUsed: newTimesUsed,
                avgExecutionTime:
                  (current.avgExecutionTime * current.timesUsed + execTime) / newTimesUsed,
                avgNodesExpanded:
                  (current.avgNodesExpanded * current.timesUsed + nodes) / newTimesUsed,
              },
            },
          }
        }),
    }),
    {
      name: 'pacman-storage',
      partialize: (state) => ({
        config: state.config,
        highScores: state.highScores,
        gamesPlayed: state.gamesPlayed,
        totalScore: state.totalScore,
        algorithmStats: state.algorithmStats,
      }),
    }
  )
)

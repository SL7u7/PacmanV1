import type {
  Vector2D,
  GhostState,
  GhostName,
  FSMTransition,
  AlgorithmType,
} from '../types'
import { runPathfinding } from './pathfinding'

// ===== CONSTANTES =====

export const GHOST_COLORS: Record<GhostName, number> = {
  blinky: 0xff0000, // Rojo
  pinky: 0xffb8ff,  // Rosa
  inky: 0x00ffff,   // Cyan
  clyde: 0xffb852,  // Naranja
}

export const SCATTER_CORNERS: Record<GhostName, Vector2D> = {
  blinky: { x: 25, y: 0 },
  pinky: { x: 2, y: 0 },
  inky: { x: 27, y: 30 },
  clyde: { x: 0, y: 30 },
}

// Duraciones de estados (en frames a 60fps)
export const STATE_DURATIONS = {
  CHASE: 20 * 60,      // 20 segundos
  SCATTER: 7 * 60,     // 7 segundos
  FRIGHTENED: 6 * 60,  // 6 segundos
}

// ===== INTERFACES =====

export interface GhostConfig {
  name: GhostName
  algorithm: AlgorithmType
  aggressiveness: number // 1-10
  speed: number // 0.5-1.5
  strategy: 'direct' | 'ambush' | 'proximity' | 'random'
}

export interface Ghost {
  name: GhostName
  position: Vector2D
  state: GhostState
  targetPosition: Vector2D
  path: Vector2D[]
  config: GhostConfig
  stateTimer: number
  previousState: GhostState // Para volver después de FRIGHTENED
  color: number
  scatterCorner: Vector2D
  homePosition: Vector2D
}

// ===== FSM - TRANSICIONES =====

export const FSM_TRANSITIONS: FSMTransition[] = [
  {
    from: 'CHASE',
    to: 'SCATTER',
    condition: 'Timer expires (chase time)',
    event: 'TIMEOUT',
    timestamp: 0,
  },
  {
    from: 'SCATTER',
    to: 'CHASE',
    condition: 'Timer expires (scatter time)',
    event: 'TIMEOUT',
    timestamp: 0,
  },
  {
    from: 'CHASE',
    to: 'FRIGHTENED',
    condition: 'Pacman eats power pellet',
    event: 'POWER_PELLET',
    timestamp: 0,
  },
  {
    from: 'SCATTER',
    to: 'FRIGHTENED',
    condition: 'Pacman eats power pellet',
    event: 'POWER_PELLET',
    timestamp: 0,
  },
  {
    from: 'FRIGHTENED',
    to: 'CHASE',
    condition: 'Timer expires from Chase',
    event: 'TIMEOUT',
    timestamp: 0,
  },
  {
    from: 'FRIGHTENED',
    to: 'SCATTER',
    condition: 'Timer expires from Scatter',
    event: 'TIMEOUT',
    timestamp: 0,
  },
  {
    from: 'FRIGHTENED',
    to: 'DEAD',
    condition: 'Pacman eats ghost',
    event: 'EATEN',
    timestamp: 0,
  },
  {
    from: 'DEAD',
    to: 'CHASE',
    condition: 'Ghost reaches home',
    event: 'REVIVE',
    timestamp: 0,
  },
]

// ===== FUNCIONES DE TARGETING =====

function calculateChaseTarget(
  ghost: Ghost,
  pacmanPos: Vector2D,
  pacmanDir: Vector2D,
  blinkyPos?: Vector2D
): Vector2D {
  switch (ghost.config.strategy) {
    case 'direct':
      // Blinky: Persecución directa
      return pacmanPos

    case 'ambush':
      // Pinky: Apuntar 4 casillas adelante de Pacman
      return {
        x: pacmanPos.x + pacmanDir.x * 4,
        y: pacmanPos.y + pacmanDir.y * 4,
      }

    case 'proximity':
      // Inky: Comportamiento complejo basado en Blinky
      if (blinkyPos) {
        const ahead = {
          x: pacmanPos.x + pacmanDir.x * 2,
          y: pacmanPos.y + pacmanDir.y * 2,
        }
        const vector = {
          x: ahead.x - blinkyPos.x,
          y: ahead.y - blinkyPos.y,
        }
        return {
          x: blinkyPos.x + vector.x * 2,
          y: blinkyPos.y + vector.y * 2,
        }
      }
      return pacmanPos

    case 'random':
      // Clyde: Si está lejos persigue, si está cerca huye
      const distance = Math.sqrt(
        Math.pow(ghost.position.x - pacmanPos.x, 2) +
        Math.pow(ghost.position.y - pacmanPos.y, 2)
      )
      return distance > 8 ? pacmanPos : ghost.scatterCorner

    default:
      return pacmanPos
  }
}

// ===== CREAR FANTASMA =====

export function createGhost(
  name: GhostName,
  homePosition: Vector2D,
  config: GhostConfig
): Ghost {
  return {
    name,
    position: { ...homePosition },
    state: 'SCATTER',
    targetPosition: SCATTER_CORNERS[name],
    path: [],
    config,
    stateTimer: STATE_DURATIONS.SCATTER,
    previousState: 'SCATTER',
    color: GHOST_COLORS[name],
    scatterCorner: SCATTER_CORNERS[name],
    homePosition,
  }
}

// ===== ACTUALIZAR ESTADO FSM =====

export function updateGhostState(
  ghost: Ghost,
  pacmanPos: Vector2D,
  pacmanDir: Vector2D,
  powerActive: boolean,
  maze: number[][],
  blinkyPos?: Vector2D
): Ghost {
  const updated = { ...ghost }

  // Decrementar timer
  updated.stateTimer--

  // Manejar transiciones
  if (powerActive && updated.state !== 'FRIGHTENED' && updated.state !== 'DEAD') {
    // TRANSICIÓN: CHASE/SCATTER → FRIGHTENED
    updated.previousState = updated.state
    updated.state = 'FRIGHTENED'
    updated.stateTimer = STATE_DURATIONS.FRIGHTENED
  } else if (updated.stateTimer <= 0) {
    // TRANSICIÓN: Timeout
    switch (updated.state) {
      case 'CHASE':
        updated.state = 'SCATTER'
        updated.stateTimer = STATE_DURATIONS.SCATTER
        break
      case 'SCATTER':
        updated.state = 'CHASE'
        updated.stateTimer = STATE_DURATIONS.CHASE
        break
      case 'FRIGHTENED':
        updated.state = updated.previousState
        updated.stateTimer =
          updated.previousState === 'CHASE'
            ? STATE_DURATIONS.CHASE
            : STATE_DURATIONS.SCATTER
        break
      case 'DEAD':
        // Revivir cuando llega a home
        if (
          updated.position.x === updated.homePosition.x &&
          updated.position.y === updated.homePosition.y
        ) {
          updated.state = 'SCATTER'
          updated.stateTimer = STATE_DURATIONS.SCATTER
        }
        break
    }
  }

  // Calcular target según estado
  switch (updated.state) {
    case 'CHASE':
      updated.targetPosition = calculateChaseTarget(
        updated,
        pacmanPos,
        pacmanDir,
        blinkyPos
      )
      break
    case 'SCATTER':
      updated.targetPosition = updated.scatterCorner
      break
    case 'FRIGHTENED':
      // Movimiento aleatorio en frightened
      const randomOffset = {
        x: Math.floor(Math.random() * 10) - 5,
        y: Math.floor(Math.random() * 10) - 5,
      }
      updated.targetPosition = {
        x: Math.max(0, Math.min(maze[0].length - 1, updated.position.x + randomOffset.x)),
        y: Math.max(0, Math.min(maze.length - 1, updated.position.y + randomOffset.y)),
      }
      break
    case 'DEAD':
      updated.targetPosition = updated.homePosition
      break
  }

  // Calcular path con algoritmo configurado
  const result = runPathfinding(
    updated.config.algorithm,
    maze,
    updated.position,
    updated.targetPosition
  )
  updated.path = result.path

  return updated
}

// ===== MOVER FANTASMA =====

export function moveGhost(ghost: Ghost, speed: number = 1.0): Ghost {
  if (ghost.path.length <= 1) {
    return ghost
  }

  // El siguiente punto en el path
  const nextPoint = ghost.path[1]

  // Calcular dirección
  const dx = nextPoint.x - ghost.position.x
  const dy = nextPoint.y - ghost.position.y

  // Mover (simplificado: teleport al siguiente punto)
  // En Phaser se haría con interpolación suave
  const updated = { ...ghost }
  updated.position = nextPoint
  updated.path = ghost.path.slice(1)

  return updated
}

// ===== MATAR FANTASMA =====

export function killGhost(ghost: Ghost): Ghost {
  return {
    ...ghost,
    state: 'DEAD',
    stateTimer: 0,
  }
}

// ===== CREAR TODOS LOS FANTASMAS =====

export function createAllGhosts(
  ghostHome: Vector2D,
  configs?: GhostConfig[]
): Ghost[] {
  const defaultConfigs: GhostConfig[] = [
    {
      name: 'blinky',
      algorithm: 'astar',
      aggressiveness: 8,
      speed: 1.0,
      strategy: 'direct',
    },
    {
      name: 'pinky',
      algorithm: 'astar',
      aggressiveness: 6,
      speed: 0.95,
      strategy: 'ambush',
    },
    {
      name: 'inky',
      algorithm: 'bfs',
      aggressiveness: 5,
      speed: 0.9,
      strategy: 'proximity',
    },
    {
      name: 'clyde',
      algorithm: 'dijkstra',
      aggressiveness: 4,
      speed: 0.85,
      strategy: 'random',
    },
  ]

  const offsets: Record<GhostName, Vector2D> = {
    blinky: { x: 0, y: -3 },
    pinky: { x: -2, y: 0 },
    inky: { x: 2, y: 0 },
    clyde: { x: 0, y: 0 },
  }

  const configsToUse = configs || defaultConfigs

  return configsToUse.map((config) => {
    const offset = offsets[config.name]
    return createGhost(config.name, {
      x: ghostHome.x + offset.x,
      y: ghostHome.y + offset.y,
    }, config)
  })
}

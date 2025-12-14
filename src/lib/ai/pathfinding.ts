import type { Vector2D, PathNode, AlgorithmType, PathfindingResult } from '../types'

// ===== UTILIDADES =====

function manhattanDistance(a: Vector2D, b: Vector2D): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function positionKey(pos: Vector2D): string {
  return `${pos.x},${pos.y}`
}

function reconstructPath(node: PathNode): Vector2D[] {
  const path: Vector2D[] = []
  let current: PathNode | null = node

  while (current !== null) {
    path.unshift(current.position)
    current = current.parent
  }

  return path
}

// Obtener vecinos válidos (sin paredes)
function getNeighbors(maze: number[][], pos: Vector2D): Vector2D[] {
  const neighbors: Vector2D[] = []
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 },  // right
  ]

  for (const dir of directions) {
    const newX = pos.x + dir.x
    const newY = pos.y + dir.y

    // Verificar límites y paredes (0 = camino, 1 = pared)
    if (
      newY >= 0 &&
      newY < maze.length &&
      newX >= 0 &&
      newX < maze[0].length &&
      maze[newY][newX] === 0
    ) {
      neighbors.push({ x: newX, y: newY })
    }
  }

  return neighbors
}

// ===== A* ALGORITHM =====
export function aStar(
  maze: number[][],
  start: Vector2D,
  goal: Vector2D
): PathfindingResult {
  const startTime = performance.now()
  let nodesExpanded = 0
  const expandedNodes: Vector2D[] = []

  const openSet: PathNode[] = []
  const closedSet = new Set<string>()

  const startNode: PathNode = {
    position: start,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
    parent: null,
  }

  openSet.push(startNode)

  while (openSet.length > 0) {
    // Obtener nodo con menor f
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!
    nodesExpanded++
    expandedNodes.push(current.position)

    // Llegamos al objetivo
    if (current.position.x === goal.x && current.position.y === goal.y) {
      const path = reconstructPath(current)
      return {
        path,
        expandedNodes,
        metrics: {
          algorithm: 'astar',
          nodesExpanded,
          executionTimeMs: performance.now() - startTime,
          pathLength: path.length,
          timestamp: Date.now(),
        },
      }
    }

    closedSet.add(positionKey(current.position))

    // Explorar vecinos
    const neighbors = getNeighbors(maze, current.position)
    for (const neighborPos of neighbors) {
      const key = positionKey(neighborPos)
      if (closedSet.has(key)) continue

      const g = current.g + 1
      const h = manhattanDistance(neighborPos, goal)
      const f = g + h

      const existingNode = openSet.find(
        (n) => n.position.x === neighborPos.x && n.position.y === neighborPos.y
      )

      if (!existingNode) {
        openSet.push({
          position: neighborPos,
          g,
          h,
          f,
          parent: current,
        })
      } else if (g < existingNode.g) {
        existingNode.g = g
        existingNode.f = f
        existingNode.parent = current
      }
    }
  }

  // No se encontró camino
  return {
    path: [],
    expandedNodes,
    metrics: {
      algorithm: 'astar',
      nodesExpanded,
      executionTimeMs: performance.now() - startTime,
      pathLength: 0,
      timestamp: Date.now(),
    },
  }
}

// ===== DIJKSTRA ALGORITHM =====
export function dijkstra(
  maze: number[][],
  start: Vector2D,
  goal: Vector2D
): PathfindingResult {
  const startTime = performance.now()
  let nodesExpanded = 0
  const expandedNodes: Vector2D[] = []

  const openSet: PathNode[] = []
  const closedSet = new Set<string>()

  const startNode: PathNode = {
    position: start,
    g: 0,
    h: 0, // Dijkstra no usa heurística
    f: 0,
    parent: null,
  }

  openSet.push(startNode)

  while (openSet.length > 0) {
    // Obtener nodo con menor costo g
    openSet.sort((a, b) => a.g - b.g)
    const current = openSet.shift()!
    nodesExpanded++
    expandedNodes.push(current.position)

    // Llegamos al objetivo
    if (current.position.x === goal.x && current.position.y === goal.y) {
      const path = reconstructPath(current)
      return {
        path,
        expandedNodes,
        metrics: {
          algorithm: 'dijkstra',
          nodesExpanded,
          executionTimeMs: performance.now() - startTime,
          pathLength: path.length,
          timestamp: Date.now(),
        },
      }
    }

    closedSet.add(positionKey(current.position))

    // Explorar vecinos
    const neighbors = getNeighbors(maze, current.position)
    for (const neighborPos of neighbors) {
      const key = positionKey(neighborPos)
      if (closedSet.has(key)) continue

      const g = current.g + 1

      const existingNode = openSet.find(
        (n) => n.position.x === neighborPos.x && n.position.y === neighborPos.y
      )

      if (!existingNode) {
        openSet.push({
          position: neighborPos,
          g,
          h: 0,
          f: g,
          parent: current,
        })
      } else if (g < existingNode.g) {
        existingNode.g = g
        existingNode.f = g
        existingNode.parent = current
      }
    }
  }

  // No se encontró camino
  return {
    path: [],
    expandedNodes,
    metrics: {
      algorithm: 'dijkstra',
      nodesExpanded,
      executionTimeMs: performance.now() - startTime,
      pathLength: 0,
      timestamp: Date.now(),
    },
  }
}

// ===== BFS ALGORITHM =====
export function bfs(
  maze: number[][],
  start: Vector2D,
  goal: Vector2D
): PathfindingResult {
  const startTime = performance.now()
  let nodesExpanded = 0
  const expandedNodes: Vector2D[] = []

  const queue: PathNode[] = []
  const visited = new Set<string>()

  const startNode: PathNode = {
    position: start,
    g: 0,
    h: 0,
    f: 0,
    parent: null,
  }

  queue.push(startNode)
  visited.add(positionKey(start))

  while (queue.length > 0) {
    const current = queue.shift()!
    nodesExpanded++
    expandedNodes.push(current.position)

    // Llegamos al objetivo
    if (current.position.x === goal.x && current.position.y === goal.y) {
      const path = reconstructPath(current)
      return {
        path,
        expandedNodes,
        metrics: {
          algorithm: 'bfs',
          nodesExpanded,
          executionTimeMs: performance.now() - startTime,
          pathLength: path.length,
          timestamp: Date.now(),
        },
      }
    }

    // Explorar vecinos
    const neighbors = getNeighbors(maze, current.position)
    for (const neighborPos of neighbors) {
      const key = positionKey(neighborPos)
      if (visited.has(key)) continue

      visited.add(key)
      queue.push({
        position: neighborPos,
        g: current.g + 1,
        h: 0,
        f: 0,
        parent: current,
      })
    }
  }

  // No se encontró camino
  return {
    path: [],
    expandedNodes,
    metrics: {
      algorithm: 'bfs',
      nodesExpanded,
      executionTimeMs: performance.now() - startTime,
      pathLength: 0,
      timestamp: Date.now(),
    },
  }
}

// ===== FUNCIÓN PRINCIPAL =====
export function runPathfinding(
  algorithm: AlgorithmType,
  maze: number[][],
  start: Vector2D,
  goal: Vector2D
): PathfindingResult {
  switch (algorithm) {
    case 'astar':
      return aStar(maze, start, goal)
    case 'dijkstra':
      return dijkstra(maze, start, goal)
    case 'bfs':
      return bfs(maze, start, goal)
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`)
  }
}

// ===== COMPARAR ALGORITMOS (UC009) =====
export function compareAlgorithms(
  maze: number[][],
  start: Vector2D,
  goal: Vector2D
): {
  astar: PathfindingResult
  dijkstra: PathfindingResult
  bfs: PathfindingResult
} {
  return {
    astar: aStar(maze, start, goal),
    dijkstra: dijkstra(maze, start, goal),
    bfs: bfs(maze, start, goal),
  }
}

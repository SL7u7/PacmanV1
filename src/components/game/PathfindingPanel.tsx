export function PathfindingPanel() {
  const metrics = [
    { algorithm: 'A*', time: '2.3ms', nodes: 45, pathLength: 12 },
    { algorithm: 'Dijkstra', time: '3.1ms', nodes: 67, pathLength: 12 },
    { algorithm: 'BFS', time: '4.2ms', nodes: 89, pathLength: 14 },
  ]

  return (
    <div className="bg-card/50 p-4 rounded-lg backdrop-blur">
      <h3 className="font-bold mb-3 text-lg">Métricas Pathfinding (UC006)</h3>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.algorithm} className="border border-border/50 rounded p-2">
            <div className="font-semibold text-sm mb-1">{metric.algorithm}</div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                <div className="font-medium text-foreground">{metric.time}</div>
                <div>Tiempo</div>
              </div>
              <div>
                <div className="font-medium text-foreground">{metric.nodes}</div>
                <div>Nodos</div>
              </div>
              <div>
                <div className="font-medium text-foreground">{metric.pathLength}</div>
                <div>Path</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

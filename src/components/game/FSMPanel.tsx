export function FSMPanel() {
  const ghosts = [
    { name: 'Blinky', state: 'CHASE', color: 'bg-red-500', algorithm: 'A*' },
    { name: 'Pinky', state: 'SCATTER', color: 'bg-pink-500', algorithm: 'A*' },
    { name: 'Inky', state: 'CHASE', color: 'bg-cyan-500', algorithm: 'BFS' },
    { name: 'Clyde', state: 'FRIGHTENED', color: 'bg-orange-500', algorithm: 'Dijkstra' },
  ]

  return (
    <div className="bg-card/50 p-4 rounded-lg backdrop-blur">
      <h3 className="font-bold mb-3 text-lg">Estados FSM (UC005)</h3>
      <div className="space-y-3">
        {ghosts.map((ghost) => (
          <div key={ghost.name} className="border border-border/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${ghost.color}`}></div>
                <span className="font-semibold">{ghost.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{ghost.algorithm}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Estado:</span>{' '}
              <span className="font-semibold text-primary">{ghost.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

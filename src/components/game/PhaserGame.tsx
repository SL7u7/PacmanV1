import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { PHASER_CONFIG } from '@/lib/phaser/config'

export function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current) return

    const config = {
      ...PHASER_CONFIG,
      parent: 'phaser-game',
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div id="phaser-game" className="mx-auto" />
}

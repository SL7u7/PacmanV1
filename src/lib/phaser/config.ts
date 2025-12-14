import Phaser from 'phaser'
import { GameScene } from '@/scenes/GameScene'

export const PHASER_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 672,  // 28 cells * 24px
  height: 744, // 31 cells * 24px
  parent: 'phaser-game',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
      fps: 60,
    },
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
}

export const CELL_SIZE = 24
export const MAZE_WIDTH = 28
export const MAZE_HEIGHT = 31

export const COLORS = {
  WALL: 0x2563eb,
  WALL_BORDER: 0x3b82f6,
  PATH: 0x000000,
  PELLET: 0xfbbf24,
  POWER_PELLET: 0xfbbf24,
  PACMAN: 0xffff00,
}

export const GAME_SPEED = {
  PACMAN: 100, // pixels per second
  GHOST: 90,
  FRIGHTENED_GHOST: 50,
}

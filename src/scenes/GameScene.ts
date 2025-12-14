import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    // Placeholder - Implementar lógica del juego con Phaser
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    this.add.text(centerX, centerY, 'PacMan Intelligence Lab', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.add.text(centerX, centerY + 50, 'Phaser Game Scene', {
      fontSize: '16px',
      color: '#aaaaaa'
    }).setOrigin(0.5)
  }

  update() {
    // Game loop
  }
}

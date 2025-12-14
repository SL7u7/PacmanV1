import Phaser from 'phaser'
import { MAZE_DATA, PACMAN_START, GHOST_HOME, isWall, convertToPathfindingMaze } from '@/lib/phaser/maze'
import { createAllGhosts, updateGhostState, moveGhost, killGhost, type Ghost } from '@/lib/ai/ghostFSM'
import { useGameStore } from '@/lib/store/gameStore'

const CELL_SIZE = 24
const COLORS = {
  WALL: 0x2563eb,
  PATH: 0x000000,
  PELLET: 0xfbbf24,
  POWER_PELLET: 0xfbbf24,
  PACMAN: 0xffff00,
}

export class GameScene extends Phaser.Scene {
  private pacman!: Phaser.GameObjects.Arc
  private ghosts: { sprite: Phaser.GameObjects.Arc; data: Ghost }[] = []
  private pellets: Phaser.GameObjects.Arc[] = []
  private powerPellets: Phaser.GameObjects.Arc[] = []
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd!: any
  
  private pacmanPosition: { x: number; y: number } = { ...PACMAN_START }
  private pacmanDirection: { x: number; y: number } = { x: 0, y: 0 }
  private score = 0
  private lives = 3
  private powerActive = false
  private powerTimer = 0
  
  private scoreText!: Phaser.GameObjects.Text
  private livesText!: Phaser.GameObjects.Text
  private pathGraphics!: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.pathGraphics = this.add.graphics()
    this.createMaze()
    
    this.pacman = this.add.circle(
      this.pacmanPosition.x * CELL_SIZE + CELL_SIZE / 2,
      this.pacmanPosition.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      COLORS.PACMAN
    )
    
    const ghostConfigs = useGameStore.getState().config.ghostConfigs
    const ghostsData = createAllGhosts(GHOST_HOME, ghostConfigs)
    
    this.ghosts = ghostsData.map(ghostData => {
      const sprite = this.add.circle(
        ghostData.position.x * CELL_SIZE + CELL_SIZE / 2,
        ghostData.position.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        ghostData.color
      )
      return { sprite, data: ghostData }
    })
    
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#ffffff'
    })
    this.livesText = this.add.text(16, 40, 'Lives: 3', {
      fontSize: '20px',
      color: '#ffffff'
    })
    
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    const welcomeText = this.add.text(centerX, centerY - 100, 'PacMan Intelligence Lab', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
    
    this.time.delayedCall(3000, () => {
      welcomeText.destroy()
    })
  }

  createMaze() {
    for (let y = 0; y < MAZE_DATA.length; y++) {
      for (let x = 0; x < MAZE_DATA[y].length; x++) {
        const cell = MAZE_DATA[y][x]
        const px = x * CELL_SIZE
        const py = y * CELL_SIZE
        
        if (cell === 1) {
          const wall = this.add.rectangle(px, py, CELL_SIZE, CELL_SIZE, COLORS.WALL)
          wall.setOrigin(0)
          wall.setStrokeStyle(1, 0x3b82f6)
        } else if (cell === 2) {
          const pellet = this.add.circle(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 3, COLORS.PELLET)
          this.pellets.push(pellet)
        } else if (cell === 3) {
          const powerPellet = this.add.circle(px + CELL_SIZE / 2, py + CELL_SIZE / 2, 6, COLORS.POWER_PELLET)
          this.powerPellets.push(powerPellet)
          this.tweens.add({
            targets: powerPellet,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
          })
        }
      }
    }
  }

  update(time: number, delta: number) {
    this.handleInput()
    this.movePacman()
    this.updateGhosts()
    this.checkPelletCollisions()
    this.checkGhostCollisions()
    
    if (this.powerActive) {
      this.powerTimer -= delta
      if (this.powerTimer <= 0) this.powerActive = false
    }
    
    this.visualizePaths()
    this.scoreText.setText(`Score: ${this.score}`)
    this.livesText.setText(`Lives: ${this.lives}`)
  }

  handleInput() {
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.pacmanDirection = { x: 0, y: -1 }
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.pacmanDirection = { x: 0, y: 1 }
    } else if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.pacmanDirection = { x: -1, y: 0 }
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.pacmanDirection = { x: 1, y: 0 }
    }
  }

  movePacman() {
    const newX = this.pacmanPosition.x + this.pacmanDirection.x
    const newY = this.pacmanPosition.y + this.pacmanDirection.y
    
    if (!isWall(newX, newY)) {
      this.pacmanPosition.x = newX
      this.pacmanPosition.y = newY
      this.pacman.setPosition(
        this.pacmanPosition.x * CELL_SIZE + CELL_SIZE / 2,
        this.pacmanPosition.y * CELL_SIZE + CELL_SIZE / 2
      )
    }
  }

  updateGhosts() {
    const maze = convertToPathfindingMaze()
    const blinkyPos = this.ghosts[0]?.data.position
    
    this.ghosts.forEach(ghost => {
      ghost.data = updateGhostState(ghost.data, this.pacmanPosition, this.pacmanDirection, this.powerActive, maze, blinkyPos)
      ghost.data = moveGhost(ghost.data, 1.0)
      ghost.sprite.setPosition(
        ghost.data.position.x * CELL_SIZE + CELL_SIZE / 2,
        ghost.data.position.y * CELL_SIZE + CELL_SIZE / 2
      )
      
      if (ghost.data.state === 'FRIGHTENED') {
        ghost.sprite.setFillStyle(0x3b82f6)
      } else if (ghost.data.state === 'DEAD') {
        ghost.sprite.setFillStyle(0xffffff)
        ghost.sprite.setAlpha(0.5)
      } else {
        ghost.sprite.setFillStyle(ghost.data.color)
        ghost.sprite.setAlpha(1)
      }
    })
  }

  checkPelletCollisions() {
    for (let i = this.pellets.length - 1; i >= 0; i--) {
      const pellet = this.pellets[i]
      const pelletX = Math.floor((pellet.x - CELL_SIZE / 2) / CELL_SIZE)
      const pelletY = Math.floor((pellet.y - CELL_SIZE / 2) / CELL_SIZE)
      
      if (pelletX === this.pacmanPosition.x && pelletY === this.pacmanPosition.y) {
        pellet.destroy()
        this.pellets.splice(i, 1)
        this.score += 10
      }
    }
    
    for (let i = this.powerPellets.length - 1; i >= 0; i--) {
      const pellet = this.powerPellets[i]
      const pelletX = Math.floor((pellet.x - CELL_SIZE / 2) / CELL_SIZE)
      const pelletY = Math.floor((pellet.y - CELL_SIZE / 2) / CELL_SIZE)
      
      if (pelletX === this.pacmanPosition.x && pelletY === this.pacmanPosition.y) {
        pellet.destroy()
        this.powerPellets.splice(i, 1)
        this.score += 50
        this.powerActive = true
        this.powerTimer = 6000
      }
    }
  }

  checkGhostCollisions() {
    this.ghosts.forEach(ghost => {
      if (ghost.data.position.x === this.pacmanPosition.x && ghost.data.position.y === this.pacmanPosition.y) {
        if (this.powerActive && ghost.data.state !== 'DEAD') {
          ghost.data = killGhost(ghost.data)
          this.score += 200
        } else if (ghost.data.state !== 'DEAD') {
          this.lives--
          if (this.lives <= 0) this.showGameOver()
        }
      }
    })
  }

  visualizePaths() {
    this.pathGraphics.clear()
    this.ghosts.forEach(ghost => {
      if (ghost.data.path.length > 0) {
        this.pathGraphics.lineStyle(2, ghost.data.color, 0.3)
        this.pathGraphics.beginPath()
        const startX = ghost.data.position.x * CELL_SIZE + CELL_SIZE / 2
        const startY = ghost.data.position.y * CELL_SIZE + CELL_SIZE / 2
        this.pathGraphics.moveTo(startX, startY)
        ghost.data.path.forEach(point => {
          const px = point.x * CELL_SIZE + CELL_SIZE / 2
          const py = point.y * CELL_SIZE + CELL_SIZE / 2
          this.pathGraphics.lineTo(px, py)
        })
        this.pathGraphics.strokePath()
      }
    })
  }

  showGameOver() {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2
    this.add.text(centerX, centerY, 'GAME OVER', {
      fontSize: '48px',
      color: '#ff0000',
      backgroundColor: '#000000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5)
    this.scene.pause()
  }
}

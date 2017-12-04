import 'phaser-ce'
import { CONFIG } from '../constants'
import { GameController } from './game';
import { TicketController } from './ticket';
import { Player, HealthDisplayController } from './player'

export const GameState = {
    BOOT: 'boot',
    LOAD: 'load',
    MENU: 'menu',
    MAIN: 'main',
}

export class Boot extends Phaser.State {
    preload() {
        console.log("Booting...")
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.game.renderer.renderSession.roundPixels = true
        this.game.physics.arcade.gravity.y = CONFIG.GAME.gravity

        this.game.world.setBounds(0, 0, CONFIG.WORLD.width, CONFIG.WORLD.height)
    }

    create() {
        this.game.state.start(GameState.LOAD)
    }
}

export class Load extends Phaser.State {
    preload() {
        console.log("Loading data...")
        this.game.load.spritesheet('patrick', 'assets/img/patrick_64x64.png', 64, 64, 17)
        this.game.load.spritesheet('bug', 'assets/img/bug_32x32.png', 32, 32, 10)
        this.game.load.spritesheet('snippet', 'assets/img/snippet_32x32.png', 32, 32, 11)
        this.game.load.spritesheet('ticket', 'assets/img/ticket_32x32.png', 32, 32, 1)
        this.game.load.image('patrick_head', 'assets/img/patrick-life-head.png')
        this.game.load.image('jira_board', 'assets/img/jira-whiteboard_256x96.png')

        this.game.load.tilemap('map', 'assets/img/metal-map.json', null, Phaser.Tilemap.TILED_JSON)
        this.game.load.image('tiles', 'assets/img/metal-ground_32x32.png')
        this.game.load.image('bg', 'assets/img/tile-bg_64x64.png')
    }

    create() {
        this.game.state.start(GameState.MENU)
    }
}

export class Menu extends Phaser.State {
    preload() {
        "Loading menu..."
    }
    create() {
        this.game.state.start(GameState.MAIN)
    }
}

export class Main {
    init() {
        console.log("Initializing main state...")
        this.gameRef = this.game
        this.gameCtrl
    }
    create() {
        console.log("Creating main state...")
        this.gameCtrl = new GameController(this.gameRef)

        // TODO: should all this go inside the GameController?
        // Setup maps & layers
        let background = this.gameCtrl.game.add.tileSprite(0, 0, CONFIG.WORLD.width, CONFIG.WORLD.height, 'bg')

        this.gameCtrl
            .addTileMap('map', 'tiles', ['air-layer', 'ground-layer'])
        this.gameCtrl.maps.get('map')
            .setCollisionByExclusion([], true,
                this.gameCtrl.layers.get('air-layer'))
        this.gameCtrl.maps.get('map')
            .setCollisionByExclusion([], true,
                this.gameCtrl.layers.get('ground-layer'))

        // Setup sprite entities
        this.gameCtrl.addEntity('patrick',
            new Player(
                this.gameCtrl,
                {
                    pos: [CONFIG.WORLD.width / 2, CONFIG.SCREEN.height - 192],
                    anchor: [0.5, 1],
                    name: 'patrick'
                }
            )
        )

        // Initialize all uninitalized entities
        this.gameCtrl.initialize()

        // Start main controller
        this.gameCtrl.start()

    }

    update() {
        this.gameCtrl.update()
    }
}
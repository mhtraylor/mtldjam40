import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';
import { CONFIG } from '../constants'

import { Entity } from './entity'
import { WASD_KEYS } from './input'
import { PlayerController } from './character-controller'

// This is the entry point of your game.

const config = {
  width: CONFIG.SCREEN.width,
  height: CONFIG.SCREEN.height,
  renderer: Phaser.AUTO,
  parent: '',
  state: {
    preload,
    create,
  },
  transparent: false,
  antialias: true,
  physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);

let keys;
let patrick;
let pt;

function preload() {
  this.game.load.image('dev_bkg', 'assets/img/dev_lvl_1536x480.png')
  this.game.load.spritesheet
    ( 'patrick'
    , 'assets/img/patrick-walk_64x64.png'
    , 64, 64, 4)

    this.game.load.tilemap('map', 'assets/img/map.json', null, Phaser.Tilemap.TILED_JSON)
    this.game.load.image('platform', 'assets/img/ground-sprite.png')
}

function create() {
  const { game } = this;

  keys = game.input.keyboard.createCursorKeys()

  const map = this.game.add.tilemap('map')
  map.addTilesetImage('platform')

  const layer_air = map.createLayer('air')

  const layer_ground = map.createLayer('ground')

  patrick = game.add.sprite(
    game.world.centerX,
    CONFIG.SCREEN.height - 110,
    'patrick'
  )

  patrick.animations.add('walk')
  patrick.animations.play('walk', 8, true)

  pt = new Entity(game, [64, 64], [0.5, 0.5],'patrick')

  pt.addComponent(
    PlayerController(game, WASD_KEYS, {
      speedX: 2
    })
  )
}

function update() {
  pt.update()
}
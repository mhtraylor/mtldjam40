import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';
import { CONFIG } from '../constants'

import { Entity } from './entity'
import { Player } from './player';

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

let patrick;
let pt;

function preload() {
  //this.game.load.image('dev_bkg', 'assets/img/dev_lvl_1536x480.png')
  this.game.load.spritesheet
    ( 'patrick'
    , 'assets/img/patrick_64x64.png'
    , 64, 64, 8)

    this.game.load.tilemap('map', 'assets/img/metal-map.json', null, Phaser.Tilemap.TILED_JSON)
    this.game.load.image('tiles', 'assets/img/metal-ground_32x32.png')
}

function create() {
  const { game } = this;

  const map = this.game.add.tilemap('map')
  map.addTilesetImage('tiles')

  const layer_air = map.createLayer('air-layer')

  const layer_ground = map.createLayer('ground-layer')

  pt = new Player(game, {
    pos   : [game.world.centerX - 64, CONFIG.SCREEN.height - 82],
    anchor: [0.5, 0.5],
    name  : 'patrick',
    speed: {x: 2, y: 0},
  })

  pt.init()

}

function update() {
  pt.update()
}
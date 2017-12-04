import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json'
import { CONFIG } from '../constants'

import { Entity } from './entity'
import { Player } from './player'
import { Bug } from './bug'
import { Snippet } from './snippet'
import { Ticket } from './ticket'

window._DEV_ = false;



// This is the entry point of your game.

const config = {
  width: CONFIG.SCREEN.width,
  height: CONFIG.SCREEN.height,
  renderer: Phaser.AUTO,
  parent: '',
  state: {
    preload,
    create,
    update,
    render,
  },
  transparent: false,
  antialias: true,
  physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);

let pt;
let ticket;

let layer_air
let layer_ground
let layer_bg


function preload() {

  //this.game.load.image('dev_bkg', 'assets/img/dev_lvl_1536x480.png')
  this.game.load.spritesheet('patrick', 'assets/img/patrick_64x64.png', 64, 64, 17)
  this.game.load.spritesheet('bug', 'assets/img/bug_32x32.png', 32, 32, 10)
  this.game.load.spritesheet('snippet', 'assets/img/snippet_32x32.png', 32, 32, 11)
  this.game.load.spritesheet('ticket', 'assets/img/ticket_32x32.png', 32, 32, 1)

  this.game.load.tilemap('map', 'assets/img/metal-map.json', null, Phaser.Tilemap.TILED_JSON)
  this.game.load.image('tiles', 'assets/img/metal-ground_32x32.png')
  this.game.load.image('bg', 'assets/img/tile-bg_64x64.png')

  window._DEV_ = true
}



function create() {
  const { game } = this;

  this.game.world.setBounds(0, 0, CONFIG.LEVEL.width, CONFIG.LEVEL.height)

  this.physics.startSystem(Phaser.Physics.ARCADE)
  this.physics.arcade.gravity.y = CONFIG.GAME.gravity


  // Map settings
  const map = this.game.add.tilemap('map')
  map.addTilesetImage('tiles')
  map.addTilesetImage('bg')

  layer_bg = map.createLayer('bg')
  layer_air = map.createLayer('air-layer')
  layer_ground = map.createLayer('ground-layer')
  

  // layer_air.debug = true
  // layer_ground.debug = true

  map.setCollisionByExclusion([], true, layer_air)
  map.setCollision([0, 1], true, layer_ground)

  // Initialize player
  pt = new Player(game, {
    pos   : [32, CONFIG.SCREEN.height - 160],
    anchor: [0.5, 1],
    name  : 'patrick'
  })

  pt.init([18, 40, 23, 11])
  pt.addCollision(layer_air)
  pt.addCollision(layer_ground)
  pt.body.collideWorldBounds = true

  this.game.camera.follow(pt, Phaser.Camera.FOLLOW_PLATFORMER)

  window._pt = pt;

  // Initialize Ticket
  ticket = new Ticket(game, {
    anchor: [0.5, 1],
    numSnippets: 4,
    name: 'ticket',
    numBugs: 2,
    pos: [CONFIG.SCREEN.width / 2 - 16, 64]
  })

  ticket.init(layer_ground, pt)
  window._ticket = ticket

}



function update() {
  pt.update()
  ticket.update()
}



function render() {
  //this.game.debug.spriteInfo(pt, 16, 16);
  
  //game.debug.body(pt)
  // game.debug.body(bug)
}
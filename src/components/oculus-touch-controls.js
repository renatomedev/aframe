var registerComponent = require('../core/component').registerComponent;
var bind = require('../utils/bind');

// FIXME: need appropriate models, not the vive ones!
var TOUCH_CONTROLLER_MODEL_OBJ_URL = 'https://cdn.aframe.io/controllers/vive/vr_controller_vive.obj';
var TOUCH_CONTROLLER_MODEL_OBJ_MTL = 'https://cdn.aframe.io/controllers/vive/vr_controller_vive.mtl';

/**
 * Oculus Touch Controls Component
 * Interfaces with Oculus Touch controllers and maps Gamepad events to
 * common controller buttons: trackpad, trigger, grip, menu and system
 * It loads a controller model and highlights the pressed buttons
 */
module.exports.Component = registerComponent('oculus-touch-controls', {
  dependencies: ['tracked-controls'],

  schema: {
    idPrefix: { default: 'Oculus Touch' },
    hand: {default: 'left'},
    buttonColor: { default: '#FAFAFA' },  // Off-white.
    buttonHighlightColor: {default: '#22D1EE'},  // Light blue.
    model: {default: true},
    rotationOffset: {default: -999} // use -999 as sentinel value to auto-determine based on hand
  },

  // buttonId
  // 0 - trackpad
  // 1 - trigger ( intensity value from 0.5 to 1 )
  // 2 - grip
  // 3 - menu ( dispatch but better for menu options )
  // 4 - system ( never dispatched on this layer )
  mapping: {
    axis0: 'trackpad',
    axis1: 'trackpad',
    button0: 'trackpad',
    button1: 'trigger',
    button2: 'grip',
    button3: 'menu',
    button4: 'system'
  },

  init: function () {
    var self = this;
    this.animationActive = 'pointing';
    this.onButtonChanged = bind(this.onButtonChanged, this);
    this.onButtonDown = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
    this.onButtonUp = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    this.onModelLoaded = bind(this.onModelLoaded, this);
    this.controllerPresent = false;
    this.everGotGamepadEvent = false;
    this.lastControllerCheck = 0;
  },

  startListening: function () {
    var el = this.el;
    // console.log('startListening');
    el.addEventListener('buttonchanged', this.onButtonChanged);
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
    el.addEventListener('model-loaded', this.onModelLoaded);
  },

  stopListening: function () {
    var el = this.el;
    // console.log('stopListening');
    el.removeEventListener('buttonchanged', this.onButtonChanged);
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
    el.removeEventListener('model-loaded', this.onModelLoaded);
  },

  checkIfControllerPresent: function () {
    // console.log('checkIfControllerPresent');
    var data = this.data;
    var isPresent = false;
    var controllers = navigator.getGamepads && navigator.getGamepads();
    if (controllers) {
      for (var cid = 0; cid < controllers.length; cid++) {
        if (controllers[cid].id.indexOf(data.idPrefix) === 0) {
          if (controllers[cid].hand === data.hand) {
            isPresent = true;
            break;
          }
        }
      }
    }
    if (isPresent !== this.controllerPresent) {
      this.controllerPresent = isPresent;
      if (isPresent) {
        this.injectTrackedControls(); // inject track-controls
        this.startListening();
      } else {
        this.stopListening();
      }
    }
  },

  onGamepadConnected: function (evt) {
    // console.log('onGamepadConnected');
    this.everGotGamepadEvent = true;
    this.checkIfControllerPresent();
  },

  onGamepadDisconnected: function (evt) {
    // console.log('onGamepadDisconnected');
    this.everGotGamepadEvent = true;
    this.checkIfControllerPresent();
  },

  play: function () {
    this.checkIfControllerPresent();
    // on Chromium, these events do not fire, so poll
    window.addEventListener('gamepadconnected', this.onGamepadConnected, false);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected, false);
  },

  pause: function () {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected, false);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected, false);
    this.stopListening();
  },

  injectTrackedControls: function () {
    // console.log('injectTrackedControls');
    var el = this.el;
    var data = this.data;
    var objUrl = 'url(' + TOUCH_CONTROLLER_MODEL_OBJ_URL + ')';
    var mtlUrl = 'url(' + TOUCH_CONTROLLER_MODEL_OBJ_MTL + ')';

    // handId: 0 - right, 1 - left, 2 - anything else...
    var controller = data.hand === 'right' ? 0 : data.hand === 'left' ? 1 : 2;

    // since each hand is named differently, avoid enumeration
    el.setAttribute('tracked-controls', {
      id: controller === 0 ? 'Oculus Touch (Right)' : 'Oculus Touch (Left)',
      controller: 0,
      rotationOffset: data.rotationOffset !== -999 ? data.rotationOffset : controller === 1 ? 90 : -90
    });

    if (!data.model) { return; }
    el.setAttribute('obj-model', {obj: objUrl, mtl: mtlUrl});
  },

  tick: function () {
    if (!this.everGotGamepadEvent) {
      var now = Date.now();
      if (now >= this.lastControllerCheck + 1000) {
        this.checkIfControllerPresent();
        this.lastControllerCheck = now;
        // console.log('lastControllerCheck ' + this.lastControllerCheck);
      }
    }
  },

  onButtonChanged: function (evt) {
    var button = this.mapping['button' + evt.detail.id];
    var buttonMeshes = this.buttonMeshes;
    var value;
    if (button !== 'trigger' || !buttonMeshes) { return; }
    value = evt.detail.state.value;
    buttonMeshes.trigger.rotation.x = -value * (Math.PI / 12);
  },

  onModelLoaded: function (evt) {
    var controllerObject3D = evt.detail.model;
    var buttonMeshes;
    if (!this.data.model) { return; }
    buttonMeshes = this.buttonMeshes = {};
    buttonMeshes.grip = {
      left: controllerObject3D.getObjectByName('leftgrip'),
      right: controllerObject3D.getObjectByName('rightgrip')
    };
    buttonMeshes.menu = controllerObject3D.getObjectByName('menubutton');
    buttonMeshes.system = controllerObject3D.getObjectByName('systembutton');
    buttonMeshes.trackpad = controllerObject3D.getObjectByName('touchpad');
    buttonMeshes.trigger = controllerObject3D.getObjectByName('trigger');
    // Offset pivot point
    controllerObject3D.position.set(0, -0.015, 0.04);
  },

  onButtonEvent: function (id, evtName) {
    var buttonName = this.mapping['button' + id];
    this.el.emit(buttonName + evtName);
    if (!this.data.model) { return; }
    this.updateModel(buttonName, evtName);
  },

  updateModel: function (buttonName, state) {
    var color = state === 'up' ? this.data.buttonColor : this.data.buttonHighlightColor;
    var buttonMeshes = this.buttonMeshes;
    if (!buttonMeshes) { return; }
    if (buttonName === 'grip') {
      buttonMeshes.grip.left.material.color.set(color);
      buttonMeshes.grip.right.material.color.set(color);
      return;
    }
    buttonMeshes[buttonName].material.color.set(color);
  }
});

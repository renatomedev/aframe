var registerComponent = require('../core/component').registerComponent;
var bind = require('../utils/bind');

var VIVE_CONTROLLER_MODEL_OBJ_URL = 'https://cdn.aframe.io/controllers/vive/vr_controller_vive.obj';
var VIVE_CONTROLLER_MODEL_OBJ_MTL = 'https://cdn.aframe.io/controllers/vive/vr_controller_vive.mtl';

/**
 * Vive Controls Component
 * Interfaces with vive controllers and maps Gamepad events to
 * common controller buttons: trackpad, trigger, grip, menu and system
 * It loads a controller model and highlights the pressed buttons
 */
module.exports.Component = registerComponent('vive-controls', {
  dependencies: ['tracked-controls'],

  schema: {
    idPrefix: { default: 'OpenVR Gamepad' },
    hand: {default: 'left'},
    buttonColor: { default: '#FAFAFA' },  // Off-white.
    buttonHighlightColor: {default: '#22D1EE'},  // Light blue.
    model: {default: true},
    rotationOffset: {default: 0} // use -999 as sentinel value to auto-determine based on hand
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
  },

  play: function () {
    var el = this.el;
    el.addEventListener('buttonchanged', this.onButtonChanged);
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
    el.addEventListener('model-loaded', this.onModelLoaded);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttonchanged', this.onButtonChanged);
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
    el.removeEventListener('model-loaded', this.onModelLoaded);
  },

  update: function () {
    var el = this.el;
    var data = this.data;
    var objUrl = 'url(' + VIVE_CONTROLLER_MODEL_OBJ_URL + ')';
    var mtlUrl = 'url(' + VIVE_CONTROLLER_MODEL_OBJ_MTL + ')';

    // unfortunately, hand attribution for OpenVR Gamepad is unreliable at present
/*
      // interrogate gamepads ourselves to find hand and idPrefix match
      var controllers = navigator.getGamepads && navigator.getGamepads(); // this fails... this.system.controllers;
      var numopenvr = 0;
      for (var cid = 0; cid < controllers.length; cid++) {
        if (controllers[cid].id.indexOf(data.idPrefix) === 0) {
          if (controllers[cid].hand === data.hand) {
            el.setAttribute('tracked-controls', {
              id: controllers[cid].id,
              controller: numopenvr,
              rotationOffset: data.rotationOffset
            });
            break;
          }
          numopenvr++;
        }
      }
*/
    // handId: 0 - right, 1 - left, 2 - anything else...
    var controller = data.hand === 'right' ? 0 : data.hand === 'left' ? 1 : 2;
    // if we have an OpenVR Gamepad, use the fixed mapping
    el.setAttribute('tracked-controls', {id: 'OpenVR Gamepad', controller: controller, rotationOffset: data.rotationOffset});

    if (!data.model) { return; }
    el.setAttribute('obj-model', {obj: objUrl, mtl: mtlUrl});
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

var registerComponent = require('../core/component').registerComponent;

var OCULUS_LEFT_HAND_MODEL_URL = 'https://cdn.aframe.io/controllers/oculus-hands/leftHand.json';
var OCULUS_RIGHT_HAND_MODEL_URL = 'https://cdn.aframe.io/controllers/oculus-hands/rightHand.json';

/**
*
* Hand Controls component
* Auto-detect appropriate controllers
* Handle common events coming from the detected vendor-specific controls
* Translate button events to hand related actions:
* gripclose, gripopen, thumbup, thumbdown, pointup, pointdown
* Load a hand model with gestures that are applied based
* on the button pressed.
*
* @property {left/right} Hand mapping
*/
module.exports.Component = registerComponent('hand-controls', {
  schema: {default: 'left'},

  init: function () {
    var self = this;
    this.onGripDown = function () { self.handleButton('grip', 'down'); };
    this.onGripUp = function () { self.handleButton('grip', 'up'); };
    this.onTrackpadDown = function () { self.handleButton('trackpad', 'down'); };
    this.onTrackpadUp = function () { self.handleButton('trackpad', 'up'); };
    this.onTriggerDown = function () { self.handleButton('trigger', 'down'); };
    this.onTriggerUp = function () { self.handleButton('trigger', 'up'); };
    this.onTriggerTouchStart = function () { self.handleButton('trigger', 'touchstart'); };
    this.onTriggerTouchEnd = function () { self.handleButton('trigger', 'touchend'); };
    this.onGripTouchStart = function () { self.handleButton('grip', 'touchstart'); };
    this.onGripTouchEnd = function () { self.handleButton('grip', 'touchend'); };
    this.onThumbstickDown = function () { self.handleButton('thumbstick', 'down'); };
    this.onThumbstickUp = function () { self.handleButton('thumbstick', 'up'); };
    this.onMenuTouchStart = function () { self.handleButton('menu', 'touchstart'); };
    this.onMenuTouchEnd = function () { self.handleButton('menu', 'touchend'); };
    this.onSurfaceTouchStart = function () { self.handleButton('surface', 'touchstart'); };
    this.onSurfaceTouchEnd = function () { self.handleButton('surface', 'touchend'); };
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  addEventListeners: function () {
    var el = this.el;
    el.addEventListener('gripdown', this.onGripDown);
    el.addEventListener('gripup', this.onGripUp);
    el.addEventListener('trackpaddown', this.onTrackpadDown);
    el.addEventListener('trackpadup', this.onTrackpadUp);
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);
    el.addEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.addEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.addEventListener('griptouchstart', this.onGripTouchStart);
    el.addEventListener('griptouchend', this.onGripTouchEnd);
    el.addEventListener('thumbstickdown', this.onThumbstickDown);
    el.addEventListener('thumbstickup', this.onThumbstickUp);
    el.addEventListener('menutouchstart', this.onMenuTouchStart);
    el.addEventListener('menutouchend', this.onMenuTouchEnd);
    el.addEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.addEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  removeEventListeners: function () {
    var el = this.el;
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
    el.removeEventListener('trackpaddown', this.onTrackpadDown);
    el.removeEventListener('trackpadup', this.onTrackpadUp);
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
    el.removeEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.removeEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.removeEventListener('griptouchstart', this.onGripTouchStart);
    el.removeEventListener('griptouchend', this.onGripTouchEnd);
    el.removeEventListener('thumbstickdown', this.onThumbstickDown);
    el.removeEventListener('thumbstickup', this.onThumbstickUp);
    el.removeEventListener('menutouchstart', this.onMenuTouchStart);
    el.removeEventListener('menutouchend', this.onMenuTouchEnd);
    el.removeEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.removeEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  update: function () {
    var el = this.el;
    var hand = this.data;
    var modelUrl;
    if (hand === 'left') {
      // modelUrl = 'url(' + LEFT_HAND_MODEL_URL + ')';
      modelUrl = 'url(' + OCULUS_LEFT_HAND_MODEL_URL + ')';
    } else {
      // NOTE: in theory some controllers may not only 'left' or 'right'
      // ... but as we only have two models, here we will use right hand
      // modelUrl = 'url(' + RIGHT_HAND_MODEL_URL + ')';
      modelUrl = 'url(' + OCULUS_RIGHT_HAND_MODEL_URL + ')';
    }

    var controlConfiguration = {
      hand: hand,
      model: false,
      rotationOffset: hand === 'left' ? 90 : -90
    };
    el.setAttribute('vive-controls', controlConfiguration);
    el.setAttribute('oculus-touch-controls', controlConfiguration);

    el.setAttribute('blend-character-model', modelUrl);
  },

 /** Play the model animations based on the pressed button and kind of event.
   *
   * @param {string} button the name of the button
   * @param {string} evt the event associated to the button
   */
  handleButton: function (button, evt) {
    // var el = this.el;
    var isPressed = evt === 'down';
    var isTouched = evt === 'touchstart';
    switch (button) {
      case 'trackpad':
        if (isPressed === this.trackpadPressed) { return; }
        this.trackpadPressed = isPressed;
        this.processAnimation();
        break;
      case 'trigger':
        if (evt.indexOf('touch') === 0) {
          if (isTouched === this.triggerTouched) { return; }
          this.triggerTouched = isTouched;
        } else {
          if (isPressed === this.triggerPressed) { return; }
          this.triggerPressed = isPressed;
        }
        this.processAnimation();
        break;
      case 'grip':
        if (isPressed === this.gripPressed) { return; }
        this.gripPressed = isPressed;
        this.processAnimation();
        break;
      case 'thumbstick':
        if (isPressed === this.thumbstickPressed) { return; }
        this.thumbstickPressed = isPressed;
        break;
      case 'menu':
        if (isTouched === this.menuTouched) { return; }
        this.menuTouched = isTouched;
        this.processAnimation();
        break;
      case 'surface':
        if (isTouched === this.surfaceTouched) { return; }
        this.surfaceTouched = isTouched;
        this.processAnimation();
        break;
    }
  },

  processAnimation: function () {
    if (this.gripPressed) {
      if (this.surfacePressed || this.surfaceTouched || this.menuTouched || this.trackpadPressed || this.trackpadTouched) {
        if (!this.triggerPressed) { // trigger touch is currently broken, stuck true
          // point
          this.playAnimation('pointing', false);
        } else {
          // make a fist
          this.playAnimation('press', false);
        }
      } else {
        if (!this.triggerPressed) { // trigger touch is currently broken, stuck true
          // pistol pose
          this.playAnimation('pistol', false);
        } else {
          // thumbs up
          this.playAnimation('thumb', false);
        }
      }
    } else {
      // grip not pressed
      if (!this.triggerPressed) { // trigger touch is currently broken, stuck true
        // TODO: seems as though we should have some additional poses here
        this.playAnimation('touch', true);
      } else {
        // touch pose (?)
        this.playAnimation('touch', false);
      }
    }
  },

  /**
  * Play the hand animations based on button state.
  *
  * @param {string} animation - the name of the animation.
  * @param {string} reverse - It the animation has to play in reverse.
  */
  playAnimation: function (animation, reverse) {
    var animationActive = this.animationActive;
    var timeScale = 1;
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) { return; }

    // determine direction of the animation.
    if (reverse) { timeScale = -1; }

    // stop current animation.
    if (animationActive) { mesh.play(animationActive, 0); }

    // play new animation.
    mesh.mixer.clipAction(animation).loop = 2200;
    mesh.mixer.clipAction(animation).clampWhenFinished = true;
    mesh.mixer.clipAction(animation).timeScale = timeScale;
    mesh.play(animation, 1);
    this.animationActive = animation;
  }
});

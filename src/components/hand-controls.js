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
    this.touchedButtons = {};
    this.pressedButtons = {};
    this.onGripDown = function () { self.handleButton('grip', 'down'); };
    this.onGripUp = function () { self.handleButton('grip', 'up'); };
    this.onTrackpadDown = function () { self.handleButton('trackpad', 'down'); };
    this.onTrackpadUp = function () { self.handleButton('trackpad', 'up'); };
    this.onTrackpadTouchStart = function () { self.handleButton('trackpad', 'touchstart'); };
    this.onTrackpadTouchEnd = function () { self.handleButton('trackpad', 'touchend'); };
    this.onTriggerDown = function () { self.handleButton('trigger', 'down'); };
    this.onTriggerUp = function () { self.handleButton('trigger', 'up'); };
    this.onTriggerTouchStart = function () { self.handleButton('trigger', 'touchstart'); };
    this.onTriggerTouchEnd = function () { self.handleButton('trigger', 'touchend'); };
    this.onGripTouchStart = function () { self.handleButton('grip', 'touchstart'); };
    this.onGripTouchEnd = function () { self.handleButton('grip', 'touchend'); };
    this.onThumbstickDown = function () { self.handleButton('thumbstick', 'down'); };
    this.onThumbstickUp = function () { self.handleButton('thumbstick', 'up'); };
    this.onAorXTouchStart = function () { self.handleButton('AorX', 'touchstart'); };
    this.onAorXTouchEnd = function () { self.handleButton('AorX', 'touchend'); };
    this.onBorYTouchStart = function () { self.handleButton('BorY', 'touchstart'); };
    this.onBorYTouchEnd = function () { self.handleButton('BorY', 'touchend'); };
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
    el.addEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
    el.addEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
    el.addEventListener('triggerdown', this.onTriggerDown);
    el.addEventListener('triggerup', this.onTriggerUp);
    el.addEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.addEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.addEventListener('griptouchstart', this.onGripTouchStart);
    el.addEventListener('griptouchend', this.onGripTouchEnd);
    el.addEventListener('thumbstickdown', this.onThumbstickDown);
    el.addEventListener('thumbstickup', this.onThumbstickUp);
    el.addEventListener('Atouchstart', this.onAorXTouchStart);
    el.addEventListener('Atouchend', this.onAorXTouchEnd);
    el.addEventListener('Btouchstart', this.onBorYTouchStart);
    el.addEventListener('Btouchend', this.onBorYTouchEnd);
    el.addEventListener('Xtouchstart', this.onAorXTouchStart);
    el.addEventListener('Xtouchend', this.onAorXTouchEnd);
    el.addEventListener('Ytouchstart', this.onBorYTouchStart);
    el.addEventListener('Ytouchend', this.onBorYTouchEnd);
    el.addEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.addEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  removeEventListeners: function () {
    var el = this.el;
    el.removeEventListener('gripdown', this.onGripDown);
    el.removeEventListener('gripup', this.onGripUp);
    el.removeEventListener('trackpaddown', this.onTrackpadDown);
    el.removeEventListener('trackpadup', this.onTrackpadUp);
    el.removeEventListener('trackpadtouchstart', this.onTrackpadTouchStart);
    el.removeEventListener('trackpadtouchend', this.onTrackpadTouchEnd);
    el.removeEventListener('triggerdown', this.onTriggerDown);
    el.removeEventListener('triggerup', this.onTriggerUp);
    el.removeEventListener('triggertouchstart', this.onTriggerTouchStart);
    el.removeEventListener('triggertouchend', this.onTriggerTouchEnd);
    el.removeEventListener('griptouchstart', this.onGripTouchStart);
    el.removeEventListener('griptouchend', this.onGripTouchEnd);
    el.removeEventListener('thumbstickdown', this.onThumbstickDown);
    el.removeEventListener('thumbstickup', this.onThumbstickUp);
    el.removeEventListener('Atouchstart', this.onAorXTouchStart);
    el.removeEventListener('Atouchend', this.onAorXTouchEnd);
    el.removeEventListener('Btouchstart', this.onBorYTouchStart);
    el.removeEventListener('Btouchend', this.onBorYTouchEnd);
    el.removeEventListener('Xtouchstart', this.onAorXTouchStart);
    el.removeEventListener('Xtouchend', this.onAorXTouchEnd);
    el.removeEventListener('Ytouchstart', this.onBorYTouchStart);
    el.removeEventListener('Ytouchend', this.onBorYTouchEnd);
    el.removeEventListener('surfacetouchstart', this.onSurfaceTouchStart);
    el.removeEventListener('surfacetouchend', this.onSurfaceTouchEnd);
  },

  update: function () {
    var el = this.el;
    var hand = this.data;
    var controlConfiguration = {
      hand: hand,
      model: false,
      rotationOffset: hand === 'left' ? 90 : -90
    };
    var modelUrl;
    if (hand === 'left') {
      modelUrl = 'url(' + OCULUS_LEFT_HAND_MODEL_URL + ')';
    } else {
      modelUrl = 'url(' + OCULUS_RIGHT_HAND_MODEL_URL + ')';
    }
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
    var isPressed = evt === 'down';
    var isTouched = evt === 'touchstart';
    if (evt.indexOf('touch') === 0) {
      if (isTouched === this.touchedButtons[button]) { return; }
      this.touchedButtons[button] = isTouched;
    } else {
      if (isPressed === this.pressedButtons[button]) { return; }
      this.pressedButtons[button] = isPressed;
    }
    if (!this.determineGesture()) { return; }
    this.animateGesture();
    this.emitGestureEvents();
  },

  determineGesture: function () {
    var lastGesture = this.gesture;
    var gesture;
    if (this.pressedButtons['grip']) {
      if (this.pressedButtons['surface'] || this.touchedButtons['surface'] ||
          this.touchedButtons['AorX'] || this.touchedButtons['BorY'] ||
          this.pressedButtons['trackpad'] || this.touchedButtons['trackpad']) {
        if (!this.pressedButtons['trigger'] && !this.touchedButtons['trigger']) {
          // pointing pose
          gesture = 'pointing';
        } else {
          // make a fist
          gesture = 'fist';
        }
      } else {
        if (!this.pressedButtons['trigger'] && !this.touchedButtons['trigger']) {
          // pistol pose
          gesture = 'pistol';
        } else {
          // thumbs up
          gesture = 'thumb';
        }
      }
    } else {
      // grip not pressed
      if (!this.pressedButtons['trigger'] && !this.touchedButtons['trigger']) {
        // TODO: seems as though we should have some additional poses here
        // leave gesture as null
      } else {
        // touch pose (?)
        gesture = 'touch';
      }
    }
    this.gesture = gesture;
    return lastGesture !== this.gesture;
  },

  gestureAnimationMapping: {
    'pointing': 'pointing',
    'pistol': 'pistol',
    'fist': 'press',
    'touch': 'touch',
    'thumb': 'thumb'
  },

  animateGesture: function () {
    var animation = this.gestureAnimationMapping[this.gesture || ''];
    this.playAnimation(animation || 'touch', !animation);
  },

  // map to old vive-specific event names for now
  gestureEventMapping: {
    'fist': 'grip',  // e.g. grip button down
    'touch': 'point', // e.g. trigger button down
    'thumb': 'thumb'  // e.g. thumbs up pose - grip button down, trackpad / surface buttons up
  },

  emitGestureEvents: function () {
    var gesture = this.gesture || '';
    var lastGesture = this.lastGesture;
    var eventName;
    if (lastGesture !== gesture) {
      eventName = this.gestureEventMapping[lastGesture];
      this.lastGesture = gesture;
      if (eventName) {
        this.el.emit(eventName + (eventName === 'grip' ? 'open' : 'down'));
      }
      eventName = this.gestureEventMapping[gesture];
      if (eventName) {
        this.el.emit(eventName + (eventName === 'grip' ? 'close' : 'up'));
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

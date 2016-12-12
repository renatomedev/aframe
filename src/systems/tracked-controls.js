var registerSystem = require('../core/system').registerSystem;
var trackedControlsUtils = require('../utils/tracked-controls');

/**
 * Tracked controls system.
 * It maintains a list with the available tracked controllers
 */
module.exports.System = registerSystem('tracked-controls', {
  init: function () {
    var self = this;
    this.controllers = [];
    this.lastControllerCheck = 0;
    if (!navigator.getVRDisplays) { return; }
    navigator.getVRDisplays().then(function (displays) {
      if (displays.length > 0) {
        self.vrDisplay = displays[0];
      }
    });
  },

  rebuildControllerList: function () {
    var controllers = this.controllers = [];
    var gamepads = trackedControlsUtils.getGamepadsByPrefix('');
    for (var i = 0; i < gamepads.length; i++) {
      var gamepad = gamepads[i];
      if (gamepad && gamepad.pose) { controllers.push(gamepad); }
    }
  },

  tick: function (now) {
    if (now < this.lastControllerCheck + 10) { return; }

    this.lastControllerCheck = now;
    this.rebuildControllerList();
    this.sceneEl.emit('tracked-controls.tick', { timestamp: now, controllers: this.controllers });
  }
});

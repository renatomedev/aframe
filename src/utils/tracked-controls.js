/**
 * Return enumerated gamepads matching id prefix.
 *
 * @param {object} idPrefix - prefix to match in gamepad id, if any.
 */
module.exports.getGamepadsByPrefix = function (idPrefix) {
  var rtn = [];
  var gamepads = navigator.getGamepads && navigator.getGamepads();
  if (gamepads) {
    for (var i = 0; i < gamepads.length; ++i) {
      var gamepad = gamepads[i];
      if (gamepad) {
        if (!idPrefix || idPrefix === '' || gamepad.id.indexOf(idPrefix) === 0) {
          rtn.push(gamepad);
        }
      }
    }
  }
  return rtn;
};

/**
 * Enumerate controllers (as built by system tick, e.g. that have pose) and check if they match parameters.
 *
 * @param {object} idPrefix - prefix to match in gamepad id, if any.
 * @param {object} queryObject - map of values to match (hand; index among controllers with idPrefix)
 */
module.exports.isControllerPresent = function (idPrefix, queryObject) {
  var isMatch = false;
  var sceneEl = document.querySelector('a-scene');
  var gamepads = sceneEl && sceneEl.systems['tracked-controls'] && sceneEl.systems['tracked-controls'].controllers;
  if ((!gamepads || gamepads.length === 0) && sceneEl && sceneEl.systems['tracked-controls']) {
    sceneEl.systems['tracked-controls'].rebuildControllerList();
    gamepads = sceneEl.systems['tracked-controls'].controllers;
  }
  if (gamepads) {
    var index = 0;
    for (var i = 0; i < gamepads.length; ++i) {
      var gamepad = gamepads[i];
      var isPrefixMatch = (!idPrefix || idPrefix === '' || gamepad.id.indexOf(idPrefix) === 0);
      isMatch = isPrefixMatch;
      if (isMatch && queryObject.hand) {
        isMatch = (gamepad.hand === queryObject.hand);
      }
      if (isMatch && queryObject.index) {
        isMatch = (index === queryObject.index); // need to use count of gamepads with idPrefix
      }
      if (isMatch) { break; }
      if (isPrefixMatch) { index++; } // update count of gamepads with idPrefix
    }
  }
  return isMatch;
};


/**
 * Enumerate gamepads and apply callback function to each.
 *
 * @param {object} callback - callback function that takes gamepad as argument.
 * @param {object} idPrefix - prefix to match in gamepad id, if any.
 */
module.exports.enumerateGamepads = function (callback, idPrefix) {
  var gamepads = navigator.getGamepads && navigator.getGamepads();
  if (!gamepads) { return; }
  for (var i = 0; i < gamepads.length; ++i) {
    var gamepad = gamepads[i];
    if (!idPrefix || idPrefix === '' || gamepad.id.indexOf(idPrefix) === 0) {
      callback(gamepad, i);
    }
  }
};

/**
 * Enumerate controllers (as built by system tick, e.g. that have pose) and apply callback function to each.
 *
 * @param {object} callback - callback function that takes gamepad as argument.
 * @param {object} idPrefix - prefix to match in gamepad id, if any.
 */
module.exports.enumerateControllers = function (callback, idPrefix) {
  var sceneEl = document.querySelector('a-scene');
  var gamepads = sceneEl && sceneEl.systems['tracked-controls'] && sceneEl.systems['tracked-controls'].controllers;
  if (!gamepads) { return; }
  for (var i = 0; i < gamepads.length; ++i) {
    var gamepad = gamepads[i];
    if (!idPrefix || idPrefix === '' || gamepad.id.indexOf(idPrefix) === 0) {
      callback(gamepad, i);
    }
  }
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
  if (!gamepads) { return; }
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
  return isMatch;
};


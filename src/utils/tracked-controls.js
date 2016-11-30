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

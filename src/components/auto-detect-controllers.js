var registerComponent = require('../core/component').registerComponent;

/**
 * Auto-Detect Controllers Component
 * Inspects available controllers and injects appropriate vendor-specific components
 */
module.exports.Component = registerComponent('auto-detect-controllers', {
  schema: {
    // to be passed down to vendor-specific components
    hand: {default: 'left'},
    model: {default: true},
    rotationOffset: {default: -999} // use -999 as sentinel value to auto-determine based on hand
  },

  // buttonId (common event prefixes)
  // - trackpad
  // - trigger ( intensity value from 0.5 to 1 )
  // - grip
  // - menu ( dispatch but better for menu options )
  // - system ( never dispatched on this layer )

  prefixMapping: {
    'Oculus Touch': 'oculus-touch-controls',
    'OpenVR Gamepad': 'vive-controls'
  },

  init: function () { },

  update: function () {
    var el = this.el;
    var controllers = navigator.getGamepads && navigator.getGamepads(); // this fails... this.system.controllers;
    var data = this.data;

    // interrogate gamepads ourselves to see what we need to specify
    // (to do a priori, we need to figure out whether to use Vive or Rift)
    for (var cid = 0; cid < controllers.length; cid++) {
      for (var k in this.prefixMapping) {
        if (this.prefixMapping.hasOwnProperty(k)) {
          // if this controller matches the prefix,
          if (controllers[cid].id.indexOf(k) === 0) {
            // inject the appropriate mapping for that prefix
            var attr = this.prefixMapping[k];
            el.setAttribute(attr, {hand: data.hand, model: data.model, rotationOffset: data.rotationOffset});
            // stop matching... assume no more than one vendor at a time (?!?)
            cid = controllers.length;
            break;
          }
        }
      }
    }
  }
});

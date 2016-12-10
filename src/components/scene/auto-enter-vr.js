var registerComponent = require('../../core/component').registerComponent;
var utils = require('../../utils');

/**
 * Automatically enter VR, either upon vrdisplayactivate or immediately if possible.
 */
module.exports.Component = registerComponent('auto-enter-vr', {
  schema: {default: true},

  init: function () {
    var scene = this.el;

    if (utils.getUrlParameter('auto-enter-vr') === 'false') { return; }

    window.addEventListener('vrdisplayactivate', function () {
      console.log('vrdisplayactivate, enterVR()');
      scene.enterVR();
    }, false);

    this.el.addEventListener('enter-vr', function () {
      console.log('enter-vr');
    }, false);

    window.addEventListener('vrdisplaydeactivate', function () {
      console.log('vrdisplaydeactivate, exitVR()');
      scene.exitVR();
    }, false);

    this.el.addEventListener('exit-vr', function () {
      console.log('exit-vr');
    }, false);

    // just try to enter... turns out we need to wait for next tick
    setTimeout(function () { scene.enterVR(); }, 0);
  },

  update: function () {
    return (!this.data) ? this.el.exitVR() : this.el.enterVR();
  }
});


/* global assert, process, setup, suite, test */
var entityFactory = require('../helpers').entityFactory;
var controllerComponentName = 'hand-controls';

suite(controllerComponentName, function () {
  setup(function (done) {
    var el = this.el = entityFactory();
    el.setAttribute(controllerComponentName, '');
    process.nextTick(function () {
      done();
    });
  });

  suite('update', function () {
    test('oculus-touch-controls and vive-controls injected', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      controllerComponent.update();
      process.nextTick(function () {
        assert.ok(el.components['oculus-touch-controls']);
        assert.ok(el.components['vive-controls']);
        done();
      });
    });

    test('blend-character-model injected', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      controllerComponent.update();
      process.nextTick(function () {
        assert.ok(el.components['blend-character-model']);
        done();
      });
    });
  });

  suite('isOculusTouch', function () {
    test('true if controller id starts with "Oculus Touch"', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      var trackedControls;
      el.setAttribute('tracked-controls', '');
      process.nextTick(function () {
        trackedControls = el.components['tracked-controls'];
        // mock controller
        trackedControls.controller = {id: 'Oculus Touch (Left)', connected: true};
        // do the check
        assert.ok(controllerComponent.isOculusTouchController());
        done();
      });
    });

    test('false if controller id does not start with "Oculus Touch"', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      var trackedControls;
      el.setAttribute('tracked-controls', '');
      process.nextTick(function () {
        trackedControls = el.components['tracked-controls'];
        // mock controller
        trackedControls.controller = {id: 'OpenVR Gamepad', connected: true};
        // do the check
        assert.notOk(controllerComponent.isOculusTouchController());
        done();
      });
    });
  });

  suite('determineGesture', function () {
    test('if nothing touched or triggered, no gesture', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      // mock button / touch flags
      controllerComponent.pressedButtons['grip'] = false;
      controllerComponent.pressedButtons['trigger'] = false;
      controllerComponent.pressedButtons['touchpad'] = false;
      controllerComponent.pressedButtons['thumbstick'] = false;
      controllerComponent.pressedButtons['menu'] = false;
      controllerComponent.pressedButtons['AorX'] = false;
      controllerComponent.pressedButtons['BorY'] = false;
      controllerComponent.pressedButtons['surface'] = false;
      // do the check
      assert.notOk(controllerComponent.determineGesture());
      process.nextTick(function () { done(); });
    });

    test('if non-Oculus Touch and only trackpad. pointing gesture', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      var trackedControls;
      el.setAttribute('tracked-controls', '');
      process.nextTick(function () {
        trackedControls = el.components['tracked-controls'];
        // mock controller
        trackedControls.controller = {id: 'Foobar', connected: true};
        // mock button / touch flags
        controllerComponent.pressedButtons['grip'] = false;
        controllerComponent.pressedButtons['trigger'] = false;
        controllerComponent.pressedButtons['trackpad'] = true;
        controllerComponent.pressedButtons['thumbstick'] = false;
        controllerComponent.pressedButtons['menu'] = false;
        controllerComponent.pressedButtons['AorX'] = false;
        controllerComponent.pressedButtons['BorY'] = false;
        controllerComponent.pressedButtons['surface'] = false;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'pointing');
        process.nextTick(function () { done(); });
      });
    });

    test('if non-Oculus Touch and grip or trigger, gesture = fist', function (done) {
      var el = this.el;
      var controllerComponent = el.components[controllerComponentName];
      var trackedControls;
      el.setAttribute('tracked-controls', '');
      process.nextTick(function () {
        trackedControls = el.components['tracked-controls'];
        // mock controller
        trackedControls.controller = {id: 'Foobar', connected: true};
        // mock button / touch flags
        controllerComponent.pressedButtons['grip'] = true;
        controllerComponent.pressedButtons['trigger'] = false;
        controllerComponent.pressedButtons['trackpad'] = false;
        controllerComponent.pressedButtons['thumbstick'] = false;
        controllerComponent.pressedButtons['menu'] = false;
        controllerComponent.pressedButtons['AorX'] = false;
        controllerComponent.pressedButtons['BorY'] = false;
        controllerComponent.pressedButtons['surface'] = false;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'fist');
        // mock button / touch flags
        controllerComponent.pressedButtons['grip'] = false;
        controllerComponent.pressedButtons['trigger'] = true;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'fist');
        // mock button / touch flags
        controllerComponent.pressedButtons['grip'] = true;
        controllerComponent.pressedButtons['trigger'] = true;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'fist');
        // mock button / touch flags
        controllerComponent.pressedButtons['trackpad'] = true;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'fist');
        // mock button / touch flags
        controllerComponent.pressedButtons['menu'] = true;
        // do the check
        assert.equal(controllerComponent.determineGesture(), 'fist');
        process.nextTick(function () { done(); });
      });
    });
  });
});

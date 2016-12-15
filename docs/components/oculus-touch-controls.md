---
title: oculus-touch-controls
type: components
layout: docs
parent_section: components
---

[trackedcontrols]: ./tracked-controls.md

The oculus-touch-controls component interfaces with the Oculus Touch controllers. It
wraps the [tracked-controls component][trackedcontrols] while adding button
mappings, events, and a Touch controller model.

## Example

```html
<a-entity oculus-touch-controls="hand: left"></a-entity>
<a-entity oculus-touch-controls="hand: right"></a-entity>
```

## Value

| Property             | Description                                        | Default Value        |
|----------------------|----------------------------------------------------|----------------------|
| hand                 | The hand that will be tracked (i.e., right, left). | left                 |
| model                | Whether the Touch controller model is loaded.      | true                 |
| rotationOffset       | Offset to apply to model rotation.                 | 0                    |

## Events

| Event Name     | Description             |
| ----------     | -----------             |
| gripdown       | Grip button pressed.    |
| gripup         | Grip button released.   |
| menudown       | Menu button pressed.    |
| menuup         | Menu button released.   |
| systemdown     | System button pressed.  |
| systemup       | System button released. |
| thumbstickup   | Thumbstick pressed.     |
| thumbstickdown | Thumbstick released.    |
| triggerup      | Trigger pressed.        |
| triggerdown    | Trigger released.       |
| Aup            | A button pressed.       |
| Adown          | A button released.      |
| Bup            | B button pressed.       |
| Bdown          | B button released.      |
| Xup            | X button pressed.       |
| Xdown          | X button released.      |
| Yup            | Y button pressed.       |
| Ydown          | Y button released.      |

## Assets

- [Left Controller OBJ](https://cdn.aframe.io/controllers/oculus/oculus-touch-controller-left.obj)
- [Left Controller MTL](https://cdn.aframe.io/controllers/oculus/oculus-touch-controller-left.mtl)
- [Right Controller OBJ](https://cdn.aframe.io/controllers/oculus/oculus-touch-controller-right.obj)
- [Right Controller MTL](https://cdn.aframe.io/controllers/oculus/oculus-touch-controller-right.mtl)
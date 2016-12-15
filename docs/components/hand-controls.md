---
title: hand-controls
type: components
layout: docs
parent_section: components
---

[tracked]: ./tracked-controls.md
[vive]: ./vive-controls.md
[oculustouch]: ./oculus-touch-controls.md

The hand-controls gives tracked hands (using a prescribed model) with animated
gestures. It wraps the [vive-controls][vive] and [oculus-touch-controls][oculustouch] components, which wrap the
[tracked-controls component][tracked]. It adds additional events, semantically
named, and handles hand animations.

## Example

```html
<a-entity hand-controls="left"></a-entity>
<a-entity hand-controls="right"></a-entity>
```

## Values

| Value | Description                                      |
|-------|--------------------------------------------------|
| left  | The entity will track the left hand controller.  |
| right | The entity will track the right hand controller. |

## Events

| Event Name    | Description                                                        |
| ----------    | -----------                                                        |
| gripclose     | 'fist': grip active, trigger active, trackpad/surface active       |
| gripopen      | no longer 'fist'                                                   |
| pointup       | 'touch': grip inactive, trigger active, trackpad/surface inactive  |
| pointdown     | no longer 'touch'                                                  |
| thumbup       | 'thumb': grip active, trigger active, trackpad/surface inactive    |
| thumbdown     | no longer 'thumb'                                                  |
| pointingstart | 'pointing': grip active, trigger inactive, trackpad/surface active |
| pointingend   | no longer 'pointing'                                               |
| pistolstart   | 'pistol': grip active, trigger inactive, trackpad/surface inactive |
| pistolend     | no longer 'pistol'                                                 |

## Assets

- [Left hand model](https://cdn.aframe.io/controllers/oculus-hands/leftHand.json)
- [Right hand model](https://cdn.aframe.io/controllers/oculus-hands/rightHand.json)

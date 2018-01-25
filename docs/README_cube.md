# Xiaomi-mi Smart Home (Zigbee)

## Device specific readme for the Xiaomi cube

### Face numbering
      +---+
      | 1 |
 	+---+---+---+
 	| 5 | 6 | 2 |
 	+---+---+---+
      | 4 |
      +---+
      | 3 |
      +---+
where side 6 holds the MI logo and side 4 has the battery door.

### Device capabilities and limitations

The Cube reports several motions
* Flip 90 degrees
* Flip 180 degrees
* Slide
* Double Tap
* Rotate
* Shake

While using the cube, please keep the following in mind:
The cube does not send with all motions it's orientation (which face is facing upwards).

The cube sends it's orientation only on these motions:
* Flip 90 degrees
* Flip 180 degrees
* Slide
* Double Tap

The cube does not sent it's orientation for the following two motions:
* Rotate
* Shake

For the Rotate and Shake motions, the reported orientation is based on the last known orientation.

The cube does not send any data if gesture is unrecognized - rotating the cube randomly in the air and placing it down will most likely not send any event.
Therefore the Cube can trigger an event based on the wrong orientation if the flip motions are not performed correctly (like rotating the cube randomly in the air).


### Driver implementation
* Rotation angle reports of the Cube are not processed correctly by Homey's ZigBee core. A change is needed at Athom side to enable this; see https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/29.
* Battery reports are not send by the Cube in the default ZigBee cluster reports. A change is needed at Athom side to start utilizing the manufacturer specific reporting; see https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/25

In order to avoid that users need to re-include the Cube (and re-build all their flows), both the rotation angle as well as battery (measure and alarm) capabilities have been included. Until above issues have been resolved, these capabilities will show `-`. Once these issue have been resolved, the drivers will be updated and data reported will be shown without required action for the user (other then updating the app).

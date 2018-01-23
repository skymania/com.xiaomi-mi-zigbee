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

While using the cube, please keep the following in mind; The cube does not send with all motions it's orientation (which face is facing upwards).

The cube sends it's orientation only on these motions:
* Flip 90 degrees
* Flip 180 degrees
* Slide
* Double Tap

The cube does not sent it's orientation for the following two motions; therefore it is based on the last known orientation:
* Rotate
* Shake

The cube does not send any data if gesture is unrecognized - rotating the cube randomly in the air and placing it down will most likely not send any event.
Due to the above rotation and shake events can execute for wrong faces if the flip gestures are not performed correctly (like rotating the cube randomly in the air)

### Driver implementation
* The Cube currently still does not report the rotation angle. A change is needed at Athom side to enable this; see #29.
Rotation angle capability has been added to avoid the need for re-inclusion of the devices, once this issue will be resolved.

# Xiaomi / Aqara Smart Home (Zigbee)

### This app requires Homey SW release 1.5.13 or higher

This app adds support for the Zigbee Smart Home devices made by [Xiaomi Smart Home Devices](https://xiaomi-mi.com/).  
<a href="https://github.com/TedTolboom/com.xiaomi-mi-zigbee">
  <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/assets/images/small.png">
</a>  

## Links:
[Xiaomi-mi / Aqara Zigbee app Athom apps](https://apps.athom.com/app/com.xiaomi-mi-zigbee)                    
[Xiaomi-mi / Aqara Zigbee app Github repository](https://github.com/TedTolboom/com.xiaomi-mi-zigbee)   

## Supported devices (supported capabilities)
### Xiaomi devices   
* [Door/Window sensor (MCCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-door-window-sensors/) (contact alarm)
* [Occupancy Sensor (RTCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-occupancy-sensor/) (motion alarm)
* [Wireless switch (WXKG01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-wireless-switch/) (1x - 4x click, Key Held, Key released)  
* [Temperature/Humidity Sensor (WSDCGQ01LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-temperature-humidity-sensor/) (temperature, relative humidity, **battery level**)
* [Smart socket plug ZigBee edition (ZNCZ02LM)](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-socket-plug-2-zigbee-edition-white/) (onoff, measure_power, **meter_power**, **measure_voltage**)

### Aqara devices   
* [Aqara Curtain Controller (Zigbee) (ZNCLDJ11LM)](https://www.aqara.com/en/curtain_controller-product.html) (open, close, idle, setpoint (100% = open, 0% = closed))   
* [Aqara Door and Window Sensor (MCCGQ11LM)](https://www.aqara.com/en/door_and_window_sensor-product.html) (contact alarm, **battery level** )
* [Aqara Motion Sensor (RTCGQ11LM)](https://www.aqara.com/en/motion_sensor.html) (motion alarm, luminance, **battery level**)
* [Aqara Temperature and Humidity Sensor (WSDCGQ11LM)](https://www.aqara.com/en/temperature_and_humidity_sensor-product.html) (temperature, relative humidity, atmospheric pressure, **battery level**)
* [Aqara Cube Controller (MFKZQ01LM)](https://www.aqara.com/en/cube_controller-product.html) (Slide, Shake, Double Tap, Rotate (angle, relative angle), Flip 90°, Flip 180°, **battery level**), see [device readme for details](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/blob/master/docs/README_cube.md)
* [Aqara Smart Light Wall Switch (L) Single (QBKG04LM)](https://www.aqara.com/en/ctrl-neutral.html) / [Double (QBKG03LM)](https://www.aqara.com/en/ctrl-neutral.html) (onoff)
* [Aqara Smart Light Wall Switch (LN) Single (QBKG11LM)](https://www.aqara.com/en/ctrl-neutral.html) / [Double (QBKG12LM)](https://www.aqara.com/en/ctrl-neutral.html) (onoff, **measure_power**, **meter_power**, **measure_voltage**)
* [Aqara Wall Outlet (Zigbee) (QBCZ11LM)](https://www.aqara.com/en/wall_outlet-product.html) (onoff, **measure_power**, **meter_power**, **measure_voltage**)
* [Aqara Wireless switch with Gyro (WXKG12LM)](https://www.aqara.com/en/wireless_mini_switch.html) (1x, 2x click, key held, key released, Shaken, **battery level**)
* [Aqara Vibration Sensor (DJT11LM)](https://www.aqara.com/en/vibration_sensor-product.html) (tilt-, vibration-, drop-motion, tilt angles (to reference plane), tilt angles (to previous position), vibration strength, tilt-, vibration-, drop-alarm, **battery level**)      

  **Note:**   
  The following devices are sold under the same model number (e.g. WXKG11LM), but have different capabilities.
  From the outside (device and packaging) it is not possible to distinguish the devices with or without these capabilities; only after including them to a controller. Check the forum topic for experiences with sellers before purchasing these devices:   

* [Aqara Wireless switch (WXKG11LM, productID `sensor_switch.aq2`)](https://www.aqara.com/en/wireless_mini_switch.html) (1x - 4x click, **battery level**)   
* [Aqara Wireless Mini Switch (2018) (WXKG11LM, productID `remote.b1acn01`)](https://www.aqara.com/en/wireless_mini_switch.html) (1x, 2x click, key held, key released, **battery level**)   
* [Aqara Wireless Remote Switch Single (WXKG03LM, productID `sensor_86sw1lu`)](https://www.aqara.com/en/86plug.html) / [Double (WXKG02LM, productID `sensor_86sw2Un`)](https://www.aqara.com/en/86plug.html) (1x click for each button and combined)     
* [Aqara Wireless Switch Single (2018) (WXKG03LM, productID `remote.b186acn01`)](https://www.aqara.com/en/86plug.html) / [Double (2018) (WXKG02LM, productID `remote.b286acn01`)](https://www.aqara.com/en/86plug.html) (1x, 2x click, long press for each button and combined)   

## Devices Work in Progress (awaiting additional clusters in Homey's Zigbee implementation)
* MiJia Honeywell Smoke Detector White
* MiJia Honeywell Gas Leak Detector
* MiJia Aqara Water sensor

## Supported Languages:
* English
* Dutch

## Acknowledgements:
This app and driver development has been supported by:  
* Sprut666666   
* Kasteleman   
* BasKiers
* RobinBolscher

## Feedback:
Any requests please post them in the [Xiaomi / Aqara Zigbee topic on the Athom Community forum](https://community.athom.com/t/156/) or contact me on [Slack](https://athomcommunity.slack.com/team/tedtolboom)    
Please report issues at the [issues section on Github](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues) otherwise in the above mentioned topic.     

## Change Log:

### v 0.5.2
* Fix issue where motion alarm would be cancelled before the finalizing the motion alarm reset duration    

### v 0.5.1
* Fix issues where incorrect data is reported by the Xiaom and Aqara Temperature and Humidity Sensors [#125](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/125)   

### v 0.5.0
* Enabled Xiaomi lifeline reporting (device dependent interval), adding the following functions:
  - Battery reporting (measurement + alarm) enabled for multiple devices (see device - capability overview)   
  - Additional state / capability reporting (e.g. curtain position for `Aqara Curtain controller` or onoff state for the `Aqara wall switch`)   
  - Updated App dependency updated to Homey SW >= 1.5.13   
* Updated app to fully utilize Homey SW v2.0.0 options:
  - Fix issue where custom icons are not shown   
  - Add brandColor definition to match Xiaomi brand    
* Added `measure_power`, `meter_power` and `measure_voltage` capabilities to the `Aqara Wall Switch Single (LN)` and `Aqara Wall Switch Double (LN)`. **Note:** Re-inclusion is required to add these capabilities
* Added fixed polling interval (10 minutes) for `meter_power` and `measure_voltage` capabilities for `Aqara Smart socket plug`, `Aqara Smart Socket`, `Aqara Wall Switch Single (LN)` and `Aqara Wall Switch Double (LN)`
* Cleaned up device driver logging (moved some logging to the debug-logging mode)
* Updated readme device overview to show added capabilities and link towards the device info at the [official Aqara site](https://www.aqara.com/en/home.html)
* Update Homey meshdriver to v1.2.30

### v 0.4.3
* Add support for the Aqara Wireless Mini Switch (2018) (WXKG11LM, productID `sensor_switch.aq2`), issue [#89](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/89)    
* Add support for the Aqara Wireless Switch Single (2018) (WXKG03LM, productID `remote.b186acn01`), issue [#88](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/88)    
* Add support for the Aqara Wireless Switch Double (2018) (WXKG02LM, productID `remote.b286acn01`), issue [#88](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/88)    
**Note:** These devices are released by Xiaomi / Aqara with the same product code, but different firmware & capabilities. It is not possible based on the device label to determine which version you have, only based on the Zigbee productID once added to Homey   
* Fix issue where alarm triggers for Aqara vibration sensor were triggered twice, issue [#97](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/97)   
* Add settings option to determine amount of decimals reported for temperature & humidity, feature request [#98](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/98)   

### v 0.4.2
* Add support for the Aqara Vibration Sensor (DJT11LM), with capabilities tilt-, vibration-, drop-motion, tilt angles (to reference plane), tilt angles (to previous position), vibration strength, tilt-, vibration-, drop-alarm   
* Removing the old, no longer working, (marked DEPRECATED) cards as announced in as of release v 0.3.0   
* Optimizing the attribute report settings   
* Update ZigBee meshdriver to 1.2.27      

### v 0.4.1
* Fix issue where the Aqara Smart Light Wall Switch (**LN**) Single (product type no: QBKG11LM) can not be controlled   

### v 0.4.0
* Add support for the 'Aqara Curtain controller' (product type no: ZNCLDJ11LM)   
* Fix issue where Aqara Smart Light Wall Switch (**L**) right button is not activated by FlowCard, issue [#64](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/64).   
Existing flows for this device will need to be rebuild   
* Fix issue / add support for Aqara Smart Light Wall Switch (**LN**), issue [#60](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/60).   
Re-inclusion of devices with Zigbee Product ID `lumi.ctrl_ln1.aq1` and `lumi.ctrl_ln2.aq1` is needed   

**Note:** The old (marked DEPRECATED) flow cards of the wireless switches will be removed in a next release; please rebuild your flows based on the new cards   

### v 0.3.0
* Add support for Aqara Wireless switch with Gyro (product type no: WXKG12LM)   
**Note:** Switches with this type no. that were included before will need to be re-included in order to work properly   
* Replaced old scene trigger cards with autocomplete cards to fix reported issues   
**Note:** The old (marked DEPRECATED) cards will be removed in a next release; please rebuild your flows based on the new cards  
* Update ZigBee meshdriver to 1.2.12   

### v 0.2.5
* Add temperature offset correction setting for the Xiaomi temperature & humidity sensor and the Aqara temperature & humidity sensor   
* Fix typo in Xiaomi Cube flow trigger card

### v 0.2.4
* Fix issue where Aqara Wireless Remote Switch Single init results in app crash, issue [#46](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/46)   

### v 0.2.3
* Updated app dependency to latest Stable Homey Software release (>= 1.5.7)
* Update ZigBee meshdriver to 1.2.7   
* Add support for the Xiaomi Cube rotation angle (and relative angle) capability, fix issue [#29](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/29)
* Add additional ID's for Aqara Smart Light Wall Switch Single / Double, fix issue [#20](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/20))
* Add additional ID's for Aqara Wireless Switch, fix issue [#38](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/38))   
* Fix issue where unsupported options are presented in the trigger card of the Aqara Wireless Remote Switch Single, related to [#37](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/37)

### v 0.2.2
* Update relative link in readme.md to direct link (Homey apps compatible)   
* Update app manifest for supported Devices   

### v 0.2.1
* Add support for Xiaomi Cube (Slide, Shake, Double Tap, Rotate (action, not angle yet), Flip 90°, Flip 180°).   
**note:** Cubes included based on previous development builds need to be re-included   

### v 0.2.0
* Add support for Smart socket plug ZigBee edition (onoff, measure_power)   
* Add support for Aqara Smart Light Wall Switch Single / Double (onoff)   
* Add support for Aqara Smart Socket ZigBee Version (onoff, measure_power)   
* Add explicitly in app title dependency on Homey SW release (>= 1.5.4)   

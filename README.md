# Xiaomi-mi Smart Home (Zigbee)

### This app requires Homey SW release 1.5.4 or higher

This app adds support for the Zigbee Smart Home devices made by [Xiaomi Smart Home Devices](https://xiaomi-mi.com/).  
<a href="https://github.com/TedTolboom/com.xiaomi-mi-zigbee">
  <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/assets/images/small.png">
</a>  

## Links:
[Xiaomi-mi Zigbee app Athom apps](https://apps.athom.com/app/com.xiaomi-mi-zigbee)                    
[Xiaomi-mi Zigbee app Github repository](https://github.com/TedTolboom/com.xiaomi-mi-zigbee)   

**Note:** This app is using [HomeyConfig composer](https://www.npmjs.com/package/node-homey-config-composer).   
Please file Pull Requests on the *development* branch of this repository and with respect to the refactored files in _/drivers_ and _/config_ folders.   

## Supported devices (supported capabilities)
* [Door/Window sensor](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-door-window-sensors/) (contact alarm)
* [Occupancy Sensor](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-occupancy-sensor/) (motion alarm)
* [Temperature/Humidity Sensor](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-temperature-humidity-sensor/) (temperature, relative humidity)
* [Wireless switch](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-wireless-switch/) (1x - 4x click, Key Held, Key released)  
* [Smart socket plug ZigBee edition](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-socket-plug-2-zigbee-edition-white/) (onoff, measure_power)
* [Cube](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-mi-smart-home-cube-white/) (Slide, Shake, Double Tap, Rotate (action, not angle), Flip 90°, Flip 180°), see [device readme for details](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/blob/master/docs/README_cube.md)

* [Aqara Window/Door Sensor](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-window-door-sensor/) (contact alarm)
* [Aqara Human Body Sensor](https://xiaomi-mi.com/sockets-and-sensors/aqara-human-body-sensor/) (motion alarm, luminance)
* [Aqara Temperature and Humidity Sensor](https://xiaomi-mi.com/sockets-and-sensors/aqara-human-body-sensor/) (temperature, relative humidity, atmospheric pressure)
* [Aqara Smart Light Wall Switch Single](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-single-key/) / [Double](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-zigbee-version-double-key/) (onoff)
* [Aqara Smart Socket ZigBee Version](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-socket-zigbee-version/) (onoff, measure_power)
* [Aqara Wireless switch](https://xiaomi-mi.com/sockets-and-sensors/xiaomi-aqara-smart-wireless-switch/) (1x - 4x click)   
* [Aqara Wireless Remote Switch Single](https://xiaomi-mi.com/sockets-and-sensors/aqara-smart-light-wall-switch-single-key/) / [Double](https://xiaomi-mi.com/sockets-and-sensors/remote-switch-for-aqara-smart-light-wall-switch-double-key/) (1x click for each button and combined)     

**Notes:**
* Battery operated devices will not yet show the **battery level**; this will be added in a future release (manufacturer specific ZigBee implementation)    
* The Smart socket plug and Aqara Smart Socket ZigBee version report the actual power (W), **consumed energy (kWh)** will be added in a future release (manufacturer specific ZigBee implementation)    

## Devices Work in Progress (reports received)
* Curtain Controller ([GitHub issue](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues/30))

## Devices Work in Progress (inclusion is possible, require a [ZigBee Shepherd change (by Athom)](https://github.com/athombv/homey/issues/2005))
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
Any requests please post them in the [Xiaomi-mi Zigbee topic on the Athom Forum](https://forum.athom.com/discussion/4120/) or contact me on [Slack](https://athomcommunity.slack.com/team/tedtolboom)    
Please report issues at the [issues section on Github](https://github.com/TedTolboom/com.xiaomi-mi-zigbee/issues) otherwise in the above mentioned topic.     

## Change Log:
### v 0.2.2
* Update relative link in readme.md to direct link (Homey apps compatible)   
* Update app manifest for supported Devices   

### v 0.2.1
* Add support for Xiaomi Cube (Slide, Shake, Double Tap, Rotate (action, not angle yet), Flip 90°, Flip 180°).   
*note:* Cubes included based on previous development builds need to be re-included   

### v 0.2.0
* Add support for Smart socket plug ZigBee edition (onoff, measure_power)   
* Add support for Aqara Smart Light Wall Switch Single / Double (onoff)   
* Add support for Aqara Smart Socket ZigBee Version (onoff, measure_power)   
* Add explicitly in app title dependency on Homey SW release (>= 1.5.4)   

### v 0.1.4
* Add 1x click of both buttons for Aqara Wireless Remote Switch Double  
* Increase luminance sensor sensitivity for Aqara Human Body Sensor   

### v 0.1.3
* Add second deviceID for Aqara Window/Door Sensor
* Fix deviceID's (and update driver name) for Aqara Wireless Remote Switch Single   

### v 0.1.2
* Add support for Aqara Wireless Remote Switch (Single / Double)
* Add support for Temperature / Humidity sensor
* Add support for Xiaomi Occupancy sensor    
* Contain issue with (Aqara) Wireless switch (re-)triggering multiple times due to latency in Zigbee network (3s re-trigger timeout added)   
* Add dedicated Flow trigger for Xiaomi wireless switch to make 'Key Held' exclusively available (flow repair needed)   
* Add 'Key Held threshold' parameter for Xiaomi wireless switch   

### v 0.1.1
* Wireless Switch (round) - Add 'Key Held' and 'Key released' triggers
* Aqara Weather sensor - Add correct learn picture
* All devices - Update inclusion instructions

### v 0.1.0
* App store release with support for the both Door/Window sensors, both wireless switches, Aqara Human Body sensor, Aqara Weather sensor

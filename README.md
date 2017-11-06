# Xiaomi-mi Smart Home (Zigbee)

This app adds support for the Zigbee Smart Home devices made by [Xiaomi Smart Home Devices](https://xiaomi-mi.com/).  
<a href="https://github.com/TedTolboom/com.xiaomi-mi-zigbee">
  <img src="https://raw.githubusercontent.com/TedTolboom/com.xiaomi-mi-zigbee/master/assets/images/small.png">
</a>  

## Links:
[Xiaomi-mi Zigbee app Athom apps](https://apps.athom.com/app/com.xiaomi-mi-zigbee)                    
[Xiaomi-mi Zigbee app Github repository](https://github.com/TedTolboom/com.xiaomi-mi-zigbee)   
**Note:** This app is using [HomeyConfig composer](https://www.npmjs.com/package/node-homey-config-composer).   
Please file Pull Requests on the development branch of this repository and with respect to the refactored files in _/drivers_ and _/config_ folders.   

## Supported devices
* Door/Window sensor (contact alarm)
* Aqara Window/Door Sensor (contact alarm)
* Aqara Human Body Sensor (motion alarm, luminance, temperature)
* Aqara Weather sensor (temperature, relative humidity, atmospheric pressure)
* Wireless switch (1x - 4x click, Key Held, Key released)
* Aqara Wireless switch (1x - 4x click)   
* Temperature/Humidity Sensor
* Occupancy Sensor
* Aqara Wireless Remote Switch Single / Double (1x click)     

**Note:** The Aqara Human Body Sensor has a button next to the PIR window; the Occupancy sensor has a pinhole   

## Devices Work in Progress (reports received)
* Curtain Controller
* Smart socket plug

## Devices Work in Progress (inclusion is possible, no reporting yet)
* Cube
* Aqara Wall Switch Single / Double
* Aqara Water sensor
* Gas Leak detector
* Smoke detector

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
### v 0.1.2
* Add support for Aqara Wireless Remote Switch (Single / Double)
* Add support for Temperature / Humidity sensor
* Add support for Xiaomi Occupancy sensor

### v 0.1.1
* Wireless Switch (round) - Add 'Key Held' and 'Key released' triggers
* Aqara Weather sensor - Add correct learn picture
* All devices - Update inclusion instructions

### v 0.1.0
* App store release with support for the both Door/Window sensors, both wireless switches, Aqara Human Body sensor, Aqara Weather sensor

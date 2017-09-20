'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/bspranger/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-aqara-door-window-sensor.src/xiaomi-aqara-door-window-sensor.groovy
//  fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003",
// outClusters: "0000, 0004",
// manufacturer: "LUMI", model: "lumi.sensor_magnet.aq2", deviceJoinName: "Xiaomi Aqara Door Sensor"
/*
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ------------------------------------------
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] Node: e827ed2c-c8ec-4cba-9072-97131017da00
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] - Battery: false
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] - Endpoints: 0
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] -- Clusters:
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- zapp
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- genBasic
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- cid : genBasic
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- sid : attrs
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- genIdentify
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- cid : genIdentify
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- sid : attrs
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- genGroups
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- cid : genGroups
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- sid : attrs
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- genOnOff
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- cid : genOnOff
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- sid : attrs
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] --- manuSpecificCluster
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- cid : manuSpecificCluster
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ---- sid : attrs
2017-09-14 20:48:16 [log] [ManagerDrivers] [aqara_door_window_sensor] [0] ------------------------------------------
*/

class AqaraDoorWindowSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		/*
		this.registerCapability('alarm_contact', 'genOnOff', {
			report: 'OnOff',
			reportParser(value) {
				return value;
			},
		}, 0);
		*/

		this.registerAttrReportListener('genOnOff', 'OnOff', 1, 6000, 1, data => {
			this.log('genOnOff - OnOff', data === 1);
			this.setCapabilityValue('alarm_contact', data === 1);
		}, 0);

	}
}

module.exports = AqaraDoorWindowSensor;

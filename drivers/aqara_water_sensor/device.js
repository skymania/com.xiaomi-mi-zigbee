'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/bspranger/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-aqara-door-window-sensor.src/xiaomi-aqara-door-window-sensor.groovy
//  fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003",
// outClusters: "0000, 0004",
// manufacturer: "LUMI", model: "lumi.sensor_magnet.aq2", deviceJoinName: "Xiaomi Aqara Door Sensor"

class AqaraWaterSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		this.registerCapability('alarm_water', 'genOnOff', {
			report: 'OnOff',
			reportParser(value) {
				return value;
			},
		});
		this.registerAttrReportListener('genOnOff', 'OnOff', 1, 6000, 1, data => {
			this.log('OnOff', data);
		});

		// DWS genOnOff OnOff endpoint 1
		//this.registerReportListener('genOnOff', 'OnOff', report => {
		//	console.log(report);
		//}, 1);

		if (this.node) {

			// Listen to all the commands that come in
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
				console.log(report.endpoint);
				console.log(report.attr);
				console.log(report.value);
			});
		}
	}
}

module.exports = AqaraWaterSensor;

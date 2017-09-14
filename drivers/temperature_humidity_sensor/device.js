'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/a4refillpad/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-temperature-humidity-sensor.src/xiaomi-temperature-humidity-sensor.groovy
// fingerprint profileId: "0104", deviceId: "0302",
// inClusters: "0000 (Basic),0001(Power Configuration),0003(Identify),0009(Alarms),0402(Temperature Measurement),0405(Relative Humidity Measurement)"

class XiaomiDoorWindowSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Temperature msTemperatureMeasurement measuredValue endpoint 1
		// this.registerReportListener('msTemperatureMeasurement', 'measuredValue', report => {
		//	console.log(report);
		//}, 1);
		// Humidity msRelativeHumidity measuredValue endpoint 1
		//this.registerReportListener('msRelativeHumidity', 'measuredValue', report => {
		//	console.log(report);
		//}, 1);

		if (this.node) {

			// Listen to all the commands that come in
			this.node.on('report', report => {
				console.log('Command received');
				console.log(report);
				console.log(report.endpoint);
				console.log(report.attr);
				console.log(report.value);
			});
		}
	}
}

module.exports = XiaomiDoorWindowSensor;

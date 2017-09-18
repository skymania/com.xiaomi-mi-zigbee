'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// https://github.com/bspranger/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-aqara-temperature-humidity-sensor.src/xiaomi-aqara-temperature-humidity-sensor.groovy
// fingerprint profileId: "0104", deviceId: "0302",
// inClusters: "0000, 0003, FFFF, 0402, 0403, 0405", outClusters: "0000, 0004, FFFF",
// manufacturer: "LUMI", model: "lumi.weather", deviceJoinName: "Xiaomi Aqara Temp Sensor"

/*
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] - Battery: false
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] - Endpoints: 0
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] -- Clusters:
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- zapp
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- genBasic
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : genBasic
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- genIdentify
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : genIdentify
2017-09-09 18:54:06 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- genGroups
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : genGroups
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- msTemperatureMeasurement
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : msTemperatureMeasurement
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- msPressureMeasurement
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : msPressureMeasurement
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- msRelativeHumidity
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : msRelativeHumidity
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] --- manuSpecificCluster
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- cid : manuSpecificCluster
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ---- sid : attrs
2017-09-09 18:54:07 [log] [ManagerDrivers] [temperature_humidity_pressure_sensor] [0] ------------------------------------------
*/

class AqaraWeatherSensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Temperature Cluster
		// Register measure temperature capability
		this.registerCapability('measure_temperature', 'msTemperatureMeasurement', {
			report: 'measuredValue',
			reportParser(value) {
				return Math.round((value / 100) * 10) / 10;
			},
		});

		this.registerAttrReportListener('msTemperatureMeasurement', 'measuredValue', 30, 900, 1, data => {
			this.log('measuredValue', data);
		}, 0);

		// Humidity Cluster
		// Register measure humidity capability
		this.registerCapability('measure_humidity', 'msRelativeHumidity', {
			report: 'measuredValue',
			reportParser(value) {
				return value;
			},
		});

		this.registerAttrReportListener('msRelativeHumidity', 'measuredValue', 30, 3600, 1, data => {
			this.log('measuredValue', data);
		}, 0);

		// Pressure Cluster
		// Register measure pressure capability
		this.registerCapability('measure_pressure', 'msPressureMeasurement', {
			report: 'measuredValue',
			reportParser(value) {
				return value;
			},
		});

		this.registerAttrReportListener('msPressureMeasurement', 'measuredValue', 30, 3600, 1, data => {
			this.log('measuredValue', data);
		}, 0);

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

module.exports = AqaraWeatherSensor;

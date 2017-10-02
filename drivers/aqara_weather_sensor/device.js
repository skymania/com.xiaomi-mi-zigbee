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

		// Temperature Cluster (0x0402)
		this.log('Initializing Temperature (0x0402) Cluster');
		// Min report interval in seconds (must be greater than 1)
		const minIntTemp = this.getSetting('minIntTemp') || 30;
		// Max report interval in seconds (must be zero or greater than 60 and greater than min report interval)
		const maxIntTemp = this.getSetting('maxIntTemp') || 120;
		// Report change value, if value changed more than this value send a report
		const repChangeTemp = this.getSetting('repChangeTemp') || 50; // note: 1 = 0.01 [°C]

		// Register the AttributeReportListener
		this.registerAttrReportListener(
				'msTemperatureMeasurement', // Cluster
				'measuredValue', // Attr
				minIntTemp,
				maxIntTemp,
				repChangeTemp,
				this.onTemperatureReport.bind(this), // Callback with value
				0) // The endpoint index
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener', err);
			});

		// Humidity Cluster (0x0405)
		this.log('Initializing Humidity (0x0405) Cluster');
		// The minimal reporting interval in seconds (e.g. 10 (seconds)):
		const minIntHum = this.getSetting('minIntHum') || 60;
		// The maximal reporting interval in seconds (e.g. 300 (seconds))
		const maxIntHum = this.getSetting('maxIntHum') || 180;
		// Reportable change; the attribute should report its value when the value is changed more than this setting.
		const repChangeHum = this.getSetting('repChangeHum') || 100; // note: 1 = 0.01 [%]

		// Register the AttributeReportListener
		this.registerAttrReportListener(
				'msRelativeHumidity', // Cluster
				'measuredValue', // Attr
				minIntHum,
				maxIntHum,
				repChangeHum,
				this.onHumidityReport.bind(this), // Callback with value
				0) // The endpoint index
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener', err);
			});

		// Pressure Cluster (0x0403)
		this.log('Initializing Pressure (0x0403) Cluster');

		// The minimal reporting interval in seconds (e.g. 10 (seconds)):
		const minIntPres = this.getSetting('minIntPres') || 60;
		// The maximal reporting interval in seconds (e.g. 300 (seconds))
		const maxIntPres = this.getSetting('maxIntPres') || 240;
		// Reportable change; the attribute should report its value when the value is changed more than this setting.
		const repChangePres = this.getSetting('repChangePres') || 100; // note: 1 = 0.01 [%]

		// Register the AttributeReportListener
		this.registerAttrReportListener(
				'msPressureMeasurement', // Cluster
				'measuredValue', // Attr
				minIntPres,
				maxIntPres,
				repChangePres,
				this.onPressureReport.bind(this), // Callback with value
				0) // The endpoint index
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener', err);
			});

		this.log('Fully initialized');

	}

	onTemperatureReport(value) {
		const parsedValue = Math.round((value / 100) * 10) / 10;
		this.log('msTemperatureMeasurement - measuredValue', parsedValue);
		this.setCapabilityValue('measure_temperature', parsedValue);
	}

	onHumidityReport(value) {
		const parsedValue = Math.round((value / 100) * 10) / 10;
		this.log('msRelativeHumidity - measuredValue', parsedValue);
		this.setCapabilityValue('measure_humidity', parsedValue);
	}

	onPressureReport(value) {
		const parsedValue = Math.round((value / 100) * 10) / 10;
		this.log('msPressureMeasurement - measuredValue', parsedValue);
		this.setCapabilityValue('measure_pressure', parsedValue);
	}
}

module.exports = AqaraWeatherSensor;

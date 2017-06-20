'use strict';

const path = require('path');
const ZigBeeDriver = require('homey-zigbeedriver');

// https://github.com/a4refillpad/Xiaomi/blob/master/devicetypes/a4refillpad/xiaomi-temperature-humidity-sensor.src/xiaomi-temperature-humidity-sensor.groovy
// fingerprint profileId: "0104", deviceId: "0302",
// inClusters: "0000 (Basic),0001(Power Configuration),0003(Identify),0009(Alarms),0402(Temperature Measurement),0405(Relative Humidity Measurement)"

module.exports = new ZigBeeDriver(path.basename(__dirname), {
	debug: true,
	capabilities: {
		measure_temperature: {
			command_endpoint: 0,
			command_cluster: 'msTemperatureMeasurement',
			// command_set: 'moveToLevel',
			// command_set_parser: (value, node) => ({
			// 	level: value * maxBrightness,
			//	transtime: node.settings.transtime,
			// }),
			command_get: 'measuredValue',
			// MeasuredValue is a mandatory attribute representing the measured temperature in degrees Celsius, as follows:
			// MeasuredValue = 100 x temperature in degrees Celsius
			command_report_parser: value => value / 100,
		},
		measure_humidity: {
			command_endpoint: 0,
			command_cluster: 'msRelativeHumidity',
			// command_set: value => value ? 'on' : 'off',
			// command_set_parser: () => ({}),
			command_get: 'MeasuredValue',
			// MeasuredValue is a mandatory attribute representing the measured relatively humidity as a percentage in steps of 0.01%, as follows:
			// MeasuredValue = 100 x relative humidity percentage
			command_report_parser: value => value / 100,
		},
		measure_battery: {
			command_endpoint: 0,
			command_cluster: 'genPowerCfg',
			// command_set: value => value ? 'on' : 'off',
			// command_set_parser: () => ({}),
			command_get: 'batteryPercentageRemaining',
			// BatteryPercentageRemaining indicates the remaining battery life as a percentage of the complete battery lifespan, expressed to the nearest halfpercent in the range 0 to 100 - for example, 0xAF represents 87.5%.
			// The special value 0xFF indicates an invalid or unknown measurement.
			command_report_parser: value => value / 2,
		},
		alarm_battery: {},
	},
});

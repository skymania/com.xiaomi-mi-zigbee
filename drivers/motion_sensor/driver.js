'use strict';

const path = require('path');
const ZigBeeDriver = require('homey-zigbeedriver');

// fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000(Basic), 0003(Identify), FFFF, 0019(OTA Upgrade cluster)",
// outClusters: "0000(Basic), 0004(Groups), 0003(Identify), 0006(On/Off), 0008(Level Control), 0005(Scenes), 0019(OTA Upgrade cluster)",
// manufacturer: "LUMI", model: "lumi.sensor_motion", deviceJoinName: "Xiaomi Motion"

module.exports = new ZigBeeDriver(path.basename(__dirname), {
	debug: true,
	capabilities: {
		alarm_motion: {
			command_endpoint: 0,
			command_cluster: 'msOccupancySensing',
			// command_set: 'moveToLevel',
			// command_set_parser: (value, node) => ({
			//	level: value * maxBrightness,
			//	transtime: node.settings.transtime,
			// }),
			command_get: 'occupancy',
			// Occupancy is a mandatory attribute indicating the sensed occupancy in a bitmap in which bit 0 is used as follows (and all other bits are reserved):
			// bit 0 = 1 : occupied
			// bit 0 = 0 : unoccupied
			command_report_parser: value => value,
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

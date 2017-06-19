'use strict';

const path = require('path');
const ZigBeeDriver = require('homey-zigbeedriver');

const maxBrightness = 255;

module.exports = new ZigBeeDriver(path.basename(__dirname), {
	debug: true,
	capabilities: {
		onoff: {
			command_endpoint: 0,
			command_cluster: 'genOnOff',
			command_set: value => value ? 'on' : 'off',
			command_set_parser: () => ({}),
			command_get: 'onOff',
			command_report_parser: value => value === 1,
		},
		measure_battery: {},
		alarm_battery: {},
	},
});

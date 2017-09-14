'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003, FFFF, 0019",
// outClusters: "0000, 0004, 0003, 0006, 0008, 0005, 0019",
// manufacturer: "LUMI", model: "lumi.sensor_motion.aq2", deviceJoinName: "Xiaomi Motion"

class AqaraHumanBodySensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Not useful in this case, but using registerReportListener you can subscribe to incoming reports
		// this.registerReportListener('msOccupancySensing', 'occupancy', report => {
		// 	console.log(report);
		// },1);

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

module.exports = AqaraHumanBodySensor;

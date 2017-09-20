'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

// fingerprint profileId: "0104", deviceId: "0104",
// inClusters: "0000, 0003, FFFF, 0019",
// outClusters: "0000, 0004, 0003, 0006, 0008, 0005, 0019",
// manufacturer: "LUMI", model: "lumi.sensor_motion.aq2", deviceJoinName: "Xiaomi Motion"

/*
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ZigBeeDevice has been inited
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ------------------------------------------
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] Node: 52c927a0-98e3-4b1b-8074-2da221c04522
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] - Battery: false
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] - Endpoints: 0
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] -- Clusters:
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- zapp
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- genBasic
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- cid : genBasic
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- sid : attrs
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- manufacturerName : LUMI
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- modelId : lumi.sensor_motion.aq2
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- genOta
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- cid : genOta
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- sid : attrs
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- msIlluminanceMeasurement
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- cid : msIlluminanceMeasurement
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- sid : attrs
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- msOccupancySensing
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- cid : msOccupancySensing
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- sid : attrs
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] --- manuSpecificCluster
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- cid : manuSpecificCluster
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ---- sid : attrs
2017-09-14 20:29:21 [log] [ManagerDrivers] [aqara_human_body_sensor] [0] ------------------------------------------
*/

class AqaraHumanBodySensor extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Occupancy Cluster
		// Register alarm_motion capability
		/*
		this.registerCapability('alarm_motion', 'msOccupancySensing', {
			report: 'occupancy',
			reportParser(value) {
				return value;
			},
		}, 0);
		*/

		// Register AttributeReportListener for occupancy
		this.registerAttrReportListener('msOccupancySensing', 'occupancy', 1, 6000, null, data => {
			this.log('msOccupancySensing - occupancy', data === 1);
			this.setCapabilityValue('alarm_motion', data === 1);
		}, 0);

		// Illuminance Cluster
		// Register measure_luminance capability
		/*
		this.registerCapability('alarm_motion', 'msOccupancySensing', {
			report: 'occupancy',
			reportParser(value) {
				return value;
			},
		}, 0);
		*/

		// Register AttributeReportListener for lumminance
		this.registerAttrReportListener('msIlluminanceMeasurement', 'measuredValue', 180, 3600, 20, data => {
			this.log('msIlluminanceMeasurement - measuredValue', data);
			this.setCapabilityValue('measure_luminance', data);
		}, 0);

	}
}

module.exports = AqaraHumanBodySensor;

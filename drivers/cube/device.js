'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraCubeSensor extends ZigBeeDevice {
	onMeshInit() {
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register the AttributeReportListener
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, value => {
			this.log('genMultistateInput cluster 0', value);
		}, 0);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, value => {
			this.log('genMultistateInput cluster 1', value);
		}, 1);

		// gives 0 for shaking
		// gives 3 for throwing in the air and catch again
		// tapping gives 5xx value

		// Register the AttributeReportListener
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2', value);
		}, 2);

	}
}

module.exports = AqaraCubeSensor;

//	[ManagerDrivers] [cube] [0] ZigBeeDevice has been inited
// [ManagerDrivers] [cube] [0] ------------------------------------------
// [ManagerDrivers] [cube] [0] Node: b8b6da9e-7086-489b-b643-60282088ed6c
// [ManagerDrivers] [cube] [0] - Battery: false
// [ManagerDrivers] [cube] [0] - Endpoints: 0
// [ManagerDrivers] [cube] [0] -- Clusters:
// [ManagerDrivers] [cube] [0] --- zapp
// [ManagerDrivers] [cube] [0] --- genBasic
// [ManagerDrivers] [cube] [0] ---- cid : genBasic
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] ---- modelId : lumi.sensor_cube
// [ManagerDrivers] [cube] [0] --- genIdentify
// [ManagerDrivers] [cube] [0] ---- cid : genIdentify
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genGroups
// [ManagerDrivers] [cube] [0] ---- cid : genGroups
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genScenes
// [ManagerDrivers] [cube] [0] ---- cid : genScenes
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genMultistateInput
// [ManagerDrivers] [cube] [0] ---- cid : genMultistateInput
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genOta
// [ManagerDrivers] [cube] [0] ---- cid : genOta
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] - Endpoints: 1
// [ManagerDrivers] [cube] [0] -- Clusters:
// [ManagerDrivers] [cube] [0] --- zapp
// [ManagerDrivers] [cube] [0] --- genIdentify
// [ManagerDrivers] [cube] [0] ---- cid : genIdentify
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genGroups
// [ManagerDrivers] [cube] [0] ---- cid : genGroups
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genScenes
// [ManagerDrivers] [cube] [0] ---- cid : genScenes
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genMultistateInput
// [ManagerDrivers] [cube] [0] ---- cid : genMultistateInput
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] - Endpoints: 2
// [ManagerDrivers] [cube] [0] -- Clusters:
// [ManagerDrivers] [cube] [0] --- zapp
// [ManagerDrivers] [cube] [0] --- genIdentify
// [ManagerDrivers] [cube] [0] ---- cid : genIdentify
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genGroups
// [ManagerDrivers] [cube] [0] ---- cid : genGroups
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genScenes
// [ManagerDrivers] [cube] [0] ---- cid : genScenes
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] --- genAnalogInput
// [ManagerDrivers] [cube] [0] ---- cid : genAnalogInput
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] ------------------------------------------

// [ManagerDrivers] [cube] [0] --- genBasic
// [ManagerDrivers] [cube] [0] ---- 65281 : !O (!�!�$!e�!�!.�!(�!

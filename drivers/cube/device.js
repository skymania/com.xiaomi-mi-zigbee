'use strict';

const Homey = require('homey');

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
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, this.flippedAttribReport.bind(this), 1);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genAnalogInput', '65285', 1, 60, null, this.turnedAttribReport.bind(this), 2);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2, presentValue', value);
		}, 2);

		// Cube is shaked
		this.shakeCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_shaked').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.cube_shaked === state.cube_shaked);
			});

		// cube is catched
		this.catchCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_catched').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.cube_catched === state.cube_catched);
			});

		// cube is slided
		/* this.slideCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_slided').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.dropdown === state.dropdown);
			}); */

		// cube is turned
		this.turnedCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_turned').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.cube_turned === state.cube_turned);
			});

		// cube is double tapped
		this.doubletapCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_double_tapped').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.double_tapped === state.double_tapped);
			});

		// cube is flipped 90
		/* this.flippedCube90TriggerDevice = new Homey.FlowCardTriggerDevice('cube_flipped_90').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.dropdown === state.dropdown);
			}); */


		// 			+---+
		// 			| 1 |
		// 	+---+---+---+
		// 	| 5 | 6 | 2 |
		// 	+---+---+---+
		// 			| 4 |
		// 			+---+
		// 			| 3 |
		// 			+---+
		// where side 6 holds the MI logo and side 4 has the battery door.

	}

	flippedAttribReport(data) {
		this.log('data reported: ', data);
		let cubeDegreeflipped = 90;
		let cubeSideup = 0;
		let tokens = {};

		// cube shaked
		if (data === 0) {
			this.shakeCubeTriggerDevice.trigger(this, { state: 'cube_shaked' }, {})
				.then(() => this.log('triggered cube_shaked'))
				.catch(err => this.error('Error triggering cube_shaked', err));
		}

		// cube catched
		if (data === 3) {
			this.catchCubeTriggerDevice.trigger(this, { state: 'cube_catched' }, {})
				.then(() => this.log('triggered cube_catched'))
				.catch(err => this.error('Error triggering cube_catched', err));
		}

		// cube slided
		if (data >= 256 && data <= 261) {
			cubeSideup = data - 255;
		//	return this.slideCubeTriggerDevice.trigger(this, { state: 'cube_slided' }, { action: `slided with ${cubeSideup} up` })
		//		.then(() => this.log(`triggered cube_slided, action=slided with ${cubeSideup} up`))
		//		.catch(err => this.error('Error triggering cube_slided', err));
		}

		// cube double tapped
		if (data >= 512 && data <= 517) {
			cubeSideup = data - 511;
			tokens = {
				cubeSideup_number: cubeSideup,
			};
			this.log(tokens);
			this.doubletapCubeTriggerDevice.trigger(this, tokens, { double_tapped: cubeSideup.toString() })
				.then(() => this.log(`triggered cube_double_tapped, action=double tapped with ${cubeSideup} up`))
				.catch(err => this.error('Error triggering double_tapped', err));

			/* return this.doubletapCubeTriggerDevice.trigger(this, { state: 'cube_double_tapped' }, { action: `double tapped with ${cubeSideup} up` })
				.then(() => this.log(`triggered cube_double_tapped, action=double tapped with ${cubeSideup} up`))
				.catch(err => this.error('Error triggering double_tapped', err)); */
		}

		// cube flipped 90
		if (data > 64 && data < 70) {
			cubeDegreeflipped = 90;
			cubeSideup = 70 - data;
		}
		//return this.flippedCube90TriggerDevice.trigger(this, { state: `cube_flipped_${cubeDegreeflipped}` }, { action: `${cubeDegreeflipped} with ${cubeSideup} up` })
		//	.then(() => this.log(`triggered cube_flipped, action=${cubeDegreeflipped} with ${cubeSideup} up`))
		//	.catch(err => this.error('Error triggering cube_flipped', err));
	}

	turnedAttribReport(data) {
		// cube turned
		if (data === 500) {
			this.turnedCubeTriggerDevice.trigger(this, { state: 'cube_turned' }, {})
				.then(() => this.log('triggered cube_turned'))
				.catch(err => this.error('Error triggering cube_turned', err));
		}
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

// [ManagerDrivers] [cube] [0] --- genAnalogInput
// [ManagerDrivers] [cube] [0] ---- 65285 : 500
// [ManagerDrivers] [cube] [0] ---- cid : genAnalogInput
// [ManagerDrivers] [cube] [0] ---- sid : attrs
// [ManagerDrivers] [cube] [0] ---- presentValue : 12.789998054504395
// [ManagerDrivers] [cube] [0] ------------------------------------------

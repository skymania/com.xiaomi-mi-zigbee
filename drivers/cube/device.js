'use strict';

const flip90options = {
	65: {
		direction: 'left',
		side: 2,
	},
	66: {
		direction: 'right',
		side: 3,
	},
	68: {
		direction: 'right',
		side: 5,
	},
	72: {
		direction: 'left',
		side: 1,
	},
	80: {
		direction: 'right',
		side: 3,
	},
	74: {
		direction: 'left',
		side: 3,
	},
	75: {
		direction: 'recht',
		side: 4,
	},
	77: {
		direction: 'left',
		side: 6,
	},
	92: {
		direction: 'left',
		side: 5,
	},
	93: {
		direction: 'left',
		side: 6,
	},
	96: {
		direction: 'left',
		side: 1,
	},
	99: {
		direction: 'right',
		side: 4,
	},
	81: {
		direction: 'right',
		side: 2,
	},
	83: {
		direction: 'left',
		side: 4,
	},
	84: {
		direction: 'left',
		side: 5,
	},
	89: {
		direction: 'right',
		side: 2,
	},
	98: {
		direction: 'left',
		side: 3,
	},
	69: {
		direction: 'right',
		side: 6,
	},
	104: {
		direction: 'left',
		side: 1,
	},
	105: {
		direction: 'left',
		side: 2,
	},
	101: {
		direction: 'right',
		side: 6,
	},
	107: {
		direction: 'right',
		side: 4,
	},
	108: {
		direction: 'right',
		side: 5,
	},
};

const motionArray = {
	0: {
		motion: 'Shake'
	},
	1: {
		motion: 'Flip 90 degrees'
	},
	2: {
		motion: 'Flip 180 degrees'
	},
	4: {
		motion: 'Slide'
	},
	8: {
		motion: 'Double tap'
	},
	16: {
		motion: 'Rotate'
	},
	32: {
		motion: 'Catch'
	},
};

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraCubeSensor extends ZigBeeDevice {
	onMeshInit() {
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register the AttributeReportListener
		this.registerAttrReportListener('genMultistateInput', 'Status flags', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2, Status flags', value);
		}, 1);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genMultistateInput', 'Status flags', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2, Status flags', value);
		}, 1);


		// Register the AttributeReportListener
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, this.flippedAttribReport.bind(this), 1);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genAnalogInput', '65285', 1, 60, null, this.turnedAttribReport.bind(this), 2);

		// Register the AttributeReportListener
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2, presentValue', value);
		}, 2);
		// this._attrReportListeners['2_genAnalogInput'] = this._attrReportListeners['2_genAnalogInput'] || {};
		// this._attrReportListeners['2_genAnalogInput']['presentValue'] = this.rotateAttribReport.bind(this);

		// Cube is shaked
		this.shakeCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_shaked');
		this.shakeCubeTriggerDevice.register();

		// cube is catched
		this.catchCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_catched');
		this.catchCubeTriggerDevice.register();

		// cube is slided
		this.slideCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_slided');
		this.slideCubeTriggerDevice.register();

		// cube is turned
		this.turnedCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_turned');
		this.turnedCubeTriggerDevice.register();

		// cube is double tapped
		this.doubletapCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_double_tapped');
		this.doubletapCubeTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log(args.double_tapped, state.double_tapped, args.double_tapped === state.double_tapped);
				return Promise.resolve(args.double_tapped === state.double_tapped);
			});

		// cube is flipped 90
		/* this.flippedCube90TriggerDevice = new Homey.FlowCardTriggerDevice('cube_flipped_90').register()
			.registerRunListener((args, state) => {
				this.log(args, state);
				return Promise.resolve(args.dropdown === state.dropdown);
			}); */

		// cube flipped 180
		// .....


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
		// data in binary first 4 bits indicate type of motion, following group of 3 bits indicate the face of the cube
		const motionType = (data >> 6) & 0b1111; // 0 (shake), 1 (flip 90), 2 (flip 180), 4 (slide), 8 (double tap)
		const sourceFace = (data >> 3) & 0b111; // sourceFace (0-5)
		const targetFace = data & 0b111; // targetFace (0-5)
		this.log('data reported: ', data, 'motionType', motionArray[motionType].motion, 'sourceFace', sourceFace, 'targetFace', targetFace);

		if (motionType > 0) this.faceSideUp = targetFace;

		const cubeAction = {
			motion: motionArray[motionType].motion,
			sourceFace,
			targetFace: this.faceSideUp,
		};

		let cubeDegreeflipped = 90;
		let cubeSideup = 0;

		// cube shaked
		if (data === 0) {
			this.shakeCubeTriggerDevice.trigger(this, null, null)
				.then(() => this.log('triggered cube_shaked'))
				.catch(err => this.error('Error triggering cube_shaked', err));
		}

		// cube catched
		if (data === 3) {
			this.catchCubeTriggerDevice.trigger(this, null, null)
				.then(() => this.log('triggered cube_catched'))
				.catch(err => this.error('Error triggering cube_catched', err));
		}

		// cube slided
		if (data >= 256 && data <= 261) {
			cubeSideup = data - 255;
			this.slideCubeTriggerDevice.trigger(this, null, null)
				.then(() => this.log('triggered cube_slided'))
				.catch(err => this.error('Error triggering cube_slided', err));
		}

		// cube double tapped
		if (data >= 512 && data <= 517) {
			cubeSideup = data - 511;
			this.doubletapCubeTriggerDevice.trigger(this, {
					cubeSideup_number: cubeSideup
				}, {
					cube_double_tapped: parseInt(cubeSideup, 0).toString()
				})
				.then(() => this.log(`triggered cube_double_tapped, action=double tapped with ${cubeSideup} up`))
				.catch(err => this.error('Error triggering double_tapped', err));
		}

		// cube flipped 90 not working yet: not al values found
		// const index = flip90options[data];
		if (flip90options[data] !== void 0) {
			// this.log('indexwaarde: ', index);
			cubeDegreeflipped = flip90options[data].direction;
			cubeSideup = flip90options[data].side;
			this.log(`Cube flipped 90 degrees ${cubeDegreeflipped} with ${cubeSideup} on Top`);
		}


		// cube flipped 180
		if (data >= 128 && data <= 133) {
			cubeDegreeflipped = 180;
			cubeSideup = 133 - data;

		}

	}

	turnedAttribReport(data) {
		this.log('turned', data);
		// cube turned
		if (data === 500) {
			this.turnedCubeTriggerDevice.trigger(this, null, null)
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

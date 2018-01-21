'use strict';

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

const motionArray = {
	0: {
		motion: 'Shake'
	},
	1: {
		motion: 'Flip90'
	},
	2: {
		motion: 'Flip180'
	},
	4: {
		motion: 'Slide'
	},
	8: {
		motion: 'DoubleTap'
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
	async onMeshInit() {
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// Register the AttributeReportListener - Shake, Catch, Flip 90, Flip 180, Slide and Double tap motionType
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, this.flippedAttribReport.bind(this), 1);

		// Register the AttributeReportListener - Flip motionType
		this.registerAttrReportListener('genAnalogInput', '65285', 1, 60, null, this.turnedAttribReport.bind(this), 2);

		// Register the AttributeReportListener - Rotation angle
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, value => {
			this.log('genAnalogInput cluster 2, presentValue', value);
		}, 2);

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null, value => {
			this.log('genBasic, 65281', value, typeof (value));
		}, 0);

		// Cube is shaked
		this.cubeShakeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_shake');
		this.cubeShakeTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeShake (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// Cube is flipped 90 degrees
		this.cubeFlip90TriggerDevice = new Homey.FlowCardTriggerDevice('cube_flip90');
		this.cubeFlip90TriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeFlip90 (args, state):', args, state);
				return Promise.resolve(
					(args.sourceFace === '0' && args.targetFace === state.targetFace) || // any side to target side
					(args.sourceFace === state.sourceFace && args.targetFace === '0') || // source side to any side
					(args.sourceFace === state.sourceFace && args.targetFace === state.targetFace) || // source side to target side
					(args.sourceFace === '0' && args.targetFace === '0')); // any side to any side
			});

		// Cube is flipped 180 degrees
		this.cubeFlip180TriggerDevice = new Homey.FlowCardTriggerDevice('cube_flip180');
		this.cubeFlip180TriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeFlip180 (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is slided
		this.cubeSlideTriggerDevice = new Homey.FlowCardTriggerDevice('cube_slide');
		this.cubeSlideTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeSlide (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is double tapped
		this.cubeDoubleTapTriggerDevice = new Homey.FlowCardTriggerDevice('cube_doubleTap');
		this.cubeDoubleTapTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeDoubleTap (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is turned
		this.cubeTurnTriggerDevice = new Homey.FlowCardTriggerDevice('cube_turn');
		this.cubeTurnTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				this.log('cubeDoubleTap (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is motion report
		this.cubeMotionTriggerDevice = new Homey.FlowCardTriggerDevice('cube_motion');
		this.cubeMotionTriggerDevice.register();
		/*
		// cube is catched
		this.catchCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_catched');
		this.catchCubeTriggerDevice.register();
		*/
	}

	flippedAttribReport(data) {
		// data in binary first 4 bits indicate type of motion, following group of 3 bits indicate the face of the cube
		const motionType = (data >> 6) & 0b1111; // 0 (shake), 1 (flip 90), 2 (flip 180), 4 (slide), 8 (double tap)
		const sourceFace = ((data >> 3) & 0b111) + 1; // sourceFace (1-6)
		// in case of Shake event retrieve last known cube_state_face
		const targetFace = motionArray[motionType].motion !== 'Shake' ? (data & 0b111) + 1 : (this.getCapabilityValue('cube_state_face') || 6); // targetFace (1-6)

		this.log('data reported: ', data, 'motionType', motionArray[motionType].motion, 'sourceFace', sourceFace, 'targetFace', targetFace);

		const cubeAction = {
			motion: motionArray[motionType].motion,
			sourceFace: sourceFace.toString(),
			targetFace: targetFace.toString(),
		};

		this.setCapabilityValue('cube_state_motion', cubeAction.motion);
		this.setCapabilityValue('cube_state_face', cubeAction.targetFace);

		// cube shaked
		if (cubeAction.motion === 'Shake') {
			this.cubeShakeTriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_shaked, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_shaked', err));
		}
		// cube Flip90
		if (cubeAction.motion === 'Flip90') {
			this.cubeFlip90TriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_flip90, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_flip90', err));
		}

		// cube Flip180
		if (cubeAction.motion === 'Flip180') {
			this.cubeFlip180TriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_flip180, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_flip180', err));
		}

		// cube slided
		if (cubeAction.motion === 'Slide') {
			this.cubeSlideTriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_slided, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_slided', err));
		}

		// cube double tapped
		if (cubeAction.motion === 'DoubleTap') {
			this.cubeDoubleTapTriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_double_tapped, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_double_tapped', err));
		}
		/*
		// cube double tapped
		if (cubeAction.motion === 'Catch') {
			this.cubeCatchTriggerDevice.trigger(this, null, null)
				.then(() => this.log('triggered cube_catched))
				.catch(err => this.error('Error triggering cube_catched', err));
		}
		*/
		this.cubeMotionTriggerDevice.trigger(this, {
				motion: cubeAction.motion,
				sourceFace: sourceFace,
				targetFace: targetFace,
			})
			.then(() => this.log('triggered cube_motion'))
			.catch(err => this.error('Error triggering cube_double_tapped', err));

	}

	turnedAttribReport(data) {
		this.log('turned', data);
		const cubeAction = {
			motion: 'Rotate',
			sourceFace: null,
			targetFace: (this.getCapabilityValue('cube_state_face') || '6'),
		};

		this.setCapabilityValue('cube_state_motion', cubeAction.motion);

		// cube turned
		if (cubeAction.motion === 'Rotate') {
			this.cubeTurnTriggerDevice.trigger(this, null, cubeAction)
				.then(() => this.log('triggered cube_turned, cubeAction:', cubeAction))
				.catch(err => this.error('Error triggering cube_turned', err));
		}

		this.cubeMotionTriggerDevice.trigger(this, {
				motion: cubeAction.motion,
				sourceFace: 0,
				targetFace: parseInt(cubeAction.targetFace),
			})
			.then(() => this.log('triggered cube_motion'))
			.catch(err => this.error('Error triggering cube_double_tapped', err));
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

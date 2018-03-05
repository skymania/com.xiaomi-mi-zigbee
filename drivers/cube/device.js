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
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		// Register the AttributeReportListener - Shake, Catch, Flip 90, Flip 180, Slide and Double tap motionType
		this.registerAttrReportListener('genMultistateInput', 'presentValue', 1, 60, null, this.flippedAttribReport.bind(this), 1)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genMultistateInput - Motion');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genMultistateInput - Motion', err);
			});

		// Register the AttributeReportListener - Rotation angle
		this.registerAttrReportListener('genAnalogInput', 'presentValue', 1, 60, null, this.rotatedAttribReport.bind(this), 2)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genAnalogInput - Rotate');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genAnalogInput - Rotate', err);
			});

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null, this.onLifelineReport.bind(this), 0)
			.then(() => {
				// Registering attr reporting succeeded
				this.log('registered attr report listener - genBasic - Lifeline');
			})
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

		// Cube is shaked
		this.cubeShakeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_Shake');
		this.cubeShakeTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeShake (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// Cube is flipped 90 degrees
		this.cubeFlip90TriggerDevice = new Homey.FlowCardTriggerDevice('cube_Flip90');
		this.cubeFlip90TriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeFlip90 (args, state):', args, state);
				return Promise.resolve(
					(args.sourceFace === '0' && args.targetFace === state.targetFace) || // any side to target side
					(args.sourceFace === state.sourceFace && args.targetFace === '0') || // source side to any side
					(args.sourceFace === state.sourceFace && args.targetFace === state.targetFace) || // source side to target side
					(args.sourceFace === '0' && args.targetFace === '0')); // any side to any side
			});

		// Cube is flipped 180 degrees
		this.cubeFlip180TriggerDevice = new Homey.FlowCardTriggerDevice('cube_Flip180');
		this.cubeFlip180TriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeFlip180 (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is slided
		this.cubeSlideTriggerDevice = new Homey.FlowCardTriggerDevice('cube_Slide');
		this.cubeSlideTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeSlide (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is double tapped
		this.cubeDoubleTapTriggerDevice = new Homey.FlowCardTriggerDevice('cube_DoubleTap');
		this.cubeDoubleTapTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeDoubleTap (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube is turned
		this.cubeRotateTriggerDevice = new Homey.FlowCardTriggerDevice('cube_Rotate');
		this.cubeRotateTriggerDevice
			.register()
			.registerRunListener((args, state) => {
				// this.log('cubeRotate (args, state):', args, state);
				return Promise.resolve(args.targetFace === state.targetFace || args.targetFace === '0');
			});

		// cube motion report
		this.cubeMotionTriggerDevice = new Homey.FlowCardTriggerDevice('cube_Motion');
		this.cubeMotionTriggerDevice.register();

		/*
		// cube is catched
		this.catchCubeTriggerDevice = new Homey.FlowCardTriggerDevice('cube_catched');
		this.catchCubeTriggerDevice.register();
		*/
	}
	onLifelineReport(value) {
		this.log('lifeline report', new Buffer(value, 'ascii'));
		/*
		const parsedData = parseData(new Buffer(value, 'ascii'));
		// this.log('parsedData', parsedData);

		// battery reportParser
		const parsedVolts = parsedData['1'] / 100.0;
		var minVolts = 2.5;
		var maxVolts = 3.0;

		let parsedBatPct = Math.min(100, Math.round((parsedVolts - minVolts) / (maxVolts - minVolts) * 100));
		this.log('lifeline - battery', parsedBatPct);
		// Set Battery capability
		this.setCapabilityValue('measure_battery', parsedBatPct);
		// Set Battery alarm if battery percentatge is below 20%
		this.setCapabilityValue('alarm_battery', parsedBatPct < (this.getSetting('battery_threshold') || 20));

		function parseData(rawData) {
			const data = {};
			let index = 0;
			while (index < rawData.length) {
				const type = rawData.readUInt8(index + 1);
				const byteLength = (type & 0x7) + 1;
				const isSigned = Boolean((type >> 3) & 1);
				data[rawData.readUInt8(index)] = rawData[isSigned ? 'readIntLE' : 'readUIntLE'](index + 2, byteLength);
				index += byteLength + 2;
			}
			return data;
		}
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

		// set corresponding capability values
		this.setCapabilityValue('cube_state_motion', cubeAction.motion);
		this.setCapabilityValue('cube_state_face', cubeAction.targetFace);

		// Trigger the corresponding triggerdevice matching to the motion
		if (cubeAction.motion) {
			this[`cube${cubeAction.motion}TriggerDevice`].trigger(this, null, cubeAction)
				.then(() => this.log(`Triggered cube${cubeAction.motion}TriggerDevice, cubeAction:`, cubeAction))
				.catch(err => this.error(`Error triggering cube${cubeAction.motion}TriggerDevice`, err));
		}

		// Trigger generic motion token trigger card
		this.cubeMotionTriggerDevice.trigger(this, {
				motion: cubeAction.motion,
				sourceFace: sourceFace,
				targetFace: targetFace,
			})
			.then(() => this.log('Triggered cubeMotionTriggerDevice'))
			.catch(err => this.error('Error triggering cubeMotionTriggerDevice', err));

	}

	turnedAttribReport(data) {
		this.log('turned', data);
		const cubeAction = {
			motion: 'Rotate',
			sourceFace: null,
			targetFace: (this.getCapabilityValue('cube_state_face') || '6'),
		};

		// set corresponding capability values
		this.setCapabilityValue('cube_state_motion', cubeAction.motion);

		// Trigger the corresponding triggerdevice matching to the motion
		if (cubeAction.motion) {
			this[`cube${cubeAction.motion}TriggerDevice`].trigger(this, null, cubeAction)
				.then(() => this.log(`Triggered cube${cubeAction.motion}TriggerDevice, cubeAction:`, cubeAction))
				.catch(err => this.error(`Error triggering cube${cubeAction.motion}TriggerDevice`, err));
		}

		// Trigger generic motion token trigger card
		this.cubeMotionTriggerDevice.trigger(this, {
				motion: cubeAction.motion,
				sourceFace: 0,
				targetFace: parseInt(cubeAction.targetFace),
			})
			.then(() => this.log('Triggered cubeMotionTriggerDevice'))
			.catch(err => this.error('Error triggering cubeMotionTriggerDevice', err));
	}

	rotatedAttribReport(data) {
		this.log('rotated', data);

		const cubeAction = {
			motion: 'Rotate',
			sourceFace: null,
			targetFace: (this.getCapabilityValue('cube_state_face') || '6'),
			rotationAngle: Math.round(data * 100) / 100,
			relativeRotationAngle: Math.round((data > 0 ? Math.min((data / (this.getSetting('cube_relative_angles') || 180)), 1) : Math.max((data / (this.getSetting('cube_relative_angles') || 180)), -1)) * 100) / 100,
		};

		// set corresponding capability values
		this.setCapabilityValue('cube_state_motion', cubeAction.motion);
		this.setCapabilityValue('cube_measure_rotation', cubeAction.rotationAngle);

		// Trigger the corresponding triggerdevice matching to the motion
		if (cubeAction.motion) {
			this[`cube${cubeAction.motion}TriggerDevice`].trigger(this, cubeAction, cubeAction)
				.then(() => this.log(`Triggered cube${cubeAction.motion}TriggerDevice, cubeAction:`, cubeAction))
				.catch(err => this.error(`Error triggering cube${cubeAction.motion}TriggerDevice`, err));
		}

		// Trigger generic motion token trigger card
		this.cubeMotionTriggerDevice.trigger(this, {
				motion: cubeAction.motion,
				sourceFace: 0,
				targetFace: parseInt(cubeAction.targetFace),
			})
			.then(() => this.log('Triggered cubeMotionTriggerDevice'))
			.catch(err => this.error('Error triggering cubeMotionTriggerDevice', err));

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

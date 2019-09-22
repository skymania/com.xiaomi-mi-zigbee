'use strict';

const commandMap = {
	up: {
		command: 'upOpen'
	},
	idle: {
		command: 'stop'
	},
	down: {
		command: 'downClose'
	},
};

// up: = upOpen = genAnalogOutput-presentValue / closuresWindowCovering-currentPositionLiftPercentage 100
// idle: = stop = genAnalogOutput-presentValue / closuresWindowCovering-currentPositionLiftPercentage ...
// down: = downClose = genAnalogOutput-presentValue / closuresWindowCovering-currentPositionLiftPercentage 0

const Homey = require('homey');

const util = require('./../../lib/util');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class AqaraCurtain extends ZigBeeDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		//Link util parseData method to this devices instance
		this.parseData = util.parseData.bind(this)

		this.registerCapability('onoff', 'genOnOff');

		if (this.hasCapability('windowcoverings_state')) {
			this.registerCapability('windowcoverings_state', 'closuresWindowCovering', {
				set: value => commandMap[value].command,
				setParser: () => ({}),
				endpoint: 0,
			});
		}

		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'closuresWindowCovering', {
				set: 'goToLiftPercentage',
				setParser(value) {
					return {
						percentageliftvalue: value * 100
					};
				},
				get: 'currentPositionLiftPercentage',
				report: 'currentPositionLiftPercentage',
				reportParser(value) {
					return value / 100;
				},
				endpoint: 0,
				getOpts: {
					getOnStart: true,
				},
			});

			// Register the AttributeReportListener - Shake, Catch, Flip 90, Flip 180, Slide and Double tap motionType
			this.registerAttrReportListener('genAnalogOutput', 'presentValue', 1, 3600, 1, this.onCurtainPositionAttrReport.bind(this), 0)
				.catch(err => {
					// Registering attr reporting failed
					this.error('failed to register attr report listener - genAnalogOutput - presentValue', err);
				});
		}

		// Register the AttributeReportListener - Lifeline
		this.registerAttrReportListener('genBasic', '65281', 1, 60, null,
				this.onLifelineReport.bind(this), 0)
			.catch(err => {
				// Registering attr reporting failed
				this.error('failed to register attr report listener - genBasic - Lifeline', err);
			});

		this.node.endpoints[0].clusters.genBasic.write(0x1025, '00080001000000')
			.then(res => {
				this._debug('write Open / Close manually: ', res);
			})
			.catch(err => {
				this.error('write Open / Close manually: ', err);
			});
	}

	onCurtainPositionAttrReport(data) {
		this.log('genAnalogOutput - presentValue (curtain position):', data);
		clearTimeout(this.curtainTernaryTimeout);
		this.setCapabilityValue('dim', data / 100);

		// update onOff capability
		if (this.getCapabilityValue('onoff') !== data > 0) {
			this.setCapabilityValue('onoff', data > 0);
		}
		// update Ternary buttons
		this.curtainTernaryTimeout = setTimeout(() => {
			this.setCapabilityValue('windowcoverings_state', 'idle');
		}, 3000);
	}

	onLifelineReport(value) {
		this._debug('lifeline report', new Buffer(value, 'ascii'));
		const parsedData = this.parseData(new Buffer(value, 'ascii'));
		this._debug('parsedData', parsedData);

		// curtain postition (dim) reportParser (ID 100)
		if (parsedData.hasOwnProperty('100')) {
			const parsedDim = (parsedData['100'] / 100);
			this.log('lifeline - curtain position', parsedDim);
			this.setCapabilityValue('dim', parsedDim);
		}
	}
}

module.exports = AqaraCurtain;

/*
Product type no: ZNCLDJ11LM)
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ------------------------------------------
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] Node: 9cff46eb-2a17-4b37-942a-f3550817e42f
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] - Battery: false
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] - Endpoints: 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] -- Clusters:
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- zapp
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genBasic
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- 65281 : (!
                                                                        d !	'	!
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genBasic
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- zclVersion : 1
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- appVersion : 9
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- stackVersion : 2
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- hwVersion : 17
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- manufacturerName : LUMI
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- modelId : lumi.curtain
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- dateCode : 04-13-2017
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- powerSource : 1
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genPowerCfg
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genPowerCfg
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- mainsVoltage : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- mainsAlarmMask : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genIdentify
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genIdentify
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- identifyTime : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genGroups
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genGroups
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- nameSupport : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genScenes
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genScenes
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- count : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- currentScene : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- currentGroup : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sceneValid : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- nameSupport : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- lastCfgBy : 0xffffffffffffffff
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genOnOff
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genOnOff
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- onOff : 1
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genTime
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genTime
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genAnalogOutput
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- 61440 : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genAnalogOutput
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- maxPresentValue : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- minPresentValue : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- outOfService : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- presentValue : 100
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- statusFlags : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genMultistateOutput
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genMultistateOutput
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- numberOfStates : 6
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- outOfService : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- presentValue : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- statusFlags : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- genOta
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : genOta
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- closuresWindowCovering
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- 19 : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : closuresWindowCovering
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- windowCoveringType : 4
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- configStatus : 123
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- currentPositionLiftPercentage : 255
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- installedOpenLimitLiftCm : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- installedClosedLimitLiftCm : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- installedOpenLimitTiltDdegree : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- windowCoveringMode : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] --- msOccupancySensing
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- cid : msOccupancySensing
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- sid : attrs
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- occupancy : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ---- occupancySensorType : 0
2018-05-21 11:25:46 [log] [ManagerDrivers] [curtain] [0] ------------------------------------------

2018-03-04 16:56:10 [log] [ManagerDrivers] [curtain] [0] lifeline report <Buffer 03 28 1e 05 21 06 00 64 20 fd 08 21 09 11 07 27 00 00 00 00 00 00 00 00 09 21 00 01>

Changing settings of Curtain controller
Cluster: 	genBasic (0x0000)
Attribute: Unknown (0x0401)
Values
	Manual open/close	Direction	Operation			HEX stream
A	Enabled						Positive	Clear Stroke	0001 0000 0000 00
B	Disabled					Positive	Clear Stroke	0001 0000 0001 00
C	Enabled						Reverse		Clear Stroke	0001 0001 0000 00
D	Disabled					Reverse		Clear Stroke	0001 0001 0001 00
E	Enabled						Positive	Normal				0008 0000 0000 00
F	Disabled					Positive	Normal				0008 0000 0001 00
G	Enabled						Reverse		Normal				0008 0001 0000 00
H	Disabled					Reverse		Normal				0008 0001 0001 00

*/
